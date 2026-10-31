// 页面质量检查 + 关键交互截图（需 Edge 远程调试端口 9222）
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = Number(process.env.CDP_PORT || 9222);
const ROOT = process.env.SITE_ROOT || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.env.SITE_BASE || 'file:///' + ROOT.replace(/\\/g, '/');
const OUT = process.env.SHOT_OUT || path.join(ROOT, '..', '_ref', 'shots');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const consoleErrors = [];

const targets = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json());
const page = targets.find((t) => t.type === 'page');
if (!page) throw new Error('No page target');

const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const events = new Map();

const ready = new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve);
  ws.addEventListener('error', reject);
});

ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  } else if (msg.method) {
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(
        msg.params.exceptionDetails?.exception?.description ||
          msg.params.exceptionDetails?.text ||
          'unknown exception'
      );
    }
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      consoleErrors.push(msg.params.entry.text);
    }
    (events.get(msg.method) || []).forEach((fn) => fn(msg.params));
  }
});

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

function once(method, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout ' + method)), timeout);
    const handler = (params) => {
      clearTimeout(timer);
      events.set(method, (events.get(method) || []).filter((fn) => fn !== handler));
      resolve(params);
    };
    if (!events.has(method)) events.set(method, []);
    events.get(method).push(handler);
  });
}

async function value(expression, awaitPromise = false) {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(
      result.exceptionDetails.exception?.description || result.exceptionDetails.text
    );
  }
  return result.result.value;
}

async function viewport(width, height, mobile = false) {
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile
  });
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile });
}

async function go(url) {
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url });
  await loaded.catch(() => {});
  await sleep(350);
  await value(`(() => {
    const style = document.createElement('style');
    style.textContent = '*{animation:none !important;transition:none !important}[data-reveal]{opacity:1 !important;transform:none !important}';
    document.head.appendChild(style);
    document.querySelectorAll('img').forEach(img => { img.loading='eager'; img.decoding='sync'; });
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
    return true;
  })()`);
  await value(
    `new Promise(resolve => {
      const imgs = Array.from(document.images);
      let n = 0;
      const check = () => {
        if (imgs.every(img => img.complete)) return resolve(true);
        if (n++ > 100) return resolve(false);
        setTimeout(check, 100);
      };
      check();
    })`,
    true
  );
  await sleep(350);
}

async function shot(name) {
  const { data } = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(data, 'base64'));
  console.log('shot', name);
}

