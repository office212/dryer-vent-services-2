// /assets/js/reviews-live.js

document.addEventListener('DOMContentLoaded', () => {
  const ENDPOINT = 'https://dryer-vent-services.office-d16.workers.dev/';
  const PLACE_URL =
    'https://www.google.com/maps/place/?q=place_id:ChIJq81LRSoVi4wRJvvg97db1FU';

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

    // כשילחצו על הכרטיס – נפתח את העסק בגוגל
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

  function renderNext(container, count) {
    if (!allReviews.length || !container) return;
    for (let i = 0; i < count; i++) {
      if (!allReviews.length) break;
      const review = allReviews[cursor % allReviews.length];
      const card = createReviewCard(review);
      container.appendChild(card);
      cursor++;
    }
  }

  // מודאל דירוג
  function setupRatingModal() {
    const triggers = document.querySelectorAll('.js-open-review-modal');
    if (!triggers.length) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'review-modal-backdrop';
    backdrop.innerHTML = `
      <div class="review-modal" role="dialog" aria-modal="true">
        <button class="review-modal-close" aria-label="Close">&times;</button>
        <h3>Rate Dryer Vent Services</h3>
        <p>Select a rating from 1–5 stars, then continue to Google to publish your review.</p>
        <div class="review-modal-stars" data-selected="0">
          <button type="button" data-value="1">★</button>
          <button type="button" data-value="2">★</button>
          <button type="button" data-value="3">★</button>
          <button type="button" data-value="4">★</button>
          <button type="button" data-value="5">★</button>
        </div>
        <button type="button" class="btn btn-primary review-modal-cta" disabled>
          Continue on Google
        </button>
      </div>
    `;
    document.body.appendChild(backdrop);
    backdrop.style.display = 'none';

    const modal = backdrop.querySelector('.review-modal');
    const closeBtn = backdrop.querySelector('.review-modal-close');
    const starsRow = backdrop.querySelector('.review-modal-stars');
    const cta = backdrop.querySelector('.review-modal-cta');

    function openModal() {
      backdrop.style.display = 'flex';
      document.body.classList.add('modal-open');
    }

    function closeModal() {
      backdrop.style.display = 'none';
      document.body.classList.remove('modal-open');
    }

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });

    starsRow.addEventListener('click', (e) => {
      if (!(e.target instanceof HTMLElement)) return;
      const value = e.target.getAttribute('data-value');
      if (!value) return;
      starsRow.setAttribute('data-selected', value);
      starsRow.querySelectorAll('button').forEach((btn) => {
        const v = btn.getAttribute('data-value');
        btn.classList.toggle('active', v === value);
      });
      cta.disabled = false;
    });

    cta.addEventListener('click', () => {
      // לא משנה איזה דירוג בחר – בגוגל הוא יבחר שוב, זה רק לפתוח את הדף
      window.open(
        'https://search.google.com/local/writereview?placeid=ChIJq81LRSoVi4wRJvvg97db1FU',
        '_blank',
        'noopener'
      );
      closeModal();
    });

    triggers.forEach((btn) => {
      btn.addEventListener('click', openModal);
    });
  }

  // הפעלה
  (async () => {
    await fetchReviews();

    const homeContainer = document.getElementById('home-reviews');
    const homeMoreBtn = document.getElementById('homeReviewsMore');

    if (homeContainer) {
      cursor = 0;
      renderNext(homeContainer, 3);
      if (homeMoreBtn) {
        homeMoreBtn.addEventListener('click', () => {
          window.location.href = '/reviews/';
        });
      }
    }

    const reviewsContainer = document.getElementById('reviews-list');
    const reviewsMoreBtn = document.getElementById('loadMoreReviews');

    if (reviewsContainer) {
      cursor = 0;
      renderNext(reviewsContainer, 3);
      if (reviewsMoreBtn) {
        reviewsMoreBtn.addEventListener('click', () => {
          renderNext(reviewsContainer, 3);
        });
      }
    }

    setupRatingModal();
  })();
});