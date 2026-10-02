(() => {
  const themeKey = 'opintoaikaTheme';
  const photoKey = 'opintoaikaProfilePhoto';
  const isNestedPage = /\/Kirjautumissivu\//.test(window.location.pathname.replace(/\\/g, '/'));
  const resolveRepositoryUrl = (target) => new URL(isNestedPage ? `../${target}` : target, window.location.href).href;
  const scriptSource = document.currentScript && document.currentScript.src;
  const stylesheetUrl = resolveRepositoryUrl('app-theme.css');
  const stylesheetLoaded = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    .some((link) => link.href === stylesheetUrl);
  if (!stylesheetLoaded) {
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = stylesheetUrl;
    stylesheet.dataset.appTheme = '';
    document.head.append(stylesheet);
  }

  const getStoredValue = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  };

  const updateThemeButtons = (theme) => {
    document.querySelectorAll('[data-theme-option]').forEach((button) => {
      button.setAttribute('aria-checked', String(button.dataset.themeOption === theme));
    });
  };

  const setTheme = (theme, persist = true) => {
    const selectedTheme = theme === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = selectedTheme;
    updateThemeButtons(selectedTheme);
    if (persist) {
      try {
        localStorage.setItem(themeKey, selectedTheme);
      } catch (error) {
        // Keep the selected theme active for this page even when storage is unavailable.
      }
    }
  };

  const refreshProfilePhoto = () => {
    const photo = getStoredValue(photoKey);
    document.querySelectorAll('[data-profile-photo-target]').forEach((target) => {
      target.replaceChildren();
      if (photo) {
        const image = document.createElement('img');
        image.className = 'profile-photo-image';
        image.src = photo;
        image.alt = target.dataset.photoAlt || 'Profiilikuva';
        target.append(image);
      } else {
        const icon = document.createElement('span');
        icon.className = `material-symbols-outlined ${target.dataset.fallbackClass || ''}`.trim();
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = 'person';
        target.append(icon);
      }
    });
    const removePhoto = document.getElementById('remove-profile-photo');
    if (removePhoto) removePhoto.hidden = !photo;
  };

  setTheme(getStoredValue(themeKey) || 'light', false);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }

  function initialize() {
    const avatar = document.querySelector('header > div > div:last-child > div.w-8.h-8.rounded-full.bg-primary');
    if (avatar && !avatar.closest('[data-profile-link]')) {
      const link = document.createElement('a');
      link.href = 'Profiili.html';
      link.className = 'w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary hover:brightness-95 active:scale-95 transition-transform';
      link.setAttribute('aria-label', 'Profiili ja asetukset');
      link.title = 'Profiili ja asetukset';
      link.dataset.profileLink = '';
      link.dataset.profilePhotoTarget = '';
      link.dataset.fallbackClass = 'text-[18px]';
      avatar.replaceWith(link);
    }

    document.querySelectorAll('[data-theme-option]').forEach((button) => {
      button.addEventListener('click', () => setTheme(button.dataset.themeOption));
    });
    refreshProfilePhoto();
    updateThemeButtons(getStoredValue(themeKey) || 'light');
  }

  window.OpintoAikaSettings = { setTheme, refreshProfilePhoto };
})();
