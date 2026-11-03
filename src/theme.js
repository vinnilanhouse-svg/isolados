const themes = [
  { id: 'fire', name: 'Fogo', description: 'Totalmente claro', path: '<path d="M12 2c2 4-1 5 1 8 1-1 2-2 2-4 4 4 6 7 5 11a8 8 0 0 1-15-1c-.5-3 1-6 4-9-.5 3 0 4 1 5 2-3 0-6 2-10Z"/><path d="M10 21c-2-3-1-5 2-8 0 2 3 4 3 6a3 3 0 0 1-1 2"/>' },
  { id: 'cloud', name: 'Nuvem', description: 'Claro', path: '<path d="M7 19a5 5 0 1 1-.7-10 6.5 6.5 0 0 1 12.5 1.6A4.3 4.3 0 0 1 18 19H7Z"/>' },
  { id: 'water', name: 'Gota', description: 'Totalmente escuro', path: '<path d="M12 2S5 10 5 14a7 7 0 0 0 14 0c0-4-7-12-7-12Z"/><path d="M8.5 14a3.5 3.5 0 0 0 3.5 3.5"/>' },
  { id: 'stone', name: 'Pedra', description: 'Meio-termo', path: '<path d="m4 8 5-5 9 2 4 9-6 7H6l-4-7 2-6Z"/><path d="m4 8 8 2 6-5M12 10l4 11M2 14l10-4 10 4"/>' }
];
let panel;
let opener;

function currentTheme() {
  return themes.find(theme => theme.id === document.documentElement.dataset.theme) || themes[1];
}

function icon(theme) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true" data-theme-icon="${theme.id}">${theme.path}</svg>`;
}

function updateButton(button = document.querySelector('.theme-toggle')) {
  if (!button) return;
  const theme = currentTheme();
  button.innerHTML = icon(theme);
  button.title = `Aparência: ${theme.name}`;
  button.setAttribute('aria-expanded', String(Boolean(panel?.open)));
}

function selectTheme(id) {
  if (!themes.some(theme => theme.id === id)) return;
  document.documentElement.dataset.theme = id;
  try { localStorage.setItem('isolados-theme', id); } catch { /* Funciona mesmo sem armazenamento. */ }
  updateButton();
}

function openPanel(button) {
  opener = button;
  if (!panel) {
    panel = document.createElement('dialog');
    panel.id = 'appearance-panel';
    panel.className = 'appearance-panel';
    panel.setAttribute('aria-labelledby', 'appearance-title');
    panel.setAttribute('aria-describedby', 'appearance-description');
    panel.innerHTML = `<form method="dialog">
      <div class="appearance-heading"><h2 id="appearance-title">Aparência</h2><button class="appearance-close" aria-label="Fechar aparência">×</button></div>
      <p id="appearance-description">Escolha como prefere ler ISOLADOS.</p>
      <fieldset class="appearance-options"><legend class="sr-only">Tema do site</legend>
        ${themes.map(theme => `<label class="theme-option">
          <input class="sr-only" type="radio" name="appearance" value="${theme.id}">
          <span class="theme-option-card"><span class="theme-selection" aria-hidden="true">✓</span>${icon(theme)}<strong>${theme.name}</strong><span class="theme-description">${theme.description}</span></span>
        </label>`).join('')}
      </fieldset>
      <button class="appearance-done">Pronto</button>
    </form>`;
    panel.querySelector('fieldset').addEventListener('change', event => selectTheme(event.target.value));
    panel.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...panel.querySelectorAll('button, input:checked')];
      const first = controls[0];
      const last = controls.at(-1);
      if ((!event.shiftKey && document.activeElement === last) || (event.shiftKey && document.activeElement === first)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    });
    panel.addEventListener('close', () => {
      document.body.classList.remove('appearance-open');
      updateButton();
      (opener?.isConnected ? opener : document.querySelector('.theme-toggle'))?.focus({ preventScroll: true });
    });
    document.body.append(panel);
  }
  for (const input of panel.querySelectorAll('input')) input.checked = input.value === currentTheme().id;
  document.body.classList.add('appearance-open');
  panel.showModal();
  panel.querySelector('input:checked').focus({ preventScroll: true });
  updateButton(button);
}

export function bindTheme(button) {
  updateButton(button);
  button.addEventListener('click', () => openPanel(button));
}
