/**
 * API Client for backend communication
 */

import telegram from './telegram.js';

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3003/api'
  : '/api';

class API {
  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      // Add Telegram init data for authentication
      const initData = telegram.getInitData();
      if (initData) {
        headers['X-Telegram-Init-Data'] = initData;
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  /**
   * Get all courses
   */
  async getCourses(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/courses?${queryParams}` : '/courses';
    return this.request(endpoint);
  }

  /**
   * Get single course by slug
   */
  async getCourse(slug) {
    return this.request(`/courses/${slug}`);
  }

  /**
   * Track course click (when user clicks "Buy" button)
   */
  async trackCourseClick(slug) {
    return this.request(`/courses/${slug}/click`, {
      method: 'POST'
    });
  }

  /**
   * Get all categories
   */
  async getCategories() {
    return this.request('/categories');
  }

  /**
   * Track analytics event
   */
  async trackEvent(eventType, data = {}) {
    const userData = telegram.getUserData();
    
    // Parse UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const utm = {
      source: urlParams.get('utm_source') || null,
      medium: urlParams.get('utm_medium') || null,
      campaign: urlParams.get('utm_campaign') || null,
      content: urlParams.get('utm_content') || null,
      term: urlParams.get('utm_term') || null
    };

    const eventData = {
      eventType,
      courseSlug: data.courseSlug || null,
      user: userData ? {
        telegramId: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        languageCode: userData.languageCode,
        isPremium: userData.isPremium
      } : null,
      utm,
      device: {
        platform: telegram.tg?.platform || 'unknown',
        version: telegram.tg?.version || 'unknown',
        userAgent: navigator.userAgent
      },
      metadata: data.metadata || {}
    };

    return this.request('/analytics/track', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  }
}

export default new API();