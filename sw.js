const CACHE_NAME = 'fixeq-portfolio-v1.2.0';
const STATIC_CACHE = 'fixeq-static-v1.2.0';
const DYNAMIC_CACHE = 'fixeq-dynamic-v1.2.0';

const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/reset.css',
    '/css/variables.css',
    '/css/base.css',
    '/css/components.css',
    '/css/hero.css',
    '/css/about.css',
    '/css/skills.css',
    '/css/projects.css',
    '/css/footer.css',
    '/css/construction.css',
    '/css/animations.css',
    '/css/responsive.css',
    '/js/utils.js',
    '/js/main.js',
    '/js/navigation.js',
    '/js/animations.js',
    '/js/components.js',
    '/js/data-loader.js',
    '/data/data.json',
    '/data/projects.json',
    '/assets/avatar.jpg',
    
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
];


const CACHEABLE_EXTENSIONS = ['.html', '.css', '.js', '.json', '.jpg', '.png', '.svg', '.webp'];


self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Caching static files...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('[SW] Static files cached successfully');
                return self.skipWaiting(); 
            })
            .catch((error) => {
                console.error('[SW] Failed to cache static files:', error);
            })
    );
});


self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('[SW] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Service Worker activated');
                return self.clients.claim(); 
            })
    );
});


self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    
    if (request.method !== 'GET') {
        return;
    }
    
    
    if (!request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        handleFetchRequest(request, url)
    );
});

async function handleFetchRequest(request, url) {
    try {
        
        if (isStaticResource(url)) {
            return await cacheFirstStrategy(request);
        }
        
        
        if (isHTMLRequest(request) || isAPICall(url)) {
            return await networkFirstStrategy(request);
        }
        
        
        return await networkFirstStrategy(request);
        
    } catch (error) {
        console.error('[SW] Fetch error:', error);
        
        
        return getOfflineFallback(request);
    }
}


async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        console.log('[SW] Serving from cache:', request.url);
        return cachedResponse;
    }
    
    
    console.log('[SW] Fetching from network:', request.url);
    const networkResponse = await fetch(request);
    
    
    if (networkResponse.ok && isCacheable(request.url)) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
}


async function networkFirstStrategy(request) {
    try {
        console.log('[SW] Trying network first:', request.url);
        const networkResponse = await fetch(request);
        
        
        if (networkResponse.ok && isCacheable(request.url)) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        
        console.log('[SW] Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}


function isStaticResource(url) {
    const pathname = url.pathname.toLowerCase();
    return pathname.includes('/css/') || 
           pathname.includes('/js/') || 
           pathname.includes('/assets/') ||
           pathname.includes('/fonts/') ||
           pathname.endsWith('.jpg') || 
           pathname.endsWith('.png') || 
           pathname.endsWith('.svg') || 
           pathname.endsWith('.webp') ||
           pathname.endsWith('.woff2') ||
           pathname.endsWith('.woff');
}

function isHTMLRequest(request) {
    return request.headers.get('accept').includes('text/html');
}

function isAPICall(url) {
    return url.pathname.includes('/api/') || 
           url.pathname.includes('/data/') ||
           url.pathname.endsWith('.json');
}

function isCacheable(url) {
    return CACHEABLE_EXTENSIONS.some(ext => url.toLowerCase().includes(ext));
}

async function getOfflineFallback(request) {
    
    if (isHTMLRequest(request)) {
        const cachedIndex = await caches.match('/index.html');
        if (cachedIndex) {
            return cachedIndex;
        }
    }
    
    
    return new Response(
        JSON.stringify({ 
            error: 'Offline', 
            message: 'You are currently offline. Please check your connection.' 
        }),
        {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    );
}


self.addEventListener('periodicsync', (event) => {
    console.log('[SW] Periodic sync triggered:', event.tag);
    
    if (event.tag === 'portfolio-update') {
        event.waitUntil(checkForUpdates());
    }
});

async function checkForUpdates() {
    try {
        
        console.log('[SW] Checking for portfolio updates...');
        
        
        const response = await fetch('/data/projects.json');
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put('/data/projects.json', response.clone());
        }
        
        return Promise.resolve();
    } catch (error) {
        console.error('[SW] Failed to check for updates:', error);
    }
}


self.addEventListener('error', (event) => {
    console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service Worker script loaded successfully');
