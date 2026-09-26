// ═══════════════════════════════════════════════════════════
// NAVBAR.JS — Sticky Scroll Behaviour & Mobile Menu
// ═══════════════════════════════════════════════════════════

export function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  // ── Scroll: add/remove .scrolled class ─────────────────
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightActive();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile menu toggle ─────────────────────────────────
  hamburger?.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobile);
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar?.contains(e.target)) closeMobile();
  });

  function closeMobile() {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  }

  // ── Smooth scroll ──────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* Mark the nav link whose section is currently on screen */
function highlightActive() {
  const sections = ['hero', 'products', 'story', 'contact'];
  const links    = document.querySelectorAll('.nav-link');
  let   active   = 'hero';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= 100) active = id;
  });

  links.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${active}`);
  });
}
