// Main JavaScript for Meu Site de Tudo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Site carregado com sucesso!');
    
    // Hide loading overlay
    hideLoadingOverlay();
    
    // Initialize site functionality
    initializeAuth();
    initializeUI();
    initializeAnimations();
    initializePerformanceMonitoring();
    
    // Show welcome notification for first-time visitors
    if (!localStorage.getItem('hasVisited')) {
        setTimeout(() => {
            showNotification('Bem-vindo ao Meu Site de Tudo! 🎉', 'success');
            localStorage.setItem('hasVisited', 'true');
        }, 1000);
    }
});

// Loading overlay management
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('hidden');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }, 800);
    }
}

function showLoadingOverlay(text = 'Carregando...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        const loadingText = overlay.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = text;
        }
        overlay.style.display = 'flex';
        overlay.classList.remove('hidden');
    }
}

// Authentication management with Firebase integration
function initializeAuth() {
    const userInfo = document.getElementById('userInfo');
    const loginPrompt = document.getElementById('loginPrompt');
    const logoutBtn = document.getElementById('logoutBtn');
    const linkAccountBtn = document.getElementById('linkAccountBtn');
    
    // Listen for Firebase auth state changes
    window.addEventListener('firebaseAuthStateChanged', function(event) {
        const { user, isLoggedIn } = event.detail;
        
        if (isLoggedIn && user) {
            showUserInfo();
            updateUserDisplay(user);
            
            // Show link account button for anonymous users
            if (user.isAnonymous && linkAccountBtn) {
                linkAccountBtn.style.display = 'inline-block';
            } else if (linkAccountBtn) {
                linkAccountBtn.style.display = 'none';
            }
            
            showNotification(`Bem-vindo, ${user.name}! 👋`, 'success');
        } else {
            showLoginPrompt();
            if (linkAccountBtn) {
                linkAccountBtn.style.display = 'none';
            }
        }
    });
    
    // Logout functionality with Firebase
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            showLoadingOverlay('Fazendo logout...');
            
            if (window.firebaseAuthFunctions) {
                const result = await window.firebaseAuthFunctions.signOutUser();
                if (result.success) {
                    showNotification(result.message, 'success');
                } else {
                    showNotification(result.message, 'error');
                }
            } else {
                // Fallback for localStorage-only mode
                localStorage.removeItem('userLoggedIn');
                localStorage.removeItem('userData');
                showLoginPrompt();
                showNotification('Logout realizado com sucesso!', 'success');
            }
            
            hideLoadingOverlay();
        });
    }
    
    // Link Google account functionality
    if (linkAccountBtn) {
        linkAccountBtn.addEventListener('click', async function() {
            if (!window.firebaseAuthFunctions) return;
            
            showLoadingOverlay('Vinculando conta Google...');
            
            const result = await window.firebaseAuthFunctions.linkGoogleAccount();
            if (result.success) {
                showNotification(result.message, 'success');
                linkAccountBtn.style.display = 'none';
            } else {
                showNotification(result.message, 'error');
            }
            
            hideLoadingOverlay();
        });
    }
    
    // Check initial auth state (fallback for localStorage)
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (isLoggedIn) {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.name) {
            showUserInfo();
            updateUserDisplay(userData);
        }
    } else {
        showLoginPrompt();
    }
}

function showUserInfo() {
    const userInfo = document.getElementById('userInfo');
    const loginPrompt = document.getElementById('loginPrompt');
    
    if (userInfo && loginPrompt) {
        userInfo.style.display = 'flex';
        loginPrompt.style.display = 'none';
        
        // Load user data from localStorage (placeholder)
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        updateUserDisplay(userData);
    }
}

function showLoginPrompt() {
    const userInfo = document.getElementById('userInfo');
    const loginPrompt = document.getElementById('loginPrompt');
    
    if (userInfo && loginPrompt) {
        userInfo.style.display = 'none';
        loginPrompt.style.display = 'block';
    }
}

