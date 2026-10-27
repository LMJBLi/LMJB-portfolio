// 静态页面生成器
// 用法：node tools/build.mjs
// 开发预览可写：SITE_OUT=D:\Table\DSH_Test\_stage node tools/build.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, PROJECTS } from './site-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = process.env.SITE_OUT ? path.resolve(process.env.SITE_OUT) : ROOT;

const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const NAV = [
  { href: './index.html', label: '主页', en: 'HOME', key: 'home' },
  { href: './projects.html', label: '作品', en: 'WORKS', key: 'projects' },
  { href: './contacts.html', label: '联系方式', en: 'CONTACT', key: 'contacts' }
];

const YEAR = '2026';

/* ---------------- shared partials ---------------- */

function themeInit() {
  return `<script>(function(){try{var q=new URLSearchParams(location.search).get('theme');var s=localStorage.getItem('darkMode');var d=q?q==='dark':s==='dark';if(d)document.documentElement.classList.add('dark');}catch(e){}})();</script>`;
}

function head({ title, desc, bodyClass = '' }) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <meta name="theme-color" content="#f3f0e8" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:type" content="website" />
    <link rel="icon" href="./img/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="./css/main.css" />
    ${themeInit()}
  </head>
  <body class="${bodyClass}">
    <a class="skip-link" href="#main">跳到主要内容</a>
    <div class="progress" aria-hidden="true"><span></span></div>`;
}

function header(active) {
  const links = NAV.map(
    (item) => `<a class="nav__link${item.key === active ? ' is-active' : ''}" href="${item.href}"${
      item.key === active ? ' aria-current="page"' : ''
    }><span>${NAV.indexOf(item) + 1 < 10 ? '0' : ''}${NAV.indexOf(item) + 1}</span>${esc(
      item.label
    )}</a>`
  ).join('\n          ');

  const mobileLinks = NAV.map(
    (item) => `<a class="mobile-menu__link${item.key === active ? ' is-active' : ''}" href="${item.href}"${
      item.key === active ? ' aria-current="page"' : ''
    }><span>${String(NAV.indexOf(item) + 1).padStart(2, '0')}</span>${esc(item.label)}</a>`
  ).join('\n        ');

  return `
    <header class="site-head">
      <div class="site-head__inner">
        <a class="brand" href="./index.html" aria-label="李家起作品集首页">
          <span class="brand__mark" aria-hidden="true"></span>
          <span class="brand__text">
            <strong>LMJB</strong>
            <small>李家起 · PORTFOLIO</small>
          </span>
        </a>

        <nav class="nav" aria-label="主导航">
          ${links}
        </nav>

        <div class="site-head__tools">
          <button class="theme-btn" type="button" aria-label="切换深浅色" aria-pressed="false">
            <span class="theme-btn__icon" aria-hidden="true">◐</span>
          </button>
          <button class="menu-btn" type="button" aria-label="打开菜单" aria-expanded="false" aria-controls="mobile-menu">
            <span></span><span></span>
          </button>
        </div>
      </div>
    </header>

    <div class="mobile-menu" id="mobile-menu">
      <nav class="mobile-menu__nav" aria-label="移动端导航">
        ${mobileLinks}
      </nav>
      <div class="mobile-menu__foot">
        <a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
        <span>${esc(SITE.location)}</span>
        <span>© ${YEAR} 李家起 · LMJB</span>
      </div>
    </div>`;
}

function socialList() {
  return `<ul class="social">
            ${SITE.socials
              .map(
                (item) =>
                  `<li><a href="${esc(item.href)}" aria-label="${esc(item.label)}" target="_blank" rel="noreferrer"><img src="./img/icons/${item.icon}" alt="" width="18" height="18" loading="lazy" /></a></li>`
              )
              .join('\n            ')}
          </ul>`;
}

function footer() {
  return `
    <footer class="footer" id="site-footer">
      <div class="container">
        <div class="footer__top">
          <a class="footer__brand" href="./index.html" aria-label="返回首页">
            <span class="brand__mark" aria-hidden="true"></span>
            <span>
              <strong>LMJB</strong>
              <small>李家起 · PORTFOLIO ${SITE.years}</small>
            </span>
          </a>
          <nav class="footer__nav" aria-label="页脚导航">
            <a href="./index.html">主页</a>
            <a href="./projects.html">作品</a>
            <a href="./contacts.html">联系方式</a>
            <a href="mailto:${esc(SITE.email)}">Email</a>
          </nav>
          ${socialList()}
        </div>
        <div class="footer__bottom">
          <span>© ${YEAR} 李家起 · 保留所有权利</span>
          <div class="footer__meta">
            <span>PORTFOLIO ${SITE.years}</span>
            <span>${esc(SITE.location)}</span>
            <span>DESIGNED &amp; BUILT BY LMJB</span>
          </div>
        </div>
      </div>
    </footer>

    <div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="作品大图">
      <div class="lightbox__bar">
        <span class="lightbox__brand">LMJB / ARCHIVE</span>
        <button class="lightbox__close" type="button" aria-label="关闭大图">关闭 <span aria-hidden="true">✕</span></button>
      </div>
      <div class="lightbox__stage">
        <button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="上一张">←</button>
        <figure class="lightbox__figure">
          <img class="lightbox__img" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="" />
        </figure>
        <button class="lightbox__nav lightbox__nav--next" type="button" aria-label="下一张">→</button>
      </div>
      <div class="lightbox__foot">
        <div class="lightbox__caption">
          <span class="lightbox__caption-text"></span>
          <span class="lightbox__caption-meta"></span>
        </div>
        <div class="lightbox__counter">01 <em>/</em> 01</div>
      </div>
    </div>

    <noscript><style>[data-reveal]{opacity:1 !important;transform:none !important}</style></noscript>
    <script src="./js/main.js"></script>
  </body>
