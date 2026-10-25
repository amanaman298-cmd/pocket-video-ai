const CACHE = 'pocketvideo-shell-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('pocketvideo-shell-')&&key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()]));
});
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET')return;
  const requestURL=new URL(event.request.url);
  if(requestURL.origin!==self.location.origin)return;
  event.respondWith(caches.match(event.request).then(saved=>saved||fetch(event.request)));
});
