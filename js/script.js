// ==========================================
// DARK PORTFOLIO - JavaScript
// Mobile menu + Smooth interactions
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // Mobile Menu Toggle
    // ==========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
            
            // Animate hamburger
            const spans = this.querySelectorAll('span');
            if (this.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // ==========================================
    // Language Selector
    // ==========================================
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove focus to prevent persistent highlight
            this.blur();
            
            // Remove active class from all buttons
            langButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get selected language
            const selectedLang = this.getAttribute('data-lang');
            
            // Update HTML lang attribute
            document.documentElement.setAttribute('lang', selectedLang);
            
            // Store preference in localStorage
            localStorage.setItem('preferredLanguage', selectedLang);
            
            // TODO: Future implementation - load translations
            console.log('Language changed to:', selectedLang);
            
            // Optional: Show a subtle notification
            // showLanguageChangeNotification(selectedLang);
        });
    });
    
    // Load saved language preference on page load
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) {
        const savedButton = document.querySelector(`.lang-btn[data-lang="${savedLang}"]`);
        if (savedButton) {
            langButtons.forEach(btn => btn.classList.remove('active'));
            savedButton.classList.add('active');
            document.documentElement.setAttribute('lang', savedLang);
        }
    }
    
    // ==========================================
    // Smooth Scroll for Navigation Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // ==========================================
    // Header Background on Scroll
    // ==========================================
    const header = document.querySelector('.site-header');
    
    function handleHeaderScroll() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 14, 39, 0.95)';
            header.style.boxShadow = '0 4px 16px rgba(0, 217, 255, 0.2)';
        } else {
            header.style.background = 'rgba(10, 14, 39, 0.8)';
            header.style.boxShadow = 'none';
        }
    }
    
    window.addEventListener('scroll', handleHeaderScroll);
    
    // ==========================================
    // Active Navigation Link on Scroll
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.style.color = 'var(--color-text-secondary)');
                if (navLink) {
                    navLink.style.color = 'var(--color-text-primary)';
                }
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // ==========================================
    // Intersection Observer for Fade-in Animations
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeElements = document.querySelectorAll('.project-card, .stat-item, .contact-item');
    
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);
                
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
    
    // ==========================================
    // Form Submission (Demo)
    // ==========================================
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            
            // Show success message
            showNotification(`Grazie ${name}! Ti risponderò presto.`);
            
            // Reset form
            this.reset();
        });
    }
    
    // ==========================================
    // Show Notification
    // ==========================================
    function showNotification(message) {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 8px 32px rgba(139, 92, 246, 0.4);
            z-index: 10000;
            font-size: 0.938rem;
            font-weight: 600;
            animation: slideInUp 0.4s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutDown 0.4s ease';
            setTimeout(() => notification.remove(), 400);
        }, 3000);
    }
    
    // ==========================================
    // Add Animation Keyframes
    // ==========================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutDown {
            from {
                transform: translateY(0);
                opacity: 1;
            }
            to {
                transform: translateY(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // ==========================================
    // Performance: Debounce Scroll Events
    // ==========================================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    const debouncedHighlight = debounce(highlightNavigation, 100);
    const debouncedHeader = debounce(handleHeaderScroll, 100);
    
    window.removeEventListener('scroll', highlightNavigation);
    window.removeEventListener('scroll', handleHeaderScroll);
    window.addEventListener('scroll', debouncedHighlight);
    window.addEventListener('scroll', debouncedHeader);
    
    // ==========================================
    // Console Message
    // ==========================================
    console.log('%c🌊 OceanHub Loaded', 'color: #00d9ff; font-size: 16px; font-weight: bold;');
    console.log('%cDiscord Community 🎮', 'color: #0099ff; font-size: 12px;');
});