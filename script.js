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
// NAVBAR SECTION ROUTER
// ============================================================================

const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const routedSections = Array.from(document.querySelectorAll('.content-section[data-page]'));
const knownPages = new Set(navLinks.map(link => link.getAttribute('href').replace('#', '').toLowerCase()));

function showPortfolioPage(page, shouldUpdateHash = true) {
    const nextPage = knownPages.has(page) ? page : 'home';
    document.body.dataset.page = nextPage;
    document.body.classList.remove('page-home', 'page-about', 'page-projects', 'page-skills', 'page-credentials', 'page-contact');
    document.body.classList.add('page-' + nextPage);

    routedSections.forEach(section => {
        const sectionPages = (section.dataset.page || '').split(' ').filter(Boolean);
        const isActive = sectionPages.includes(nextPage);
        section.classList.toggle('is-active', isActive);
        section.setAttribute('aria-hidden', String(!isActive));
    });

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').replace('#', '').toLowerCase();
        link.classList.toggle('active', linkPage === nextPage);
    });

    if (shouldUpdateHash && window.location.hash !== '#' + nextPage) {
        history.pushState(null, '', '#' + nextPage);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (nextPage === 'skills' && typeof window.refresh3DLayouts === 'function') {
        window.refresh3DLayouts();
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const page = link.getAttribute('href').replace('#', '').toLowerCase();
        if (!knownPages.has(page)) return;

        e.preventDefault();
        showPortfolioPage(page);
    });
});

window.addEventListener('hashchange', () => {
    const page = window.location.hash.replace('#', '').toLowerCase() || 'home';
    showPortfolioPage(page, false);
});

document.addEventListener('DOMContentLoaded', () => {
    const page = window.location.hash.replace('#', '').toLowerCase() || 'home';
    showPortfolioPage(page, false);
});

