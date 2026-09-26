// ═══════════════════════════════════════════════════════════
// ANIMATIONS.JS — Scroll Reveal + Animated Stat Counters
// ═══════════════════════════════════════════════════════════

export function initAnimations() {
  initReveal();
  initCounters();
}

/* ── Scroll Reveal (IntersectionObserver) ──────────────── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Keep observing so it stays visible even if scrolled back
      }
    });
  }, {
    threshold:  0.1,
    rootMargin: '0px 0px -55px 0px',
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => observer.observe(el));
}

/* ── Animated stat counters ────────────────────────────── */
function initCounters() {
  const grid = document.getElementById('stats-grid');
  if (!grid) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        grid.querySelectorAll('.stat-number[data-target]').forEach(counter => {
          const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
          const suffix = counter.getAttribute('data-suffix') || '';
          counter.removeAttribute('data-target'); // prevent re-trigger
          animateCounter(counter, target, suffix);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  // Re-observe after stats are populated (they're injected by app.js)
  // Use a short delay to ensure DOM is ready
  setTimeout(() => observer.observe(grid), 100);
}

function animateCounter(el, target, suffix) {
  const dur    = 2200; // ms
  const start  = performance.now();

  const run = now => {
    const elapsed  = now - start;
    const t        = Math.min(elapsed / dur, 1);
    const eased    = easeOutCubic(t);
    el.textContent = Math.round(eased * target) + suffix;
    if (t < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
