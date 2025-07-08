/**
 * Form validation related functionality
 */
document.addEventListener('DOMContentLoaded', function() {
  // Email validation
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  // Password validation
  // Requires at least 8 characters, one uppercase letter, one lowercase letter, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  
  // Phone validation
  const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
  
  /**
   * Validates an email field
   * @param {HTMLInputElement} field - The email input field
   * @returns {boolean} - Whether the email is valid
   */
  function validateEmail(field) {
    const value = field.value.trim();
    const feedback = field.nextElementSibling;
    
    if (value === '') {
      setInvalid(field, feedback, 'Email is required');
      return false;
    }
    
    if (!emailRegex.test(value)) {
      setInvalid(field, feedback, 'Please enter a valid email address');
      return false;
    }
    
    setValid(field, feedback);
    return true;
  }
  
  /**
   * Validates a password field
   * @param {HTMLInputElement} field - The password input field
   * @returns {boolean} - Whether the password is valid
   */
  function validatePassword(field) {
    const value = field.value;
    const feedback = field.nextElementSibling;
    
    if (value === '') {
      setInvalid(field, feedback, 'Password is required');
      return false;
    }
    
    if (value.length < 8) {
      setInvalid(field, feedback, 'Password must be at least 8 characters');
      return false;
    }
    
    if (!passwordRegex.test(value)) {
      setInvalid(field, feedback, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }
    
    setValid(field, feedback);
    return true;
  }
  
  /**
   * Validates a password confirmation field
   * @param {HTMLInputElement} field - The password confirmation input field
   * @param {string} passwordFieldId - The ID of the password field to compare with
   * @returns {boolean} - Whether the password confirmation is valid
   */
  function validatePasswordConfirm(field, passwordFieldId) {
    const value = field.value;
    const feedback = field.nextElementSibling;
    const passwordField = document.getElementById(passwordFieldId);
    
    if (!passwordField) return false;
    
    if (value === '') {
      setInvalid(field, feedback, 'Please confirm your password');
      return false;
    }
    
    if (value !== passwordField.value) {
      setInvalid(field, feedback, 'Passwords do not match');
      return false;
    }
    
    setValid(field, feedback);
    return true;
  }
  
  /**
   * Validates a required field
   * @param {HTMLInputElement} field - The input field
   * @returns {boolean} - Whether the field is valid
   */
  function validateRequired(field) {
    const value = field.value.trim();
    const feedback = field.nextElementSibling;
    const fieldName = field.dataset.name || 'This field';
    
    if (value === '') {
      setInvalid(field, feedback, `${fieldName} is required`);
      return false;
    }
    
    setValid(field, feedback);
    return true;
  }
  
  /**
   * Validates a phone field
   * @param {HTMLInputElement} field - The phone input field
   * @returns {boolean} - Whether the phone is valid
   */
  function validatePhone(field) {
    const value = field.value.trim();
    const feedback = field.nextElementSibling;
    
    if (value === '') {
      // If phone is optional, return true
      if (!field.hasAttribute('required')) {
        setValid(field, feedback);
        return true;
      }
      
      setInvalid(field, feedback, 'Phone number is required');
      return false;
    }
    
    if (!phoneRegex.test(value)) {
      setInvalid(field, feedback, 'Please enter a valid phone number');
      return false;
    }
    
    setValid(field, feedback);
    return true;
  }
  
  /**
   * Sets a field as invalid with an error message
   * @param {HTMLInputElement} field - The input field
   * @param {HTMLElement} feedback - The feedback element
   * @param {string} message - The error message
   */
  function setInvalid(field, feedback, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = message;
    } else {
      // Create feedback element if it doesn't exist
      const newFeedback = document.createElement('div');
      newFeedback.className = 'invalid-feedback';
      newFeedback.textContent = message;
      field.parentNode.insertBefore(newFeedback, field.nextSibling);
    }
  }
  
  /**
   * Sets a field as valid
   * @param {HTMLInputElement} field - The input field
   * @param {HTMLElement} feedback - The feedback element
   */
  function setValid(field, feedback) {
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = '';
    }
  }
  
  // Set up validation for forms
  const forms = document.querySelectorAll('.needs-validation');
  
  forms.forEach(form => {
    // Validate on submit
    form.addEventListener('submit', function(event) {
      let isValid = true;
      
      // Email fields
      const emailFields = this.querySelectorAll('input[type="email"]');
      emailFields.forEach(field => {
        if (!validateEmail(field)) {
          isValid = false;
        }
      });
      
      // Password fields
      const passwordFields = this.querySelectorAll('input[type="password"]:not([data-confirm-for])');
      passwordFields.forEach(field => {
        if (!validatePassword(field)) {
          isValid = false;
        }
      });
      
      // Password confirmation fields
      const passwordConfirmFields = this.querySelectorAll('input[data-confirm-for]');
      passwordConfirmFields.forEach(field => {
        if (!validatePasswordConfirm(field, field.dataset.confirmFor)) {
          isValid = false;
        }
      });
      
      // Required fields
      const requiredFields = this.querySelectorAll('input[required]:not([type="email"]):not([type="password"]), select[required], textarea[required]');
      requiredFields.forEach(field => {
        if (!validateRequired(field)) {
          isValid = false;
        }
      });
      
      // Phone fields
      const phoneFields = this.querySelectorAll('input[type="tel"]');
      phoneFields.forEach(field => {
        if (!validatePhone(field)) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      form.classList.add('was-validated');
    });
    
    // Real-time validation on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', function() {
        // Remove validation classes when user starts typing
        this.classList.remove('is-invalid');
        this.classList.remove('is-valid');
        
        const feedback = this.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback')) {
          feedback.textContent = '';
        }
      });
      
      field.addEventListener('blur', function() {
        // Validate when field loses focus
        if (this.type === 'email') {
          validateEmail(this);
        } else if (this.type === 'password' && !this.dataset.confirmFor) {
          validatePassword(this);
        } else if (this.dataset.confirmFor) {
          validatePasswordConfirm(this, this.dataset.confirmFor);
        } else if (this.type === 'tel') {
          validatePhone(this);
        } else if (this.hasAttribute('required')) {
          validateRequired(this);
        }
      });
    });
  });
});
