// 通过 Chrome DevTools Protocol 精确截图
// 前置：Edge 以 --remote-debugging-port=9222 启动
// 用法：node tools/capture.mjs

import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.CDP_PORT || 9222);
const OUT = process.env.SHOT_OUT || 'D:\\Table\\DSH_Test\\_ref\\shots';
const BASE =
  process.env.SITE_BASE ||
  'file:///D:/Table/DSH_Test/portfolio-for-everyone-main';

fs.mkdirSync(OUT, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForDebugger() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return res.json();
    } catch (err) {
      /* retry */
    }
    await sleep(250);
  }
  throw new Error('DevTools endpoint not ready');
}

class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.events = new Map();
    this.ready = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve);
      this.ws.addEventListener('error', reject);
    });
    this.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      } else if (msg.method) {
        const handlers = this.events.get(msg.method) || [];
        handlers.forEach((handler) => handler(msg.params));
      }
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.id;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, handler) {
    if (!this.events.has(method)) this.events.set(method, []);
    this.events.get(method).push(handler);
  }

  once(method, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timeout: ${method}`)), timeout);
      const handler = (params) => {
        clearTimeout(timer);
        const list = this.events.get(method) || [];
        this.events.set(
          method,
          list.filter((fn) => fn !== handler)
        );
        resolve(params);
      };
      this.on(method, handler);
    });
  }
}

const targets = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json());
const page = targets.find((t) => t.type === 'page');
if (!page) throw new Error('No page target');
const cdp = new CDP(page.webSocketDebuggerUrl);
await cdp.ready;

await cdp.send('Page.enable');
await cdp.send('Runtime.enable');
await cdp.send('Network.enable');

async function evaluate(expression, awaitPromise = false) {
  const result = await cdp.send('Runtime.evaluate', {
    expression,
    awaitPromise,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(
      'Evaluate failed: ' +
        (result.exceptionDetails.exception?.description ||
          result.exceptionDetails.text)
    );
  }
  return result.result.value;
}

async function setViewport(width, height, mobile = false) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile
  });
  await cdp.send('Emulation.setTouchEmulationEnabled', { enabled: mobile });
}

async function navigate(url) {
  const loaded = cdp.once('Page.loadEventFired');
  await cdp.send('Page.navigate', { url });
  await loaded.catch(() => {});
  await sleep(400);
}

async function settle() {
  // 显示滚动入场内容、暂停动画，给字体和图片加载留出时间
  await evaluate(`(() => {
    const style = document.createElement('style');
    style.id = 'shot-style';
    style.textContent = '*{animation:none !important;transition:none !important}[data-reveal]{opacity:1 !important;transform:none !important}';
    document.head.appendChild(style);
    document.querySelectorAll('img').forEach(img => { img.loading = 'eager'; img.decoding = 'sync'; });
    document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
    return document.fonts ? document.fonts.ready.then(() => true) : true;
  })()`, true);
  await evaluate(
    `new Promise(resolve => {
      const imgs = Array.from(document.images);
      let tick = 0;
      const check = () => {
        if (imgs.every(img => img.complete)) return resolve(true);
        if (tick++ > 90) return resolve(false);
        setTimeout(check, 100);
      };
      check();
    })`,
    true
  );
  await sleep(500);
}

async function scrollToSelector(selector, offset = 96) {
  if (!selector) {
    await evaluate('window.scrollTo(0, 0)');
  } else {
    const ok = await evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return false;
      const y = el.getBoundingClientRect().top + window.scrollY - ${offset};
      window.scrollTo(0, Math.max(0, y));
      return true;
    })()`);
    if (!ok) throw new Error(`Selector not found: ${selector}`);
  }
  await sleep(350);
}

async function screenshot(name) {
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true
  });
  fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(data, 'base64'));
  console.log('shot', name);
}

await waitForDebugger();