async function scrollTo(selector, offset = 100) {
  await value(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return false;
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - ${offset});
    return true;
  })()`);
  await sleep(300);
}

async function audit(label) {
  const data = await value(`(() => {
    const imgs = Array.from(document.images);
    const broken = imgs.filter(img => img.complete && img.naturalWidth === 0).map(img => img.getAttribute('src'));
    const pendingImgs = imgs.filter(img => !img.complete).map(img => img.getAttribute('src'));
    const links = Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href'));
    return {
      label: ${JSON.stringify(label)},
      title: document.title,
      h1: document.querySelectorAll('h1').length,
      h2: document.querySelectorAll('h2').length,
      images: imgs.length,
      broken,
      pendingImgs,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      bodyScrollWidth: document.body.scrollWidth,
      links,
      emptyAlt: imgs.filter(img => img.getAttribute('alt') === null).length,
      duplicateIds: (() => {
        const ids = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
        return Array.from(new Set(ids.filter((id, i) => ids.indexOf(id) !== i)));
      })()
    };
  })()`);
  return data;
}

const results = [];
const pages = [
  ['index', `${BASE}/index.html?theme=light`],
  ['projects', `${BASE}/projects.html?theme=light`],
  ['contacts', `${BASE}/contacts.html?theme=light`],
  ...Array.from({ length: 6 }, (_, i) => [
    `project-${i + 1}`,
    `${BASE}/project-${i + 1}.html?theme=light`
  ])
];

await ready;
await send('Page.enable');
await send('Runtime.enable');
await send('Log.enable');

for (const [label, url] of pages) {
  await viewport(1440, 1100, false);
  await go(url);
  results.push(await audit(`${label}-desktop`));
  await viewport(390, 844, true);
  await go(url);
  results.push(await audit(`${label}-mobile`));
}

// 灯箱交互
await viewport(1440, 1100, false);
await go(`${BASE}/project-1.html?theme=light`);
await scrollTo('#gallery', 40);
const before = await value(`document.querySelector('[data-lightbox]').getAttribute('data-caption')`);
await value(`document.querySelector('[data-lightbox]').click()`);
await sleep(500);
const open = await value(`(() => {
  const box = document.querySelector('#lightbox');
  return {
    hidden: box.hidden,
    open: box.classList.contains('is-open'),
    src: box.querySelector('.lightbox__img').getAttribute('src'),
    naturalWidth: box.querySelector('.lightbox__img').naturalWidth,
    caption: box.querySelector('.lightbox__caption-text').textContent,
    counter: box.querySelector('.lightbox__counter').textContent.trim(),
    bodyLocked: document.body.classList.contains('lightbox-open')
  };
})()`);
await shot('d-p1-03-lightbox');
await value(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))`);
await sleep(200);
const afterNext = await value(`(() => {
  const box = document.querySelector('#lightbox');
  return {
    src: box.querySelector('.lightbox__img').getAttribute('src'),
    counter: box.querySelector('.lightbox__counter').textContent.trim()
  };
})()`);
await value(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
await sleep(400);
const closed = await value(`(() => ({
  hidden: document.querySelector('#lightbox').hidden,
  open: document.querySelector('#lightbox').classList.contains('is-open'),
  bodyLocked: document.body.classList.contains('lightbox-open')
}))()`);

// 主题切换
await go(`${BASE}/index.html?theme=light`);
const themeBefore = await value(`document.documentElement.classList.contains('dark')`);
await value(`document.querySelector('.theme-btn').click()`);
await sleep(200);
const themeAfter = await value(`({ dark: document.documentElement.classList.contains('dark'), stored: localStorage.getItem('darkMode') })`);
await value(`document.querySelector('.theme-btn').click()`);

// 移动端灯箱与菜单
await viewport(390, 844, true);
await go(`${BASE}/project-1.html?theme=light`);
await scrollTo('#gallery', 20);
await value(`document.querySelector('#gallery [data-lightbox]').click()`);
await sleep(500);
const mobileLightbox = await value(`(() => {
  const nav = document.querySelector('.lightbox__nav--prev').getBoundingClientRect();
  const cap = document.querySelector('.lightbox__caption').getBoundingClientRect();
  const overlap = !(nav.right < cap.left || nav.left > cap.right || nav.bottom < cap.top || nav.top > cap.bottom);
  return {
    imageWidth: document.querySelector('.lightbox__img').naturalWidth,
    overlap,
    nav: { x: Math.round(nav.x), y: Math.round(nav.y), w: Math.round(nav.width), h: Math.round(nav.height) },
    caption: { x: Math.round(cap.x), y: Math.round(cap.y), w: Math.round(cap.width), h: Math.round(cap.height) }
  };
})()`);
await shot('m-p1-04-lightbox-v2');
await value(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
await sleep(400);

await go(`${BASE}/index.html?theme=light`);
await value(`document.querySelector('.menu-btn').click()`);
await sleep(350);
const mobileMenu = await value(`({
  open: document.querySelector('.mobile-menu').classList.contains('is-open'),
  bodyLocked: document.body.classList.contains('menu-open'),
  expanded: document.querySelector('.menu-btn').getAttribute('aria-expanded'),
  links: document.querySelectorAll('.mobile-menu__link').length
})`);
await value(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);

// GIF 行截图
await go(`${BASE}/project-2.html?theme=light`);
await scrollTo('img[src$=".gif"]', 120);
await shot('d-p2-02-gifs');
await go(`${BASE}/project-6.html?theme=light`);
await scrollTo('img[src$=".gif"]', 120);
await shot('d-p6-02-gifs');
await go(`${BASE}/project-5.html?theme=light`);
await scrollTo('.note-card', 120);
await shot('d-p5-02-note');
await go(`${BASE}/contacts.html?theme=light`);
await scrollTo('.contact-card', 80);
await shot('d-contacts-03-card-v2');

// 链接存在性检查
const linkReport = [];
for (const [label, url] of pages) {
  await viewport(1440, 1100, false);
  await go(url);
  const hrefs = await value(`Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href'))`);
  const basePath = path.dirname(new URL(url).pathname.replace(/^\//, '').replace(/\//g, '\\'));
  for (const href of hrefs) {
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) continue;
    const clean = decodeURIComponent(href.split('?')[0].split('#')[0]);
    const target = path.resolve(ROOT, clean.replace(/^\.\//, ''));
    if (!fs.existsSync(target)) {
      linkReport.push({ page: label, href, target });
    }
  }
}

console.log(
  JSON.stringify(
    {
      audits: results,
      lightbox: { before, open, afterNext, closed },
      theme: { before: themeBefore, after: themeAfter },
      mobileLightbox,
      mobileMenu,
      consoleErrors,
      missingLinks: linkReport
    },
    null,
    2
  )
);

ws.close();
