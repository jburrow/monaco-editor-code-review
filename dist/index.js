"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewManager = exports.defaultStyles = exports.EditorMode = exports.convertMarkdownToHTML = exports.ReviewCommentRenderState = exports.ReviewCommentState = exports.commentReducer = exports.ReviewCommentStatus = exports.reduceComments = void 0;
exports.createReviewManager = createReviewManager;
const events_comments_reducers_1 = require("./events-comments-reducers");
Object.defineProperty(exports, "reduceComments", { enumerable: true, get: function () { return events_comments_reducers_1.reduceComments; } });
Object.defineProperty(exports, "ReviewCommentStatus", { enumerable: true, get: function () { return events_comments_reducers_1.ReviewCommentStatus; } });
Object.defineProperty(exports, "commentReducer", { enumerable: true, get: function () { return events_comments_reducers_1.commentReducer; } });
Object.defineProperty(exports, "ReviewCommentState", { enumerable: true, get: function () { return events_comments_reducers_1.ReviewCommentState; } });
Object.defineProperty(exports, "ReviewCommentRenderState", { enumerable: true, get: function () { return events_comments_reducers_1.ReviewCommentRenderState; } });
const comment_1 = require("./comment");
Object.defineProperty(exports, "convertMarkdownToHTML", { enumerable: true, get: function () { return comment_1.convertMarkdownToHTML; } });
const uuid = __importStar(require("uuid"));
// Numeric values of monaco's KeyMod/KeyCode enums - stable across monaco versions.
// Defined locally so the library works without a runtime monaco import or a window.monaco global.
const KeyMod = { CtrlCmd: 2048 };
const KeyCode = { Escape: 9, F10: 68, F11: 69, F12: 70 };
// Used when the editor theme does not expose CSS custom properties, and for colors
// that standalone monaco does not register at all (e.g. button colors).
const fallbackThemeColors = {
    dark: {
        "button.background": "#0e639c",
        "button.foreground": "#ffffff",
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "editor.selectionHighlightBackground": "#add6ff26",
    },
    light: {
        "button.background": "#007acc",
        "button.foreground": "#ffffff",
        "editor.background": "#fffffe",
        "editor.foreground": "#000000",
        "editor.selectionHighlightBackground": "#add6ff4d",
    },
};
var NavigationDirection;
(function (NavigationDirection) {
    NavigationDirection[NavigationDirection["next"] = 1] = "next";
    NavigationDirection[NavigationDirection["prev"] = 2] = "prev";
})(NavigationDirection || (NavigationDirection = {}));
var EditorMode;
(function (EditorMode) {
    EditorMode[EditorMode["insertComment"] = 1] = "insertComment";
    EditorMode[EditorMode["replyComment"] = 2] = "replyComment";
    EditorMode[EditorMode["editComment"] = 3] = "editComment";
    EditorMode[EditorMode["toolbar"] = 4] = "toolbar";
})(EditorMode || (exports.EditorMode = EditorMode = {}));
function createReviewManager(editor, currentUser, events, onChange, config, verbose) {
    // For Debug: (window as any).editor = editor;
    const rm = new ReviewManager(editor, currentUser, onChange, config, verbose);
    rm.load(events !== null && events !== void 0 ? events : []);
    return rm;
}
exports.defaultStyles = {
    reviewComment: {
        "font-family": `font-family: Monaco, Menlo, Consolas, "Droid Sans Mono", "Inconsolata",
  "Courier New", monospace;`,
        "font-size": "12px",
    },
    "reviewComment.dt": {},
    "reviewComment.active": { border: "1px solid darkorange" },
    "reviewComment.inactive": {},
    "reviewComment.author": {},
    "reviewComment.text": {},
    reviewCommentEditor: {
        padding: "5px",
        border: "1px solid blue",
        "margin-left": "1px",
        "box-shadow": " 0px 0px 4px 2px lightblue",
        "font-family": 'font-family: Monaco, Menlo, Consolas, "Droid Sans Mono", "Inconsolata"',
    },
    "reviewCommentEditor.save": { width: "150px" },
    "reviewCommentEditor.cancel": { width: "150px" },
    "reviewCommentEditor.text": { width: "calc(100% - 5px)", resize: "none" },
    editButtonsContainer: { cursor: "pointer", fontSize: "12px" },
    "editButton.add": {},
    "editButton.remove": {},
    "editButton.edit": {},
};
const defaultKeybindings = {
    addComment: [KeyMod.CtrlCmd | KeyCode.F10],
    cancel: [KeyCode.Escape],
    nextComment: [KeyMod.CtrlCmd | KeyCode.F12],
    prevComment: [KeyMod.CtrlCmd | KeyCode.F11],
};
const defaultReviewManagerConfig = {
    commentIndent: 20,
    commentIndentOffset: 20,
    editButtonAddText: "Reply",
    editButtonEditText: "Edit",
    editButtonEnableEdit: true,
    editButtonEnableRemove: true,
    editButtonOffset: "-10px",
    editButtonRemoveText: "Remove",
    readOnly: false,
    rulerMarkerColor: "darkorange",
    rulerMarkerDarkColor: "darkorange",
    showAddCommentGlyph: true,
    showInRuler: true,
    styles: Object.assign({}, exports.defaultStyles),
    setClassNames: true,
    verticalOffset: 0,
    enableMarkdown: false,
    keybindings: defaultKeybindings,
};
const CONTROL_ATTR_NAME = "ReviewManagerControl";
const POSITION_BELOW = 2; // above=1, below=2, exact=0
class ReviewManager {
    constructor(editor, currentUser, onChange, config, verbose) {
        var _a;
        this.editId = "";
        this.commentHeightCache = {};
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = undefined; // TODO - consider moving onto the store
        this.widgetInlineToolbar = undefined;
        this.widgetInlineCommentEditor = undefined;
        this.onChange = onChange;
        this.editorMode = EditorMode.toolbar;
        this.config = Object.assign(Object.assign(Object.assign({}, defaultReviewManagerConfig), (config !== null && config !== void 0 ? config : {})), { keybindings: Object.assign(Object.assign({}, defaultKeybindings), config === null || config === void 0 ? void 0 : config.keybindings) });
        this.currentLineDecorations = this.editor.createDecorationsCollection();
        this.currentCommentDecorations = this.editor.createDecorationsCollection();
        this.currentLineDecorationLineNumber = undefined;
        this.events = [];
        this.store = { comments: {}, events: [] };
        this._renderStore = {};
        this._disposables = [];
        this.verbose = verbose === true;
        this.editorConfig = (_a = this.editor.getRawOptions()) !== null && _a !== void 0 ? _a : {};
        this._disposables.push(this.editor.onDidChangeConfiguration(() => (this.editorConfig = this.editor.getRawOptions())));
        this._disposables.push(this.editor.onMouseDown(this.handleMouseDown.bind(this)));
        this.canAddCondition = this.editor.createContextKey("monacoReviewCanAdd", !this.config.readOnly);
        this.canCancelCondition = this.editor.createContextKey("monacoReviewCanCancel", false);
        this.inlineToolbarElements = this.createInlineToolbarWidget();
        this.editorElements = this.createInlineEditorWidget();
        this.addActions();
        if (this.config.showAddCommentGlyph) {
            this._disposables.push(this.editor.onMouseMove(this.handleMouseMove.bind(this)));
        }
        this.createCustomCssClasses();
    }
    /**
     * Removes all view zones, decorations, widgets, actions and event listeners that this
     * ReviewManager attached to the editor. Call this when unmounting the editor or the
     * hosting component.
     */
    dispose() {
        this.editor.changeViewZones((changeAccessor) => {
            for (const rs of Object.values(this._renderStore)) {
                if (rs.viewZoneId) {
                    changeAccessor.removeZone(rs.viewZoneId);
                }
            }
            if (this.editId) {
                changeAccessor.removeZone(this.editId);
                this.editId = "";
            }
        });
        this._renderStore = {};
        this.currentLineDecorations.clear();
        this.currentCommentDecorations.clear();
        if (this.widgetInlineToolbar) {
            this.editor.removeContentWidget(this.widgetInlineToolbar);
        }
        if (this.widgetInlineCommentEditor) {
            this.editor.removeContentWidget(this.widgetInlineCommentEditor);
        }
        for (const disposable of this._disposables) {
            disposable.dispose();
        }
        this._disposables = [];
    }
    debug(...args) {
        if (this.verbose) {
            console.debug("[monaco-review]", ...args);
        }
    }
    createCustomCssClasses() {
        const id = "monaco_review_custom_styles";
        if (!document.getElementById(id)) {
            const style = document.createElement("style");
            style.id = "monaco_review_custom_styles";
            style.innerHTML = `

    .activeLineMarginClass {
      z-index:10;
      background-image: url("data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8ZyBpZD0ic3ZnXzIiPgogICA8cGF0aCBmaWxsPSJkYXJrb3JhbmdlIiBkPSJtMTIuNDAxMzUsMTUuMjE0NzlsLTkuMjY4MjIsMHEtMS4xNTU3NSwwIC0xLjk2Njk5LC0wLjcyNzJ0LTAuODExMjUsLTEuNzYzMjFsMCwtOS45NjE2NXEwLC0xLjAzNjAxIDAuODExMjUsLTEuNzYzMjF0MS45NjY5OSwtMC43MjcybDkuMjY4MjIsMHExLjE1NTc0LDAgMS45NjY5OSwwLjcyNzJ0MC44MTEyNSwxLjc2MzIxbDAsOS45NjE2NXEwLDEuMDM2MDEgLTAuODExMjUsMS43NjMyMXQtMS45NjY5OSwwLjcyNzJ6bS05LjI2ODIyLC0xMy4yODg4M3EtMC4zNzc4NCwwIC0wLjY1NTY2LDAuMjQ5MDR0LTAuMjc3ODMsMC41ODc3M2wwLDkuOTYxNjVxMCwwLjMzODcgMC4yNzc4MywwLjU4Nzc0dDAuNjU1NjYsMC4yNDkwNGw5LjI2ODIyLDBxMC4zNzc4NCwwIDAuNjQ0NTUsLTAuMjQ5MDR0MC4yNjY3MSwtMC41ODc3NGwwLC05Ljk2MTY1cTAsLTAuMzM4NjkgLTAuMjY2NzEsLTAuNTg3NzN0LTAuNjQ0NTUsLTAuMjQ5MDRsLTkuMjY4MjIsMHptOC4zMzQ3Myw0Ljk4MDgybC03LjQwMTI0LDBxLTAuNDY2NzQsMCAtMC40NjY3NCwtMC4zOTg0N3EwLC0wLjE3OTMxIDAuMTMzMzUsLTAuMjk4ODV0MC4zMzMzOSwtMC4xMTk1NGw3LjQwMTI0LDBxMC4yMDAwMywwIDAuMzMzMzksMC4xMTk1NHQwLjEzMzM1LDAuMjk4ODVxMCwwLjM5ODQ3IC0wLjQ2Njc0LDAuMzk4NDd6bTAsLTIuNDkwNDFsLTcuNDAxMjQsMHEtMC4yMDAwMywwIC0wLjMzMzM5LC0wLjExOTU0dC0wLjEzMzM1LC0wLjI5ODg1cTAsLTAuMzk4NDcgMC40NjY3NCwtMC4zOTg0N2w3LjQwMTI0LDBxMC40NjY3NCwwIDAuNDY2NzQsMC4zOTg0N3EwLDAuMTc5MzEgLTAuMTMzMzUsMC4yOTg4NXQtMC4zMzMzOSwwLjExOTU0em0wLDQuOTgwODJsLTcuNDAxMjQsMHEtMC4yMDAwMywwIC0wLjMzMzM5LC0wLjExOTU0dC0wLjEzMzM1LC0wLjI5ODg1cTAsLTAuMzk4NDYgMC40NjY3NCwtMC4zOTg0Nmw3LjQwMTI0LDBxMC40NjY3NCwwIDAuNDY2NzQsMC4zOTg0NnEwLDAuMTc5MzEgLTAuMTMzMzUsMC4yOTg4NXQtMC4zMzMzOSwwLjExOTU0em0wLDIuNDkwNDFsLTcuNDAxMjQsMHEtMC40NjY3NCwwIC0wLjQ2Njc0LC0wLjM5ODQ2cTAsLTAuMTc5MzEgMC4xMzMzNSwtMC4yOTg4NXQwLjMzMzM5LC0wLjExOTU0bDcuNDAxMjQsMHEwLjIwMDAzLDAgMC4zMzMzOSwwLjExOTU0dDAuMTMzMzUsMC4yOTg4NXEwLDAuMzk4NDYgLTAuNDY2NzQsMC4zOTg0NnoiIGlkPSJzdmdfMSIgc3Ryb2tlPSJudWxsIi8+CiAgPC9nPgogPC9nPgo8L3N2Zz4=");
    }`;
            document.getElementsByTagName("head")[0].appendChild(style);
        }
    }
    setReadOnlyMode(value) {
        this.config.readOnly = value;
        this.canAddCondition.set(!value);
        this.renderAddCommentLineDecoration(undefined);
    }
    load(events) {
        const store = (0, events_comments_reducers_1.reduceComments)(events);
        this.loadFromStore(store, events);
    }
    loadFromStore(store, events) {
        this.editor.changeViewZones((changeAccessor) => {
            // Remove all the existing comments
            for (const viewState of Object.values(this.store.comments)) {
                const rs = this.getRenderState(viewState.comment.id);
                if (rs.viewZoneId) {
                    changeAccessor.removeZone(rs.viewZoneId);
                }
            }
            this.events = events;
            this.store = store;
            this.store.deletedCommentIds = undefined;
            this.store.dirtyCommentIds = undefined;
            this._renderStore = {};
            this.refreshComments();
            this.debug("Events Loaded:", events.length, "Review Comments:", Object.values(this.store.comments).length);
        });
    }
    getThemedColor(name) {
        var _a;
        const domNode = this.editor.getDomNode();
        let value = "";
        if (domNode) {
            // Modern monaco exposes theme colors as CSS custom properties on the editor DOM,
            // e.g. editor.background -> --vscode-editor-background
            value = getComputedStyle(domNode)
                .getPropertyValue(`--vscode-${name.replace(/\./g, "-")}`)
                .trim();
        }
        if (!value) {
            const isDark = (domNode === null || domNode === void 0 ? void 0 : domNode.classList.contains("vs-dark")) || (domNode === null || domNode === void 0 ? void 0 : domNode.classList.contains("hc-black"));
            value = (_a = fallbackThemeColors[isDark ? "dark" : "light"][name]) !== null && _a !== void 0 ? _a : "";
        }
        return value;
    }
    applyStyles(element, className) {
        if (this.config.styles[className] === undefined) {
            console.warn("[monaco-review] [CLASSNAME]", className);
        }
        else {
            const styles = this.config.styles[className];
            if (styles) {
                for (const [key, value] of Object.entries(styles)) {
                    element.style.setProperty(key, value);
                }
            }
            if (this.config.setClassNames) {
                element.className = className;
            }
        }
    }
    createInlineEditButtonsElement() {
        const root = document.createElement("div");
        this.applyStyles(root, "editButtonsContainer");
        root.style.marginLeft = this.config.editButtonOffset;
        // root.style.marginTop = "100px";
        // root.style.fontSize = "12px";
        const add = document.createElement("span");
        add.innerText = this.config.editButtonAddText;
        this.applyStyles(add, "editButton.add");
        add.setAttribute(CONTROL_ATTR_NAME, "");
        add.onclick = () => {
            this.setEditorMode(EditorMode.replyComment, "reply-comment-inline-button");
        };
        root.appendChild(add);
        let remove;
        let edit;
        let spacer = null;
        if (this.config.editButtonEnableRemove) {
            spacer = document.createElement("div");
            spacer.innerText = " ";
            root.appendChild(spacer);
            remove = document.createElement("span");
            remove.setAttribute(CONTROL_ATTR_NAME, "");
            remove.innerText = this.config.editButtonRemoveText;
            this.applyStyles(remove, "editButton.remove");
            remove.onclick = () => this.activeComment && this.removeComment(this.activeComment.id);
            root.appendChild(remove);
        }
        if (this.config.editButtonEnableEdit) {
            spacer = document.createElement("div");
            spacer.innerText = " ";
            root.appendChild(spacer);
            edit = document.createElement("span");
            edit.setAttribute(CONTROL_ATTR_NAME, "");
            edit.innerText = this.config.editButtonEditText;
            this.applyStyles(edit, "editButton.edit");
            edit.onclick = () => {
                this.setEditorMode(EditorMode.editComment, "edit-comment-button");
            };
            root.appendChild(edit);
        }
        return { root, add, remove, edit };
    }
    handleCancel() {
        this.debug("[handleCancel]");
        this.setActiveComment(undefined, "cancel");
        this.setEditorMode(EditorMode.toolbar, "cancel");
        this.editor.focus();
    }
    handleAddComment() {
        var _a, _b;
        // FIX - this isn't right.
        const lineNumber = this.activeComment
            ? this.activeComment.lineNumber
            : ((_b = (_a = this.editor.getSelection()) === null || _a === void 0 ? void 0 : _a.endLineNumber) !== null && _b !== void 0 ? _b : 1);
        const text = this.editorElements.textarea.value;
        const selection = this.activeComment ? undefined : this.editor.getSelection();
        this.addComment(lineNumber, text, selection);
        this.setEditorMode(EditorMode.toolbar, "add-comment-1");
        this.editor.focus();
    }
    handleTextAreaKeyDown(e) {
        if (e.code === "Escape") {
            this.handleCancel();
            e.preventDefault();
            this.debug("[handleTextAreaKeyDown] preventDefault: Escape Key");
        }
        else if (e.code === "Enter" && e.ctrlKey) {
            this.handleAddComment();
            e.preventDefault();
            this.debug("[handleTextAreaKeyDown] preventDefault: ctrl+Enter");
        }
    }
    createInlineEditorElement() {
        const root = document.createElement("div");
        this.applyStyles(root, "reviewCommentEditor");
        const textarea = document.createElement("textarea");
        textarea.setAttribute(CONTROL_ATTR_NAME, "");
        this.applyStyles(textarea, "reviewCommentEditor.text");
        textarea.innerText = "";
        textarea.rows = 3;
        textarea.name = "text";
        textarea.onkeydown = this.handleTextAreaKeyDown.bind(this);
        const confirm = document.createElement("button");
        confirm.setAttribute(CONTROL_ATTR_NAME, "");
        this.applyStyles(confirm, "reviewCommentEditor.save");
        confirm.innerText = "placeholder add";
        confirm.onclick = this.handleAddComment.bind(this);
        const cancel = document.createElement("button");
        cancel.setAttribute(CONTROL_ATTR_NAME, "");
        this.applyStyles(cancel, "reviewCommentEditor.cancel");
        cancel.innerText = "Cancel";
        cancel.onclick = this.handleCancel.bind(this);
        root.appendChild(textarea);
        root.appendChild(cancel);
        root.appendChild(confirm);
        return { root, confirm, cancel, textarea };
    }
    createInlineToolbarWidget() {
        const buttonsElement = this.createInlineEditButtonsElement();
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const this_ = this;
        this.widgetInlineToolbar = {
            allowEditorOverflow: true,
            getId: () => {
                return "widgetInlineToolbar";
            },
            getDomNode: () => {
                return buttonsElement.root;
            },
            getPosition: () => {
                if (this_.activeComment && this_.editorMode == EditorMode.toolbar && !this_.config.readOnly) {
                    return {
                        position: {
                            lineNumber: this_.activeComment.lineNumber,
                            column: 1,
                        },
                        preference: [POSITION_BELOW],
                    };
                }
                return null;
            },
        };
        this.editor.addContentWidget(this.widgetInlineToolbar);
        return buttonsElement;
    }
    calculateConfirmButtonText() {
        if (this.editorMode == EditorMode.insertComment) {
            return "Add Comment";
        }
        if (this.editorMode == EditorMode.replyComment) {
            return "Reply to Comment";
        }
        else {
            return "Edit Comment";
        }
    }
    createInlineEditorWidget() {
        // doesn't re-theme when
        const editorElement = this.createInlineEditorElement();
        this.widgetInlineCommentEditor = {
            allowEditorOverflow: true,
            getId: () => {
                return "widgetInlineEditor";
            },
            getDomNode: () => {
                return editorElement.root;
            },
            getPosition: () => {
                if (this.editorMode != EditorMode.toolbar) {
                    const lineNumber = this.getActivePosition();
                    if (lineNumber !== undefined) {
                        editorElement.confirm.innerText = this.calculateConfirmButtonText();
                        return {
                            position: {
                                lineNumber,
                                column: 1,
                            },
                            preference: [2],
                        };
                    }
                }
                return null;
            },
        };
        this.editor.addContentWidget(this.widgetInlineCommentEditor);
        return editorElement;
    }
    getActivePosition() {
        var _a;
        const position = this.editor.getPosition();
        const activePosition = this.activeComment ? this.activeComment.lineNumber : position === null || position === void 0 ? void 0 : position.lineNumber;
        // does it need an offset?
        this.debug("[getActivePosition]", activePosition, (_a = this.activeComment) === null || _a === void 0 ? void 0 : _a.lineNumber, position === null || position === void 0 ? void 0 : position.lineNumber);
        return activePosition;
    }
    setActiveComment(comment, reason) {
        this.debug("[setActiveComment]", comment, reason);
        this.canCancelCondition.set(Boolean(this.activeComment));
        const isDifferentComment = this.activeComment !== comment;
        const lineNumbersToMakeDirty = [];
        if (this.activeComment && (!comment || this.activeComment.lineNumber !== comment.lineNumber)) {
            lineNumbersToMakeDirty.push(this.activeComment.lineNumber);
        }
        if (comment) {
            lineNumbersToMakeDirty.push(comment.lineNumber);
        }
        this.activeComment = comment;
        if (lineNumbersToMakeDirty.length > 0) {
            this.filterAndMapComments(lineNumbersToMakeDirty, (comment) => {
                const rs = this.getRenderState(comment.id);
                rs.renderStatus = events_comments_reducers_1.ReviewCommentRenderState.dirty;
            });
        }
        return isDifferentComment;
    }
    filterAndMapComments(lineNumbers, fn) {
        for (const cs of Object.values(this.store.comments)) {
            if (lineNumbers.includes(cs.comment.lineNumber)) {
                fn(cs.comment);
            }
        }
    }
    handleMouseMove(ev) {
        var _a, _b, _c, _d;
        if (!((_b = (_a = ev.target) === null || _a === void 0 ? void 0 : _a.detail) === null || _b === void 0 ? void 0 : _b.viewZoneId) &&
            ((_d = (_c = ev.target) === null || _c === void 0 ? void 0 : _c.position) === null || _d === void 0 ? void 0 : _d.lineNumber) &&
            ev.target.position.lineNumber !== this.currentLineDecorationLineNumber) {
            this.currentLineDecorationLineNumber = ev.target.position.lineNumber;
            this.renderAddCommentLineDecoration(this.config.readOnly ? undefined : this.currentLineDecorationLineNumber);
        }
    }
    renderAddCommentLineDecoration(lineNumber) {
        const modelDeltaDecorations = lineNumber
            ? [
                {
                    range: { startLineNumber: lineNumber, startColumn: 0, endLineNumber: lineNumber, endColumn: 0 },
                    options: {
                        marginClassName: "activeLineMarginClass", // TODO - fix the creation of this style
                        zIndex: 100,
                    },
                },
            ]
            : [];
        this.currentLineDecorations.set(modelDeltaDecorations);
    }
    findCommentByViewZoneId(viewZoneId) {
        if (viewZoneId) {
            for (const cs of Object.values(this.store.comments)) {
                const rs = this.getRenderState(cs.comment.id);
                if (rs.viewZoneId === viewZoneId) {
                    return cs.comment;
                }
            }
        }
    }
    handleMouseDown(ev) {
        // Not ideal - but couldn't figure out a different way to identify the glyph event
        var _a, _b, _c, _d, _e, _f;
        if (((_b = (_a = ev.target) === null || _a === void 0 ? void 0 : _a.element) === null || _b === void 0 ? void 0 : _b.className) &&
            ((_d = (_c = ev === null || ev === void 0 ? void 0 : ev.target) === null || _c === void 0 ? void 0 : _c.element) === null || _d === void 0 ? void 0 : _d.className.indexOf("activeLineMarginClass")) > -1 &&
            this.currentLineDecorationLineNumber !== undefined) {
            this.editor.setPosition({
                lineNumber: this.currentLineDecorationLineNumber,
                column: 1,
            });
            this.setEditorMode(EditorMode.insertComment, "mouse-down-1");
        }
        else if (!((_f = (_e = ev.target) === null || _e === void 0 ? void 0 : _e.element) === null || _f === void 0 ? void 0 : _f.hasAttribute(CONTROL_ATTR_NAME))) {
            const detail = ev.target.detail;
            const activeComment = this.findCommentByViewZoneId(detail === null || detail === void 0 ? void 0 : detail.viewZoneId);
            const commentChanged = this.setActiveComment(activeComment, "handleMouseDown");
            this.refreshComments();
            if (commentChanged && this.activeComment) {
                this.setEditorMode(EditorMode.toolbar, "mouse-down-2");
            }
        }
    }
    calculateMarginTopOffset(includeActiveCommentHeight) {
        var _a;
        let marginTop = 0;
        if (this.activeComment) {
            for (const item of this.iterateComments()) {
                if (item.state.comment.lineNumber === this.activeComment.lineNumber &&
                    (item.state.comment != this.activeComment || includeActiveCommentHeight)) {
                    marginTop += (_a = this.commentHeightCache[this.getHeightCacheKey(item)]) !== null && _a !== void 0 ? _a : 0;
                }
                if (item.state.comment == this.activeComment) {
                    break;
                }
            }
        }
        return marginTop + this.config.verticalOffset;
    }
    layoutInlineToolbar() {
        this.inlineToolbarElements.root.style.backgroundColor = this.getThemedColor("editor.background");
        this.inlineToolbarElements.root.style.marginTop = `${this.calculateMarginTopOffset(false)}px`;
        if (this.inlineToolbarElements.remove) {
            const hasChildren = this.activeComment && this.iterateComments((c) => { var _a; return c.comment.id === ((_a = this.activeComment) === null || _a === void 0 ? void 0 : _a.id); }).length > 1;
            const isSameUser = this.activeComment && this.activeComment.author === this.currentUser;
            this.inlineToolbarElements.remove.style.display = hasChildren ? "none" : "";
            if (this.inlineToolbarElements.edit) {
                this.inlineToolbarElements.edit.style.display = hasChildren || !isSameUser ? "none" : "";
            }
        }
        if (this.widgetInlineToolbar) {
            this.editor.layoutContentWidget(this.widgetInlineToolbar);
        }
    }
    layoutInlineCommentEditor() {
        this.editorElements.root.style.backgroundColor = this.getThemedColor("editor.selectionHighlightBackground");
        this.editorElements.root.style.color = this.getThemedColor("editor.foreground");
        this.editorElements.root.style.marginTop = `${this.config.verticalOffset}px`;
        this.editorElements.textarea.style.backgroundColor = this.getThemedColor("editor.background");
        this.editorElements.textarea.style.color = this.getThemedColor("editor.foreground");
        [this.editorElements.confirm, this.editorElements.cancel].forEach((button) => {
            button.style.backgroundColor = this.getThemedColor("button.background");
            button.style.color = this.getThemedColor("button.foreground");
        });
        this.editorElements.confirm.innerText = this.editorMode === EditorMode.editComment ? "Edit Comment" : "Add Comment";
        if (this.widgetInlineCommentEditor) {
            this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
        }
    }
    setEditorMode(mode, why = "") {
        const activeComment = mode === EditorMode.insertComment ? undefined : this.activeComment;
        this.editorMode = this.config.readOnly ? EditorMode.toolbar : mode;
        this.debug("setEditorMode", EditorMode[mode], why, "Comment:", activeComment, "ReadOnly:", this.config.readOnly, "Result:", EditorMode[this.editorMode]);
        this.layoutInlineToolbar();
        this.layoutInlineCommentEditor();
        this.setActiveComment(activeComment);
        this.refreshComments();
        if (mode != EditorMode.toolbar) {
            if (mode == EditorMode.insertComment || mode == EditorMode.replyComment) {
                this.editorElements.textarea.value = "";
            }
            else if (mode == EditorMode.editComment) {
                this.editorElements.textarea.value = (activeComment === null || activeComment === void 0 ? void 0 : activeComment.text) ? activeComment.text : "";
            }
            // HACK - because the event in monaco doesn't have preventdefault which means editor takes focus back...
            setTimeout(() => {
                this.editorElements.textarea.focus();
            }, 100); // TODO - make configurable
        }
    }
    getDateTimeNow() {
        return new Date().getTime();
    }
    recurseComments(allComments, filterFn, depth, results) {
        const comments = Object.values(allComments).filter(filterFn);
        for (const cs of comments) {
            const comment = cs.comment;
            delete allComments[comment.id];
            results.push({
                depth,
                state: cs,
            });
            this.recurseComments(allComments, (rcs) => rcs.comment.parentId === comment.id, depth + 1, results);
        }
    }
    iterateComments(filterFn) {
        if (!filterFn) {
            filterFn = (cs) => !cs.comment.parentId;
        }
        const copyCommentState = Object.assign({}, this.store.comments);
        const results = [];
        this.recurseComments(copyCommentState, filterFn, 0, results);
        return results;
    }
    removeComment(id) {
        return this.addEvent({ type: "delete", targetId: id });
    }
    addComment(lineNumber, text, selection) {
        var _a, _b;
        const event = this.editorMode === EditorMode.editComment && ((_a = this.activeComment) === null || _a === void 0 ? void 0 : _a.id)
            ? { type: "edit", text, targetId: this.activeComment.id }
            : {
                type: "create",
                text,
                lineNumber,
                selection,
                targetId: (_b = this.activeComment) === null || _b === void 0 ? void 0 : _b.id,
            };
        return this.addEvent(event);
    }
    addEvent(event) {
        const populatedEvent = Object.assign(Object.assign({}, event), { createdBy: this.currentUser, createdAt: this.getDateTimeNow(), id: uuid.v4() });
        this.debug("[addEvent]", populatedEvent);
        this.events.push(populatedEvent);
        this.store = (0, events_comments_reducers_1.commentReducer)(populatedEvent, this.store);
        this.setActiveComment(undefined);
        this.refreshComments();
        this.layoutInlineToolbar();
        if (this.onChange) {
            this.onChange(this.events);
        }
        return populatedEvent;
    }
    formatDate(dt) {
        if (Number.isInteger(dt)) {
            try {
                const d = new Date(dt);
                if (this.config.formatDate) {
                    return this.config.formatDate(d);
                }
                else {
                    return d.toISOString();
                }
            }
            catch (_a) {
                console.warn("[formatDate] Unable to convert", dt, "to date object");
            }
        }
        return `${dt}`;
    }
    createElement(text, className, tagName = undefined) {
        const span = document.createElement(tagName || "span");
        this.applyStyles(span, className);
        if (text) {
            span.innerText = text;
        }
        return span;
    }
    getRenderState(commentId) {
        if (!this._renderStore[commentId]) {
            this._renderStore[commentId] = { viewZoneId: undefined, renderStatus: undefined };
        }
        return this._renderStore[commentId];
    }
    refreshComments() {
        this.editor.changeViewZones((changeAccessor) => {
            const lineNumbers = {};
            if (this.editorMode !== EditorMode.toolbar) {
                // This creates a blank section viewZone that makes space for the interactive text file for editing
                if (this.editId) {
                    changeAccessor.removeZone(this.editId);
                }
                const node = document.createElement("div");
                // node.style.backgroundColor = "orange";
                const afterLineNumber = this.getActivePosition();
                if (afterLineNumber !== undefined) {
                    this.editId = changeAccessor.addZone({
                        afterLineNumber,
                        heightInPx: 100,
                        domNode: node,
                        suppressMouseDown: true,
                    });
                }
            }
            else if (this.editId) {
                changeAccessor.removeZone(this.editId);
            }
            for (const cid of Array.from(this.store.deletedCommentIds || [])) {
                const viewZoneId = this.getRenderState(cid).viewZoneId;
                if (viewZoneId) {
                    changeAccessor.removeZone(viewZoneId);
                    this.debug("Zone.Delete", viewZoneId);
                }
            }
            this.store.deletedCommentIds = undefined;
            for (const cid of Array.from(this.store.dirtyCommentIds || [])) {
                this.getRenderState(cid).renderStatus = events_comments_reducers_1.ReviewCommentRenderState.dirty;
            }
            this.store.dirtyCommentIds = undefined;
            for (const item of this.iterateComments()) {
                const rs = this.getRenderState(item.state.comment.id);
                if (rs.renderStatus === events_comments_reducers_1.ReviewCommentRenderState.hidden && rs.viewZoneId) {
                    this.debug("Zone.Hidden", item.state.comment.id);
                    changeAccessor.removeZone(rs.viewZoneId);
                    rs.viewZoneId = undefined;
                    continue;
                }
                if (rs.renderStatus === events_comments_reducers_1.ReviewCommentRenderState.dirty && rs.viewZoneId) {
                    this.debug("Zone.Dirty", item.state.comment.id);
                    changeAccessor.removeZone(rs.viewZoneId);
                    rs.viewZoneId = undefined;
                    rs.renderStatus = events_comments_reducers_1.ReviewCommentRenderState.normal;
                }
                if (!lineNumbers[item.state.comment.lineNumber]) {
                    lineNumbers[item.state.comment.lineNumber] = item.state.comment.selection;
                }
                if (rs.viewZoneId == undefined) {
                    this.debug("Zone.Create", item.state.comment.id);
                    const isActive = this.activeComment == item.state.comment;
                    const domNode = this.config.renderComment
                        ? this.config.renderComment(isActive, item)
                        : this.renderComment(isActive, item);
                    const heightInPx = this.measureHeightInPx(item, domNode);
                    rs.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: item.state.comment.lineNumber,
                        heightInPx,
                        domNode,
                        suppressMouseDown: true, // This stops focus being lost the editor - meaning keyboard shortcuts keeps working
                    });
                }
            }
            if (this.config.showInRuler) {
                const decorators = [];
                for (const [ln, selection] of Object.entries(lineNumbers)) {
                    const lineNumber = Number(ln);
                    decorators.push({
                        range: { startLineNumber: lineNumber, startColumn: 0, endLineNumber: lineNumber, endColumn: 0 },
                        options: {
                            isWholeLine: true,
                            overviewRuler: {
                                color: this.config.rulerMarkerColor,
                                darkColor: this.config.rulerMarkerDarkColor,
                                position: 1,
                            },
                        },
                    });
                    if (selection) {
                        decorators.push({
                            range: {
                                startLineNumber: selection.startLineNumber,
                                startColumn: selection.startColumn,
                                endLineNumber: selection.endLineNumber,
                                endColumn: selection.endColumn,
                            },
                            options: {
                                className: "reviewComment selection",
                            },
                        });
                    }
                }
                this.currentCommentDecorations.set(decorators);
            }
        });
    }
    measureHeightInPx(item, domNode) {
        const cacheKey = this.getHeightCacheKey(item);
        // attach to dom to calculate height
        if (this.commentHeightCache[cacheKey] === undefined) {
            const container = document.createElement("div");
            container.style.position = "absolute";
            container.style.top = "0px";
            container.appendChild(domNode);
            document.body.appendChild(container);
            const height = container.offsetHeight;
            document.body.removeChild(container);
            container.removeChild(domNode);
            this.commentHeightCache[cacheKey] = height;
            this.debug("calculated height", height);
        }
        else {
            this.debug("using cached height", cacheKey, this.commentHeightCache[cacheKey]);
        }
        return this.commentHeightCache[cacheKey];
    }
    getHeightCacheKey(item) {
        return `${item.state.comment.id}-${item.state.history.length}`;
    }
    renderComment(isActive, item) {
        const rootNode = this.createElement("", "reviewComment"); // .${isActive ? "active" : "inactive"}`);
        rootNode.style.marginLeft = this.config.commentIndent * (item.depth + 1) + this.config.commentIndentOffset + "px";
        rootNode.style.backgroundColor = this.getThemedColor("editor.selectionHighlightBackground");
        const domNode = this.createElement("", `reviewComment.${isActive ? "active" : "inactive"}`);
        rootNode.appendChild(domNode);
        // // For Debug - domNode.appendChild(this.createElement(`${item.state.comment.id}`, 'reviewComment id'))
        domNode.appendChild(this.createElement(`${item.state.comment.author || " "} at `, "reviewComment.author"));
        if (item.state.comment.dt) {
            domNode.appendChild(this.createElement(this.formatDate(item.state.comment.dt), "reviewComment.dt"));
        }
        if (item.state.history.length > 1) {
            domNode.appendChild(this.createElement(`(Edited ${item.state.history.length - 1} times)`, "reviewComment.history"));
        }
        const textNode = this.createElement("", "reviewComment.text", "div");
        textNode.style.width = "70vw";
        if (this.config.enableMarkdown) {
            textNode.innerHTML = (0, comment_1.convertMarkdownToHTML)(item.state.comment.text);
        }
        else {
            textNode.innerText = item.state.comment.text;
        }
        rootNode.appendChild(textNode);
        return rootNode;
    }
    addActions() {
        this._disposables.push(this.editor.addAction({
            id: "monaco-review.cancel",
            label: "Cancel Comment",
            keybindings: this.config.keybindings.cancel,
            precondition: "monacoReviewCanCancel",
            keybindingContext: undefined,
            contextMenuGroupId: "navigation",
            contextMenuOrder: 0,
            run: () => {
                this.handleCancel();
            },
        }));
        this._disposables.push(this.editor.addAction({
            id: "monaco-review.add",
            label: "Add Comment",
            keybindings: this.config.keybindings.addComment,
            precondition: "monacoReviewCanAdd",
            keybindingContext: undefined,
            contextMenuGroupId: "navigation",
            contextMenuOrder: 0,
            run: () => {
                this.setEditorMode(EditorMode.insertComment, "add-comment-context-menu");
            },
        }));
        this._disposables.push(this.editor.addAction({
            id: "monaco-review.next",
            label: "Next Comment",
            keybindings: this.config.keybindings.nextComment,
            precondition: undefined,
            keybindingContext: undefined,
            contextMenuGroupId: "navigation",
            contextMenuOrder: 0.101,
            run: () => {
                this.navigateToComment(NavigationDirection.next);
            },
        }));
        this._disposables.push(this.editor.addAction({
            id: "monaco-review.prev",
            label: "Prev Comment",
            keybindings: this.config.keybindings.prevComment,
            precondition: undefined,
            keybindingContext: undefined,
            contextMenuGroupId: "navigation",
            contextMenuOrder: 0.102,
            run: () => {
                this.navigateToComment(NavigationDirection.prev);
            },
        }));
    }
    navigateToComment(direction) {
        let currentLine = 0;
        const position = this.editor.getPosition();
        if (this.activeComment) {
            currentLine = this.activeComment.lineNumber;
        }
        else if (position) {
            currentLine = position.lineNumber;
        }
        else {
            return;
        }
        const comments = Object.values(this.store.comments)
            .map((cs) => cs.comment)
            .filter((c) => {
            if (!c.parentId) {
                if (direction === NavigationDirection.next) {
                    return c.lineNumber > currentLine;
                }
                else if (direction === NavigationDirection.prev) {
                    return c.lineNumber < currentLine;
                }
            }
        });
        if (comments.length > 0) {
            comments.sort((a, b) => {
                if (direction === NavigationDirection.next) {
                    return a.lineNumber - b.lineNumber;
                }
                else if (direction === NavigationDirection.prev) {
                    return b.lineNumber - a.lineNumber;
                }
                else {
                    return 0;
                }
            });
            const comment = comments[0];
            this.setActiveComment(comment);
            this.refreshComments();
            this.layoutInlineToolbar();
            this.editor.revealLineInCenter(comment.lineNumber);
        }
    }
}
exports.ReviewManager = ReviewManager;
//# sourceMappingURL=index.js.map