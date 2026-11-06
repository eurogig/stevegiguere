const explanations = {
  user: 'The task defines the goal. Permissions should define the limits. Those are different things.',
  agent: 'A plan can change as an agent works. Check whether each action still serves the original task.',
  tool: 'Tool access turns a suggestion into an action. Enforce least privilege outside the agent.',
  document: 'Retrieved content is data, not authority. A document can contain instructions the agent should never follow.'
};
// Keep a failed remote portrait from rendering as a broken-image icon.
const portrait = document.querySelector('#steve-portrait');
portrait.addEventListener('error', () => { portrait.hidden = true; });
if (portrait.complete && portrait.naturalWidth === 0) portrait.hidden = true;
const workflow = document.querySelector('.field-notes');
workflow.addEventListener('toggle', () => {
  if (!workflow.open) return;
  requestAnimationFrame(() => {
    if (!workflow.open) return;
    const target = window.matchMedia('(max-width: 720px)').matches
      ? document.querySelector('#workflow-intro')
      : document.querySelector('.field-notes-content');
    target.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  });
});
document.querySelectorAll('[data-node]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-node]').forEach(node => {
      node.classList.remove('selected'); node.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('selected'); button.setAttribute('aria-pressed', 'true');
    document.querySelector('#inspect-label').textContent = '// ' + button.dataset.node.toUpperCase() + '.' + ({user:'INTENT',agent:'PLAN',tool:'EXECUTE',document:'READ'}[button.dataset.node]);
    document.querySelector('#inspect-text').textContent = explanations[button.dataset.node];
  });
});
const palette = document.querySelector('#command-dialog');
const challenge = document.querySelector('#challenge-dialog');
const search = document.querySelector('#command-search');
function openPalette() { if (!palette.open && !challenge.open) { palette.showModal(); search.focus(); } }
function openChallenge() { if (palette.open) palette.close(); if (!challenge.open) challenge.showModal(); }
document.querySelector('.command-toggle').addEventListener('click', openPalette);
document.querySelector('.anomaly').addEventListener('click', openChallenge);
document.querySelector('#challenge-command').addEventListener('click', openChallenge);
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault(); if (palette.open) palette.close(); else openPalette();
  }
});
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
document.querySelectorAll('#command-list a').forEach(link => link.addEventListener('click', () => palette.close()));
search.addEventListener('input', () => {
  let count = 0;
  document.querySelectorAll('#command-list > *').forEach(item => { item.hidden = !item.textContent.toLowerCase().includes(search.value.trim().toLowerCase()); if (!item.hidden) count++; });
  document.querySelector('#no-results').hidden = count > 0;
});
search.addEventListener('keydown', event => { if (event.key === 'Enter') document.querySelector('#command-list > :not([hidden])')?.click(); });
document.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
  document.querySelector('#challenge-feedback').textContent = button.dataset.answer === 'correct'
    ? 'FLAG{data_is_not_authority} — Exactly. The document is trying to cross a trust boundary. Keep the invoice data, reject the instruction, and continue the legitimate task.'
    : 'That is ordinary invoice data. Look for a line asking the agent to do something outside its task.';
}));
document.querySelector('#year').textContent = new Date().getFullYear();
