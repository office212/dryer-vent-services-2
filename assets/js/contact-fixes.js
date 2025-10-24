
// v6.1.10 - Keep header/nav, hide sticky only on contact, remove ghost WA bubble, basic validation
(function(){
  // Ensure body marks contact page
  document.body.classList.add('page-contact');

  // Remove floating WhatsApp bubble (but keep the button inside .other-ways)
  const kill = () => {
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp.com"]').forEach(a => {
      if (!a.closest('.other-ways')) {
        const st = getComputedStyle(a);
        if (st.position === 'fixed' || st.position === 'sticky' || a.offsetWidth < 90) {
          (a.parentElement && a.parentElement.children.length === 1 ? a.parentElement : a).remove();
        }
      }
    });
    ['.whatsapp-float','.wa-chat-widget','.floating-whatsapp','.joinchat__button','.getbutton-widget']
      .forEach(sel => document.querySelectorAll(sel).forEach(el => el.remove()));
  };
  kill();
  const mo = new MutationObserver(kill);
  mo.observe(document.body, {childList:true, subtree:true});
  setTimeout(()=>mo.disconnect(), 6000);

  // Simple validations: confirm phone equals phone, at least one service
  const form = document.querySelector('form');
  if(form){
    form.addEventListener('submit', (e)=>{
      const phone = form.querySelector('input[name="phone"], input[type="tel"]');
      const confirmPhone = form.querySelector('input[name="confirm_phone"], input[placeholder*="Re-enter"], input[placeholder*="Confirm"]');
      const digits = s => (s||'').replace(/\D+/g,'');
      if(phone && confirmPhone && digits(phone.value) !== digits(confirmPhone.value)){
        e.preventDefault(); alert('Phone numbers must match.'); confirmPhone.focus(); return false;
      }
      const anyService = Array.from(form.querySelectorAll('input[type="checkbox"]')).some(cb => cb.checked);
      if(!anyService){ e.preventDefault(); alert('Please select at least one service.'); return false; }
    });
  }
})();
