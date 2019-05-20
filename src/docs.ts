import { ReviewComment, createReviewManager } from "./index";

interface WindowDoc {
    require: any;
    monaco: any;
    setView: any;
    generateDifferentComments: any;
    generateDifferentContents: any;
}

const win = (window as any) as WindowDoc;
let reviewManager: any = null;
let currentMode: string = '';
let currentEditor: any = null;

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

function setView(mode) {
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
                readOnly: mode === "standard-readonly"
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

        currentEditor = win.monaco.editor.createDiffEditor(
            document.getElementById("containerEditor"),
            { renderSideBySide: mode !== "inline" }
        );
        currentEditor.setModel({
            original: originalModel,
            modified: modifiedModel
        });

        initReviewManager(currentEditor.modifiedEditor);
    }
}

function generateDifferentContents() {
    const idx = getRandomInt((exampleSourceCode.length) / 2) * 2;

    if (currentMode.startsWith("standard")) {
        currentEditor.setValue(exampleSourceCode[idx]);
    } else {
        currentEditor.getModel().modified.setValue(exampleSourceCode[idx]);
        currentEditor.getModel().modified.setValue(exampleSourceCode[idx+1]);
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
    var summaryDiv = document.getElementById("summaryEditor");
    reviewManager = createReviewManager(
        editor,
        "mr reviewer",
        createRandomComments(),
        updatedComments => renderComments(summaryDiv, updatedComments),
        { editButtonEnableRemove: false }
    );

    renderComments(summaryDiv, reviewManager.comments);
}

function generateDifferentComments() {
    reviewManager.load(createRandomComments());
}

function createRandomComments() {
    const firstLine = Math.floor(Math.random() * 10);

    return [
        new ReviewComment(
            "id-0",
            firstLine + 1,
            "another reviewer",
            new Date(),
            "at start"
        ),
        new ReviewComment(
            "id-2",
            firstLine + 50,
            "another reviewer",
            new Date(),
            "at start"
        ),
        new ReviewComment(
            undefined,
            firstLine + 5,
            "another reviewer",
            new Date(),
            "this code isn't very good",
            [
                new ReviewComment(
                    undefined,
                    firstLine + 5,
                    "original author",
                    new Date(),
                    "I think you will find it is good enough"
                ),
                new ReviewComment(
                    undefined,
                    firstLine + 5,
                    "original author",
                    new Date(),
                    "I think you will find it is good enough",
                    [new ReviewComment(
                        undefined,
                        firstLine + 5,
                        "original author",
                        new Date(),
                        "I think you will find it is good enough"
                    )]
                )
                , new ReviewComment(
                    undefined,
                    firstLine + 5,
                    "original author",
                    new Date(),
                    "I think you will find it is good enough"
                )
            ]
        )
    ];

}

function renderComments(element, comments) {
    comments = comments || [];
    element.innerHTML = comments
        .map(
            comment =>
                `<div>${comment.id} ${comment.lineNumber} ${comment.author} ${
                comment.text
                } ${comment.deleted ? "DELETED" : ""}</div>`
        )
        .join("");
    console.log(
        "Comments Changed:",
        comments
            .map(
                comment =>
                    `${comment.id} ${comment.lineNumber} ${comment.author} ${
                    comment.text
                    } ${comment.deleted}`
            )
            .join("\n")
    );
}

win.setView = setView;
win.generateDifferentComments = generateDifferentComments;
win.generateDifferentContents = generateDifferentContents;

init();

