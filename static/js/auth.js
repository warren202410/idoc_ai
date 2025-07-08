/**
 * Authentication related functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Form submission handling with loading state
  const authForms = document.querySelectorAll('.auth-form');
  
  authForms.forEach(form => {
    form.addEventListener('submit', function(e) {
      // Find the submit button
      const submitButton = this.querySelector('button[type="submit"]');
      
      // If form validation passes
      if (this.checkValidity()) {
        // Disable the button and show loading state
        if (submitButton) {
          const originalText = submitButton.innerHTML;
          submitButton.disabled = true;
          submitButton.innerHTML = '<span class="spinner"></span> ' + 
                                   (submitButton.dataset.loadingText || 'Processing...');
          
          // Re-enable the button after 10 seconds (failsafe in case of errors)
          setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
          }, 10000);
        }
      }
    });
  });

  // Password toggle visibility
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      const passwordField = document.querySelector(this.dataset.target);
      if (!passwordField) return;
      
      const type = passwordField.getAttribute('type');
      const newType = type === 'password' ? 'text' : 'password';
      passwordField.setAttribute('type', newType);
      
      // Update icon
      const icon = this.querySelector('i');
      if (icon) {
        if (newType === 'text') {
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        } else {
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        }
      }
    });
  });

  // Social login button handling
  const socialButtons = document.querySelectorAll('.social-button');
  
  socialButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Add loading state
      const originalText = this.innerHTML;
      this.innerHTML = '<span class="spinner"></span> Connecting...';
      this.classList.add('disabled');
      
      // Restore after timeout (failsafe)
      setTimeout(() => {
        this.innerHTML = originalText;
        this.classList.remove('disabled');
      }, 10000);
    });
  });
});

/**
 * Helper function to show an alert message
 * @param {string} message - The message to display
 * @param {string} type - The alert type (success, danger, warning, info)
 * @param {string} containerId - The ID of the container to add the alert to
 */
function showAlert(message, type = 'info', containerId = 'alerts-container') {
  const alertsContainer = document.getElementById(containerId);
  if (!alertsContainer) return;
  
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  alertsContainer.appendChild(alertDiv);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => {
      alertsContainer.removeChild(alertDiv);
    }, 150);
  }, 5000);
}
