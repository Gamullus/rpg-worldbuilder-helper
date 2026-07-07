// UI behavior for Lore Kobold Answer Seeds.
(function () {
  const SUGGESTED_PREFIX = '[Suggested Answer:';
  const NOTES_MARKER = '[Your Notes]';

  function seedStyles() {
    return Array.isArray(window.SEED_STYLES) ? window.SEED_STYLES : [];
  }

  function seedLabel(styleKey) {
    const style = seedStyles().find(item => item.key === styleKey);
    return style ? style.label : styleKey;
  }

  function currentQuestion() {
    return typeof getCurrentQuestion === 'function' ? getCurrentQuestion() : null;
  }

  function getSeeds(question) {
    return question && window.ANSWER_SEEDS ? window.ANSWER_SEEDS[question.id] : null;
  }

  function getCurrentSeedLabel(text) {
    const value = String(text || '');
    if (!value.startsWith(SUGGESTED_PREFIX)) return '';
    const end = value.indexOf(']');
    if (end === -1) return '';
    return value.slice(SUGGESTED_PREFIX.length, end).trim();
  }

  function extractUserNotes(text) {
    const value = String(text || '').trim();
    const markerIndex = value.indexOf(NOTES_MARKER);
    if (value.startsWith(SUGGESTED_PREFIX) && markerIndex !== -1) {
      return value.slice(markerIndex + NOTES_MARKER.length).trim();
    }
    return value;
  }

  function buildSeededAnswer(styleKey, seedText, currentText) {
    const notes = extractUserNotes(currentText);
    const label = seedLabel(styleKey);
    const suffix = notes ? '\n\n' + notes : '';
    return `[Suggested Answer: ${label}]\n\n${String(seedText).trim()}\n\n${NOTES_MARKER}${suffix}`;
  }

  function applySeed(question, styleKey, seedText) {
    const answerBox = document.getElementById('answerText');
    const existing = answerBox ? answerBox.value : '';
    const answer = ensureAnswer(question.id);
    answer.text = buildSeededAnswer(styleKey, seedText, existing || answer.text || '');

    if (state.questionFlags && state.questionFlags[question.id]) {
      state.questionFlags[question.id].skipped = false;
      state.questionFlags[question.id].ignored = false;
    }

    if (answerBox) answerBox.value = answer.text;
    saveProgress(false);
    if (typeof renderCategoryList === 'function') renderCategoryList();
    if (typeof updateProgress === 'function') updateProgress();
    renderAnswerSeeds();
    if (typeof showNotice === 'function') {
      showNotice(`${seedLabel(styleKey)} seed added. Your own notes stay under [Your Notes].`, '');
    }
  }

  function renderAnswerSeeds() {
    const area = document.getElementById('seedArea');
    if (!area) return;

    const question = currentQuestion();
    const seeds = getSeeds(question);
    area.innerHTML = '';

    if (!question || !seeds) {
      area.hidden = true;
      return;
    }

    area.hidden = false;

    const title = document.createElement('div');
    title.className = 'seed-title';
    title.textContent = 'Lore Kobold Answer Seeds';

    const help = document.createElement('p');
    help.className = 'seed-help';
    help.textContent = 'Pick a starting style. Changing styles replaces the suggested section, but keeps your own notes.';

    const buttons = document.createElement('div');
    buttons.className = 'seed-buttons';

    const answerBox = document.getElementById('answerText');
    const selectedLabel = getCurrentSeedLabel(answerBox ? answerBox.value : ensureAnswer(question.id).text);

    seedStyles().forEach(style => {
      if (!seeds[style.key]) return;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'seed-button';
      button.textContent = style.label;
      if (selectedLabel === style.label) button.classList.add('active-seed');
      button.addEventListener('click', () => applySeed(question, style.key, seeds[style.key]));
      buttons.appendChild(button);
    });

    area.append(title, help, buttons);
  }

  if (typeof renderQuestion === 'function') {
    const previousRenderQuestion = renderQuestion;
    renderQuestion = function seededRenderQuestion(...args) {
      previousRenderQuestion.apply(this, args);
      renderAnswerSeeds();
    };
  }

  function initSeedUi() {
    renderAnswerSeeds();
    document.getElementById('answerText')?.addEventListener('input', renderAnswerSeeds);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSeedUi);
  } else {
    initSeedUi();
  }
})();