</html>`;
}

function ctaBand() {
  return `
    <section class="cta" id="contact" aria-labelledby="cta-title">
      <div class="container">
        <div class="cta__inner">
          <div>
            <p class="eyebrow eyebrow--light">CONTACT / 保持联系</p>
            <h2 class="cta__title" id="cta-title">有项目、实习，<br />或只是想聊聊？<em>随时。</em></h2>
            <a class="cta__mail" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>
          </div>
          <div class="cta__aside">
            <strong>BASED IN</strong>
            ${esc(SITE.location)}<br />
            开放实习与项目合作<br />
            通常 24 小时内回复
          </div>
        </div>
      </div>
    </section>`;
}

function workCard(project, index) {
  const delay = index % 2 === 0 ? 0 : 80;
  return `<a class="work-card" href="./${project.file}" data-reveal style="transition-delay:${delay}ms">
            <span class="work-card__media">
              <img
                src="./${project.cover}"
                alt="${esc(project.coverAlt)}"
                width="${project.coverW}"
                height="${project.coverH}"
                loading="lazy"
                decoding="async"
              />
              <span class="work-card__tag">${project.no} / ${esc(project.en)}</span>
            </span>
            <div class="work-card__body">
              <span class="work-card__no" aria-hidden="true">${project.no}</span>
              <span>
                <h3 class="work-card__title">${esc(project.title)}</h3>
                <span class="work-card__en">${esc(project.en)}</span>
              </span>
              <span class="work-card__count">${project.count} PIECES</span>
            </div>
          </a>`;
}

/* ---------------- page: home ---------------- */

function renderHome() {
  const works = PROJECTS.map(workCard).join('\n          ');

  const marqueeItems = ['游戏策划', '场景美术', '平面设计', '非线性编辑', '课程作品', '视觉实验'];
  const marqueeGroup = `<div class="marquee__group">${marqueeItems
    .map((item) => `<span>${item}</span><i>✳</i>`)
    .join('')}</div>`;

  const stats = SITE.stats
    .map(
      (stat) => `<div>
              <p class="stat__value">${stat.value}</p>
              <p class="stat__label">${stat.label}</p>
              <p class="stat__en">${stat.en}</p>
            </div>`
    )
    .join('\n            ');

  const awards = SITE.awards.map((award) => `<li>${esc(award)}</li>`).join('\n              ');
  const tools = SITE.tools.map((tool) => `<span>${esc(tool)}</span>`).join('');

  return `${head({
    title: '李家起 · 个人作品集 / Portfolio',
    desc: '李家起的个人作品集：游戏策划、场景美术、平面设计、非线性编辑与视觉实验。',
    bodyClass: 'page page--home'
  })}
    ${header('home')}

    <main id="main">
      <section class="hero" aria-labelledby="hero-title">
        <div class="container hero__grid">
          <div class="hero__copy">
            <p class="eyebrow">PORTFOLIO — ${SITE.years}</p>
            <h1 class="hero__title" id="hero-title">
              <span class="hero__name">${esc(SITE.name)}</span>
              <span class="hero__en">${esc(SITE.en)}</span>
            </h1>
            <p class="hero__role">${esc(SITE.role)}</p>
            <p class="hero__lede">${esc(SITE.intro)}</p>

            <div class="hero__actions">
              <a class="btn btn--solid" href="./projects.html">查看作品</a>
              <a class="link-arrow" href="./contacts.html">聊聊合作</a>
            </div>

            <dl class="hero__meta">
              <div>
                <dt>NOW</dt>
                <dd>${esc(SITE.school)} · ${esc(SITE.major)}</dd>
              </div>
              <div>
                <dt>BASE</dt>
                <dd>${esc(SITE.location)}</dd>
              </div>
              <div>
                <dt>STATUS</dt>
                <dd><span class="dot" style="display:inline-block;width:6px;height:6px;margin-right:7px;border-radius:50%;background:#2e9e5b;box-shadow:0 0 0 4px rgba(46,158,91,.12);vertical-align:1px"></span>开放合作</dd>
              </div>
            </dl>
          </div>

          <div class="hero__visual">
            <figure class="hero__figure">
              <div class="hero__frame">
                <img
                  src="./img/work/p4/garden-pavilion.jpg"
                  alt="苏南园林场景，池水倒映亭子与假山"
                  width="1037"
                  height="519"
                  fetchpriority="high"
                />
              </div>
              <figcaption class="hero__caption">
                <span>苏南园林 · 场景重建</span>
                <span>UNREAL ENGINE / 2025</span>
              </figcaption>
            </figure>

            <a class="hero__mini" href="./project-1.html" aria-label="查看《苍猊》海报项目">
              <img src="./img/work/p1/poster-portrait.jpg" alt="《苍猊》竖版海报" width="1273" height="1800" />
              <span>《苍猊》· 字体海报</span>
            </a>

            <span class="hero__dots" aria-hidden="true"></span>
            <span class="hero__vertical">SELECTED WORKS / ${YEAR}</span>
          </div>
        </div>

        <div class="container hero__foot">
          <span class="hero__scroll"><i aria-hidden="true"></i> SCROLL TO EXPLORE</span>
          <span>厦门 · 福建 / 24.48° N, 118.08° E</span>
          <span>${SITE.years} · SIX PROJECTS</span>
        </div>
      </section>

      <section class="section" id="works" aria-labelledby="works-title">
        <div class="container">
          <div class="section-head" data-reveal>
            <span class="section-head__index">01</span>
            <h2 class="section-head__title" id="works-title">精选作品</h2>
            <span class="section-head__en">SELECTED WORKS</span>
            <span class="section-head__rule" aria-hidden="true"></span>
            <a class="section-head__link" href="./projects.html">全部 06 组</a>
          </div>

          <div class="work-grid">
            ${works}
          </div>
        </div>
      </section>

      <div class="marquee" aria-hidden="true">
        <div class="marquee__track">
          ${marqueeGroup}
          ${marqueeGroup}
        </div>
      </div>

      <section class="section section--paper" id="about" aria-labelledby="about-title">
        <div class="container about">
          <div class="about__intro" data-reveal>
            <div class="section-head">
              <span class="section-head__index">02</span>
              <h2 class="section-head__title" id="about-title">关于</h2>
              <span class="section-head__en">ABOUT / PROFILE</span>
              <span class="section-head__rule" aria-hidden="true"></span>
            </div>

            <p class="about__quote">把故事放进<em>画面</em>里，<br />让画面自己说话。</p>
            <p class="about__text">${esc(SITE.about)}</p>

            <div class="about__stats">
              ${stats}
            </div>
          </div>

          <div class="about__details">
            <div class="about__block" data-reveal>
              <h3>Education</h3>
              <div>
                <p>${esc(SITE.school)}<br />${esc(SITE.major)}<br />2023 — 至今（在读）</p>
              </div>
            </div>

            <div class="about__block" data-reveal>
              <h3>Awards</h3>
              <ul>
                ${awards}
              </ul>
            </div>

            <div class="about__block" data-reveal>
              <h3>Tools</h3>
              <div class="about__tools">${tools}</div>
            </div>
          </div>
        </div>
      </section>

      ${ctaBand()}
    </main>

    ${footer()}`;
}

/* ---------------- page: works index ---------------- */

function renderProjects() {
  const cards = PROJECTS.map((project, index) => {
    const card = workCard(project, index);
    return card.replace(
      '<span>',
      `<span>`
    );
  }).join('\n          ');

  return `${head({
    title: '作品索引 · 李家起 / Works',
    desc: '六组作品：平面设计、游戏策划、非线性编辑、场景美术、课程作品与其他视觉美术。',
    bodyClass: 'page page--works'
  })}
    ${header('projects')}

    <main id="main">
      <section class="page-head" aria-labelledby="works-title">
        <div class="container page-head__grid">
          <div>
            <p class="eyebrow">INDEX / 06 PROJECTS</p>
            <h1 class="page-title" id="works-title">作品索引<span class="page-title__en">SELECTED WORKS ${SITE.years}</span></h1>
          </div>
          <div class="page-head__aside">
            <div>
              <p class="page-lede">六组作品，从海报与字体到场景与游戏原型。每一组都保留了过程稿：线稿、白盒、界面截图，以及那些最终没有用上的尝试。</p>
              <p class="page-lede">点击任意一组进入完整档案。</p>
            </div>
            <p class="page-count">06<span>PROJECTS</span></p>
          </div>
        </div>
        <span class="page-head__deco" aria-hidden="true"></span>
      </section>

      <section class="section works-index" aria-label="全部作品">
        <div class="container">
          <div class="works-index__note">
            <p>FILTER — ALL / 2023—2025</p>
            <p>38 FILES · 06 CATEGORIES</p>
          </div>
          <div class="work-grid">
            ${cards}
          </div>
        </div>
      </section>

      ${ctaBand()}
    </main>

    ${footer()}`;
}

/* ---------------- page: project detail ---------------- */

function lightboxAttrs(item, num) {
  return `data-lightbox data-full="./${item.src}" data-caption="${esc(
    item.title
  )}" data-meta="${esc(item.meta)} · PIECE ${String(num).padStart(2, '0')}"`;
}

