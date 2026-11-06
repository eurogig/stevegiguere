import { readFile } from 'node:fs/promises';

export const projectRoot = new URL('../', import.meta.url);

const escape = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));
const lines = value => escape(value).replace(/\n/g, '<br>');

function requiredString(value, path) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`content.json: ${path} must be a non-empty string`);
}

function validateUrl(value, path, image = false) {
  requiredString(value, path);
  if (image && /^\/assets\/[a-zA-Z0-9_./-]+$/.test(value) && !value.split('/').includes('..')) return;
  let url;
  try { url = new URL(value); } catch { throw new Error(`content.json: ${path} must be an absolute HTTPS URL${image ? ' or /assets/ path' : ''}`); }
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error(`content.json: ${path} must use HTTPS without embedded credentials`);
}

function requireFields(object, fields, path) {
  for (const field of fields) requiredString(object?.[field], `${path}.${field}`);
}

export function renderPage(template, content) {
  requireFields(content.site, ['title', 'description'], 'site');
  requireFields(content.profile, ['name', 'firstName', 'lastName', 'greeting', 'roles', 'intro', 'description', 'aside', 'role', 'employer', 'publicationCredit', 'publisher'], 'profile');
  requireFields(content.profile?.portrait, ['url', 'alt', 'caption'], 'profile.portrait');
  validateUrl(content.profile.portrait.url, 'profile.portrait.url', true);
  for (const key of ['youtube', 'calendly', 'linkedin', 'github']) validateUrl(content.links?.[key], `links.${key}`);
  requireFields(content.signal, ['description'], 'signal');
  requireFields(content.featured, ['category', 'date', 'title', 'subtitle', 'description', 'url', 'linkLabel'], 'featured');
  validateUrl(content.featured.url, 'featured.url');
  if (content.featured.image != null) {
    requireFields(content.featured.image, ['url', 'alt'], 'featured.image');
    validateUrl(content.featured.image.url, 'featured.image.url', true);
  }
  if (!Array.isArray(content.resources)) throw new Error('content.json: resources must be an array');
  content.resources.forEach((item, index) => {
    requireFields(item, ['category', 'title', 'description', 'source', 'url', 'linkLabel'], `resources[${index}]`);
    validateUrl(item.url, `resources[${index}].url`);
  });
  requireFields(content.speaking, ['description'], 'speaking');
  if (!Array.isArray(content.speaking.topics)) throw new Error('content.json: speaking.topics must be an array');
  content.speaking.topics.forEach((item, index) => requireFields(item, ['title', 'description'], `speaking.topics[${index}]`));
  if (!Array.isArray(content.about?.paragraphs) || !content.about.paragraphs.length) throw new Error('content.json: about.paragraphs must be a non-empty array');
  content.about.paragraphs.forEach((text, index) => requiredString(text, `about.paragraphs[${index}]`));
  requiredString(content.about.beyondTheKeyboard, 'about.beyondTheKeyboard');
  requireFields(content.contact, ['headline', 'description'], 'contact');

  const fragments = {
    resources: content.resources.map(item => `<a class="resource" href="${escape(item.url)}" target="_blank" rel="noopener noreferrer"><p class="eyebrow">${escape(item.category)} <span>↗</span></p><h3>${lines(item.title)}</h3><p>${escape(item.description)}</p><span class="resource-footer">${escape(item.source)} <span>${escape(item.linkLabel)} ↗</span></span></a>`).join(''),
    speakingTopics: content.speaking.topics.map((item, index) => `<div><span>${String(index + 1).padStart(2, '0')}</span><h3>${escape(item.title)}</h3><p>${escape(item.description)}</p></div>`).join(''),
    aboutParagraphs: content.about.paragraphs.map(text => `<p>${escape(text)}</p>`).join(''),
    featuredArtwork: content.featured.image
      ? `<div class="feature-art"><img class="feature-image" src="${escape(content.featured.image.url)}" alt="${escape(content.featured.image.alt)}" loading="lazy" decoding="async"></div>`
      : '<div class="feature-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="core">agent</span><span class="orbit-label top">INTENT</span><span class="orbit-label bottom">ENFORCEMENT</span><span class="art-caption">BOUNDARIES ≠ BEHAVIOUR</span></div>'
  };
  return template.replace(/\{\{([a-zA-Z][\w.]*)\}\}/g, (_, key) => {
    if (Object.hasOwn(fragments, key)) return fragments[key];
    const value = key.split('.').reduce((object, part) => object?.[part], content);
    requiredString(value, key);
    return escape(value);
  });
}

export async function renderFromFiles() {
  const [template, json] = await Promise.all([
    readFile(new URL('index.html', projectRoot), 'utf8'),
    readFile(new URL('content.json', projectRoot), 'utf8')
  ]);
  let content;
  try { content = JSON.parse(json); } catch (error) { throw new Error(`content.json: invalid JSON: ${error.message}`); }
  return renderPage(template, content);
}
