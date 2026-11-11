(() => {
  'use strict';
  const path = location.pathname;
  const config = path.includes('/cv/')
    ? { key: 'sarmad-cv-installed', name: 'منشئ السيرة الذاتية', icon: '📄' }
    : path.includes('/games/')
      ? { key: 'sarmad-games-installed', name: 'ساحة الألعاب', icon: '🎮' }
      : { key: 'sarmad-zone-installed', name: 'Sarmad Zone', icon: '🌐' };
  const installedKey = config.key;
  const declinedKey = installedKey + '-declined';
  const standalone = () =>
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    navigator.standalone === true;
  try { if (localStorage.getItem(installedKey) === '1' || standalone()) return; } catch (_) {}
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', () => navigator.serviceWorker.register('../sw.js', { scope: '../' }).catch(() => {}));
  }
  let installEvent = null;
  let choiceMade = false;
  const style = document.createElement('style');
  style.textContent = `
    #szInstallPrompt{position:sticky;top:0;z-index:99999;margin:0 auto 14px;width:min(100% - 20px,900px);padding:17px 20px;border:2px solid #b8d4c3;border-radius:17px;background:linear-gradient(135deg,#f1fff6,#e4f3e9);color:#123b28;box-shadow:0 7px 24px #102d1b24;text-align:center;font-family:Tahoma,Arial,sans-serif}
    #szInstallPrompt[hidden]{display:none!important}
    #szInstallPrompt .sz-title{font-size:clamp(19px,2.5vw,24px);font-weight:800;margin:0 0 7px}
    #szInstallPrompt .sz-desc{font-size:16px;line-height:1.7;margin:0 0 13px}
    #szInstallPrompt .sz-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
    #szInstallPrompt button{min-width:112px;border:0;border-radius:11px;padding:11px 22px;font-size:17px;font-weight:800;cursor:pointer}
    #szInstallYes{background:#0d633b;color:#fff}
    #szInstallNo{background:#e4e9e5;color:#25372c}
    #szInstallHelp{font-size:14px;line-height:1.7;margin:12px 0 0}
    @media(max-width:520px){#szInstallPrompt{padding:15px 12px}#szInstallPrompt .sz-desc{font-size:15px}#szInstallPrompt button{flex:1}}
  `;
  document.head.appendChild(style);
  const box = document.createElement('section');
  box.id = 'szInstallPrompt';
  box.hidden = true;
  box.setAttribute('aria-label', 'تثبيت القسم');
  box.innerHTML = `
    <p class="sz-title">${config.icon} هل تريد تثبيت ${config.name}؟</p>
    <p class="sz-desc">أضفه إلى شاشة جهازك حتى تفتحه بسرعة مثل التطبيقات.</p>
    <div class="sz-actions"><button id="szInstallYes" type="button">نعم، تثبيت</button><button id="szInstallNo" type="button">لا، شكراً</button></div>
    <p id="szInstallHelp" hidden></p>`;
  const mount = () => { if (!box.isConnected) document.body.insertBefore(box, document.body.firstChild); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true }); else mount();
  const show = () => { if (!choiceMade && !standalone()) { mount(); box.hidden = false; } };
  window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); installEvent = event; show(); });
  window.addEventListener('appinstalled', () => {
    try { localStorage.setItem(installedKey, '1'); } catch (_) {}
    box.hidden = true; installEvent = null;
  });
  box.querySelector('#szInstallNo').addEventListener('click', () => { choiceMade = true; box.hidden = true; });
  box.querySelector('#szInstallYes').addEventListener('click', async () => {
    const help = box.querySelector('#szInstallHelp');
    if (installEvent) {
      const event = installEvent; installEvent = null;
      try {
        await event.prompt();
        const result = await event.userChoice;
        if (result && result.outcome === 'accepted') {
          try { localStorage.setItem(installedKey, '1'); } catch (_) {}
          box.hidden = true; return;
        }
      } catch (_) {}
      box.hidden = true; return;
    }
    help.hidden = false;
    help.textContent = /iphone|ipad|ipod/i.test(navigator.userAgent)
      ? 'على الآيفون: افتح الصفحة بمتصفح Safari، اضغط زر المشاركة، ثم اختر «إضافة إلى الشاشة الرئيسية».'
      : 'من قائمة المتصفح (⋮) اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية». إذا لم يظهر الخيار، افتح الرابط بمتصفح Chrome.';
  });
  try { if (sessionStorage.getItem(declinedKey) === '1') choiceMade = true; } catch (_) {}
  if (!choiceMade) setTimeout(show, 700);
})();