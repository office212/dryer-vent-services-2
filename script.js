document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. REVEAL ANIMATION (Safe) --- */
  const revealElements = document.querySelectorAll('.section, .page-hero, .card, .btn, .faq-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('appear');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => observer.observe(el));

  /* --- 2. BEFORE/AFTER SLIDER --- */
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
    let dragging = false;
    const setPosition = (x) => {
      const rect = sliderWrap.getBoundingClientRect();
      let pos = x - rect.left;
      if (pos < 0) pos = 0;
      if (pos > rect.width) pos = rect.width;
      sliderWrap.style.setProperty('--split', (pos / rect.width) * 100 + '%');
    };
    const start = (e) => { dragging = true; e.preventDefault(); };
    const end = () => { dragging = false; };
    const move = (e) => { if(dragging) setPosition(e.clientX); };
    const touchMove = (e) => { if(dragging) setPosition(e.touches[0].clientX); };

    if(handle) { handle.addEventListener('mousedown', start); handle.addEventListener('touchstart', start, { passive: false }); }
    window.addEventListener('mouseup', end); window.addEventListener('touchend', end);
    window.addEventListener('mousemove', move); window.addEventListener('touchmove', touchMove, { passive: false });
  }

  /* --- 3. MENU --- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('site-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => nav.classList.toggle('open'));
    document.addEventListener('click', (e) => { if (!nav.contains(e.target) && !burger.contains(e.target)) nav.classList.remove('open'); });
  }

  /* --- 4. REVIEWS (Fixed: Works on Home AND Reviews Page) --- */
  const homeReviews = document.getElementById('home-reviews'); // דף הבית
  const reviewsList = document.getElementById('reviews-list'); // דף הביקורות
  const PLACE_URL = 'https://www.google.com/maps/search/?api=1&query=Dryer+Vent+Services&query_place_id=ChIJq81LRSoVi4wRJvvg97db1FU';

  const createCard = (r) => {
    const div = document.createElement('div');
    div.className = 'review-card-pro';
    div.style.cursor = 'pointer'; // מראה שזה לחיץ
    div.onclick = () => window.open(PLACE_URL, '_blank'); // הלינק תוקן
    div.innerHTML = `
      <div class="review-card-header">
        <div class="review-avatar-circle">${(r.author||'G').charAt(0)}</div>
        <div>
          <div class="review-author-name">${r.author}</div>
          <div style="color:#ffb400">★★★★★</div>
        </div>
      </div>
      <p class="review-body" style="margin-top:10px; font-size:0.95rem;">${r.text}</p>
    `;
    return div;
  };

  const renderReviews = (list) => {
    // 1. אם אנחנו בדף הבית - הצג 3
    if(homeReviews) {
      homeReviews.innerHTML = '';
      list.slice(0, 3).forEach(r => homeReviews.appendChild(createCard(r)));
    }
    // 2. אם אנחנו בדף הביקורות - הצג את כולם
    if(reviewsList) {
      reviewsList.innerHTML = '';
      list.forEach(r => reviewsList.appendChild(createCard(r)));
    }
  };

  // גיבוי למקרה שהשרת לא עונה
  const backupReviews = [
    { author: "Michael B.", text: "Excellent service! They came on time and fixed my clogged vent quickly.", rating: 5 },
    { author: "Sarah L.", text: "Highly recommend. Very professional and clean work.", rating: 5 },
    { author: "David K.", text: "Saved me from a potential fire hazard. Thank you!", rating: 5 }
  ];

  fetch('https://dryer-vent-services.office-d16.workers.dev/')
    .then(res => res.json())
    .then(data => {
      if(data.reviews && data.reviews.length) renderReviews(data.reviews);
      else renderReviews(backupReviews);
    })
    .catch(() => renderReviews(backupReviews));
  
  // Footer Year
  const yr = document.getElementById('copyright-year');
  if(yr) yr.textContent = new Date().getFullYear();
});
