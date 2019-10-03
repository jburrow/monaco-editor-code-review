import { ReviewComment, Action, createReviewManager, ReviewManager, ReviewCommentStatus } from "./index";
import * as moment from "moment";



interface WindowDoc {
    require: any;
    monaco: any;
    setView: (mode: string) => void;
    generateDifferentComments: () => void;
    generateDifferentContents: () => void;
    toggleTheme: () => void;
    clearComments: () => void;
    setCurrentUser: () => void;
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
            formatDate: (createdAt: Date | string) => moment(createdAt).format('YY-MM-DD HH:mm')
        }
    );

    renderComments(reviewManager.actions);
}

function toggleTheme() {
    theme = theme == 'vs' ? 'vs-dark' : 'vs';
    win.monaco.editor.setTheme(theme)
}

function generateDifferentComments() {
    reviewManager.load(createRandomComments());
    renderComments(reviewManager.actions);
}

function setCurrentUser() {
    const select = document.body.getElementsByTagName('select')[0] as HTMLSelectElement;
    console.warn(select.value);
}

function createRandomComments(): Action[] {
    const firstLine = Math.floor(Math.random() * 10);

    const result: Action[] = [
        {
            type: "create",
            id: "id-0",
            lineNumber: firstLine + 10,
            createdBy: "another reviewer",
            createdAt: '2019-01-01T00:00:00.000',
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
            targetId: "id-2",
            type: "edit",
            createdBy: "another reviewer",
            createdAt: '2019-06-01T00:00:00.000Z',
            text: "id-2: EDIT EDIT at start"
        },
        {
            id: "id-1",
            type: "create",
            lineNumber: firstLine + 5,
            createdBy: "another reviewer",
            createdAt: '2019-06-01T00:00:00.000Z',
            text: "id-1: at start"
        },
        {
            id: "id-2",
            type: "create",
            targetId: "id-1",
            lineNumber: firstLine + 5,
            createdBy: "another reviewer",
            createdAt: '2019-12-01T00:00:00.000Z',
            text: "id-2: this code isn't very good",
        },
        {
            id: "id-3",
            type: "create",
            targetId: "id-2",
            lineNumber: firstLine + 5,
            createdBy: "original author",
            createdAt: '2019-06-01T00:00:00.000Z',
            text: "id-3: I think you will find it is good enough"
        },
        {
            targetId: "id-3",
            type: "create",
            lineNumber: firstLine + 5,
            createdBy: "original author",
            createdAt: new Date(),
            text: "I think you will find it is good enough",
        },
        {
            targetId: "id-3",
            type: "create",
            lineNumber: firstLine + 5,
            createdBy: "original author",
            createdAt: new Date(),
            text: "I think you will find it is good enough",
        }
    ];
    return result;
}

function renderComments(actions: Action[]) {
    console.log('Render Comments #', actions.length, actions);

    actions = actions || [];
    const rawHeader = {
        type: "Type",
        id: "Id",
        createdBy: "Author",
        createdAt: "Created At",
    }

    console.log('Events', actions);
    const rawHtml = [rawHeader as any].concat(actions as any[])
        .map(
            comment => {
                return `<div style="text-align:left;display:flex;height:16px">
                    <div style="width:100px;overflow:hidden;">${comment.type || '&nbsp;'}</div>
                    <div style="width:100px;overflow:hidden;">${comment.id || '&nbsp;'}</div>
                    <div style="width:100px;overflow:hidden;">${comment.createdBy}</div> 
                    <div style="width:100px;overflow:hidden;">${comment.createdAt}</div>                     
                    <div style="width:auto;overflow:hidden;">${JSON.stringify(comment) || '&nbsp;'}</div>                    
                </div>`
            }
        )
        .join("");

    const activeComments = Object.values(reviewManager.store.comments).map(cs => cs.comment);
    const activeHtml = activeComments
        .map(
            comment =>
                `<div style="text-align:left;display:flex;height:16px;">
                    <div style="width:100px;overflow:hidden;">${comment.id || '&nbsp;'}</div>                                     
                    <div style="width:50px;overflow:hidden;">${comment.lineNumber}</div>
                    <div style="width:100px;overflow:hidden;">${comment.author}</div> 
                    <div style="width:100px;overflow:hidden;">${comment.dt}</div> 
                    <div style="width:auto;overflow:hidden;">${comment.text}</div>                                        
                </div>`
        )
        .join("");

    document.getElementById("summaryEditor").innerHTML = `<div><h5>Active Comments</h5>${activeHtml}</div><div><h5>Raw Comments</h5>${rawHtml}</div>`;
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
win.setCurrentUser = setCurrentUser;
init();

