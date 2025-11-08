/**
 * Simple SPA Router
 */

import telegram from './telegram.js';

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.container = null;
  }

  /**
   * Initialize router
   */
  init(container) {
    this.container = container;
    
    // Handle back button
    telegram.showBackButton(() => {
      telegram.haptic('light');
      this.back();
    });

    // Hide back button on home page
    if (this.currentRoute === '/' || !this.currentRoute) {
      telegram.hideBackButton();
    }
  }

  /**
   * Add route
   */
  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  /**
   * Navigate to path
   */
  async navigate(path, state = {}) {
    telegram.haptic('light');

    // Find matching route
    let handler = null;
    let params = {};

    // Exact match
    if (this.routes[path]) {
      handler = this.routes[path];
    } else {
      // Dynamic route matching (e.g., /course/:slug)
      for (const route in this.routes) {
        const pattern = route.replace(/:[^/]+/g, '([^/]+)');
        const regex = new RegExp(`^${pattern}$`);
        const match = path.match(regex);

        if (match) {
          handler = this.routes[route];
          
          // Extract params
          const paramNames = route.match(/:[^/]+/g) || [];
          paramNames.forEach((param, i) => {
            params[param.slice(1)] = match[i + 1];
          });
          break;
        }
      }
    }

    if (!handler) {
      console.error('Route not found:', path);
      return;
    }

    // Update current route
    this.currentRoute = path;

    // Show/hide back button
    if (path === '/') {
      telegram.hideBackButton();
    } else {
      telegram.showBackButton(() => {
        telegram.haptic('light');
        this.back();
      });
    }

    // Hide main button by default
    telegram.hideMainButton();

    // Show loading
    this.showLoading();

    try {
      // Call handler
      const content = await handler({ params, state });
      
      // Render content
      this.render(content);
    } catch (error) {
      console.error('Route handler error:', error);
      this.showError(error.message);
    }
  }

  /**
   * Go back
   */
  back() {
    this.navigate('/');
  }

  /**
   * Render content
   */
  render(content) {
    if (!this.container) return;
    this.container.innerHTML = content;
  }

  /**
   * Show loading
   */
  showLoading() {
    this.render(`
      <div class="loading">
        <div class="spinner"></div>
        <p>Загрузка...</p>
      </div>
    `);
  }

  /**
   * Show error
   */
  showError(message) {
    this.render(`
      <div class="error">
        <p>❌ ${message}</p>
        <button onclick="location.reload()">Обновить</button>
      </div>
    `);
  }
}

export default new Router();