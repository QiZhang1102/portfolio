console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

const pages = [
  { url: 'index.html',       title: 'Home' },
  { url: 'project/index.html',  title: 'Projects' },
  { url: 'contact/index.html',  title: 'Contact' },
  { url: 'resume/index.html',   title: 'Resume' },
  { url: 'https://github.com/QiZhang1102', title: 'GitHub' },
];

const GH_REPO = 'portfolio';
const isLocal = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
const BASE_PATH = isLocal ? '/' : `/${GH_REPO}/`;

const nav = document.createElement('nav');
document.body.prepend(nav);

for (const p of pages) {
  let url = p.url;
  url = !url.startsWith('http') ? (BASE_PATH + url) : url;

  nav.insertAdjacentHTML('beforeend', `<a href="${url}">${p.title}</a>`);
}

nav.innerHTML = '';

for (const p of pages) {
  const raw = p.url;
  const isExternal = raw.startsWith('http');
  const finalURL = isExternal ? raw : (BASE_PATH + raw);

  const a = document.createElement('a');
  a.href = finalURL;
  a.textContent = p.title;

  a.toggleAttribute('target', isExternal);
  if (isExternal) a.target = '_blank';

  const normalize = (p) => p.replace(/\/index\.html$/, '/');
  const sameHost = (a.host === location.host);
  const samePath = (normalize(a.pathname) === normalize(location.pathname));

  a.classList.toggle('current', sameHost && samePath);

  nav.append(a);
}