function pieceMarkup(item, num) {
  return `<figure class="piece" style="--span:${item.span || 6};--ar:${item.ar || '4 / 3'}" data-reveal>
              <a
                class="piece__media"
                href="./${item.src}"
                ${lightboxAttrs(item, num)}
                aria-label="查看大图：${esc(item.title)}"
              >
                <img
                  src="./${item.src}"
                  alt="${esc(item.alt)}"
                  width="${item.w}"
                  height="${item.h}"
                  loading="lazy"
                  decoding="async"
                />
                ${item.gif ? '<span class="piece__badge">GIF</span>' : ''}
                <span class="piece__zoom" aria-hidden="true">↗</span>
              </a>
              <figcaption class="piece__cap">
                <span class="piece__num">${String(num).padStart(2, '0')}</span>
                <span>
                  <h3>${esc(item.title)}</h3>
                  <p>${esc(item.meta)}</p>
                </span>
              </figcaption>
            </figure>`;
}

function noteMarkup(item, projectNo) {
  const tags = (item.tags || []).map((tag) => `<span class="tag">${esc(tag)}</span>`).join('');
  return `<aside class="note-card" style="--span:${item.span || 6}" data-no="${esc(
    projectNo
  )}" data-reveal>
              <p class="note-card__eyebrow">${esc(item.eyebrow || 'PROCESS')}</p>
              <div>
                <h3>${esc(item.title)}</h3>
                <p>${esc(item.body)}</p>
              </div>
              <div class="note-card__tags">${tags}</div>
            </aside>`;
}

