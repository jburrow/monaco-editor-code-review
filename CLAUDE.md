# monaco-review

Code review extension for the Monaco editor: inline comments, threaded replies, and edit history rendered as editor view zones. Published to npm as `monaco-review`.

## Commands

```sh
npm start           # vite dev server - demo at http://localhost:5173/examples/index.html
npm test            # vitest with coverage (jsdom environment)
npm run lint        # eslint src
npm run typecheck   # tsc --noEmit
npm run build       # tsup -> dist (esm + cjs + iife + .d.ts)
npm run build:demo  # vite build -> site/ (what GitHub Pages serves)
npm run doc         # typedoc -> docs/
npm run screenshot  # regenerate examples/screenshot.png (needs vite preview on :4173, see script header)
```

Run a single test file: `npx vitest run src/index.test.ts`.

## Architecture

- `src/events-comments-reducers.ts` — pure event-sourced core. Comments are an append-only log of `create`/`edit`/`delete` events (`ReviewCommentEvent`); `reduceComments`/`commentReducer` fold events into a `ReviewCommentStore` (current comments + per-comment history). No DOM, no monaco.
- `src/index.ts` — `ReviewManager`: the DOM/monaco layer. Renders comments as view zones, manages the inline toolbar + comment editor content widgets, decorations (overview ruler markers, add-comment margin icon), editor actions/keybindings, and read-only mode. `createReviewManager()` is the public entry point. `dispose()` must release everything it attaches.
- `src/docs.ts` — the demo app (not part of the published package), driven by `examples/index.html`. Imports monaco via ESM with vite `?worker` workers and `?raw` source samples.

## Hard rules

- **No runtime monaco import in the library.** `src/index.ts` may only use `import type` from monaco-editor; monaco values it needs (KeyMod/KeyCode numerics, plain `IRange` object literals) are defined locally. This keeps the library loader-agnostic (ESM bundlers and AMD both work). The demo (`docs.ts`) is exempt.
- **No private monaco APIs.** Theme colors come from the public `--vscode-*` CSS custom properties on the editor DOM node (`getThemedColor`), with fallbacks in `fallbackThemeColors`.
- **Comment text is untrusted.** Default rendering is `innerText`. `config.renderText` output, when a string, must pass through `DOMPurify.sanitize` before `innerHTML`. dompurify is the only runtime dependency - keep it that way.
- CSS class names are BEM with the `monaco-review-` prefix (e.g. `monaco-review-comment__author`, `monaco-review-toolbar__add`); keys in `defaultStyles` must match the class names used in code. Style values are kebab-case CSS properties (applied via `style.setProperty`).
- Action ids are namespaced `monaco-review.*`; context keys `monacoReviewCanAdd`/`monacoReviewCanCancel`.

## Testing

Tests run under vitest with jsdom (configured in `vite.config.ts` `test` block). `src/index.test.ts` uses a hand-rolled mock editor (`getMockEditor`) — when ReviewManager starts calling a new editor API, the mock must implement it (return `{ dispose }` for event subscriptions, implement `createDecorationsCollection` semantics, etc.). The mock's `_zones` records view zones, which is how rendering is asserted.

## Releasing

- Version bumps follow semver-ish 0.x: breaking changes bump the minor.
- Publishing: create a GitHub release (`gh release create vX.Y.Z`) → `.github/workflows/npm-publish.yml` runs tests and `npm publish` (`prepublishOnly` runs typecheck + build, so dist is always fresh from the tag). Requires the `npm_token` repo secret.
- `dist/`, `docs/`, and `site/` are gitignored build output. GitHub Pages deploys automatically on every master push via `.github/workflows/pages.yml` (demo at `/examples/index.html`, typedoc at `/docs/`).

## Gotchas

- master receives constant renovate dependency PRs — always `git fetch` + rebase before pushing.
- The demo page is heavy (long lines + diff editor); browser automation against it can be slow to respond right after load.
- `lint-staged` runs eslint+prettier on commit via husky; CI also runs lint + typecheck, so commit hooks passing is not enough only if you bypass them.
