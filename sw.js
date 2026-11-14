const VER="tangkap-buah-v1";
const LOCAL=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(LOCAL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VER).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Cache-first; fail MediaPipe (jsdelivr/googleapis) disimpan automatik selepas dimuat sekali dalam talian
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:false}).then(hit=>{
    if(hit)return hit;
    return fetch(e.request).then(r=>{
      if(r&&(r.ok||r.type==="opaque")){const cp=r.clone();caches.open(VER).then(c=>c.put(e.request,cp))}
      return r;
    }).catch(()=>caches.match("index.html"));
  }));
});
