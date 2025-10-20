
document.addEventListener('DOMContentLoaded', () => {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('site-nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  // Active nav
  const page = document.body.getAttribute('data-page') || '';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.getAttribute('data-nav') === page) a.classList.add('active');
  });
  // Lead timestamp
  const t = document.getElementById('submittedAt');
  if (t) t.value = new Date().toISOString();
  // Reveal
  const items = document.querySelectorAll('.fade-in, .card');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('appear'); io.unobserve(e.target);} });
  },{threshold:0.1});
  items.forEach(el=>io.observe(el));
});

/* v5.4 reviews load more */
document.addEventListener('DOMContentLoaded', ()=>{
  const list = document.getElementById('reviewsList');
  const loadBtn = document.getElementById('loadMoreReviews');
  if(!list || !loadBtn) return;
  const items = Array.from(list.querySelectorAll('.review'));
  let shown = 0;
  const step = 3;
  function render(){
    items.forEach((el, i) => {
      el.style.display = i < shown ? 'block' : 'none';
    });
    if(shown >= items.length){
      loadBtn.style.display = 'none';
    }
  }
  shown = Math.min(step, items.length);
  render();
  loadBtn.addEventListener('click', ()=>{
    shown = Math.min(shown + step, items.length);
    render();
  });
});
