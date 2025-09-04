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
            utils.showLoadingScreen();
            await this.initializeComponents();
            await this.loadData();
            this.setupEventListeners();
            this.setupProjectFilters();
            this.initializeParticles();
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
        this.initializeBackToTop();
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    async loadData() {
        try {
            const data = await window.dataManager.init();
            window.componentBuilder.updateDeveloperInfo(data.developer);
            window.componentBuilder.buildSkillsSection(data.skills);
            window.componentBuilder.buildProjectsSection(data.projectsData || data.projects);
            window.componentBuilder.buildSocialLinks(data.socials);
            if (window.animationController && window.animationController.refreshScrollAnimations) {
                window.animationController.refreshScrollAnimations();
            }
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
        window.addEventListener('error', (e) => {
            utils.errorHandler(e.error, 'Global Error');
        });
        window.addEventListener('unhandledrejection', (e) => {
            utils.errorHandler(e.reason, 'Unhandled Promise Rejection');
        });
        window.addEventListener('beforeunload', () => {
            this.logPerformanceMetrics();
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });
        this.setupCustomEvents();
    }
    setupCustomEvents() {
        document.addEventListener('themeToggle', (e) => {
            this.handleThemeChange(e.detail.theme);
        });
        document.addEventListener('sectionChange', (e) => {
            this.handleSectionChange(e.detail.section);
        });
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
            button.removeEventListener('click', this.handleFilterClick);
            button.addEventListener('click', (e) => {
                const category = button.dataset.filter;
                if (window.componentBuilder && window.componentBuilder.filterProjects) {
                    window.componentBuilder.filterProjects(category);
                }
                document.dispatchEvent(new CustomEvent('projectFilter', {
                    detail: { category }
                }));
            });
        });
    }
    initializeParticles() {
        const heroSection = utils.$('.hero');
        if (heroSection) {
            const particlesContainer = heroSection.querySelector('.floating-particles');
            if (particlesContainer) {
                utils.createParticle(particlesContainer, 30);
            }
        }
        const skillsSection = utils.$('.skills');
        if (skillsSection && window.animationController) {
            window.animationController.createMatrixRain(skillsSection);
        }
    }
    completeLoading() {
        window.loadingManager.onComplete(() => {
            const loadingTime = performance.now() - this.loadingStartTime;
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
        document.dispatchEvent(new CustomEvent('portfolioLoaded'));
        this.triggerInitialAnimations();
    }
    triggerInitialAnimations() {
        const heroElements = utils.$$('.hero-text, .hero-avatar');
        heroElements.forEach(element => {
            element.classList.add('loaded');
        });
        const typewriterElement = utils.$('#typewriter');
        if (typewriterElement && window.animationController) {
            window.animationController.glitchText(typewriterElement, 2000);
        }
    }
    handleLoadingError(error) {
        console.error('Failed to load portfolio:', error);
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            const prevError = loadingScreen.querySelector('.loading-error-message');
            if (prevError) prevError.remove();
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
        if (window.animationController) {
            window.animationController.pause();
        }
        if (window.threeScene) {
            window.threeScene.pause();
        }
    }
    onPageVisible() {
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
        const sectionTitles = {
            'home': 'FixeQ - Paweł Sobczak | Full Stack Developer',
            'about': 'About - FixeQ | Full Stack Developer',
            'skills': 'Skills - FixeQ | Full Stack Developer',
            'projects': 'Projects - FixeQ | Full Stack Developer'
        };
        document.title = sectionTitles[section] || sectionTitles.home;
        this.trackPageView(section);
    }
    handleProjectFilter(category) {
            console.log('Performance Metrics:', metrics);        
        this.trackEvent('project_filter', { category });
    }
    trackPageView(section) {
        if (window.gtag) {
            window.gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
    }
    trackEvent(eventName, parameters = {}) {
        if (window.gtag) {
            window.gtag('event', eventName, parameters);
        }
        if (CONFIG.DEBUG) {
            console.log('Event tracked:', eventName, parameters);
        }
    }
    initializeBackToTop() {
        const backToTopBtn = utils.$('#back-to-top');
        if (!backToTopBtn) return;
        const toggleBackToTop = utils.throttle(() => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }, 100);
        window.addEventListener('scroll', toggleBackToTop);
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            this.trackEvent('back_to_top_click');
        });
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
            this.trackEvent('performance_metrics', metrics);
        } catch (error) {
            utils.errorHandler(error, 'PortfolioApp.logPerformanceMetrics');
        }
    }
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
utils.ready(() => {
    window.portfolioApp = new PortfolioApp();
    window.Portfolio = window.portfolioApp.api;
});
window.PortfolioApp = PortfolioApp;
