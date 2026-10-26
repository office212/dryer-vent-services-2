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
    { before: 'ba18-before.webp', after: 'ba18-after.webp' },
    { before: 'ba02-before.jpg', after: 'ba02-after.jpg' },
    { before: 'ba03-before.jpg', after: 'ba03-after.jpg' },
    { before: 'ba04-before.jpg', after: 'ba04-after.jpg' },
    { before: 'ba05-before.jpg', after: 'ba05-after.jpg' },
    { before: 'ba06-before.webp', after: 'ba06-after.webp' },
    { before: 'ba07-before.webp', after: 'ba07-after.webp' },
    { before: 'ba08-before.webp', after: 'ba08-after.webp' },
    { before: 'ba09-before.webp', after: 'ba09-after.webp' },
    { before: 'ba10-before.webp', after: 'ba10-after.webp' },
    { before: 'ba11-before.webp', after: 'ba11-after.webp' },
    { before: 'ba12-before.webp', after: 'ba12-after.webp' },
    { before: 'ba13-before.webp', after: 'ba13-after.webp' },
    { before: 'ba14-before.webp', after: 'ba14-after.webp' },
    { before: 'ba15-before.webp', after: 'ba15-after.webp' },
    { before: 'ba16-before.webp', after: 'ba16-after.webp' },
    { before: 'ba17-before.webp', after: 'ba17-after.webp' },
    { before: 'ba01-before.jpg', after: 'ba01-after.jpg' }
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

/* תוספת לדף הבית בלבד — רצה רק כש-body.home קיים, ואינה נוגעת בלוגיקת הסליידר הקיימת */
document.addEventListener('DOMContentLoaded', function () {
  if (!document.body || !document.body.classList.contains('home')) return;
  function safe(fn) { try { fn(); } catch (e) {} }
  safe(function () {
    var progress = document.createElement('div');
    progress.className = 'home-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(progress, document.body.firstChild);
    var header = document.querySelector('.site-header');
    var hero = document.querySelector('.hero-modern');
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
        progress.style.width = pct + '%';
        if (header) header.classList.toggle('home-scrolled', window.scrollY > 10);
        if (hero && !reduced) {
          var rect = hero.getBoundingClientRect();
          var shift = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.05;
          shift = Math.max(-24, Math.min(24, shift));
          hero.style.setProperty('--home-hero-shift', shift + 'px');
        }
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  });
  safe(function () {
    document.querySelectorAll('.trust-item > span').forEach(function (span) {
      var text = span.textContent || '';
      if (text.indexOf('5-Star Google Rated') === 0) {
        span.innerHTML = '<span class="home-count" data-count="5">5</span>-Star Google Rated';
      } else if (text.indexOf('2,000+ Happy Customers') === 0) {
        span.innerHTML = '<span class="home-count" data-count="2000">2,000</span>+ Happy Customers';
      }
    });
    var counts = document.querySelectorAll('.home-count');
    if (!counts.length || !('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        observer.unobserve(el);
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (isNaN(target)) return;
        var start = null;
        function step(ts) {
          if (start === null) start = ts;
          var p = Math.min(1, (ts - start) / 1200);
          var value = Math.round(target * p);
          el.textContent = target >= 1000 ? value.toLocaleString('en-US') : String(value);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counts.forEach(function (el) { observer.observe(el); });
  });
  safe(function () {
    var section = document.querySelector('.home-services-section');
    var grid = section ? section.querySelector('.services-grid') : null;
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.service-card'));
    if (!cards.length || grid.querySelector('.home-service-row')) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'home-services';
    var list = document.createElement('div');
    list.className = 'home-services-list';
    var previewWrap = document.createElement('div');
    previewWrap.className = 'home-services-preview';
    var preview = document.createElement('img');
    var firstImg = cards[0].querySelector('img');
    if (firstImg) { preview.src = firstImg.getAttribute('src'); preview.alt = firstImg.getAttribute('alt') || ''; }
    preview.setAttribute('loading', 'lazy');
    previewWrap.appendChild(preview);
    cards.forEach(function (card, i) {
      var img = card.querySelector('img');
      var titleEl = card.querySelector('.service-card-title');
      var descEl = card.querySelector('.service-card-desc');
      var row = document.createElement('a');
      row.className = 'home-service-row';
      row.href = card.getAttribute('href') || '#';
      var num = document.createElement('span');
      num.className = 'home-service-num';
      num.textContent = '0' + (i + 1);
      var body = document.createElement('div');
      var title = document.createElement('h3');
      title.className = 'home-service-title';
      title.textContent = titleEl ? titleEl.textContent : '';
      var desc = document.createElement('p');
      desc.className = 'home-service-desc';
      desc.textContent = descEl ? descEl.textContent : '';
      var link = document.createElement('span');
      link.className = 'home-service-link';
      link.textContent = 'View Details';
      body.appendChild(title);
      body.appendChild(desc);
      body.appendChild(link);
      if (img) {
        var rowImg = document.createElement('img');
        rowImg.className = 'home-service-row-img';
        rowImg.src = img.getAttribute('src');
        rowImg.alt = img.getAttribute('alt') || '';
        rowImg.setAttribute('loading', 'lazy');
        body.appendChild(rowImg);
        var preload = new Image();
        preload.src = img.getAttribute('src');
      }
      row.appendChild(num);
      row.appendChild(body);
      function activate() {
        list.querySelectorAll('.home-service-row').forEach(function (r) { r.classList.remove('active'); });
        row.classList.add('active');
        if (img) { preview.src = img.getAttribute('src'); preview.alt = img.getAttribute('alt') || ''; }
      }
      row.addEventListener('mouseenter', activate);
      row.addEventListener('focus', activate);
      if (i === 0) row.classList.add('active');
      list.appendChild(row);
    });
    wrapper.appendChild(list);
    wrapper.appendChild(previewWrap);
    grid.parentNode.insertBefore(wrapper, grid);
    grid.remove();
  });
  safe(function () {
    document.querySelectorAll('.home-faq .faq-item, .home-faq .faq-item summary, .home-faq .faq-body, .home-ba .btn-outline').forEach(function (el) { el.removeAttribute('style'); });
  });
  safe(function () {
    var iframe = document.getElementById('hcp-reviews-iframe');
    if (!iframe || document.querySelector('.home-reviews-summary')) return;
    var wrap = iframe.parentNode;
    if (!wrap) return;
    var summary = document.createElement('div');
    summary.className = 'home-reviews-summary';
    var stars = document.createElement('span');
    stars.className = 'home-stars';
    stars.setAttribute('aria-hidden', 'true');
    stars.textContent = '★★★★★';
    var line = document.createElement('p');
    line.textContent = '5-Star Google Rated \u00b7 2,000+ Happy Customers';
    summary.appendChild(stars);
    summary.appendChild(line);
    wrap.parentNode.insertBefore(summary, wrap);
  });
  safe(function () {
    var nav = document.getElementById('site-nav');
    var burger = document.getElementById('burger');
    if (!nav) return;
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      });
    });
  });
});
