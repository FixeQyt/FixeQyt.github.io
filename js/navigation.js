// Navigation controller for smooth scrolling and responsive menu

class NavigationController {
    constructor() {
        this.navbar = utils.$('#navbar');
        this.navMenu = utils.$('#nav-menu');
        this.navHamburger = utils.$('#nav-hamburger');
        this.navLinks = utils.$$('.nav-link');
        
        this.currentSection = 'home';
        this.isMenuOpen = false;
        this.scrollThreshold = 100;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollSpy();
        this.setupSmoothScrolling();
        this.updateActiveLink();
        this.updateViewportDimensions();
    }

    setupEventListeners() {
        // Hamburger menu toggle
        if (this.navHamburger) {
            this.navHamburger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileMenu();
            });
            
            // Touch events for better mobile experience
            this.navHamburger.addEventListener('touchstart', (e) => {
                e.preventDefault();
            }, { passive: false });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Orientation change handler
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });

        // Resize handler with debouncing
        const resizeHandler = utils.debounce(() => {
            this.handleResize();
        }, 250);
        
        window.addEventListener('resize', resizeHandler);

        // Scroll handler for navbar styling
        const scrollHandler = utils.throttle(() => {
            this.handleScroll();
        }, 16);

        window.addEventListener('scroll', scrollHandler);
    }
    
    handleOrientationChange() {
        // Close mobile menu on orientation change
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Recalculate viewport dimensions
        this.updateViewportDimensions();
    }
    
    handleResize() {
        // Close mobile menu when screen becomes larger
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Update viewport dimensions
        this.updateViewportDimensions();
    }
    
    updateViewportDimensions() {
        // Update CSS custom properties for viewport dimensions
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setupScrollSpy() {
        const sections = utils.$$('section[id]');
        
        const observer = utils.createScrollObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                    this.currentSection = entry.target.id;
                    this.updateActiveLink();
                }
            });
        }, { 
            threshold: [0.1, 0.5, 0.9],
            rootMargin: '-80px 0px -50% 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    setupSmoothScrolling() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetSection = utils.$(targetId);
                
                if (targetSection) {
                    this.scrollToSection(targetSection);
                    
                    // Close mobile menu if open
                    if (this.isMenuOpen) {
                        this.closeMobileMenu();
                    }
                    
                    // Update current section
                    this.currentSection = targetId.substring(1);
                    this.updateActiveLink();
                }
            });
        });

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash;
            if (hash) {
                const target = utils.$(hash);
                if (target) {
                    this.scrollToSection(target);
                }
            }
        });

        // Handle initial hash on page load
        if (window.location.hash) {
            setTimeout(() => {
                const target = utils.$(window.location.hash);
                if (target) {
                    this.scrollToSection(target);
                }
            }, 100);
        }
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.isMenuOpen = true;
        this.navMenu.classList.add('active');
        this.navHamburger.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add animation classes to menu items
        this.navLinks.forEach((link, index) => {
            link.style.animationDelay = `${index * 0.1}s`;
            link.classList.add('animate-slide-in');
        });

        // Announce to screen readers
        this.navMenu.setAttribute('aria-expanded', 'true');
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.navMenu.classList.remove('active');
        this.navHamburger.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Remove animation classes
        this.navLinks.forEach(link => {
            link.style.animationDelay = '';
            link.classList.remove('animate-slide-in');
        });

        // Announce to screen readers
        this.navMenu.setAttribute('aria-expanded', 'false');
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Add/remove scrolled class
        if (scrollY > this.scrollThreshold) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll direction
        if (this.lastScrollY !== undefined) {
            if (scrollY > this.lastScrollY && scrollY > 200) {
                // Scrolling down
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                this.navbar.style.transform = 'translateY(0)';
            }
        }
        
        this.lastScrollY = scrollY;
    }

    scrollToSection(target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - 80; // Account for fixed navbar

        // Use smooth scrolling utility
        utils.smoothScrollTo(target, 1000);

        // Update URL without triggering hashchange
        history.pushState(null, null, `#${target.id}`);
    }

    updateActiveLink() {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            
            const linkHref = link.getAttribute('href').substring(1);
            if (linkHref === this.currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Public methods for external control
    navigateToSection(sectionId) {
        const target = utils.$(`#${sectionId}`);
        if (target) {
            this.scrollToSection(target);
            this.currentSection = sectionId;
            this.updateActiveLink();
        }
    }

    getCurrentSection() {
        return this.currentSection;
    }

    // Add breadcrumb navigation
    createBreadcrumb() {
        const breadcrumb = utils.createElement('nav', {
            className: 'breadcrumb',
            'aria-label': 'breadcrumb'
        });

        const breadcrumbList = utils.createElement('ol', {
            className: 'breadcrumb-list'
        });

        const sections = ['home', 'about', 'skills', 'projects'];
        const sectionNames = {
            'home': 'Home',
            'about': 'About',
            'skills': 'Skills',
            'projects': 'Projects'
        };

        sections.forEach((section, index) => {
            const listItem = utils.createElement('li', {
                className: `breadcrumb-item ${section === this.currentSection ? 'active' : ''}`
            });

            if (section === this.currentSection) {
                listItem.textContent = sectionNames[section];
                listItem.setAttribute('aria-current', 'page');
            } else {
                const link = utils.createElement('a', {
                    href: `#${section}`,
                    textContent: sectionNames[section]
                });
                
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateToSection(section);
                });
                
                listItem.appendChild(link);
            }

            breadcrumbList.appendChild(listItem);
        });

        breadcrumb.appendChild(breadcrumbList);
        return breadcrumb;
    }

    // Add scroll progress indicator
    createScrollProgress() {
        const progressBar = utils.createElement('div', {
            className: 'scroll-progress',
            style: `
                position: fixed;
                top: ${this.navbar.offsetHeight}px;
                left: 0;
                width: 0%;
                height: 3px;
                background: var(--gradient-primary);
                z-index: 999;
                transition: width 0.1s ease;
            `
        });

        document.body.appendChild(progressBar);

        const updateProgress = utils.throttle(() => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            
            progressBar.style.width = scrolled + '%';
        }, 16);

        window.addEventListener('scroll', updateProgress);

        return progressBar;
    }

    // Add section indicators
    createSectionIndicators() {
        const indicators = utils.createElement('div', {
            className: 'section-indicators',
            style: `
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 50;
                display: flex;
                flex-direction: column;
                gap: 15px;
            `
        });

        const sections = ['home', 'about', 'skills', 'projects'];
        const sectionNames = {
            'home': 'Home',
            'about': 'About',
            'skills': 'Skills',
            'projects': 'Projects'
        };

        sections.forEach(section => {
            const indicator = utils.createElement('div', {
                className: `section-indicator ${section === this.currentSection ? 'active' : ''}`,
                title: sectionNames[section],
                style: `
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: ${section === this.currentSection ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.3)'};
                    cursor: pointer;
                    transition: all 0.3s ease;
                `
            });

            indicator.addEventListener('click', () => {
                this.navigateToSection(section);
            });

            indicators.appendChild(indicator);
        });

        document.body.appendChild(indicators);

        // Update indicators when section changes
        window.addEventListener('sectionChange', (e) => {
            indicators.querySelectorAll('.section-indicator').forEach((indicator, index) => {
                const section = sections[index];
                if (section === e.detail.section) {
                    indicator.classList.add('active');
                    indicator.style.background = 'var(--accent-primary)';
                } else {
                    indicator.classList.remove('active');
                    indicator.style.background = 'rgba(255, 255, 255, 0.3)';
                }
            });
        });

        return indicators;
    }

    // Announce section changes for accessibility
    announceSection(sectionName) {
        const announcement = utils.createElement('div', {
            'aria-live': 'polite',
            'aria-atomic': 'true',
            className: 'sr-only',
            textContent: `Now viewing ${sectionName} section`
        });

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

// Initialize navigation controller
utils.ready(() => {
    window.navigationController = new NavigationController();
});

// Export for external use
window.NavigationController = NavigationController;
