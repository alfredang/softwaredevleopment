# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page marketing website for a fictional software development studio ("Forge & Function"). Pure static front-end — **HTML + CSS + vanilla JS, no framework, no build step, no package manager, no tests.**

## Running

Open `index.html` directly in a browser. There is no dev server or build:

```powershell
Start-Process index.html   # Windows / PowerShell
```

The only external dependency is Google Fonts (Bricolage Grotesque, JetBrains Mono, Hanken Grotesk) loaded via CDN in the `<head>` — typography needs an internet connection to render as designed; it falls back to system fonts offline.

## Architecture

Three files, separated by concern:

- **`index.html`** — semantic structure. One `<main>` with four anchored sections: `#home` (hero), `#services`, `#testimonials`, `#contact` (enquiry form). The sticky navbar links resolve to these IDs; `html { scroll-padding-top }` in CSS offsets the fixed nav for smooth-scroll.
- **`styles.css`** — all styling. Design tokens live in `:root` CSS variables (palette, radius, shadow, fonts) — change the theme there, not inline. Mobile-first: base styles target small screens, `@media (min-width: …)` blocks add columns. A `prefers-reduced-motion` block disables the entrance animations.
- **`script.js`** — only behavior is the enquiry form. Everything runs inside one `DOMContentLoaded` handler.

### Form validation flow (the one non-trivial part)

`script.js` is driven by a single `fields` config object mapping each input id to `{ required, message, validate }`. To add/change a field, edit that object — `validateField`, `setError`, and the submit handler all iterate over its keys, so they need no other changes. Each field needs a matching `<input id="x">` and `<span class="error" id="error-x">` in the HTML, and the `.field`/`.invalid`/`.error` classes in CSS.

On submit: `preventDefault()` → validate all fields → focus first invalid → on success, collect a `formData` object, `console.log` it, show the `#form-success` message, and `form.reset()`. There is **no real backend** — a commented-out `fetch()` POST example marks where one would go.