function featureMarkup(block, num, total, projectNo) {
  const item = block.item;
  const tags = (block.tags || []).map((tag) => `<span class="tag">${esc(tag)}</span>`).join('');
  return `<section class="gallery-feature" aria-label="${esc(item.title)}" data-reveal>
              <a
                class="gallery-feature__media"
                href="./${item.src}"
                ${lightboxAttrs(item, num)}
                aria-label="查看大图：${esc(item.title)}"
              >
                <img
                  src="./${item.src}"
                  alt="${esc(item.alt)}"
                  width="${item.w}"
                  height="${item.h}"
                  loading="lazy"
                  decoding="async"
                />
                <span class="piece__zoom" aria-hidden="true">↗</span>
              </a>
              <div class="gallery-feature__panel" data-no="${esc(projectNo)}">
                <div>
                  <p class="eyebrow">${esc(block.eyebrow || 'KEY VISUAL')}</p>
                  <p class="gallery-feature__quote">${esc(block.quote)}</p>
                  <p class="gallery-feature__body">${esc(block.body)}</p>
                </div>
                <div>
                  <div class="gallery-feature__tags">${tags}</div>
                  <div class="gallery-feature__foot">
                    <span>${esc(item.meta)}</span>
                    <span>PIECE ${String(num).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
                  </div>
                </div>
              </div>
            </section>`;
}

