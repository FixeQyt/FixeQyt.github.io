// Main application controller - orchestrates all components

class PortfolioApp {
    constructor() {
        this.isLoaded = false;
        this.loadingStartTime = performance.now();
        this.components = new Map();
        
        this.init();
    }

    async init() {
        try {
            utils.performanceMonitor.mark('app-init-start');
            
            // Show loading screen
            utils.showLoadingScreen();
            
            // Initialize core components
            await this.initializeComponents();
            
            // Load and render data
            await this.loadData();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup project filters
            this.setupProjectFilters();
            
            // Initialize particles
            this.initializeParticles();
            
            // Complete loading
            this.completeLoading();
            
            utils.performanceMonitor.mark('app-init-end');
            utils.performanceMonitor.measure('app-init-time', 'app-init-start', 'app-init-end');
            
            if (CONFIG.DEBUG) {
                console.log(`Portfolio loaded in ${utils.performanceMonitor.getLoadTime().toFixed(2)}ms`);
            }
            
        } catch (error) {
            utils.errorHandler(error, 'PortfolioApp.init');
            this.handleLoadingError(error);
        }
    }

    async initializeComponents() {
        // Wait for all components to be available
        
        // Wait for components with retry logic
        let retries = 0;
        const maxRetries = 10;
        
        while (retries < maxRetries) {
            if (window.dataManager && window.componentBuilder && window.navigationController) {
                break;
            }
            
            retries++;
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        this.components.set('dataManager', window.dataManager);
        this.components.set('componentBuilder', window.componentBuilder);
        this.components.set('navigationController', window.navigationController);
        this.components.set('animationController', window.animationController);
        this.components.set('threeScene', window.threeScene);
        
        // Additional wait to ensure DOM elements are ready
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async loadData() {
        try {
            // Load all portfolio data
            const data = await window.dataManager.init();
            
            // Update developer information
            window.componentBuilder.updateDeveloperInfo(data.developer);
            
            // Build skills section
            window.componentBuilder.buildSkillsSection(data.skills);
            
            // Build projects section
            window.componentBuilder.buildProjectsSection(data.projectsData || data.projects);
            
            // Build social links
            window.componentBuilder.buildSocialLinks(data.socials);
            
            // Refresh animations for newly created elements
            if (window.animationController && window.animationController.refreshScrollAnimations) {
                window.animationController.refreshScrollAnimations();
            }
            
            // Setup project filters after elements are created
            setTimeout(() => {
                this.setupProjectFilters();
            }, 100);
            
        } catch (error) {
            console.error('Error in loadData:', error);
            utils.errorHandler(error, 'PortfolioApp.loadData');
            throw error;
        }
    }

    setupEventListeners() {
        // Global error handler
        window.addEventListener('error', (e) => {
            utils.errorHandler(e.error, 'Global Error');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (e) => {
            utils.errorHandler(e.reason, 'Unhandled Promise Rejection');
        });

        // Performance monitoring
        window.addEventListener('beforeunload', () => {
            this.logPerformanceMetrics();
        });

        // Visibility change handler
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });

        // Custom events
        this.setupCustomEvents();
    }

    setupCustomEvents() {
        // Theme toggle (if implemented later)
        document.addEventListener('themeToggle', (e) => {
            this.handleThemeChange(e.detail.theme);
        });

        // Section change event
        document.addEventListener('sectionChange', (e) => {
            this.handleSectionChange(e.detail.section);
        });

        // Project filter event
        document.addEventListener('projectFilter', (e) => {
            this.handleProjectFilter(e.detail.category);
        });
    }

    setupProjectFilters() {
        const filterButtons = utils.$$('.filter-btn');
        
        if (filterButtons.length === 0) {
            return;
        }
        
        filterButtons.forEach(button => {
            // Remove existing listeners
            button.removeEventListener('click', this.handleFilterClick);
            
            // Add new listener
            button.addEventListener('click', (e) => {
                const category = button.dataset.filter;
                
                if (window.componentBuilder && window.componentBuilder.filterProjects) {
                    window.componentBuilder.filterProjects(category);
                }
                
                // Dispatch custom event
                document.dispatchEvent(new CustomEvent('projectFilter', {
                    detail: { category }
                }));
            });
        });
    }

    initializeParticles() {
        // Create floating particles in hero section
        const heroSection = utils.$('.hero');
        if (heroSection) {
            const particlesContainer = heroSection.querySelector('.floating-particles');
            if (particlesContainer) {
                utils.createParticle(particlesContainer, 30);
            }
        }

        // Add matrix rain effect to skills section
        const skillsSection = utils.$('.skills');
        if (skillsSection && window.animationController) {
            window.animationController.createMatrixRain(skillsSection);
        }
    }

    completeLoading() {
        // Wait for all resources to load
        window.loadingManager.onComplete(() => {
            const loadingTime = performance.now() - this.loadingStartTime;
            
            // Ensure minimum loading time for smooth UX (optional)
            const minLoadingTime = 1000;
            const remainingTime = Math.max(0, minLoadingTime - loadingTime);
            
            setTimeout(() => {
                utils.hideLoadingScreen();
                this.onLoadingComplete();
            }, remainingTime);
        });
    }

    onLoadingComplete() {
        this.isLoaded = true;
        
        // Announce to screen readers
        const announcement = utils.createElement('div', {
            'aria-live': 'polite',
            'aria-atomic': 'true',
            className: 'sr-only',
            textContent: 'Portfolio website loaded successfully'
        });
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                announcement.parentNode.removeChild(announcement);
            }
        }, 1000);

        // Dispatch loaded event
        document.dispatchEvent(new CustomEvent('portfolioLoaded'));
        
        // Initialize scroll-triggered animations
        this.triggerInitialAnimations();
    }

    triggerInitialAnimations() {
        // Trigger hero animations
        const heroElements = utils.$$('.hero-text, .hero-avatar');
        heroElements.forEach(element => {
            element.classList.add('loaded');
        });

        // Trigger typewriter effect
        const typewriterElement = utils.$('#typewriter');
        if (typewriterElement && window.animationController) {
            window.animationController.glitchText(typewriterElement, 2000);
        }
    }

    handleLoadingError(error) {
        console.error('Failed to load portfolio:', error);

        // Show error message on loading screen (do not hide it)
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            // Remove previous error if any
            const prevError = loadingScreen.querySelector('.loading-error-message');
            if (prevError) prevError.remove();

            // Add error message overlay
            const errorDiv = document.createElement('div');
            errorDiv.className = 'loading-error-message';
            errorDiv.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--bg-card, #181824ee);
                border: var(--border-glass, 1px solid #444);
                border-radius: var(--radius-lg, 16px);
                padding: var(--spacing-lg, 2rem);
                text-align: center;
                z-index: 10001;
                box-shadow: 0 4px 32px #0008;
                color: var(--text-secondary, #fff);
                min-width: 260px;
                max-width: 90vw;
            `;
            errorDiv.innerHTML = `
                <h3 style="color: var(--accent-secondary, #ff4e6a); margin-bottom: 1rem;">
                    Oops! Something went wrong
                </h3>
                <p style="margin-bottom: 1.5rem;">
                    Failed to load portfolio data.<br>Check your connection or try again.
                </p>
                <button class="btn btn-primary" onclick="window.location.reload()">
                    Refresh Page
                </button>
            `;
            loadingScreen.appendChild(errorDiv);
        }
    }

    onPageHidden() {
        // Pause animations when page is hidden
        if (window.animationController) {
            window.animationController.pause();
        }
        
        if (window.threeScene) {
            window.threeScene.pause();
        }
    }

    onPageVisible() {
        // Resume animations when page becomes visible
        if (window.animationController) {
            window.animationController.resume();
        }
        
        if (window.threeScene) {
            window.threeScene.resume();
        }
    }

    handleThemeChange(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        utils.storage.set('theme', theme);
    }

    handleSectionChange(section) {
        // Update page title
        const sectionTitles = {
            'home': 'FixeQ - Paweł Sobczak | Full Stack Developer',
            'about': 'About - FixeQ | Full Stack Developer',
            'skills': 'Skills - FixeQ | Full Stack Developer',
            'projects': 'Projects - FixeQ | Full Stack Developer'
        };
        
        document.title = sectionTitles[section] || sectionTitles.home;
        
        // Analytics tracking (if implemented)
        this.trackPageView(section);
    }

    handleProjectFilter(category) {
            console.log('Performance Metrics:', metrics);        // Analytics tracking
        this.trackEvent('project_filter', { category });
    }

    trackPageView(section) {
        // Placeholder for analytics tracking
        if (window.gtag) {
            window.gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
    }

    trackEvent(eventName, parameters = {}) {
        // Placeholder for analytics tracking
        if (window.gtag) {
            window.gtag('event', eventName, parameters);
        }
        
        if (CONFIG.DEBUG) {
            console.log('Event tracked:', eventName, parameters);
        }
    }

    logPerformanceMetrics() {
        try {
            const navigation = performance.getEntriesByType('navigation')[0];
            const metrics = {
                loadTime: utils.performanceMonitor.getLoadTime(),
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
                firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
                firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0
            };
            
            console.log('Performance Metrics:', metrics);
            
            // Send to analytics if needed
            this.trackEvent('performance_metrics', metrics);
            
        } catch (error) {
            utils.errorHandler(error, 'PortfolioApp.logPerformanceMetrics');
        }
    }

    // Public API for external control
    api = {
        navigate: (section) => {
            if (window.navigationController) {
                window.navigationController.navigateToSection(section);
            }
        },
        
        filterProjects: (category) => {
            if (window.componentBuilder) {
                window.componentBuilder.filterProjects(category);
            }
        },
        
        openProject: (projectId) => {
            const project = window.dataManager.getProjectById(projectId);
            if (project && window.componentBuilder) {
                window.componentBuilder.openProjectModal(project);
            }
        },
        
        getPerformanceMetrics: () => {
            return {
                loadTime: utils.performanceMonitor.getLoadTime(),
                isLoaded: this.isLoaded
            };
        },
        
        reload: () => {
            window.location.reload();
        }
    };
}

// Initialize the application when DOM is ready
utils.ready(() => {
    window.portfolioApp = new PortfolioApp();
    
    // Expose API to global scope
    window.Portfolio = window.portfolioApp.api;
});

// Export for external use
window.PortfolioApp = PortfolioApp;
