const express = require('express');
const router = express.Router();
const CourseCategory = require('../models/CourseCategory');
const Course = require('../models/Course');

/**
 * @typedef {import('../types/catalog').CourseCategory} CourseCategory
 * @typedef {import('../types/catalog').ApiResponse} ApiResponse
 */

/**
 * GET /api/categories
 * Получить список всех активных категорий с количеством курсов
 * @returns {ApiResponse} Список категорий
 */
router.get('/', async (req, res) => {
  try {
    const categories = await CourseCategory
      .find({ isActive: true })
      .sort('sortOrder')
      .lean();

    // Добавить количество курсов для каждой категории
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Course.countDocuments({
          category: category._id,
          status: 'published',
          isActive: true
        });

        return {
          ...category,
          coursesCount: count
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCount
    });

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/categories/:slug
 * Получить категорию по slug с курсами
 * @param {string} req.params.slug - slug категории
 * @returns {ApiResponse} Данные категории с курсами
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const category = await CourseCategory
      .findOne({ slug, isActive: true })
      .lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    // Получить курсы категории
    const courses = await Course
      .find({
        category: category._id,
        status: 'published',
        isActive: true
      })
      .sort('sortOrder')
      .lean();

    res.json({
      success: true,
      data: {
        ...category,
        courses
      }
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/categories
 * Создать новую категорию (admin only - требуется middleware auth)
 * @param {Object} req.body - данные категории
 * @returns {ApiResponse} Созданная категория
 */
router.post('/', async (req, res) => {
  try {
    const categoryData = req.body;

    // Проверка уникальности slug
    const existingCategory = await CourseCategory.findOne({ slug: categoryData.slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        error: 'Category with this slug already exists'
      });
    }

    const category = new CourseCategory(categoryData);
    await category.save();

    res.status(201).json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error('Error creating category:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/categories/:id
 * Обновить категорию (admin only - требуется middleware auth)
 * @param {string} req.params.id - ID категории
 * @param {Object} req.body - данные для обновления
 * @returns {ApiResponse} Обновлённая категория
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Проверка уникальности slug если он меняется
    if (updateData.slug) {
      const existingCategory = await CourseCategory.findOne({
        slug: updateData.slug,
        _id: { $ne: id }
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          error: 'Category with this slug already exists'
        });
      }
    }

    const category = await CourseCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: category
    });

  } catch (error) {
    console.error('Error updating category:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/categories/:id
 * Деактивировать категорию (admin only - требуется middleware auth)
 * @param {string} req.params.id - ID категории
 * @returns {ApiResponse} Результат операции
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Проверить есть ли курсы в категории
    const coursesCount = await Course.countDocuments({
      category: id,
      status: 'published',
      isActive: true
    });

    if (coursesCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete category with ${coursesCount} active courses`
      });
    }

    const category = await CourseCategory.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: {
        message: 'Category deactivated successfully',
        category
      }
    });

  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;