(() => {
  'use strict';

  const path = location.pathname;
  const config = path.includes('/cv/')
    ? { label: 'تثبيت منشئ السيرة', title: 'منشئ السيرة الذاتية' }
    : path.includes('/games/')
      ? { label: 'تثبيت الألعاب', title: 'ساحة الألعاب' }
      : path.includes('/s.scaner/')
        ? { label: 'تثبيت السكنر', title: 'السكنر' }
        : { label: 'تثبيت المكتبة', title: 'مكتبتي الرقمية' };

  const isStandalone = () =>
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    navigator.standalone === true;

  if (isStandalone()) return;

  let installEvent = null;
  let installed = false;

  const style = document.createElement('style');
  style.textContent = `
    #szInstallBtn {
      position: fixed;
      top: calc(env(safe-area-inset-top, 0px) + 12px);
      left: 12px;
      z-index: 2147483647;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      min-height: 42px;
      padding: 8px 13px;
      border: 1px solid #b8d4c3;
      border-radius: 12px;
      background: #0d3f29;
      color: #fff;
      font: 800 13px/1.2 Tahoma, Arial, sans-serif;
      cursor: pointer;
      white-space: nowrap;
      box-shadow: 0 3px 12px #102d1b30;
    }
    #szInstallBtn:active { transform: scale(.97); }
    #szInstallBtn:focus-visible { outline: 3px solid #75b997; outline-offset: 3px; }
    @media(max-width:520px) {
      #szInstallBtn { min-height: 38px; padding: 7px 10px; font-size: 12px; }
    }
  `;
  document.head.appendChild(style);

  const button = document.createElement('button');
  button.id = 'szInstallBtn';
  button.type = 'button';
  button.textContent = '＋ ' + config.label;
  button.setAttribute('aria-label', config.label);
  button.title = 'إضافة ' + config.title + ' إلى الشاشة الرئيسية';
  (document.body || document.documentElement).appendChild(button);

  const scanner = path.includes('/s.scaner/');
  const swUrl = scanner ? './sw.js' : '../sw.js';
  const swScope = scanner ? './' : '../';
  const registerWorker = () => {
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register(swUrl, { scope: swScope }).catch(() => {});
    }
  };
  if (document.readyState === 'complete') registerWorker();
  else window.addEventListener('load', registerWorker, { once: true });

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    installEvent = event;
    button.textContent = '＋ ' + config.label;
    button.title = 'اضغط هنا لبدء التثبيت';
  });

  const hideAfterInstall = () => {
    installed = true;
    button.hidden = true;
  };
  window.addEventListener('appinstalled', hideAfterInstall);

  button.addEventListener('click', async () => {
    if (installed || isStandalone()) {
      button.hidden = true;
      return;
    }

    if (installEvent) {
      const promptEvent = installEvent;
      installEvent = null;
      try {
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === 'accepted') hideAfterInstall();
      } catch (_) {
        window.alert('تعذر فتح نافذة التثبيت. جرّب تحديث الصفحة ثم اضغط الزر مرة ثانية.');
      }
      return;
    }

    const help = /iphone|ipad|ipod/i.test(navigator.userAgent)
      ? 'لتثبيت التطبيق على الآيفون: افتح الصفحة في Safari، اضغط مشاركة، ثم «إضافة إلى الشاشة الرئيسية».'
      : 'التثبيت المباشر غير متاح حالياً من المتصفح. افتح قائمة Chrome (⋮) واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية». إذا لم يظهر الخيار، حدّث الصفحة وتأكد من فتح الرابط عبر HTTPS.';
    window.alert(help);
  });
})();