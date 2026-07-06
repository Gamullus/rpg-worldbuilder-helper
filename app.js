const APP_VERSION = '1.0.0';
const STORAGE_KEY = 'rpg-worldbuilder-helper-save-v1';
const PDF_DATA_START = 'RPG_WORLD_BUILDER_DATA_START';
const PDF_DATA_END = 'RPG_WORLD_BUILDER_DATA_END';
const MASCOT_IMAGE = 'lore-kobold-icon.png';

const state = {
  worldName: '',
  answers: {},
  selectedCategory: null,
  currentIndex: 0,
  reviewMode: null,
};

const els = {};

window.addEventListener('DOMContentLoaded', () => {
  bindElements();
  els.mascotImage.src = MASCOT_IMAGE;
  loadProgress({ silent: true });
  if (!state.selectedCategory) state.selectedCategory = getCategories()[0];
  bindEvents();
  renderAll();
  showNotice('The Lore Kobold is ready. Create a new world, continue your local save, or import a previous JSON/PDF.', '');
});

function bindElements() {
  const ids = [
    'mascotImage','newWorldBtn','saveBtn','exportBtn','importJsonBtn','importPdfBtn','answeredBtn','unansweredBtn','allQuestionsBtn',
    'jsonInput','pdfInput','notice','worldNameInput','worldNameLine','overallBar','overallText','categoryList',
    'welcomeView','questionView','reviewView','categoryPill','questionCounter','questionPage','questionText','choiceArea',
    'answerLabel','answerText','prevBtn','clearAnswerBtn','nextBtn','reviewTitle','closeReviewBtn','reviewContent'
  ];
  ids.forEach(id => { els[id] = document.getElementById(id); });
}

function bindEvents() {
  els.newWorldBtn.addEventListener('click', createNewWorld);
  els.saveBtn.addEventListener('click', () => saveProgress(true));
  els.exportBtn.addEventListener('click', exportBoth);
  els.importJsonBtn.addEventListener('click', () => els.jsonInput.click());
  els.importPdfBtn.addEventListener('click', () => els.pdfInput.click());
  els.answeredBtn.addEventListener('click', () => showReview('answered'));
  els.unansweredBtn.addEventListener('click', () => showReview('unanswered'));
  els.allQuestionsBtn.addEventListener('click', () => showReview('all'));
  els.closeReviewBtn.addEventListener('click', closeReview);
  els.prevBtn.addEventListener('click', previousQuestion);
  els.nextBtn.addEventListener('click', nextQuestion);
  els.clearAnswerBtn.addEventListener('click', clearCurrentAnswer);
  els.worldNameInput.addEventListener('input', () => {
    state.worldName = els.worldNameInput.value.trim();
    saveProgress(false);
    updateProgress();
  });
  els.answerText.addEventListener('input', () => {
    const q = getCurrentQuestion();
    if (!q) return;
    ensureAnswer(q.id).text = els.answerText.value;
    saveProgress(false);
    renderCategoryList();
    updateProgress();
  });
  els.jsonInput.addEventListener('change', importJsonFile);
  els.pdfInput.addEventListener('change', importPdfFile);
}

function getCategories() {
  return [...new Set(QUESTIONS.map(q => q.category))];
}

function questionsInCategory(category = state.selectedCategory) {
  return QUESTIONS.filter(q => q.category === category);
}

function getCurrentQuestion() {
  const list = questionsInCategory();
  if (!list.length) return null;
  if (state.currentIndex < 0) state.currentIndex = 0;
  if (state.currentIndex >= list.length) state.currentIndex = list.length - 1;
  return list[state.currentIndex];
}

function ensureAnswer(id) {
  if (!state.answers[id]) state.answers[id] = { choice: '', text: '' };
  if (typeof state.answers[id] === 'string') state.answers[id] = { choice: '', text: state.answers[id] };
  if (!('choice' in state.answers[id])) state.answers[id].choice = '';
  if (!('text' in state.answers[id])) state.answers[id].text = '';
  return state.answers[id];
}

function isAnswered(question) {
  const answer = state.answers[question.id];
  if (!answer) return false;
  if (typeof answer === 'string') return answer.trim().length > 0;
  return String(answer.choice || '').trim().length > 0 || String(answer.text || '').trim().length > 0;
}

