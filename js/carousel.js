// ═══════════════════════════════════════════════════════════
// CAROUSEL.JS — Hero Carousel with Auto-play, Touch & Keys
// ═══════════════════════════════════════════════════════════

let current   = 0;
let slides    = [];
let dots      = [];
let timer     = null;
const DELAY   = 5500; // ms between auto-advances

export function initCarousel(slideData) {
  slides = Array.from(document.querySelectorAll('.hero-slide'));
  dots   = Array.from(document.querySelectorAll('.hero-dot'));
  if (slides.length === 0) return;

  // Dot clicks
  dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));

  // Arrow buttons
  document.getElementById('hero-prev')?.addEventListener('click', () => go(prev()));
  document.getElementById('hero-next')?.addEventListener('click', () => go(next()));

  // Touch / swipe
  let sx = 0;
  const hero = document.getElementById('hero');
  hero?.addEventListener('touchstart', e => { sx = e.changedTouches[0].screenX; }, { passive: true });
  hero?.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].screenX - sx;
    if (Math.abs(dx) > 48) go(dx < 0 ? next() : prev());
  }, { passive: true });

  // Keyboard (only when hero is visible)
  document.addEventListener('keydown', e => {
    const heroEl = document.getElementById('hero');
    if (!heroEl) return;
    const { top, bottom } = heroEl.getBoundingClientRect();
    const inView = top < window.innerHeight && bottom > 0;
    if (!inView) return;
    if (e.key === 'ArrowLeft')  go(prev());
    if (e.key === 'ArrowRight') go(next());
  });

  // Pause on hover
  const heroSection = document.getElementById('hero');
  heroSection?.addEventListener('mouseenter', stopAuto);
  heroSection?.addEventListener('mouseleave', startAuto);

  startAuto();
}

function go(index) {
  // De-activate current
  slides[current]?.classList.remove('active');
  dots[current]?.classList.remove('active');

  current = (index + slides.length) % slides.length;

  // Activate new
  slides[current]?.classList.add('active');
  dots[current]?.classList.add('active');

  // Animate text
  const cfg = window.SITE_CONFIG?.hero?.slides?.[current];
  if (cfg) {
    animateText('hero-heading',    cfg.heading);
    animateText('hero-subheading', cfg.subheading);
    const cta = document.getElementById('hero-cta');
    if (cta && cfg.cta) cta.textContent = cfg.cta;
  }

  resetAuto();
}

function prev() { return (current - 1 + slides.length) % slides.length; }
function next() { return (current + 1) % slides.length; }

function startAuto() {
  clearInterval(timer);
  timer = setInterval(() => go(next()), DELAY);
}
function stopAuto()  { clearInterval(timer); }
function resetAuto() { stopAuto(); startAuto(); }

function animateText(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.transition = 'none';
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(18px)';
  // rAF to allow the above to paint, then animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      el.style.opacity    = '1';
      el.style.transform  = 'translateY(0)';
      el.textContent      = text;
    });
  });
}
