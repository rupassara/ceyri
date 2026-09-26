// ═══════════════════════════════════════════════════════════
// APP.JS — Main Bootstrap
// Reads window.SITE_CONFIG and populates every section.
// ═══════════════════════════════════════════════════════════

import { initCarousel }    from './carousel.js';
import { initNavbar }      from './navbar.js';
import { initContact }     from './contact.js';
import { initAnimations }  from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
  const cfg = window.SITE_CONFIG;
  if (!cfg) {
    console.error('[CeySpice] SITE_CONFIG not found. Please check config.js.');
    return;
  }

  applyTheme(cfg.theme);
  applySEO(cfg.seo);
  populateNavbar(cfg);
  populateHero(cfg.hero);
  populateStats(cfg.stats);
  populateProducts(cfg.products);
  populateCertifications(cfg.certifications);
  populateStory(cfg.story);
  populateContact(cfg.business);
  populateFooter(cfg);
  setupModal();

  // Init interactive modules
  initCarousel(cfg.hero.slides);
  initNavbar();
  initContact(cfg.business.formspree);
  initAnimations();

  // Render Lucide icons after all DOM changes
  if (window.lucide) lucide.createIcons();
});

/* ── Theme ─────────────────────────────────────────────── */
function applyTheme(theme) {
  if (!theme) return;
  const root = document.documentElement;
  const map = {
    primaryColor:   '--color-primary',
    secondaryColor: '--color-secondary',
    accentColor:    '--color-accent',
    earthColor:     '--color-earth',
    creamColor:     '--color-cream',
    darkColor:      '--color-dark',
  };
  Object.entries(map).forEach(([k, v]) => {
    if (theme[k]) root.style.setProperty(v, theme[k]);
  });
}

