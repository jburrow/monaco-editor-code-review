# monaco-editor-code-review
Lightweight extension for monaco-editor to allow commenting off code. This module has no explicit run-time dependencies. There is an implicit dependency on monaco-editor.

Try it out: https://jburrow.github.io/monaco-editor-code-review/docs/index.html

Simply add the monaco-editor-code-review/index.js to your .html page.

```html
<script src="../index.js"></script>
```

```javascript
var editor = monaco.editor.create(document.getElementById("container"), {
        value: '...some source code ''',
        language: "javascript",        
        contextmenu: true
      });
var rm = createReviewManager(editor, "name-of-current-user");
```

Users can use context-menu or keyboard short-cut to comment code
- Add comment
- Reply to comment
- Delete comment


![screenshot](https://github.com/jburrow/monaco-editor-code-review/blob/master/docs/screenshot.png?raw=true)
