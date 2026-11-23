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
  const style = document.createElement('style');
  style.textContent = `
    #szInstallBtn{position:fixed;top:calc(env(safe-area-inset-top,0px) + 12px);left:12px;z-index:2147483000;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:42px;padding:8px 13px;border:1px solid #b8d4c3;border-radius:12px;background:#0d3f29;color:#fff;font:800 13px/1.2 Tahoma,Arial,sans-serif;cursor:pointer;white-space:nowrap;box-shadow:0 3px 12px #102d1b30}
    #szInstallBtn:active{transform:scale(.97)}#szInstallBtn:focus-visible{outline:3px solid #75b997;outline-offset:3px}
    #szInstallOverlay{position:fixed;inset:0;z-index:2147483001;display:grid;place-items:center;padding:16px;background:rgba(7,25,18,.68);backdrop-filter:blur(5px);font-family:Tahoma,Arial,sans-serif}
    #szInstallPanel{width:min(440px,100%);max-height:84vh;overflow:auto;background:#fbfdfb;color:#193b2b;border:1px solid #dce8df;border-radius:22px;padding:20px;box-shadow:0 24px 80px #0005}
    #szInstallPanel .szTop{display:flex;align-items:center;gap:11px;margin-bottom:14px}
    #szInstallPanel .szMark{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;background:linear-gradient(145deg,#15583b,#2f8057);color:#fff;font-size:23px}
    #szInstallPanel h2{margin:0;color:#0d3f29;font-size:19px}
    #szInstallPanel .szSub{margin-top:4px;color:#718077;font-size:12px}
    #szInstallPanel .szIntro{font-size:14px;line-height:1.9;color:#53645a;margin:12px 0}
    #szInstallPanel .szSteps{padding:13px 16px;background:#f0f6f1;border:1px solid #dce9df;border-radius:15px;margin:12px 0}
    #szInstallPanel ol{margin:0;padding-right:20px}
    #szInstallPanel li{padding:4px 0;font-size:14px;line-height:1.8}
    #szInstallPanel .szNote{font-size:12px;line-height:1.8;color:#69776e;margin:10px 0 0}
    #szInstallClose{width:100%;border:0;border-radius:12px;padding:12px;background:linear-gradient(110deg,#15583b,#2f8057);color:#fff;font-weight:800;font-size:14px;cursor:pointer;margin-top:12px}
    @media(max-width:480px){#szInstallPanel{padding:16px;border-radius:18px}#szInstallPanel h2{font-size:17px}}
  `;
  document.head.appendChild(style);

  const button=document.createElement('button');
  button.id='szInstallBtn';button.type='button';
  button.textContent='＋ '+config.label;
  button.setAttribute('aria-label',config.label);
  button.title='إضافة '+config.title+' إلى الشاشة الرئيسية';
  (document.body||document.documentElement).appendChild(button);

  const scanner=path.includes('/s.scaner/');
  const swUrl=scanner?'./sw.js':'../sw.js';
  const swScope=scanner?'./':'../';
  const registerWorker=()=>{if('serviceWorker'in navigator&&/^https?:$/.test(location.protocol)){navigator.serviceWorker.register(swUrl,{scope:swScope}).catch(()=>{});}};
  if(document.readyState==='complete')registerWorker();else window.addEventListener('load',registerWorker,{once:true});

  const hide=()=>{button.hidden=true;};
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installEvent=event;});
  window.addEventListener('appinstalled',hide);

  function showGuide(){
    if(document.getElementById('szInstallOverlay'))return;
    const ua=navigator.userAgent||'';
    let heading='التثبيت من المتصفح';
    let steps=['افتح قائمة المتصفح (⋮ أو زر المشاركة).','اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».','وافق على الإضافة؛ ستظهر أيقونة '+config.title+' على جهازك.'];
    let note='قد تختلف تسمية الخيار حسب إصدار المتصفح. إذا لم يظهر، حدّث الصفحة وجرب مرة أخرى.';
    if(/iphone|ipad|ipod/i.test(ua)){
      heading='إضافة إلى شاشة الآيفون';
      steps=['افتح هذه الصفحة في متصفح Safari.','اضغط زر المشاركة أسفل الشاشة.','اختر «إضافة إلى الشاشة الرئيسية».','اضغط «إضافة» للتأكيد.'];
      note='هذه الطريقة هي المعتمدة على أجهزة iPhone وiPad.';
    }else if(/SamsungBrowser/i.test(ua)){
      heading='التثبيت من Samsung Internet';
      steps=['اضغط زر القائمة (☰) في المتصفح.','اختر «إضافة الصفحة إلى» ثم «الشاشة الرئيسية»، أو خيار «تثبيت التطبيق» إذا ظهر.','أكد الإضافة.'];
    }else if(/Chrome/i.test(ua)&&/Android/i.test(ua)){
      heading='التثبيت من Chrome';
      steps=['اضغط قائمة Chrome (⋮) أعلى الشاشة.','اختر «تثبيت التطبيق» إن ظهر. وإذا لم يظهر، اختر «إضافة إلى الشاشة الرئيسية».','إذا ظهرت شاشة تأكيد، اضغط «تثبيت» أو «إضافة».'];
    }
    const overlay=document.createElement('div');overlay.id='szInstallOverlay';
    const panel=document.createElement('section');panel.id='szInstallPanel';panel.dir='rtl';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
    const top=document.createElement('div');top.className='szTop';
    const mark=document.createElement('div');mark.className='szMark';mark.textContent='＋';
    const titles=document.createElement('div');const h=document.createElement('h2');h.textContent=heading;const sub=document.createElement('div');sub.className='szSub';sub.textContent='خطوات بسيطة لإضافة '+config.title+' إلى جهازك';titles.append(h,sub);top.append(mark,titles);
    const intro=document.createElement('p');intro.className='szIntro';intro.textContent='يمكنك فتح '+config.title+' لاحقاً مباشرة من الشاشة الرئيسية، دون الحاجة للبحث عن الرابط كل مرة.';
    const box=document.createElement('div');box.className='szSteps';const ol=document.createElement('ol');steps.forEach(s=>{const li=document.createElement('li');li.textContent=s;ol.appendChild(li);});box.appendChild(ol);
    const n=document.createElement('p');n.className='szNote';n.textContent=note;
    const close=document.createElement('button');close.id='szInstallClose';close.type='button';close.textContent='فهمت، إغلاق';close.addEventListener('click',()=>overlay.remove());
    panel.append(top,intro,box,n,close);overlay.appendChild(panel);document.body.appendChild(overlay);close.focus();
    overlay.addEventListener('click',e=>{if(e.target===overlay)overlay.remove();});
    document.addEventListener('keydown',function esc(e){if(e.key==='Escape'&&document.getElementById('szInstallOverlay')){overlay.remove();document.removeEventListener('keydown',esc);}});
  }

  button.addEventListener('click',async()=>{
    if(isStandalone()){hide();return;}
    if(installEvent){
      const ev=installEvent;installEvent=null;
      try{await ev.prompt();const choice=await ev.userChoice;if(choice&&choice.outcome==='accepted')hide();}
      catch(_){showGuide();}
      return;
    }
    showGuide();
  });
})();