/* Heptagon — shared interaction layer (no dependencies) */

document.addEventListener('DOMContentLoaded', () => {
  /* ---- Sticky header shadow on scroll ---- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('is-open', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---- Facets diagram: hover/focus a vertex highlights matching card ---- */
  const vertices = document.querySelectorAll('.facet-vertex');
  const cards = document.querySelectorAll('.facet-card');
  const linkFacet = (key, active) => {
    vertices.forEach((v) => v.classList.toggle('is-active', v.dataset.facet === key && active));
    cards.forEach((c) => c.classList.toggle('is-active', c.dataset.facet === key && active));
  };
  vertices.forEach((v) => {
    v.addEventListener('mouseenter', () => linkFacet(v.dataset.facet, true));
    v.addEventListener('mouseleave', () => linkFacet(v.dataset.facet, false));
  });
  cards.forEach((c) => {
    c.addEventListener('mouseenter', () => linkFacet(c.dataset.facet, true));
    c.addEventListener('mouseleave', () => linkFacet(c.dataset.facet, false));
  });

  /* ---- FAQ accordion (Contact page) ---- */
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;
    btn.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';
      document.querySelectorAll('.faq-item').forEach((other) => {
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---- Contact form: client-side validation + UI-only submit ---- */
  const form = document.getElementById('contact-form');
  if (form) {
    const fields = form.querySelectorAll('[data-required]');

    const validateField = (field) => {
      const wrapper = field.closest('.field');
      const value = field.value.trim();
      let valid = value.length > 0;
      if (valid && field.type === 'email') {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
      wrapper.classList.toggle('has-error', !valid);
      return valid;
    };

    fields.forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.closest('.field').classList.contains('has-error')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let allValid = true;
      fields.forEach((field) => {
        if (!validateField(field)) allValid = false;
      });
      if (!allValid) {
        form.querySelector('.has-error input, .has-error select, .has-error textarea')?.focus();
        return;
      }
      form.classList.add('is-submitted');
      const success = document.getElementById('form-success');
      if (success) success.classList.add('is-visible');
    });
  }
});
