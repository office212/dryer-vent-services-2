document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. REVEAL ANIMATION (Safe Mode) --- */
  // מפעיל את האנימציה מיד כדי שהתוכן לא יישאר מוסתר אם ה-JS נתקע
  const revealElements = document.querySelectorAll('.section, .page-hero, .card, .btn, .faq-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('appear');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  /* --- 2. BEFORE/AFTER SLIDER (The Fix) --- */
  const slides = [
    { before: 'ba01-before.jpg', after: 'ba01-after.jpg' },
    { before: 'ba02-before.jpg', after: 'ba02-after.jpg' },
    { before: 'ba03-before.jpg', after: 'ba03-after.jpg' },
    { before: 'ba04-before.jpg', after: 'ba04-after.jpg' },
    { before: 'ba05-before.jpg', after: 'ba05-after.jpg' }
  ];
  // נתיב בסיס לתמונות
  const imgPath = '/assets/img/before-after/';
  
  let currentIndex = 0;
  const sliderWrap = document.querySelector('.ba-wrap');
  const imgBefore = document.getElementById('ba-before-img');
  const imgAfter = document.getElementById('ba-after-img');
  const prevBtn = document.getElementById('ba-prev');
  const nextBtn = document.getElementById('ba-next');

  // פונקציה להחלפת תמונות (לא מזיזה את הסליידר)
  function updateImages(idx) {
    if(!imgBefore || !imgAfter) return;
    const s = slides[idx];
    // טעינת התמונות החדשות
    imgBefore.src = imgPath + s.before;
    imgAfter.src = imgPath + s.after;
  }

  if(prevBtn && nextBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // וודא שהלחיצה לא מפעילה גרירה
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateImages(currentIndex);
    });

    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % slides.length;
      updateImages(currentIndex);
    });
  }

  // לוגיקת גרירה (Drag) - עובדת רק על הידית
  if (sliderWrap) {
    const handle = sliderWrap.querySelector('.ba-handle');
    let dragging = false;

    const setPosition = (x) => {
      const rect = sliderWrap.getBoundingClientRect();
      let pos = x - rect.left;
      if (pos < 0) pos = 0;
      if (pos > rect.width) pos = rect.width;
      
      const percent = (pos / rect.width) * 100;
      sliderWrap.style.setProperty('--split', percent + '%');
    };

    // מתחיל רק אם לוחצים על הידית
    const start = (e) => { dragging = true; e.preventDefault(); };
    const end = () => { dragging = false; };
    const move = (e) => { if(dragging) setPosition(e.clientX); };
    const touchMove = (e) => { if(dragging) setPosition(e.touches[0].clientX); };

    if(handle) {
      handle.addEventListener('mousedown', start);
      handle.addEventListener('touchstart', start, { passive: false });
    }
    
    // מאזין לכל המסך כדי שהגרירה לא תיתקע אם יוצאים מהאלמנט
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', touchMove, { passive: false });
  }

  /* --- 3. MENU --- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('site-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('open');
      }
    });
  }

  /* --- 4. REVIEWS --- */
  const homeReviews = document.getElementById('home-reviews');
  if(homeReviews) {
    // נתונים סטטיים לגיבוי מהיר אם ה-Fetch נכשל (כדי שלא יהיה ריק)
    const backupReviews = [
      { author: "Michael B.", text: "Excellent service! They came on time and fixed my clogged vent quickly.", rating: 5 },
      { author: "Sarah L.", text: "Highly recommend. Very professional and clean work.", rating: 5 },
      { author: "David K.", text: "Saved me from a potential fire hazard. Thank you!", rating: 5 }
    ];

    const renderReviews = (list) => {
      homeReviews.innerHTML = '';
      list.slice(0,3).forEach(r => {
        const div = document.createElement('div');
        div.className = 'review-card-pro';
        div.innerHTML = `
          <div class="review-card-header">
            <div class="review-avatar-circle">${r.author[0]}</div>
            <div>
              <div class="review-author-name">${r.author}</div>
              <div style="color:#f7b500">★★★★★</div>
            </div>
          </div>
          <p class="review-body">${r.text}</p>
        `;
        homeReviews.appendChild(div);
      });
    };

    // נסה למשוך מגוגל, אם נכשל - הצג גיבוי
    fetch('https://dryer-vent-services.office-d16.workers.dev/')
      .then(res => res.json())
      .then(data => {
        if(data.reviews && data.reviews.length) renderReviews(data.reviews);
        else renderReviews(backupReviews);
      })
      .catch(() => renderReviews(backupReviews));
  }
  
  // Footer Year
  const yr = document.getElementById('copyright-year');
  if(yr) yr.textContent = new Date().getFullYear();

});
