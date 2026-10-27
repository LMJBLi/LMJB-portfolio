/* =========================================================
   李家起 · 个人作品集
   主题切换 / 滚动进度 / 移动端菜单 / 入场动画 / 灯箱
   ========================================================= */
(function () {
  'use strict';

  const root = document.documentElement;
  const body = document.body;

  /* ---------------- theme ---------------- */
  const themeBtn = document.querySelector('.theme-btn');

  function syncThemeUI() {
    const isDark = root.classList.contains('dark');
    body.classList.toggle('dark', isDark);
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(isDark));
      themeBtn.setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
      const icon = themeBtn.querySelector('.theme-btn__icon');
      if (icon) icon.textContent = isDark ? '◑' : '◐';
      const title = themeBtn.querySelector('.theme-btn__label');
      if (title) title.textContent = isDark ? 'LIGHT' : 'DARK';
    }
  }

  function setTheme(theme, persist) {
    root.classList.toggle('dark', theme === 'dark');
    if (persist) {
      try {
        localStorage.setItem('darkMode', theme);
      } catch (err) {
        /* ignore */
      }
    }
    syncThemeUI();
  }

  syncThemeUI();

  // 通过 ?theme=light / ?theme=dark 预览指定主题（不写入本地偏好）
  try {
    const queryTheme = new URLSearchParams(window.location.search).get('theme');
    if (queryTheme === 'light' || queryTheme === 'dark') {
      setTheme(queryTheme, false);
    }
  } catch (err) {
    /* ignore */
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', toggleThemeWithFade);
  }

  // 首次访问默认浅色；仅恢复用户手动选择过的主题
  // 系统深色偏好不覆盖作品集的纸面主视觉

  function toggleThemeWithFade() {
    const next = root.classList.contains('dark') ? 'light' : 'dark';
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion) {
      setTheme(next, true);
      return;
    }

    if (typeof document.startViewTransition === 'function') {
      try {
        document.startViewTransition(function () {
          setTheme(next, true);
        });
        return;
      } catch (err) {
        /* fall through to the CSS colour fade */
      }
    }

    root.classList.add('theme-fading');
    setTheme(next, true);
    window.setTimeout(function () {
      root.classList.remove('theme-fading');
    }, 700);
  }

  /* ---------------- header & progress ---------------- */
  const header = document.querySelector('.site-head');
  const progress = document.querySelector('.progress span');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('is-scrolled', y > 8);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      progress.style.transform = 'scaleX(' + ratio + ')';
    }
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------------- mobile menu ---------------- */
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  function closeMenu() {
    if (!mobileMenu || !mobileMenu.classList.contains('is-open')) return;
    mobileMenu.classList.remove('is-open');
    body.classList.remove('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', '打开菜单');
    }
  }

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('is-open');
    body.classList.add('menu-open');
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', '关闭菜单');
    }
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
      closeLightbox();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });

  /* ---------------- reveal on scroll ---------------- */
  const revealItems = Array.prototype.slice.call(
    document.querySelectorAll('[data-reveal]')
  );

  revealItems.forEach(function (item) {
    const group = item.parentElement;
    if (!group) return;
    const siblings = Array.prototype.filter.call(group.children, function (child) {
      return child.hasAttribute && child.hasAttribute('data-reveal');
    });
    const index = siblings.indexOf(item);
    if (index > 0) {
      item.style.transitionDelay = Math.min(index * 70, 280) + 'ms';
    }
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }

  /* ---------------- lightbox ---------------- */
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox__img');
  const lightboxCaption = lightbox.querySelector('.lightbox__caption-text');
  const lightboxMeta = lightbox.querySelector('.lightbox__caption-meta');
  const lightboxCounter = lightbox.querySelector('.lightbox__counter');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav--next');

  let triggers = [];
  let current = 0;
  let lastFocused = null;
  let closeTimer = null;

  function collectTriggers() {
    triggers = Array.prototype.slice.call(
      document.querySelectorAll('[data-lightbox]')
    );
  }

  function render(index) {
    if (!triggers.length) return;
    current = (index + triggers.length) % triggers.length;
    const trigger = triggers[current];
    const full = trigger.getAttribute('data-full') || trigger.getAttribute('href');
    const caption = trigger.getAttribute('data-caption') || '';
    const meta = trigger.getAttribute('data-meta') || '';
    const img = trigger.querySelector('img');

    lightboxImg.src = full;
    lightboxImg.alt = img ? img.alt : caption;
    if (lightboxCaption) lightboxCaption.textContent = caption;
    if (lightboxMeta) lightboxMeta.textContent = meta;
    if (lightboxCounter) {
      lightboxCounter.innerHTML =
        String(current + 1).padStart(2, '0') +
        ' <em>/</em> ' +
        String(triggers.length).padStart(2, '0');
    }
  }

  function openLightbox(trigger) {
    collectTriggers();
    const index = triggers.indexOf(trigger);
    if (index < 0) return;
    lastFocused = document.activeElement;
    if (closeTimer) {
      window.clearTimeout(closeTimer);
      closeTimer = null;
    }
    render(index);
    lightbox.hidden = false;
    window.requestAnimationFrame(function () {
      lightbox.classList.add('is-open');
    });
    body.classList.add('lightbox-open');
    if (closeBtn) closeBtn.focus({ preventScroll: true });
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    body.classList.remove('lightbox-open');
    closeTimer = window.setTimeout(function () {
      lightbox.hidden = true;
      lightboxImg.removeAttribute('src');
      closeTimer = null;
    }, 320);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus({ preventScroll: true });
    }
  }

  document.addEventListener('click', function (event) {
    const trigger = event.target.closest('[data-lightbox]');
    if (!trigger) return;
    event.preventDefault();
    openLightbox(trigger);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      render(current - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      render(current + 1);
    });
  }

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox || event.target.classList.contains('lightbox__stage')) {
      closeLightbox();
    }
  });

  // 将 Tab 焦点限制在灯箱内
  lightbox.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    const focusables = Array.prototype.slice.call(
      lightbox.querySelectorAll('button:not([disabled])')
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') render(current - 1);
    if (event.key === 'ArrowRight') render(current + 1);
  });
})();
