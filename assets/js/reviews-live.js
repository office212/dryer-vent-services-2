// /assets/js/reviews-live.js

document.addEventListener('DOMContentLoaded', () => {
  const ENDPOINT = 'https://dryer-vent-services.office-d16.workers.dev/';

  // כרטיסי ביקורות (גם בדף הבית וגם בדף הביקורות)
  // יפתחו את דף העסק במפות (כפי שביקשת):
  const PLACE_URL = 'https://maps.app.goo.gl/Uo5r9arA4kM7GPWX6';

  // כפתורי "Rate on Google" (בדף הבית + בדף הביקורות)
  // יפתחו את מסך כתיבת הביקורת:
  const GOOGLE_REVIEW_URL = 'https://g.page/r/CSb74Pe3W9RVEBE/review';

  let allReviews = [];
  let cursor = 0;

  async function fetchReviews() {
    if (allReviews.length) return;
    try {
      const res = await fetch(ENDPOINT, { cache: 'no-store' });
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

    // לחיצה על כרטיס => דף העסק במפות
    card.addEventListener('click', () => {
      window.open(PLACE_URL, '_blank', 'noopener');
    });

    const header = document.createElement('div');
    header.className = 'review-card-header';

    const avatar = document.createElement('div');
    avatar.className = 'review-avatar-circle review-avatar-circle--google';
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
    ratingNumber.textContent = `${rating.toFixed(1)}/5`;

    row.appendChild(stars);
    row.appendChild(ratingNumber);

    const time = document.createElement('div');
    time.className = 'review-time';
    time.textContent = review.relativeTime || review.relativeTimeDescription || '';

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

  // count ביקורות בכל פעם, עם אפשרות reset שמחליף ולא מוסיף
  function renderNext(container, count, { reset = false } = {}) {
    if (!allReviews.length || !container) return;

    if (reset) {
      container.innerHTML = '';
    }

    for (let i = 0; i < count; i++) {
      if (!allReviews.length) break;
      const review = allReviews[cursor % allReviews.length];
      const card = createReviewCard(review);
      container.appendChild(card);
      cursor++;
    }
  }

  (async () => {
    await fetchReviews();

    // HOME
    const homeContainer = document.getElementById('home-reviews');
    const homeMoreBtn = document.getElementById('homeReviewsMoreLink');

    if (homeContainer) {
      cursor = 0;
      renderNext(homeContainer, 3, { reset: true });
      if (homeMoreBtn) {
        homeMoreBtn.addEventListener('click', () => {
          // בדף הבית – לעבור לדף הביקורות
          window.location.href = '/reviews/';
        });
      }
    }

    // REVIEWS PAGE
    const reviewsContainer = document.getElementById('reviews-list');
    const reviewsMoreBtn = document.getElementById('loadMoreReviews');

    if (reviewsContainer) {
      cursor = 0;
      renderNext(reviewsContainer, 3, { reset: true });

      if (reviewsMoreBtn) {
        reviewsMoreBtn.addEventListener('click', () => {
          // כל לחיצה מחליפה לשלישייה הבאה
          renderNext(reviewsContainer, 3, { reset: true });
        });
      }
    }

    // כפתורי דירוג ישיר בגוגל (הום + ביקורות)
    ['rateOnGoogleHome', 'rateOnGoogleReviews'].forEach((id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener');
      });
    });
  })();
});