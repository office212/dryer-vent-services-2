// v6.2.3 Contact fixes JS
(function(){
  if(!document.body.classList.contains('contact-page')) return;
  // Remove floating WA bubble, keep legit buttons
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(a=>{
    const fixed = getComputedStyle(a).position==='fixed' || a.closest('[style*="position:fixed"]');
    const inOtherWays = a.closest('#other-ways, .other-ways, [data-other-ways]');
    if(fixed && !inOtherWays) (a.closest('.whatsapp-float,.floating-whatsapp,.joinchat__button')||a).remove();
  });
  // Normalize submit
  const sub=document.querySelector('button[type="submit"],input[type="submit"]'); if(sub){ sub.classList.add('btn','btn-primary'); }
  // Ensure redirect
  const f=document.querySelector('form[action*="formsubmit.co"], form[action*="formsubmit"]'); 
  if(f && !f.querySelector('input[name="_next"]')){ const x=document.createElement('input'); x.type='hidden'; x.name='_next'; x.value='/thank-you.html'; f.appendChild(x); }
})();
