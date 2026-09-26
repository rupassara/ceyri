// ═══════════════════════════════════════════════════════════
// CONTACT.JS — Formspree Form Submission Handler
// ═══════════════════════════════════════════════════════════

export function initContact(formspreeUrl) {
  const form      = document.getElementById('contact-form');
  const status    = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');
  const btnText   = submitBtn?.querySelector('.btn-text');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Client-side validation
    if (!validate(form)) return;

    // Loading state
    submitBtn.classList.add('loading');
    if (btnText) btnText.textContent = 'Sending';
    status.className = 'form-status';

    try {
      let ok = false;

      const hasRealEndpoint = formspreeUrl && !formspreeUrl.includes('YOUR_FORM_ID');

      if (hasRealEndpoint) {
        // Real Formspree submission
        const res = await fetch(formspreeUrl, {
          method:  'POST',
          body:    new FormData(form),
          headers: { Accept: 'application/json' },
        });
        ok = res.ok;
        if (!ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || 'Submission failed');
        }
      } else {
        // Demo mode — simulate a 1.5 s network delay
        await new Promise(r => setTimeout(r, 1500));
        ok = true;
        console.info('[CeySpice] Demo mode — set formspree URL in config.js to enable real submissions.');
      }

      if (ok) {
        showStatus('success', '✅ Your message has been sent! We\'ll get back to you within 24 hours.');
        form.reset();
      }
    } catch (err) {
      console.error('[CeySpice] Form error:', err);
      showStatus('error', `❌ Something went wrong. Please email us directly at ${getEmail()}`);
    } finally {
      submitBtn.classList.remove('loading');
      if (btnText) btnText.textContent = 'Send Message';
    }
  });

  // Remove error highlight on input
  form.querySelectorAll('input, textarea, select').forEach(el => {
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });

  /* ── Helpers ── */
  function validate(f) {
    let valid  = true;
    let first  = null;

    f.querySelectorAll('[required]').forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--color-primary)';
        valid = false;
        first = first || field;
      }
    });

    const emailEl = f.querySelector('#form-email');
    if (emailEl && emailEl.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value)) {
      emailEl.style.borderColor = 'var(--color-primary)';
      valid = false;
      first = first || emailEl;
    }

    first?.focus();
    return valid;
  }

  function showStatus(type, msg) {
    status.className = `form-status ${type}`;
    status.textContent = msg;
    status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function getEmail() {
    return window.SITE_CONFIG?.business?.email || 'us directly';
  }
}
