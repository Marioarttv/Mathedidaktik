/* NEXUS-7 PRESENTATION - MAIN JAVASCRIPT
   GSAP Best Practices Applied:
   1. Set initial states BEFORE adding visibility classes
   2. Use autoAlpha instead of opacity for better performance (handles visibility)
   3. Use gsap.set for immediate property changes
   4. Pre-hide content elements before slide becomes visible
*/

const CONFIG = { totalSlides: 9, animationDuration: 0.6, staggerDelay: 0.08, starCount: 150 };
let currentSlide = 0;
let isAnimating = false;

const slides = document.querySelectorAll('.slide');
const navDots = document.querySelectorAll('.nav-dot');
const progressFill = document.getElementById('progressFill');
const currentSlideEl = document.getElementById('currentSlide');
const starfield = document.getElementById('starfield');

document.addEventListener('DOMContentLoaded', () => {
    // Pre-hide ALL slides and their content immediately
    slides.forEach((slide, index) => {
        if (index !== 0) {
            gsap.set(slide, { autoAlpha: 0, x: 100 });
        }
        // Pre-hide all animatable content in all slides
        const elements = getAnimatableElements(slide);
        gsap.set(elements, { autoAlpha: 0, y: 30 });
    });

    // Initialize first slide
    gsap.set(slides[0], { autoAlpha: 1, x: 0 });
    slides[0].classList.add('active');

    lucide.createIcons();
    createStarfield();

    // Animate first slide content after icons are ready
    requestAnimationFrame(() => {
        animateSlideContent(slides[0]);
    });

    document.body.classList.add('first-slide');
});

function getAnimatableElements(slide) {
    return slide.querySelectorAll(
        '.slide-header, .logo-container, .main-title, .subtitle, .authors, .start-hint, ' +
        '.problem-box, .gap-box, .theory-card, .research-question, .hypothesis, ' +
        '.method-card, .chart-container, .highlight-card, .qualitative-box, ' +
        '.hypo-result, .explanation, .implications, .limitation-card, .future-section, .thank-you'
    );
}

function createStarfield() {
    for (let i = 0; i < CONFIG.starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.setProperty('--duration', `${2 + Math.random() * 4}s`);
        star.style.setProperty('--opacity', `${0.3 + Math.random() * 0.7}`);
        star.style.width = `${1 + Math.random() * 2}px`;
        star.style.height = star.style.width;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starfield.appendChild(star);
    }
    const nebulaColors = ['rgba(139, 92, 246, 0.3)', 'rgba(217, 70, 239, 0.2)', 'rgba(34, 211, 238, 0.15)'];
    for (let i = 0; i < 3; i++) {
        const nebula = document.createElement('div');
        nebula.classList.add('nebula');
        nebula.style.width = `${300 + Math.random() * 400}px`;
        nebula.style.height = nebula.style.width;
        nebula.style.left = `${Math.random() * 100}%`;
        nebula.style.top = `${Math.random() * 100}%`;
        nebula.style.background = nebulaColors[i];
        starfield.appendChild(nebula);
    }
}

function goToSlide(index, direction = 'next') {
    if (isAnimating || index === currentSlide || index < 0 || index >= CONFIG.totalSlides) return;
    isAnimating = true;

    const oldSlide = slides[currentSlide];
    const newSlide = slides[index];
    const newSlideContent = getAnimatableElements(newSlide);

    document.body.classList.toggle('first-slide', index === 0);

    // CRITICAL: Pre-hide new slide content BEFORE any transition
    gsap.set(newSlideContent, { autoAlpha: 0, y: 30 });

    // Set initial position of new slide (invisible and offset)
    gsap.set(newSlide, { autoAlpha: 0, x: direction === 'next' ? 80 : -80 });

    // Now add the active class (slide is still invisible due to gsap.set above)
    newSlide.classList.add('active');

    // Create master timeline for smooth sequencing
    const tl = gsap.timeline({
        onComplete: () => {
            oldSlide.classList.remove('active', 'exiting');
            gsap.set(oldSlide, { autoAlpha: 0 }); // Ensure old slide is hidden
            isAnimating = false;
        }
    });

    // Animate out old slide
    oldSlide.classList.add('exiting');
    tl.to(oldSlide, {
        autoAlpha: 0,
        x: direction === 'next' ? -80 : 80,
        duration: CONFIG.animationDuration * 0.5,
        ease: 'power2.in'
    });

    // Animate in new slide (overlapping slightly for smoothness)
    tl.to(newSlide, {
        autoAlpha: 1,
        x: 0,
        duration: CONFIG.animationDuration * 0.5,
        ease: 'power2.out'
    }, '-=0.15');

    // Animate content after slide is mostly visible
    tl.to(newSlideContent, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: CONFIG.staggerDelay,
        ease: 'power2.out'
    }, '-=0.25');

    currentSlide = index;
    updateUI();

    if (index === 4) {
        tl.add(() => {
            if (typeof initCharts === 'function') initCharts();
        }, '-=0.3');
    }
}

function nextSlide() { goToSlide(currentSlide + 1, 'next'); }
function prevSlide() { goToSlide(currentSlide - 1, 'prev'); }

function animateSlideContent(slide) {
    const elements = getAnimatableElements(slide);
    gsap.to(elements, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: CONFIG.staggerDelay,
        ease: 'power2.out'
    });
}

function updateUI() {
    gsap.to(progressFill, { width: `${((currentSlide + 1) / CONFIG.totalSlides) * 100}%`, duration: 0.3 });
    currentSlideEl.textContent = currentSlide + 1;
    navDots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') { e.preventDefault(); nextSlide(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
    else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
    else if ('12345678'.includes(e.key)) goToSlide(parseInt(e.key) - 1, parseInt(e.key) - 1 > currentSlide ? 'next' : 'prev');
});

navDots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i, i > currentSlide ? 'next' : 'prev')));

let touchStartX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
document.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
});

function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => { });
    else document.exitFullscreen();
}
