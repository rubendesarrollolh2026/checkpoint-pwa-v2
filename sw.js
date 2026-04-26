const CACHE="checkpoint-v99";

const FILES=[
"/checkpoint-pwa-v2/",
"/checkpoint-pwa-v2/index.html",
"/checkpoint-pwa-v2/style.css",
"/checkpoint-pwa-v2/app-v2.js",
"/checkpoint-pwa-v2/manifest.json"
];


self.addEventListener(
"install",
e=>{

self.skipWaiting();

e.waitUntil(
caches.open(CACHE)
.then(cache=>
cache.addAll(FILES)
)

);

}
);



self.addEventListener(
"activate",
e=>{

e.waitUntil(
caches.keys()
.then(keys=>
Promise.all(
keys.map(
k=>{
if(k!==CACHE){
return caches.delete(k);
}
}
)
)
)
);

clients.claim();

}
);



self.addEventListener(
"fetch",
e=>{

e.respondWith(
fetch(e.request)
.catch(
()=>caches.match(
e.request
)
)
);

}
);
