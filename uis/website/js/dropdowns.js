(function () {
  const PLACEHOLDER_CITY = '';
  const PLACEHOLDER_LOCATION = '';

  function getLocationsData() {
    return window.BRASALAND_LOCATIONS || {};
  }

  function clearSelect(select, placeholderText, disabled) {
    select.innerHTML = '';
    const option = document.createElement('option');
    option.value = PLACEHOLDER_CITY;
    option.textContent = placeholderText;
    option.disabled = true;
    option.selected = true;
    select.appendChild(option);
    select.disabled = disabled;
    select.value = PLACEHOLDER_CITY;
  }

  function populateSelect(select, items, placeholderText, disabled) {
    clearSelect(select, placeholderText, disabled);
    items.forEach((item) => {
      const option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      select.appendChild(option);
    });
    select.disabled = disabled;
  }

  function getPlaceholder(key, fallback) {
    if (window.BrasalandI18n) {
      return window.BrasalandI18n.t(key) || fallback;
    }
    return fallback;
  }

  function initDropdowns(form) {
    const countrySelect = form.querySelector('#country');
    const citySelect = form.querySelector('#city');
    const locationSelect = form.querySelector('#favoriteLocation');
    const data = getLocationsData();

    if (!countrySelect || !citySelect || !locationSelect) return;

    function resetCity() {
      clearSelect(
        citySelect,
        getPlaceholder('form.selectCity', 'Select your city'),
        true
      );
    }

    function resetLocation() {
      clearSelect(
        locationSelect,
        getPlaceholder('form.selectLocation', 'Select a location (optional)'),
        true
      );
    }

    function populateCities(country) {
      const countryData = data[country];
      if (!countryData) {
        resetCity();
        resetLocation();
        return;
      }
      populateSelect(
        citySelect,
        countryData.cities,
        getPlaceholder('form.selectCity', 'Select your city'),
        false
      );
      resetLocation();
    }

    function populateLocations(country, city) {
      const countryData = data[country];
      const locations = countryData?.locations?.[city] || [];
      if (!locations.length) {
        resetLocation();
        return;
      }
      populateSelect(
        locationSelect,
        locations,
        getPlaceholder('form.selectLocation', 'Select a location (optional)'),
        false
      );
    }

    countrySelect.addEventListener('change', () => {
      const country = countrySelect.value;
      if (!country) {
        resetCity();
        resetLocation();
        return;
      }
      populateCities(country);
      document.dispatchEvent(new CustomEvent('brasaland:countrychange'));
    });

    citySelect.addEventListener('change', () => {
      const country = countrySelect.value;
      const city = citySelect.value;
      if (!country || !city) {
        resetLocation();
        return;
      }
      populateLocations(country, city);
    });

    resetCity();
    resetLocation();

    document.addEventListener('brasaland:langchange', () => {
      const country = countrySelect.value;
      const city = citySelect.value;
      if (country) {
        populateCities(country);
        if (city) {
          citySelect.value = city;
          populateLocations(country, city);
          const location = locationSelect.dataset.lastValue;
          if (location) {
            locationSelect.value = location;
          }
        }
      } else {
        resetCity();
        resetLocation();
      }
    });

    locationSelect.addEventListener('change', () => {
      locationSelect.dataset.lastValue = locationSelect.value;
    });

    return {
      resetAll() {
        countrySelect.value = '';
        delete locationSelect.dataset.lastValue;
        resetCity();
        resetLocation();
      },
    };
  }

  window.BrasalandDropdowns = { initDropdowns };
})();
