"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const moment = require("dayjs");
const win = window;
let reviewManager = null;
let currentMode = "";
let currentEditor = null;
let theme = "vs-dark";
const fooUser = "foo.user";
const barUser = "bar.user";
function ensureMonacoIsAvailable() {
    return new Promise((resolve) => {
        if (!win.require) {
            console.warn("Unable to find a local node_modules folder - so dynamically using cdn instead");
            var prefix = "https://microsoft.github.io/monaco-editor";
            const scriptTag = document.createElement("script");
            scriptTag.src = prefix + "/node_modules/monaco-editor/min/vs/loader.js";
            scriptTag.onload = () => {
                console.debug("Monaco loader is initialized");
                resolve(prefix);
            };
            document.body.appendChild(scriptTag);
        }
        else {
            resolve("..");
        }
    });
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function setView(editorMode, diffMode, theme, currentUser, editorReadonly, commentsReadonly) {
    const idx = getRandomInt(exampleSourceCode.length / 2) * 2;
    // currentMode = mode;
    document.getElementById("containerEditor").innerHTML = "";
    if (editorMode == "editor-mode") {
        currentEditor = win.monaco.editor.create(document.getElementById("containerEditor"), {
            value: exampleSourceCode[idx],
            language: "typescript",
            glyphMargin: true,
            contextmenu: true,
            automaticLayout: true,
            readOnly: editorReadonly,
            theme: theme,
        });
        initReviewManager(currentEditor, currentUser, commentsReadonly);
    }
    else {
        var originalModel = win.monaco.editor.createModel(exampleSourceCode[idx], "typescript");
        var modifiedModel = win.monaco.editor.createModel(exampleSourceCode[idx + 1], "typescript");
        const e = win.monaco.editor.createDiffEditor(document.getElementById("containerEditor"), {
            renderSideBySide: diffMode !== "inline-diff",
            theme: theme,
            readOnly: editorReadonly,
            glyphMargin: true,
            contextmenu: true,
            automaticLayout: true,
        });
        e.setModel({
            original: originalModel,
            modified: modifiedModel,
        });
        currentEditor = e;
        initReviewManager(e.modifiedEditor, currentUser, commentsReadonly);
    }
}
function generateDifferentContents() {
    const idx = getRandomInt(exampleSourceCode.length / 2) * 2;
    if (currentMode.startsWith("standard")) {
        currentEditor.setValue(exampleSourceCode[idx]);
    }
    else {
        const e = currentEditor;
        e.getModel().modified.setValue(exampleSourceCode[idx]);
        e.getModel().modified.setValue(exampleSourceCode[idx + 1]);
    }
}
const exampleSourceCode = [];
function fetchSourceCode(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        const exampleText = yield response.text();
        const modifiedText = exampleText.replace(new RegExp("string", "g"), "string /* String!*/");
        const longLines = "A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text \nA very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text A very very long line of text ";
        exampleSourceCode.push(url + "\n" + longLines + exampleText);
        exampleSourceCode.push(url + "\n" + longLines + modifiedText);
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("[init] 123");
        var prefix = yield ensureMonacoIsAvailable();
        yield fetchSourceCode("../src/index.ts");
        yield fetchSourceCode("../src/docs.ts");
        yield fetchSourceCode("../src/index.test.ts");
        const response = yield fetch("../dist/timestamp.json");
        const tsobj = yield response.text();
        console.log("Compiled at:", tsobj);
        win.require.config({
            paths: { vs: prefix + "/node_modules/monaco-editor/min/vs" },
        });
        win.require(["vs/editor/editor.main"], function () {
            setView("editor-mode", "", "vs-dark", fooUser, false, false);
            window.dispatchEvent(new Event("monaco-ready"));
        });
    });
}
function initReviewManager(editor, currentUser, readOnly) {
    reviewManager = index_1.createReviewManager(editor, currentUser, createRandomComments(), (updatedComments) => renderComments(updatedComments), {
        editButtonEnableRemove: true,
        formatDate: (createdAt) => moment(createdAt).format("YY-MM-DD HH:mm"),
        readOnly: readOnly,
    });
    setCurrentUser();
    renderComments(reviewManager.events);
}
function handleCommentReadonlyChange() {
    reviewManager.setReadOnlyMode(event.srcElement.checked);
}
function generateDifferentComments() {
    reviewManager.load(createRandomComments());
    renderComments(reviewManager.events);
}
function setCurrentUser() {
    if (reviewManager && event) {
        reviewManager.currentUser = event.srcElement.value;
    }
}
function createRandomComments() {
    const firstLine = Math.floor(Math.random() * 10);
    const result = [
        {
            type: "create",
            id: "id-0",
            lineNumber: firstLine + 10,
            createdBy: fooUser,
            createdAt: new Date().getTime(),
            text: "Near the start",
            selection: {
                startColumn: 5,
                startLineNumber: firstLine + 5,
                endColumn: 10,
                endLineNumber: firstLine + 10,
            },
        },
        {
            id: "id-2-edit",
            targetId: "id-2",
            type: "edit",
            createdBy: fooUser,
            createdAt: new Date().getTime(),
            text: "EDIT EDIT at start",
        },
        {
            id: "id-1",
            type: "create",
            lineNumber: firstLine + 5,
            createdBy: fooUser,
            createdAt: new Date().getTime(),
            text: "at start",
        },
        {
            id: "id-2",
            type: "create",
            targetId: "id-1",
            lineNumber: firstLine + 5,
            createdBy: fooUser,
            createdAt: new Date().getTime(),
            text: "this code isn't very good",
        },
        {
            id: "id-3",
            type: "create",
            targetId: "id-2",
            lineNumber: firstLine + 5,
            createdBy: barUser,
            createdAt: new Date().getTime(),
            text: "I think you will find it is good enough",
        },
        {
            targetId: "id-3",
            type: "create",
            lineNumber: firstLine + 5,
            createdBy: barUser,
            createdAt: new Date().getTime(),
            text: "I think you will find it is good enough",
        },
        {
            targetId: "id-3",
            type: "create",
            lineNumber: firstLine + 5,
            createdBy: barUser,
            createdAt: new Date().getTime(),
            text: "I think you will find it is good enough",
        },
    ];
    return result;
}
function renderComments(events) {
    events = events || [];
    console.log("Events::: #", events.length, events);
    const rawHtml = "<table><tr><td>Type</td><td>Id</td><td>Created By</td><td>Create At</td></tr>" +
        events
            .map((comment) => {
            return `<tr>
                    <td>${comment.type || "&nbsp;"}</td>
                    <td>${comment.id || "&nbsp;"}</td>
                    <td>${comment.createdBy}</td> 
                    <td>${comment.createdAt}</td>                     
                    </tr>
                    <tr>
                    <td colspan="4" class="comment_text">${JSON.stringify(comment) || "&nbsp;"}</td>                    
                </tr>`;
        })
            .join("") +
        "</table>";
    const activeComments = Object.values(reviewManager.store.comments).map((cs) => cs.comment);
    const activeHtml = "<table><tr><td>Id</td><td>Line Num</td><td>Created By</td><td>Create At</td></tr>" +
        activeComments
            .map((comment) => `<tr>
                    <td>${comment.id || "&nbsp;"}</td>                                     
                    <td>${comment.lineNumber}</td>
                    <td>${comment.author}</td> 
                    <td>${comment.dt}</td> 
                </tr>
                <tr>
                    <td colspan="4" class="comment_text">${comment.text}</td>                                        
                </tr>`)
            .join("") +
        "</table>";
    document.getElementById("summaryEditor").innerHTML = `<div><h5>Active Comments</h5>${activeHtml}</div><div><h5>Events</h5>${rawHtml}</div>`;
}
function clearComments() {
    reviewManager.load([]);
    renderComments([]);
}
win.setView = setView;
win.generateDifferentComments = generateDifferentComments;
win.generateDifferentContents = generateDifferentContents;
win.handleCommentReadonlyChange = handleCommentReadonlyChange;
win.clearComments = clearComments;
win.setCurrentUser = setCurrentUser;
init();
//# sourceMappingURL=docs.js.map