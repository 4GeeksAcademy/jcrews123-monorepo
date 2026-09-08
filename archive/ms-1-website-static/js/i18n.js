(function () {
  const STORAGE_KEY = 'brasaland-lang';
  const DEFAULT_LANG = 'en';

  let currentLang = DEFAULT_LANG;
  let strings = {};

  function getNested(obj, path) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  }

  function t(key) {
    const value = getNested(strings, key);
    return value !== null && value !== undefined ? value : key;
  }

  async function loadLanguage(lang) {
    const response = await fetch(`i18n/${lang}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load language: ${lang}`);
    }
    strings = await response.json();
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    updateLangButtons();
    applyTranslations();
    updateMetaTags();
    document.dispatchEvent(new CustomEvent('brasaland:langchange', { detail: { lang } }));
  }

  function updateMetaTags() {
    const isFormPage = document.body.dataset.page === 'form';
    const title = isFormPage ? t('meta.formTitle') : t('meta.indexTitle');
    const description = isFormPage ? t('meta.formDescription') : t('meta.indexDescription');

    document.title = title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const text = t(key);
      if (text) {
        el.textContent = text;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      const key = el.getAttribute('data-i18n-html');
      const text = t(key);
      if (text) {
        el.innerHTML = text;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = t(key);
      if (text) {
        el.setAttribute('placeholder', text);
      }
    });

    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      const text = t(key);
      if (text) {
        el.setAttribute('aria-label', text);
      }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      const key = el.getAttribute('data-i18n-alt');
      const text = t(key);
      if (text) {
        el.setAttribute('alt', text);
      }
    });

    updateSelectOptionLabels();
  }

  function updateSelectOptionLabels() {
    document.querySelectorAll('select option[data-i18n]').forEach((option) => {
      const key = option.getAttribute('data-i18n');
      const text = t(key);
      if (text) {
        option.textContent = text;
      }
    });
  }

  function updateLangButtons() {
    const btnEn = document.getElementById('lang-en');
    const btnEs = document.getElementById('lang-es');

    if (btnEn && btnEs) {
      const isEn = currentLang === 'en';
      btnEn.setAttribute('aria-pressed', isEn ? 'true' : 'false');
      btnEs.setAttribute('aria-pressed', !isEn ? 'true' : 'false');
      btnEn.classList.toggle('bg-amber-700', isEn);
      btnEn.classList.toggle('text-white', isEn);
      btnEn.classList.toggle('text-stone-700', !isEn);
      btnEs.classList.toggle('bg-amber-700', !isEn);
      btnEs.classList.toggle('text-white', !isEn);
      btnEs.classList.toggle('text-stone-700', isEn);
    }
  }

  function initLanguageSwitcher() {
    const btnEn = document.getElementById('lang-en');
    const btnEs = document.getElementById('lang-es');

    if (btnEn) {
      btnEn.addEventListener('click', () => loadLanguage('en'));
    }
    if (btnEs) {
      btnEs.addEventListener('click', () => loadLanguage('es'));
    }
  }

  async function initI18n() {
    const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    initLanguageSwitcher();
    try {
      await loadLanguage(saved);
    } catch {
      await loadLanguage(DEFAULT_LANG);
    }
  }

  window.BrasalandI18n = {
    t,
    getLang: () => currentLang,
    loadLanguage,
    initI18n,
  };

  document.addEventListener('DOMContentLoaded', initI18n);
})();
