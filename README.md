# monaco-editor-code-review
Lightweight extension for monaco-editor to allow commenting off code. This module has no explicit run-time dependencies. There is an implicit dependency on monaco-editor.

Simply add the monaco-eidtor-code-review/index.js to your .html page.

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
