// Villain Builder: repeatable villain profiles with their own question categories and Obsidian export.
(function () {
  const BASE_CATEGORY = 'Villains';
  const CATEGORY_PREFIX = 'Villains / ';
  const INTRO_ID = 'villains-intro-001';

  const INTRO_QUESTION = {
    id: INTRO_ID,
    category: BASE_CATEGORY,
    text: 'Create a villain profile. Each villain gets their own repeatable question set under Villains / Name.',
    type: 'text',
    options: [],
    tags: ['villain', 'npc', 'profile']
  };

  const VILLAIN_QUESTION_SET = [
    {
      key: 'name-title',
      text: 'What is the villain’s name, title, or the name people know them by?',
      type: 'text',
      options: [],
      tags: ['villain', 'name', 'title'],
      template: 'Name:\nTitle:\nAlso Known As:\nRegion / Faction:'
    },
    {
      key: 'core-trope',
      text: 'If the world revolved only around this character’s story, what would their central trope be? Some villains are built around old, powerful character patterns: becoming the very thing they once sought to destroy; destroying the very thing they once wanted to become; being haunted by the death of a person or a traumatic event that happened before the story even began; mistaking grief for justice; mistaking control for safety; or turning an old wound into a worldview. What is the emotional or narrative trope at the heart of this villain?',
      type: 'text',
      options: [],
      tags: ['villain', 'trope', 'backstory'],
      template: 'Core Trope:\nWhat They Wanted To Be:\nWhat They Became Instead:\nOld Wound / Defining Event:\nHow This Shapes Their Story:'
    },
    {
      key: 'goal',
      text: 'What is the villain’s goal? This is probably the most important question. Their goal does not have to be “take over the world.” It can be simple, personal, political, spiritual, monstrous, or impossible. A good villain goal can be easy to understand but hard to stop. It may take one night, one war, or centuries to complete. Choose or describe the goal they are actively working toward.',
      type: 'choice-text',
      options: [
        'Get revenge',
        'Steal an item',
        'Kill a specific NPC or PC',
        'Become the boss of a company, guild, cult, house, or faction',
        'Become wealthy',
        'Raise an army to conquer an area',
        'Destroy a particular species, people, culture, or bloodline',
        'Enslave or control a particular species, people, culture, or bloodline',
        'Start a rebellion against an existing power',
        'Build or steal an artifact',
        'Become king, queen, emperor, guildmaster, high priest, or equivalent',
        'Take over one or more empires',
        'Raise a dead, sleeping, banished, or forgotten god',
        'Become a deity, lich, immortal, or something beyond mortal life',
        'Destroy the world',
        'Remake the world',
        'Other'
      ],
      tags: ['villain', 'goal'],
      template: 'Goal:\nScale: Personal / Local / Regional / Global / Cosmic\nWho Benefits:\nWho Suffers:\nWhat They Need:\nWhat Happens If They Win:'
    },
    {
      key: 'motivation',
      text: 'What is the villain’s motivation? A better way to ask this might be: what makes this person the villain? What caused them to cross the line? Their motivation may come from betrayal, disenfranchisement, trauma, envy, greed, ideology, fear, love, grief, ambition, divine command, survival, or the belief that no one else is willing to do what must be done. What emotional force keeps them moving even when the cost becomes monstrous?',
      type: 'choice-text',
      options: [
        'Betrayal',
        'Disenfranchisement',
        'Trauma',
        'Envy / Greed',
        'Fear',
        'Grief',
        'Ideology',
        'Love twisted into control',
        'Divine command',
        'Survival',
        'Ambition',
        'Curiosity without ethics',
        'Desire for order',
        'Desire for freedom',
        'Other'
      ],
      tags: ['villain', 'motivation'],
      template: 'Motivation:\nOriginal Wound:\nWhat They Tell Themselves:\nWhat They Refuse To Admit:\nWho They Blame:'
    },
    {
      key: 'self-image',
      text: 'Do they see themselves as the villain? Do they believe they are evil, necessary, misunderstood, chosen, heroic, practical, or beyond morality? Are they ashamed of what they do, proud of it, or convinced that history will prove them right?',
      type: 'choice-text',
      options: [
        'Yes, and they accept it',
        'No, they believe they are the hero',
        'No, they believe they are necessary',
        'They know they are wrong but continue anyway',
        'They think morality is weakness',
        'They think history will vindicate them',
        'They avoid thinking about it',
        'It changes over time'
      ],
      tags: ['villain', 'self-image'],
      template: 'Self-Image:\nHow They Justify Themselves:\nWhat Would Make Them Doubt:\nWhat They Cannot Forgive Themselves For:'
    },
    {
      key: 'better-way',
      text: 'If there was a better way to achieve their goal, would they use it? This question reveals whether the villain is tragic, pragmatic, hypocritical, fanatical, or simply cruel. Some villains would stop if shown another path. Others need their method to be violent because the suffering is part of the point.',
      type: 'choice-text',
      options: [
        'Yes, immediately',
        'Yes, but they no longer believe such a way exists',
        'Maybe, if it protected their pride',
        'Maybe, if someone they trusted showed them',
        'No, the suffering is part of the point',
        'No, they are too far gone',
        'No, because the method matters more than the goal',
        'They once would have, but not anymore'
      ],
      tags: ['villain', 'redemption', 'method'],
      template: 'Would They Use A Better Way:\nWhy / Why Not:\nWho Could Still Reach Them:\nWhat Line Have They Already Crossed:'
    },
    {
      key: 'resources',
      text: 'What power, resources, followers, magic, money, army, secrets, or social position does the villain have? This question is about what the villain can actually use to act on their goal. A villain with no resources is just angry. A villain with followers, money, political cover, magic, blackmail, armies, divine favor, or old secrets becomes dangerous.',
      type: 'choice-text',
      options: [
        'Political influence',
        'Religious authority',
        'Military force',
        'Wealth',
        'Criminal network',
        'Forbidden magic',
        'Ancient knowledge',
        'Divine favor',
        'Monster allies',
        'Blackmail',
        'Public popularity',
        'Hidden identity',
        'Other'
      ],
      tags: ['villain', 'resources', 'power'],
      template: 'Resources:\n\nFollowers:\n\nPolitical Power:\n\nMagical Power:\n\nMoney / Wealth:\n\nArmy / Muscle:\n\nSecrets:\n\nSocial Position:\n\nWeakness In Their Power Base:'
    },
    {
      key: 'methods',
      text: 'What methods does the villain use, and what methods do they refuse to use?',
      type: 'text',
      options: [],
      tags: ['villain', 'methods'],
      template: 'Preferred Methods:\nLines They Will Not Cross:\nLines They Already Crossed:\nPublic Method:\nSecret Method:'
    },
    {
      key: 'world-connection',
      text: 'How does this villain connect to the world’s larger history, factions, gods, regions, wars, or old wounds?',
      type: 'text',
      options: [],
      tags: ['villain', 'world-connection'],
      template: 'Connected Region:\nConnected Faction:\nConnected Historical Event:\nConnected Divine / Magical Force:\nWhy They Matter To The Setting:'
    },
    {
      key: 'first-sign',
      text: 'What is the first sign the players, reader, or world notices before meeting the villain directly?',
      type: 'text',
      options: [],
      tags: ['villain', 'foreshadowing', 'hook'],
      template: 'First Sign:\nRumor:\nVictim / Survivor:\nSymbol:\nEarly Consequence:'
    }
  ];

  function slugify(value) {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'villain';
  }

  function escapeMd(value) {
    return String(value || '').replace(/\[/g, '\\[').replace(/\]/g, '\\]');
  }

  function safeFilename(value) {
    return slugify(value || 'villain-note') || 'villain-note';
  }

  function profiles() {
    if (!state.villainProfiles || !Array.isArray(state.villainProfiles)) state.villainProfiles = [];
    return state.villainProfiles;
  }

  function normalizeProfiles(input) {
    if (!Array.isArray(input)) return [];
    return input
      .filter(item => item && item.id && item.name)
      .map(item => ({
        id: String(item.id),
        name: String(item.name),
        category: String(item.category || `${CATEGORY_PREFIX}${item.name}`)
      }));
  }

  function ensureIntroQuestion() {
    if (typeof QUESTIONS === 'undefined') return;
    if (!QUESTIONS.some(question => question.id === INTRO_ID)) QUESTIONS.push(INTRO_QUESTION);
  }

  function questionsForProfile(profile) {
    return VILLAIN_QUESTION_SET.map((base, index) => ({
      id: `villain-${profile.id}-${base.key}`,
      category: profile.category,
      text: base.text,
      type: base.type,
      options: base.options || [],
      tags: [...(base.tags || []), 'villain-profile', slugify(profile.name)],
      isVillainQuestion: true,
      villainId: profile.id,
      villainName: profile.name,
      villainTemplate: base.template || '',
      villainOrder: index + 1
    }));
  }

  function injectVillainQuestions() {
    if (typeof QUESTIONS === 'undefined') return;
    ensureIntroQuestion();
    profiles().forEach(profile => {
      questionsForProfile(profile).forEach(question => {
        if (!QUESTIONS.some(item => item.id === question.id)) QUESTIONS.push(question);
      });
    });
  }

  function loadProfilesBeforeApp() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      state.villainProfiles = normalizeProfiles(data.villainProfiles || []);
    } catch {}
  }

  function currentProfile() {
    const q = typeof getCurrentQuestion === 'function' ? getCurrentQuestion() : null;
    if (!q || !q.category || !q.category.startsWith(CATEGORY_PREFIX)) return null;
    return profiles().find(profile => profile.category === q.category) || {
      id: slugify(q.category.replace(CATEGORY_PREFIX, '')),
      name: q.category.replace(CATEGORY_PREFIX, ''),
      category: q.category
    };
  }

  function ensureVillainArea() {
    let area = document.getElementById('villainArea');
    if (area) return area;
    const adaptive = document.getElementById('adaptiveArea');
    const answerLabel = document.getElementById('answerLabel');
    area = document.createElement('section');
    area.id = 'villainArea';
    area.className = 'villain-area';
    area.hidden = true;
    if (adaptive && adaptive.parentNode) adaptive.insertAdjacentElement('afterend', area);
    else if (answerLabel && answerLabel.parentNode) answerLabel.insertAdjacentElement('beforebegin', area);
    return area;
  }

  function showCreateVillainModal() {
    const name = prompt('Villain name or title?');
    if (!name || !name.trim()) return;
    createVillain(name.trim());
  }

  function uniqueProfileId(name) {
    const base = slugify(name);
    let id = base;
    let counter = 2;
    while (profiles().some(profile => profile.id === id)) {
      id = `${base}-${counter}`;
      counter += 1;
    }
    return id;
  }

  function createVillain(name) {
    const profile = {
      id: uniqueProfileId(name),
      name,
      category: `${CATEGORY_PREFIX}${name}`
    };
    profiles().push(profile);
    questionsForProfile(profile).forEach(question => QUESTIONS.push(question));

    const firstQuestion = QUESTIONS.find(question => question.id === `villain-${profile.id}-name-title`);
    if (firstQuestion && typeof ensureAnswer === 'function') {
      ensureAnswer(firstQuestion.id).text = `Name: ${name}\nTitle:\nAlso Known As:\nRegion / Faction:`;
    }

    state.selectedCategory = profile.category;
    state.currentIndex = 0;
    if (typeof closeReview === 'function') closeReview(false);
    if (typeof saveProgress === 'function') saveProgress(false);
    if (typeof renderCategoryList === 'function') renderCategoryList();
    if (typeof renderQuestion === 'function') renderQuestion('next');
    if (typeof updateProgress === 'function') updateProgress();
    if (typeof showNotice === 'function') showNotice(`${name} created under Villains.`, '');
  }

  function insertVillainTemplate(question) {
    if (!question || !question.villainTemplate) return;
    const answer = ensureAnswer(question.id);
    const box = document.getElementById('answerText');
    const current = box ? box.value.trim() : answer.text.trim();
    const template = question.villainTemplate;
    answer.text = current ? `${current}\n\n${template}` : template;
    if (box) box.value = answer.text;
    saveProgress(false);
    renderCategoryList();
    updateProgress();
    showNotice('Villain template inserted.', '');
  }

  function answeredText(question) {
    try { return answerAsText(question) || ''; } catch { return ''; }
  }

  function markdownForProfile(profile) {
    const world = state.worldName || 'Unnamed World';
    const questions = questionsInCategory(profile.category);
    const lines = [
      '---',
      'type: villain',
      `world: "${world.replace(/"/g, '\\"')}"`,
      `villain: "${profile.name.replace(/"/g, '\\"')}"`,
      'tags:',
      '  - villain',
      '  - worldbuilding',
      '  - npc',
      '---',
      '',
      `# [[${escapeMd(profile.name)}]]`,
      '',
      `[[${escapeMd(world)}]] | [[Villains]]`,
      ''
    ];

    questions.forEach(question => {
      lines.push(`## ${escapeMd(question.text)}`, '');
      lines.push(answeredText(question) || 'Not answered yet.');
      lines.push('');
    });

    return lines.join('\n');
  }

  function exportCurrentVillainToObsidian() {
    const profile = currentProfile();
    if (!profile) {
      showNotice('Open a specific villain first, then export that villain.', 'warning');
      return;
    }
    const filename = `${safeFilename(state.worldName || 'world')}-${safeFilename(profile.name)}-villain.md`;
    downloadBlob(new Blob([markdownForProfile(profile)], { type: 'text/markdown' }), filename);
    showNotice(`${profile.name} exported as an Obsidian markdown note.`, '');
  }

  function renderVillainTools() {
    const area = ensureVillainArea();
    const q = typeof getCurrentQuestion === 'function' ? getCurrentQuestion() : null;
    if (!area || !q) return;
    area.innerHTML = '';

    const isVillainBase = q.category === BASE_CATEGORY;
    const profile = currentProfile();

    if (!isVillainBase && !profile) {
      area.hidden = true;
      return;
    }

    const card = document.createElement('div');
    card.className = 'villain-card';

    const title = document.createElement('div');
    title.className = 'villain-title';
    title.textContent = profile ? `Villain Profile: ${profile.name}` : 'Villain Builder';

    const text = document.createElement('p');
    text.textContent = profile
      ? 'This category belongs to one villain. Use the same question set again by adding another villain.'
      : 'Create a villain. The name or title becomes its own Villains / Name category.';

    const actions = document.createElement('div');
    actions.className = 'villain-actions';

    const add = document.createElement('button');
    add.type = 'button';
    add.textContent = profile ? 'Add Another Villain' : 'Add Villain';
    add.addEventListener('click', showCreateVillainModal);
    actions.appendChild(add);

    if (profile) {
      const exportBtn = document.createElement('button');
      exportBtn.type = 'button';
      exportBtn.textContent = 'Export This Villain to Obsidian';
      exportBtn.addEventListener('click', exportCurrentVillainToObsidian);
      actions.appendChild(exportBtn);
    }

    if (q.isVillainQuestion && q.villainTemplate) {
      const template = document.createElement('button');
      template.type = 'button';
      template.textContent = 'Insert Villain Template';
      template.addEventListener('click', () => insertVillainTemplate(q));
      actions.appendChild(template);
    }

    card.append(title, text, actions);
    area.appendChild(card);
    area.hidden = false;
  }

  function addToolbarButton() {
    const toolbar = document.querySelector('.toolbar');
    const addQuestion = document.getElementById('addQuestionBtn') || document.getElementById('saveBtn');
    if (!toolbar || document.getElementById('addVillainBtn')) return;

    const button = document.createElement('button');
    button.id = 'addVillainBtn';
    button.type = 'button';
    button.textContent = 'Add Villain';
    button.addEventListener('click', showCreateVillainModal);

    if (addQuestion && addQuestion.nextSibling) toolbar.insertBefore(button, addQuestion.nextSibling);
    else toolbar.appendChild(button);
  }

  if (typeof getSavePayload === 'function') {
    const previousGetSavePayload = getSavePayload;
    getSavePayload = function villainGetSavePayload() {
      const payload = previousGetSavePayload();
      payload.villainProfiles = normalizeProfiles(profiles());
      return payload;
    };
  }

  if (typeof applySavePayload === 'function') {
    const previousApplySavePayload = applySavePayload;
    applySavePayload = function villainApplySavePayload(data) {
      state.villainProfiles = normalizeProfiles(data && data.villainProfiles);
      injectVillainQuestions();
      previousApplySavePayload(data);
      state.villainProfiles = normalizeProfiles(data && data.villainProfiles);
      injectVillainQuestions();
    };
  }

  if (typeof renderQuestion === 'function') {
    const previousRenderQuestion = renderQuestion;
    renderQuestion = function villainRenderQuestion(...args) {
      previousRenderQuestion.apply(this, args);
      renderVillainTools();
    };
  }

  function initVillainBuilder() {
    addToolbarButton();
    renderVillainTools();
    document.getElementById('answerText')?.addEventListener('input', renderVillainTools);
  }

  loadProfilesBeforeApp();
  injectVillainQuestions();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVillainBuilder);
  } else {
    initVillainBuilder();
  }
})();
