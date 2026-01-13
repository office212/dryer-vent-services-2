document.addEventListener('DOMContentLoaded', () => {
  
  /* -----------------------------------------------
     1. GLOBAL: Navigation & Burger Menu
  ----------------------------------------------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('site-nav');
  
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Active Navigation Highlight
  const page = document.body.getAttribute('data-page') || '';
  if (page) {
    // Try to match data-nav
    document.querySelectorAll(`[data-nav="${page}"]`).forEach(el => el.classList.add('active'));
  }

  /* -----------------------------------------------
     2. GLOBAL: Auto-Update Copyright Year
  ----------------------------------------------- */
  const yearSpan = document.getElementById('copyright-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  /* -----------------------------------------------
     3. ANIMATIONS: Reveal on Scroll (Unified)
  ----------------------------------------------- */
  // Add .reveal class dynamically to key elements for smoother entrance
  const groups = [];
  document.querySelectorAll('.section, .page-hero, .cta-bar').forEach(sec => {
    // Select elements to animate inside sections
    const targets = sec.querySelectorAll('h1, h2, .card, .btn, p, .cards-3 > *');
    targets.forEach(el => el.classList.add('reveal'));
    groups.push([...targets]);
  });
  
  // Also animate items explicitly marked with .fade-in or .hero-inner
  document.querySelectorAll('.hero .hero-inner > *, .fade-in').forEach(el => el.classList.add('reveal'));

  // The Observer
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        
        // Stagger effect: calculate delay based on index in group
        let delay = 0;
        for (const g of groups) {
          const idx = g.indexOf(el);
          if (idx >= 0) { 
            delay = Math.min(idx * 80, 400); // Cap delay at 400ms
            break; 
          }
        }
        
        if (delay > 0) el.style.transitionDelay = `${delay}ms`;
        
        el.classList.add('appear');
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* -----------------------------------------------
     4. OPTIONAL: Reviews Cycle (if exists)
  ----------------------------------------------- */
  const wrap = document.getElementById('reviewsCycle');
  const btn = document.getElementById('cycleReviews');
  if (wrap && btn) {
    const items = Array.from(wrap.querySelectorAll('.review'));
    const step = 3;
    let idx = 0;

    function render() {
      items.forEach(el => el.style.display = 'none');
      for (let i = 0; i < step; i++) {
        const k = (idx + i) % items.length;
        if (items[k]) items[k].style.display = 'block';
      }
    }
    
    // Initial render
    render();
    
    btn.addEventListener('click', () => {
      idx = (idx + step) % items.length;
      render();
    });
  }

  /* -----------------------------------------------
     5. CLEANUP: Remove Empty Emoji Artifacts
  ----------------------------------------------- */
  if (page === 'contact') {
    document.querySelectorAll('.section .container div').forEach(el => {
      const t = (el.textContent || '').trim();
      // Remove divs that contain ONLY specific emojis and nothing else
      if (['💬', '🗨️', '💭'].includes(t) && el.children.length === 0) {
        el.remove();
      }
    });
  }
});
