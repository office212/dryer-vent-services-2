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

// v6.2.4 hardening: remove ALL WhatsApp links on Contact, hide any fixed bottom bars
(function(){
  if(!document.body.classList.contains('contact-page')) return;
  // Remove any WhatsApp links/buttons entirely on contact page
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(el=>{ try{ el.remove(); }catch(e){} });
  // Remove any fixed elements at bottom (possible sticky bars)
  document.querySelectorAll('*').forEach(el=>{
    const cs = getComputedStyle(el);
    if ((cs.position==='fixed' || cs.position==='sticky') && (cs.bottom==='0px' || cs.bottom==='0')) {
      try{ el.remove(); }catch(e){}
    }
  });
  // Ensure _next hidden field
  const f=document.querySelector('form'); 
  if(f && !f.querySelector('input[name="_next"]')){
    const inp=document.createElement('input'); inp.type='hidden'; inp.name='_next'; inp.value='/thank-you.html'; f.appendChild(inp);
  }
  // Ensure submit button looks primary
  const s=document.querySelector('button[type="submit"],input[type="submit"]');
  if(s){ s.classList.add('send-btn'); s.style.minWidth='220px'; }
})();
