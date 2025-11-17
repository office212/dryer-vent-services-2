document.addEventListener("DOMContentLoaded", () => {
  const ENDPOINT = "https://dryer-vent-services.office-d16.workers.dev/";
  const PLACE_ID = "ChIJq81LRSoVi4wRJvvg97db1FU";

  // דף העסק בגוגל מפות (כל הביקורות)
  const GOOGLE_BUSINESS_URL =
    "https://www.google.com/maps/search/?api=1&query_place_id=" + PLACE_ID;

  // דף השארת ביקורת
  const GOOGLE_REVIEW_URL =
    "https://search.google.com/local/writereview?placeid=" + PLACE_ID;

  let allReviews = [];
  let cursor = 0;

  async function loadReviews() {
    try {
      const res = await fetch(ENDPOINT, { cache: "no-store" });
      const data = await res.json();
      allReviews = Array.isArray(data.reviews) ? data.reviews : [];
    } catch (err) {
      console.error("Failed to load Google reviews:", err);
      allReviews = [];
    }
  }

  function createReviewElement(review) {
    const author = review.author || "Google user";
    const rating = Number(review.rating || 5);
    const time = review.relativeTime || review.relativeTimeDescription || "";
    const text = review.text || "";

    const starsFull = "★".repeat(Math.max(0, Math.min(5, rating)));
    const starsEmpty = "☆".repeat(5 - starsFull.length);

    const div = document.createElement("div");
    div.className = "review";
    div.style.cursor = "pointer";

    // קליק על כל review → פותח דף העסק בגוגל
    div.addEventListener("click", () => {
      window.open(GOOGLE_BUSINESS_URL, "_blank", "noopener");
    });

    div.innerHTML = `
      <p>
        ${text ? "“" + text + "”" : ""}
        <br>
        <span class="review-stars">${starsFull}${starsEmpty}</span>
        <span class="review-rating-number"> ${rating}/5</span>
      </p>
      <strong>- ${author}${time ? ", " + time : ""}</strong>
    `;

    return div;
  }

  function showNextBatch(container, count) {
    if (!container) return;
    if (!allReviews.length) {
      container.innerHTML = "<p>No reviews found yet.</p>";
      return;
    }

    // מחליף 3 בבום, לא מוסיף
    container.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const review = allReviews[(cursor + i) % allReviews.length];
      container.appendChild(createReviewElement(review));
    }

    cursor = (cursor + count) % allReviews.length;
  }

  function setupRateButtons() {
    const btns = document.querySelectorAll(".js-rate-google-live");
    btns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(GOOGLE_REVIEW_URL, "_blank", "noopener");
      });
    });
  }

  (async () => {
    await loadReviews();

    // דף הבית
    const homeContainer = document.getElementById("home-reviews-live");
    const homeMoreBtn = document.getElementById("homeReviewsMoreLive");

    if (homeContainer) {
      cursor = 0;
      showNextBatch(homeContainer, 3);

      if (homeMoreBtn) {
        homeMoreBtn.addEventListener("click", () => {
          window.location.href = "/reviews/";
        });
      }
    }

    // דף הביקורות
    const reviewsContainer = document.getElementById("reviews-list-live");
    const reviewsMoreBtn = document.getElementById("reviewsLoadMoreLive");

    if (reviewsContainer) {
      cursor = 0;
      showNextBatch(reviewsContainer, 3);

      if (reviewsMoreBtn) {
        reviewsMoreBtn.addEventListener("click", () => {
          showNextBatch(reviewsContainer, 3);
        });
      }
    }

    setupRateButtons();
  })();
});