// ============================================================================
// NEW FLAT PROJECT SLIDER LOGIC 
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    const viewport = document.querySelector('.projects-slider-viewport');
    const track = document.querySelector('.projects-track');
    const slides = Array.from(document.querySelectorAll('.project-slide'));
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
    const dashes = Array.from(document.querySelectorAll('.dash'));

    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let lastProjectDragAt = 0;

    const updateSlider = (index) => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(track).gap) || 24;
        const amountToMove = (slideWidth + gap) * index;
        
        track.style.transform = 'translateX(-' + amountToMove + 'px)';

        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');

        dashes.forEach(dash => dash.classList.remove('active'));
        if(dashes[index]) dashes[index].classList.add('active');
    };

    const goToNextSlide = () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateSlider(currentIndex);
    };

    const goToPreviousSlide = () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateSlider(currentIndex);
    };

    if(nextButton) {
        nextButton.addEventListener('click', goToNextSlide);
    }
    if(prevButton) {
        prevButton.addEventListener('click', goToPreviousSlide);
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

    if (viewport) {
        let dragStartX = 0;
        let dragStartY = 0;
        let isDragging = false;
        let wheelLocked = false;
        let pointerDownSlide = null;

        viewport.addEventListener('pointerdown', (event) => {
            isDragging = true;
            dragStartX = event.clientX;
            dragStartY = event.clientY;
            pointerDownSlide = event.target.closest('.project-slide');
            viewport.classList.add('is-dragging');
            viewport.setPointerCapture(event.pointerId);
        });

        viewport.addEventListener('pointerup', (event) => {
            if (!isDragging) return;
            isDragging = false;
            viewport.classList.remove('is-dragging');
            viewport.releasePointerCapture(event.pointerId);

            const dragDistanceX = event.clientX - dragStartX;
            const dragDistanceY = event.clientY - dragStartY;
            const totalMovement = Math.hypot(dragDistanceX, dragDistanceY);

            const landedOnLink = event.target.closest('a');

            if (Math.abs(dragDistanceX) > 48) {
                lastProjectDragAt = Date.now();
                if (dragDistanceX < 0) goToNextSlide();
                else goToPreviousSlide();
            } else if (totalMovement < 10 && pointerDownSlide && !landedOnLink) {
                // A genuine tap/click (not a drag) landed on a project card, away from its links.
                openProjectChoice(pointerDownSlide);
            }

            pointerDownSlide = null;
        });

        viewport.addEventListener('pointercancel', () => {
            isDragging = false;
            pointerDownSlide = null;
            viewport.classList.remove('is-dragging');
        });

        viewport.addEventListener('wheel', (event) => {
            if (!document.body.classList.contains('page-home')) return;
            if (Math.abs(event.deltaX) < 8 && Math.abs(event.deltaY) < 8) return;

            event.preventDefault();
            if (wheelLocked) return;

            if (event.deltaY > 0 || event.deltaX > 0) goToNextSlide();
            else goToPreviousSlide();

            wheelLocked = true;
            setTimeout(() => {
                wheelLocked = false;
            }, 500);
        }, { passive: false });
    }

    // Fine-pointer + hover check: on touch phones/tablets, pointermove fires while
    // scrolling/dragging with a finger and pointerleave often never fires, which left
    // cards permanently tilted/skewed on mobile. So this 3D tilt is fine-pointer only.
    const supportsHoverTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    if (supportsHoverTilt) {
        slides.forEach(slide => {
            slide.addEventListener('pointermove', (event) => {
                if (event.pointerType !== 'mouse') return;
                const rect = slide.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                const rotateY = (x - 0.5) * 10;
                const rotateX = (0.5 - y) * 8;

                slide.style.setProperty('--tilt-x', rotateX.toFixed(2) + 'deg');
                slide.style.setProperty('--tilt-y', rotateY.toFixed(2) + 'deg');
                slide.style.setProperty('--glow-x', (x * 100).toFixed(1) + '%');
                slide.style.setProperty('--glow-y', (y * 100).toFixed(1) + '%');
            });

            slide.addEventListener('pointerleave', () => {
                slide.style.setProperty('--tilt-x', '0deg');
                slide.style.setProperty('--tilt-y', '0deg');
                slide.style.setProperty('--glow-x', '50%');
                slide.style.setProperty('--glow-y', '35%');
            });
        });
    } else {
        // Make sure touch devices always start neutral (no leftover tilt/glow state).
        slides.forEach(slide => {
            slide.style.setProperty('--tilt-x', '0deg');
            slide.style.setProperty('--tilt-y', '0deg');
            slide.style.setProperty('--glow-x', '50%');
            slide.style.setProperty('--glow-y', '35%');
        });
    }

    const projectChoiceModal = document.getElementById('projectChoiceModal');
    const projectChoiceTitle = document.getElementById('projectChoiceTitle');
    const projectGithubLink = document.getElementById('projectGithubLink');
    const projectLiveLink = document.getElementById('projectLiveLink');
    const projectChoiceClose = document.querySelector('.project-choice-close');

    const closeProjectChoice = () => {
        if (!projectChoiceModal) return;
        projectChoiceModal.classList.remove('is-open');
        projectChoiceModal.setAttribute('aria-hidden', 'true');
    };

    const openProjectChoice = (slide) => {
        if (!slide || !projectChoiceModal || !projectChoiceTitle || !projectGithubLink || !projectLiveLink) return;

        const title = slide.querySelector('h3')?.textContent?.trim() || 'Project';
        const links = Array.from(slide.querySelectorAll('.project-actions a, .btn-slide-link'));
        const github = links.find(link => /code|github/i.test(link.textContent || ''));
        const live = links.find(link => /live/i.test(link.textContent || ''));

        projectChoiceTitle.textContent = title;

        if (github) {
            projectGithubLink.href = github.href;
            projectGithubLink.classList.remove('is-disabled');
        } else {
            projectGithubLink.href = '#';
            projectGithubLink.classList.add('is-disabled');
        }

        if (live) {
            projectLiveLink.href = live.href;
            projectLiveLink.classList.remove('is-disabled');
        } else {
            projectLiveLink.href = '#';
            projectLiveLink.classList.add('is-disabled');
        }

        projectChoiceModal.classList.add('is-open');
        projectChoiceModal.setAttribute('aria-hidden', 'false');
    };

    if (projectChoiceClose) {
        projectChoiceClose.addEventListener('click', closeProjectChoice);
    }

    if (projectChoiceModal) {
        projectChoiceModal.addEventListener('click', (event) => {
            if (event.target === projectChoiceModal) closeProjectChoice();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeProjectChoice();
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
        position: fixed; top: 20px; right: 20px; background: #F0EDCC; color: #02343F; font-weight: 600;
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

        const submitBtn = this.querySelector('.btn-send');
        const originalBtnText = submitBtn ? submitBtn.textContent : '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        emailjs.sendForm('service_q3mpm8t', 'template_soq6aoa', this)
            .then(() => {
                showNotification('✓ Message sent successfully! I will reply shortly.');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                showNotification('✗ Something went wrong sending your message. Please try emailing me directly.');
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                }
            });
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

    // 3D tilt + shine effect for credential cards (mouse/trackpad only — see note above)
    const supportsHoverTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const credentialTiltCards = document.querySelectorAll('.credential-card');
    if (supportsHoverTilt) {
        credentialTiltCards.forEach(card => {
            card.addEventListener('pointermove', (event) => {
                if (event.pointerType !== 'mouse') return;
                const rect = card.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;
                const rotateY = (x - 0.5) * 12;
                const rotateX = (0.5 - y) * 10;

                card.style.setProperty('--tilt-x', rotateX.toFixed(2) + 'deg');
                card.style.setProperty('--tilt-y', rotateY.toFixed(2) + 'deg');
                card.style.setProperty('--shine-x', (x * 100).toFixed(1) + '%');
                card.style.setProperty('--shine-y', (y * 100).toFixed(1) + '%');
            });

            card.addEventListener('pointerleave', () => {
                card.style.setProperty('--tilt-x', '0deg');
                card.style.setProperty('--tilt-y', '0deg');
                card.style.setProperty('--shine-x', '50%');
                card.style.setProperty('--shine-y', '30%');
            });
        });
    } else {
        credentialTiltCards.forEach(card => {
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
            card.style.setProperty('--shine-x', '50%');
            card.style.setProperty('--shine-y', '30%');
        });
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
        showPortfolioPage('home');
    });
}
// Identity Rail <-> Contact Card toggle
(function () {
    const rail = document.getElementById('identityRail');
    const card = document.getElementById('identityCard');
    const closeBtn = document.getElementById('identityCardClose');
    const resumeLink = document.getElementById('identityCardResumeLink');
    if (!rail || !card) return;

    function openCard() {
        rail.classList.add('is-open');
        card.classList.add('is-open');
        rail.setAttribute('aria-expanded', 'true');
    }
    function closeCard() {
        rail.classList.remove('is-open');
        card.classList.remove('is-open');
        rail.setAttribute('aria-expanded', 'false');
    }
    function toggleCard() {
        if (card.classList.contains('is-open')) closeCard();
        else openCard();
    }

    rail.addEventListener('click', toggleCard);
    rail.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleCard();
        }
    });
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeCard();
        });
    }
    if (resumeLink) {
        resumeLink.addEventListener('click', (e) => {
            e.preventDefault();
            closeCard();
            const resumeBtn = document.getElementById('downloadResume');
            if (resumeBtn) resumeBtn.click();
        });
    }
    document.addEventListener('click', (e) => {
        if (!card.contains(e.target) && !rail.contains(e.target)) closeCard();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCard();
    });
})();
