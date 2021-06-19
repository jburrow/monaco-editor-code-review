# monaco-editor-code-review


[![Build Status](https://github.com/jburrow/monaco-editor-code-review/actions/workflows/node.js.yml/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/jburrow/monaco-editor-code-review/badge.svg?branch=master)](https://coveralls.io/github/jburrow/monaco-editor-code-review?branch=master)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjburrow%2Fmonaco-editor-code-review.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjburrow%2Fmonaco-editor-code-review?ref=badge_shield)

![screenshot](https://github.com/jburrow/monaco-editor-code-review/blob/master/examples/screenshot.png?raw=true)

Lightweight extension (31KiB) for monaco-editor to allow commenting off code.
This module has 2 explicit dependencies (uuid + moment). There is an peer-dependency dependency on monaco-editor.

For a working examplple of all the features and the behaviours

- Try it out: https://jburrow.github.io/monaco-editor-code-review/examples/index.html
- See example source-code
  - [docs/index.html](examples/index.html)
  - [src/docs.ts](src/docs.ts)
- Read the Api-Docs: https://jburrow.github.io/monaco-editor-code-review/docs/

Simply add the monaco-editor-code-review/index.js to your .html page.

```html
<script src="../index.js"></script>
```

```javascript
//Type: ./src/types/index.ts#ReviewManagerConfig
var overriddenConfig = {};

//Type: ./src/types/index.ts#ReviewComment
var existingComments = [{author:'',
                         dt:'',
                         text:'',
                         lineNumber:10 }];

var editor = monaco.editor.create(document.getElementById("container"), {
        value: '...some source code ''',
        language: "javascript",
        contextmenu: true
    });
var rm = MonacoEditorCodeReview.createReviewManager(editor,
                                                    "name-of-current-user",
                                                    existingComments,
                                                    (newComments)=>{console.info(newComments);},
                                                    overriddenConfig);
```

Features

- Add comment
- Reply to comment
- Delete comment [optionally disabl]
- Navigate between comments [ forward, back]
- Displays comment marker in scrollbar
- Supports Monaco Themes

## Motivation

Your first reaction might be there is no need for this because github or gitlab all have excellent code
review tools, and you are right! However - Monaco can be embedded in many types of applications, and this
library enables you integrate a light way of allowing users to annotate documents rendered in it.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjburrow%2Fmonaco-editor-code-review.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjburrow%2Fmonaco-editor-code-review?ref=badge_large)
