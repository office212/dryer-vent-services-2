// v6.2.5 Contact-only fixes
(function(){
  if(!document.body.classList.contains('contact-page')) return;
  // Remove ALL WhatsApp links/buttons on this page (ghost bubble etc.)
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(function(el){ try{ el.remove(); }catch(e){} });
  // Remove any fixed bottom bars on this page only
  document.querySelectorAll('*').forEach(function(el){
    var cs = getComputedStyle(el);
    if ((cs.position==='fixed' || cs.position==='sticky') && (cs.bottom==='0px' || cs.bottom==='0')) {
      try{ el.remove(); }catch(e){}
    }
  });
  // Ensure redirect to thank-you if missing
  var f=document.querySelector('form');
  if(f && !f.querySelector('input[name="_next"]')){
    var x=document.createElement('input'); x.type='hidden'; x.name='_next'; x.value='/thank-you.html'; f.appendChild(x);
  }
})();
