
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
  const path = document.body.getAttribute('data-page') || '';
  document.querySelectorAll('[data-nav]').forEach(a => {
    if (a.getAttribute('data-nav') === path) a.classList.add('active');
  });
  // Lead timestamp
  const t = document.getElementById('submittedAt');
  if (t) t.value = new Date().toISOString();
  // Reveal on scroll
  const items = document.querySelectorAll('.fade-in, .card, .gallery-grid .svg-thumb');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('appear'); io.unobserve(e.target);} });
  },{threshold:0.1});
  items.forEach(el=>io.observe(el));
});
