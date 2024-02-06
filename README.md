# monaco-editor-code-review

![Build Status](https://github.com/jburrow/monaco-editor-code-review/actions/workflows/node.js.yml/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/jburrow/monaco-editor-code-review/badge.svg?branch=master)](https://coveralls.io/github/jburrow/monaco-editor-code-review?branch=master) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjburrow%2Fmonaco-editor-code-review.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjburrow%2Fmonaco-editor-code-review?ref=badge_shield)

![screenshot](https://github.com/jburrow/monaco-editor-code-review/blob/master/examples/screenshot.png?raw=true)

Lightweight extension (45KiB) for monaco-editor to allow the creation, editing of "comments" in code.
This module has 2 explicit dependencies (uuid + moment). There is an peer-dependency dependency on monaco-editor.

For a working examplple of all the features and the behaviours

- Read the Api-Docs: https://jburrow.github.io/monaco-editor-code-review/docs/
- Try it out: DEMO: https://jburrow.github.io/monaco-editor-code-review/examples/index.html
- See example source-code
  - [docs/index.html](examples/index.html)
  - [src/docs.ts](src/docs.ts)

Simply add the monaco-editor-code-review/index.js to your .html page.

```html
<script src="../index.js"></script>
```

```javascript
//Type: ./src/types/index.ts#ReviewManagerConfig
const overriddenConfig = {};

//Type: ./src/types/index.ts#ReviewComment
const existingComments = [{id:"1",
                         createdBy:'developer-1',
                         createdAt:new Date().getTime(),
                         text:'',
                         lineNumber:1 }];

const editor = monaco.editor.create(document.getElementById("container"), {
        value: '...some source code ''',
        language: "javascript",
        contextmenu: true
    });
const reviewManager = MonacoEditorCodeReview.createReviewManager(editor,
                                                    "name-of-current-user",
                                                    existingComments,
                                                    (newComments)=>{console.info("** new comments **", newComments);},
                                                    overriddenConfig);
```

Features

- Add comment
- Reply to comment
- Delete comment [optionally disable/disable]
- Navigate between comments [ forward, back]
- Displays comment marker in scrollbar
- Supports Monaco Themes

## Motivation

Your first reaction might be there is no need for this because github or gitlab all have excellent code
review tools, and you are right! However - Monaco can be embedded in many types of applications, and this
library enables you integrate a light way of allowing users to annotate documents rendered in it.

## License

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fjburrow%2Fmonaco-editor-code-review.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fjburrow%2Fmonaco-editor-code-review?ref=badge_large)
