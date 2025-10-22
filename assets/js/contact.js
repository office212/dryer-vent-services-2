// Contact page only JS
(function () {
  const body = document.body;
  if (!body.classList.contains('contact-page')) return;

  // 1) Validate "confirm phone" equals phone
  function numbersOnly(s){ return (s||'').replace(/\D+/g,''); }
  const phone = document.getElementById('phone');
  const phone2 = document.getElementById('phone_confirm');
  const form = document.getElementById('contactForm');
  const atLeastOne = document.getElementById('serviceAtLeastOne');
  function samePhone(){
    if (numbersOnly(phone.value) && numbersOnly(phone2.value) && numbersOnly(phone.value) !== numbersOnly(phone2.value)){
      phone2.setCustomValidity('Phone numbers must match');
    } else {
      phone2.setCustomValidity('');
    }
  }
  phone && phone.addEventListener('input', samePhone);
  phone2 && phone2.addEventListener('input', samePhone);

  // 2) Require at least one service
  form && form.addEventListener('submit', function(e){
    const any = Array.from(form.querySelectorAll('.services-box input[type="checkbox"]')).some(cb => cb.checked);
    if(!any){
      atLeastOne.setCustomValidity('Select at least one service');
      atLeastOne.reportValidity();
      e.preventDefault();
    } else {
      atLeastOne.setCustomValidity('');
    }
  });

  // 3) Remove floating WhatsApp bubble if injected by a 3rd-party
  try {
    const candidates = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]');
    candidates.forEach(a => {
      const el = a.closest('*');
      const s = el ? getComputedStyle(el) : getComputedStyle(a);
      if (s.position === 'fixed' || s.position === 'sticky') {
        (el || a).remove();
      }
    });
  } catch(e){}

  // 4) Hide sticky CTA only on contact page if present
  ['.sticky-cta', '#sticky-cta', '.sticky-bar', '.mobile-sticky-bar'].forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
  });
})();