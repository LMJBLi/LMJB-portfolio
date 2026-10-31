/* =========================================================
   李家起 · 个人作品集 V3
   指针文字聚光 / 字体扰动 / 几何视差 / 主题色同步
   渐进增强：不支持或触屏时保持原始静态排版
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------- theme-color meta ---------------- */
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  function syncThemeMeta() {
    if (!themeMeta) return;
    themeMeta.setAttribute(
      'content',
      root.classList.contains('dark') ? '#0b0b0a' : '#f3f0e8'
    );
  }

  if (themeMeta) {
    new MutationObserver(syncThemeMeta).observe(root, {
      attributes: true,
      attributeFilter: ['class']
    });
    syncThemeMeta();
  }

  /* ---------------- flatten inline hover shadows ---------------- */
  // 1/2/3 与 4/5/6 的页面内联脚本会在 mouseenter 时写入阴影，
  // 这里在它们之后接管，保持 V3 的扁平描边风格。
  document.querySelectorAll('#main .work-card, #main .piece').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      el.style.setProperty('box-shadow', 'none', 'important');
      el.style.setProperty('transform', 'translateY(-4px)', 'important');
    });
  });

  /* ---------------- pointer parallax on geometry ---------------- */
  if (finePointer.matches && !reduceMotion.matches) {
    let px = 0;
    let py = 0;
    let frame = null;

    function updateParallax() {
      frame = null;
      root.style.setProperty('--pointer-x', px.toFixed(3));
      root.style.setProperty('--pointer-y', py.toFixed(3));
    }

    window.addEventListener(
      'pointermove',
      function (event) {
        px = (event.clientX / window.innerWidth - 0.5) * 2;
        py = (event.clientY / window.innerHeight - 0.5) * 2;
        if (frame === null) frame = window.requestAnimationFrame(updateParallax);
      },
      { passive: true }
    );

    window.addEventListener(
      'pointerout',
      function (event) {
        if (event.relatedTarget) return;
        px = 0;
        py = 0;
        if (frame === null) frame = window.requestAnimationFrame(updateParallax);
      },
      { passive: true }
    );
  }

  /* ---------------- character split ---------------- */

  function splitCharacters(el) {
    if (!el || el.dataset.typeReady === '1') return el && el.dataset.typeReady === '1';

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest('.page-title__en, .type-char')) {
          return NodeFilter.FILTER_REJECT;
        }
        if (!node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    if (!nodes.length) return false;

    nodes.forEach(function (node) {
      const fragment = document.createDocumentFragment();
      const text = node.nodeValue;
      for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        if (char === '\n' || char === '\r' || char === '\t') continue;
        const span = document.createElement('span');
        span.className = 'type-char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        fragment.appendChild(span);
      }
      node.parentNode.replaceChild(fragment, node);
    });

    el.classList.add('type-distort');
    el.dataset.typeReady = '1';
    return true;
  }

  function resetChar(item) {
    item.el.style.setProperty('--pull', '0');
    item.el.style.setProperty('--tx', '0px');
    item.el.style.setProperty('--ty', '0px');
    item.el.style.setProperty('--rot', '0deg');
    item.el.style.setProperty('--sc', '1');
  }

  function initTypeDistortion(el) {
    if (!splitCharacters(el)) return;

    let chars = [];
    let frame = null;
    let latestEvent = null;

    function measure() {
      const rect = el.getBoundingClientRect();
      chars = Array.prototype.map.call(
        el.querySelectorAll('.type-char'),
        function (char) {
          const r = char.getBoundingClientRect();
          return {
            el: char,
            x: r.left - rect.left + r.width / 2,
            y: r.top - rect.top + r.height / 2
          };
        }
      );
    }

    function paint(event) {
      frame = null;
      if (!event) return;
      if (!chars.length) measure();
      const rect = el.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;
      const radius = Math.max(130, Math.min(210, rect.width * 0.4));

      for (let i = 0; i < chars.length; i += 1) {
        const item = chars[i];
        const dx = mx - item.x;
        const dy = my - item.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / radius);

        if (influence < 0.001) {
          resetChar(item);
          continue;
        }

        const strength = influence * influence;
        item.el.style.setProperty('--pull', strength.toFixed(3));
        item.el.style.setProperty(
          '--tx',
          (dx * 0.11 * strength).toFixed(2) + 'px'
        );
        item.el.style.setProperty(
          '--ty',
          (dy * 0.11 * strength).toFixed(2) + 'px'
        );
        item.el.style.setProperty(
          '--rot',
          (dx * 0.028 * strength).toFixed(2) + 'deg'
        );
        item.el.style.setProperty('--sc', (1 + strength * 0.045).toFixed(3));
      }
    }

    el.addEventListener('pointerenter', function (event) {
      measure();
      el.classList.add('is-active');
      latestEvent = event;
    });

    el.addEventListener('pointermove', function (event) {
      latestEvent = event;
      if (frame === null) {
        frame = window.requestAnimationFrame(function () {
          paint(latestEvent);
        });
      }
    });

    el.addEventListener('pointerleave', function () {
      el.classList.remove('is-active');
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
      chars.forEach(resetChar);
    });

    window.addEventListener('resize', measure, { passive: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure).catch(function () {});
    }
    window.requestAnimationFrame(measure);
  }

  if (finePointer.matches && !reduceMotion.matches) {
    document
      .querySelectorAll(
        '.hero__name, .project-title, .page-title, .section-head__title, .project-nav strong, .hero__role'
      )
      .forEach(initTypeDistortion);
  }

  /* ---------------- pointer spotlight ---------------- */

  function initSpotlight(el) {
    if (!el) return;
    el.classList.add('spotlight-text');

    let frame = null;
    let latest = null;

    function update(event) {
      frame = null;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--spot-x', event.clientX - rect.left + 'px');
      el.style.setProperty('--spot-y', event.clientY - rect.top + 'px');
    }

    el.addEventListener('pointerenter', function (event) {
      latest = event;
      update(event);
    });

    el.addEventListener('pointermove', function (event) {
      latest = event;
      if (frame === null) {
        frame = window.requestAnimationFrame(function () {
          update(latest);
        });
      }
    });

    el.addEventListener('pointerleave', function () {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
      el.style.setProperty('--spot-x', '-999px');
      el.style.setProperty('--spot-y', '-999px');
    });
  }

  if (finePointer.matches) {
    document
      .querySelectorAll(
        '.about__quote, .cta__title, .contact-title, .gallery-feature__quote, .note-card h3'
      )
      .forEach(initSpotlight);
  }
})();
