document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. SLIDER --- */
  const slides = [
    { before: 'ba01-before.jpg', after: 'ba01-after.jpg' },
    { before: 'ba02-before.jpg', after: 'ba02-after.jpg' },
    { before: 'ba03-before.jpg', after: 'ba03-after.jpg' },
    { before: 'ba04-before.jpg', after: 'ba04-after.jpg' },
    { before: 'ba05-before.jpg', after: 'ba05-after.jpg' }
  ];
  const imgPath = '/assets/img/before-after/';
  let currentIndex = 0;

  const sliderWrap = document.querySelector('.ba-wrap');
  const imgBefore = document.getElementById('ba-before-img');
  const imgAfter = document.getElementById('ba-after-img');
  const prevBtn = document.getElementById('ba-prev');
  const nextBtn = document.getElementById('ba-next');

  function updateImages(idx) {
    if(!imgBefore || !imgAfter) return;
    const s = slides[idx];
    imgBefore.src = imgPath + s.before;
    imgAfter.src = imgPath + s.after;
  }

  if(prevBtn && nextBtn) {
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + slides.length) % slides.length; updateImages(currentIndex); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % slides.length; updateImages(currentIndex); });
  }

  if (sliderWrap) {
    const handle = sliderWrap.querySelector('.ba-handle');
    
    const setPosition = (x) => {
      requestAnimationFrame(() => {
        const rect = sliderWrap.getBoundingClientRect();
        let pos = x - rect.left;
        if (pos < 0) pos = 0;
        if (pos > rect.width) pos = rect.width;
        sliderWrap.style.setProperty('--split', (pos / rect.width) * 100 + '%');
      });
    };

    const moveMouse = (e) => setPosition(e.clientX);
    const moveTouch = (e) => setPosition(e.touches[0].clientX);

    const stopDrag = () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('touchmove', moveTouch);
      window.removeEventListener('mouseup', stopDrag);
      window.removeEventListener('touchend', stopDrag);
    };

    const startDragMouse = (e) => {
      e.preventDefault();
      window.addEventListener('mousemove', moveMouse);
      window.addEventListener('mouseup', stopDrag);
    };

    const startDragTouch = () => {
      window.addEventListener('touchmove', moveTouch, { passive: false });
      window.addEventListener('touchend', stopDrag);
    };

    if(handle) {
      handle.addEventListener('mousedown', startDragMouse);
      handle.addEventListener('touchstart', startDragTouch, { passive: false });
    }
  }

  /* --- 2. MENU & REVEAL --- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('site-nav');
  if (burger && nav) {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Toggle menu');

    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
    });

    document.addEventListener('click', (e) => { 
      if (!nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const dynamicElements = document.querySelectorAll('.page-hero, .card');
  dynamicElements.forEach(el => el.classList.add('reveal'));

  const allRevealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('active');
        observer.unobserve(e.target);
      }
    });
  }, { rootMargin: "0px 0px -20px 0px" });

  allRevealElements.forEach(el => observer.observe(el));

  /* --- 3. REVIEWS LOGIC --- */
  const homeReviews = document.getElementById('home-reviews');
  const reviewsList = document.getElementById('reviews-list');
  const loadMoreBtn = document.getElementById('loadMoreReviews');

  const PLACE_URL = 'https://www.google.com/maps/search/?api=1&query=Dryer+Vent+Services&query_place_id=ChIJq81LRSoVi4wRJvvg97db1FU';

  const loadingHtml = '<p class="muted" style="text-align:center; width:100%; grid-column:1/-1;">Loading reviews...</p>';
  if(homeReviews) homeReviews.innerHTML = loadingHtml;
  if(reviewsList) reviewsList.innerHTML = loadingHtml;

  const createCard = (r) => {
    const div = document.createElement('div');
    div.className = 'review-card-pro';
    div.style.cursor = 'pointer';
    div.onclick = () => window.open(PLACE_URL, '_blank');

    const authorName = r.author || 'Google User';

    // יצירת המבנה בנפרד (בלי המידע עצמו עדיין)
    div.innerHTML = `
      <div class="review-card-header">
        <div class="review-avatar-circle"></div>
        <div class="review-meta">
          <div class="review-author-name"></div>
          <div class="review-time"></div>
        </div>
        <div style="color:#ffb400">★★★★★</div>
      </div>
      <p class="review-body" style="font-size:0.95rem;"></p>
    `;

    // הזרקת המידע בצורה מאובטחת דרך textContent נגד XSS
    div.querySelector('.review-avatar-circle').textContent = authorName.charAt(0);
    div.querySelector('.review-author-name').textContent = authorName;
    div.querySelector('.review-time').textContent = r.relativeTime || 'Recently';
    div.querySelector('.review-body').textContent = r.text;

    return div;
  };

  fetch('https://dryer-vent-services.office-d16.workers.dev/')
    .then(res => res.json())
    .then(data => {
      const reviews = data.reviews || [];

      if(homeReviews) {
        homeReviews.innerHTML = '';
        reviews.slice(0, 3).forEach(r => homeReviews.appendChild(createCard(r)));
      }

      if(reviewsList) {
        let reviewIndex = 0;
        const batchSize = 3;

        const showNextBatch = () => {
          reviewsList.innerHTML = ''; 
          for(let i=0; i<batchSize; i++) {
            const r = reviews[(reviewIndex + i) % reviews.length]; 
            reviewsList.appendChild(createCard(r));
          }
          reviewIndex = (reviewIndex + batchSize) % reviews.length;
        };

        showNextBatch();

        if(loadMoreBtn) {
          loadMoreBtn.addEventListener('click', () => {
            showNextBatch();
            window.scrollTo({ top: reviewsList.offsetTop - 100, behavior: 'smooth' });
          });
        }
      }
    })
    .catch(err => {
      console.error(err);
      if(homeReviews) homeReviews.innerHTML = '<p class="muted" style="text-align:center;">Could not load reviews at this time.</p>';
      if(reviewsList) reviewsList.innerHTML = '<p class="muted" style="text-align:center;">Could not load reviews at this time.</p>';
    });

  const yr = document.getElementById('copyright-year');
  if(yr) yr.textContent = new Date().getFullYear();
});
