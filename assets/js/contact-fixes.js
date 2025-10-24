// v6.2.2 Contact page fixes
(function() {
  // run only on contact page if body has .contact-page
  var body = document.body;
  if (!body || !body.classList.contains('contact-page')) return;

  // 1) Kill any ghost WhatsApp floating bubble
  var killers = [];
  killers.push(document.querySelector('.floating-whatsapp'));
  killers.push(document.querySelector('.whatsapp-float'));
  // Any fixed-position element that links to WhatsApp and shows only an icon
  document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach(function(a){
    var style = window.getComputedStyle(a);
    var isFixed = style.position === 'fixed' || a.closest('[style*="position:fixed"]');
    if (isFixed) killers.push(a);
  });
  killers.forEach(function(el){ if (el) el.remove(); });

  // 2) Ensure a proper WhatsApp button exists only inside "Other ways" area
  var other = document.querySelector('#other-ways, .other-ways, [data-other-ways]');
  if (other && !other.querySelector('.btn-whatsapp')) {
    var href = 'https://wa.me/13472449382'; // your WhatsApp link (edit if needed)
    var btn = document.createElement('a');
    btn.className = 'btn btn-whatsapp';
    btn.href = href;
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.textContent = 'WhatsApp';
    btn.style.display = 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.gap = '8px';
    btn.style.padding = '12px 18px';
    btn.style.borderRadius = '12px';
    btn.style.background = '#0B5';
    btn.style.color = '#fff';
    btn.style.fontWeight = '700';
    btn.style.boxShadow = '0 6px 20px rgba(0,187,85,.35)';
    other.appendChild(btn);
  }

  // 3) Force-hide "sticky CTA" bars ONLY on contact
  document.querySelectorAll('.sticky-cta, .sticky-footer, .bottom-cta, .sticky-bar').forEach(function(el){
    el.style.display = 'none';
  });

  // 4) Normalize submit button class if needed
  var submit = document.querySelector('button[type="submit"]');
  if (submit) { submit.classList.add('submit-btn'); }

  // 5) Formsubmit redirect safety: if thank-you.html exists, append ?redirect=…
  var form = document.querySelector('form[action*="formsubmit.co"]');
  if (form && !form.querySelector('input[name="_next"]')) {
    var inp = document.createElement('input');
    inp.type = 'hidden';
    inp.name = '_next';
    inp.value = window.location.origin + '/thank-you.html';
    form.appendChild(inp);
  }
})();