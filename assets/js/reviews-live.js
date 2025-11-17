// Live Google Reviews + rating modal

const PLACE_ID = "ChIJq81LRSoVi4wRJvvg97db1FU";
const API_URL = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=rating,userRatingCount,reviews&key=YOUR_API_KEY`;
const REVIEWS_BATCH = 3;

// DATA
let allReviews = [];
let homeIndex = 0;
let pageIndex = 0;

// RENDER 3 REVIEWS
function renderThree(container, start) {
  if (!allReviews.length) {
    container.innerHTML = "<p>No reviews found.</p>";
    return;
  }

  let html = "";
  for (let i = 0; i < REVIEWS_BATCH; i++) {
    const r = allReviews[(start + i) % allReviews.length];
    if (!r) continue;

    html += `
      <article class="card review-card">
        <p class="review-text">“${r.text.text}”</p>
        <p class="review-author">- ${r.authorAttribution.displayName}</p>
        <p class="review-stars">★ ${r.rating}/5</p>
      </article>
    `;
  }
  container.innerHTML = html;
}

// LOAD REVIEWS
async function loadReviews() {
  try {
    const raw = await fetch(API_URL);
    const data = await raw.json();
    allReviews = data.reviews || [];

    // HOME PAGE
    const homeBox = document.getElementById("home-reviews");
    const homeBtn = document.getElementById("homeReviewsMore");

    if (homeBox) {
      renderThree(homeBox, homeIndex);
      if (homeBtn && allReviews.length > 3) {
        homeBtn.onclick = () => {
          homeIndex = (homeIndex + 3) % allReviews.length;
          renderThree(homeBox, homeIndex);
        };
      }
    }

    // REVIEWS PAGE
    const pageBox = document.getElementById("reviewsCycle");
    const pageBtn = document.getElementById("cycleReviews");

    if (pageBox) {
      renderThree(pageBox, pageIndex);
      if (pageBtn && allReviews.length > 3) {
        pageBtn.onclick = () => {
          pageIndex = (pageIndex + 3) % allReviews.length;
          renderThree(pageBox, pageIndex);
        };
      }
    }
  } catch (err) {
    console.error("Error loading reviews:", err);
  }
}

// RATING MODAL
function initRatingModal() {
  const modal = document.createElement("div");
  modal.className = "review-modal-backdrop";
  modal.id = "reviewModal";
  modal.hidden = true;

  modal.innerHTML = `
    <div class="review-modal">
      <button class="review-modal-close" id="closeReviewModal">×</button>
      <h2>Rate Dryer Vent Services</h2>
      <p>Select 1–5 stars:</p>

      <div class="review-stars-picker" id="modalStars">
        <button data-rating="1">★</button>
        <button data-rating="2">★</button>
        <button data-rating="3">★</button>
        <button data-rating="4">★</button>
        <button data-rating="5">★</button>
      </div>

      <button class="btn" id="continueReview" disabled>Continue on Google</button>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = document.getElementById("closeReviewModal");
  const cont = document.getElementById("continueReview");
  const stars = document.getElementById("modalStars");

  let selected = 0;

  stars.onclick = (e) => {
    if (!e.target.dataset.rating) return;
    selected = Number(e.target.dataset.rating);

    [...stars.children].forEach(btn => {
      btn.classList.toggle("active", Number(btn.dataset.rating) <= selected);
    });

    cont.disabled = false;
  };

  closeBtn.onclick = () => modal.hidden = true;

  cont.onclick = () => {
    window.open(
      "https://search.google.com/local/writereview?placeid=" + PLACE_ID,
      "_blank"
    );
    modal.hidden = true;
  };

  document.querySelectorAll(".js-open-review-modal").forEach(btn => {
    btn.onclick = () => modal.hidden = false;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadReviews();
  initRatingModal();
});