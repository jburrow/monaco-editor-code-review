import { createReviewManager, ReviewManager } from "./index";
import * as moment from "moment";
import { ReviewCommentEvent } from "./events-comments-reducers";



interface WindowDoc {
    require: any;
    monaco: any;
    setView: (editorMode: string, diffMode: string, theme: string, 
        currentUser: string, editorReadonly: boolean, 
        commentsReadonly: boolean) => void;
    generateDifferentComments: () => void;
    generateDifferentContents: () => void;
    clearComments: () => void;
    setCurrentUser: () => void;
    handleCommentReadonlyChange: () => void;
}

const win = (window as any) as WindowDoc;
let reviewManager: ReviewManager = null;
let currentMode: string = '';
let currentEditor: any = null;
let theme = 'vs-dark';
const fooUser = 'foo.user';
const barUser = 'bar.user';

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

function setView(editorMode: string, diffMode: string, theme: string, currentUser: string, editorReadonly: boolean, commentsReadonly: boolean) {
    console.warn(arguments);
    const idx = getRandomInt((exampleSourceCode.length) / 2) * 2;

    // currentMode = mode;
    document.getElementById("containerEditor").innerHTML = "";
    if (editorMode == 'editor-mode') {
        currentEditor = win.monaco.editor.create(
            document.getElementById("containerEditor"),
            {
                value: exampleSourceCode[idx],
                language: "typescript",
                glyphMargin: true,
                contextmenu: true,
                automaticLayout: true,
                readOnly: editorReadonly,
                theme: theme
            }
        );
        initReviewManager(currentEditor, currentUser, commentsReadonly);
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
            {
                renderSideBySide: diffMode !== "inline-diff",
                theme: theme,
                readOnly: editorReadonly,
                glyphMargin: true,
                contextmenu: true,
                automaticLayout: true,

            }
        );
        e.setModel({
            original: originalModel,
            modified: modifiedModel
        });

        currentEditor = e;
        initReviewManager(e.modifiedEditor, currentUser, commentsReadonly);
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
    const tsobj = await response.text();
    console.log("Compiled at:", tsobj);

    win.require.config({
        paths: { vs: prefix + "/node_modules/monaco-editor/min/vs" }
    });

    win.require(["vs/editor/editor.main"], function () {
        setView("editor-mode", "", "vs-dark", fooUser, false, false);
    });
}

function initReviewManager(editor: any, currentUser: string, readOnly: boolean) {
    reviewManager = createReviewManager(
        editor,
        currentUser,
        createRandomComments(),
        updatedComments => renderComments(updatedComments),
        {
            editButtonEnableRemove: true,
            formatDate: (createdAt: Date | string) => moment(createdAt).format('YY-MM-DD HH:mm'),
            readOnly: readOnly
        }
    );

    setCurrentUser();

    renderComments(reviewManager.events);
}

function toggleTheme() {
    theme = theme == 'vs' ? 'vs-dark' : 'vs';
    win.monaco.editor.setTheme(theme)
}

function handleCommentReadonlyChange(){    
    reviewManager.setReadOnlyMode((event.srcElement as HTMLInputElement).checked);
}

function generateDifferentComments() {
    reviewManager.load(createRandomComments());
    renderComments(reviewManager.events);
}

function setCurrentUser() {
    if (reviewManager && event) {
        reviewManager.currentUser = (event.srcElement as HTMLSelectElement).value;
    }
}

function createRandomComments(): ReviewCommentEvent[] {
    const firstLine = Math.floor(Math.random() * 10);



    const result: ReviewCommentEvent[] = [
        {
            type: "create",
            id: "id-0",
            lineNumber: firstLine + 10,
            createdBy: fooUser,
            createdAt: '2019-01-01T00:00:00.000',
            text: "Near the start",
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
            createdBy: fooUser,
            createdAt: '2019-06-01T00:00:00.000Z',
            text: "EDIT EDIT at start"
        },
        {
            id: "id-1",
            type: "create",
            lineNumber: firstLine + 5,
            createdBy: fooUser,
            createdAt: '2019-06-01T00:00:00.000Z',
            text: "at start"
        },
        {
            id: "id-2",
            type: "create",
            targetId: "id-1",
            lineNumber: firstLine + 5,
            createdBy: fooUser,
            createdAt: '2019-12-01T00:00:00.000Z',
            text: "this code isn't very good",
        },
        {
            id: "id-3",
            type: "create",
            targetId: "id-2",
            lineNumber: firstLine + 5,
            createdBy: barUser,
            createdAt: '2019-06-01T00:00:00.000Z',
            text: "I think you will find it is good enough"
        },
        {
            targetId: "id-3",
            type: "create",
            lineNumber: firstLine + 5,
            createdBy: barUser,
            createdAt: new Date(),
            text: "I think you will find it is good enough",
        },
        {
            targetId: "id-3",
            type: "create",
            lineNumber: firstLine + 5,
            createdBy: barUser,
            createdAt: new Date(),
            text: "I think you will find it is good enough",
        }
    ];
    return result;
}

function renderComments(events: ReviewCommentEvent[]) {
    events = events || [];
    console.log('Events #', events.length, events);

    const rawHtml = '<table><tr><td>Type</td><td>Id</td><td>Created By</td><td>Create At</td></tr>' + events
        .map(
            comment => {
                return `<tr>
                    <td>${comment.type || '&nbsp;'}</td>
                    <td>${comment.id || '&nbsp;'}</td>
                    <td>${comment.createdBy}</td> 
                    <td>${comment.createdAt}</td>                     
                    </tr>
                    <tr>
                    <td colspan="4" class="comment_text">${JSON.stringify(comment) || '&nbsp;'}</td>                    
                </tr>`
            }
        )
        .join("") + '</table>';



    const activeComments = Object.values(reviewManager.store.comments).map(cs => cs.comment);
    const activeHtml = '<table><tr><td>Id</td><td>Line Num</td><td>Created By</td><td>Create At</td></tr>' + activeComments
        .map(
            comment =>
                `<tr>
                    <td>${comment.id || '&nbsp;'}</td>                                     
                    <td>${comment.lineNumber}</td>
                    <td>${comment.author}</td> 
                    <td>${comment.dt}</td> 
                </tr>
                <tr>
                    <td colspan="4" class="comment_text">${comment.text}</td>                                        
                </tr>`
        )
        .join("") + '</table>';

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

