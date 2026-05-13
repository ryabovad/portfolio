/* ============================================================
   Даша Рябова — портфолио  |  main.js
   Только главная страница: рендер из content.json.
   Меню и анимации — в common.js.
   ============================================================ */

(() => {
  'use strict';

  /* ---------- Утилиты ---------- */

  function fillSlots(name, value) {
    document.querySelectorAll(`[data-slot="${name}"]`).forEach(el => {
      if (el.tagName === 'IMG') { if (value) el.src = value; }
      else el.textContent = value || '';
    });
  }

  function fillLink(name, href) {
    document.querySelectorAll(`[data-link="${name}"]`).forEach(el => {
      if (!href) {
        el.removeAttribute('href');
        el.setAttribute('aria-disabled', 'true');
        el.setAttribute('tabindex', '-1');
        return;
      }
      el.href = href;
      el.removeAttribute('aria-disabled');
      el.removeAttribute('tabindex');
    });
  }

  function esc(str) {
    if (str == null) return '';
    return String(str)
      .replaceAll('&','&amp;').replaceAll('<','&lt;')
      .replaceAll('>','&gt;').replaceAll('"','&quot;')
      .replaceAll("'","&#39;");
  }


  /* ---------- Рендер проекта ---------- */

  function renderProject(p) {
    const metricsHTML = (p.metricsBlocks || [])
      .map(block => {
        const cells = block.map((m, i) => {
          const cell = `<div class="metric">
            <p class="metric__label">${esc(m.label)}</p>
            <p class="metric__value">${esc(m.value)}</p>
          </div>`;
          const div = i < block.length - 1 ? '<div class="metric__divider" aria-hidden="true"></div>' : '';
          return cell + div;
        }).join('');
        return `<div class="metrics-row">${cells}</div>`;
      }).join('');

    const hasLink = !!(p.url && p.url.trim());
    const tag  = hasLink ? 'a' : 'article';
    const attr = hasLink ? `href="${esc(p.url)}" class="project"` : 'class="project" aria-disabled="true"';
    const metricsSection = metricsHTML ? `<div class="project__metrics">${metricsHTML}</div>` : '';

    return `<div class="project-wrap">
      <${tag} ${attr} aria-label="${esc(p.title)} — открыть кейс">
        <div class="project__cover">
          ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}" loading="lazy" />` : ''}
          <span class="project__arrow" aria-hidden="true">
            <img src="images/icons/arrow-forward-m.svg" alt="" width="24" height="24" />
          </span>
        </div>
        <div class="project__body">
          <h3 class="project__title">${esc(p.title)}</h3>
          <div class="project__meta">
            <p class="project__company">${esc(p.company)}</p>
            <p class="project__period">${esc(p.period)}</p>
          </div>
          <p class="project__paragraph">
            <span class="project__paragraph-label">О проекте:</span> ${esc(p.about)}
          </p>
          <p class="project__paragraph">
            <span class="project__paragraph-label">Моя роль:</span> ${esc(p.role)}
          </p>
          ${metricsSection}
        </div>
      </${tag}>
    </div>`;
  }


  /* ---------- Рендер шота ---------- */

  function renderShot(s) {
    const sizeClass = `shot--${s.size || 'square'}`;
    const hasVideo = !!(s.video && s.video.trim());
    const hasImage = !!(s.image && s.image.trim());

    let media = '';
    if (hasVideo) {
      media = `<video
        class="shot__img"
        src="${esc(s.video)}"
        autoplay muted loop playsinline
        preload="metadata"
        aria-label="${esc(s.label)}"
      ></video>`;
    } else if (hasImage) {
      media = `<img class="shot__img" src="${esc(s.image)}" alt="${esc(s.label)}" loading="lazy" />`;
    } else {
      media = `<div class="shot__placeholder"><span>Картинка «${esc(s.label)}» пока не загружена</span></div>`;
    }

    return `<figure class="shot ${sizeClass}">
      ${media}
      <figcaption class="shot__label">${esc(s.label)}</figcaption>
    </figure>`;
  }


  /* ---------- Рендер тегов ---------- */

  function renderTags(tags) {
    return (tags || []).map(t => `<span class="tag">${esc(t)}</span>`).join('');
  }


  /* ---------- Загрузка JSON и применение ---------- */

  async function loadContent() {
    try {
      const res = await fetch('content.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error('Не удалось загрузить content.json:', err);
      console.warn('Откройте через Live Server или python -m http.server, а не двойным кликом.');
      return null;
    }
  }

  function applyContent(data) {
    if (!data) return;

    fillSlots('avatar', data.avatar);
    fillSlots('name',   data.name);

    fillSlots('titleLine1',   data.hero?.titleLine1);
    fillSlots('titleLine2',   data.hero?.titleLine2);
    fillSlots('description',  data.hero?.description);

    const tagsHost = document.querySelector('[data-slot="tags"]');
    if (tagsHost) tagsHost.innerHTML = renderTags(data.hero?.tags);

    const c = data.contacts || {};
    fillSlots('emailDisplay',    c.emailDisplay);
    fillSlots('telegramHandle',  c.telegramHandle);
    fillLink('telegram', c.telegram);
    fillLink('email',    c.email);
    fillLink('hh',       c.hh);
    fillLink('resume',   c.resume);

    const projectsHost = document.querySelector('[data-slot="projects"]');
    if (projectsHost) projectsHost.innerHTML = (data.projects || []).map(renderProject).join('');

    const shotsHost = document.querySelector('[data-slot="shots"]');
    if (shotsHost) shotsHost.innerHTML = (data.shots || []).map(renderShot).join('');
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const content = await loadContent();
    applyContent(content);
    // После рендера заново запускаем анимации (common.js мог сработать раньше рендера)
    if (window.__revealReInit) window.__revealReInit();
  });
})();
