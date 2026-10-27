/* =========================================================
   作品集粒子背景 · 视差滚动版
   - 粒子随页面滚动产生层次位移（parallax）
   - 移动端按屏幕面积增强密度
   - 自动跟随暗色模式
   - 页面可通过 window.PARTICLE_BG_OVERRIDE 覆盖参数
   ========================================================= */
(function () {
  'use strict';

  const canvas = document.getElementById('particle-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  /* ---------------- 可调参数 ---------------- */
  const CFG = {
    count: 70,
    // 粒子尺寸已调大（原 1.5 / 5）
    sizeMin: 2.5,
    sizeMax: 8,
    speed: 0.22,
    alpha: 0.35,
    pointerRadius: 120,
    pointerForce: 0.3,
    maxDpr: 2,
    parallaxMin: 0.35,
    parallaxMax: 1.0
  };

  // 页面级覆盖
  if (window.PARTICLE_BG_OVERRIDE) {
    Object.assign(CFG, window.PARTICLE_BG_OVERRIDE);
  }

  /* ---------------- 移动端增强 ---------------- */
  const isTouch = matchMedia('(pointer: coarse)').matches;
  if (isTouch) {
    const area = window.innerWidth * window.innerHeight;
    const baseArea = 390 * 844;
    const areaRatio = Math.max(0.8, Math.min(1.35, area / baseArea));

    CFG.count = Math.round(CFG.count * 1.7 * areaRatio);
    const cap = window.innerWidth < 768 ? 160 : 220;
    if (CFG.count > cap) CFG.count = cap;

    // 移动端同样调大，但保持相对桌面略小
    CFG.sizeMin = 2;
    CFG.sizeMax = Math.max(6.5, CFG.sizeMax * 0.85);
    CFG.alpha = Math.min(CFG.alpha * 1.2, 0.55);
    CFG.pointerRadius = 90;
    CFG.pointerForce = 0.45;
    CFG.speed *= 0.9;
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    CFG.count = Math.min(CFG.count, 25);
    CFG.speed *= 0.2;
  }

  /* ---------------- 配色 ---------------- */
  const PALETTE = {
    light: [[59, 130, 246], [139, 92, 246], [16, 185, 129], [236, 72, 153]],
    dark:  [[96, 165, 250], [167, 139, 250], [52, 211, 153], [244, 114, 182]]
  };

  let dark = detectDark();

  function detectDark() {
    const cls =
      (document.documentElement.className + ' ' + document.body.className)
        .toLowerCase();
    if (/\b(dark|dark-mode|dark-theme|theme-dark)\b/.test(cls)) return true;

    const bg = getComputedStyle(document.body).backgroundColor;
    const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/);
    if (m && (m[4] === undefined || +m[4] > 0.5)) {
      const lum = 0.299 * +m[1] + 0.587 * +m[2] + 0.114 * +m[3];
      return lum < 128;
    }
    return false;
  }

  function pickColor() {
    const arr = dark ? PALETTE.dark : PALETTE.light;
    const c = arr[(Math.random() * arr.length) | 0];
    return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
  }

  const mod = (n, m) => ((n % m) + m) % m;

  /* ---------------- 尺寸 ---------------- */
  let W = 0, H = 0, dpr = 1, prevW = 0, prevH = 0;
  const MARGIN = 60;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, CFG.maxDpr);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (prevW && prevH && ps.length) {
      const rx = W / prevW;
      const ry = H / prevH;
      for (let i = 0; i < ps.length; i++) {
        ps[i].x *= rx;
        ps[i].y *= ry;
      }
    }
    prevW = W;
    prevH = H;
  }

  /* ---------------- 粒子 ---------------- */
  let ps = [];

  function spawn() {
    const a = Math.random() * Math.PI * 2;
    const v = CFG.speed * (0.4 + Math.random() * 0.8);
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v,
      r: CFG.sizeMin + Math.random() * (CFG.sizeMax - CFG.sizeMin),
      depth: CFG.parallaxMin + Math.random() * (CFG.parallaxMax - CFG.parallaxMin),
      c: pickColor(),
      a: CFG.alpha * (0.5 + Math.random() * 0.5),
      sx: 0,
      sy: 0
    };
  }

  function rebuild() {
    ps = [];
    for (let i = 0; i < CFG.count; i++) ps.push(spawn());
  }

  function recolor() {
    for (let i = 0; i < ps.length; i++) {
      ps[i].c = pickColor();
    }
  }

  /* ---------------- 指针 ---------------- */
  const ptr = { x: -1e4, y: -1e4, on: false };

  /* ---------------- 更新 ---------------- */
  function update(dt) {
    const f = dt * 60;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const r2 = CFG.pointerRadius * CFG.pointerRadius;
    const periodX = W + MARGIN * 2;
    const periodY = H + MARGIN * 2;
    const minV = CFG.speed * 0.3;

    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];

      p.x += p.vx * f;
      p.y += p.vy * f;

      const damp = Math.pow(0.985, f);
      p.vx *= damp;
      p.vy *= damp;

      const s2 = p.vx * p.vx + p.vy * p.vy;
      if (s2 < minV * minV) {
        const a = Math.atan2(p.vy, p.vx) || Math.random() * Math.PI * 2;
        p.vx = Math.cos(a) * minV;
        p.vy = Math.sin(a) * minV;
      }

      p.x = mod(p.x + MARGIN, periodX) - MARGIN;
      p.y = mod(p.y + MARGIN, periodY) - MARGIN;

      p.sx = mod(p.x + MARGIN, periodX) - MARGIN;
      p.sy = mod(p.y - scrollY * p.depth + MARGIN, periodY) - MARGIN;

      if (ptr.on) {
        const dx = p.sx - ptr.x;
        const dy = p.sy - ptr.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const k = (1 - d / CFG.pointerRadius) * CFG.pointerForce;
          p.vx += (dx / d) * k * f;
          p.vy += (dy / d) * k * f;
        }
      }
    }
  }

  /* ---------------- 绘制 ---------------- */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      if (
        p.sx < -p.r - 10 || p.sx > W + p.r + 10 ||
        p.sy < -p.r - 10 || p.sy > H + p.r + 10
      ) continue;
      ctx.globalAlpha = p.a;
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ---------------- 主循环 ---------------- */
  let raf = null, last = 0, paused = false;

  function loop(t) {
    raf = requestAnimationFrame(loop);
    if (paused) return;
    if (!last) last = t;
    let dt = (t - last) / 1000;
    last = t;
    if (dt > 0.1) dt = 0.1;
    update(dt);
    draw();
  }

  /* ---------------- 事件 ---------------- */
  function onMove(e) {
    ptr.x = e.clientX;
    ptr.y = e.clientY;
    ptr.on = true;
  }
  function onOut(e) {
    if (!e.relatedTarget) ptr.on = false;
  }
  function onTouchStart(e) {
    if (e.touches.length) {
      ptr.x = e.touches[0].clientX;
      ptr.y = e.touches[0].clientY;
      ptr.on = true;
    }
  }
  function onTouchMove(e) {
    if (e.touches.length) {
      ptr.x = e.touches[0].clientX;
      ptr.y = e.touches[0].clientY;
      ptr.on = true;
    }
  }
  function onTouchEnd(e) {
    if (e.touches.length === 0) ptr.on = false;
  }
  function onVis() {
    paused = document.hidden;
    if (!paused) last = 0;
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseout', onOut, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
  window.addEventListener('touchcancel', onTouchEnd, { passive: true });
  document.addEventListener('visibilitychange', onVis);

  /* ---------------- 跟随主题切换 ---------------- */
  const mo = new MutationObserver(function () {
    const d = detectDark();
    if (d !== dark) {
      dark = d;
      recolor();
    }
  });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  /* ---------------- 启动 ---------------- */
  resize();
  rebuild();
  raf = requestAnimationFrame(loop);

  window.addEventListener('beforeunload', function () {
    cancelAnimationFrame(raf);
    mo.disconnect();
  });
})();