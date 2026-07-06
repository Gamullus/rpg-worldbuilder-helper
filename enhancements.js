// Visual-only enhancements loaded after the main app.
// Adds soft per-topic progress percentages without changing the save format.
(function () {
  if (typeof renderCategoryList !== 'function') return;

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
})();
