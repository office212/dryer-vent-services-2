// v6.2.1 - Remove ghost WhatsApp bubbles on Contact only; keep legit button in .other-ways
(function(){
  if(!document.body.classList.contains('page-contact')) return;
  const clean = () => {
    document.querySelectorAll('a[href*="wa.me"],a[href*="whatsapp.com"]').forEach(a=>{
      if(!a.closest('.other-ways') && (getComputedStyle(a).position==='fixed' || getComputedStyle(a).position==='sticky')){
        const wrap = a.closest('.floating-whatsapp,.wa-chat-widget,.joinchat__button,.getbutton-widget') || a;
        wrap.remove();
      }
    });
  };
  clean();
  const mo=new MutationObserver(clean); mo.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>mo.disconnect(),6000);
})();