function renderGallery(project) {
  let num = 0;
  const total = project.count;
  return project.blocks
    .map((block) => {
      if (block.type === 'feature') {
        num += 1;
        return featureMarkup(block, num, total, project.no);
      }
      if (block.type !== 'row') return '';
      const items = block.items
        .map((item) => {
          if (item.kind === 'note') return noteMarkup(item, project.no);
          num += 1;
          return pieceMarkup(item, num);
        })
        .join('\n            ');
      return `<div class="gallery-row" style="display:contents">${items}</div>`;
    })
    .join('\n          ');
}

function projectNav(project) {
  const index = PROJECTS.indexOf(project);
  const prev = PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  return `<section class="project-nav" aria-label="项目导航">
        <div class="container">
          <div class="project-nav__inner">
            <a href="./${prev.file}">
              <small>← PREVIOUS / 上一组</small>
              <strong>${esc(prev.title)}</strong>
              <em>${esc(prev.en)}</em>
            </a>
            <a href="./${next.file}">
              <small>NEXT / 下一组 →</small>
              <strong>${esc(next.title)}</strong>
              <em>${esc(next.en)}</em>
            </a>
          </div>
        </div>
      </section>`;
}

function renderProject(project) {
  const tags = project.tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join('');
  return `${head({
    title: `${project.title} · 作品 ${project.no} — 李家起`,
    desc: `${project.title} / ${project.en}：${project.intro}`,
    bodyClass: `page page--project project-${project.id}`
  })}
    ${header('projects')}

    <main id="main">
      <section class="project-head">
        <div class="container">
          <nav class="breadcrumb" aria-label="面包屑">
            <a href="./projects.html">作品</a>
            <span>/</span>
            <span>${project.no}</span>
            <span>/</span>
            <span>${esc(project.title)}</span>
          </nav>

          <div class="project-head__grid">
            <div>
              <p class="eyebrow">PROJECT ${project.no} / 06</p>
              <h1 class="project-title">${esc(project.title)}</h1>
              <span class="project-title__en">${esc(project.en)}</span>
            </div>
            <div>
              <p class="project-head__lede">${esc(project.intro)}</p>
              <div class="statement__tags" style="margin-top:22px">${tags}</div>
            </div>
          </div>

          <dl class="project-meta">
            <div>
              <dt>Year</dt>
              <dd>${esc(project.year)}</dd>
            </div>
            <div>
              <dt>Type</dt>
              <dd>${esc(project.type)}</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>${esc(project.tools)}</dd>
            </div>
            <div>
              <dt>Pieces</dt>
              <dd>${project.count} 件 / ${project.no} of 06</dd>
            </div>
          </dl>
        </div>
      </section>

      <figure class="project-lead" style="--lead-ar: ${project.leadW} / ${project.leadH}" data-reveal>
        <div class="project-lead__frame">
          <img
            src="./${project.lead}"
            alt="${esc(project.coverAlt)}"
            width="${project.leadW}"
            height="${project.leadH}"
            fetchpriority="high"
          />
        </div>
        <figcaption>
          <span>${esc(project.leadCaption)}</span>
          <span>${esc(project.en)} / ${esc(project.year)}</span>
        </figcaption>
      </figure>

      <div class="container project-body">
        <section class="statement" aria-label="项目陈述">
          <p class="statement__label">Statement</p>
          <div>
            <blockquote>${esc(project.statement)}</blockquote>
            <p class="statement__text">${esc(project.intro)}</p>
          </div>
        </section>

        <div class="gallery-head">
          <h2>全部作品</h2>
          <p>ALL PIECES / ${project.count} FILES</p>
        </div>

        <div class="gallery" id="gallery">
          ${renderGallery(project)}
        </div>
      </div>

      ${projectNav(project)}
    </main>

    ${footer()}`;
}

/* ---------------- page: contacts ---------------- */

