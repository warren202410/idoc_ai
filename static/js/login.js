/**
 * Login form handling
 */
document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('login-form');
  
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      // Basic validation
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      let isValid = true;
      
      if (!email.value.trim()) {
        const feedback = email.nextElementSibling;
        email.classList.add('is-invalid');
        if (feedback) feedback.textContent = 'Email is required';
        isValid = false;
      }
      
      if (!password.value.trim()) {
        const feedback = password.parentNode.nextElementSibling;
        password.classList.add('is-invalid');
        if (feedback) feedback.textContent = 'Password is required';
        isValid = false;
      }
      
      if (!isValid) {
        event.preventDefault();
      }
    });
  }
});