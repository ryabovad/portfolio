/* ============================================================
   Даша Рябова — портфолио  |  common.js
   Подключается на ВСЕХ страницах.
   Содержит: анимации появления + меню.
   ============================================================ */

(() => {
  'use strict';


  /* ---------- Анимация появления при скролле ---------- */

  function initReveal() {
    // Если браузер против анимаций — пропускаем
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const SELECTORS = [
      '.hero', '.project', '.shot',
      '.contact-card', '.shots-heading h2',
      '.case-title', '.case-meta', '.case-media',
      '.case-beforeafter', '.case-hypotheses',
      '.case-callout', '.case-results', '.case-outro',
    ].join(', ');

    const items = document.querySelectorAll(SELECTORS);

    items.forEach(el => el.classList.add('reveal'));

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

    items.forEach(el => io.observe(el));
  }


  /* ---------- Бургер-меню ---------- */

  function initMenu() {
    const burger = document.querySelector('.burger');
    const menu   = document.getElementById('menu');
    if (!burger || !menu) return;

    function open() {
      menu.hidden = false;
      void menu.offsetWidth;           // reflow → запускает transition
      menu.classList.add('is-open');
      document.body.classList.add('menu-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Закрыть меню');
    }

    function close() {
      menu.classList.remove('is-open');
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Открыть меню');
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 320);
    }

    function toggle() {
      if (menu.classList.contains('is-open')) close();
      else open();
    }

    burger.addEventListener('click', toggle);

    menu.querySelectorAll('[data-close-menu]').forEach(el => el.addEventListener('click', close));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) close();
    });

    menu.querySelectorAll('a[href]').forEach(a => a.addEventListener('click', close));
  }


  /* ---------- Инициализация ---------- */

  // Экспортируем reInit для main.js (динамический контент рендерится после DOMContentLoaded)
  window.__revealReInit = initReveal;

  document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initReveal();
  });
})();
