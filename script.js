
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
  const page = document.body.getAttribute('data-page');
  if (page) {
    document.querySelectorAll('[data-nav]').forEach(a => {
      if (a.getAttribute('data-nav') === page) a.classList.add('active');
    });
  }
  // Lead timestamp
  const t = document.getElementById('submittedAt');
  if (t) t.value = new Date().toISOString();
  // Optional webhook to Google Sheets (Apps Script)
  const form = document.querySelector('form.lead-form');
  if (form) {
    form.addEventListener('submit', () => {
      try {
        const webhook = form.getAttribute('data-webhook');
        if (!webhook || webhook.includes('PUT_YOUR_APPS_SCRIPT_URL_HERE')) return;
        const fd = new FormData(form); const obj = {};
        fd.forEach((v,k)=>obj[k]=v);
        fetch(webhook, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body: JSON.stringify(obj) });
      } catch(e){ console.warn('Webhook error (non-blocking):', e); }
    }, {capture:true});
  }
});

// Reveal on scroll
const items = document.querySelectorAll('.fade-in, .card, .gallery-grid img');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('appear'); io.unobserve(e.target);} });
},{threshold:0.1});
items.forEach(el=>io.observe(el));
