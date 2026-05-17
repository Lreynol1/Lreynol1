'use strict';

// ── Banner close ─────────────────────────────────────────────────
const bannerEl    = document.getElementById('banner');
const bannerClose = document.getElementById('bannerClose');

if (bannerClose) {
  bannerClose.addEventListener('click', () => {
    bannerEl.classList.add('hidden');
  });
}

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
  // Animate hamburger to X
  hamburger.classList.toggle('is-open', open);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    hamburger.classList.remove('is-open');
  });
});

// ── Billing toggle (monthly / annual) ───────────────────────────
const billingToggle = document.getElementById('billingToggle');
const monthlyLabel  = document.getElementById('monthlyLabel');
const annualLabel   = document.getElementById('annualLabel');
let isAnnual = false;

billingToggle.addEventListener('click', () => {
  isAnnual = !isAnnual;
  billingToggle.setAttribute('aria-checked', isAnnual);
  monthlyLabel.classList.toggle('active', !isAnnual);
  annualLabel.classList.toggle('active',  isAnnual);

  document.querySelectorAll('.pc-amount').forEach(el => {
    el.textContent = isAnnual ? el.dataset.annual : el.dataset.monthly;
  });
});

// ── Accountant search / filter ───────────────────────────────────
const filterCountry = document.getElementById('filterCountry');
const filterSpec    = document.getElementById('filterSpec');
const filterSearch  = document.getElementById('filterSearch');
const searchBtn     = document.getElementById('searchBtn');
const grid          = document.getElementById('accountantsGrid');

function applyFilters() {
  const country = filterCountry.value;
  const spec    = filterSpec.value;
  const query   = filterSearch.value.toLowerCase().trim();

  grid.querySelectorAll('.accountant-card').forEach(card => {
    const cardCountry = card.dataset.country || '';
    const cardSpec    = card.dataset.spec    || '';
    const cardText    = card.textContent.toLowerCase();

    const matchCountry = country === 'all' || cardCountry === country;
    const matchSpec    = spec    === 'all' || cardSpec.includes(spec);
    const matchQuery   = !query  || cardText.includes(query);

    card.classList.toggle('hidden', !(matchCountry && matchSpec && matchQuery));
  });
}

searchBtn.addEventListener('click', applyFilters);
filterSearch.addEventListener('keydown', e => { if (e.key === 'Enter') applyFilters(); });
filterCountry.addEventListener('change', applyFilters);
filterSpec.addEventListener('change', applyFilters);

// ── Resource tabs ────────────────────────────────────────────────
document.querySelectorAll('.res-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.res;

    document.querySelectorAll('.res-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    document.querySelectorAll('.resource-card').forEach(card => {
      const tags = card.dataset.res || '';
      card.classList.toggle('hidden', filter !== 'all' && !tags.includes(filter));
    });
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
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 5) * 0.07}s`;
  revealObserver.observe(el);
});

// ── Diaspora bar animation ───────────────────────────────────────
// Bars start at 0 width; CSS transition handles the animation once visible
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.dmr-fill').forEach(fill => {
        // width is already set via inline style; trigger reflow to animate
        fill.style.width = fill.style.width;
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const diasporaMap = document.querySelector('.diaspora-map');
if (diasporaMap) {
  // Initially set to 0, then animate in
  diasporaMap.querySelectorAll('.dmr-fill').forEach(fill => {
    const target = fill.style.width;
    fill.style.width = '0';
    fill.dataset.target = target;
  });

  barObserver.observe(diasporaMap);

  const barReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.dmr-fill').forEach((fill, i) => {
          setTimeout(() => {
            fill.style.width = fill.dataset.target;
          }, i * 150);
        });
        barReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  barReveal.observe(diasporaMap);
}

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

  setTimeout(() => {
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Send Message';
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 7000);
  }, 900);
});

form.querySelectorAll('input, select, textarea').forEach(field => {
  field.addEventListener('input', () => field.classList.remove('invalid'));
});

// ── Smooth scroll for anchor links ──────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    const target = href === '#' ? document.documentElement : document.querySelector(href);
    if (!target) return;
    if (href === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Live activity ticker (simulate real-time activity) ───────────
const activities = [
  'New consultation booked · Miami, FL',
  'Tax guide shared · Toronto, ON',
  'Accountant verified · Kingston, JM',
  'Member joined · Brampton, ON',
  'Forum reply posted · Atlanta, GA',
  'Webinar registration · New York, NY',
  'Guide downloaded · Montego Bay, JM',
  'Profile updated · Edmonton, AB',
];

let activityIndex = 0;
const activityItems = document.querySelectorAll('.activity-item span');

if (activityItems.length) {
  setInterval(() => {
    const item = activityItems[activityIndex % activityItems.length];
    item.style.opacity = '0';
    setTimeout(() => {
      item.textContent = activities[Math.floor(Math.random() * activities.length)];
      item.style.opacity = '';
    }, 350);
    activityIndex++;
  }, 3200);
}
