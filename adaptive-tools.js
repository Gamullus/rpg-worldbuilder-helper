// Adaptive Tools: custom follow-up questions, NPC templates, Obsidian export, and searchable tags.
(function () {
  const CUSTOM_PREFIX = 'custom-';
  const SUGGESTION_VERSION = 'adaptive-v1';

  const NPC_QUESTIONS = [
    {
      id: 'notable-npcs-001',
      category: 'Notable NPCs',
      text: 'Create a notable NPC connected to a region. What role do they fill there?',
      type: 'choice-text',
      options: ['Ruler or noble', 'Priest or oracle', 'Merchant or patron', 'Soldier or commander', 'Criminal or spy', 'Scholar or mage', 'Healer or artisan', 'Guide or traveler', 'Monster or outsider', 'Rival', 'Ally', 'Villain', 'Other'],
      tags: ['npc', 'region', 'role']
    },
    {
      id: 'notable-npcs-002',
      category: 'Notable NPCs',
      text: 'Who are the most important NPCs in each major region, and why do people know them?',
      type: 'text',
      options: [],
      tags: ['npc', 'region']
    },
    {
      id: 'notable-npcs-003',
      category: 'Notable NPCs',
      text: 'Which NPCs represent authority, faith, crime, knowledge, trade, war, and ordinary life?',
      type: 'choice-text',
      options: ['Authority', 'Faith', 'Crime', 'Knowledge', 'Trade', 'War', 'Ordinary life', 'Other'],
      tags: ['npc', 'role', 'faction']
    },
    {
      id: 'notable-npcs-004',
      category: 'Notable NPCs',
      text: 'Which NPC can introduce the first major conflict, rumor, quest, or mystery?',
      type: 'text',
      options: [],
      tags: ['npc', 'quest-hook']
    },
    {
      id: 'notable-npcs-005',
      category: 'Notable NPCs',
      text: 'Which NPC secretly knows more than they should?',
      type: 'text',
      options: [],
      tags: ['npc', 'secret']
    }
  ];

  const FOLLOWUP_RULES = [
    {
      key: 'plane',
      terms: ['plane', 'planes', 'realm', 'realms', 'dimension', 'portal', 'gate', 'underworld', 'afterlife'],
      category: 'Geography & Nature',
      question: 'What is the other plane or realm connected to this answer, who lives there, and how can someone reach or leave it?',
      tags: ['plane', 'realm', 'travel']
    },
    {
      key: 'species',
      terms: ['species', 'race', 'races', 'people', 'peoples', 'folk', 'ancestry', 'bloodline', 'clan'],
      category: 'People & Races',
      question: 'What is this people’s homeland, status, culture, and relationship with other peoples?',
      tags: ['species', 'culture']
    },
    {
      key: 'god',
      terms: ['god', 'gods', 'divine', 'temple', 'faith', 'priest', 'oracle', 'cult', 'worship'],
      category: 'Religion',
      question: 'How does this divine power, cult, temple, or religious belief affect daily life and politics?',
      tags: ['religion', 'god', 'temple']
    },
    {
      key: 'npc',
      terms: ['npc', 'leader', 'ruler', 'queen', 'king', 'lord', 'priestess', 'captain', 'mentor', 'villain'],
      category: 'Notable NPCs',
      question: 'Who is the notable NPC connected to this answer, and what do they want?',
      tags: ['npc', 'role']
    },
    {
      key: 'faction',
      terms: ['faction', 'guild', 'order', 'house', 'clan', 'cult', 'league', 'army', 'church'],
      category: 'War & Power',
      question: 'What faction or organization is connected to this answer, and what power do they hold?',
      tags: ['faction', 'power']
    },
    {
      key: 'magic',
      terms: ['magic', 'spell', 'mage', 'wizard', 'ritual', 'artifact', 'relic', 'curse'],
      category: 'Magic',
      question: 'What rule, cost, limit, or danger does this magical idea create?',
      tags: ['magic', 'rule']
    },
    {
      key: 'region',
      terms: ['city', 'region', 'kingdom', 'empire', 'island', 'continent', 'province', 'port', 'capital'],
      category: 'Geography & Nature',
      question: 'What makes this place distinct from the rest of the world, and who controls it?',
      tags: ['region', 'place']
    }
  ];

  function addNpcQuestions() {
    if (typeof QUESTIONS === 'undefined') return;
    NPC_QUESTIONS.forEach(question => {
      if (!QUESTIONS.some(item => item.id === question.id)) QUESTIONS.push(question);
    });
  }

  function customQuestions() {
    if (typeof QUESTIONS === 'undefined') return [];
    return QUESTIONS.filter(q => q && q.isCustom);
  }

  function injectCustomQuestions(list) {
    if (typeof QUESTIONS === 'undefined' || !Array.isArray(list)) return;
    list.forEach(item => {
      if (!item || !item.id || !item.text || !item.category) return;
      if (QUESTIONS.some(q => q.id === item.id)) return;
      QUESTIONS.push({
        id: item.id,
        category: item.category,
        text: item.text,
        type: item.type || 'text',
        options: Array.isArray(item.options) ? item.options : [],
        tags: Array.isArray(item.tags) ? item.tags : [],
        isCustom: true
      });
    });
  }

  function loadCustomQuestionsBeforeApp() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      injectCustomQuestions(data.customQuestions || []);
      state.dismissedSuggestions = data.dismissedSuggestions || {};
    } catch {}
  }

  function getFlags(question) {
    return (state.questionFlags && question && state.questionFlags[question.id]) || {};
  }

  function isIgnored(question) {
    return Boolean(getFlags(question).ignored);
  }

  function isSkipped(question) {
    return Boolean(getFlags(question).skipped);
  }

  function isImportant(question) {
    return Boolean(getFlags(question).important);
  }

  function questionTags(question) {
    const tags = new Set(['worldbuilding']);
    if (question.category) tags.add(slugify(question.category));
    (question.tags || []).forEach(tag => tags.add(slugify(tag)));
    if (question.isCustom) tags.add('custom-question');
    if (isImportant(question)) tags.add('important');
    if (isSkipped(question)) tags.add('skipped');
    if (isIgnored(question)) tags.add('ignored');
    return [...tags].filter(Boolean);
  }

  function slugify(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function titleCase(value) {
    return String(value || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  function escapeMd(value) {
    return String(value || '').replace(/\[/g, '\\[').replace(/\]/g, '\\]');
  }

  function safeFilename(value) {
    return slugify(value || 'worldbuilder-note') || 'worldbuilder-note';
  }

  function answeredText(question) {
    try { return answerAsText(question) || ''; } catch { return ''; }
  }

  function searchCorpus(question) {
    return `${question.category} ${question.text} ${answeredText(question)} ${questionTags(question).join(' ')}`.toLowerCase();
  }

  function ensureAdaptiveArea() {
    let area = document.getElementById('adaptiveArea');
    if (area) return area;
    const seedArea = document.getElementById('seedArea');
    const answerLabel = document.getElementById('answerLabel');
    area = document.createElement('section');
    area.id = 'adaptiveArea';
    area.className = 'adaptive-area';
    area.hidden = true;
    if (seedArea && seedArea.parentNode) seedArea.insertAdjacentElement('afterend', area);
    else if (answerLabel && answerLabel.parentNode) answerLabel.insertAdjacentElement('beforebegin', area);
    return area;
  }

  function suggestionKey(question, rule) {
    return `${SUGGESTION_VERSION}:${question.id}:${rule.key}`;
  }

  function dismissedSuggestions() {
    if (!state.dismissedSuggestions || typeof state.dismissedSuggestions !== 'object') state.dismissedSuggestions = {};
    return state.dismissedSuggestions;
  }

  function activeSuggestions(question) {
    if (!question) return [];
    const answer = answeredText(question).toLowerCase();
    if (answer.trim().length < 12) return [];
    const dismissed = dismissedSuggestions();
    return FOLLOWUP_RULES
      .filter(rule => rule.terms.some(term => answer.includes(term)))
      .filter(rule => !dismissed[suggestionKey(question, rule)])
      .slice(0, 3);
  }

  function getCategoriesSafe() {
    try { return getCategories(); } catch { return ['World Basics']; }
  }

  function addCustomQuestion(category, text, tags) {
    const cleanText = String(text || '').trim();
    const cleanCategory = String(category || 'Custom Questions').trim() || 'Custom Questions';
    if (!cleanText) return false;
    const id = `${CUSTOM_PREFIX}${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
    QUESTIONS.push({
      id,
      category: cleanCategory,
      text: cleanText,
      type: 'text',
      options: [],
      tags: Array.isArray(tags) ? tags : [],
      isCustom: true
    });
    saveProgress(false);
    renderCategoryList();
    updateProgress();
    showNotice('Custom follow-up question added. You can find it under ' + cleanCategory + '.', '');
    return true;
  }

  function dismissSuggestion(question, rule) {
    dismissedSuggestions()[suggestionKey(question, rule)] = true;
    saveProgress(false);
    renderAdaptiveTools();
  }

  function insertNpcTemplate() {
    const q = getCurrentQuestion();
    if (!q) return;
    const answer = ensureAnswer(q.id);
    const role = answer.choice || '';
    const template = `Name:\nSpecies:\nRole: ${role}\nAffiliation:\nRegion:\n\nPublic Face:\nWants:\nSecret / Problem:\nUseful To The Story:\nLinked NPCs / Factions:`;
    const box = document.getElementById('answerText');
    const current = box ? box.value.trim() : answer.text.trim();
    answer.text = current ? `${current}\n\n${template}` : template;
    if (box) box.value = answer.text;
    saveProgress(false);
    renderCategoryList();
    updateProgress();
    showNotice('NPC template inserted.', '');
  }

  function renderNpcHelper(area, question) {
    if (!question || question.category !== 'Notable NPCs') return;
    const block = document.createElement('div');
    block.className = 'adaptive-card npc-template-card';
    block.innerHTML = `
      <div class="adaptive-title">NPC Entry Template</div>
      <p>Name, species, role, and affiliation are the minimum useful fields for Obsidian or session prep.</p>
    `;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Insert NPC Template';
    button.addEventListener('click', insertNpcTemplate);
    block.appendChild(button);
    area.appendChild(block);
  }

  function renderSuggestion(area, question, rule) {
    const block = document.createElement('div');
    block.className = 'adaptive-card followup-card';

    const title = document.createElement('div');
    title.className = 'adaptive-title';
    title.textContent = 'Suggested Follow-up Question';

    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Category';
    const select = document.createElement('select');
    getCategoriesSafe().forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      if (category === rule.category) option.selected = true;
      select.appendChild(option);
    });

    const questionLabel = document.createElement('label');
    questionLabel.textContent = 'Question';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = rule.question;

    const actions = document.createElement('div');
    actions.className = 'adaptive-actions';

    const add = document.createElement('button');
    add.type = 'button';
    add.textContent = 'Add Question';
    add.addEventListener('click', () => {
      if (addCustomQuestion(select.value, input.value, rule.tags)) dismissSuggestion(question, rule);
    });

    const no = document.createElement('button');
    no.type = 'button';
    no.textContent = 'No';
    no.addEventListener('click', () => dismissSuggestion(question, rule));

    actions.append(add, no);
    block.append(title, categoryLabel, select, questionLabel, input, actions);
    area.appendChild(block);
  }

  function renderAdaptiveTools() {
    const area = ensureAdaptiveArea();
    const q = typeof getCurrentQuestion === 'function' ? getCurrentQuestion() : null;
    if (!area || !q) return;

    area.innerHTML = '';
    renderNpcHelper(area, q);
    activeSuggestions(q).forEach(rule => renderSuggestion(area, q, rule));
    area.hidden = area.children.length === 0;
  }

  function markdownForQuestion(question, includeWorldHeader = false) {
    const world = state.worldName || 'Unnamed World';
    const tags = questionTags(question);
    const body = answeredText(question) || 'Not answered yet.';
    const frontmatter = [
      '---',
      `world: "${world.replace(/"/g, '\\"')}"`,
      `category: "${question.category.replace(/"/g, '\\"')}"`,
      `question: "${question.text.replace(/"/g, '\\"')}"`,
      'tags:',
      ...tags.map(tag => `  - ${tag}`),
      '---',
      ''
    ].join('\n');

    const links = `[[${escapeMd(world)}]] | [[${escapeMd(question.category)}]]`;
    const heading = includeWorldHeader ? `# [[${escapeMd(world)}]]\n\n` : '';
    return `${frontmatter}${heading}## ${escapeMd(question.text)}\n\n${links}\n\n${tags.map(tag => '#' + tag).join(' ')}\n\n${body}\n`;
  }

  function exportCurrentObsidianNote() {
    const q = getCurrentQuestion();
    if (!q) return;
    const world = state.worldName || 'worldbuilder';
    const filename = `${safeFilename(world)}-${safeFilename(q.category)}-${safeFilename(q.text).slice(0, 42)}.md`;
    downloadBlob(new Blob([markdownForQuestion(q)], { type: 'text/markdown' }), filename);
    showNotice('Current question exported as an Obsidian markdown note.', '');
  }

  function exportObsidianVaultNote() {
    const world = state.worldName || 'Unnamed World';
    const answered = QUESTIONS.filter(q => !isIgnored(q) && answeredText(q).trim());
    if (!answered.length) {
      showNotice('No answered active questions to export to Obsidian yet.', 'warning');
      return;
    }

    const categories = [...new Set(answered.map(q => q.category))];
    const lines = [
      '---',
      `world: "${world.replace(/"/g, '\\"')}"`,
      'source: "RPG Worldbuilder Helper"',
      'tags:',
      '  - worldbuilding',
      '  - rpg-worldbuilder',
      '---',
      '',
      `# [[${escapeMd(world)}]]`,
      '',
      '> Exported from RPG Worldbuilder Helper. This is a single Obsidian-ready lore note.',
      '',
      '## Index',
      ...categories.map(category => `- [[${escapeMd(category)}]]`),
      ''
    ];

    categories.forEach(category => {
      lines.push(`## [[${escapeMd(category)}]]`, '');
      answered.filter(q => q.category === category).forEach(q => {
        lines.push(`### ${escapeMd(q.text)}`);
        lines.push(questionTags(q).map(tag => '#' + tag).join(' '));
        lines.push('');
        lines.push(answeredText(q));
        lines.push('');
      });
    });

    downloadBlob(new Blob([lines.join('\n')], { type: 'text/markdown' }), `${safeFilename(world)}-obsidian-world-notes.md`);
    showNotice('Obsidian markdown export started.', '');
  }

  function addObsidianButtons() {
    const toolbar = document.querySelector('.toolbar');
    const importJson = document.getElementById('importJsonBtn');
    if (toolbar && importJson && !document.getElementById('exportObsidianBtn')) {
      const button = document.createElement('button');
      button.id = 'exportObsidianBtn';
      button.type = 'button';
      button.textContent = 'Export Obsidian MD';
      button.addEventListener('click', exportObsidianVaultNote);
      toolbar.insertBefore(button, importJson);
    }

    const middle = document.querySelector('.question-actions-middle');
    if (middle && !document.getElementById('exportCurrentObsidianBtn')) {
      const button = document.createElement('button');
      button.id = 'exportCurrentObsidianBtn';
      button.type = 'button';
      button.textContent = 'Obsidian Note';
      button.addEventListener('click', exportCurrentObsidianNote);
      middle.appendChild(button);
    }
  }

  function matchesSearch(question, query) {
    const terms = String(query || '').toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return false;
    const corpus = searchCorpus(question);
    return terms.every(term => corpus.includes(term.replace(/^#/, '')));
  }

  if (typeof renderReview === 'function') {
    renderReview = function adaptiveRenderReview(mode) {
      els.reviewContent.innerHTML = '';
      let any = false;
      const query = (state.searchQuery || '').trim();

      getCategories().forEach(category => {
        const filtered = questionsInCategory(category).filter(q => {
          if (mode === 'answered') return !isIgnored(q) && answeredText(q).trim();
          if (mode === 'unanswered') return !isIgnored(q) && !answeredText(q).trim();
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
          if (answeredText(q).trim()) statuses.push('Answered'); else statuses.push('Unanswered');
          if (isImportant(q)) statuses.push('★ Important');
          if (isSkipped(q)) statuses.push('Skipped');
          if (isIgnored(q)) statuses.push('Ignored');
          status.textContent = statuses.join(' • ');

          const tagLine = document.createElement('div');
          tagLine.className = 'review-tags';
          tagLine.textContent = questionTags(q).map(tag => '#' + tag).join(' ');

          const answer = document.createElement('div');
          answer.className = 'review-answer';
          answer.textContent = answeredText(q).trim() ? answeredText(q) : 'Not answered yet.';

          const edit = document.createElement('button');
          edit.textContent = 'Go to question';
          edit.addEventListener('click', () => {
            state.selectedCategory = q.category;
            state.currentIndex = questionsInCategory(q.category).findIndex(item => item.id === q.id);
            renderCategoryList();
            closeReview(true);
            renderAdaptiveTools();
          });

          item.append(question, status, tagLine, answer, edit);
          section.appendChild(item);
        });
        els.reviewContent.appendChild(section);
      });

      if (!any) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = mode === 'search' ? 'No questions matched that search or tag.' : 'Nothing to show here.';
        els.reviewContent.appendChild(empty);
      }
    };
  }

  if (typeof getSavePayload === 'function') {
    const previousGetSavePayload = getSavePayload;
    getSavePayload = function adaptiveGetSavePayload() {
      const payload = previousGetSavePayload();
      payload.customQuestions = customQuestions().map(q => ({
        id: q.id,
        category: q.category,
        text: q.text,
        type: q.type || 'text',
        options: q.options || [],
        tags: q.tags || [],
        isCustom: true
      }));
      payload.dismissedSuggestions = state.dismissedSuggestions || {};
      return payload;
    };
  }

  if (typeof applySavePayload === 'function') {
    const previousApplySavePayload = applySavePayload;
    applySavePayload = function adaptiveApplySavePayload(data) {
      injectCustomQuestions(data && data.customQuestions);
      state.dismissedSuggestions = (data && data.dismissedSuggestions) || {};
      previousApplySavePayload(data);
    };
  }

  if (typeof renderQuestion === 'function') {
    const previousRenderQuestion = renderQuestion;
    renderQuestion = function adaptiveRenderQuestion(...args) {
      previousRenderQuestion.apply(this, args);
      renderAdaptiveTools();
    };
  }

  function initAdaptiveTools() {
    addObsidianButtons();
    renderAdaptiveTools();
    document.getElementById('answerText')?.addEventListener('input', renderAdaptiveTools);
    document.getElementById('choiceArea')?.addEventListener('change', renderAdaptiveTools);
  }

  addNpcQuestions();
  loadCustomQuestionsBeforeApp();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdaptiveTools);
  } else {
    initAdaptiveTools();
  }
})();
