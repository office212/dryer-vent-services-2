
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


/* v5.5 motion */
document.addEventListener('DOMContentLoaded', () => {
  // Add .reveal to targets for nicer entrance (without FOUC on all elements)
  const groups = [];
  document.querySelectorAll('.section, .page-hero, .cta-bar').forEach(sec => {
    const targets = sec.querySelectorAll('h1, h2, .card, .btn, p, .cards-3 > *');
    targets.forEach((el)=> el.classList.add('reveal'));
    groups.push([...targets]);
  });
  // Also hero inner
  document.querySelectorAll('.hero .hero-inner > *').forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target;
        // Stagger: if element is part of a group, delay based on index
        let delay = 0;
        for(const g of groups){
          const i = g.indexOf(el);
          if(i >= 0){ delay = Math.min(i * 60, 360); break; }
        }
        el.style.transitionDelay = delay + 'ms';
        el.classList.add('appear');
        io.unobserve(el);
      }
    });
  },{ threshold: 0.18 });

  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));
});

// Subtle hero parallax (translated content, not background image for performance)
(function(){
  const hero = document.querySelector('.hero-modern .hero-inner');
  if(!hero) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if(ticking) return;
    window.requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      const off = Math.min(20, y * 0.06); // cap at 20px
      hero.style.transform = 'translateY(' + off + 'px)';
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();

/* v5.6 reviews cycle */
document.addEventListener('DOMContentLoaded', ()=>{
  const wrap = document.getElementById('reviewsCycle');
  const btn = document.getElementById('cycleReviews');
  if(!wrap || !btn) return;
  const items = Array.from(wrap.querySelectorAll('.review'));
  const step = 3;
  let idx = 0;
  function render(){
    items.forEach(el => el.style.display='none');
    for(let i=0;i<step;i++){
      const k = (idx + i) % items.length;
      items[k].style.display = 'block';
    }
  }
  render();
  btn.addEventListener('click', ()=>{
    idx = (idx + step) % items.length;
    render();
  });
});

/* v5.8 contact cleanup */
document.addEventListener('DOMContentLoaded', ()=>{
  if((document.body.getAttribute('data-page')||'') !== 'contact') return;
  // Remove tiny emoji-only boxes (white squares) if they exist
  document.querySelectorAll('.section .container > *').forEach(el=>{
    const text = (el.textContent||'').trim();
    if(text && text.length <= 2 && el.children.length === 0){
      el.remove();
    }
  });
  // Also kill any standalone boxes that only contain a single emoji inside a wrapper
  document.querySelectorAll('.section .container div').forEach(el=>{
    const t = (el.textContent||'').trim();
    if(t in {'💬':1,'🗨️':1,'💭':1} && el.children.length === 0){
      el.remove();
    }
  });
});
