// The "Copy email" button. Works without it too: the address is a mailto link and selects in one click.
// Also loaded by site.test.js under Node (no DOM), hence the export at the end.

/** Copies [text]; returns the note to show. Falls back to selecting the text when the clipboard is unavailable. */
async function copyText(text, clipboard, select) {
  try {
    if (!clipboard) throw new Error('no clipboard');
    await clipboard.writeText(text);
    return 'Copied';
  } catch {
    select();
    return 'Selected. Press Ctrl+C to copy.';
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('copyBtn');
    const mail = document.getElementById('mail');
    const note = document.getElementById('copyNote');
    if (!button || !mail || !note) return;
    button.addEventListener('click', async () => {
      note.textContent = await copyText(mail.textContent.trim(), navigator.clipboard, () => {
        const range = document.createRange();
        range.selectNodeContents(mail);
        const selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      });
    });
  });
}

if (typeof module !== 'undefined') module.exports = { copyText };
