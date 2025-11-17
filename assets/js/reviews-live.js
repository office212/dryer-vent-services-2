
// Live Google Reviews + rating modal using Cloudflare Worker
const REVIEWS_API_URL = "https://dryer-vent-services.office-d16.workers.dev/";
const REVIEWS_BATCH = 3;
const PLACE_ID = "ChIJq81LRSoVi4wRJvvg97db1FU";

let allReviews = [];
let homeIndex = 0;
let pageIndex = 0;

function buildStars(rating) {
  const full = Math.round(rating || 5);
  let html = "";
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star ${i <= full ? "star--full" : "star--empty"}">★</span>`;
  }
  return html;
}

function createReviewCard(r) {
  const text = (r.text || "").replace(/"/g, "&quot;");
  const author = r.author || "Google user";
  const time = r.relativeTime || "";
  const rating = r.rating || 5;

  return `
    <article class="review-card-pro">
      <div class="review-card-top">
        <div class="review-avatar-circle">
          <span>${author.trim().charAt(0).toUpperCase()}</span>
        </div>
        <div class="review-meta">
          <div class="review-author-name">${author}</div>
          <div class="review-stars-row">
            ${buildStars(rating)}<span class="review-rating-number">${rating.toFixed ? rating.toFixed(1) : rating}/5</span>
          </div>
          ${time ? `<div class="review-time">${time}</div>` : ""}
        </div>
      </div>
      <p class="review-body">“${text}”</p>
    </article>
  `;
}

function renderThreeInto(container, startIndex) {
  if (!container) return;
  if (!allReviews.length) {
    container.innerHTML = '<p class="center">Reviews will appear here soon.</p>';
    return;
  }
  let html = "";
  for (let i = 0; i < REVIEWS_BATCH; i++) {
    const r = allReviews[(startIndex + i) % allReviews.length];
    if (!r) continue;
    html += createReviewCard(r);
  }
  container.innerHTML = html;
}

async function loadReviewsData() {
  try {
    const res = await fetch(REVIEWS_API_URL, { cache: "no-store" });
    const data = await res.json();
    allReviews = data.reviews || [];

    // Home section
    const homeBox = document.getElementById("home-reviews");
    const homeBtn = document.getElementById("homeReviewsMore");
    if (homeBox) {
      renderThreeInto(homeBox, homeIndex);
      if (homeBtn && allReviews.length > REVIEWS_BATCH) {
        homeBtn.addEventListener("click", () => {
          homeIndex = (homeIndex + REVIEWS_BATCH) % allReviews.length;
          renderThreeInto(homeBox, homeIndex);
        });
      } else if (homeBtn) {
        homeBtn.style.display = "none";
      }
    }

    // Reviews page
    const pageBox = document.getElementById("reviews-list");
    const pageBtn = document.getElementById("loadMoreReviews");
    if (pageBox) {
      // initial render
      let initialCount = Math.min(REVIEWS_BATCH, allReviews.length);
      let html = "";
      for (let i = 0; i < initialCount; i++) {
        html += createReviewCard(allReviews[i]);
      }
      pageBox.innerHTML = html;
      pageIndex = initialCount;

      if (pageBtn && allReviews.length > initialCount) {
        pageBtn.addEventListener("click", () => {
          let added = 0;
          let extra = "";
          while (added < REVIEWS_BATCH && allReviews.length) {
            extra += createReviewCard(allReviews[pageIndex % allReviews.length]);
            pageIndex++;
            added++;
            if (pageIndex >= allReviews.length) pageIndex = 0;
          }
          pageBox.insertAdjacentHTML("beforeend", extra);
        });
      } else if (pageBtn) {
        pageBtn.style.display = "none";
      }
    }
  } catch (e) {
    console.error("Failed to load live reviews", e);
  }
}

function initRatingModal() {
  // build modal once
  const existing = document.getElementById("reviewModalBackdrop");
  if (existing) return;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="review-modal-backdrop" id="reviewModalBackdrop" hidden>
      <div class="review-modal" role="dialog" aria-modal="true" aria-labelledby="reviewModalTitle">
        <button class="review-modal-close" type="button" id="closeReviewModal" aria-label="Close">&times;</button>
        <h2 id="reviewModalTitle">Rate Dryer Vent Services</h2>
        <p class="review-modal-sub">Select a rating from 1–5 stars, then continue to Google to publish your review.</p>
        <div class="review-modal-stars" id="reviewModalStars">
          <button type="button" data-rating="1">★</button>
          <button type="button" data-rating="2">★</button>
          <button type="button" data-rating="3">★</button>
          <button type="button" data-rating="4">★</button>
          <button type="button" data-rating="5">★</button>
        </div>
        <p class="review-modal-hint" id="reviewModalHint">Choose your rating to continue.</p>
        <button class="btn btn--primary" type="button" id="reviewModalContinue" disabled>
          Continue on Google
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper.firstElementChild);

  const backdrop = document.getElementById("reviewModalBackdrop");
  const closeBtn = document.getElementById("closeReviewModal");
  const starsWrap = document.getElementById("reviewModalStars");
  const hint = document.getElementById("reviewModalHint");
  const continueBtn = document.getElementById("reviewModalContinue");
  let selected = 0;

  function openModal() {
    backdrop.hidden = false;
    document.body.classList.add("review-modal-open");
  }
  function closeModal() {
    backdrop.hidden = true;
    document.body.classList.remove("review-modal-open");
  }

  document.querySelectorAll(".js-open-review-modal").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  starsWrap.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const rating = Number(target.dataset.rating || "0");
    if (!rating) return;
    selected = rating;
    starsWrap.querySelectorAll("button").forEach(btn => {
      const r = Number(btn.dataset.rating || "0");
      if (r <= rating) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    continueBtn.disabled = false;
    hint.textContent = `You selected ${rating} star${rating > 1 ? "s" : ""}. Click continue to post on Google.`;
  });

  continueBtn.addEventListener("click", () => {
    window.open(
      "https://search.google.com/local/writereview?placeid=" + PLACE_ID,
      "_blank",
      "noopener"
    );
    closeModal();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadReviewsData();
  initRatingModal();
});
