# Upgrading

## Upgrading to v3 (accessibility release)

This release modernizes the generated markup and fixes a number of accessibility issues. If you only use the theme's default templates, no action is needed beyond a visual check. If you **override templates or styles**, review the changes below.

### Menu: checkbox hack replaced by a button

The mobile menu no longer uses the hidden `<input type="checkbox" id="menu-toggle">` + `<label>` pattern. It now uses a real `<button>` with `aria-expanded`/`aria-controls`, toggled by a few lines of JavaScript (bundled in `js/main.js`).

If you have customized the menu, be aware of:

* The element `<input type="checkbox" id="menu-toggle">` is gone.
* The toggle is now `<button type="button" class="menu-button" aria-expanded="false" aria-controls="header-menu">` containing an inline SVG icon instead of `<i class="fas fa-bars">` (Font Awesome is no longer referenced).
* The open/close state is now CSS based on `[aria-expanded="true"]` on the button instead of `#menu-toggle:checked`:
  ```css
  .js .menu-button[aria-expanded="true"] + .menu { /* visible */ }
  ```
* The hiding of the closed menu is gated on a `js` class that the theme sets on `<html>` via a small inline script. Without JavaScript, the menu is always expanded (progressive enhancement/no-JS fallback).
* The menu `<ul>` is now rendered by `partials/menu-list.html`; `partials/menu.html` renders titles, spacer, and button around it. The footer no longer renders the full menu partial, only `menu-list.html` — the duplicate `menu-toggle`/`menu-button` markup in the footer is gone.
* If your JavaScript called `window.addImageViewer()`/`window.addPDFViewer()` manually, these functions still exist. In addition, the viewers now initialize themselves from `data-image-viewer`/`data-pdf-viewer` attributes, so the inline `<script>` snippets in the viewer partials are gone.

### Landmarks and structure

* `<div id="header">` → `<header id="header">`
* `<div id="footer">` → `<footer id="footer">`
* `<div id="content">` → `<main id="content">`
* The header menu is wrapped in `<nav class="links" aria-label="Menu">`
* A "Skip to content" link is rendered as the first element in `<body>` (i18n key `skipToContent`)

CSS selectors targeting these elements by id or class keep working; selectors targeting the element type `div` (e.g. `div#header`) need updating.

### Headings

* Post titles in list views are now `<h2>` instead of `<h1>` (single pages keep `<h1>`).
* The 404 page renders a single `<h1>`.
* The `figure` shortcode renders `<span class="figure-title">` instead of `<h4>` inside `<figcaption>`.

### Pagination

The pagination `<h2 class="pagination">` is now a `<nav class="pagination" aria-label="Pagination">` with `rel="prev"`/`rel="next"` links. Adjust CSS that targeted `h2.pagination` (the link styles moved to `.pagination a`).

### Images and frames

* The image viewer's main image and thumbnails now have `alt` attributes; thumbnail links have `aria-label`s.
* The YouTube `iframe` no longer has the (duplicated) `id="youtube_iframe"` — use the class `youtube_iframe` instead — and has a `title`.
* External links opened in a new tab now carry `rel="noopener noreferrer"`.

### Colors and focus styles

* Secondary text color changed from `#888888` to `#595959` to satisfy WCAG AA contrast (override `$color-sec-text` if needed).
* `a:active` no longer removes the outline; a global `:focus-visible` outline was added.
* The Tumblr link in the metadata is visible again (the `visibility: hidden` rule was removed).
* All `font-size` declarations now use `rem` instead of `px`.

### Removed / changed behavior

* The `<meta http-equiv="refresh">` redirect on 404 pages was removed.
* The deprecated partial `partials/date.html` (which always threw an error) was removed.
* The tag cloud no longer sets `role="button"` and the Bootstrap-ish `btn btn-default` classes; tag URLs are now properly URL-escaped.
* The link to a PDF download used the resource name instead of its URL and is fixed.
* New i18n keys: `menu`, `pagination`, `skipToContent`, `notFoundTitle`, `notFoundText`, `backHome`, `tumblrOriginal`, `pdfDownload`, `viewImage`, `viewMoreImages`. Add translations if your site uses additional languages.

### Sass transpiler

Hugo deprecates `libsass` (v0.153.0); it will be removed in a future release. The theme now selects the transpiler via the site parameter `dartSass` (default: `false` = `libsass`, unchanged behavior):

```toml
[params]
dartSass = true
```

When switching to Dart Sass, the theme's SCSS works unchanged. Note the import syntax in your own `base.scss` differs: use `@import "observer";` with libsass and `@use "observer";` with Dart Sass. **Caution:** with libsass, `@use` is silently passed through and no styles are generated.

If your site sets `dartSass = true`, make sure the `sass`/`dart-sass-embedded` binary is available in your build environment.
