// import { render, html } from "lit-html";
// import * as monaco from "monaco-editor";
// import { reduceVersionControl, VersionControlState, FileEvents } from "./events-version-control";


// function renderExplorer() {
//     return html`<div>render explorer</div>`;
// }

// function renderEditor() {
//     const monacoDiv = document.createElement("div");
//     monacoDiv.style.height = "400px";
//     monacoDiv.style.width = "400px";
//     monacoDiv.style.backgroundColor = "red";
//     monacoDiv.style.border = "1px solid black"
//     const model = (window as any).monaco.editor.create(monacoDiv, {
//         value: "something",
//         language: "typescript",
//         glyphMargin: true,
//         contextmenu: true,
//         automaticLayout: true,
//         readOnly: false,
//         theme: "dark"
//     }) as monaco.editor.IStandaloneCodeEditor;

//     return monacoDiv;
// }

// function renderSCM(store: VersionControlState) {
//     return html`HERE! 
// ${Object.entries(store.files).map(([key, value]) => html`<div @click=${() => { console.log(key) }}>${key}</div>`)}
// !HERE`;
// }


// (window as any).require.config({
//     paths: { vs: "../node_modules/monaco-editor/min/vs" }
// });

// let events: FileEvents[] = [
//     { fullPath: "/script1.py", text: "version 1", type: "edit" },
//     { fullPath: "/script2.py", text: "version 1", type: "edit" },
//     { fullPath: "/script3.py", text: "version 1", type: "edit" }];

// let store = reduceVersionControl([{
//     type: "commit", author: "james",
//     events: events
// }]);

// function dispatch(event: FileEvents) {
//     store = reduceVersionControl([{
//         type: "commit", author: "james",
//         events: [event]
//     }]);

//     renderStoreChanged(store);
// }

// function renderStoreChanged(store: VersionControlState) {
//     render(renderSCM(store), document.getElementById('scm'));
//     render(renderExplorer(), document.getElementById('explorer'));
// }

// (window as any).require(["vs/editor/editor.main"], () => {
//     console.log("monaco promise resolved")

//     render(html`
// <div>
// <div id="scm"></div>
// <div id="explorer"></div>
// <div id="editor"> ${renderEditor()}</div>
// </div>`, document.body);

//     renderStoreChanged(store);


// });
