const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

/**
 * @typedef {import('../types/catalog').Course} Course
 * @typedef {import('../types/catalog').GetCoursesQuery} GetCoursesQuery
 * @typedef {import('../types/catalog').ApiResponse} ApiResponse
 */

/**
 * GET /api/courses
 * Получить список всех курсов с фильтрацией и пагинацией
 * @param {GetCoursesQuery} req.query - параметры запроса
 * @returns {ApiResponse} Список курсов с пагинацией
 */
router.get('/', async (req, res) => {
  try {
    const {
      category,
      limit = 10,
      page = 1,
      sort = 'sortOrder'
    } = req.query;

    // Построение фильтра
    const filter = {
      status: 'published',
      isActive: true
    };

    if (category) {
      // Поиск категории по slug
      const CourseCategory = require('../models/CourseCategory');
      const categoryDoc = await CourseCategory.findOne({ slug: category });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      }
    }

    // Пагинация
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    const skip = (pageNum - 1) * limitNum;

    // Запрос курсов
    const courses = await Course
      .find(filter)
      .populate('category', 'name slug icon')
      .sort(sort)
      .limit(limitNum)
      .skip(skip)
      .lean();

    // Подсчёт общего количества
    const total = await Course.countDocuments(filter);

    res.json({
      success: true,
      data: courses,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/courses/:slug
 * Получить детальную информацию о курсе по slug
 * @param {string} req.params.slug - slug курса
 * @returns {ApiResponse} Данные курса
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course
      .findOne({ slug, status: 'published', isActive: true })
      .populate('category', 'name slug icon description');

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Инкремент счётчика просмотров
    await course.incrementViews();

    res.json({
      success: true,
      data: course
    });

  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/courses
 * Создать новый курс (admin only - требуется middleware auth)
 * @param {CreateCourseInput} req.body - данные курса
 * @returns {ApiResponse} Созданный курс
 */
router.post('/', async (req, res) => {
  try {
    const courseData = req.body;

    // Проверка уникальности slug
    const existingCourse = await Course.findOne({ slug: courseData.slug });
    if (existingCourse) {
      return res.status(400).json({
        success: false,
        error: 'Course with this slug already exists'
      });
    }

    const course = new Course(courseData);
    await course.save();

    await course.populate('category', 'name slug icon');

    res.status(201).json({
      success: true,
      data: course
    });

  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/courses/:id
 * Обновить курс (admin only - требуется middleware auth)
 * @param {string} req.params.id - ID курса
 * @param {Partial<CreateCourseInput>} req.body - данные для обновления
 * @returns {ApiResponse} Обновлённый курс
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Проверка уникальности slug если он меняется
    if (updateData.slug) {
      const existingCourse = await Course.findOne({
        slug: updateData.slug,
        _id: { $ne: id }
      });
      if (existingCourse) {
        return res.status(400).json({
          success: false,
          error: 'Course with this slug already exists'
        });
      }
    }

    const course = await Course
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true
      })
      .populate('category', 'name slug icon');

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });

  } catch (error) {
    console.error('Error updating course:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/courses/:id
 * Удалить курс (soft delete - меняет status на archived)
 * (admin only - требуется middleware auth)
 * @param {string} req.params.id - ID курса
 * @returns {ApiResponse} Результат удаления
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndUpdate(
      id,
      { status: 'archived', isActive: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: {
        message: 'Course archived successfully',
        course
      }
    });

  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/courses/:slug/click
 * Инкремент счётчика кликов на кнопку "Купить"
 * @param {string} req.params.slug - slug курса
 * @returns {ApiResponse} Результат операции
 */
router.post('/:slug/click', async (req, res) => {
  try {
    const { slug } = req.params;

    const course = await Course.findOne({ slug });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    await course.incrementClicks();

    res.json({
      success: true,
      data: {
        message: 'Click tracked successfully'
      }
    });

  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;