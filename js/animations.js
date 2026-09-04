/**
 * Scroll Animation Handler for Siya Tours
 * Triggers animations when elements come into viewport
 */

(function() {
    'use strict';

    // Animation Observer Configuration
    const animationConfig = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Initialize animations on DOM ready
    function initAnimations() {
        // Check if Intersection Observer is supported
        if ('IntersectionObserver' in window) {
            observeElements();
        } else {
            // Fallback for older browsers
            fallbackAnimation();
        }

        // Initialize other animations
        initHoverAnimations();
        initCounterAnimations();
        initParallaxEffect();
    }

    // Observe elements for scroll animations
    function observeElements() {
        const observer = new IntersectionObserver(handleIntersection, animationConfig);

        // Select all elements to animate
        const animatedElements = document.querySelectorAll(
            '.animate-on-scroll, .fade-up, .fade-left, .fade-right, ' +
            '.scale-in, .bounce-in, .rotate-in, .flip-in, .slide-down, ' +
            '.zoom-in-subtle, .reveal-section, .stagger-item'
        );

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Handle intersection (element entering viewport)
    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add animated class
                element.classList.add('animated', 'revealed');
                
                // Add visible class for custom handling
                element.style.opacity = '1';
                
                // Stop observing after animation
                observer.unobserve(element);
            }
        });
    }

    // Fallback for browsers without Intersection Observer
    function fallbackAnimation() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        function checkScroll() {
            animatedElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementTop < windowHeight - 100) {
                    element.classList.add('animated', 'revealed');
                    element.style.opacity = '1';
                }
            });
        }

        window.addEventListener('scroll', throttle(checkScroll, 100));
        checkScroll(); // Check on load
    }

    // Throttle function for performance
    function throttle(func, wait) {
        let timeout;
        return function(...args) {
            if (!timeout) {
                timeout = setTimeout(() => {
                    func.apply(this, args);
                    timeout = null;
                }, wait);
            }
        };
    }

    // Initialize hover animations
    function initHoverAnimations() {
        // Add hover classes to cards
        const cards = document.querySelectorAll('.single-service, .single-review, .single-element');
        cards.forEach(card => {
            if (!card.classList.contains('animated-card')) {
                card.classList.add('animated-card', 'hover-lift');
            }
        });

        // Add hover effects to images
        const images = document.querySelectorAll('.img-fluid');
        images.forEach(img => {
            const parent = img.parentElement;
            if (parent && !parent.classList.contains('animated-image')) {
                parent.classList.add('animated-image');
            }
        });

        // Add hover effects to buttons
        const buttons = document.querySelectorAll('.primary-btn, .btn');
        buttons.forEach(button => {
            if (!button.classList.contains('animated-button')) {
                button.classList.add('animated-button');
            }
        });
    }

    // Initialize counter animations
    function initCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        if (counters.length === 0) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    // Animate counter
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // Initialize parallax effect
    function initParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        if (parallaxElements.length === 0) return;

        function updateParallax() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-speed') || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }

        window.addEventListener('scroll', throttle(updateParallax, 10));
    }

    // Stagger animation for lists
    function initStaggerAnimation() {
        const staggerContainers = document.querySelectorAll('[data-stagger]');
        
        staggerContainers.forEach(container => {
            const items = container.children;
            const delay = parseInt(container.getAttribute('data-stagger')) || 100;
            
            Array.from(items).forEach((item, index) => {
                item.classList.add('stagger-item');
                item.style.animationDelay = `${index * delay}ms`;
            });
        });
    }

    // Add animation to navigation on scroll
    function initNavAnimation() {
        const header = document.querySelector('.default-header');
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 500) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScroll = currentScroll;
        });
    }

    // Animate elements on page load
    function animateOnLoad() {
        // Animate banner content
        const bannerContent = document.querySelector('.banner-content');
        if (bannerContent) {
            bannerContent.classList.add('fade-up');
        }

        // Animate section titles
        const sectionTitles = document.querySelectorAll('.section-title');
        sectionTitles.forEach((title, index) => {
            title.classList.add('fade-up');
            title.style.animationDelay = `${index * 0.2}s`;
        });
    }

    // Add smooth scroll behavior
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href !== '#' && href !== '') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    }

    // Add loading animation
    function initLoadingAnimation() {
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
            
            // Remove any loading spinners
            const loaders = document.querySelectorAll('.loading-spinner');
            loaders.forEach(loader => {
                loader.style.display = 'none';
            });
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initAnimations();
            initStaggerAnimation();
            initNavAnimation();
            animateOnLoad();
            initSmoothScroll();
            initLoadingAnimation();
        });
    } else {
        initAnimations();
        initStaggerAnimation();
        initNavAnimation();
        animateOnLoad();
        initSmoothScroll();
        initLoadingAnimation();
    }

    // Re-initialize animations on dynamic content load
    window.reinitAnimations = function() {
        initAnimations();
        initHoverAnimations();
    };

    // Add CSS for navigation animation
    const style = document.createElement('style');
    style.textContent = `
        .default-header {
            transition: transform 0.3s ease, background 0.3s ease;
        }
        
        .default-header.scrolled {
            background: rgba(255, 255, 255, 0.95);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        body {
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        body.loaded {
            opacity: 1;
        }

        /* Ensure elements are hidden before animation */
        .animate-on-scroll,
        .fade-up,
        .fade-left,
        .fade-right,
        .scale-in,
        .bounce-in,
        .rotate-in,
        .flip-in,
        .slide-down,
        .zoom-in-subtle,
        .reveal-section,
        .stagger-item {
            opacity: 0;
        }

        .animate-on-scroll.animated,
        .fade-up.animated,
        .fade-left.animated,
        .fade-right.animated,
        .scale-in.animated,
        .bounce-in.animated,
        .rotate-in.animated,
        .flip-in.animated,
        .slide-down.animated,
        .zoom-in-subtle.animated,
        .reveal-section.revealed,
        .stagger-item.animated {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

})();
