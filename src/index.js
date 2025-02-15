addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST') {
    const text = await request.text();
    const id = new Date().toISOString();
    await TEXT_STORE.put(id, text);
    return new Response('Text saved', { status: 200 });
  } else if (request.method === 'GET') {
    const url = new URL(request.url);
    if (url.pathname === '/management') {
      return new Response(await fetch('management.html'), {
        headers: { 'Content-Type': 'text/html' },
        status: 200
      });
    }
    const keys = await TEXT_STORE.list();
    const texts = await Promise.all(keys.keys.map(key => TEXT_STORE.get(key.name)));
    return new Response(JSON.stringify(texts), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } else {
    return new Response('Method not allowed', { status: 405 });
  }
}
