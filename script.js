// =========================================
// BOKES & SOEP — Shared JavaScript
// vzw Burgers in Beweging, Genk
// =========================================

document.addEventListener('DOMContentLoaded', function () {

  // =========================================
  // NAVIGATION — Scroll effect
  // =========================================
  const nav = document.getElementById('main-nav');
  if (nav) {
    function updateNav() {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  // =========================================
  // NAVIGATION — Mobile hamburger
  // =========================================
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileNav.classList.contains('open');
      mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(!isOpen));

      // Animate hamburger lines
      const spans = hamburger.querySelectorAll('span');
      if (!isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close mobile nav when clicking a link
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => s.style.transform = s.style.opacity = '');
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        mobileNav.classList.remove('open');
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // =========================================
  // SCROLL REVEAL — Intersection Observer
  // =========================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for siblings
          const siblings = Array.from(entry.target.parentElement.children)
            .filter(el => el.classList.contains('reveal'));
          const index = siblings.indexOf(entry.target);
          const delay = Math.min(index * 80, 400);

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // =========================================
  // STAT COUNTER — Animated numbers
  // =========================================
  function animateCounter(el, target, duration, suffix) {
    const start = performance.now();
    const startValue = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (target - startValue) * eased);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  // Observe stat numbers
  const statNums = document.querySelectorAll('.stat-block__num, .hero__stat-num');
  if (statNums.length > 0) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const rawText = el.textContent.trim();
          const numMatch = rawText.match(/(\d+)/);
          if (numMatch) {
            const target = parseInt(numMatch[1]);
            const suffix = rawText.replace(numMatch[1], '').replace(/[0-9]/g, '').trim();
            el.textContent = '0' + (suffix ? suffix : '');
            animateCounter(el, target, 1200, suffix ? (' ' + suffix) : suffix);
          }
          statObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => statObserver.observe(el));
  }

  // =========================================
  // SMOOTH HOVER on cards
  // =========================================
  document.querySelectorAll('.card, .team-card, .value-item, .how-step').forEach(card => {
    card.addEventListener('mouseenter', function () {
      this.style.willChange = 'transform, box-shadow';
    });
    card.addEventListener('mouseleave', function () {
      this.style.willChange = 'auto';
    });
  });

  // =========================================
  // ACTIVE NAV LINK
  // =========================================
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });

});
