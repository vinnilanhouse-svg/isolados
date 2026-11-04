const consentKey = 'isolados-privacy-choice';
const consentVersion = 1;
let choice = null;
let sdk;
let sdkLoading;
let panel;
let opener;
try {
  const value = JSON.parse(localStorage.getItem(consentKey));
  if (value?.version === consentVersion && typeof value.analytics === 'boolean') choice = value;
} catch { /* Sem escolha, nenhuma métrica opcional é carregada. */ }

export function analyticsPath(hash = location.hash) {
  const route = hash.replace(/^#\/?/, '').split(/[?#]/)[0].replace(/\/$/, '');
  if (!route) return '/';
  if (/^(capitulos|personagens|artes|universo|bastidores|sobre|privacidade|termos)$/.test(route)) return '/' + route;
  if (/^artes\/(capitulos|personagens|fanarts)$/.test(route)) return '/' + route;
  if (/^capitulos\/[1-9]$/.test(route)) return '/' + route;
  if (/^personagens\/(vinicius|miguel|fernanda|amanda|jennyfer|allan|gabriel|henrique|jorge)$/.test(route)) return '/' + route;
  if (route === 'bastidores/processo') return '/' + route;
  return '/pagina-nao-encontrada';
}

export function trackPage() {
  if (!choice?.analytics || !sdk) return;
  const path = analyticsPath();
  sdk.pageview({ route: path, path });
}

async function enableAnalytics() {
  if (sdk) { trackPage(); return; }
  if (sdkLoading) return sdkLoading;
  sdkLoading = (async () => {
    try {
      const module = await import('/vendor/vercel-analytics.js');
      if (!choice?.analytics) return;
      module.inject({ mode: 'production', disableAutoTrack: true,
        beforeSend: event => {
          if (!choice?.analytics) return null;
          const url = new URL(event.url, location.origin);
          return { ...event, url: location.origin + analyticsPath(url.hash || '#' + url.pathname) };
        } });
      sdk = module;
      trackPage();
    } catch { /* A leitura permanece disponível se as métricas estiverem bloqueadas. */ }
    finally { sdkLoading = null; }
  })();
  return sdkLoading;
}

function saveChoice(analytics) {
  const wasEnabled = Boolean(choice?.analytics);
  choice = { version: consentVersion, analytics, savedAt: new Date().toISOString() };
  try { localStorage.setItem(consentKey, JSON.stringify(choice)); } catch { /* Respeita a escolha em memória. */ }
  document.querySelector('.privacy-banner')?.remove();
  document.documentElement.style.setProperty('--privacy-banner-height', '0px');
  if (analytics && !wasEnabled) enableAnalytics();
}

function showPanel(button) {
  opener = button;
  if (!panel) {
    panel = document.createElement('dialog');
    panel.className = 'privacy-panel'; panel.setAttribute('aria-labelledby', 'privacy-panel-title');
    panel.innerHTML = `<form method="dialog"><div class="privacy-panel-heading"><h2 id="privacy-panel-title">Suas preferências de privacidade</h2><button class="privacy-panel-close" aria-label="Fechar preferências de privacidade">×</button></div></form>
      <p>O armazenamento necessário mantém seu marcador, aparência e participação. As métricas de visita são opcionais.</p>
      <label class="privacy-option"><input type="checkbox" checked disabled> Necessários <span>Sempre ativos para as funções que você usar.</span></label>
      <label class="privacy-option"><input type="checkbox" data-analytics-choice> Métricas de visita <span>Ajudam a Elemental Corp a entender quais páginas são visitadas.</span></label>
      <p>Você pode recusar ou mudar sua escolha a qualquer momento. <a href="#/privacidade" data-privacy-policy>Leia a Política de privacidade</a>.</p>
      <div class="privacy-panel-actions"><button type="button" data-privacy-essential>Somente necessários</button><button type="button" data-privacy-save>Salvar preferências</button></div>`;
    panel.querySelector('[data-privacy-essential]').addEventListener('click', () => { saveChoice(false); panel.close(); });
    panel.querySelector('[data-privacy-save]').addEventListener('click', () => { saveChoice(panel.querySelector('[data-analytics-choice]').checked); panel.close(); });
    panel.querySelector('[data-privacy-policy]').addEventListener('click', () => panel.close());
    panel.addEventListener('close', () => {
      document.body.classList.remove('privacy-open');
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
    document.body.append(panel);
  }
  panel.querySelector('[data-analytics-choice]').checked = Boolean(choice?.analytics);
  document.body.classList.add('privacy-open'); panel.showModal();
}

export function bindPrivacy() {
  for (const button of document.querySelectorAll('[data-open-privacy]')) button.onclick = () => showPanel(button);
  if (!choice && !document.querySelector('.privacy-banner')) {
    const banner = document.createElement('section'); banner.className = 'privacy-banner';
    banner.setAttribute('aria-label', 'Cookies e privacidade');
    banner.innerHTML = `<div><strong>Cookies e privacidade</strong><p>Usamos armazenamento necessário para suas preferências e participação. Você escolhe se permite métricas de visita da Vercel. <a href="#/privacidade">Saiba mais</a>.</p></div>
      <div class="privacy-banner-actions"><button type="button" data-reject>Somente necessários</button><button type="button" data-accept>Aceitar métricas</button><button type="button" data-manage>Personalizar</button></div>`;
    banner.querySelector('[data-reject]').onclick = () => saveChoice(false);
    banner.querySelector('[data-accept]').onclick = () => saveChoice(true);
    banner.querySelector('[data-manage]').onclick = event => showPanel(event.currentTarget);
    document.body.append(banner);
    const observer = new ResizeObserver(() => {
      if (banner.isConnected) document.documentElement.style.setProperty('--privacy-banner-height', `${banner.getBoundingClientRect().height}px`);
      else observer.disconnect();
    });
    observer.observe(banner);
  }
  if (choice?.analytics && !sdk) enableAnalytics();
}

// Retirar o consentimento em uma aba também bloqueia novas métricas nas demais.
if (typeof window !== 'undefined') window.addEventListener('storage', event => {
  if (event.key !== consentKey && event.key !== null) return;
  choice = null;
  try {
    const value = JSON.parse(event.newValue);
    if (value?.version === consentVersion && typeof value.analytics === 'boolean') choice = value;
  } catch { /* Nenhum consentimento válido equivale a métricas desligadas. */ }
  document.querySelector('.privacy-banner')?.remove();
  document.documentElement.style.setProperty('--privacy-banner-height', '0px');
  if (panel) panel.querySelector('[data-analytics-choice]').checked = Boolean(choice?.analytics);
  bindPrivacy();
});
