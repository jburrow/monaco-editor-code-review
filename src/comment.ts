// import { Schema, DOMParser, DOMSerializer } from "prosemirror-model";
// import { schema } from "prosemirror-schema-basic";
// import { addListNodes } from "prosemirror-schema-list";
// import { exampleSetup } from "prosemirror-example-setup";
// import { schema, defaultMarkdownParser, defaultMarkdownSerializer } from "prosemirror-markdown";
// import "prosemirror-menu/style/menu.css";
// import "prosemirror-view/style/prosemirror.css";
// import { EditorState } from "prosemirror-state";
// import { EditorView } from "prosemirror-view";

import * as showdown from "showdown";

const converter = new showdown.Converter();

// class ProseMirrorView {
//   view: EditorView;
//   constructor(target: HTMLElement, content: string) {
//     this.view = new EditorView(target, {
//       state: EditorState.create({
//         doc: defaultMarkdownParser.parse(content),
//         plugins: exampleSetup({ schema }),
//       }),
//     });
//   }

//   get content() {
//     const target = document.createElement("div");
//     DOMSerializer.fromSchema(schema).serializeFragment(this.view.state.doc.content, target);

//     console.log(target.innerHTML);

//     return defaultMarkdownSerializer.serialize(this.view.state.doc);
//   }
//   focus() {
//     this.view.focus();
//   }
//   destroy() {
//     this.view.destroy();
//   }
// }

// class MarkdownView {
//   textarea: any;
//   constructor(target, content) {
//     this.textarea = target.appendChild(document.createElement("textarea"));
//     this.textarea.value = content;
//   }

//   get content() {
//     return this.textarea.value;
//   }
//   focus() {
//     this.textarea.focus();
//   }
//   destroy() {
//     this.textarea.remove();
//   }
// }

export function convertMarkdownToHTML(text: string): string {
  return converter.makeHtml(text);
}

// export function createEditor(parent: HTMLElement) {
//   const editor = document.createElement("div");
//   const pmv = new ProseMirrorView(
//     editor,
//     `# heading

//       this is text`
//   );

//   return editor;
// }

//   let place = document.querySelector("#editor");
//win.view =

//   console.log("render", win.view.content);

//   "prosemirror": "^0.11.1",
//   "prosemirror-example-setup": "^1.1.2",
//   "prosemirror-markdown": "^1.5.1",
//   "prosemirror-menu": "^1.1.4",
//   "prosemirror-model": "^1.13.1",
//   "prosemirror-schema-basic": "^1.1.2",
//   "prosemirror-schema-list": "^1.1.4",
//   "prosemirror-state": "^1.3.4",
//   "prosemirror-view": "^1.17.2",