function answerAsText(question) {
  const answer = state.answers[question.id];
  if (!answer) return '';
  if (typeof answer === 'string') return answer.trim();
  const pieces = [];
  if (answer.choice) pieces.push(`Choice: ${answer.choice}`);
  if (answer.text) pieces.push(answer.text.trim());
  return pieces.join('\n').trim();
}

function createNewWorld() {
  const ok = confirm('Create a new world? This clears the current browser save. Export first if you want to keep it.');
  if (!ok) return;
  state.worldName = '';
  state.answers = {};
  state.selectedCategory = getCategories()[0];
  state.currentIndex = 0;
  localStorage.removeItem(STORAGE_KEY);
  renderAll();
  showNotice('A blank journal is open. The Lore Kobold is sharpening its tiny pencil.', '');
}

function saveProgress(showToast) {
  const payload = getSavePayload();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  if (showToast) showNotice('Progress saved in this browser. Export JSON if you want to move it to another device.', '');
}

function loadProgress({ silent = false } = {}) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    applySavePayload(data);
    if (!silent) showNotice('Local browser save loaded.', '');
    return true;
  } catch (error) {
    console.warn(error);
    if (!silent) showNotice('The local save could not be read.', 'warning');
    return false;
  }
}

function getSavePayload() {
  return {
    app: 'RPG Worldbuilder Helper',
    version: APP_VERSION,
    savedAt: new Date().toISOString(),
    worldName: state.worldName || '',
    answers: state.answers,
    questionIds: QUESTIONS.map(q => q.id),
  };
}

function applySavePayload(data) {
  if (!data || typeof data !== 'object') throw new Error('Invalid save file.');
  state.worldName = data.worldName || '';
  state.answers = data.answers || {};
  const firstAnswered = QUESTIONS.find(q => isAnswered(q));
  state.selectedCategory = firstAnswered ? firstAnswered.category : getCategories()[0];
  state.currentIndex = 0;
  saveProgress(false);
}

function renderAll() {
  els.worldNameInput.value = state.worldName || '';
  renderCategoryList();
  renderQuestion('next');
  updateProgress();
}

function renderCategoryList() {
  const categories = getCategories();
  els.categoryList.innerHTML = '';
  categories.forEach(category => {
    const list = questionsInCategory(category);
    const answered = list.filter(isAnswered).length;
    const btn = document.createElement('button');
    btn.className = `category-item${category === state.selectedCategory ? ' active' : ''}`;
    btn.innerHTML = `<strong>${escapeHtml(category)}</strong><small>${answered} / ${list.length} answered</small>`;
    btn.addEventListener('click', () => {
      state.selectedCategory = category;
      state.currentIndex = findFirstUnansweredIndex(category);
      closeReview(false);
      renderCategoryList();
      renderQuestion('next');
    });
    els.categoryList.appendChild(btn);
  });
}

function findFirstUnansweredIndex(category) {
  const list = questionsInCategory(category);
  const idx = list.findIndex(q => !isAnswered(q));
  return idx === -1 ? 0 : idx;
}

function renderQuestion(direction = 'next') {
  const q = getCurrentQuestion();
  els.welcomeView.hidden = true;
  els.reviewView.hidden = true;
  els.questionView.hidden = false;
  if (!q) {
    els.questionView.hidden = true;
    els.welcomeView.hidden = false;
    return;
  }

  const list = questionsInCategory();
  els.categoryPill.textContent = q.category;
  els.questionCounter.textContent = `Question ${state.currentIndex + 1} of ${list.length}`;
  els.questionText.textContent = q.text;
  els.answerLabel.textContent = q.type === 'choice-text' ? 'Extra notes' : 'Your answer';

  const answer = ensureAnswer(q.id);
  els.answerText.value = answer.text || '';
  renderChoices(q, answer);

  els.prevBtn.disabled = state.currentIndex === 0;
  els.nextBtn.textContent = state.currentIndex === list.length - 1 ? 'Finish Topic' : 'Next';

  els.questionPage.classList.remove('turning-next','turning-back');
  void els.questionPage.offsetWidth;
  els.questionPage.classList.add(direction === 'back' ? 'turning-back' : 'turning-next');
}

