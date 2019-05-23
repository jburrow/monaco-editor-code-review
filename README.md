# monaco-editor-code-review
Lightweight extension (24kb) for monaco-editor to allow commenting off code. 
This module has 1 explicit run-time dependencies (uuid). There is an implicit dependency on monaco-editor.

For a working examplple of all the features and the behaviours
- Try it out: https://jburrow.github.io/monaco-editor-code-review/examples/index.html
- See example source-code
  - [docs/index.html](examples/index.html) 
  - [src/docs.ts](src/docs.ts)


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
                         lineNumber:10, 
                         comments:[]}]; 

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


![screenshot](https://github.com/jburrow/monaco-editor-code-review/blob/master/examples/screenshot.png?raw=true)

## Motivation

Your first reaction might be there is no need for this because github or gitlab all have excellent code 
review tools, and you are right! However - Monaco can be embedded in many types of applications, and this 
library enables you integrate a light way of allowing users to annotate documents rendered in it. 
