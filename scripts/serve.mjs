import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { projectRoot, renderFromFiles } from './render.mjs';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const files = {'/':['index.html','text/html'], '/index.html':['index.html','text/html'], '/style.css':['style.css','text/css'], '/app.js':['app.js','text/javascript'], '/robots.txt':['robots.txt','text/plain']};
const port = Number(process.env.PORT || 3000);
createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const file = files[pathname];
  if (pathname.startsWith('/assets/')) {
    const base = resolve(fileURLToPath(new URL('public/assets/', projectRoot)));
    try {
      const asset = resolve(base, decodeURIComponent(pathname.slice('/assets/'.length)));
      if (!asset.startsWith(base + sep)) { res.writeHead(404); res.end('Not found'); return; }
      const type = {jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',avif:'image/avif',svg:'image/svg+xml',gif:'image/gif'}[asset.split('.').pop().toLowerCase()];
      if (!type) { res.writeHead(404); res.end('Not found'); return; }
      const body = await readFile(asset);
      res.writeHead(200, {'Content-Type':type}); res.end(body);
    } catch { res.writeHead(404); res.end('Not found'); }
    return;
  }
  if (!file) { res.writeHead(404, {'Content-Type':'text/plain'}); res.end('Not found'); return; }
  try { const body = file[0] === 'index.html' ? await renderFromFiles() : await readFile(new URL(file[0], projectRoot)); res.writeHead(200, {'Content-Type':file[1] + '; charset=utf-8', 'Cache-Control':'no-store'}); res.end(body); }
  catch (error) { console.error(error.message); res.writeHead(500, {'Content-Type':'text/plain; charset=utf-8'}); res.end(`Unable to render preview: ${error.message}`); }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://localhost:${port}`));