function updateUserDisplay(userData) {
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const profileInitials = document.getElementById('profileInitials');
    const profileImage = document.getElementById('profileImage');
    
    if (userData.name && userName) {
        // Show "Visitante" for anonymous users or actual name
        const displayName = userData.isAnonymous ? 'Visitante' : userData.name;
        userName.textContent = displayName;
    }
    
    if (userData.email && userEmail) {
        // Show appropriate email or "Acesso Temporário" for anonymous
        const displayEmail = userData.isAnonymous ? 'Acesso Temporário' : userData.email;
        userEmail.textContent = displayEmail;
    }
    
    if (profileInitials) {
        if (userData.isAnonymous) {
            profileInitials.textContent = 'V'; // V for Visitante
            profileInitials.style.background = 'linear-gradient(45deg, #6b7280 0%, #4b5563 100%)';
        } else if (userData.name) {
            const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
            profileInitials.textContent = initials;
            profileInitials.style.background = 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)';
        }
    }
    
    if (userData.photo && profileImage && !userData.isAnonymous) {
        profileImage.src = userData.photo;
        profileImage.style.display = 'block';
        if (profileInitials) {
            profileInitials.style.display = 'none';
        }
    } else {
        profileImage.style.display = 'none';
        if (profileInitials) {
            profileInitials.style.display = 'flex';
        }
    }
}

// UI enhancements
function initializeUI() {
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Enhanced loading states for external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const btn = this;
            const originalText = btn.textContent;
            const originalClasses = btn.className;
            
            // Add loading state
            btn.classList.add('loading');
            btn.textContent = 'Abrindo...';
            
            // Track click for analytics
            trackEvent('external_link_click', {
                url: btn.href,
                text: originalText
            });
            
            setTimeout(() => {
                btn.className = originalClasses;
                btn.textContent = originalText;
            }, 2000);
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        // ESC key closes any open modals
        if (e.key === 'Escape') {
            closeAllModals();
        }
        
        // Add accessibility for tab navigation
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Add touch support detection
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
    }
    
    // Initialize card interactions
    initializeCardInteractions();
}

// Animation enhancements
function initializeAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        document.body.classList.add('reduced-motion');
        return;
    }
    
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add slight delay for staggered animation
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and sections
    document.querySelectorAll('.card, .hero, .sections').forEach(el => {
        observer.observe(el);
    });
    
    // Add parallax effect to hero section (only on desktop)
    if (window.innerWidth > 768) {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.1}px)`;
            }
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle && heroTitle.classList.contains('typing-effect')) {
        setTimeout(() => {
            heroTitle.style.borderRight = 'none';
        }, 4000);
    }
}

// Card interaction enhancements
function initializeCardInteractions() {
    document.querySelectorAll('.card').forEach(card => {
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') return; // Don't add ripple to links
            
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

// Performance monitoring
function initializePerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        
        console.log(`Tempo de carregamento: ${loadTime}ms`);
        
        // Send analytics if load time is too high
        if (loadTime > 3000) {
            console.warn('Carregamento lento detectado');
        }
    });
    
    // Monitor resource loading
    new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.transferSize === 0) {
                console.log(`Recurso carregado do cache: ${entry.name}`);
            }
        }
    }).observe({ entryTypes: ['resource'] });
}

// Analytics and tracking
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log(`Event: ${eventName}`, properties);
    
    // You can integrate with Google Analytics, Mixpanel, etc.
    // gtag('event', eventName, properties);
}

// Accessibility improvements
function initializeAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Pular para o conteúdo principal';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 9999;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add aria-labels where missing
    document.querySelectorAll('.btn:not([aria-label])').forEach(btn => {
        if (!btn.getAttribute('aria-label')) {
            btn.setAttribute('aria-label', btn.textContent.trim());
        }
    });
}

// Call accessibility improvements
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 
                     type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 
                     'rgba(59, 130, 246, 0.9)'};
        color: white;
        border-radius: 8px;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        z-index: 1000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        font-size: 14px;
        font-weight: 500;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function closeAllModals() {
    // Function to close any open modals (placeholder for future use)
    console.log('Closing modals...');
}

// Performance optimization
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

// Error handling
window.addEventListener('error', function(e) {
    console.error('Erro capturado:', e.error);
    showNotification('Ocorreu um erro. Tente recarregar a página.', 'error');
});

// Service Worker registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(function(registrationError) {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}
