'use strict';

// ── Navbar scroll behaviour ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile hamburger ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ── Hero search → scroll to accountant section ──────────────────
document.getElementById('heroSearchBtn').addEventListener('click', () => {
  const loc = document.getElementById('searchLocation').value;
  const target = document.getElementById('find-accountant');
  if (target) {
    const offset = 90;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  }
  // activate matching country tab if location selected
  if (loc) {
    const tab = document.querySelector(`.country-tab[data-country="${loc}"]`);
    if (tab) tab.click();
  }
});

// ── Animated stat counters ───────────────────────────────────────
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const step     = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString();
  }, step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  statsObserver.observe(el);
});

// ── Country tabs (Find an Accountant) ───────────────────────────
document.querySelectorAll('.country-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const country = tab.dataset.country;

    document.querySelectorAll('.country-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.accountant-panel').forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const panel = document.getElementById(`panel-${country}`);
    if (panel) panel.classList.add('active');
  });
});

// ── Resource filter ──────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.resource-card').forEach(card => {
      if (filter === 'all') {
        card.classList.remove('hidden');
      } else {
        const cats = (card.dataset.category || '').split(' ');
        card.classList.toggle('hidden', !cats.includes(filter));
      }
    });
  });
});

// ── Contact form tabs ────────────────────────────────────────────
document.querySelectorAll('.form-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const serviceGroup = document.getElementById('serviceGroup');
    if (tab.dataset.formType === 'pro') {
      document.getElementById('service').innerHTML = `
        <option value="">Select your specialty…</option>
        <option>US-Jamaica Cross-Border Tax</option>
        <option>Canada-Jamaica Cross-Border Tax</option>
        <option>Jamaican Tax Law (TAJ / GCT)</option>
        <option>Estate & Succession Planning</option>
        <option>NHT & Diaspora Services</option>
        <option>Business Accounting & Bookkeeping</option>
        <option>FBAR / FATCA / T1135 Compliance</option>
      `;
      document.querySelector('label[for="service"]').textContent = 'Your Specialty';
    } else {
      document.getElementById('service').innerHTML = `
        <option value="">Select a service…</option>
        <option>Cross-Border Tax Filing (US-Jamaica)</option>
        <option>Cross-Border Tax Filing (Canada-Jamaica)</option>
        <option>Personal Tax Return</option>
        <option>Business Accounting</option>
        <option>Estate &amp; Succession Planning</option>
        <option>FBAR / T1135 Foreign Asset Reporting</option>
        <option>NHT Contributions from Abroad</option>
        <option>Jamaican Property Investment Tax</option>
        <option>Join the Community</option>
      `;
      document.querySelector('label[for="service"]').textContent = 'Service Needed';
    }
  });
});

// ── Scroll-reveal (Intersection Observer) ───────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.08}s`;
  revealObserver.observe(el);
});

// ── Contact form validation & submission ─────────────────────────
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = true;

  form.querySelectorAll('[required]').forEach(field => {
    field.classList.remove('invalid');
    const empty = !field.value.trim();
    const badEmail = field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);

    if (empty || badEmail) {
      field.classList.add('invalid');
      valid = false;
    }
  });

  if (!valid) return;

  const btn = form.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Sending…';

  // Simulate network request — replace with real API call
  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Send Message & Join Community';
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 7000);
  }, 900);
});

form.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('invalid'));
});

// ── Smooth scroll for all anchor links ──────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = 84;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});