function renderChoices(question, answer) {
  els.choiceArea.innerHTML = '';
  if (question.type !== 'choice-text') return;
  const group = `choice-${question.id}`;
  question.options.forEach(option => {
    const label = document.createElement('label');
    label.className = 'choice-option';
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = group;
    input.value = option;
    input.checked = answer.choice === option;
    input.addEventListener('change', () => {
      ensureAnswer(question.id).choice = option;
      saveProgress(false);
      renderCategoryList();
      updateProgress();
    });
    const span = document.createElement('span');
    span.textContent = option;
    label.append(input, span);
    els.choiceArea.appendChild(label);
  });
  const clear = document.createElement('button');
  clear.type = 'button';
  clear.textContent = 'Clear choice';
  clear.addEventListener('click', () => {
    ensureAnswer(question.id).choice = '';
    renderQuestion();
    saveProgress(false);
    renderCategoryList();
    updateProgress();
  });
  els.choiceArea.appendChild(clear);
}

function nextQuestion() {
  const list = questionsInCategory();
  if (state.currentIndex < list.length - 1) {
    state.currentIndex += 1;
    renderQuestion('next');
  } else {
    const categories = getCategories();
    const catIndex = categories.indexOf(state.selectedCategory);
    const nextCat = categories[catIndex + 1];
    if (nextCat) {
      state.selectedCategory = nextCat;
      state.currentIndex = findFirstUnansweredIndex(nextCat);
      renderCategoryList();
      renderQuestion('next');
      showNotice(`Topic finished. The Lore Kobold opened ${nextCat}.`, '');
    } else {
      updateProgress(true);
      showReview('unanswered');
    }
  }
}

function previousQuestion() {
  if (state.currentIndex > 0) {
    state.currentIndex -= 1;
    renderQuestion('back');
  }
}

function clearCurrentAnswer() {
  const q = getCurrentQuestion();
  if (!q) return;
  if (!confirm('Clear this answer?')) return;
  delete state.answers[q.id];
  saveProgress(false);
  renderQuestion();
  renderCategoryList();
  updateProgress();
}

function updateProgress(announceComplete = false) {
  const total = QUESTIONS.length;
  const answered = QUESTIONS.filter(isAnswered).length;
  const pct = total ? Math.round((answered / total) * 100) : 0;
  els.overallBar.style.width = `${pct}%`;
  els.overallText.textContent = `${answered} / ${total} answered • ${pct}%`;
  els.worldNameLine.textContent = state.worldName ? `Current world: ${state.worldName}` : 'No world name yet.';
  if (answered === total && total > 0) {
    showNotice('The Lore Kobold has no more questions. You have answered everything in the current question list.', 'complete');
  } else if (announceComplete) {
    showNotice(`${total - answered} questions remain unanswered.`, '');
  }
}

function showReview(mode) {
  state.reviewMode = mode;
  els.welcomeView.hidden = true;
  els.questionView.hidden = true;
  els.reviewView.hidden = false;
  const title = mode === 'answered' ? 'Answered Questions' : mode === 'unanswered' ? 'Unanswered Questions' : 'All Questions';
  els.reviewTitle.textContent = title;
  renderReview(mode);
}

function closeReview(render = true) {
  state.reviewMode = null;
  els.reviewView.hidden = true;
  els.welcomeView.hidden = true;
  els.questionView.hidden = false;
  if (render) renderQuestion();
}

function renderReview(mode) {
  els.reviewContent.innerHTML = '';
  let any = false;
  getCategories().forEach(category => {
    const filtered = questionsInCategory(category).filter(q => {
      if (mode === 'answered') return isAnswered(q);
      if (mode === 'unanswered') return !isAnswered(q);
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
      const answer = document.createElement('div');
      answer.className = 'review-answer';
      answer.textContent = isAnswered(q) ? answerAsText(q) : 'Not answered yet.';
      const edit = document.createElement('button');
      edit.textContent = 'Go to question';
      edit.addEventListener('click', () => {
        state.selectedCategory = q.category;
        state.currentIndex = questionsInCategory(q.category).findIndex(item => item.id === q.id);
        renderCategoryList();
        closeReview(true);
      });
      item.append(question, answer, edit);
      section.appendChild(item);
    });
    els.reviewContent.appendChild(section);
  });
  if (!any) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = mode === 'answered' ? 'No answers yet. The Lore Kobold is trying not to look disappointed.' : 'Nothing to show here.';
    els.reviewContent.appendChild(empty);
  }
}

function exportBoth() {
  saveProgress(false);
  const payload = getSavePayload();
  const safeName = filenameBase();
  downloadJson(payload, `${safeName}.json`);
  exportPdf(payload, `${safeName}.pdf`);
  showNotice('Export started. Your browser should download both the JSON save file and the PDF world document.', '');
}