/* ── SEO ───────────────────────────────────────────────── */
function applySEO(seo) {
  if (!seo) return;
  if (seo.title)       document.title = seo.title;
  setMeta('description', seo.description);
  setMeta('keywords',    seo.keywords);
  setMeta('og:title',       seo.title,       true);
  setMeta('og:description', seo.description, true);
  setMeta('og:image',       seo.ogImage,     true);
  setMeta('og:type',        'website',       true);
  setMeta('twitter:card',   'summary_large_image');
}
function setMeta(name, content, isProperty = false) {
  if (!content) return;
  const attr = isProperty ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/* ── Navbar ─────────────────────────────────────────────── */
function populateNavbar({ business }) {
  setText('nav-business-name', business.name);
  // Shortened tagline for small screen
  const tagShort = business.tagline?.split('.')[0] || '';
  setText('nav-tagline-short', tagShort);

  const logo = document.getElementById('nav-logo');
  if (business.logo && logo) {
    logo.src = business.logo;
    logo.style.display = 'block';
  }

  // Wire the "Get a Quote" nav button
  document.getElementById('nav-cta-btn')?.addEventListener('click', () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ── Hero ───────────────────────────────────────────────── */
function populateHero(hero) {
  const carousel = document.getElementById('hero-carousel');
  const dots     = document.getElementById('hero-dots');
  if (!carousel || !hero?.slides?.length) return;

  hero.slides.forEach((slide, i) => {
    // Slide background
    const el = document.createElement('div');
    el.className = 'hero-slide' + (i === 0 ? ' active' : '');
    el.style.backgroundImage = `url('${slide.image}')`;
    carousel.appendChild(el);

    // Dot
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.setAttribute('role', 'tab');
    dots.appendChild(dot);
  });

  // Seed first slide text
  const first = hero.slides[0];
  setText('hero-heading',    first.heading);
  setText('hero-subheading', first.subheading);
  const cta = document.getElementById('hero-cta');
  if (cta && first.cta) cta.textContent = first.cta;
}

/* ── Stats ──────────────────────────────────────────────── */
function populateStats(stats) {
  const grid = document.getElementById('stats-grid');
  if (!grid || !stats) return;

  stats.forEach(stat => {
    const item = document.createElement('div');
    item.className = 'stat-item';
    item.innerHTML = `
      <div class="stat-number" data-target="${stat.value}" data-suffix="${stat.suffix || ''}">0${stat.suffix || ''}</div>
      <p class="stat-label">${stat.label}</p>
    `;
    grid.appendChild(item);
  });
}

/* ── Products ───────────────────────────────────────────── */
function populateProducts(products) {
  const grid = document.getElementById('products-grid');
  if (!grid || !products) return;

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card reveal';
    card.setAttribute('data-product-id', product.id);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View details for ${product.name}`);

    card.innerHTML = `
      <div class="product-image-wrap">
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-image-overlay" aria-hidden="true">
          <span class="product-image-cta">View Details <i data-lucide="arrow-right"></i></span>
        </div>
      </div>
      <div class="product-body">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-description">${product.description}</p>
        <div class="product-footer">
          <div class="product-origin">
            <i data-lucide="map-pin"></i>
            <span>${product.origin}</span>
          </div>
          <span class="product-learn-more">Details <i data-lucide="chevron-right"></i></span>
        </div>
      </div>
    `;

    card.addEventListener('click',   () => openModal(product));
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') openModal(product); });
    grid.appendChild(card);
  });
}

/* ── Product Modal ──────────────────────────────────────── */
function openModal(product) {
  document.getElementById('modal-image').src          = product.image;
  document.getElementById('modal-image').alt          = product.name;
  document.getElementById('modal-category').textContent = product.category;
  document.getElementById('modal-name').textContent   = product.name;
  document.getElementById('modal-description').textContent = product.description;
  document.getElementById('modal-origin').textContent = product.origin;

  const list = document.getElementById('modal-forms-list');
  list.innerHTML = (product.available || [])
    .map(f => `<span class="modal-form-tag">${f}</span>`).join('');

  document.getElementById('modal-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (window.lucide) lucide.createIcons();
}

function setupModal() {
  const overlay  = document.getElementById('modal-overlay');
  const closeBtn = document.getElementById('modal-close');
  const enquire  = document.getElementById('modal-enquire-btn');

  const close = () => {
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', e => { if (e.target === overlay) close(); });
  enquire?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* ── Certifications ─────────────────────────────────────── */
function populateCertifications(certs) {
  const wrap = document.getElementById('cert-badges');
  if (!wrap || !certs) return;
  certs.forEach(c => {
    const badge = document.createElement('span');
    badge.className = 'cert-badge';
    badge.textContent = c;
    wrap.appendChild(badge);
  });
}

/* ── Story ──────────────────────────────────────────────── */
function populateStory(story) {
  if (!story) return;
  setText('story-subheading', story.subheading);
  setText('story-heading',    story.heading);
  setText('story-badge-year', story.founded || story.milestones?.[0]?.year || '');

  const img = document.getElementById('story-image');
  if (img) { img.src = story.image; img.alt = story.heading; }

  const body = document.getElementById('story-body');
  if (body && story.body) {
    body.innerHTML = story.body.map(p => `<p>${p}</p>`).join('');
  }

  const timeline = document.getElementById('story-timeline');
  if (timeline && story.milestones) {
    story.milestones.forEach(m => {
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-year">${m.year}</div>
        <p class="timeline-event">${m.event}</p>
      `;
      timeline.appendChild(item);
    });
  }
}

/* ── Contact ────────────────────────────────────────────── */
function populateContact(b) {
  if (!b) return;
  setText('contact-address', b.address);

  const phone = document.getElementById('contact-phone');
  if (phone) { phone.textContent = b.phone; phone.href = `tel:${b.phone.replace(/\s/g, '')}`; }

  const email = document.getElementById('contact-email');
  if (email) { email.textContent = b.email; email.href = `mailto:${b.email}`; }

  const waHref = `https://wa.me/${b.whatsapp}`;
  document.getElementById('contact-whatsapp')?.setAttribute('href', waHref);
  document.getElementById('whatsapp-float')?.setAttribute('href', waHref);
}

/* ── Footer ─────────────────────────────────────────────── */
function populateFooter(cfg) {
  const { business, footer, social } = cfg;
  setText('footer-name',      business.name);
  setText('footer-tagline',   footer?.tagline || business.tagline);
  setText('footer-copyright', `© ${new Date().getFullYear()} ${footer?.copyright || business.name}. All Rights Reserved.`);

  const socialWrap = document.getElementById('footer-social');
  if (socialWrap && social) {
    const icons = { facebook: 'facebook', instagram: 'instagram', linkedin: 'linkedin' };
    Object.entries(social).forEach(([key, url]) => {
      if (!url) return;
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'footer-social-link';
      a.setAttribute('aria-label', key);
      a.innerHTML = `<i data-lucide="${icons[key] || 'globe'}"></i>`;
      socialWrap.appendChild(a);
    });
  }
}

/* ── Helper ─────────────────────────────────────────────── */
function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined && text !== null) el.textContent = text;
}
