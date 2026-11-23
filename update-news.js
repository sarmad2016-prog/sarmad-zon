(() => {
  'use strict';
  const announcements = [
    {
      id: '2026-11-23-library-icon-round-v2',
      tag: 'تحديث المكتبة',
      title: 'أيقونة جديدة ونافذة للتحديثات',
      body: 'اعتمدنا أيقونة دائرية جديدة للمكتبة. وأضفنا هذه النافذة حتى تصلك أخبار البرامج والميزات الجديدة مع شرح مختصر عند فتح المكتبة أو أي برنامج.'
    }
  ];
  const keyPrefix = 'sarmad-zone-announcement-seen:';
  const unseen = announcements.filter(item => {
    try { return localStorage.getItem(keyPrefix + item.id) !== '1'; }
    catch (_) { return true; }
  });
  if (!unseen.length) return;

  const show = () => {
    if (!document.body || document.getElementById('szNewsOverlay')) return;
    const style = document.createElement('style');
    style.textContent = `
      #szNewsOverlay{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:16px;background:rgba(7,25,18,.68);backdrop-filter:blur(5px);font-family:Tahoma,Arial,sans-serif}
      #szNewsPanel{width:min(520px,100%);max-height:min(82vh,720px);overflow:auto;background:#f8fbf8;color:#183b2b;border:1px solid #d8e5dc;border-radius:22px;box-shadow:0 24px 80px #0005;padding:20px}
      #szNewsPanel .sz-news-head{display:flex;align-items:center;gap:10px;margin-bottom:14px}
      #szNewsPanel .sz-news-mark{width:42px;height:42px;flex:none;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#ffe66b,#e4b900);font-size:22px;box-shadow:0 3px 10px #8b6b1833}
      #szNewsPanel h2{font-size:20px;margin:0;color:#0d3f29}
      #szNewsPanel .sz-news-sub{font-size:12px;color:#66766c;margin-top:3px}
      #szNewsPanel .sz-news-item{padding:14px;margin:12px 0;border:1px solid #dce8df;border-radius:15px;background:#fff}
      #szNewsPanel .sz-news-tag{display:inline-block;padding:4px 9px;border-radius:30px;background:#e8f2eb;color:#286044;font-size:11px;font-weight:700;margin-bottom:8px}
      #szNewsPanel h3{font-size:16px;margin:0 0 7px;color:#174b32}
      #szNewsPanel p{font-size:14px;line-height:1.85;margin:0;color:#526158}
      #szNewsClose{display:block;width:100%;border:0;border-radius:12px;padding:12px;background:linear-gradient(110deg,#15583b,#2f8057);color:#fff;font-weight:800;font-size:14px;cursor:pointer;margin-top:16px}
      #szNewsClose:focus-visible{outline:3px solid #d7ae3d;outline-offset:3px}
      @media(max-width:480px){#szNewsPanel{padding:16px;border-radius:18px}#szNewsPanel h2{font-size:18px}}
    `;
    const overlay = document.createElement('div');
    overlay.id = 'szNewsOverlay';
    overlay.innerHTML = '<section id="szNewsPanel" role="dialog" aria-modal="true" aria-labelledby="szNewsTitle" dir="rtl"><div class="sz-news-head"><div class="sz-news-mark" aria-hidden="true">✦</div><div><h2 id="szNewsTitle">آخر التحديثات</h2><div class="sz-news-sub">أهم الإضافات الجديدة في مكتبتي الرقمية</div></div></div><div id="szNewsItems"></div><button id="szNewsClose" type="button">اطلعت، إغلاق</button></section>';
    document.head.appendChild(style);
    document.body.appendChild(overlay);
    const list = overlay.querySelector('#szNewsItems');
    unseen.forEach(item => {
      const article = document.createElement('article');
      article.className = 'sz-news-item';
      const tag = document.createElement('span');
      tag.className = 'sz-news-tag';
      tag.textContent = item.tag;
      const title = document.createElement('h3');
      title.textContent = item.title;
      const body = document.createElement('p');
      body.textContent = item.body;
      article.append(tag, title, body);
      list.appendChild(article);
    });
    const close = () => {
      unseen.forEach(item => {
        try { localStorage.setItem(keyPrefix + item.id, '1'); } catch (_) {}
      });
      overlay.remove();
    };
    overlay.querySelector('#szNewsClose').addEventListener('click', close);
    overlay.querySelector('#szNewsClose').focus();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show, { once: true });
  else show();
})();