// Live Google Reviews + rating modal (via Cloudflare Worker)

const REVIEWS_API_URL = "https://dryer-vent-services.office-d16.workers.dev/";
const REVIEWS_BATCH_SIZE = 3;
const PLACE_ID = "ChIJq81LRSoVi4wRJvvg97db1FU";

let allReviews = [];
let homeIndex = 0;
let pageIndex = 0;

function renderThree(container, startIndex) {
  if (!allReviews.length) {
    container.innerHTML = '<p class="center">Reviews will appear here soon.</p>';
    return;
  }

  let html = "";
  for (let i = 0; i < REVIEWS_BATCH_SIZE; i++) {
    const review = allReviews[(startIndex + i) % allReviews.length];
    if (!review) continue;

    const text = review.text ? review.text.replace(/"/g, "&quot;") : "";
    const author = review.author || "Google user";
    const time = review.relativeTime || "";
    const rating = review.rating || "5";

    html += `
      <article class="card review-card">
        <p class="review-text">“${text}”</p>
        <p class="review-author">
          - ${author}
          ${time ? `<span class="review-time">(${time})</span>` : ""}
        </p>
        <p class="review-stars">★ ${rating}/5</p>
      </article>
    `;
  }

  container.innerHTML = html;
}

async function initReviews() {
  try {
    const res = await fetch(REVIEWS_API_URL, { cache: "no-store" });
    const data = await res.json();
    allReviews = data.reviews || [];

    // דף הבית
    const homeBox = document.getElementById("home-reviews");
    const homeBtn = document.getElementById("homeReviewsMore");

    if (homeBox && allReviews.length) {
      renderThree(homeBox, homeIndex);
      if (homeBtn && allReviews.length > REVIEWS_BATCH_SIZE) {
        homeBtn.addEventListener("click", () => {
          homeIndex = (homeIndex + REVIEWS_BATCH_SIZE) % allReviews.length;
          renderThree(homeBox, homeIndex);
        });
      } else if (homeBtn) {
        homeBtn.style.display = "none";
      }
    }

    // עמוד reviews
    const pageBox = document.getElementById("reviewsCycle");
    const pageBtn = document.getElementById("cycleReviews");

    if (pageBox && allReviews.length) {
      renderThree(pageBox, pageIndex);
      if (pageBtn && allReviews.length > REVIEWS_BATCH_SIZE) {
        pageBtn.addEventListener("click", () => {
          pageIndex = (pageIndex + REVIEWS_BATCH_SIZE) % allReviews.length;
          renderThree(pageBox, pageIndex);
        });
      } else if (pageBtn) {
        pageBtn.style.display = "none";
      }
    }
  } catch (err) {
    console.error("Failed to load live reviews:", err);
  }
}

// מודאל דירוג
function buildRatingModal() {
  const modalHtml = `
    <div class="review-modal-backdrop" id="reviewModal" hidden>
      <div class="review-modal" role="dialog" aria-modal="true" aria-labelledby="reviewModalTitle">
        <button class="review-modal-close" type="button" id="closeReviewModal" aria-label="Close">×</button>
        <h2 id="reviewModalTitle">Rate Dryer Vent Services</h2>
        <p>Select a rating from 1–5 stars, then continue on Google to publish your review.</p>
        <div class="review-stars-picker" id="reviewStarsPicker">
          <button type="button" data-rating="1" aria-label="1 star">★</button>
          <button type="button" data-rating="2" aria-label="2 stars">★</button>
          <button type="button" data-rating="3" aria-label="3 stars">★</button>
          <button type="button" data-rating="4" aria-label="4 stars">★</button>
          <button type="button" data-rating="5" aria-label="5 stars">★</button>
        </div>
        <p class="review-modal-hint" id="reviewModalHint">Choose your rating to continue.</p>
        <button class="btn" type="button" id="goToGoogleReview" disabled>
          Continue on Google
        </button>
      </div>
    </div>
  `;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = modalHtml;
  document.body.appendChild(wrapper.firstElementChild);
}

function initRatingModal() {
  buildRatingModal();

  const modal = document.getElementById("reviewModal");
  const closeBtn = document.getElementById("closeReviewModal");
  const picker = document.getElementById("reviewStarsPicker");
  const goBtn = document.getElementById("goToGoogleReview");
  const hint = document.getElementById("reviewModalHint");
  let selectedRating = 0;

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  const triggers = document.querySelectorAll(".js-open-review-modal");
  triggers.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeModal();
    });
  }
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  if (picker) {
    picker.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const rating = target.getAttribute("data-rating");
      if (!rating) return;

      selectedRating = parseInt(rating, 10) || 0;

      const buttons = picker.querySelectorAll("button[data-rating]");
      buttons.forEach((btn) => {
        const r = parseInt(btn.getAttribute("data-rating") || "0", 10);
        if (r <= selectedRating) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });

      if (selectedRating > 0) {
        goBtn.disabled = false;
        hint.textContent = `You selected ${selectedRating} star${selectedRating > 1 ? "s" : ""}. Click continue to post on Google.`;
      } else {
        goBtn.disabled = true;
        hint.textContent = "Choose your rating to continue.";
      }
    });
  }

  if (goBtn) {
    goBtn.addEventListener("click", () => {
      window.open(
        "https://search.google.com/local/writereview?placeid=" + PLACE_ID,
        "_blank",
        "noopener"
      );
      closeModal();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initReviews();
  initRatingModal();
});