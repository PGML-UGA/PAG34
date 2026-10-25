// All enhancement is optional: core content and contact links work without JavaScript.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  document.documentElement.classList.add('js-ready');
}
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
  });
});
const shareButton = document.querySelector('#share');
shareButton.addEventListener('click', async () => {
  const status = document.querySelector('#share-status');
  const url = location.protocol === 'file:' ? 'https://www.intlpag.org/PAG/' : location.href.split('#')[0];
  const text = 'Genomics of Crop Ecosystem Services — PAG34. January 10, 2027, 4:00–6:10 PM PST, Pacific E, San Diego. Contact Andrew H. Paterson at patersonah@gmail.com. Speaker names are due November 16, 2026.';
  try {
    if (navigator.share) await navigator.share({ title: document.title, text, url });
    else if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text + ' ' + url); status.textContent = 'Workshop details copied. Pass them on.'; }
    else location.href = 'mailto:?subject=' + encodeURIComponent(document.title) + '&body=' + encodeURIComponent(text + '\n\n' + url);
  } catch (error) { if (error.name !== 'AbortError') status.textContent = 'Please share this page URL or email the organizer.'; }
});
const proposalForm = document.querySelector('#proposal-form');
let proposalDraft = '';
proposalForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!proposalForm.reportValidity()) return;
  const presenter = document.querySelector('#presenter').value.trim();
  const title = document.querySelector('#talk-title').value.trim();
  const summary = document.querySelector('#talk-summary').value.trim();
  if (!presenter || !title || !summary) { document.querySelector('#proposal-status').textContent = 'Please include your name, title, and a brief description.'; return; }
  proposalDraft = 'Dear Andrew,\n\nI would like to propose an approximately 20-minute in-person talk for the Genomics of Crop Ecosystem Services workshop at PAG34.\n\nProposed title: ' + title + '\n\nBrief description:\n' + summary + '\n\nPresenter and affiliation: ' + presenter + '\n\nBest regards,\n' + presenter;
  const subject = 'PAG34 workshop talk proposal: ' + title;
  document.querySelector('#draft-fallback').hidden = false;
  document.querySelector('#proposal-status').textContent = 'Your draft is ready. Review it in your email app before sending.';
  location.href = 'mailto:patersonah@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(proposalDraft);
});
document.querySelector('#copy-draft').addEventListener('click', async () => {
  const status = document.querySelector('#proposal-status');
  try { await navigator.clipboard.writeText(proposalDraft); status.textContent = 'Proposal copied. Paste it into an email to patersonah@gmail.com.'; }
  catch { status.textContent = 'Copy the draft below and email it to patersonah@gmail.com.';
    let draft = document.querySelector('#manual-draft');
    if (!draft) { draft = document.createElement('textarea'); draft.id = 'manual-draft'; draft.readOnly = true; draft.setAttribute('aria-label', 'Prepared proposal email'); document.querySelector('#draft-fallback').append(draft); }
    draft.value = proposalDraft; draft.focus(); draft.select();
  }
});
if (Date.now() >= Date.parse('2026-11-17T00:00:00-08:00')) {
  document.querySelector('#call-status').textContent = 'Speaker nomination deadline has passed';
  document.querySelector('#deadline-note').textContent = 'Contact Andrew for current program availability.';
  document.querySelector('#announcement-text').textContent = 'PAG34 · Genomics of Crop Ecosystem Services · January 10, 2027.';
}
let ticking = false;
function updateProgress() {
  const range = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.scroll-progress').style.width = (range > 0 ? Math.min(100, scrollY / range * 100) : 0) + '%'; ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; } }, { passive: true });
addEventListener('resize', updateProgress); updateProgress();
