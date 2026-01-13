document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. SLIDER DATA & LOGIC (SWAP + DRAG) --- */
  
  // רשימת התמונות שלך (מתוך ה-JSON ששלחת)
  const slides = [
    { before: 'ba01-before.jpg', after: 'ba01-after.jpg' },
    { before: 'ba02-before.jpg', after: 'ba02-after.jpg' },
    { before: 'ba03-before.jpg', after: 'ba03-after.jpg' },
    { before: 'ba04-before.jpg', after: 'ba04-after.jpg' },
    { before: 'ba05-before.jpg', after: 'ba05-after.jpg' }
  ];
  const imgPath = '/assets/img/before-after/'; // הנתיב לתיקייה
  let currentSlideIndex = 0;

  const sliderWrap = document.querySelector('.ba-wrap');
  const imgBefore = document.getElementById('img-before');
  const imgAfter = document.getElementById('img-after');
  const prevBtn = document.getElementById('prev-slide');
  const nextBtn = document.getElementById('next-slide');

  // פונקציה לעדכון התמונות
  function updateSlide(index) {
    if(!imgBefore || !imgAfter) return;
    const slide = slides[index];
    imgBefore.src = imgPath + slide.before;
    imgAfter.src = imgPath + slide.after;
    
    // אופציונלי: איפוס הסליידר לאמצע בכל החלפה
    // sliderWrap.style.setProperty('--split', '50%'); 
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // למנוע התנגשויות
      currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
      updateSlide(currentSlideIndex);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentSlideIndex = (currentSlideIndex + 1) % slides.length;
      updateSlide(currentSlideIndex);
    });
  }

  // לוגיקת גרירה - רק על הידית!
  if (sliderWrap) {
    const handle = sliderWrap.querySelector('.ba-handle');
    let isDragging = false;

    const updatePosition = (clientX) => {
      const rect = sliderWrap.getBoundingClientRect();
      let x = clientX - rect.left;
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;
      const percent = (x / rect.width) * 100;
      sliderWrap.style.setProperty('--split', `${percent}%`);
    };

    const startDrag = (e) => {
      isDragging = true;
      e.preventDefault(); 
    };

    const stopDrag = () => {
      isDragging = false;
    };

    const doDrag = (clientX) => {
      if (isDragging) updatePosition(clientX);
    };

    // מתחיל רק כשלוחצים על הידית
    if(handle) {
      handle.addEventListener('mousedown', startDrag);
      handle.addEventListener('touchstart', startDrag, { passive: false });
    }

    // מפסיק בכל מקום
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);

    // זז בכל מקום (כל עוד התחלנו בגרירה)
    window.addEventListener('mousemove', (e) => doDrag(e.clientX));
    window.addEventListener('touchmove', (e) => doDrag(e.touches[0].clientX), { passive: false });
  }

  /* --- 2. GLOBAL NAV --- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('site-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('open')) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --- 3. REVEAL ANIMATIONS --- */
  const revealElements = document.querySelectorAll('.section, .page-hero, .hero-title, .hero-sub, .hero-actions, .card, .btn');
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('reveal', 'appear');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealElements.forEach(el => el.classList.add('reveal'));
  revealElements.forEach(el => revealObserver.observe(el));

  /* --- 4. GOOGLE REVIEWS --- */
  const ENDPOINT = 'https://dryer-vent-services.office-d16.workers.dev/';
  const PLACE_URL = 'https://www.google.com/maps/search/?api=1&query=Dryer+Vent+Services&query_place_id=ChIJq81LRSoVi4wRJvvg97db1FU';
  
  async function fetchReviews() {
    try {
      const res = await fetch(ENDPOINT);
      if (!res.ok) return;
      const data = await res.json();
      const reviews = Array.isArray(data.reviews) ? data.reviews : [];
      
      const container = document.getElementById('home-reviews');
      if(container && reviews.length) {
        container.innerHTML = ''; // Clear loading
        reviews.slice(0, 3).forEach(r => {
           container.appendChild(createReviewCard(r));
        });
      }
    } catch (e) { console.error(e); }
  }
  
  function createReviewCard(review) {
    const card = document.createElement('article');
    card.className = 'review-card-pro';
    card.addEventListener('click', () => window.open(PLACE_URL, '_blank'));
    
    // Avatar
    const avatar = document.createElement('div');
    avatar.className = 'review-avatar-circle';
    avatar.textContent = (review.author || 'G').charAt(0).toUpperCase();
    
    // Content
    const body = document.createElement('div');
    body.innerHTML = `
      <div class="review-author-name">${review.author}</div>
      <div class="review-stars-row" style="color:#f7b500">★★★★★</div>
      <p class="review-body" style="font-size:0.9rem; margin-top:6px;">${review.text || ''}</p>
    `;
    
    const header = document.createElement('div');
    header.className = 'review-card-header';
    header.appendChild(avatar);
    header.appendChild(body);
    card.appendChild(header);
    return card;
  }
  
  fetchReviews();
});
