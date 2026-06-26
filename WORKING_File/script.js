// ============================================================================
// RESUME MODAL LOGIC (Simplified & Bulletproof)
// ============================================================================

const resumeButton = document.getElementById('downloadResume');
const resumeModal = document.getElementById('resumeModal');
const closeModalBtn = document.getElementById('closeModalBtn');

if (resumeButton && resumeModal) {
    resumeButton.addEventListener('click', (e) => {
        e.preventDefault();
        resumeModal.style.display = 'flex';
    });
}
if (closeModalBtn && resumeModal) {
    closeModalBtn.addEventListener('click', () => {
        resumeModal.style.display = 'none';
    });
}
if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
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
// NEW FLAT PROJECT SLIDER LOGIC 
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.projects-track');
    const slides = Array.from(document.querySelectorAll('.project-slide'));
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dashes = Array.from(document.querySelectorAll('.dash'));

    if (!track || slides.length === 0) return;

    let currentIndex = 0;

    const updateSlider = (index) => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = 30;
        const amountToMove = (slideWidth + gap) * index;
        
        track.style.transform = 'translateX(-' + amountToMove + 'px)';

        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');

        dashes.forEach(dash => dash.classList.remove('active'));
        if(dashes[index]) dashes[index].classList.add('active');
    };

    if(nextButton) {
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % slides.length;
            updateSlider(currentIndex);
        });
    }
    if(prevButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            updateSlider(currentIndex);
        });
    }
    dashes.forEach((dash, idx) => {
        dash.addEventListener('click', () => {
            currentIndex = idx;
            updateSlider(currentIndex);
        });
    });
    
    window.addEventListener('resize', () => {
        updateSlider(currentIndex);
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
    
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), { max: 12, speed: 400, scale: 1.02 });
    }

    // Skill category filters switch to the grid so the selected results are visible.
    const filterBtns = document.querySelectorAll('.filter-btn');
    const skillCards = document.querySelectorAll('.skills-container .skill-item');

    const applySkillFilter = (selectedFilter) => {
        document.body.classList.add('flat-mode');

        const layoutToggle = document.querySelector('.floating-nav .toggle-3d');
        if (layoutToggle) layoutToggle.classList.remove('active');

        skillCards.forEach(card => {
            const categories = (card.dataset.categories || '').split(' ').filter(Boolean);
            const isVisible = selectedFilter === 'all' || categories.includes(selectedFilter);
            card.classList.toggle('is-hidden', !isVisible);
            card.setAttribute('aria-hidden', String(!isVisible));
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedFilter = btn.dataset.filter || 'all';

            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });

            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            applySkillFilter(selectedFilter);
        });
    });

    const credentialFilters = document.querySelectorAll('.credential-filter');
    const credentialCards = document.querySelectorAll('.credential-card[data-credential-type]');

    credentialFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedFilter = btn.dataset.credentialFilter || 'all';

            credentialFilters.forEach(filter => {
                filter.classList.remove('active');
                filter.setAttribute('aria-pressed', 'false');
            });

            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            credentialCards.forEach(card => {
                const isVisible = selectedFilter === 'all' || card.dataset.credentialType === selectedFilter;
                card.classList.toggle('is-hidden', !isVisible);
                card.setAttribute('aria-hidden', String(!isVisible));
            });
        });
    });
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
