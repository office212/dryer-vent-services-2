
// Live Google Reviews integration for Dryer Vent Services
// Frontend-only: expects a JSON endpoint that returns:
// { rating: number, count: number, reviews: [{author,text,rating,relativeTime}] }

(function(){
  const REVIEWS_API_URL = "https://YOUR-WORKER-OR-FUNCTION-URL-HERE/"; // TODO: replace with your real endpoint

  let allReviews = [];
  let homeIndex = 0;
  let pageIndex = 0;

  function buildHomeCard(review){
    const time = review.relativeTime ? ` <span class="review-time">(${review.relativeTime})</span>` : "";
    return `
      <div class="card">
        <p>“${escapeHtml(review.text)}”</p>
        <strong>- ${escapeHtml(review.author)}${time}</strong>
      </div>
    `;
  }

  function buildPageCard(review){
    const time = review.relativeTime ? ` <span class="review-time">(${review.relativeTime})</span>` : "";
    return `
      <div class="review">
        <p>“${escapeHtml(review.text)}”</p>
        <strong>- ${escapeHtml(review.author)}${time}</strong>
        <div class="review-stars">★ ${review.rating || "5"}/5</div>
      </div>
    `;
  }

  function renderHome(){
    const box = document.getElementById("home-reviews");
    if(!box) return;
    if(!allReviews.length){
      box.innerHTML = "<p>Reviews will appear here soon.</p>";
      return;
    }
    let html = "";
    for(let i=0;i<3;i++){
      const r = allReviews[(homeIndex + i) % allReviews.length];
      html += buildHomeCard(r);
    }
    box.innerHTML = html;
  }

  function renderPage(){
    const box = document.getElementById("reviewsCycle");
    if(!box) return;
    if(!allReviews.length){
      box.innerHTML = "<p>Reviews will appear here soon.</p>";
      return;
    }
    let html = "";
    for(let i=0;i<3;i++){
      const r = allReviews[(pageIndex + i) % allReviews.length];
      html += buildPageCard(r);
    }
    box.innerHTML = html;
  }

  function escapeHtml(str){
    if(!str) return "";
    return String(str)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#39;");
  }

  async function init(){
    const hasHome = document.getElementById("home-reviews");
    const hasPage = document.getElementById("reviewsCycle");
    if(!hasHome && !hasPage) return;

    try{
      const res = await fetch(REVIEWS_API_URL, {cache:"no-store"});
      if(!res.ok) throw new Error("Bad status " + res.status);
      const data = await res.json();
      allReviews = data.reviews || [];
    }catch(e){
      console.error("Failed to load live reviews", e);
      // fallback: keep any hard-coded HTML already in the page (if any)
      return;
    }

    if(hasHome){
      renderHome();
      const btnHome = document.getElementById("homeReviewsMore");
      if(btnHome && allReviews.length > 3){
        btnHome.addEventListener("click", function(){
          homeIndex = (homeIndex + 3) % allReviews.length;
          renderHome();
        });
      }else if(btnHome){
        // if not enough reviews to cycle, hide button
        btnHome.style.display = "none";
      }
    }

    if(hasPage){
      renderPage();
      const btnPage = document.getElementById("cycleReviews");
      if(btnPage && allReviews.length > 3){
        btnPage.addEventListener("click", function(){
          pageIndex = (pageIndex + 3) % allReviews.length;
          renderPage();
        });
      }else if(btnPage){
        btnPage.style.display = "none";
      }
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }
})();
