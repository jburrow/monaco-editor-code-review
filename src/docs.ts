import { ReviewComment, createReviewManager, ReviewManager, ReviewCommentStatus } from "./index";
import * as moment from "moment";



interface WindowDoc {
    require: any;
    monaco: any;
    setView: (mode: string) => void;
    generateDifferentComments: () => void;
    generateDifferentContents: () => void;
    toggleTheme: () => void;
    clearComments: () => void;
}

const win = (window as any) as WindowDoc;
let reviewManager: ReviewManager = null;
let currentMode: string = '';
let currentEditor: any = null;
let theme = 'vs-dark';

function ensureMonacoIsAvailable() {
    return new Promise(resolve => {
        if (!win.require) {
            console.warn(
                "Unable to find a local node_modules folder - so dynamically using cdn instead"
            );
            var prefix = "https://microsoft.github.io/monaco-editor";
            const scriptTag = document.createElement("script");
            scriptTag.src = prefix + "/node_modules/monaco-editor/min/vs/loader.js";
            scriptTag.onload = () => {
                console.debug("Monaco loader is initialized");
                resolve(prefix);
            };
            document.body.appendChild(scriptTag);
        } else {
            resolve("..");
        }
    });
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function setView(mode: string) {
    const idx = getRandomInt((exampleSourceCode.length) / 2) * 2;

    currentMode = mode;
    document.getElementById("containerEditor").innerHTML = "";
    if (mode.startsWith("standard")) {
        currentEditor = win.monaco.editor.create(
            document.getElementById("containerEditor"),
            {
                value: exampleSourceCode[idx],
                language: "typescript",
                glyphMargin: true,
                contextmenu: true,
                automaticLayout: true,
                readOnly: mode === "standard-readonly",
                theme: theme
            }
        );
        initReviewManager(currentEditor);
    } else {
        var originalModel = win.monaco.editor.createModel(
            exampleSourceCode[idx],
            "typescript"
        );
        var modifiedModel = win.monaco.editor.createModel(
            exampleSourceCode[idx + 1],
            "typescript"
        );

        const e = win.monaco.editor.createDiffEditor(
            document.getElementById("containerEditor"),
            { renderSideBySide: mode !== "inline" }
        );
        e.setModel({
            original: originalModel,
            modified: modifiedModel
        });

        currentEditor = e;
        initReviewManager(e.modifiedEditor);
    }
}

function generateDifferentContents() {
    const idx = getRandomInt((exampleSourceCode.length) / 2) * 2;

    if (currentMode.startsWith("standard")) {
        (currentEditor).setValue(exampleSourceCode[idx]);
    } else {
        const e = (currentEditor);
        e.getModel().modified.setValue(exampleSourceCode[idx]);
        e.getModel().modified.setValue(exampleSourceCode[idx + 1]);
    }
}

const exampleSourceCode = [];

async function fetchSourceCode(url: string) {
    const response = await fetch(url);
    const exampleText = await response.text();

    const modifiedText = exampleText.replace(
        new RegExp("string", "g"),
        "string /* String!*/"
    );

    exampleSourceCode.push(url + '\n' + exampleText);
    exampleSourceCode.push(url + '\n' + modifiedText);
}

async function init() {
    var prefix = await ensureMonacoIsAvailable();
    await fetchSourceCode("../src/index.ts");
    await fetchSourceCode("../src/docs.ts");
    await fetchSourceCode("../src/index.test.ts");

    const response = await fetch("../dist/timestamp.json");
    const tsobj = await response.json();
    console.log("Compiled at:", tsobj.date);

    win.require.config({
        paths: { vs: prefix + "/node_modules/monaco-editor/min/vs" }
    });

    win.require(["vs/editor/editor.main"], function () {
        setView("standard");
    });
}

function initReviewManager(editor: any) {

    reviewManager = createReviewManager(
        editor,
        "mr reviewer",
        createRandomComments(),
        updatedComments => renderComments(updatedComments),
        {
            editButtonEnableRemove: true,
            formatDate: (dt: Date | string) => moment(dt).format('YY-MM-DD HH:mm')
        }
    );

    renderComments(Object.values(reviewManager.commentState).map(cs => cs.comment));
}

function toggleTheme() {
    theme = theme == 'vs' ? 'vs-dark' : 'vs';
    win.monaco.editor.setTheme(theme)
}

function generateDifferentComments() {
    reviewManager.load(createRandomComments());
    renderComments(Object.values(reviewManager.commentState).map(cs => cs.comment));
}

function createRandomComments(): ReviewComment[] {
    const firstLine = Math.floor(Math.random() * 10);

    const result: ReviewComment[] = [
        {
            id: "id-0",
            lineNumber: firstLine + 10,
            author: "another reviewer",
            dt: '2019-01-01T00:00:00.000',
            text: "id-0: Near the start",
            selection: {
                startColumn: 5,
                startLineNumber: firstLine + 5,
                endColumn: 10,
                endLineNumber: firstLine + 10
            }
        },
        {
            id: "id-2-edit",
            parentId: "id-2",
            status: ReviewCommentStatus.edit,
            lineNumber: firstLine + 5,
            author: "another reviewer",
            dt: '2019-06-01T00:00:00.000Z',
            text: "id-2: EDIT EDIT at start"
        },
        {
            id: "id-1",
            lineNumber: firstLine + 5,
            author: "another reviewer",
            dt: '2019-06-01T00:00:00.000Z',
            text: "id-1: at start"
        },
        {
            id: "id-2",
            parentId: "id-1",
            lineNumber: firstLine + 5,
            author: "another reviewer",
            dt: '2019-12-01T00:00:00.000Z',
            text: "id-2: this code isn't very good",
        },
        {
            id: "id-3",
            parentId: "id-2",
            lineNumber: firstLine + 5,
            author: "original author",
            dt: '2019-06-01T00:00:00.000Z',
            text: "id-3: I think you will find it is good enough"
        },
        {
            parentId: "id-3",
            lineNumber: firstLine + 5,
            author: "original author",
            dt: new Date(),
            text: "I think you will find it is good enough",
        },
        {
            parentId: "id-3",
            lineNumber: firstLine + 5,
            author: "original author",
            dt: new Date(),
            text: "I think you will find it is good enough",
        }
    ];
    return result;
}

function renderComments(comments: ReviewComment[]) {
    console.log('Render Comments #', comments.length, comments);
    
    comments = comments || [];

    const header = {
        author: "Author",
        dt: "Created At",
        id: "Id",
        parentId: "ParentId",
        lineNumber: "Line Number",
        selection: "",
        status: "Status",
        text: "Text"
    }

    document.getElementById("summaryEditor").innerHTML = [header as any].concat(comments as any[])
        .map(
            comment =>
                `<div style="text-align:left;display:flex;height:16px;text-decoration:${comment.status && comment.status === ReviewCommentStatus.deleted ? 'line-through' : 'normal'}">
                    <div style="width:100px;overflow:hidden;">${comment.id || '&nbsp;'}</div>
                    <div style="width:100px;overflow:hidden;">${comment.parentId || '&nbsp;'}</div>
                    <div style="width:100px;overflow:hidden;">${ { undefined: 'active', 1: 'active', 2: 'deleted', 3: 'edit' }[comment.status] || comment.status}</div>
                    <div style="width:50px;overflow:hidden;">${comment.lineNumber}</div>
                    <div style="width:100px;overflow:hidden;">${comment.author}</div> 
                    <div style="width:100px;overflow:hidden;">${comment.dt}</div> 
                    <div style="width:auto;overflow:hidden;">${comment.text}</div>                    
                    <div style="width:auto;overflow:hidden;">${comment.selection && JSON.stringify(comment.selection) || '&nbsp;'}</div>                    
                </div>`
        )
        .join("");

}

function clearComments() {
    reviewManager.load([]);
    renderComments([]);
}



win.setView = setView;
win.generateDifferentComments = generateDifferentComments;
win.generateDifferentContents = generateDifferentContents;
win.toggleTheme = toggleTheme;
win.clearComments = clearComments;
init();

