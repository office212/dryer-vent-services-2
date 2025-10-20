
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

/* v5.2 reviews */
document.addEventListener('DOMContentLoaded', ()=>{
  const wrap = document.getElementById('reviewsCarousel');
  if(!wrap) return;
  const prev = document.getElementById('prevReviews');
  const next = document.getElementById('nextReviews');
  const items = Array.from(wrap.querySelectorAll('.review'));
  function perView(){ return window.matchMedia('(max-width: 920px)').matches ? 1 : 3; }
  let idx = 0;
  function render(){
    const pv = perView();
    items.forEach(el => el.style.display='none');
    for(let i=0;i<pv;i++){ const k = (idx + i) % items.length; items[k].style.display = 'block'; }
  }
  prev && prev.addEventListener('click', ()=>{ idx = (idx - perView() + items.length) % items.length; render(); });
  next && next.addEventListener('click', ()=>{ idx = (idx + perView()) % items.length; render(); });
  window.addEventListener('resize', render);
  render();
});
