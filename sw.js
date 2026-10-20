/* Modo sin conexión. La página va primero por la red (así cada actualización llega sola al abrir con internet)
   y, si no hay red, se usa la última copia guardada. Íconos y fuentes: copia guardada primero. */
const VERSION="202610200250",CACHE="mesa-"+VERSION,BASE=["./","index.html","manifest.webmanifest","icono-180.png","icono-192.png","icono-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  if(r.url.includes("version.json"))return;                          // siempre por la red
  if(r.mode==="navigate"||r.url.endsWith("index.html")){
    e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put("index.html",cp));return res;})
      .catch(()=>caches.match("index.html")));return;}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put(r,cp));return res;})));
});
