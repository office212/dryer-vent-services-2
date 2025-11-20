document.addEventListener('DOMContentLoaded', () => {
  // הכתובת של ה-Worker שלך (Cloudflare)
  const ENDPOINT = 'https://dryer-vent-services.office-d16.workers.dev/';

  // ✅ תיקון: קישור ישיר ותקין לדף העסק שלך בגוגל מפות
  const PLACE_URL = 'https://www.google.com/maps/search/?api=1&query=Dryer+Vent+Services&query_place_id=ChIJq81LRSoVi4wRJvvg97db1FU';

  // קישור לכתיבת ביקורת (זה היה תקין)
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
      
      // עדכון דירוג כללי (אם קיים אלמנט כזה בעתיד)
      // console.log("Rating:", data.rating, "Count:", data.count);
    } catch (e) {
      console.error('Failed to load reviews', e);
      allReviews = [];
    }
  }

  function createReviewCard(review) {
    const card = document.createElement('article');
    card.className = 'review-card-pro';
    
    // הוספת אנימציית כניסה חלקה
    card.style.animation = "fadeIn 0.5s ease-in-out";

    // לחיצה על כרטיס => פתיחת המפה
    card.addEventListener('click', (e) => {
      // מונע פתיחה אם מסמנים טקסט
      if (window.getSelection().toString().length > 0) return;
      window.open(PLACE_URL, '_blank', 'noopener');
    });

    const header = document.createElement('div');
    header.className = 'review-card-header';

    const avatar = document.createElement('div');
    avatar.className = 'review-avatar-circle review-avatar-circle--google';
    // לוקח את האות הראשונה של השם
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
    // בניית כוכבים
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'star ' + (i <= rating ? 'star--full' : 'star--empty');
      star.textContent = '★';
      stars.appendChild(star);
    }

    const ratingNumber = document.createElement('span');
    ratingNumber.className = 'review-rating-number';
    // מציג דירוג מספרי (5.0/5)
    // ratingNumber.textContent = `${rating.toFixed(1)}/5`; 

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
    // קיצור טקסט ארוך מדי אם צריך
    const text = review.text || '';
    body.textContent = text;

    card.appendChild(header);
    card.appendChild(body);

    return card;
  }

  // פונקציה לטעינת הכרטיסים הבאים
  function renderNext(container, count, { reset = false } = {}) {
    if (!allReviews.length || !container) return;

    if (reset) {
      container.innerHTML = '';
    }

    for (let i = 0; i < count; i++) {
      // קרוסלה אינסופית (חוזר להתחלה אם נגמר)
      const review = allReviews[cursor % allReviews.length];
      const card = createReviewCard(review);
      container.appendChild(card);
      cursor++;
    }
  }

  // הפעלה ראשית
  (async () => {
    await fetchReviews();

    // 1. לוגיקה לדף הבית
    const homeContainer = document.getElementById('home-reviews');
    const homeMoreBtn = document.getElementById('homeReviewsMoreLink');

    if (homeContainer) {
      cursor = 0;
      // מציג 3 ביקורות בדף הבית
      renderNext(homeContainer, 3, { reset: true });
      
      if (homeMoreBtn) {
        // מוודא שהכפתור מוביל לדף הביקורות (גיבוי ל-href ב-HTML)
        homeMoreBtn.addEventListener('click', (e) => {
           // אם זה לינק רגיל, ניתן לו לעבוד טבעי. אם זה כפתור, נעביר ידנית.
           if (homeMoreBtn.tagName !== 'A') {
             window.location.href = '/reviews/';
           }
        });
      }
    }

    // 2. לוגיקה לדף הביקורות
    const reviewsContainer = document.getElementById('reviews-list');
    const reviewsMoreBtn = document.getElementById('loadMoreReviews');

    if (reviewsContainer) {
      cursor = 0;
      // טעינה ראשונית (6 במחשב, 3 בנייד - לפי מה שסיכמנו)
      const initialCount = window.innerWidth < 768 ? 3 : 6;
      renderNext(reviewsContainer, initialCount, { reset: true });

      if (reviewsMoreBtn) {
        reviewsMoreBtn.addEventListener('click', () => {
          // בלחיצה טוען עוד נגלה ומחליף את הקודמת
          renderNext(reviewsContainer, initialCount, { reset: true });
          
          // גלילה עדינה לראש הרשימה כדי שהגולש יראה שהשתנה
          reviewsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }
    }

    // 3. כפתורי דירוג (Rate on Google)
    ['rateOnGoogleHome', 'rateOnGoogleReviews'].forEach((id) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener('click', () => {
        window.open(GOOGLE_REVIEW_URL, '_blank', 'noopener');
      });
    });
  })();
});

// הוספת אנימציה ל-CSS באופן דינמי (אופציונלי, ליופי)
const style = document.createElement('style');
style.innerHTML = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
