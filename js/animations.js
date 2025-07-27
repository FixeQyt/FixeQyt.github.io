// Animation controller for scroll-triggered and interactive animations

class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animations = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupTypewriterAnimations();
        this.setupParallaxEffects();
        this.setupHoverAnimations();
    }

    // Setup scroll-triggered animations
    setupScrollAnimations() {
        const observer = utils.createScrollObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerAnimation(entry.target);
                }
            });
        }, { threshold: 0.1 });

        // Store observer for later use
        this.scrollObserver = observer;

        // Elements to animate on scroll (initial setup)
        this.setupInitialAnimations();
    }

    // Setup initial animations for existing elements
    setupInitialAnimations() {
        const animateElements = utils.$$('.animate-on-scroll, .skill-category, .project-card, .about-visual, .stat-item');
        
        animateElements.forEach(element => {
            element.classList.add('animate-on-scroll');
            if (this.scrollObserver) {
                this.scrollObserver.observe(element);
            }
        });

        this.observers.set('scroll', this.scrollObserver);
    }

    // Refresh animations for dynamically added elements
    refreshScrollAnimations() {
        if (CONFIG.DEBUG) {
            console.log('Refreshing scroll animations...');
        }
        
        // Find new elements that need animation
        const newElements = utils.$$('.skill-category, .project-card');
        
        newElements.forEach(element => {
            if (!element.classList.contains('animate-on-scroll')) {
                element.classList.add('animate-on-scroll');
                
                // Check if element is in view immediately
                if (utils.isInViewport(element, 0.1)) {
                    if (CONFIG.DEBUG) {
                        console.log('Element is in viewport, triggering animation:', element);
                    }
                    this.triggerAnimation(element);
                } else {
                    // Observe for future scroll
                    if (this.scrollObserver) {
                        this.scrollObserver.observe(element);
                    }
                }
            }
        });
    }

    // Setup counter animations
    setupCounterAnimations() {
        const counterObserver = utils.createScrollObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const targetNumber = parseInt(target.dataset.target);
                    
                    if (targetNumber && !target.dataset.animated) {
                        target.dataset.animated = 'true';
                        this.animateCounter(target, targetNumber);
                    }
                }
            });
        }, { threshold: 0.5 });

        const counters = utils.$$('.stat-number[data-target]');
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

        this.observers.set('counter', counterObserver);
    }

    // Setup typewriter animations
    setupTypewriterAnimations() {
        const typewriterElement = utils.$('#typewriter');
        if (typewriterElement) {
            const texts = [
                'Full Stack Developer',
                'FixeQ',
                'Node.js Expert',
                'Python Developer',
                'Java Developer',
                'Arch Linux User'
            ];
            
            this.startTypewriterCycle(typewriterElement, texts);
        }
    }

    // Setup parallax effects
    setupParallaxEffects() {
        if (this.isReducedMotion) return;

        const parallaxElements = utils.$$('[data-parallax]');
        
        const handleScroll = utils.throttle(() => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const rate = element.dataset.parallax || 0.5;
                const yPos = -(scrolled * rate);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }

    // Setup hover animations
    setupHoverAnimations() {
        // Skill icons pulse on hover
        const skillIcons = utils.$$('.tech-icon, .skill-3d-icon');
        skillIcons.forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                if (!this.isReducedMotion) {
                    icon.style.animation = 'techPulse 0.6s ease-in-out';
                }
            });
            
            icon.addEventListener('animationend', () => {
                icon.style.animation = '';
            });
        });

        // Project cards 3D hover effect
        const projectCards = utils.$$('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                if (this.isReducedMotion) return;
                
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * 10;
                const rotateY = (centerX - x) / centerX * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });

        // Button shine effect
        const buttons = utils.$$('.btn');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (this.isReducedMotion) return;
                
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Trigger animation for element
    triggerAnimation(element) {
        if (!element.classList.contains('in-view')) {
            element.classList.add('in-view');
            
            // Special handling for different element types
            if (element.classList.contains('skill-category')) {
                this.animateSkillBars(element);
            }
            
            if (element.classList.contains('code-line')) {
                this.animateCodeLines(element.parentElement);
            }
        }
    }

    // Animate skill progress bars
    animateSkillBars(skillCategory) {
        const progressBars = skillCategory.querySelectorAll('.progress-fill');
        
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const level = bar.parentElement.previousElementSibling.querySelector('.tech-level').textContent;
                const percentage = parseInt(level) + '%';
                bar.style.width = percentage;
            }, index * 200);
        });
    }

    // Animate code lines
    animateCodeLines(codeContainer) {
        const codeLines = codeContainer.querySelectorAll('.code-line');
        
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, index * 150);
        });
    }

    // Animate counter
    animateCounter(element, target) {
        const start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = target + (element.dataset.suffix || '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.dataset.suffix || '+');
            }
        }, 16);
    }

    // Typewriter cycle
    startTypewriterCycle(element, texts) {
        let currentIndex = 0;
        
        const typeText = (text) => {
            return new Promise(resolve => {
                let i = 0;
                element.textContent = '';
                
                const type = () => {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        setTimeout(type, 100);
                    } else {
                        setTimeout(resolve, 2000);
                    }
                };
                
                type();
            });
        };
        
        const eraseText = () => {
            return new Promise(resolve => {
                const text = element.textContent;
                let i = text.length;
                
                const erase = () => {
                    if (i > 0) {
                        element.textContent = text.substring(0, i - 1);
                        i--;
                        setTimeout(erase, 50);
                    } else {
                        setTimeout(resolve, 500);
                    }
                };
                
                erase();
            });
        };
        
        const cycle = async () => {
            await typeText(texts[currentIndex]);
            await eraseText();
            currentIndex = (currentIndex + 1) % texts.length;
            cycle();
        };
        
        cycle();
    }

    // Create floating particles
    createFloatingParticles(container, count = 20) {
        if (this.isReducedMotion) return;
        
        for (let i = 0; i < count; i++) {
            const particle = utils.createElement('div', {
                className: 'floating-particle',
                style: `
                    position: absolute;
                    width: ${utils.random(2, 6)}px;
                    height: ${utils.random(2, 6)}px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    pointer-events: none;
                    left: ${utils.random(0, 100)}%;
                    top: ${utils.random(0, 100)}%;
                    animation: particleFloat ${utils.random(10, 20)}s infinite linear;
                    animation-delay: ${utils.random(0, 5)}s;
                    opacity: ${utils.random(0.3, 0.8)};
                `
            });
            
            container.appendChild(particle);
        }
    }

    // Glitch effect for text
    glitchText(element, duration = 1000) {
        if (this.isReducedMotion) return;
        
        const originalText = element.textContent;
        const glitchChars = '!<>-_\\/[]{}—=+*^?#________';
        
        let iterations = 0;
        const maxIterations = duration / 30;
        
        const glitch = () => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                })
                .join('');
            
            if (iterations < originalText.length) {
                iterations += 1/3;
                setTimeout(glitch, 30);
            } else {
                element.textContent = originalText;
            }
        };
        
        glitch();
    }

    // Matrix rain effect
    createMatrixRain(container) {
        if (this.isReducedMotion) return;
        
        const columns = Math.floor(container.offsetWidth / 20);
        const matrix = '01';
        
        for (let i = 0; i < columns; i++) {
            const drop = utils.createElement('div', {
                className: 'matrix-drop',
                style: `
                    position: absolute;
                    left: ${i * 20}px;
                    top: -20px;
                    color: var(--accent-tertiary);
                    font-family: monospace;
                    font-size: 14px;
                    animation: matrixRain ${utils.random(3, 8)}s linear infinite;
                    animation-delay: ${utils.random(0, 5)}s;
                `,
                innerHTML: matrix[Math.floor(Math.random() * matrix.length)]
            });
            
            container.appendChild(drop);
        }
    }

    // Destroy all animations
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        this.animations.clear();
    }

    // Pause all animations
    pause() {
        document.documentElement.style.setProperty('--animation-play-state', 'paused');
    }

    // Resume all animations
    resume() {
        document.documentElement.style.setProperty('--animation-play-state', 'running');
    }
}

// Initialize animation controller
utils.ready(() => {
    window.animationController = new AnimationController();
});

// Export for external use
window.AnimationController = AnimationController;
