(() => {
  'use strict';
  const path = location.pathname;
  const config = path.includes('/cv/')
    ? { key: 'sarmad-cv-installed', label: 'تثبيت CV', title: 'منشئ السيرة الذاتية' }
    : path.includes('/games/')
      ? { key: 'sarmad-games-installed', label: 'تثبيت الألعاب', title: 'ساحة الألعاب' }
      : { key: 'sarmad-zone-installed', label: 'تثبيت S.Z', title: 'Sarmad Zone' };
  const isStandalone = () =>
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    navigator.standalone === true;
  const hideAsInstalled = () => {
    try { localStorage.setItem(config.key, '1'); } catch (_) {}
    const button = document.getElementById('szInstallBtn');
    if (button) button.hidden = true;
  };
  try {
    if (localStorage.getItem(config.key) === '1') return;
    if (isStandalone()) { hideAsInstalled(); return; }
  } catch (_) {}
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {}));
  }
  let installEvent = null;
  const style = document.createElement('style');
  style.textContent = `
    #szInstallBtn{display:inline-flex;align-items:center;justify-content:center;gap:5px;min-height:30px;padding:5px 10px;border:1px solid #b8d4c3;border-radius:9px;background:#edf7f0;color:#145235;font:700 12px/1.2 Tahoma,Arial,sans-serif;cursor:pointer;white-space:nowrap;box-shadow:0 2px 7px #102d1b12}
    #szInstallBtn[hidden]{display:none!important}
    #szInstallBtn:active{transform:scale(.97)}
    body:has(>header #szInstallBtn) > header{position:relative}
    body:has(>header #szInstallBtn) > header #szInstallBtn{position:absolute;top:10px;right:12px}
    @media(max-width:520px){#szInstallBtn{min-height:27px;padding:4px 8px;font-size:11px;border-radius:8px}}
  `;
  document.head.appendChild(style);
  const button = document.createElement('button');
  button.id = 'szInstallBtn';
  button.type = 'button';
  button.textContent = '＋ ' + config.label;
  button.setAttribute('aria-label', 'تثبيت ' + config.title);
  const mount = () => {
    const header = document.querySelector('body > header') || document.querySelector('header.top');
    if (!header) return;
    if (path.includes('/games/')) {
      const tools = header.querySelector('.tools');
      if (tools) tools.insertBefore(button, tools.firstChild); else header.appendChild(button);
    } else if (path.includes('/cv/')) {
      header.insertBefore(button, header.firstChild);
    } else {
      header.insertBefore(button, header.firstChild);
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true}); else mount();
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installEvent = event; });
  window.addEventListener('appinstalled', hideAsInstalled);
  button.addEventListener('click', async () => {
    if (isStandalone()) { hideAsInstalled(); return; }
    if (installEvent) {
      const event = installEvent;
      installEvent = null;
      try {
        await event.prompt();
        const choice = await event.userChoice;
        if (choice && choice.outcome === 'accepted') hideAsInstalled();
      } catch (_) {}
      return;
    }
    const help = /iphone|ipad|ipod/i.test(navigator.userAgent)
      ? 'لتثبيت التطبيق على الآيفون: افتح الصفحة في Safari، اضغط مشاركة، ثم «إضافة إلى الشاشة الرئيسية».'
      : 'افتح قائمة المتصفح (⋮) واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية». إذا لم يظهر الخيار، افتح الصفحة في Chrome.';
    window.alert(help);
  });
})();