const shots = [
  { name: 'd-home-01-hero', url: `${BASE}/index.html?theme=light`, w: 1440, h: 1100 },
  { name: 'd-home-02-works', url: `${BASE}/index.html?theme=light`, w: 1440, h: 1100, sel: '#works' },
  { name: 'd-home-03-about', url: `${BASE}/index.html?theme=light`, w: 1440, h: 1100, sel: '#about' },
  { name: 'd-home-04-contact', url: `${BASE}/index.html?theme=light`, w: 1440, h: 1000, sel: '#contact' },
  { name: 'd-projects-01-top', url: `${BASE}/projects.html?theme=light`, w: 1440, h: 1100 },
  { name: 'd-projects-02-grid', url: `${BASE}/projects.html?theme=light`, w: 1440, h: 1100, sel: '.work-grid' },
  { name: 'd-p1-01-top', url: `${BASE}/project-1.html?theme=light`, w: 1440, h: 1150 },
  { name: 'd-p1-02-gallery', url: `${BASE}/project-1.html?theme=light`, w: 1440, h: 1200, sel: '#gallery' },
  { name: 'd-p2-01-gallery', url: `${BASE}/project-2.html?theme=light`, w: 1440, h: 1200, sel: '#gallery' },
  { name: 'd-p3-01-top', url: `${BASE}/project-3.html?theme=light`, w: 1440, h: 1150 },
  { name: 'd-p3-02-gallery', url: `${BASE}/project-3.html?theme=light`, w: 1440, h: 1200, sel: '#gallery' },
  { name: 'd-p4-01-top', url: `${BASE}/project-4.html?theme=light`, w: 1440, h: 1150 },
  { name: 'd-p4-01-gallery', url: `${BASE}/project-4.html?theme=light`, w: 1440, h: 1200, sel: '#gallery' },
  { name: 'd-p5-01-gallery', url: `${BASE}/project-5.html?theme=light`, w: 1440, h: 1200, sel: '#gallery' },
  { name: 'd-p6-01-top', url: `${BASE}/project-6.html?theme=light`, w: 1440, h: 1150 },
  { name: 'd-p6-01-gallery', url: `${BASE}/project-6.html?theme=light`, w: 1440, h: 1200, sel: '#gallery' },
  { name: 'd-p2-02-dark', url: `${BASE}/project-2.html?theme=dark`, w: 1440, h: 1100, sel: '#gallery' },
  { name: 'd-contacts-01-top', url: `${BASE}/contacts.html?theme=light`, w: 1440, h: 1100 },
  { name: 'd-contacts-02-card', url: `${BASE}/contacts.html?theme=light`, w: 1440, h: 1000, sel: '.contact-card' },
  { name: 'd-home-05-dark', url: `${BASE}/index.html?theme=dark`, w: 1440, h: 1100 },
  { name: 'd-home-06-dark-works', url: `${BASE}/index.html?theme=dark`, w: 1440, h: 1100, sel: '#works' },
  { name: 'm-home-01', url: `${BASE}/index.html?theme=light`, w: 390, h: 844, mobile: true },
  { name: 'm-home-02-works', url: `${BASE}/index.html?theme=light`, w: 390, h: 844, mobile: true, sel: '#works' },
  { name: 'm-home-03-about', url: `${BASE}/index.html?theme=light`, w: 390, h: 844, mobile: true, sel: '#about' },
  { name: 'm-projects-01', url: `${BASE}/projects.html?theme=light`, w: 390, h: 844, mobile: true },
  { name: 'm-p1-01', url: `${BASE}/project-1.html?theme=light`, w: 390, h: 844, mobile: true },
  { name: 'm-p1-02-gallery', url: `${BASE}/project-1.html?theme=light`, w: 390, h: 844, mobile: true, sel: '#gallery' },
  { name: 'm-p1-03-lightbox', url: `${BASE}/project-1.html?theme=light`, w: 390, h: 844, mobile: true, sel: '#gallery', action: 'lightbox' },
  { name: 'm-contacts-01', url: `${BASE}/contacts.html?theme=light`, w: 390, h: 844, mobile: true },
  { name: 'm-menu-01', url: `${BASE}/index.html?theme=light`, w: 390, h: 844, mobile: true, action: 'menu' }
];

let currentUrl = '';
const shotFilter = process.env.SHOT_FILTER || '';
const selectedShots = shotFilter
  ? shots.filter((shot) => shot.name.includes(shotFilter))
  : shots;
for (const shot of selectedShots) {
  await setViewport(shot.w, shot.h, Boolean(shot.mobile));
  if (currentUrl !== shot.url) {
    await navigate(shot.url);
    currentUrl = shot.url;
    await settle();
  }
  await scrollToSelector(shot.sel || null, shot.offset ?? 96);
  if (shot.action === 'menu') {
    await evaluate(`document.querySelector('.menu-btn')?.click()`);
    await sleep(300);
  }
  if (shot.action === 'lightbox') {
    await evaluate(`document.querySelector('#gallery [data-lightbox]')?.click()`);
    await sleep(500);
  }
  await screenshot(shot.name);
}

cdp.ws.close();
console.log('done');
