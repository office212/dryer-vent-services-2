
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
  const items = document.querySelectorAll('.fade-in, .card, .gallery-photos .gal-img');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('appear'); io.unobserve(e.target);} });
  },{threshold:0.1});
  items.forEach(el=>io.observe(el));

  // Before/After slider logic
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const afterImg = slider.querySelector('.ba-after');
    const range = slider.querySelector('.ba-range');
    const update = () => {
      const v = parseInt(range.value, 10);
      afterImg.style.clipPath = `inset(0 0 0 ${v}%)`;
    };
    range.addEventListener('input', update);
    update();
  });
});
