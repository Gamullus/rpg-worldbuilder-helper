// Export filenames: world-name-current-date, with a short descriptor only when needed.
(function () {
  function slugify(value) {
    return String(value || 'rpg-world')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'rpg-world';
  }

  function localDateStamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function worldDateBase() {
    const world = state && state.worldName ? state.worldName : 'rpg-world';
    return `${slugify(world)}-${localDateStamp()}`;
  }

  function descriptorFromOldFilename(filename) {
    const lower = String(filename || '').toLowerCase();
    if (lower.includes('answered')) return 'answered';
    if (lower.includes('full')) return 'full';
    if (lower.includes('villain')) return 'villain';
    if (lower.includes('obsidian')) return 'obsidian';
    if (lower.includes('current-note')) return 'current-note';
    if (lower.includes('note')) return 'note';
    return '';
  }

  function normalizedExportName(filename) {
    const match = String(filename || '').match(/\.([a-z0-9]+)$/i);
    const ext = match ? match[1].toLowerCase() : 'txt';
    const descriptor = descriptorFromOldFilename(filename);
    const suffix = descriptor && ext !== 'json' ? `-${descriptor}` : '';
    return `${worldDateBase()}${suffix}.${ext}`;
  }

  window.worldDateExportFilenameBase = worldDateBase;
  window.normalizedExportName = normalizedExportName;

  if (typeof filenameBase === 'function') {
    filenameBase = worldDateBase;
  }

  if (typeof downloadBlob === 'function') {
    const previousDownloadBlob = downloadBlob;
    downloadBlob = function namedDownloadBlob(blob, filename) {
      previousDownloadBlob(blob, normalizedExportName(filename));
    };
  }
})();
