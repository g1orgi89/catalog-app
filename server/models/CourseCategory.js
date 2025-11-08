const mongoose = require('mongoose');

/**
 * @typedef {import('../types/catalog').CourseCategory} CourseCategory
 */

const courseCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: [true, 'Category slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    trim: true,
    maxlength: [50, 'Icon cannot exceed 50 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы
courseCategorySchema.index({ slug: 1 });
courseCategorySchema.index({ isActive: 1, sortOrder: 1 });

// Виртуальное поле для подсчёта курсов в категории
courseCategorySchema.virtual('coursesCount', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'category',
  count: true
});

module.exports = mongoose.model('CourseCategory', courseCategorySchema);