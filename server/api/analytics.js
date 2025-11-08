const express = require('express');
const router = express.Router();
const CourseAnalytics = require('../models/CourseAnalytics');
const Course = require('../models/Course');

/**
 * @typedef {import('../types/catalog').CourseAnalytics} CourseAnalytics
 * @typedef {import('../types/catalog').TrackEventInput} TrackEventInput
 * @typedef {import('../types/catalog').ApiResponse} ApiResponse
 */

/**
 * POST /api/analytics/track
 * Трекинг события (app_open, course_view, course_click)
 * @param {TrackEventInput} req.body - данные события
 * @returns {ApiResponse} Результат записи
 */
router.post('/track', async (req, res) => {
  try {
    const { eventType, user, courseSlug, utm, device } = req.body;

    // Валидация обязательных полей
    if (!eventType || !user || !device) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: eventType, user, device'
      });
    }

    // Валидация типа события
    const validEventTypes = ['app_open', 'course_view', 'course_click'];
    if (!validEventTypes.includes(eventType)) {
      return res.status(400).json({
        success: false,
        error: `Invalid event type. Must be one of: ${validEventTypes.join(', ')}`
      });
    }

    // Для событий связанных с курсом - найти ID курса по slug
    let courseId = null;
    if (courseSlug && (eventType === 'course_view' || eventType === 'course_click')) {
      const course = await Course.findOne({ slug: courseSlug });
      if (course) {
        courseId = course._id;
      }
    }

    // Создать запись аналитики
    const analytics = new CourseAnalytics({
      eventType,
      user,
      courseId,
      courseSlug,
      utm,
      device,
      timestamp: new Date()
    });

    await analytics.save();

    res.status(201).json({
      success: true,
      data: {
        message: 'Event tracked successfully',
        eventId: analytics._id
      }
    });

  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/stats
 * Получить статистику (admin only - требуется middleware auth)
 * @param {Object} req.query - параметры фильтрации
 * @param {string} req.query.startDate - начальная дата (ISO format)
 * @param {string} req.query.endDate - конечная дата (ISO format)
 * @param {string} req.query.eventType - тип события для фильтрации
 * @param {string} req.query.courseSlug - slug курса для фильтрации
 * @returns {ApiResponse} Статистика
 */
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate, eventType, courseSlug } = req.query;

    // Построение фильтра
    const filter = {};

    // Фильтр по дате
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
      }
    }

    // Фильтр по типу события
    if (eventType) {
      filter.eventType = eventType;
    }

    // Фильтр по курсу
    if (courseSlug) {
      filter.courseSlug = courseSlug;
    }

    // Агрегация статистики
    const stats = await CourseAnalytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$user.telegramId' }
        }
      },
      {
        $project: {
          _id: 0,
          eventType: '$_id',
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      }
    ]);

    // Статистика по курсам (топ просмотренных)
    const topCourses = await CourseAnalytics.aggregate([
      {
        $match: {
          ...filter,
          eventType: { $in: ['course_view', 'course_click'] },
          courseId: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$courseId',
          courseSlug: { $first: '$courseSlug' },
          views: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'course_view'] }, 1, 0]
            }
          },
          clicks: {
            $sum: {
              $cond: [{ $eq: ['$eventType', 'course_click'] }, 1, 0]
            }
          }
        }
      },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Статистика по платформам
    const platformStats = await CourseAnalytics.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$device.platform',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          platform: '$_id',
          count: 1
        }
      }
    ]);

    // Статистика по UTM источникам
    const utmStats = await CourseAnalytics.aggregate([
      {
        $match: {
          ...filter,
          'utm.source': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: {
            source: '$utm.source',
            campaign: '$utm.campaign'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          source: '$_id.source',
          campaign: '$_id.campaign',
          count: 1
        }
      }
    ]);

    // Общее количество событий
    const totalEvents = await CourseAnalytics.countDocuments(filter);

    res.json({
      success: true,
      data: {
        totalEvents,
        eventStats: stats,
        topCourses,
        platformStats,
        utmStats,
        period: {
          startDate: startDate || null,
          endDate: endDate || null
        }
      }
    });

  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/analytics/events
 * Получить список событий с пагинацией (admin only - требуется middleware auth)
 * @param {Object} req.query - параметры запроса
 * @returns {ApiResponse} Список событий
 */
router.get('/events', async (req, res) => {
  try {
    const {
      limit = 50,
      page = 1,
      eventType,
      courseSlug,
      startDate,
      endDate
    } = req.query;

    // Построение фильтра
    const filter = {};

    if (eventType) {
      filter.eventType = eventType;
    }

    if (courseSlug) {
      filter.courseSlug = courseSlug;
    }

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) {
        filter.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.timestamp.$lte = new Date(endDate);
      }
    }

    // Пагинация
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Получить события
    const events = await CourseAnalytics
      .find(filter)
      .populate('courseId', 'title slug')
      .sort({ timestamp: -1 })
      .limit(limitNum)
      .skip(skip)
      .lean();

    // Подсчёт общего количества
    const total = await CourseAnalytics.countDocuments(filter);

    res.json({
      success: true,
      data: events,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching analytics events:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;