document.addEventListener('DOMContentLoaded', () => {

  /* 1. SLIDER LOGIC */
  // רשימת התמונות המדויקת מהתיקייה שלך
  const slides = [
    { before: 'ba01-before.jpg', after: 'ba01-after.jpg' },
    { before: 'ba02-before.jpg', after: 'ba02-after.jpg' },
    { before: 'ba03-before.jpg', after: 'ba03-after.jpg' },
    { before: 'ba04-before.jpg', after: 'ba04-after.jpg' },
    { before: 'ba05-before.jpg', after: 'ba05-after.jpg' }
  ];
  // נתיב בסיס
  const imgPath = '/assets/img/before-after/';
  let currentSlideIndex = 0;

  const sliderWrap = document.querySelector('.ba-wrap');
  const imgBefore = document.getElementById('ba-before-img');
  const imgAfter = document.getElementById('ba-after-img');
  const prevBtn = document.getElementById('ba-prev');
  const nextBtn = document.getElementById('ba-next');

  // החלפת תמונות (לחיצה על חיצים)
  function loadSlide(index) {
    if (!imgBefore || !imgAfter) return;
    const slide = slides[index];
    imgBefore.src = imgPath + slide.before;
    imgAfter.src = imgPath + slide.after;
    // איפוס קטן כדי שהמשתמש יראה את השינוי (אופציונלי)
    // sliderWrap.style.setProperty('--split', '50%');
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation(); 
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      loadSlide(currentSlideIndex);
    });
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      loadSlide(currentSlideIndex);
    });
  }

  // גרירה (Drag) - רק על הידית
  if (sliderWrap) {
    const handle = sliderWrap.querySelector('.ba-handle');
    let isDragging = false;

    const updateSplit = (clientX) => {
      const rect = sliderWrap.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      const percent = (x / rect.width) * 100;
      sliderWrap.style.setProperty('--split', `${percent}%`);
    };

    const start = (e) => { isDragging = true; e.preventDefault(); };
    const stop = () => { isDragging = false; };
    const move = (clientX) => { if (isDragging) updateSplit(clientX); };

    if (handle) {
      handle.addEventListener('mousedown', start);
      handle.addEventListener('touchstart', start, { passive: false });
    }
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchend', stop);
    window.addEventListener('mousemove', (e) => move(e.clientX));
    window.addEventListener('touchmove', (e) => move(e.touches[0].clientX), { passive: false });
  }

  /* 2. MENU & GLOBAL */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('site-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* 3. ANIMATIONS */
  const revealElements = document.querySelectorAll('.section, .page-hero, .card, .btn');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal', 'appear');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  /* 4. GOOGLE REVIEWS */
  const ENDPOINT = 'https://dryer-vent-services.office-d16.workers.dev/';
  async function fetchReviews() {
    try {
      const res = await fetch(ENDPOINT);
      if (!res.ok) return;
      const data = await res.json();
      const reviews = Array.isArray(data.reviews) ? data.reviews : [];
      const container = document.getElementById('home-reviews');
      if (container && reviews.length) {
        container.innerHTML = '';
        reviews.slice(0, 3).forEach(r => {
           const card = document.createElement('div');
           card.className = 'review-card-pro';
           card.style.padding = '18px';
           card.innerHTML = `
             <div class="review-card-header">
               <div class="review-avatar-circle">${(r.author||'G').charAt(0)}</div>
               <div>
                 <div class="review-author-name">${r.author}</div>
                 <div style="color:#f7b500">★★★★★</div>
               </div>
             </div>
             <p style="font-size:0.9rem; margin-top:8px;">${r.text}</p>
           `;
           container.appendChild(card);
        });
      }
    } catch (e) { console.error(e); }
  }
  fetchReviews();
});
