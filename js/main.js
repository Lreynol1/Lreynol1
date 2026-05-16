'use strict';

// ── Navbar scroll behaviour ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile hamburger ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// ── Jurisdiction tabs ────────────────────────────────────────────
document.querySelectorAll('.jur-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const region = tab.dataset.region;

    document.querySelectorAll('.jur-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.jur-panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(region).classList.add('active');
  });
});

// ── Scroll-reveal ────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.service-card, .jur-card, .testimonial, .team-card, .why-feature, .wcard'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  revealObserver.observe(el);
});

// ── Contact form ─────────────────────────────────────────────────
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const required = form.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    field.classList.remove('invalid');
    if (!field.value.trim()) {
      field.classList.add('invalid');
      valid = false;
    }
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      field.classList.add('invalid');
      valid = false;
    }
  });

  if (!valid) return;

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  // Simulate network request (replace with real API call)
  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Send Message';
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 6000);
  }, 900);
});

// Clear invalid state on input
form.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('invalid'));
});

// ── Smooth scroll for anchor links ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
