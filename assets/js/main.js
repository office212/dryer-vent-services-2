
function byId(id){return document.getElementById(id);}

/* Reviews swapper: shows 3 at a time */
window.addEventListener('DOMContentLoaded', ()=>{
  const wrap=document.querySelector('.reviews-wrap');
  if(wrap){
    const cards=[...wrap.querySelectorAll('.review')];
    let idx=0;
    function render(){
      cards.forEach((c,i)=> c.style.display = (i>=idx && i<idx+3) ? 'block':'none');
    }
    const btn=document.querySelector('#loadMoreReviews');
    if(btn){
      btn.addEventListener('click',()=>{ idx = (idx+3) % cards.length; render(); });
    }
    render();
  }

  /* Smooth scroll for hash links */
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const id=a.getAttribute('href').slice(1);
      const el=document.getElementById(id);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });

  /* Scroll reveal with IntersectionObserver */
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(ent=>{
      if(ent.isIntersecting){
        ent.target.classList.add('reveal-in');
        io.unobserve(ent.target);
      }
    });
  }, {threshold: 0.16});

  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));
});
