import { mkdir, copyFile, writeFile, cp } from 'node:fs/promises';
import { projectRoot, renderFromFiles } from './render.mjs';
const html = await renderFromFiles();
const dist = new URL('dist/', projectRoot);
await mkdir(dist, { recursive: true });
await writeFile(new URL('index.html', dist), html);
for (const file of ['style.css','app.js','robots.txt']) await copyFile(new URL(file, projectRoot), new URL(file, dist));
await cp(new URL('public/assets/', projectRoot), new URL('assets/', dist), { recursive: true });
console.log('Static site built in dist/');
