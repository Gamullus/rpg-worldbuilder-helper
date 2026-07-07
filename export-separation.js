// Separate exports: Full PDF, Answered PDF, and JSON are independent downloads.
(function () {
  function isIgnored(question) {
    return Boolean(state && state.questionFlags && state.questionFlags[question.id] && state.questionFlags[question.id].ignored);
  }

  function activeQuestionsInCategory(category) {
    return questionsInCategory(category).filter(question => !isIgnored(question));
  }

  function safeName() {
    return typeof filenameBase === 'function' ? filenameBase() : 'rpg-worldbuilder';
  }

  function exportJsonOnly() {
    saveProgress(false);
    downloadJson(getSavePayload(), `${safeName()}.json`);
    showNotice('JSON save downloaded separately.', '');
  }

  function exportPdfOnly(filename, mode) {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      showNotice('PDF library did not load. JSON export still works. Check your internet connection and try again.', 'warning');
      return;
    }

    saveProgress(false);

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

    const worldName = state.worldName || 'Unnamed World';
    const title = mode === 'answered' ? 'Answered World Notes' : 'Full Worldbuilding Journal';

    doc.setProperties({
      title: `${worldName} - ${title}`,
      subject: 'RPG worldbuilding questionnaire',
      creator: 'RPG Worldbuilder Helper'
    });

    line('RPG Worldbuilder Helper', 24, 'bold', 30, [87, 53, 31]);
    line(worldName, 18, 'bold', 24, [87, 53, 31]);
    line(title, 13, 'bold', 18, [87, 53, 31]);
    line(`Exported: ${new Date().toLocaleString()}`, 10, 'italic', 16, [111, 96, 76]);
    line('JSON is not embedded in this PDF. Use the separate Download JSON button for a restorable save file.', 10, 'italic', 15, [111, 96, 76]);
    y += 12;

    let exportedCount = 0;

    getCategories().forEach(category => {
      const questions = activeQuestionsInCategory(category).filter(question => {
        return mode === 'answered' ? isAnswered(question) : true;
      });
      if (!questions.length) return;

      addPageIfNeeded(58);
      y += 10;
      line(category, 17, 'bold', 24, [87, 53, 31]);

      questions.forEach(question => {
        exportedCount += 1;
        addPageIfNeeded(70);
        line(question.text, 12, 'bold', 17, [51, 39, 25]);
        const answer = answerAsText(question);
        line(answer || 'Not answered yet.', 11, 'normal', 15, answer ? [73, 58, 39] : [145, 120, 90]);
        y += 8;
      });
    });

    if (!exportedCount) {
      showNotice(mode === 'answered' ? 'No answered active questions to export yet.' : 'No active questions to export.', 'warning');
      return;
    }

    doc.save(filename);
    showNotice(mode === 'answered' ? 'Answered PDF downloaded separately.' : 'Full PDF downloaded separately.', '');
  }

  function replaceButton(id, label, handler) {
    const oldButton = document.getElementById(id);
    if (!oldButton) return null;
    const newButton = oldButton.cloneNode(true);
    newButton.textContent = label;
    newButton.addEventListener('click', handler);
    oldButton.replaceWith(newButton);
    return newButton;
  }

  function wireJsonButton() {
    const existing = document.getElementById('exportJsonBtn');
    if (existing) {
      const newButton = existing.cloneNode(true);
      newButton.textContent = 'Download JSON';
      newButton.addEventListener('click', exportJsonOnly);
      existing.replaceWith(newButton);
      return;
    }

    const importJson = document.getElementById('importJsonBtn');
    if (!importJson) return;

    const button = document.createElement('button');
    button.id = 'exportJsonBtn';
    button.type = 'button';
    button.textContent = 'Download JSON';
    button.addEventListener('click', exportJsonOnly);

    importJson.parentNode.insertBefore(button, importJson);
  }

  function initSeparatedExports() {
    replaceButton('exportBtn', 'Download Full PDF', () => {
      exportPdfOnly(`${safeName()}-full.pdf`, 'full');
    });

    replaceButton('exportAnsweredBtn', 'Download Answered PDF', () => {
      exportPdfOnly(`${safeName()}-answered.pdf`, 'answered');
    });

    wireJsonButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSeparatedExports);
  } else {
    initSeparatedExports();
  }
})();