function filenameBase() {
  const base = (state.worldName || 'rpg-world').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'rpg-world';
  return `${base}-worldbuilder`;
}

function downloadJson(payload, filename) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function exportPdf(payload, filename) {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    showNotice('PDF library did not load. JSON export still works. Check your internet connection and try again.', 'warning');
    return;
  }
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 54;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  const addPageIfNeeded = (needed = 48) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };
  const line = (text, size = 11, style = 'normal', spacing = 16, color = [51, 39, 25]) => {
    doc.setFont('times', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const chunks = doc.splitTextToSize(String(text || ''), pageWidth - margin * 2);
    chunks.forEach(chunk => {
      addPageIfNeeded(spacing + 3);
      doc.text(chunk, margin, y);
      y += spacing;
    });
  };

  doc.setProperties({ title: state.worldName ? `${state.worldName} - Worldbuilder` : 'RPG Worldbuilder Helper', subject: 'RPG worldbuilding questionnaire', creator: 'RPG Worldbuilder Helper' });
  line('RPG Worldbuilder Helper', 24, 'bold', 30, [87, 53, 31]);
  line(state.worldName || 'Unnamed World', 18, 'bold', 24, [87, 53, 31]);
  line(`Exported: ${new Date().toLocaleString()}`, 10, 'italic', 16, [111, 96, 76]);
  y += 12;

  getCategories().forEach(category => {
    const answeredQuestions = questionsInCategory(category).filter(isAnswered);
    if (!answeredQuestions.length) return;
    addPageIfNeeded(58);
    y += 10;
    line(category, 17, 'bold', 24, [87, 53, 31]);
    answeredQuestions.forEach(q => {
      addPageIfNeeded(70);
      line(q.text, 12, 'bold', 17, [51, 39, 25]);
      line(answerAsText(q) || 'Not answered.', 11, 'normal', 15, [73, 58, 39]);
      y += 8;
    });
  });

  doc.addPage();
  y = margin;
  line('Machine-readable save archive', 16, 'bold', 24, [87, 53, 31]);
  line('This final section lets RPG Worldbuilder Helper import this PDF later. Keep the JSON file too; JSON is the safest save format.', 10, 'italic', 15, [111, 96, 76]);
  const encoded = encodeSave(payload);
  line(PDF_DATA_START, 7, 'normal', 10, [160, 160, 160]);
  const chunks = encoded.match(/.{1,88}/g) || [];
  chunks.forEach(chunk => line(chunk, 6, 'normal', 8, [180, 180, 180]));
  line(PDF_DATA_END, 7, 'normal', 10, [160, 160, 160]);

  doc.save(filename);
}

function encodeSave(payload) {
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json)));
}

function decodeSave(encoded) {
  return JSON.parse(decodeURIComponent(escape(atob(encoded))));
}

async function importJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    applySavePayload(data);
    renderAll();
    showNotice('JSON save imported. The Lore Kobold remembers this world.', '');
    showReview('answered');
  } catch (error) {
    console.error(error);
    showNotice('Could not import JSON. Make sure it is a save file generated by this app.', 'warning');
  }
}

async function importPdfFile(event) {
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if (!file) return;
  if (!window.pdfjsLib) {
    showNotice('PDF reader library did not load. Try JSON import, or refresh with internet access.', 'warning');
    return;
  }
  try {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const data = new Uint8Array(await file.arrayBuffer());
    const pdf = await window.pdfjsLib.getDocument({ data }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += '\n' + content.items.map(item => item.str).join(' ');
    }
    const start = text.indexOf(PDF_DATA_START);
    const end = text.indexOf(PDF_DATA_END);
    if (start === -1 || end === -1 || end <= start) throw new Error('No archive marker found.');
    const encoded = text.slice(start + PDF_DATA_START.length, end).replace(/\s+/g, '');
    const payload = decodeSave(encoded);
    applySavePayload(payload);
    renderAll();
    showNotice('Generated PDF imported. I restored the answers stored inside it.', '');
    showReview('answered');
  } catch (error) {
    console.error(error);
    showNotice('Could not import this PDF. PDF import only works with PDFs exported by this app. Use the JSON file if you have it.', 'warning');
  }
}

function showNotice(message, type) {
  els.notice.textContent = message;
  els.notice.hidden = false;
  els.notice.className = `notice ${type || ''}`.trim();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char]));
}
