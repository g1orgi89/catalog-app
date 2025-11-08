/**
 * Home Page - Main page with courses list
 */

import api from '../api.js';
import telegram from '../telegram.js';
import router from '../router.js';
import { formatPrice, escapeHtml } from '../utils.js';

export async function renderHomePage() {
  // Track app open event
  try {
    await api.trackEvent('app_open');
  } catch (error) {
    console.error('Failed to track app_open:', error);
  }

  // Fetch courses
  const coursesResponse = await api.getCourses({ status: 'published' });
  const courses = coursesResponse.data || [];

  // Get user data
  const userData = telegram.getUserData();
  const userName = userData?.firstName || 'Привет';

  return `
    <div class="home-page">
      <!-- Hero Section -->
      <div class="hero">
        <div class="hero-avatar">
          <img src="https://via.placeholder.com/120" alt="Поля Смыслова">
        </div>
        <h1 class="hero-title">👋 ${escapeHtml(userName)}, я Поля Смыслова</h1>
        <p class="hero-description">
          Помогаю косметологам зарабатывать больше через правильное продвижение в соцсетях
        </p>
      </div>

      <!-- Courses Section -->
      <div class="courses-section">
        <h2 class="section-title">💼 Мои курсы</h2>
        <div class="courses-grid">
          ${courses.map(course => renderCourseCard(course)).join('')}
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <h3 class="footer-title">📲 Связаться со мной</h3>
        <div class="social-links">
          <button class="social-link" data-link="https://instagram.com" data-type="external">
            <span class="social-icon">📸</span>
            <span>Instagram</span>
          </button>
          <button class="social-link" data-link="https://t.me/username" data-type="telegram">
            <span class="social-icon">✈️</span>
            <span>Telegram</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderCourseCard(course) {
  const hasDiscount = course.price?.isDiscounted;
  const price = formatPrice(course.price?.amount || 0);
  const originalPrice = hasDiscount ? formatPrice(course.price?.originalPrice || 0) : null;

  return `
    <div class="course-card" data-slug="${escapeHtml(course.slug)}">
      <div class="course-card-image">
        <img src="${course.coverImage?.url || 'https://via.placeholder.com/300x200'}" 
             alt="${escapeHtml(course.title)}">
        ${hasDiscount ? `
          <div class="course-badge">🔥 Скидка ${course.discountPercent}%</div>
        ` : ''}
      </div>
      <div class="course-card-content">
        <h3 class="course-card-title">${escapeHtml(course.title)}</h3>
        <p class="course-card-description">${escapeHtml(course.description)}</p>
        
        <div class="course-card-meta">
          <span class="course-meta-item">📚 ${course.lessonsCount} уроков</span>
          <span class="course-meta-item">⏱ ${escapeHtml(course.duration)}</span>
        </div>

        <div class="course-card-footer">
          <div class="course-price">
            ${hasDiscount ? `<span class="course-price-old">${originalPrice}</span>` : ''}
            <span class="course-price-current">${price}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Setup event listeners after render
export function setupHomePageListeners() {
  // Course card clicks
  document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', () => {
      const slug = card.dataset.slug;
      telegram.haptic('light');
      router.navigate(`/course/${slug}`);
    });
  });

  // Social links
  document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', () => {
      const url = link.dataset.link;
      const type = link.dataset.type;
      telegram.haptic('light');
      
      if (type === 'telegram') {
        telegram.openTelegramLink(url);
      } else {
        telegram.openLink(url);
      }
    });
  });
}