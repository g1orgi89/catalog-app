/**
 * Telegram Web App SDK wrapper
 * Handles initialization, theme, buttons, haptic feedback
 */

class TelegramApp {
  constructor() {
    this.tg = window.Telegram?.WebApp;
    this.isReady = false;
  }

  /**
   * Initialize Telegram Web App
   */
  init() {
    if (!this.tg) {
      console.error('Telegram WebApp SDK not found');
      return false;
    }

    // Expand to full height
    this.tg.expand();

    // Enable closing confirmation
    this.tg.enableClosingConfirmation();

    // Set header color
    this.tg.setHeaderColor('#8B5CF6');

    // Ready
    this.tg.ready();
    this.isReady = true;

    console.log('✅ Telegram WebApp initialized');
    return true;
  }

  /**
   * Get user data from Telegram
   */
  getUserData() {
    if (!this.tg) return null;

    const user = this.tg.initDataUnsafe?.user;
    return {
      id: user?.id,
      firstName: user?.first_name,
      lastName: user?.last_name,
      username: user?.username,
      languageCode: user?.language_code,
      isPremium: user?.is_premium || false
    };
  }

  /**
   * Get init data for backend authentication
   */
  getInitData() {
    return this.tg?.initData || '';
  }

  /**
   * Get theme colors
   */
  getTheme() {
    return {
      bgColor: this.tg?.backgroundColor || '#FFFFFF',
      textColor: this.tg?.textColor || '#000000',
      hintColor: this.tg?.hintColor || '#999999',
      linkColor: this.tg?.linkColor || '#8B5CF6',
      buttonColor: this.tg?.buttonColor || '#8B5CF6',
      buttonTextColor: this.tg?.buttonTextColor || '#FFFFFF'
    };
  }

  /**
   * Show/hide back button
   */
  showBackButton(callback) {
    if (!this.tg) return;
    
    this.tg.BackButton.show();
    this.tg.BackButton.onClick(callback);
  }

  hideBackButton() {
    if (!this.tg) return;
    this.tg.BackButton.hide();
  }

  /**
   * Show/hide main button
   */
  showMainButton(text, callback) {
    if (!this.tg) return;

    this.tg.MainButton.setText(text);
    this.tg.MainButton.show();
    this.tg.MainButton.onClick(callback);
  }

  hideMainButton() {
    if (!this.tg) return;
    this.tg.MainButton.hide();
  }

  /**
   * Set main button loading state
   */
  setMainButtonLoading(isLoading) {
    if (!this.tg) return;

    if (isLoading) {
      this.tg.MainButton.showProgress();
    } else {
      this.tg.MainButton.hideProgress();
    }
  }

  /**
   * Haptic feedback
   */
  haptic(type = 'light') {
    if (!this.tg?.HapticFeedback) return;

    const impactTypes = ['light', 'medium', 'heavy', 'rigid', 'soft'];
    const notificationTypes = ['error', 'success', 'warning'];

    if (impactTypes.includes(type)) {
      this.tg.HapticFeedback.impactOccurred(type);
    } else if (notificationTypes.includes(type)) {
      this.tg.HapticFeedback.notificationOccurred(type);
    } else {
      this.tg.HapticFeedback.selectionChanged();
    }
  }

  /**
   * Open link
   */
  openLink(url) {
    if (!this.tg) {
      window.open(url, '_blank');
      return;
    }
    this.tg.openLink(url);
  }

  /**
   * Open Telegram link
   */
  openTelegramLink(url) {
    if (!this.tg) {
      window.open(url, '_blank');
      return;
    }
    this.tg.openTelegramLink(url);
  }

  /**
   * Close Mini App
   */
  close() {
    if (!this.tg) return;
    this.tg.close();
  }
}

// Export singleton
export default new TelegramApp();