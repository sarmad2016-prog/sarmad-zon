// عامل خدمة خاص بصفحة "ساحة الألعاب" فقط:
// يخزّن صفحة الساحة نفسها (index.html) لتفتح عند ضعف الشبكة، ولا يتدخل بأي ملف أو برنامج آخر بنفس المجلد.
const CACHE = 'sahat-alaab-v1';
const ROOT = new URL('./', self.location).pathname;           // مجلد الساحة
const isGamePage = url => url.origin === self.location.origin &&
  (url.pathname === ROOT || url.pathname === ROOT + 'index.html');

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || !isGamePage(url)) return;   // أي شيء آخر يمر كما هو
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(ROOT, copy)); }
      return res;
    }).catch(() => caches.match(ROOT).then(r => r || Response.error()))
  );
});
