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
     3. ANIMATIONS: Reveal on Scroll
  ----------------------------------------------- */
  const groups = [];
  document.querySelectorAll('.section, .page-hero, .cta-bar').forEach(sec => {
    const targets = sec.querySelectorAll('h1, h2, .card, .btn, p, .cards-3 > *');
    targets.forEach(el => el.classList.add('reveal'));
    groups.push([...targets]);
  });

  document.querySelectorAll('.hero .hero-inner > *, .fade-in').forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        let delay = 0;
        for (const g of groups) {
          const idx = g.indexOf(el);
          if (idx >= 0) { 
            delay = Math.min(idx * 80, 400); 
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
     4. GOOGLE REVIEWS (Live from Worker)
  ----------------------------------------------- */
  const ENDPOINT = 'https://dryer-vent-services.office-d16.workers.dev/';
  const PLACE_URL = 'https://www.google.com/maps/search/?api=1&query=Dryer+Vent+Services&query_place_id=ChIJq81LRSoVi4wRJvvg97db1FU';
  const GOOGLE_REVIEW_URL = 'https://g.page/r/CSb74Pe3W9RVEBE/review';

  let allReviews = [];
  let cursor = 0;

  async function fetchReviews() {
    if (allReviews.length) return;
    try {
      const res = await fetch(ENDPOINT);
      if (!res.ok) throw new Error('Bad response from worker');
      const data = await res.json();
      allReviews = Array.isArray(data.reviews) ? data.reviews : [];
    } catch (e) {
      console.error('Failed to load reviews', e);
      allReviews = [];
    }
  }

  function createReviewCard(review) {
    const card = document.createElement('article');
    card.className = 'review-card-pro';
    card.style.animation = "fadeIn 0.5s ease-in-out";

    card.addEventListener('click', () => {
      if (window.getSelection().toString().length > 0) return;
      window.open(PLACE_URL, '_blank', 'noopener');
    });

    const header = document.createElement('div');
    header.className = 'review-card-header';

    const avatar = document.createElement('div');
    avatar.className = 'review-avatar-circle';
    const firstLetter = (review.author || '?').trim().charAt(0).toUpperCase();
    avatar.textContent = firstLetter || 'G';

    const meta = document.createElement('div');
    meta.className = 'review-meta';

    const name = document.createElement('div');
    name.className = 'review-author-name';
    name.textContent = review.author || 'Google user';

    const row = document.createElement('div');
    row.className = 'review-stars-row';

    const stars = document.createElement('span');
    stars.className = 'review-stars';
    const rating = Number(review.rating) || 5;
    
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'star ' + (i <= rating ? 'star--full' : 'star--empty');
      star.textContent = '★';
      stars.appendChild(star);
    }

    const ratingNumber = document.createElement('span');
    ratingNumber.className = 'review-rating-number';
    
    row.appendChild(stars);
    row.appendChild(ratingNumber);

    const time = document.createElement('div');
    time.className = 'review-time';
    time.textContent = review.relativeTime || '';

    meta.appendChild(name);
    meta.appendChild(row);
    meta.appendChild(time);

    header.appendChild(avatar);
    header.appendChild(meta);

    const body = document.createElement('p');
    body.className = 'review-body';
    body.textContent = review.text || '';

    card.appendChild(header);
    card.appendChild(body);

    return card;
  }

  function renderNext(container, count, { reset = false } = {}) {
    if (!allReviews.length || !container) return;
    if (reset) container.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const review = allReviews[cursor % allReviews.length];
      const card = createReviewCard(review);
      container.appendChild(card);
      cursor++;
    }
  }

  (async () => {
    await fetchReviews();

    const homeContainer = document.getElementById('home-reviews');
    const homeMoreBtn = document.getElementById('homeReviewsMoreLink');

    if (homeContainer) {
      cursor = 0;
      renderNext(homeContainer, 3, { reset: true });
      if (homeMoreBtn) {
        homeMoreBtn.addEventListener('click', () => {
           if (homeMoreBtn.tagName !== 'A') {
             window.location.href = '/reviews/';
           }
        });
      }
    }

    const reviewsContainer = document.getElementById('reviews-list');
    const reviewsMoreBtn = document.getElementById('loadMoreReviews');

    if (reviewsContainer) {
      cursor = 0;
      const initialCount = window.innerWidth < 768 ? 3 : 6;
      renderNext(reviewsContainer, initialCount, { reset: true });

      if (reviewsMoreBtn) {
        reviewsMoreBtn.addEventListener('click', () => {
          renderNext(reviewsContainer, initialCount, { reset: true });
          reviewsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
    }

    ['rateOnGoogleHome', 'rateOnGoogleReviews'].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => {
          window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener');
        });
      }
    });
  })();

  /* -----------------------------------------------
     5. CLEANUP
  ----------------------------------------------- */
  if (page === 'contact') {
    document.querySelectorAll('.section .container div').forEach(el => {
      const t = (el.textContent || '').trim();
      if (['💬', '🗨️', '💭'].includes(t) && el.children.length === 0) {
        el.remove();
      }
    });
  }

  /* -----------------------------------------------
     6. BEFORE / AFTER SLIDER LOGIC (Fix: Conflict with arrows)
  ----------------------------------------------- */
  const sliders = document.querySelectorAll('.ba-wrap');
  
  sliders.forEach(slider => {
    const updatePosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      const percent = (x / rect.width) * 100;
      slider.style.setProperty('--split', `${percent}%`);
    };

    slider.addEventListener('mousemove', (e) => {
      // אם העכבר על כפתור חץ, אל תזיז את הסליידר
      if (e.target.closest('.ba-arrow')) return;
      updatePosition(e.clientX);
    });

    slider.addEventListener('touchmove', (e) => {
      // אם האצבע על כפתור חץ, אל תזיז את הסליידר
      if (e.target.closest('.ba-arrow')) return;
      updatePosition(e.touches[0].clientX);
    }, { passive: true });
  });

});

const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
