/**
 * Course Page - Detailed course information
 */

import api from '../api.js';
import telegram from '../telegram.js';
import { formatPrice, escapeHtml } from '../utils.js';

export async function renderCoursePage({ params }) {
  const { slug } = params;

  // Fetch course data
  const courseResponse = await api.getCourse(slug);
  const course = courseResponse.data;

  if (!course) {
    throw new Error('Курс не найден');
  }

  // Track course view
  try {
    await api.trackEvent('course_view', { courseSlug: slug });
  } catch (error) {
    console.error('Failed to track course_view:', error);
  }

  const hasDiscount = course.price?.isDiscounted;
  const price = formatPrice(course.price?.amount || 0);
  const originalPrice = hasDiscount ? formatPrice(course.price?.originalPrice || 0) : null;

  // Setup main button (Buy button)
  setupMainButton(course);

  return `
    <div class="course-page">
      <!-- Header -->
      <div class="course-header">
        <h1 class="course-title">${escapeHtml(course.title)}</h1>
        ${course.category ? `
          <div class="course-category">
            <span class="category-badge">${escapeHtml(course.category.name)}</span>
          </div>
        ` : ''}
      </div>

      <!-- Cover Image -->
      <div class="course-cover">
        <img src="${course.coverImage?.url || 'https://via.placeholder.com/600x400'}" 
             alt="${escapeHtml(course.title)}">
      </div>

      <!-- Price -->
      <div class="course-price-section">
        ${hasDiscount ? `
          <div class="price-badge">🔥 Скидка ${course.discountPercent}%</div>
          <div class="price-old">${originalPrice}</div>
        ` : ''}
        <div class="price-current">${price}</div>
      </div>

      <!-- Meta Info -->
      <div class="course-meta-section">
        <div class="meta-item">
          <span class="meta-icon">📚</span>
          <span class="meta-text">${course.lessonsCount} уроков</span>
        </div>
        <div class="meta-item">
          <span class="meta-icon">⏱</span>
          <span class="meta-text">${escapeHtml(course.duration)}</span>
        </div>
        ${course.views ? `
          <div class="meta-item">
            <span class="meta-icon">👁</span>
            <span class="meta-text">${course.views} просмотров</span>
          </div>
        ` : ''}
      </div>

      <!-- Description -->
      <div class="course-section">
        <h2 class="section-title">О курсе</h2>
        <p class="section-text">${escapeHtml(course.fullDescription || course.description)}</p>
      </div>

      <!-- What's Included -->
      ${course.includes?.length ? `
        <div class="course-section">
          <h2 class="section-title">Что получишь:</h2>
          <ul class="includes-list">
            ${course.includes.map(item => `
              <li class="includes-item">✅ ${escapeHtml(item)}</li>
            `).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- Curriculum -->
      ${course.curriculum?.length ? `
        <div class="course-section">
          <h2 class="section-title">Программа курса:</h2>
          <div class="curriculum-list">
            ${course.curriculum.map(module => `
              <div class="curriculum-module">
                <h3 class="module-title">
                  📍 Модуль ${module.moduleNumber}: ${escapeHtml(module.title)}
                </h3>
                <ul class="module-lessons">
                  ${module.lessons.map(lesson => `
                    <li class="lesson-item">${escapeHtml(lesson)}</li>
                  `).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Tags -->
      ${course.tags?.length ? `
        <div class="course-section">
          <div class="tags-list">
            ${course.tags.map(tag => `
              <span class="tag">#${escapeHtml(tag)}</span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Bottom Spacing for Main Button -->
      <div class="bottom-spacing"></div>
    </div>
  `;
}

function setupMainButton(course) {
  const price = formatPrice(course.price?.amount || 0);
  
  telegram.showMainButton(`💳 Купить за ${price}`, async () => {
    telegram.haptic('medium');
    telegram.setMainButtonLoading(true);

    try {
      // Track click
      await api.trackCourseClick(course.slug);

      // Open purchase link
      const purchaseUrl = course.purchaseLinks?.telegram 
        || course.purchaseLinks?.whatsapp 
        || course.purchaseLinks?.website;

      if (purchaseUrl) {
        if (purchaseUrl.includes('t.me')) {
          telegram.openTelegramLink(purchaseUrl);
        } else {
          telegram.openLink(purchaseUrl);
        }
      } else {
        alert('Ссылка на покупку скоро появится!');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      telegram.haptic('error');
    } finally {
      telegram.setMainButtonLoading(false);
    }
  });
}