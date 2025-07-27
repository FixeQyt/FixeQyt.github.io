// Utility functions for the portfolio

// DOM utilities
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// Wait for DOM to be ready
const ready = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
};

// Debounce function for performance optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function for scroll events
const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function(...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

// Create element with attributes
const createElement = (tag, attributes = {}, children = []) => {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'innerHTML') {
            element.innerHTML = value;
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, value);
        } else {
            element[key] = value;
        }
    });
    
    children.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
        } else {
            element.appendChild(child);
        }
    });
    
    return element;
};

// Intersection Observer for scroll animations
const createScrollObserver = (callback, options = {}) => {
    const defaultOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    return new IntersectionObserver(callback, { ...defaultOptions, ...options });
};

// Animate number counting
const animateNumber = (element, target, duration = 2000) => {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
};

// Random number generator
const random = (min, max) => Math.random() * (max - min) + min;

// Random array element
const randomElement = (array) => array[Math.floor(Math.random() * array.length)];

// Format date
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

// Smooth scroll to element
const smoothScrollTo = (target, duration = 1000) => {
    const targetElement = typeof target === 'string' ? $(target) : target;
    if (!targetElement) return;
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function (ease-in-out)
        const ease = progress < 0.5 
            ? 2 * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    };
    
    requestAnimationFrame(animation);
};

// Check if element is in viewport
const isInViewport = (element, threshold = 0.1) => {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    const vertInView = (rect.top <= windowHeight * (1 - threshold)) && 
                      ((rect.top + rect.height) >= windowHeight * threshold);
    const horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
    
    return vertInView && horInView;
};

// Typewriter effect
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Generate particles
const createParticle = (container, count = 50) => {
    for (let i = 0; i < count; i++) {
        const particle = createElement('div', {
            className: 'particle',
            style: `
                left: ${random(0, 100)}%;
                animation-delay: ${random(0, 20)}s;
                animation-duration: ${random(15, 30)}s;
            `
        });
        
        container.appendChild(particle);
    }
};

// Advanced Loading Manager
class LoadingManager {
    constructor() {
        this.resources = new Map();
        this.totalResources = 0;
        this.loadedResources = 0;
        this.isComplete = false;
        this.callbacks = [];
        this.progressElement = null;
        this.statusElement = null;
        
        this.init();
    }
    
