/* ==========================================================================
   ELECTRONIC ARTS — THE $55 BILLION TRANSFORMATION
   Institutional Editorial Interaction Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  initSmoothScroll(isReducedMotion);
  initHeroSequence(isReducedMotion);
  initDocumentaryNav();
  initParallaxPhotography(isReducedMotion);
  initDealTimelineScroll(isReducedMotion);
});

/* ==========================================================================
   1. LENIS SMOOTH INERTIA SCROLL
   ========================================================================== */
let lenis = null;

function initSmoothScroll(isReducedMotion) {
  if (isReducedMotion || typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.4,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

/* ==========================================================================
   2. HERO INITIAL LOAD & SUBTLE PARALLAX
   ========================================================================== */
function initHeroSequence(isReducedMotion) {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-bg-img', 
    { scale: 1.15, filter: 'brightness(0.15) contrast(1.1) grayscale(60%)' }, 
    { scale: 1.04, filter: 'brightness(0.38) contrast(1.18) grayscale(30%)', duration: 3.2, ease: 'power2.out' }
  )
  .fromTo('.prospectus-meta-bar', 
    { opacity: 0, y: -10 }, 
    { opacity: 1, y: 0, duration: 1.2 }, 
    '-=2.4'
  )
  .fromTo('.hero-subhead-mono', 
    { opacity: 0, y: 15 }, 
    { opacity: 1, y: 0, duration: 1.0 }, 
    '-=1.8'
  )
  .fromTo('.hero-major-title', 
    { opacity: 0, y: 40 }, 
    { opacity: 1, y: 0, duration: 1.6, ease: 'power4.out' }, 
    '-=1.5'
  )
  .fromTo('.hero-deck-prose', 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 1.4 }, 
    '-=1.0'
  )
  .fromTo('.hero-scroll-cue', 
    { opacity: 0 }, 
    { opacity: 1, duration: 1.0 }, 
    '-=0.6'
  );

  if (!isReducedMotion && typeof ScrollTrigger !== 'undefined') {
    gsap.to('.hero-bg-img', {
      scrollTrigger: {
        trigger: '.hero-chapter',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: 120,
      scale: 1.1,
      filter: 'brightness(0.18)'
    });

    gsap.to('.hero-content', {
      scrollTrigger: {
        trigger: '.hero-chapter',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
      y: -80,
      opacity: 0.2
    });
  }
}

/* ==========================================================================
   3. DOCUMENTARY CHAPTER NAVIGATION
   ========================================================================== */
function initDocumentaryNav() {
  const sections = document.querySelectorAll('.chapter-section');
  const navItems = document.querySelectorAll('.chapter-nav-item');

  function updateActiveChapter() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    sections.forEach((sec, idx) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => item.classList.remove('active'));
        if (navItems[idx]) {
          navItems[idx].classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveChapter, { passive: true });
  updateActiveChapter();

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = item.getAttribute('href');
      const targetSec = document.querySelector(targetId);
      if (targetSec) {
        if (lenis) {
          lenis.scrollTo(targetSec);
        } else {
          targetSec.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* ==========================================================================
   4. EDITORIAL PHOTOGRAPHY PARALLAX & VERTICAL MASKING
   ========================================================================== */
function initParallaxPhotography(isReducedMotion) {
  if (isReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Spread photos subtle parallax
  const photos = document.querySelectorAll('.spread-photo, .asset-photo, .full-bleed-img, .deal-skyline-photo, .restruct-bg-photo');
  photos.forEach(img => {
    gsap.fromTo(img, 
      { y: -30, scale: 1.08 },
      {
        y: 30,
        scale: 1.0,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      }
    );
  });

  // Massive numbers entrance
  const numbers = document.querySelectorAll('.data-massive-num, .monumental-55b, .monumental-stat-number');
  numbers.forEach(num => {
    gsap.fromTo(num,
      { opacity: 0.1, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: num,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

/* ==========================================================================
   5. M&A DEAL TIMELINE SCROLL REVEALS
   ========================================================================== */
function initDealTimelineScroll(isReducedMotion) {
  if (isReducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const events = document.querySelectorAll('.timeline-event-card');
  events.forEach((ev) => {
    gsap.fromTo(ev,
      { opacity: 0.25, y: 25 },
      {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: ev,
          start: 'top 75%',
          end: 'bottom 40%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );
  });
}
