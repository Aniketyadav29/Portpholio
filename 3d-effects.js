// ============================================================================
// RESUME MODAL LOGIC (Simplified & Bulletproof)
// ============================================================================

const resumeButton = document.getElementById('downloadResume');
const resumeModal = document.getElementById('resumeModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// 1. Open Modal when Hero button is clicked
if (resumeButton && resumeModal) {
    resumeButton.addEventListener('click', (e) => {
        e.preventDefault();
        resumeModal.style.display = 'flex'; // Uses flex to center the forced inline styles
    });
}

// 2. Close Modal via the 'X' Button
if (closeModalBtn && resumeModal) {
    closeModalBtn.addEventListener('click', () => {
        resumeModal.style.display = 'none';
    });
}

// 3. Close Modal by clicking anywhere outside the image
if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
        // Only close if they clicked the dark background, not the image or download button
        if (e.target === resumeModal) {
            resumeModal.style.display = 'none';
        }
    });
}

// ============================================================================
// PERFORMANCE TUNED SCROLL HANDLER
// ============================================================================

function highlightActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    let isTicking = false;
    
    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                let currentSectionId = '';
                const currentScrollY = window.scrollY;
                
                document.querySelectorAll('section').forEach(section => {
                    const sectionTopOffset = section.offsetTop;
                    if (currentScrollY >= sectionTopOffset - 260) {
                        currentSectionId = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href').slice(1) === currentSectionId) {
                        link.classList.add('active');
                    }
                });
                isTicking = false;
            });
            isTicking = true;
        }
    });
}
highlightActiveNavLink();

// Smooth Scroll Anchor Logic
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const destination = this.getAttribute('href');
        if (destination !== '#') {
            e.preventDefault();
            const element = document.querySelector(destination);
            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================================================
// SYSTEM CORE INTERACTION LOGIC
// ============================================================================

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #ffa500; color: #000; font-weight: 600;
        padding: 0.9rem 1.4rem; border-radius: 6px; z-index: 2500; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        font-size: 0.9rem; font-family: sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => { notification.remove(); }, 3000);
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        showNotification('✓ Communication package processed successfully! I will reply shortly.');
        this.reset();
    });
}

// ============================================================================
// HORIZONTAL 3D TRACK SCROLL LOGIC
// ============================================================================
const horizontalWrapper = document.querySelector('.projects-horizontal-wrapper');

if (horizontalWrapper) {
    // Allows users to use their normal mouse wheel to scroll left/right smoothly
    horizontalWrapper.addEventListener('wheel', (evt) => {
        // Only prevent default if scrolling over the track to avoid locking the whole page
        if (evt.deltaY !== 0) {
            evt.preventDefault();
            horizontalWrapper.scrollLeft += evt.deltaY * 1.5; // Multiplier adjusts scroll speed
        }
    });
}

// Counter Element Interpolation
function animateCounters() {
    const metrics = document.querySelectorAll('.stat-item h3');
    let triggered = false;

    const tracker = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !triggered) {
                triggered = true;
                metrics.forEach(metric => {
                    const maximumValue = parseInt(metric.textContent);
                    if (!isNaN(maximumValue)) {
                        let currentStart = 0;
                        const duration = 1200;
                        const interval = Math.floor(duration / maximumValue);
                        const counterTimer = setInterval(() => {
                            currentStart++;
                            metric.textContent = currentStart + '+';
                            if (currentStart >= maximumValue) clearInterval(counterTimer);
                        }, interval);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    const targetSection = document.querySelector('.stats');
    if (targetSection) tracker.observe(targetSection);
}

document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
    
    // VanillaTilt Initialization Safety Hook
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), { max: 12, speed: 400, scale: 1.02 });
    }
});

// Floating Engine Control Mappings
const layoutToggleBtn = document.querySelector('.floating-nav .toggle-3d');
if (layoutToggleBtn) {
    layoutToggleBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        const isActive = this.classList.contains('active');
        if (isActive) document.body.classList.remove('flat-mode');
        else document.body.classList.add('flat-mode');
        if (typeof window.refresh3DLayouts === 'function') window.refresh3DLayouts();
    });
}
if (document.querySelectorAll('.floating-nav .float-btn').length > 0) {
    document.querySelectorAll('.floating-nav .float-btn')[0].addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}