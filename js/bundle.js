/* ─────────────────────────────────────────────────────────
   BUNDLE.JS — All JavaScript in one file, no ES modules.
   Works on file://, XAMPP, and GitHub Pages (static).
───────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
     CAROUSEL
  ════════════════════════════════════════════════════════ */
  var _carCurrent = 0;
  var _carSlides  = [];
  var _carDots    = [];
  var _carTimer   = null;
  var CAR_DELAY   = 5500;

  function initCarousel(slideData) {
    _carSlides = Array.from(document.querySelectorAll('.hero-slide'));
    _carDots   = Array.from(document.querySelectorAll('.hero-dot'));
    if (_carSlides.length === 0) return;

    _carDots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { carGo(i); });
    });

    var prevBtn = document.getElementById('hero-prev');
    var nextBtn = document.getElementById('hero-next');
    prevBtn && prevBtn.addEventListener('click', function () { carGo(carPrev()); });
    nextBtn && nextBtn.addEventListener('click', function () { carGo(carNext()); });

    // Touch swipe
    var sx = 0;
    var hero = document.getElementById('hero');
    hero && hero.addEventListener('touchstart', function (e) {
      sx = e.changedTouches[0].screenX;
    }, { passive: true });
    hero && hero.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].screenX - sx;
      if (Math.abs(dx) > 48) carGo(dx < 0 ? carNext() : carPrev());
    }, { passive: true });

    // Keyboard
    document.addEventListener('keydown', function (e) {
      var heroEl = document.getElementById('hero');
      if (!heroEl) return;
      var r = heroEl.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        if (e.key === 'ArrowLeft')  carGo(carPrev());
        if (e.key === 'ArrowRight') carGo(carNext());
      }
    });

    // Pause on hover
    hero && hero.addEventListener('mouseenter', carStop);
    hero && hero.addEventListener('mouseleave', carStart);

    carStart();
  }

  function carGo(index) {
    _carSlides[_carCurrent] && _carSlides[_carCurrent].classList.remove('active');
    _carDots[_carCurrent]   && _carDots[_carCurrent].classList.remove('active');
    _carCurrent = ((index % _carSlides.length) + _carSlides.length) % _carSlides.length;
    _carSlides[_carCurrent] && _carSlides[_carCurrent].classList.add('active');
    _carDots[_carCurrent]   && _carDots[_carCurrent].classList.add('active');

    var cfg = window.SITE_CONFIG && window.SITE_CONFIG.hero && window.SITE_CONFIG.hero.slides[_carCurrent];
    if (cfg) {
      carAnimateText('hero-heading',    cfg.heading);
      carAnimateText('hero-subheading', cfg.subheading);
      var cta = document.getElementById('hero-cta');
      if (cta && cfg.cta) cta.textContent = cfg.cta;
    }
    carReset();
  }
  function carPrev() { return (_carCurrent - 1 + _carSlides.length) % _carSlides.length; }
  function carNext() { return (_carCurrent + 1) % _carSlides.length; }
  function carStart() { clearInterval(_carTimer); _carTimer = setInterval(function () { carGo(carNext()); }, CAR_DELAY); }
  function carStop()  { clearInterval(_carTimer); }
  function carReset() { carStop(); carStart(); }

  function carAnimateText(id, text) {
    var el = document.getElementById(id);
    if (!el) return;
    el.style.transition = 'none';
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(18px)';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.style.transition = 'opacity .5s ease, transform .5s ease';
        el.style.opacity    = '1';
        el.style.transform  = 'translateY(0)';
        el.textContent      = text;
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     NAVBAR
  ════════════════════════════════════════════════════════ */
  function initNavbar() {
    var navbar     = document.getElementById('navbar');
    var hamburger  = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');

    function onScroll() {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 60);
      highlightActive();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    hamburger && hamburger.addEventListener('click', function () {
      var open = hamburger.classList.toggle('open');
      mobileMenu && mobileMenu.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });

    mobileMenu && mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMobile);
    });

    document.addEventListener('click', function (e) {
      if (navbar && !navbar.contains(e.target)) closeMobile();
    });

    function closeMobile() {
      hamburger && hamburger.classList.remove('open');
      mobileMenu && mobileMenu.classList.remove('open');
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  }

  function highlightActive() {
    var sections = ['hero', 'products', 'story', 'contact'];
    var links    = document.querySelectorAll('.nav-link');
    var active   = 'hero';
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 100) active = id;
    });
    links.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + active);
    });
  }

  /* ══════════════════════════════════════════════════════
     CONTACT FORM
  ════════════════════════════════════════════════════════ */
  function initContact(formspreeUrl) {
    var form      = document.getElementById('contact-form');
    var status    = document.getElementById('form-status');
    var submitBtn = document.getElementById('form-submit');
    var btnText   = submitBtn && submitBtn.querySelector('.btn-text');

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form)) return;

      submitBtn.classList.add('loading');
      if (btnText) btnText.textContent = 'Sending';
      status.className = 'form-status';

      var hasRealEndpoint = formspreeUrl && formspreeUrl.indexOf('YOUR_FORM_ID') === -1;

      if (hasRealEndpoint) {
        fetch(formspreeUrl, {
          method:  'POST',
          body:    new FormData(form),
          headers: { Accept: 'application/json' },
        })
        .then(function (res) {
          if (res.ok) {
            showStatus('success', '✅ Your message has been sent! We\'ll get back to you within 24 hours.');
            form.reset();
          } else {
            throw new Error('failed');
          }
        })
        .catch(function () {
          showStatus('error', '❌ Something went wrong. Please email us directly at ' + getEmail());
        })
        .finally(function () {
          submitBtn.classList.remove('loading');
          if (btnText) btnText.textContent = 'Send Message';
        });
      } else {
        // Demo mode
        setTimeout(function () {
          showStatus('success', '✅ Demo mode — set your Formspree URL in config.js to enable real submissions.');
          form.reset();
          submitBtn.classList.remove('loading');
          if (btnText) btnText.textContent = 'Send Message';
        }, 1400);
      }
    });

    form.querySelectorAll('input, textarea, select').forEach(function (el) {
      el.addEventListener('input', function () { el.style.borderColor = ''; });
    });

    function validateForm(f) {
      var valid = true, first = null;
      f.querySelectorAll('[required]').forEach(function (field) {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = 'var(--color-primary)';
          valid = false;
          first = first || field;
        }
      });
      var emailEl = f.querySelector('#form-email');
      if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
        emailEl.style.borderColor = 'var(--color-primary)';
        valid = false;
        first = first || emailEl;
      }
      if (first) first.focus();
      return valid;
    }

    function showStatus(type, msg) {
      status.className   = 'form-status ' + type;
      status.textContent = msg;
      status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function getEmail() {
      return (window.SITE_CONFIG && window.SITE_CONFIG.business && window.SITE_CONFIG.business.email) || 'us directly';
    }
  }

  /* ══════════════════════════════════════════════════════
     ANIMATIONS  (Scroll Reveal + Stat Counters)
  ════════════════════════════════════════════════════════ */
  function initAnimations() {
    // Scroll reveal
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -55px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(function (el) {
      revealObs.observe(el);
    });

    // Stat counters
    var grid = document.getElementById('stats-grid');
    if (!grid) return;

    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          grid.querySelectorAll('.stat-number[data-target]').forEach(function (counter) {
            var target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            var suffix = counter.getAttribute('data-suffix') || '';
            counter.removeAttribute('data-target');
            animateCounter(counter, target, suffix);
          });
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    setTimeout(function () { counterObs.observe(grid); }, 200);
  }

  function animateCounter(el, target, suffix) {
    var dur   = 2200;
    var start = performance.now();
    function run(now) {
      var t      = Math.min((now - start) / dur, 1);
      var eased  = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (t < 1) requestAnimationFrame(run);
    }
    requestAnimationFrame(run);
  }

  /* ══════════════════════════════════════════════════════
     HELPERS
  ════════════════════════════════════════════════════════ */
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && text !== undefined && text !== null) el.textContent = text;
  }
  function setAttr(id, attr, val) {
    var el = document.getElementById(id);
    if (el && val) el.setAttribute(attr, val);
  }

  /* ══════════════════════════════════════════════════════
     THEME
  ════════════════════════════════════════════════════════ */
  function applyTheme(theme) {
    if (!theme) return;
    var root = document.documentElement;
    var map = {
      primaryColor:   '--color-primary',
      secondaryColor: '--color-secondary',
      accentColor:    '--color-accent',
      earthColor:     '--color-earth',
      creamColor:     '--color-cream',
      darkColor:      '--color-dark',
    };
    Object.keys(map).forEach(function (k) {
      if (theme[k]) root.style.setProperty(map[k], theme[k]);
    });
  }

  /* ══════════════════════════════════════════════════════
     SEO
  ════════════════════════════════════════════════════════ */
  function applySEO(seo) {
    if (!seo) return;
    if (seo.title) document.title = seo.title;
    function setMeta(name, content, isOg) {
      if (!content) return;
      var attr = isOg ? 'property' : 'name';
      var el = document.querySelector('meta[' + attr + '="' + name + '"]');
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute('content', content);
    }
    setMeta('description', seo.description);
    setMeta('keywords',    seo.keywords);
    setMeta('og:title',       seo.title,       true);
    setMeta('og:description', seo.description, true);
    setMeta('og:image',       seo.ogImage,     true);
    setMeta('og:type',        'website',       true);
  }

  /* ══════════════════════════════════════════════════════
     POPULATE SECTIONS
  ════════════════════════════════════════════════════════ */
  function populateNavbar(cfg) {
    var business = cfg.business;
    setText('nav-business-name', business.name);
    var tagShort = business.tagline ? business.tagline.split('.')[0] : '';
    setText('nav-tagline-short', tagShort);
    var logo = document.getElementById('nav-logo');
    if (business.logo && logo) { logo.src = business.logo; logo.style.display = 'block'; }
    var ctaBtn = document.getElementById('nav-cta-btn');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', function () {
        var c = document.getElementById('contact');
        if (c) c.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function populateHero(hero) {
    var carousel = document.getElementById('hero-carousel');
    var dotsWrap = document.getElementById('hero-dots');
    if (!carousel || !hero || !hero.slides || !hero.slides.length) return;

    hero.slides.forEach(function (slide, i) {
      var el = document.createElement('div');
      el.className = 'hero-slide' + (i === 0 ? ' active' : '');
      el.style.backgroundImage = "url('" + slide.image + "')";
      carousel.appendChild(el);

      var dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dotsWrap.appendChild(dot);
    });

    var first = hero.slides[0];
    setText('hero-heading',    first.heading);
    setText('hero-subheading', first.subheading);
    var cta = document.getElementById('hero-cta');
    if (cta && first.cta) cta.textContent = first.cta;
  }

  function populateStats(stats) {
    var grid = document.getElementById('stats-grid');
    if (!grid || !stats) return;
    stats.forEach(function (stat) {
      var item = document.createElement('div');
      item.className = 'stat-item';
      item.innerHTML =
        '<div class="stat-number" data-target="' + stat.value + '" data-suffix="' + (stat.suffix || '') + '">0' + (stat.suffix || '') + '</div>' +
        '<p class="stat-label">' + stat.label + '</p>';
      grid.appendChild(item);
    });
  }

  function populateProducts(products) {
    var grid = document.getElementById('products-grid');
    if (!grid || !products) return;
    products.forEach(function (product) {
      var card = document.createElement('div');
      card.className = 'product-card reveal';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'View details for ' + product.name);
      card.innerHTML =
        '<div class="product-image-wrap">' +
          '<img class="product-image" src="' + product.image + '" alt="' + product.name + '" loading="lazy">' +
          '<div class="product-image-overlay" aria-hidden="true">' +
            '<span class="product-image-cta">View Details <i data-lucide="arrow-right"></i></span>' +
          '</div>' +
        '</div>' +
        '<div class="product-body">' +
          '<span class="product-category">' + product.category + '</span>' +
          '<h3 class="product-name">' + product.name + '</h3>' +
          '<p class="product-description">' + product.description + '</p>' +
          '<div class="product-footer">' +
            '<div class="product-origin"><i data-lucide="map-pin"></i><span>' + product.origin + '</span></div>' +
            '<span class="product-learn-more">Details <i data-lucide="chevron-right"></i></span>' +
          '</div>' +
        '</div>';

      card.addEventListener('click', function () { openModal(product); });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') openModal(product);
      });
      grid.appendChild(card);
    });
  }

  function openModal(product) {
    var img = document.getElementById('modal-image');
    if (img) { img.src = product.image; img.alt = product.name; }
    setText('modal-category',    product.category);
    setText('modal-name',        product.name);
    setText('modal-description', product.description);
    setText('modal-origin',      product.origin);

    var list = document.getElementById('modal-forms-list');
    if (list) {
      list.innerHTML = (product.available || [])
        .map(function (f) { return '<span class="modal-form-tag">' + f + '</span>'; }).join('');
    }

    var overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
  }

  function setupModal() {
    var overlay  = document.getElementById('modal-overlay');
    var closeBtn = document.getElementById('modal-close');
    var enquire  = document.getElementById('modal-enquire-btn');

    function closeModal() {
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    closeBtn && closeBtn.addEventListener('click', closeModal);
    overlay  && overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    enquire  && enquire.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  }

  function populateCertifications(certs) {
    var wrap = document.getElementById('cert-badges');
    if (!wrap || !certs) return;
    certs.forEach(function (c) {
      var badge = document.createElement('span');
      badge.className   = 'cert-badge';
      badge.textContent = c;
      wrap.appendChild(badge);
    });
  }

  function populateStory(story) {
    if (!story) return;
    setText('story-subheading', story.subheading);
    setText('story-heading',    story.heading);
    setText('story-badge-year', story.founded || (story.milestones && story.milestones[0] && story.milestones[0].year) || '');

    var img = document.getElementById('story-image');
    if (img) { img.src = story.image; img.alt = story.heading; }

    var body = document.getElementById('story-body');
    if (body && story.body) {
      body.innerHTML = story.body.map(function (p) { return '<p>' + p + '</p>'; }).join('');
    }

    var timeline = document.getElementById('story-timeline');
    if (timeline && story.milestones) {
      story.milestones.forEach(function (m) {
        var item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = '<div class="timeline-year">' + m.year + '</div><p class="timeline-event">' + m.event + '</p>';
        timeline.appendChild(item);
      });
    }
  }

  function populateContact(b) {
    if (!b) return;
    setText('contact-address', b.address);
    var phone = document.getElementById('contact-phone');
    if (phone) { phone.textContent = b.phone; phone.href = 'tel:' + b.phone.replace(/\s/g, ''); }
    var email = document.getElementById('contact-email');
    if (email) { email.textContent = b.email; email.href = 'mailto:' + b.email; }
    var waHref = 'https://wa.me/' + b.whatsapp;
    setAttr('contact-whatsapp', 'href', waHref);
    setAttr('whatsapp-float',   'href', waHref);
  }

  function populateFooter(cfg) {
    var b = cfg.business, f = cfg.footer, s = cfg.social;
    setText('footer-name',      b.name);
    setText('footer-tagline',   (f && f.tagline) || b.tagline);
    setText('footer-copyright', '© ' + new Date().getFullYear() + ' ' + ((f && f.copyright) || b.name) + '. All Rights Reserved.');

    var socialWrap = document.getElementById('footer-social');
    if (socialWrap && s) {
      var icons = { facebook: 'facebook', instagram: 'instagram', linkedin: 'linkedin' };
      Object.keys(s).forEach(function (key) {
        if (!s[key]) return;
        var a = document.createElement('a');
        a.href   = s[key];
        a.target = '_blank';
        a.rel    = 'noopener noreferrer';
        a.className = 'footer-social-link';
        a.setAttribute('aria-label', key);
        a.innerHTML = '<i data-lucide="' + (icons[key] || 'globe') + '"></i>';
        socialWrap.appendChild(a);
      });
    }
  }

  /* ══════════════════════════════════════════════════════
     BOOTSTRAP
  ════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {
    var cfg = window.SITE_CONFIG;
    if (!cfg) { console.error('[CeySpice] SITE_CONFIG not found. Check config.js'); return; }

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

    initCarousel(cfg.hero.slides);
    initNavbar();
    initContact(cfg.business.formspree);
    initAnimations();

    if (window.lucide) lucide.createIcons();
  });

})();