function renderContacts() {
  return `${head({
    title: '联系方式 · 李家起 / Contact',
    desc: '联系李家起：邮箱 2437597827@qq.com，电话 +173 5929 4104，福建厦门。',
    bodyClass: 'page page--contacts'
  })}
    ${header('contacts')}

    <main id="main">
      <section class="contact-hero">
        <div class="container">
          <p class="eyebrow">CONTACT / 保持联系</p>
          <h1 class="contact-title">一起做点<br /><em>有意思的事。</em></h1>
          <p class="contact-lede">如果你在找游戏策划、场景美术或视觉设计方向的实习与合作伙伴，欢迎直接写信给我。附上项目简介与时间线，我会更快回复。</p>

          <a class="contact-mail" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a>

          <dl class="contact-info">
            <div>
              <dt>Phone / 电话</dt>
              <dd><a href="tel:${esc(SITE.phoneHref)}">${esc(SITE.phone)}</a></dd>
            </div>
            <div>
              <dt>Location / 所在地</dt>
              <dd>${esc(SITE.location)}</dd>
            </div>
            <div>
              <dt>Status / 状态</dt>
              <dd><span class="dot"></span>开放实习与项目合作</dd>
            </div>
          </dl>

          <div class="contact-card">
            <div class="contact-card__left">
              <p class="label-mono">CURRENTLY / 目前</p>
              <h2>在福州大学读<span class="nowrap">数字媒体艺术</span>，<br />也在寻找下一段<br />有意思的合作。</h2>
              <p>可以一起做游戏原型、场景概念、海报与字体，或者只是交换一些关于电影、音乐和游戏的想法。厦门与福州都可以线下见面。</p>
            </div>
            <div class="contact-card__right">
              <p class="label-mono">A NOTE / 一句话</p>
              <blockquote>“先让空间讲清楚规则，再让规则长出情绪。”</blockquote>
              ${socialList()}
            </div>
          </div>

          <div class="contact-map">
            <span>24.48° N / 118.08° E — XIAMEN, FUJIAN</span>
            <span>© ${YEAR} 李家起 · LMJB</span>
          </div>
        </div>
      </section>
    </main>

    ${footer()}`;
}

/* ---------------- write ---------------- */

function ensureAssets() {
  if (OUT === ROOT) return;
  fs.mkdirSync(OUT, { recursive: true });
  ['css', 'js'].forEach((dir) => {
    fs.cpSync(path.join(ROOT, dir), path.join(OUT, dir), {
      recursive: true,
      force: true
    });
  });
  const imgTarget = path.join(OUT, 'img');
  if (!fs.existsSync(path.join(imgTarget, 'work'))) {
    fs.cpSync(path.join(ROOT, 'img'), imgTarget, { recursive: true, force: true });
  }
  fs.mkdirSync(path.join(imgTarget), { recursive: true });
  const stageIcon = path.join(imgTarget, 'icons');
  if (!fs.existsSync(stageIcon)) {
    fs.cpSync(path.join(ROOT, 'img', 'icons'), stageIcon, {
      recursive: true,
      force: true
    });
  }
}

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#d71919"/>
  <path d="M18 15v34h28" fill="none" stroke="#f3f0e8" stroke-width="6"/>
  <rect x="40" y="15" width="6" height="6" fill="#f3f0e8"/>
</svg>
`;

const pages = [
  ['index.html', renderHome()],
  ['projects.html', renderProjects()],
  ['contacts.html', renderContacts()],
  ...PROJECTS.map((project) => [project.file, renderProject(project)])
];

ensureAssets();
fs.mkdirSync(path.join(OUT, 'img'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'img', 'favicon.svg'), favicon, 'utf8');

pages.forEach(([name, html]) => {
  fs.writeFileSync(path.join(OUT, name), html, 'utf8');
  console.log(`wrote ${path.relative(ROOT, path.join(OUT, name)) || name}`);
});

// 旧入口保留一个跳转，避免旧链接失效
fs.writeFileSync(
  path.join(OUT, 'project-page.html'),
  `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=./projects.html" />
    <link rel="canonical" href="./projects.html" />
    <title>作品索引 · 李家起</title>
  </head>
  <body>
    <p>正在前往作品索引…… <a href="./projects.html">点击这里</a></p>
  </body>
</html>
`,
  'utf8'
);

console.log(`\nBuilt ${pages.length + 1} files → ${OUT}`);
