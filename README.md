# monaco-review

![Build Status](https://github.com/jburrow/monaco-editor-code-review/actions/workflows/node.js.yml/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/jburrow/monaco-editor-code-review/badge.svg?branch=master)](https://coveralls.io/github/jburrow/monaco-editor-code-review?branch=master) [![npm](https://img.shields.io/npm/v/monaco-review.svg)](https://www.npmjs.com/package/monaco-review)

Code review extension for the [Monaco editor](https://github.com/microsoft/monaco-editor) — inline comments, threaded replies, and edit history rendered directly in the editor.

![screenshot](https://github.com/jburrow/monaco-editor-code-review/blob/master/examples/screenshot.png?raw=true)

- **Live demo**: https://jburrow.github.io/monaco-editor-code-review/examples/index.html
- **API docs**: https://jburrow.github.io/monaco-editor-code-review/docs/
- **Example source**: [examples/index.html](examples/index.html), [src/docs.ts](src/docs.ts)

## Features

- Add, reply to, edit and remove comments on any line
- Threaded replies with indentation
- Full edit history per comment (event-sourced — see [Persistence](#persistence))
- Navigate between comments (Ctrl/Cmd+F12 next, Ctrl/Cmd+F11 previous)
- Comment markers in the scrollbar / overview ruler
- Read-only mode
- Optional markdown rendering (sanitized with DOMPurify)
- Customisable rendering, styles, and date formatting
- Follows the active Monaco theme (light/dark)

## Why?

GitHub and GitLab already have excellent review tools — but Monaco gets embedded in many kinds of applications. This library gives you a lightweight way to let users annotate documents rendered in any Monaco instance: internal tools, data pipelines, education platforms, document workflows.

## Installation

```sh
npm install monaco-review
```

`monaco-editor` (>= 0.34) is a peer dependency. The library works with both ESM-imported monaco (Vite, webpack, etc.) and the classic AMD loader — no `window.monaco` global is required.

Alternatively, load the prebuilt bundle directly in a page — it exposes a `MonacoEditorCodeReview` global:

```html
<script src="node_modules/monaco-review/dist/index-var-es2017.min.js"></script>
```

## Quick start

```javascript
import { createReviewManager } from "monaco-review";

const editor = monaco.editor.create(document.getElementById("container"), {
  value: "function add(a, b) {\n  return a + b;\n}",
  language: "javascript",
});

// Events previously captured via onChange - or [] to start fresh
const existingEvents = [
  {
    type: "create",
    id: "1",
    createdBy: "developer-1",
    createdAt: Date.now(),
    lineNumber: 2,
    text: "Should we validate the inputs?",
  },
];

const reviewManager = createReviewManager(
  editor,
  "name-of-current-user",
  existingEvents,
  (updatedEvents) => {
    // Called on every change - persist these to your backend
    console.log("events", updatedEvents);
  },
  /* config */ {},
);
```

## Persistence

Comments are stored as an append-only list of events (`create` / `edit` / `delete`). The `onChange` callback hands you the full event list after every change — serialize it as-is and replay it later via `createReviewManager(...)` or `reviewManager.load(events)`. Edit history and threading fall out of the event log for free.

To compute the current comment state from events outside the editor (e.g. server-side), use the exported reducer:

```javascript
import { reduceComments } from "monaco-review";

const store = reduceComments(events);
// store.comments is a Record<commentId, { comment, history }>
```

## Configuration

All fields of `ReviewManagerConfig` are optional:

| Option                                       | Default                | Description                                                                                |
| -------------------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------ |
| `readOnly`                                   | `false`                | Disable adding/editing comments (can also toggle via `setReadOnlyMode`)                    |
| `enableMarkdown`                             | `false`                | Render comment text as markdown (sanitized with DOMPurify)                                 |
| `formatDate`                                 | ISO string             | `(dt: Date \| string) => string` used when rendering timestamps                            |
| `renderComment`                              | built-in renderer      | Fully replace comment rendering: `(isActive, item) => HTMLElement`                         |
| `styles`                                     | `defaultStyles`        | Override inline styles per element class                                                   |
| `setClassNames`                              | `true`                 | Also set CSS class names on rendered elements, for external styling                        |
| `editButtonAddText` / `editButtonRemoveText` | `"Reply"` / `"Remove"` | Toolbar button labels                                                                      |
| `editButtonEnableRemove`                     | `true`                 | Show the remove button                                                                     |
| `showInRuler`                                | `true`                 | Show comment markers in the overview ruler                                                 |
| `commentIndent` / `commentIndentOffset`      | `20` / `20`            | Pixel indentation per reply depth                                                          |
| `verticalOffset`                             | `0`                    | Vertical pixel adjustment for widgets                                                      |
| `keybindings`                                | see below              | Override keybindings, e.g. `{ addComment: [monaco.KeyMod.CtrlCmd \| monaco.KeyCode.F10] }` |

## Keyboard shortcuts

| Shortcut       | Action                          |
| -------------- | ------------------------------- |
| Ctrl/Cmd + F10 | Add comment at the current line |
| Ctrl/Cmd + F12 | Next comment                    |
| Ctrl/Cmd + F11 | Previous comment                |
| Ctrl + Enter   | Save comment (while editing)    |
| Escape         | Cancel (while editing)          |

All shortcuts (except Ctrl+Enter/Escape inside the textarea) can be overridden via `config.keybindings`.

## Cleanup

`ReviewManager` attaches widgets, view zones, decorations, actions and event listeners to the editor. When the editor or hosting component is unmounted, release them:

```javascript
reviewManager.dispose();
```

For example in React:

```jsx
useEffect(() => {
  const rm = createReviewManager(editor, user, events, onChange);
  return () => rm.dispose();
}, [editor]);
```

## Development

```sh
npm install
npm start        # demo at http://localhost:8080/examples/index.html
npm test         # jest with coverage
npm run lint     # eslint
npm run compile  # tsc + webpack production build
```

## License

MIT

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjburrow%2Fmonaco-editor-code-review.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjburrow%2Fmonaco-editor-code-review?ref=badge_large)
