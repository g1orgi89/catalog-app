const mongoose = require('mongoose');

/**
 * @typedef {import('../types/catalog').CourseAnalytics} CourseAnalytics
 */

const analyticsUserSchema = new mongoose.Schema({
  telegramId: {
    type: Number,
    required: [true, 'Telegram ID is required']
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    trim: true
  },
  languageCode: {
    type: String,
    trim: true
  }
}, { _id: false });

const analyticsUTMSchema = new mongoose.Schema({
  source: {
    type: String,
    trim: true
  },
  medium: {
    type: String,
    trim: true
  },
  campaign: {
    type: String,
    trim: true
  },
  term: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    trim: true
  }
}, { _id: false });

const analyticsDeviceSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    enum: ['ios', 'android', 'web'],
    lowercase: true
  },
  version: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, { _id: false });

const courseAnalyticsSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['app_open', 'course_view', 'course_click'],
    lowercase: true
  },
  user: {
    type: analyticsUserSchema,
    required: [true, 'User data is required']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  courseSlug: {
    type: String,
    trim: true
  },
  utm: {
    type: analyticsUTMSchema
  },
  device: {
    type: analyticsDeviceSchema,
    required: [true, 'Device data is required']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

// Индексы для оптимизации аналитики
courseAnalyticsSchema.index({ eventType: 1, timestamp: -1 });
courseAnalyticsSchema.index({ 'user.telegramId': 1 });
courseAnalyticsSchema.index({ courseId: 1 });
courseAnalyticsSchema.index({ courseSlug: 1 });
courseAnalyticsSchema.index({ timestamp: -1 });
courseAnalyticsSchema.index({ 'utm.source': 1, 'utm.campaign': 1 });

// Составной индекс для частых запросов
courseAnalyticsSchema.index({ eventType: 1, courseId: 1, timestamp: -1 });

module.exports = mongoose.model('CourseAnalytics', courseAnalyticsSchema);