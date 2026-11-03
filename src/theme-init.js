// Aplicado antes dos estilos para restaurar a aparência sem trocar de cor ao abrir.
(() => {
  let saved;
  try { saved = localStorage.getItem('isolados-theme'); } catch { /* Armazenamento opcional. */ }
  const legacy = { light: 'cloud', dark: 'water' };
  const valid = ['fire', 'cloud', 'water', 'stone'];
  const preference = legacy[saved] || saved;
  const systemDark = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme = valid.includes(preference) ? preference : systemDark ? 'water' : 'cloud';
})();
