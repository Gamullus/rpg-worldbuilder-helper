// Manual custom question creator.
(function () {
  function slugify(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function getCategoriesSafe() {
    try { return getCategories(); } catch { return ['World Basics']; }
  }

  function ensureModal() {
    let modal = document.getElementById('manualQuestionModal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'manualQuestionModal';
    modal.className = 'manual-question-modal';
    modal.hidden = true;
    modal.innerHTML = `
      <div class="manual-question-card parchment-card" role="dialog" aria-modal="true" aria-labelledby="manualQuestionTitle">
        <div class="manual-question-header">
          <div>
            <p class="eyebrow">Lore Kobold Custom Question</p>
            <h2 id="manualQuestionTitle">Add a Question</h2>
          </div>
          <button id="manualQuestionCloseBtn" type="button" aria-label="Close add question window">×</button>
        </div>

        <label for="manualQuestionCategory">Category</label>
        <select id="manualQuestionCategory"></select>

        <label for="manualQuestionNewCategory">Or create new category</label>
        <input id="manualQuestionNewCategory" type="text" placeholder="Example: Planes, Cities, NPCs, Factions..." />

        <label for="manualQuestionText">Question</label>
        <textarea id="manualQuestionText" rows="4" placeholder="Write the question you want to add..."></textarea>

        <label for="manualQuestionType">Question type</label>
        <select id="manualQuestionType">
          <option value="text">Text answer</option>
          <option value="choice-text">Multiple choice + notes</option>
        </select>

        <div id="manualQuestionOptionsWrap" hidden>
          <label for="manualQuestionOptions">Choices</label>
          <input id="manualQuestionOptions" type="text" placeholder="Separate choices with semicolons. Example: Ally; Rival; Villain; Other" />

          <label for="manualQuestionInitialChoice">Answer choice now</label>
          <select id="manualQuestionInitialChoice">
            <option value="">No choice selected</option>
          </select>
        </div>

        <label for="manualQuestionTags">Search tags</label>
        <input id="manualQuestionTags" type="text" placeholder="Separate tags with commas. Example: plane, npc, faction" />

        <div class="manual-question-answer-block">
          <label for="manualQuestionAnswer">Answer now</label>
          <p class="manual-question-hint">Optional. If you answer here, the new question is saved as answered immediately.</p>
          <textarea id="manualQuestionAnswer" rows="7" placeholder="Write the answer now, or leave blank and answer it later..."></textarea>
        </div>

        <div class="manual-question-actions">
          <button id="manualQuestionAddBtn" type="button" class="primary">Add Question</button>
          <button id="manualQuestionNoBtn" type="button">No</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.addEventListener('click', (event) => {
      if (event.target === modal) closeManualQuestionModal();
    });
    modal.querySelector('#manualQuestionCloseBtn')?.addEventListener('click', closeManualQuestionModal);
    modal.querySelector('#manualQuestionNoBtn')?.addEventListener('click', closeManualQuestionModal);
    modal.querySelector('#manualQuestionAddBtn')?.addEventListener('click', addManualQuestion);
    modal.querySelector('#manualQuestionType')?.addEventListener('change', syncManualQuestionType);
    modal.querySelector('#manualQuestionOptions')?.addEventListener('input', syncManualChoiceOptions);

    return modal;
  }

  function fillCategorySelect() {
    const select = document.getElementById('manualQuestionCategory');
    if (!select) return;
    const current = typeof state !== 'undefined' && state.selectedCategory ? state.selectedCategory : '';
    select.innerHTML = '';
    getCategoriesSafe().forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      if (category === current) option.selected = true;
      select.appendChild(option);
    });
  }

  function getManualOptions() {
    const optionText = document.getElementById('manualQuestionOptions')?.value || '';
    return optionText.split(';').map(item => item.trim()).filter(Boolean);
  }

  function syncManualChoiceOptions() {
    const select = document.getElementById('manualQuestionInitialChoice');
    if (!select) return;
    const previous = select.value;
    select.innerHTML = '<option value="">No choice selected</option>';
    getManualOptions().forEach(optionText => {
      const option = document.createElement('option');
      option.value = optionText;
      option.textContent = optionText;
      if (optionText === previous) option.selected = true;
      select.appendChild(option);
    });
  }

  function syncManualQuestionType() {
    const type = document.getElementById('manualQuestionType')?.value || 'text';
    const wrap = document.getElementById('manualQuestionOptionsWrap');
    if (wrap) wrap.hidden = type !== 'choice-text';
    syncManualChoiceOptions();
  }

  function openManualQuestionModal() {
    const modal = ensureModal();
    fillCategorySelect();
    syncManualQuestionType();
    modal.hidden = false;
    document.body.classList.add('modal-open');
    setTimeout(() => document.getElementById('manualQuestionText')?.focus(), 0);
  }

  function closeManualQuestionModal() {
    const modal = document.getElementById('manualQuestionModal');
    if (modal) modal.hidden = true;
    document.body.classList.remove('modal-open');
  }

  function clearManualQuestionForm() {
    const fields = [
      'manualQuestionNewCategory',
      'manualQuestionText',
      'manualQuestionOptions',
      'manualQuestionTags',
      'manualQuestionAnswer'
    ];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const type = document.getElementById('manualQuestionType');
    if (type) type.value = 'text';
    syncManualQuestionType();
  }

  function addManualQuestion() {
    if (typeof QUESTIONS === 'undefined') return;

    const categorySelect = document.getElementById('manualQuestionCategory');
    const newCategory = document.getElementById('manualQuestionNewCategory')?.value.trim();
    const questionText = document.getElementById('manualQuestionText')?.value.trim();
    const type = document.getElementById('manualQuestionType')?.value || 'text';
    const tagText = document.getElementById('manualQuestionTags')?.value || '';
    const answerText = document.getElementById('manualQuestionAnswer')?.value.trim() || '';
    const selectedChoice = document.getElementById('manualQuestionInitialChoice')?.value || '';

    const category = newCategory || categorySelect?.value || 'Custom Questions';
    if (!questionText) {
      if (typeof showNotice === 'function') showNotice('Write the question first, then add it.', 'warning');
      return;
    }

    const options = type === 'choice-text' ? getManualOptions() : [];
    const cleanType = type === 'choice-text' && options.length ? 'choice-text' : 'text';
    const tags = tagText.split(',').map(item => slugify(item)).filter(Boolean);

    const question = {
      id: `custom-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
      category,
      text: questionText,
      type: cleanType,
      options,
      tags,
      isCustom: true
    };

    QUESTIONS.push(question);

    const hasAnswer = answerText || (cleanType === 'choice-text' && selectedChoice);
    if (hasAnswer && typeof ensureAnswer === 'function') {
      const answer = ensureAnswer(question.id);
      answer.text = answerText;
      answer.choice = cleanType === 'choice-text' ? selectedChoice : '';
    }

    state.selectedCategory = category;
    state.currentIndex = questionsInCategory(category).findIndex(item => item.id === question.id);

    if (typeof closeReview === 'function') closeReview(false);
    if (typeof saveProgress === 'function') saveProgress(false);
    if (typeof renderCategoryList === 'function') renderCategoryList();
    if (typeof renderQuestion === 'function') renderQuestion('next');
    if (typeof updateProgress === 'function') updateProgress();
    if (typeof showNotice === 'function') {
      showNotice(hasAnswer ? 'Custom question added and answered.' : 'Custom question added. The Lore Kobold has opened it now.', '');
    }

    clearManualQuestionForm();
    closeManualQuestionModal();
  }

  function addToolbarButton() {
    const toolbar = document.querySelector('.toolbar');
    const exportBtn = document.getElementById('exportBtn');
    if (!toolbar || document.getElementById('addQuestionBtn')) return;

    const button = document.createElement('button');
    button.id = 'addQuestionBtn';
    button.type = 'button';
    button.textContent = 'Add Question';
    button.addEventListener('click', openManualQuestionModal);

    if (exportBtn) toolbar.insertBefore(button, exportBtn);
    else toolbar.appendChild(button);
  }

  function initManualQuestionCreator() {
    addToolbarButton();
    ensureModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initManualQuestionCreator);
  } else {
    initManualQuestionCreator();
  }
})();
