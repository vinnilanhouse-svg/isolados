import { book, welcome } from './content.js';

let dialog;
let returnFocus;
let seen = false;
try { seen = localStorage.getItem('isolados-welcome-seen') === '1'; } catch { /* Armazenamento opcional. */ }

export function showWelcome(opener) {
  if (!opener && seen) return;
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.className = 'welcome-dialog';
    dialog.setAttribute('aria-labelledby', 'welcome-title');
    dialog.innerHTML = `
      <form method="dialog" class="welcome-close-form">
        <button class="welcome-close" aria-label="Fechar mensagem de boas-vindas">×</button>
      </form>
      <span class="category-label">Uma mensagem do autor</span>
      <h2 id="welcome-title" tabindex="-1">${welcome.title}</h2>
      <p>${welcome.message}</p>
      <p>${welcome.invitation}</p>
      <a class="welcome-email" href="mailto:${welcome.email}">${welcome.email}</a>
      <section class="welcome-rights" aria-labelledby="welcome-rights-title">
        <h3 id="welcome-rights-title">${welcome.rightsTitle}</h3>
        <p>${welcome.rights}</p>
      </section>
      <p class="welcome-signature">${book.author}</p>
      <form method="dialog"><button class="welcome-continue">${welcome.button} <span aria-hidden="true">→</span></button></form>`;
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')];
      const first = controls[0];
      const last = controls.at(-1);
      const active = document.activeElement;
      if (!controls.includes(active) || (!event.shiftKey && active === last) || (event.shiftKey && active === first)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    });
    dialog.addEventListener('close', () => {
      seen = true;
      try { localStorage.setItem('isolados-welcome-seen', '1'); } catch { /* A mensagem continua disponível no rodapé. */ }
      document.body.classList.remove('welcome-open');
      const target = returnFocus?.isConnected ? returnFocus : document.querySelector('.brand');
      target?.focus({ preventScroll: true });
    });
    document.body.append(dialog);
  }
  if (dialog.open) return;
  returnFocus = opener;
  document.body.classList.add('welcome-open');
  dialog.showModal();
  dialog.querySelector('#welcome-title').focus({ preventScroll: true });
}
