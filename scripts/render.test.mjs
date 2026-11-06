import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { projectRoot, renderPage, renderFromFiles } from './render.mjs';

const template = await readFile(new URL('index.html', projectRoot), 'utf8');
const original = JSON.parse(await readFile(new URL('content.json', projectRoot), 'utf8'));

test('renders the actual page with complete content and no unresolved placeholders', async () => {
  const page = await renderFromFiles();
  assert.ok(page.includes('Goals Are Not Enough'));
  assert.ok(page.includes('https://github.com/eurogig'));
  assert.ok(page.includes('id="signal"'));
  assert.equal(page.includes('{{'), false);
});

test('edits and additional cards are rendered and HTML in content is escaped', () => {
  const content = structuredClone(original);
  content.featured.title = 'New article <script>alert("test")</script>';
  content.resources.push({ ...content.resources[0], title: 'Another experiment\nA second line', url: 'https://example.com/new' });
  const page = renderPage(template, content);
  assert.ok(page.includes('New article &lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;'));
  assert.ok(page.includes('Another experiment<br>A second line'));
  assert.equal((page.match(/class="resource"/g) || []).length, 3);
});

test('all shared contact links change together', () => {
  const content = structuredClone(original);
  content.links.calendly = 'https://example.com/new-booking';
  const page = renderPage(template, content);
  assert.equal((page.match(/https:\/\/example.com\/new-booking/g) || []).length, 2);
  assert.equal(page.includes(original.links.calendly), false);
});

test('rejects broken fields and executable or invalid URLs with useful errors', () => {
  const content = structuredClone(original);
  delete content.featured.title;
  assert.throws(() => renderPage(template, content), /featured.title/);
  for (const url of ['javascript:alert(1)', 'not a url', 'http://example.com']) {
    const invalid = structuredClone(original);
    invalid.featured.url = url;
    assert.throws(() => renderPage(template, invalid), /featured.url/);
  }
});

test('supports an optional article image or the existing illustration', () => {
  const content = structuredClone(original);
  content.featured.image = { url: '/assets/article.jpg', alt: 'An agent architecture' };
  const page = renderPage(template, content);
  assert.ok(page.includes('class="feature-image" src="/assets/article.jpg"'));
  assert.ok(page.includes('alt="An agent architecture"'));
  content.featured.image.url = '/assets/../private.jpg';
  assert.throws(() => renderPage(template, content), /featured.image.url/);
  assert.ok(renderPage(template, original).includes('orbit-one'));
});
