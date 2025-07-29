/**
 * GitHub Stats Page JavaScript
 * Handles styling detection, animations, and interactive features
 */

class GitHubStatsPage {
  constructor() {
    this.isFromGitHub = false;
    this.init();
  }

  /**
   * Initialize the page functionality
   */
  init() {
    this.detectReferrer();
    this.setupEventListeners();
    this.addLoadingAnimation();
    this.setupKeyboardNavigation();
    this.addStatsRefresh();
  }

  /**
   * Detect if page is loaded from GitHub and apply no-style class
   */
  detectReferrer() {
    if (document.referrer.includes("github.com")) {
      document.documentElement.classList.add('no-style');
      this.isFromGitHub = true;
      this.hideCredits();
    }
  }

  /**
   * Hide credits when viewing from GitHub
   */
  hideCredits() {
    const credits = document.getElementById("credits");
    if (credits && this.isFromGitHub) {
      credits.style.display = "none";
    }
  }

  /**
   * Setup event listeners for interactive elements
   */
  setupEventListeners() {
    const statsLink = document.getElementById("stats-link");
    const statsImg = document.getElementById("stats-img");
    const credits = document.getElementById("credits");

    // Stats link interactions
    if (statsLink) {
      statsLink.addEventListener('mouseenter', this.onStatsHover.bind(this));
      statsLink.addEventListener('mouseleave', this.onStatsLeave.bind(this));
      statsLink.addEventListener('click', this.onStatsClick.bind(this));
    }

    // Image loading handlers
    if (statsImg) {
      statsImg.addEventListener('load', this.onImageLoad.bind(this));
      statsImg.addEventListener('error', this.onImageError.bind(this));
    }

    // Credits interactions
    if (credits && !this.isFromGitHub) {
      credits.addEventListener('mouseenter', this.onCreditsHover.bind(this));
      credits.addEventListener('mouseleave', this.onCreditsLeave.bind(this));
    }

    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }

  /**
   * Add loading animation and fade-in effect
   */
  addLoadingAnimation() {
    const statsLink = document.getElementById("stats-link");
    const credits = document.getElementById("credits");

    if (statsLink) {
      statsLink.style.opacity = '0';
      statsLink.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        statsLink.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        statsLink.style.opacity = '1';
        statsLink.style.transform = 'translateY(0)';
      }, 100);
    }

    if (credits && !this.isFromGitHub) {
      credits.style.opacity = '0';
      credits.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        credits.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        credits.style.opacity = '1';
        credits.style.transform = 'translateY(0)';
      }, 300);
    }
  }

  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    const focusableElements = document.querySelectorAll('a[href]');
    this.focusableElements = Array.from(focusableElements);
    this.currentFocusIndex = 0;
  }

  /**
   * Handle keyboard navigation
   */
  handleKeyboard(event) {
    if (!this.isFromGitHub) {
      switch(event.key) {
        case 'Tab':
          // Let default tab behavior work
          break;
        case 'Enter':
        case ' ':
          if (document.activeElement.id === 'stats-link') {
            event.preventDefault();
            this.triggerStatsClick();
          }
          break;
        case 'r':
        case 'R':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            this.refreshStats();
          }
          break;
      }
    }
  }

  /**
   * Add stats refresh functionality
   */
  addStatsRefresh() {
    if (!this.isFromGitHub) {
      // Add refresh on double-click
      const statsImg = document.getElementById("stats-img");
      if (statsImg) {
        statsImg.addEventListener('dblclick', this.refreshStats.bind(this));
      }
    }
  }

  /**
   * Refresh stats image with cache busting
   */
  refreshStats() {
    const statsImg = document.getElementById("stats-img");
    if (statsImg) {
      const originalSrc = statsImg.src.split('&cache_bust=')[0];
      const cacheBust = Date.now();
      
      // Add loading indicator
      this.showLoadingIndicator();
      
      statsImg.src = `${originalSrc}&cache_bust=${cacheBust}`;
    }
  }

  /**
   * Show loading indicator during refresh
   */
  showLoadingIndicator() {
    const statsLink = document.getElementById("stats-link");
    if (statsLink) {
      statsLink.style.opacity = '0.7';
      statsLink.style.pointerEvents = 'none';
      
      // Create loading spinner
      const spinner = document.createElement('div');
      spinner.id = 'loading-spinner';
      spinner.innerHTML = '⟳';
      spinner.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        animation: spin 1s linear infinite;
        color: #58A6FF;
      `;
      
      // Add spinner styles
      if (!document.getElementById('spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
          @keyframes spin {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
          }
        `;
        document.head.appendChild(style);
      }
      
      statsLink.style.position = 'relative';
      statsLink.appendChild(spinner);
    }
  }

  /**
   * Handle image load success
   */
  onImageLoad() {
    const statsLink = document.getElementById("stats-link");
    const spinner = document.getElementById('loading-spinner');
    
    if (statsLink) {
      statsLink.style.opacity = '1';
      statsLink.style.pointerEvents = 'auto';
    }
    
    if (spinner) {
      spinner.remove();
    }

    console.log('GitHub stats loaded successfully');
  }

  /**
   * Handle image load error
   */
  onImageError() {
    const statsImg = document.getElementById("stats-img");
    const spinner = document.getElementById('loading-spinner');
    
    if (spinner) {
      spinner.remove();
    }
    
    console.error('Failed to load GitHub stats');
    
    // Show error message
    if (statsImg && !this.isFromGitHub) {
      statsImg.alt = 'GitHub Stats temporarily unavailable';
      statsImg.style.opacity = '0.5';
    }
  }

  /**
   * Stats hover enter handler
   */
  onStatsHover() {
    if (!this.isFromGitHub) {
      console.log('Hovering over GitHub stats');
    }
  }

  /**
   * Stats hover leave handler
   */
  onStatsLeave() {
    if (!this.isFromGitHub) {
      console.log('Left GitHub stats hover');
    }
  }

  /**
   * Stats click handler
   */
  onStatsClick(event) {
    console.log('GitHub stats clicked, redirecting to main page');
    
    // Add click animation
    if (!this.isFromGitHub) {
      const statsLink = event.currentTarget;
      statsLink.style.transform = 'scale(0.95)';
      setTimeout(() => {
        statsLink.style.transform = '';
      }, 150);
    }
  }

  /**
   * Trigger stats click programmatically
   */
  triggerStatsClick() {
    const statsLink = document.getElementById("stats-link");
    if (statsLink) {
      statsLink.click();
    }
  }

  /**
   * Credits hover enter handler
   */
  onCreditsHover() {
    console.log('Hovering over credits');
  }

  /**
   * Credits hover leave handler
   */
  onCreditsLeave() {
    console.log('Left credits hover');
  }

  /**
   * Get current page stats
   */
  getPageStats() {
    return {
      isFromGitHub: this.isFromGitHub,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.githubStatsPage = new GitHubStatsPage();
});

// Legacy support for existing inline script behavior
if (document.referrer.includes("github.com")) {
  document.documentElement.classList.add('no-style');
}

// Expose utilities for debugging
window.GitHubStatsUtils = {
  refreshStats: () => window.githubStatsPage?.refreshStats(),
  getStats: () => window.githubStatsPage?.getPageStats(),
  isFromGitHub: () => window.githubStatsPage?.isFromGitHub
};
