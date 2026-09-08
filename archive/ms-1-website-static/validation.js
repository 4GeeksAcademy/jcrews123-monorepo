(function () {
  const FIELD_IDS = [
    'fullName',
    'email',
    'phone',
    'country',
    'city',
    'howDidYouFindUs',
    'dateOfBirth',
    'acceptTerms',
  ];

  const ERROR_KEYS = {
    fullName: 'form.errors.fullName',
    email: 'form.errors.email',
    phone: 'form.errors.phone',
    country: 'form.errors.country',
    city: 'form.errors.city',
    howDidYouFindUs: 'form.errors.howDidYouFindUs',
    dateOfBirth: 'form.errors.dateOfBirth',
    acceptTerms: 'form.errors.acceptTerms',
  };

  const FALLBACK_ERRORS = {
    fullName: 'Enter your full name (first and last name)',
    email: 'Enter a valid email (example: name@email.com)',
    phone: 'Phone must include country code (example: +57 300 123 4567 or +1 305 123 4567)',
    country: 'Select your country',
    city: 'Select your city',
    howDidYouFindUs: 'Tell us how you found Brasaland',
    dateOfBirth: 'You must be 18 or older to register for Brasa Points',
    acceptTerms: 'You must accept the Brasa Points program terms to continue',
  };

  let dropdownControls = null;
  let debounceTimers = {};

  function errorMessage(field) {
    const key = ERROR_KEYS[field];
    if (window.BrasalandI18n && key) {
      return window.BrasalandI18n.t(key);
    }
    return FALLBACK_ERRORS[field];
  }

  function getFieldElement(field) {
    if (field === 'acceptTerms') {
      return document.getElementById('acceptTerms');
    }
    return document.getElementById(field);
  }

  function getErrorElement(field) {
    return document.getElementById(`${field}-error`);
  }

  function showError(field, message) {
    const input = getFieldElement(field);
    const errorEl = getErrorElement(field);
    if (!input || !errorEl) return;

    input.setAttribute('aria-invalid', 'true');
    input.classList.add('border-red-500', 'ring-1', 'ring-red-500');
    input.classList.remove('border-stone-300');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }

  function clearError(field) {
    const input = getFieldElement(field);
    const errorEl = getErrorElement(field);
    if (!input || !errorEl) return;

    input.removeAttribute('aria-invalid');
    input.classList.remove('border-red-500', 'ring-1', 'ring-red-500');
    input.classList.add('border-stone-300');
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }

  function validateFullName(value) {
    const words = value.trim().split(/\s+/).filter(Boolean);
    return words.length >= 2;
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validatePhone(value, country) {
    const trimmed = value.trim();
    if (!/^\+\d[\d\s-]{7,}$/.test(trimmed)) {
      return false;
    }
    if (country === 'Colombia') {
      return trimmed.startsWith('+57');
    }
    if (country === 'United States') {
      return trimmed.startsWith('+1');
    }
    return trimmed.startsWith('+');
  }

  function validateCountry(value) {
    return value === 'Colombia' || value === 'United States';
  }

  function validateCity(value, country) {
    if (!validateCountry(country)) return false;
    const data = window.BRASALAND_LOCATIONS?.[country];
    return data?.cities?.includes(value) || false;
  }

  function validateHowDidYouFindUs(value) {
    const options = [
      'Social media',
      'Recommendation',
      'Walked by',
      'Internet search',
      'Other',
    ];
    return options.includes(value);
  }

  function validateDateOfBirth(value) {
    if (!value) return false;
    const dob = new Date(value + 'T00:00:00');
    if (Number.isNaN(dob.getTime())) return false;

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }
    return age >= 18;
  }

  function validateAcceptTerms(checked) {
    return checked === true;
  }

  function validateField(field) {
    const form = document.getElementById('brasa-points-form');
    if (!form) return true;

    switch (field) {
      case 'fullName': {
        const el = getFieldElement(field);
        const valid = validateFullName(el.value);
        if (!valid) showError(field, errorMessage(field));
        else clearError(field);
        return valid;
      }
      case 'email': {
        const el = getFieldElement(field);
        const valid = validateEmail(el.value);
        if (!valid) showError(field, errorMessage(field));
        else clearError(field);
        return valid;
      }
      case 'phone': {
        const el = getFieldElement(field);
        const country = form.querySelector('#country')?.value || '';
        const valid = validatePhone(el.value, country);
        if (!valid) showError(field, errorMessage(field));
        else clearError(field);
        return valid;
      }
      case 'country': {
        const el = getFieldElement(field);
        const valid = validateCountry(el.value);
        if (!valid) showError(field, errorMessage(field));
        else clearError(field);
        return valid;
      }
      case 'city': {
        const el = getFieldElement(field);
        const country = form.querySelector('#country')?.value || '';
        const valid = validateCity(el.value, country);
        if (!valid) showError(field, errorMessage(field));
        else clearError(field);
        return valid;
      }
      case 'howDidYouFindUs': {
        const el = getFieldElement(field);
        const valid = validateHowDidYouFindUs(el.value);
        if (!valid) showError(field, errorMessage(field));
        else clearError(field);
        return valid;
      }
      case 'dateOfBirth': {
        const el = getFieldElement(field);
        const valid = validateDateOfBirth(el.value);
        if (!valid) showError(field, errorMessage(field));
        else clearError(field);
        return valid;
      }
      case 'acceptTerms': {
        const el = getFieldElement(field);
        const valid = validateAcceptTerms(el.checked);
        if (!valid) showError(field, errorMessage(field));
        else clearError(field);
        return valid;
      }
      default:
        return true;
    }
  }

  function validateAll() {
    let isValid = true;
    FIELD_IDS.forEach((field) => {
      if (!validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  }

  function showErrorSummary() {
    const summary = document.getElementById('form-error-summary');
    if (!summary) return;
    summary.textContent = window.BrasalandI18n
      ? window.BrasalandI18n.t('form.errorSummary')
      : 'Please correct the errors below before submitting.';
    summary.classList.remove('hidden');
  }

  function hideErrorSummary() {
    const summary = document.getElementById('form-error-summary');
    if (summary) {
      summary.classList.add('hidden');
      summary.textContent = '';
    }
  }

  function showSuccess() {
    const form = document.getElementById('brasa-points-form');
    const success = document.getElementById('form-success');
    if (!form || !success) return;

    form.classList.add('hidden');
    success.classList.remove('hidden');
    success.setAttribute('tabindex', '-1');
    success.focus();
  }

  function hideSuccess() {
    const form = document.getElementById('brasa-points-form');
    const success = document.getElementById('form-success');
    if (!form || !success) return;

    form.classList.remove('hidden');
    success.classList.add('hidden');
  }

  function setMaxDateOfBirth() {
    const dobInput = document.getElementById('dateOfBirth');
    if (!dobInput) return;

    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const yyyy = maxDate.getFullYear();
    const mm = String(maxDate.getMonth() + 1).padStart(2, '0');
    const dd = String(maxDate.getDate()).padStart(2, '0');
    dobInput.setAttribute('max', `${yyyy}-${mm}-${dd}`);
  }

  function debounceValidate(field, delay) {
    clearTimeout(debounceTimers[field]);
    debounceTimers[field] = setTimeout(() => validateField(field), delay);
  }

  function bindFieldEvents() {
    const form = document.getElementById('brasa-points-form');
    if (!form) return;

    ['fullName', 'email', 'phone'].forEach((field) => {
      const el = getFieldElement(field);
      if (!el) return;
      el.addEventListener('blur', () => validateField(field));
      el.addEventListener('input', () => debounceValidate(field, 300));
    });

    ['country', 'city', 'howDidYouFindUs', 'dateOfBirth'].forEach((field) => {
      const el = getFieldElement(field);
      if (!el) return;
      el.addEventListener('blur', () => validateField(field));
      el.addEventListener('change', () => validateField(field));
    });

    const terms = getFieldElement('acceptTerms');
    if (terms) {
      terms.addEventListener('change', () => validateField('acceptTerms'));
    }

    document.addEventListener('brasaland:countrychange', () => {
      validateField('city');
      validateField('phone');
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    hideErrorSummary();

    if (validateAll()) {
      showSuccess();
    } else {
      showErrorSummary();
      const firstInvalid = FIELD_IDS.find((field) => {
        const el = getFieldElement(field);
        return el && el.getAttribute('aria-invalid') === 'true';
      });
      if (firstInvalid) {
        getFieldElement(firstInvalid)?.focus();
      }
    }
  }

  function handleClear() {
    const form = document.getElementById('brasa-points-form');
    if (!form) return;

    form.reset();
    FIELD_IDS.forEach(clearError);
    hideErrorSummary();
    hideSuccess();

    if (dropdownControls) {
      dropdownControls.resetAll();
    }

    document.querySelectorAll('input[name="dietaryPreferences"]').forEach((cb) => {
      cb.checked = false;
    });
  }

  function refreshErrorMessages() {
    FIELD_IDS.forEach((field) => {
      const el = getFieldElement(field);
      if (el && el.getAttribute('aria-invalid') === 'true') {
        showError(field, errorMessage(field));
      }
    });

    const summary = document.getElementById('form-error-summary');
    if (summary && !summary.classList.contains('hidden')) {
      showErrorSummary();
    }

    const success = document.getElementById('form-success');
    if (success && !success.classList.contains('hidden')) {
      const title = document.getElementById('success-title');
      const body = document.getElementById('success-body');
      const footer = document.getElementById('success-footer');
      if (window.BrasalandI18n) {
        if (title) title.textContent = window.BrasalandI18n.t('form.success.title');
        if (body) body.textContent = window.BrasalandI18n.t('form.success.body');
        if (footer) footer.textContent = window.BrasalandI18n.t('form.success.footer');
      }
    }
  }

  function initValidation() {
    const form = document.getElementById('brasa-points-form');
    if (!form) return;

    setMaxDateOfBirth();
    dropdownControls = window.BrasalandDropdowns?.initDropdowns(form);
    bindFieldEvents();

    form.addEventListener('submit', handleSubmit);

    const clearBtn = document.getElementById('clear-form');
    if (clearBtn) {
      clearBtn.addEventListener('click', handleClear);
    }

    document.addEventListener('brasaland:langchange', refreshErrorMessages);
  }

  document.addEventListener('DOMContentLoaded', initValidation);
})();
