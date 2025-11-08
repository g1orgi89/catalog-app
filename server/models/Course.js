const mongoose = require('mongoose');

/**
 * @typedef {import('../types/catalog').Course} Course
 */

const courseImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  cloudinaryId: {
    type: String,
    trim: true
  },
  alt: {
    type: String,
    required: [true, 'Image alt text is required'],
    trim: true
  }
}, { _id: false });

const coursePriceSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Price amount is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    required: [true, 'Currency is required'],
    default: 'RUB',
    enum: ['RUB', 'USD', 'EUR'],
    uppercase: true
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  isDiscounted: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const courseModuleSchema = new mongoose.Schema({
  moduleNumber: {
    type: Number,
    required: [true, 'Module number is required'],
    min: 1
  },
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true
  },
  lessons: {
    type: [String],
    default: []
  }
}, { _id: false });

const purchaseLinksSchema = new mongoose.Schema({
  telegram: {
    type: String,
    trim: true
  },
  whatsapp: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Course slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers and hyphens']
  },
  description: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  fullDescription: {
    type: String,
    required: [true, 'Full description is required'],
    trim: true
  },
  coverImage: {
    type: courseImageSchema,
    required: [true, 'Cover image is required']
  },
  price: {
    type: coursePriceSchema,
    required: [true, 'Price is required']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CourseCategory',
    required: [true, 'Category is required']
  },
  tags: {
    type: [String],
    default: []
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  lessonsCount: {
    type: Number,
    required: [true, 'Lessons count is required'],
    min: [1, 'Must have at least 1 lesson']
  },
  includes: {
    type: [String],
    default: []
  },
  curriculum: {
    type: [courseModuleSchema],
    default: []
  },
  purchaseLinks: {
    type: purchaseLinksSchema,
    required: [true, 'At least one purchase link is required']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  clicks: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Индексы для оптимизации запросов
courseSchema.index({ slug: 1 });
courseSchema.index({ category: 1 });
courseSchema.index({ status: 1, isActive: 1 });
courseSchema.index({ sortOrder: 1 });

// Виртуальное поле для расчёта процента скидки
courseSchema.virtual('discountPercent').get(function() {
  if (this.price.isDiscounted && this.price.originalPrice && this.price.amount) {
    const discount = ((this.price.originalPrice - this.price.amount) / this.price.originalPrice) * 100;
    return Math.round(discount);
  }
  return 0;
});

// Метод для инкремента просмотров
courseSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

// Метод для инкремента кликов
courseSchema.methods.incrementClicks = async function() {
  this.clicks += 1;
  return this.save();
};

module.exports = mongoose.model('Course', courseSchema);