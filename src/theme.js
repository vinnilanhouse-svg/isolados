export function bindTheme(button) {
  function updateButton() {
    const dark = document.documentElement.dataset.theme === 'dark';
    button.setAttribute('aria-pressed', String(dark));
    button.title = dark ? 'Ativar modo claro' : 'Ativar modo escuro';
  }
  updateButton();
  button.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('isolados-theme', theme); } catch { /* Funciona mesmo sem armazenamento. */ }
    updateButton();
  });
}
