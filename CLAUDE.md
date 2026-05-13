# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running locally

Opening `index.html` directly won't work — the browser blocks `fetch('content.json')` on `file://`. Use a local server:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

Or use VS Code's **Live Server** extension (right-click `index.html` → Open with Live Server).

To preview mobile layout: Chrome DevTools → device toolbar → 375px width.

## Architecture

This is a **static, no-build portfolio site**. No bundler, no framework, no package manager.

**Content separation:** The homepage is data-driven. `content.json` holds all copy and asset references for the main page; `js/main.js` fetches it and renders everything into `[data-slot="…"]` and `[data-link="…"]` placeholders in `index.html`. Case study pages (`cases/*.html`) are static HTML — content lives directly in the markup.

**JS split:**
- `js/common.js` — loaded on every page. Handles scroll-reveal animations (`IntersectionObserver`) and the burger menu. Exposes `window.__revealReInit` so `main.js` can re-trigger reveal after async render completes.
- `js/main.js` — homepage only. Fetches `content.json`, renders projects, shots, tags, and wires up all links/slots.

**CSS:** Single file `css/style.css` shared by all pages. Design tokens (colors, radii, shadows, fonts) are defined as CSS custom properties in `:root`. Mobile-first at 375px; tablet (768) and desktop breakpoints are planned but not yet implemented.

**Fonts:** `NauryzRedKeds` (display/headings) loaded from `fonts/` via `@font-face`. `Manrope` (body) loaded from Google Fonts. Without the local font files, headings fall back to `system-ui`.

## content.json schema

```
name, avatar                         — header/menu identity
hero.titleLine1/2, description, tags — hero section
contacts.telegram/email/hh/resume    — links; empty string disables the element
projects[]                           — title, company, period, image, about, role,
                                       metricsBlocks[][], url
shots[]                              — image OR video, label,
                                       size (square|tall|medium|short)
```

`metricsBlocks` is an array of rows; each row is an array of `{label, value}` pairs rendered as a horizontal tile with dividers between pairs.

If `url` is empty on a project, the card renders as `<article>` (not a link). If `contacts.resume` is empty, the resume button renders as disabled.

## Adding a case study

1. Create `cases/your-case.html` — copy structure from an existing case file.
2. Add images to `images/cases/your-case/`.
3. Add the project entry to `content.json` with `"url": "cases/your-case.html"`.

## Roadmap state (as of May 2026)

- Mobile 375px: complete (main page + both cases)
- Tablet 768px, Desktop: not started
- Real resume PDF and HH.ru link: pending
- Deploy target: Russian shared hosting (Beget/Timeweb) via FTP; `index.html` goes in the webroot
