/* ══════════════════════════════════════════
   EGYPTIAN RESTAURANT DIGITAL MENU — JS
   ══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── DOM refs ── */
  const catNav   = document.getElementById('catNav');
  const catTrack = document.getElementById('catTrack');
  const catBtns  = document.querySelectorAll('.cat-btn');
  const sections = document.querySelectorAll('.menu-section');
  const toast    = document.getElementById('orderToast');
  const coverPage = document.getElementById('coverPage');
  const coverCta  = document.getElementById('coverCta');

  /* ──────────────────────────────────────────
     0. COVER PAGE
  ────────────────────────────────────────── */
  if (coverPage) {
    // Trigger background zoom-out animation
    requestAnimationFrame(() => coverPage.classList.add('loaded'));

    function dismissCover() {
      const menuTop = document.querySelector('.site-header');
      if (menuTop) {
        menuTop.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: coverPage.offsetHeight, behavior: 'smooth' });
      }
    }

    // CTA button click
    if (coverCta) coverCta.addEventListener('click', dismissCover);

    // Also dismiss on swipe up — user scrolls past cover naturally
  }

  /* ──────────────────────────────────────────
     1. CATEGORY NAV — scroll to section
  ────────────────────────────────────────── */
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;

      const offset = catNav.offsetHeight + 10;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ──────────────────────────────────────────
     2. ACTIVE NAV HIGHLIGHT on scroll
  ────────────────────────────────────────── */
  function highlightActiveCategory() {
    const scrollY   = window.scrollY;
    const navBottom = catNav.offsetHeight + 40;
    let current = '';

    sections.forEach(section => {
      const top = section.getBoundingClientRect().top + scrollY - navBottom;
      if (scrollY >= top) current = section.id;
    });

    catBtns.forEach(btn => {
      const isActive = btn.dataset.target === current;
      btn.classList.toggle('active', isActive);

      if (isActive) {
        btn.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
      }
    });
  }

  /* ──────────────────────────────────────────
     3. STICKY NAV SHADOW
  ────────────────────────────────────────── */
  function onScroll() {
    catNav.style.boxShadow = window.scrollY > 4
      ? '0 3px 16px rgba(45,30,18,0.13)'
      : '';
    highlightActiveCategory();
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ──────────────────────────────────────────
     4. SCROLL REVEAL
  ────────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
  );

  sections.forEach(s => revealObserver.observe(s));

  /* ──────────────────────────────────────────
     5. ORDER BUTTON — toast feedback
  ────────────────────────────────────────── */
  let toastTimer = null;

  function showToast() {
    if (toastTimer) clearTimeout(toastTimer);
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.textContent = '✓ تمت الإضافة';
      btn.style.background = '#16a34a';
      btn.style.color = '#fff';
      btn.style.borderColor = '#16a34a';

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 1500);

      showToast();
    });
  });

  /* ──────────────────────────────────────────
     6. WHATSAPP FAB — show after short delay
  ────────────────────────────────────────── */
  const fab = document.querySelector('.whatsapp-fab');
  if (fab) {
    fab.style.opacity = '0';
    fab.style.transform = 'translateY(20px)';
    fab.style.transition = 'opacity 0.4s, transform 0.4s';
    setTimeout(() => {
      fab.style.opacity = '1';
      fab.style.transform = 'translateY(0)';
    }, 1200);
  }

  /* ──────────────────────────────────────────
     7. INITIAL STATE
  ────────────────────────────────────────── */
  if (catBtns.length) catBtns[0].classList.add('active');
  if (sections.length) sections[0].classList.add('visible');

})();
