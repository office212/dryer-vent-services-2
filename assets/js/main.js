
document.addEventListener('DOMContentLoaded', function(){
  const form = document.querySelector('#contact-form');
  const submitBtn = document.querySelector('#submit-btn');
  const toast = document.querySelector('#toast');
  if(form && submitBtn){
    form.addEventListener('submit', function(){
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      if(toast){ toast.classList.add('show'); toast.textContent = 'Sent! Redirecting…'; }
    });
  }
});
