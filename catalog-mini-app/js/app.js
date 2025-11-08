/**
 * Main Application Entry Point
 */

import telegram from './telegram.js';
import router from './router.js';
import { renderHomePage, setupHomePageListeners } from './pages/home.js';
import { renderCoursePage } from './pages/course.js';

// Initialize app
async function init() {
  console.log('🚀 Initializing Catalog Mini App...');

  // Initialize Telegram SDK
  const isTelegramInitialized = telegram.init();
  
  if (!isTelegramInitialized) {
    console.warn('⚠️ Running outside Telegram');
  }

  // Get app container
  const app = document.getElementById('app');
  if (!app) {
    console.error('❌ App container not found');
    return;
  }

  // Initialize router
  router.init(app);

  // Setup routes
  router.addRoute('/', async () => {
    const content = await renderHomePage();
    // Setup listeners after render
    setTimeout(() => {
      setupHomePageListeners();
    }, 0);
    return content;
  });

  router.addRoute('/course/:slug', renderCoursePage);

  // Navigate to home page
  await router.navigate('/');

  console.log('✅ App initialized successfully');
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}