document.addEventListener("DOMContentLoaded", () => {
  const ENDPOINT = "https://dryer-vent-services.office-d16.workers.dev/";
  const GOOGLE_PLACE_URL =
    "https://www.google.com/maps/place/?q=place_id:ChIJq81LRSoVi4wRJvvg97db1FU";

  let allReviews = [];
  let cursor = 0;

  async function loadReviews() {
    try {
      const res = await fetch(ENDPOINT, { cache: "no-store" });
      const data = await res.json();
      allReviews = data.reviews || [];
    } catch (err) {
      console.error("Reviews failed to load", err);
      allReviews = [];
    }
  }

  function createCard(r) {
    const card = document.createElement("article");
    card.className = "review-card-pro";

    card.onclick = () => {
      window.open(GOOGLE_PLACE_URL, "_blank");
    };

    const rating = Number(r.rating || 5);

    card.innerHTML = `
      <div class="review-card-header">
        <div class="review-avatar-circle review-avatar-circle--google">
          ${(r.author || "?").charAt(0).toUpperCase()}
        </div>
        <div class="review-meta">
          <div class="review-author-name">${r.author || "Google user"}</div>
          <div class="review-stars-row">
            <span class="review-stars">
              ${"★".repeat(rating)}${"☆".repeat(5 - rating)}
            </span>
            <span class="review-rating-number">${rating}/5</span>
          </div>
          <div class="review-time">${r.relativeTime || ""}</div>
        </div>
      </div>

      <p class="review-body">${r.text || ""}</p>
    `;

    return card;
  }

  function showNext(container, count) {
    container.innerHTML = ""; // מחליף במקום להוסיף
    for (let i = 0; i < count; i++) {
      const review = allReviews[(cursor + i) % allReviews.length];
      container.appendChild(createCard(review));
    }
    cursor = (cursor + count) % allReviews.length;
  }

  (async () => {
    await loadReviews();

    const homeList = document.querySelector("#home-reviews");
    const homeMore = document.querySelector("#homeReviewsMore");

    if (homeList) {
      cursor = 0;
      showNext(homeList, 3);
    }

    if (homeMore) {
      homeMore.onclick = () => {
        window.location.href = "/reviews/";
      };
    }

    const pageList = document.querySelector("#reviews-list");
    const pageMore = document.querySelector("#loadMoreReviews");

    if (pageList) {
      cursor = 0;
      showNext(pageList, 3);

      if (pageMore) {
        pageMore.onclick = () => showNext(pageList, 3);
      }
    }
  })();
});