// Feature upgrades loaded after the main app.
// Adds topic hiding, question search, skip/ignore/important flags, answered-only PDF export,
// better progress accounting, mobile topic drawer behavior, and the light/dark palette toggle.
(function () {
  const LORE_KOBOLD_ICON = 'lore-kobold-icon.png';
  const THEME_KEY = 'rpg-worldbuilder-helper-theme';
  const THEME_DEFAULT_KEY = 'rpg-worldbuilder-helper-dark-default-v2';
  const MOBILE_QUERY = '(max-width: 880px)';

  const rawIsAnswered = typeof isAnswered === 'function' ? isAnswered : () => false;
  const rawGetSavePayload = typeof getSavePayload === 'function' ? getSavePayload : () => ({});
  const rawApplySavePayload = typeof applySavePayload === 'function' ? applySavePayload : null;
  const rawRenderQuestion = typeof renderQuestion === 'function' ? renderQuestion : null;

  function isMobileLayout() {
    return window.matchMedia && window.matchMedia(MOBILE_QUERY).matches;
  }

  function setTopicsCollapsed(collapsed) {
    const panel = document.getElementById('sidePanel');
    const btn = document.getElementById('topicsToggleBtn');
    if (!panel || !btn) return;
    panel.classList.toggle('topics-collapsed', collapsed);
    btn.setAttribute('aria-expanded', String(!collapsed));
    btn.textContent = collapsed ? '☰ Topics' : '☰';
    btn.title = collapsed ? 'Show topics' : 'Hide topics';
  }

  function scrollQuestionIntoView() {
    if (!isMobileLayout()) return;
    const journal = document.querySelector('.journal');
    if (!journal) return;
    journal.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function ensureFlags() {
    if (!state.questionFlags || typeof state.questionFlags !== 'object') state.questionFlags = {};
    return state.questionFlags;
  }

  function flagFor(id) {
    const flags = ensureFlags();
    if (!flags[id]) flags[id] = { important: false, skipped: false, ignored: false };
    return flags[id];
  }

  function normalizeFlags(input) {
    const clean = {};
    Object.entries(input || {}).forEach(([id, value]) => {
      clean[id] = {
        important: Boolean(value && value.important),
        skipped: Boolean(value && value.skipped),
        ignored: Boolean(value && value.ignored),
      };
    });
    return clean;
  }

  function isIgnored(question) {
    return Boolean(question && ensureFlags()[question.id] && ensureFlags()[question.id].ignored);
  }

  function isImportant(question) {
    return Boolean(question && ensureFlags()[question.id] && ensureFlags()[question.id].important);
  }

  function isSkipped(question) {
    return Boolean(question && ensureFlags()[question.id] && ensureFlags()[question.id].skipped);
  }

  function visibleQuestions() {
    return QUESTIONS.filter(q => !isIgnored(q));
  }

  function answerTextForSearch(question) {
    try { return answerAsText(question) || ''; } catch { return ''; }
  }

  function applyCustomMascot() {
    const mascot = document.getElementById('mascotImage');
    if (mascot) mascot.src = LORE_KOBOLD_ICON;
  }

  function saveFlagsAndRefresh() {
    saveProgress(false);
    renderCategoryList();
    updateProgress();
    syncQuestionControls();
    if (state.reviewMode) renderReview(state.reviewMode);
  }

  isAnswered = function enhancedIsAnswered(question) {
    if (isIgnored(question)) return false;
    return rawIsAnswered(question);
  };

  getSavePayload = function enhancedGetSavePayload() {
    const payload = rawGetSavePayload();
    payload.questionFlags = normalizeFlags(ensureFlags());
    payload.questionStateVersion = 'flags-v1';
    return payload;
  };

  if (rawApplySavePayload) {
    applySavePayload = function enhancedApplySavePayload(data) {
      state.questionFlags = normalizeFlags(data && (data.questionFlags || data.flags));
      rawApplySavePayload(data);
      state.questionFlags = normalizeFlags(data && (data.questionFlags || data.flags));
      saveProgress(false);
    };
  }

  findFirstUnansweredIndex = function enhancedFindFirstUnansweredIndex(category) {
    const list = questionsInCategory(category);
    const firstUnanswered = list.findIndex(q => !isIgnored(q) && !rawIsAnswered(q));
    if (firstUnanswered !== -1) return firstUnanswered;
    const firstVisible = list.findIndex(q => !isIgnored(q));
    return firstVisible === -1 ? 0 : firstVisible;
  };

  renderCategoryList = function enhancedRenderCategoryList() {
    const categories = getCategories();
    els.categoryList.innerHTML = '';
    categories.forEach(category => {
      const all = questionsInCategory(category);
      const active = all.filter(q => !isIgnored(q));
      const answered = active.filter(q => rawIsAnswered(q)).length;
      const ignored = all.length - active.length;
      const total = active.length;
      const percent = total ? Math.round((answered / total) * 100) : 100;

      const btn = document.createElement('button');
      btn.className = `category-item${category === state.selectedCategory ? ' active' : ''}${answered === total && total > 0 ? ' complete' : ''}`;
      btn.style.setProperty('--category-progress', `${percent}%`);
      btn.innerHTML = `
        <strong>${escapeHtml(category)}</strong>
        <small>${answered} / ${total} answered • ${percent}%${ignored ? ` • ${ignored} ignored` : ''}</small>
      `;
      btn.setAttribute('aria-label', `${category}: ${answered} of ${total} active questions answered, ${percent} percent complete`);
      btn.addEventListener('click', () => {
        state.selectedCategory = category;
        state.currentIndex = findFirstUnansweredIndex(category);
        closeReview(false);
        clearSearch(false);
        renderCategoryList();
        renderQuestion('next');
        if (isMobileLayout()) setTopicsCollapsed(true);
        scrollQuestionIntoView();
      });
      els.categoryList.appendChild(btn);
    });
  };

  updateProgress = function enhancedUpdateProgress(announceComplete = false) {
    const active = visibleQuestions();
    const total = active.length;
    const answered = active.filter(q => rawIsAnswered(q)).length;
    const ignored = QUESTIONS.length - total;
    const pct = total ? Math.round((answered / total) * 100) : 100;
    els.overallBar.style.width = `${pct}%`;
    els.overallText.textContent = `${answered} / ${total} answered • ${pct}%${ignored ? ` • ${ignored} ignored` : ''}`;
    els.worldNameLine.textContent = state.worldName ? `Current world: ${state.worldName}` : 'No world name yet.';
    if (answered === total && total > 0) {
      showNotice('The Lore Kobold has no more active questions. You have answered everything that is not ignored.', 'complete');
    } else if (announceComplete) {
      showNotice(`${total - answered} active questions remain unanswered.`, '');
    }
  };

  if (rawRenderQuestion) {
    renderQuestion = function enhancedRenderQuestion(direction = 'next') {
      rawRenderQuestion(direction);
      syncQuestionControls();
    };
  }

  function nextVisibleIndex(category, startIndex, direction) {
    const list = questionsInCategory(category);
    let i = startIndex + direction;
    while (i >= 0 && i < list.length) {
      if (!isIgnored(list[i])) return i;
      i += direction;
    }
    return -1;
  }

  nextQuestion = function enhancedNextQuestion() {
    const nextIndex = nextVisibleIndex(state.selectedCategory, state.currentIndex, 1);
    if (nextIndex !== -1) {
      state.currentIndex = nextIndex;
      renderQuestion('next');
      scrollQuestionIntoView();
      return;
    }

    const categories = getCategories();
    const catIndex = categories.indexOf(state.selectedCategory);
    for (let i = catIndex + 1; i < categories.length; i += 1) {
      const candidate = categories[i];
      if (questionsInCategory(candidate).some(q => !isIgnored(q))) {
        state.selectedCategory = candidate;
        state.currentIndex = findFirstUnansweredIndex(candidate);
        renderCategoryList();
        renderQuestion('next');
        showNotice(`Topic finished. The Lore Kobold opened ${candidate}.`, '');
        scrollQuestionIntoView();
        return;
      }
    }

    updateProgress(true);
    showReview('unanswered');
  };

  previousQuestion = function enhancedPreviousQuestion() {
    const prevIndex = nextVisibleIndex(state.selectedCategory, state.currentIndex, -1);
    if (prevIndex !== -1) {
      state.currentIndex = prevIndex;
      renderQuestion('back');
      scrollQuestionIntoView();
    }
  };

  function syncQuestionControls() {
    const q = getCurrentQuestion && getCurrentQuestion();
    if (!q) return;
    const flags = flagFor(q.id);

    const importantBtn = document.getElementById('importantBtn');
    const skipBtn = document.getElementById('skipBtn');
    const ignoreBtn = document.getElementById('ignoreBtn');
    const statusPill = document.getElementById('questionStatusPill');

    if (importantBtn) {
      importantBtn.textContent = flags.important ? '★ Important' : '☆ Mark Important';
      importantBtn.classList.toggle('active-important', flags.important);
    }
    if (skipBtn) {
      skipBtn.textContent = flags.skipped ? 'Unskip' : 'Skip for Now';
      skipBtn.classList.toggle('active-skipped', flags.skipped);
    }
    if (ignoreBtn) {
      ignoreBtn.textContent = flags.ignored ? 'Restore Question' : 'Ignore Question';
      ignoreBtn.classList.toggle('active-ignored', flags.ignored);
    }
    if (statusPill) {
      const statuses = [];
      if (flags.important) statuses.push('★ Important');
      if (flags.skipped) statuses.push('Skipped');
      if (flags.ignored) statuses.push('Ignored');
      statusPill.textContent = statuses.join(' • ');
      statusPill.hidden = statuses.length === 0;
    }
  }

  function skipCurrentQuestion() {
    const q = getCurrentQuestion();
    if (!q) return;
    const flags = flagFor(q.id);
    flags.skipped = !flags.skipped;
    if (flags.skipped) flags.ignored = false;
    saveFlagsAndRefresh();
    if (flags.skipped) nextQuestion();
  }

  function ignoreCurrentQuestion() {
    const q = getCurrentQuestion();
    if (!q) return;
    const flags = flagFor(q.id);
    flags.ignored = !flags.ignored;
    if (flags.ignored) {
      flags.skipped = false;
      showNotice('Question ignored. It will not count against progress or answered-only export.', '');
      saveFlagsAndRefresh();
      nextQuestion();
    } else {
      showNotice('Question restored. It counts in progress again.', '');
      saveFlagsAndRefresh();
    }
  }

  function toggleImportant() {
    const q = getCurrentQuestion();
    if (!q) return;
    const flags = flagFor(q.id);
    flags.important = !flags.important;
    saveFlagsAndRefresh();
  }

  function clearSearch(close = true) {
    const search = document.getElementById('questionSearch');
    if (search) search.value = '';
    state.searchQuery = '';
    if (close && state.reviewMode === 'search') closeReview(true);
  }

  function matchesSearch(question, query) {
    const haystack = `${question.category} ${question.text} ${answerTextForSearch(question)}`.toLowerCase();
    return query.toLowerCase().split(/\s+/).filter(Boolean).every(term => haystack.includes(term));
  }

  showReview = function enhancedShowReview(mode) {
    state.reviewMode = mode;
    els.welcomeView.hidden = true;
    els.questionView.hidden = true;
    els.reviewView.hidden = false;
    const titles = {
      answered: 'Answered Questions',
      unanswered: 'Unanswered Questions',
      important: 'Important Questions',
      all: 'All Questions',
      search: state.searchQuery ? `Search Results: ${state.searchQuery}` : 'Search Results',
    };
    els.reviewTitle.textContent = titles[mode] || 'Questions';
    renderReview(mode);
    scrollQuestionIntoView();
  };

  renderReview = function enhancedRenderReview(mode) {
    els.reviewContent.innerHTML = '';
    let any = false;
    const query = (state.searchQuery || '').trim();

    getCategories().forEach(category => {
      const filtered = questionsInCategory(category).filter(q => {
        if (mode === 'answered') return !isIgnored(q) && rawIsAnswered(q);
        if (mode === 'unanswered') return !isIgnored(q) && !rawIsAnswered(q);
        if (mode === 'important') return isImportant(q);
        if (mode === 'search') return query && matchesSearch(q, query);
        return true;
      });
      if (!filtered.length) return;
      any = true;

      const section = document.createElement('section');
      section.className = 'review-category';
      const h = document.createElement('h3');
      h.textContent = `${category} (${filtered.length})`;
      section.appendChild(h);

      filtered.forEach(q => {
        const item = document.createElement('div');
        item.className = 'review-item';
        const question = document.createElement('div');
        question.className = 'review-question';
        question.textContent = q.text;

        const status = document.createElement('div');
        status.className = 'review-status';
        const statuses = [];
        if (rawIsAnswered(q)) statuses.push('Answered'); else statuses.push('Unanswered');
        if (isImportant(q)) statuses.push('★ Important');
        if (isSkipped(q)) statuses.push('Skipped');
        if (isIgnored(q)) statuses.push('Ignored');
        status.textContent = statuses.join(' • ');

        const answer = document.createElement('div');
        answer.className = 'review-answer';
        answer.textContent = rawIsAnswered(q) ? answerAsText(q) : 'Not answered yet.';

        const edit = document.createElement('button');
        edit.textContent = 'Go to question';
        edit.addEventListener('click', () => {
          state.selectedCategory = q.category;
          state.currentIndex = questionsInCategory(q.category).findIndex(item => item.id === q.id);
          renderCategoryList();
          closeReview(true);
          syncQuestionControls();
          if (isMobileLayout()) setTopicsCollapsed(true);
          scrollQuestionIntoView();
        });

        item.append(question, status, answer, edit);
        section.appendChild(item);
      });
      els.reviewContent.appendChild(section);
    });

    if (!any) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      if (mode === 'answered') empty.textContent = 'No answers yet. The Lore Kobold is trying not to look disappointed.';
      else if (mode === 'unanswered') empty.textContent = 'No active unanswered questions. Ignored questions are hidden from this list.';
      else if (mode === 'important') empty.textContent = 'No important questions marked yet.';
      else if (mode === 'search') empty.textContent = query ? 'No questions matched that search.' : 'Type in the search bar to find questions.';
      else empty.textContent = 'Nothing to show here.';
      els.reviewContent.appendChild(empty);
    }
  };

  function exportAnsweredOnlyPdf() {
    const answered = QUESTIONS.filter(q => !isIgnored(q) && rawIsAnswered(q)).length;
    if (!answered) {
      showNotice('No answered active questions to export yet.', 'warning');
      return;
    }
    saveProgress(false);
    const payload = getSavePayload();
    exportPdf(payload, `${filenameBase()}-answered-only.pdf`);
    showNotice('Answered-only PDF export started.', '');
  }

  function applyTheme(theme) {
    const safeTheme = theme === 'light' ? 'light' : 'dark';
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

  function initEnhancements() {
    ensureFlags();
    applyCustomMascot();

    const migratedToDarkDefault = localStorage.getItem(THEME_DEFAULT_KEY) === 'yes';
    const saved = localStorage.getItem(THEME_KEY);
    const initialTheme = migratedToDarkDefault ? (saved || 'dark') : 'dark';
    localStorage.setItem(THEME_DEFAULT_KEY, 'yes');
    applyTheme(initialTheme);

    if (isMobileLayout()) setTopicsCollapsed(true);

    document.getElementById('themeToggleBtn')?.addEventListener('click', () => {
      const nextTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });

    document.getElementById('importantBtn')?.addEventListener('click', toggleImportant);
    document.getElementById('skipBtn')?.addEventListener('click', skipCurrentQuestion);
    document.getElementById('ignoreBtn')?.addEventListener('click', ignoreCurrentQuestion);
    document.getElementById('exportAnsweredBtn')?.addEventListener('click', exportAnsweredOnlyPdf);
    document.getElementById('importantQuestionsBtn')?.addEventListener('click', () => showReview('important'));

    document.getElementById('topicsToggleBtn')?.addEventListener('click', () => {
      const panel = document.getElementById('sidePanel');
      if (!panel) return;
      setTopicsCollapsed(!panel.classList.contains('topics-collapsed'));
    });

    const mobileMedia = window.matchMedia ? window.matchMedia(MOBILE_QUERY) : null;
    mobileMedia?.addEventListener?.('change', event => {
      if (event.matches) setTopicsCollapsed(true);
      else setTopicsCollapsed(false);
    });

    const search = document.getElementById('questionSearch');
    search?.addEventListener('focus', () => {
      if (isMobileLayout()) setTopicsCollapsed(false);
    });
    search?.addEventListener('input', () => {
      state.searchQuery = search.value.trim();
      if (state.searchQuery) showReview('search');
      else if (state.reviewMode === 'search') closeReview(true);
    });
    document.getElementById('clearSearchBtn')?.addEventListener('click', () => clearSearch(true));

    document.getElementById('answerText')?.addEventListener('input', () => {
      const q = getCurrentQuestion();
      if (!q) return;
      const flags = flagFor(q.id);
      if (document.getElementById('answerText').value.trim()) {
        flags.skipped = false;
        flags.ignored = false;
        saveFlagsAndRefresh();
      }
    });

    document.getElementById('choiceArea')?.addEventListener('change', () => {
      const q = getCurrentQuestion();
      if (!q) return;
      const flags = flagFor(q.id);
      flags.skipped = false;
      flags.ignored = false;
      saveFlagsAndRefresh();
    });

    renderCategoryList();
    updateProgress();
    syncQuestionControls();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancements);
  } else {
    initEnhancements();
  }
})();