    init() {
        // Get loading screen elements (with delay to ensure DOM is ready)
        setTimeout(() => {
            const loadingScreen = $('#loading-screen');
            if (loadingScreen) {
                this.progressElement = loadingScreen.querySelector('.loading-progress');
                this.statusElement = loadingScreen.querySelector('.loading-status') || 
                                   loadingScreen.querySelector('.logo-text');
            }
        }, 100);
        
        // Wait for DOM to be ready before tracking resources
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.trackResources();
            });
        } else {
            this.trackResources();
        }
    }
    
    trackResources() {
        // Track all images on the page
        this.trackImages();
        
        // Track fonts
        this.trackFonts();
        
        // Track stylesheets
        this.trackStylesheets();
        
        // Set initial status
        this.updateStatus('Initializing...');
        
        // Check if everything is already loaded
        setTimeout(() => this.checkComplete(), 500);
    }
    
    trackImages() {
        // Find all images in HTML and CSS
        const images = document.querySelectorAll('img');
        const backgroundImages = [];
        
        // Check for CSS background images
        const elements = document.querySelectorAll('*');
        elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const bgImage = style.backgroundImage;
            if (bgImage && bgImage !== 'none' && bgImage.includes('url(')) {
                const matches = bgImage.match(/url\(['"]?([^'")]+)['"]?\)/g);
                if (matches) {
                    matches.forEach(match => {
                        const url = match.match(/url\(['"]?([^'")]+)['"]?\)/)[1];
                        if (!url.startsWith('data:')) {
                            backgroundImages.push(url);
                        }
                    });
                }
            }
        });
        
        // Track regular images
        images.forEach(img => {
            if (img.src && !img.src.startsWith('data:')) {
                this.addResource('image', img.src, img);
            }
        });
        
        // Track background images
        backgroundImages.forEach(src => {
            this.addResource('background-image', src);
        });
        
        // Track avatar image and project images from data
        this.addResource('image', 'assets/avatar.jpg');
    }
    
    trackFonts() {
        // Track Google Fonts
        if (document.fonts) {
            document.fonts.addEventListener('loadingdone', () => {
                this.onResourceLoaded('fonts', 'google-fonts');
            });
            
            document.fonts.addEventListener('loadingerror', () => {
                this.onResourceLoaded('fonts', 'google-fonts');
            });
            
            this.addResource('fonts', 'google-fonts');
        }
    }
    
    trackStylesheets() {
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach(link => {
            if (link.href) {
                this.addResource('stylesheet', link.href, link);
            }
        });
    }
    
    addResource(type, url, element = null) {
        const key = `${type}:${url}`;
        if (this.resources.has(key)) return;
        
        this.resources.set(key, {
            type,
            url,
            loaded: false,
            element
        });
        
        this.totalResources++;
        this.updateStatus(`Loading ${type}...`);
        
        // Start loading based on type
        switch (type) {
            case 'image':
            case 'background-image':
                this.loadImage(url, key);
                break;
            case 'stylesheet':
                this.loadStylesheet(element, key);
                break;
            case 'fonts':
                // Fonts are handled by the fonts API
                break;
        }
    }
    
    loadImage(url, key) {
        const img = new Image();
        img.onload = () => this.onResourceLoaded(key);
        img.onerror = () => this.onResourceLoaded(key); // Still count as loaded even if failed
        img.src = url;
    }
    
    loadStylesheet(element, key) {
        if (element.sheet || element.readyState === 'complete') {
            this.onResourceLoaded(key);
        } else {
            element.onload = () => this.onResourceLoaded(key);
            element.onerror = () => this.onResourceLoaded(key);
        }
    }
    
    onResourceLoaded(key) {
        if (this.resources.has(key)) {
            this.resources.get(key).loaded = true;
        }
        
        this.loadedResources++;
        this.updateProgress();
        this.checkComplete();
    }
    
    updateProgress() {
        const progress = this.totalResources > 0 ? (this.loadedResources / this.totalResources) * 100 : 0;
        
        if (this.progressElement) {
            this.progressElement.style.width = `${progress}%`;
        }
        
        this.updateStatus(`Loading... ${Math.round(progress)}%`);
    }
    
    updateStatus(status) {
        if (this.statusElement) {
            this.statusElement.textContent = status;
        }
    }
    
    checkComplete() {
        if (this.isComplete) return;
        
        const allLoaded = this.loadedResources >= this.totalResources && this.totalResources > 0;
        const documentReady = document.readyState === 'complete';
        
        if (allLoaded && documentReady) {
            this.isComplete = true;
            this.updateStatus('Complete!');
            this.updateProgress(); // Ensure 100% is shown
            
            setTimeout(() => {
                this.callbacks.forEach(callback => callback());
            }, 300);
        } else if (this.totalResources === 0 && documentReady) {
            // Fallback if no resources to track
            setTimeout(() => {
                this.isComplete = true;
                this.updateStatus('Ready!');
                this.callbacks.forEach(callback => callback());
            }, 1000);
        }
    }
    
    // Method to track JSON/data loading
    trackDataLoading(name) {
        this.addResource('data', name);
        return (success = true) => {
            this.onResourceLoaded(`data:${name}`);
        };
    }
    
    onComplete(callback) {
        if (this.isComplete) {
            callback();
        } else {
            this.callbacks.push(callback);
        }
    }
    
    getProgress() {
        return this.totalResources > 0 ? (this.loadedResources / this.totalResources) * 100 : 0;
    }
}

// Create global loading manager
window.loadingManager = new LoadingManager();

// Loading screen handler
const showLoadingScreen = () => {
    const loadingScreen = $('#loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
};

const hideLoadingScreen = () => {
    const loadingScreen = $('#loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 300);
    }
};

// Local storage utilities
const storage = {
    get: (key) => {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch {
            return null;
        }
    },
    
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch {
            return false;
        }
    },
    
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch {
            return false;
        }
    }
};

// Performance monitoring
const performanceMonitor = {
    startTime: performance.now(),
    
    mark: (name) => {
        performance.mark(name);
    },
    
    measure: (name, startMark, endMark) => {
        performance.measure(name, startMark, endMark);
    },
    
    getLoadTime: () => {
        return performance.now() - performanceMonitor.startTime;
    }
};

// Error handling
const errorHandler = (error, context = '') => {
    console.error(`Error in ${context}:`, error);
    
    // In production, you might want to send this to an error tracking service
    if (window.location.hostname !== 'localhost') {
        // Send to error tracking service
    }
};

// Export utilities for use in other modules
window.utils = {
    $,
    $$,
    ready,
    debounce,
    throttle,
    createElement,
    createScrollObserver,
    animateNumber,
    random,
    randomElement,
    formatDate,
    smoothScrollTo,
    isInViewport,
    typeWriter,
    createParticle,
    showLoadingScreen,
    hideLoadingScreen,
    storage,
    performanceMonitor,
    errorHandler
};
