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
        }, 1000);
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
