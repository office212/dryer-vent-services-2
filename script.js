/* --- 0. CONVERSION TRACKING --- */
window.trackEvent = window.trackEvent || function(name, params) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(Object.assign({ event: name }, params || {}));
  if (typeof window.gtag === 'function') {
    try { window.gtag('event', name, params || {}); } catch (e) {}
  }
};
document.addEventListener('click', function(e) {
  var a = e.target && e.target.closest ? e.target.closest('a[href^="tel:"], a[href*="wa.me"]') : null;
  if (a && window.trackEvent) {
    window.trackEvent(a.href.indexOf('wa.me') > -1 ? 'whatsapp_click' : 'phone_click', { link_url: a.href });
  }
});

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
    const goPrev = (e) => { e.stopPropagation(); currentIndex = (currentIndex - 1 + slides.length) % slides.length; updateImages(currentIndex); };
    const goNext = (e) => { e.stopPropagation(); currentIndex = (currentIndex + 1) % slides.length; updateImages(currentIndex); };
    prevBtn.addEventListener('click', goPrev);
    nextBtn.addEventListener('click', goNext);
    prevBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goPrev(e); } });
    nextBtn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goNext(e); } });
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
      handle.addEventListener('keydown', (e) => {
        const rect = sliderWrap.getBoundingClientRect();
        const cur = parseFloat(getComputedStyle(sliderWrap).getPropertyValue('--split')) || 50;
        let next = null;
        if (e.key === 'ArrowLeft') next = cur - 5;
        else if (e.key === 'ArrowRight') next = cur + 5;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = 100;
        if (next !== null) {
          e.preventDefault();
          next = Math.max(0, Math.min(100, next));
          sliderWrap.style.setProperty('--split', next + '%');
          handle.setAttribute('aria-valuenow', Math.round(next));
        }
      });
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

  const yr = document.getElementById('copyright-year');
  if(yr) yr.textContent = new Date().getFullYear();
});

/* --- SERVICE WORKER RETIREMENT --- */
/* The site never registers a service worker, but a visitor may still
   have one (and its caches) from an earlier version. Retire any such
   registration and clear its caches so returning visitors do not keep
   getting stale cached pages. This snippet deliberately never calls
   navigator.serviceWorker.register(), so it cannot install a new
   worker. Every step is guarded so a failure here cannot break the
   rest of the page. */
(function retireServiceWorkers() {
  try {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      registrations.forEach(function (registration) {
        try {
          var result = registration.unregister();
          if (result && result.catch) result.catch(function () {});
        } catch (e) {}
      });
    }).catch(function () {});
    if (window.caches && typeof caches.keys === 'function') {
      caches.keys().then(function (names) {
        names.forEach(function (name) {
          try {
            var result = caches.delete(name);
            if (result && result.catch) result.catch(function () {});
          } catch (e) {}
        });
      }).catch(function () {});
    }
  } catch (e) {}
})();
