// Visual-only enhancements loaded after the main app.
// Adds soft per-topic progress percentages and a light/dark palette toggle without changing the save format.
(function () {
  if (typeof renderCategoryList === 'function') {
    const originalRenderCategoryList = renderCategoryList;

    renderCategoryList = function enhancedRenderCategoryList(...args) {
      originalRenderCategoryList.apply(this, args);

      document.querySelectorAll('.category-item').forEach((button) => {
        const label = button.querySelector('strong')?.textContent?.trim() || 'Topic';
        const small = button.querySelector('small');
        if (!small) return;

        const match = small.textContent.match(/(\d+)\s*\/\s*(\d+)/);
        if (!match) return;

        const answered = Number(match[1]);
        const total = Number(match[2]);
        const percent = total ? Math.round((answered / total) * 100) : 0;

        button.style.setProperty('--category-progress', `${percent}%`);
        small.textContent = `${answered} / ${total} answered • ${percent}%`;
        button.setAttribute('aria-label', `${label}: ${answered} of ${total} answered, ${percent} percent complete`);
      });
    };
  }

  const THEME_KEY = 'rpg-worldbuilder-helper-theme';

  function applyTheme(theme) {
    const safeTheme = theme === 'dark' ? 'dark' : 'light';
    document.body.dataset.theme = safeTheme;
    localStorage.setItem(THEME_KEY, safeTheme);

    const button = document.getElementById('themeToggleBtn');
    if (!button) return;

    if (safeTheme === 'dark') {
      button.textContent = '☀ Light Palette';
      button.setAttribute('aria-label', 'Switch to light palette');
      button.title = 'Switch to light palette';
    } else {
      button.textContent = '☾ Dark Palette';
      button.setAttribute('aria-label', 'Switch to dark palette');
      button.title = 'Switch to dark palette';
    }
  }

  function initThemeToggle() {
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(saved);

    const button = document.getElementById('themeToggleBtn');
    if (!button) return;

    button.addEventListener('click', () => {
      const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();
