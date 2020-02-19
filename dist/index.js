"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_comments_reducers_1 = require("./events-comments-reducers");
exports.reduceComments = events_comments_reducers_1.reduceComments;
const uuid = require("uuid/v4");
const monacoWindow = window;
var NavigationDirection;
(function (NavigationDirection) {
    NavigationDirection[NavigationDirection["next"] = 1] = "next";
    NavigationDirection[NavigationDirection["prev"] = 2] = "prev";
})(NavigationDirection || (NavigationDirection = {}));
var EditorMode;
(function (EditorMode) {
    EditorMode[EditorMode["insertComment"] = 1] = "insertComment";
    EditorMode[EditorMode["editComment"] = 2] = "editComment";
    EditorMode[EditorMode["toolbar"] = 3] = "toolbar";
})(EditorMode = exports.EditorMode || (exports.EditorMode = {}));
function createReviewManager(editor, currentUser, actions, onChange, config, verbose) {
    //For Debug: (window as any).editor = editor;
    const rm = new ReviewManager(editor, currentUser, onChange, config, verbose);
    rm.load(actions || []);
    return rm;
}
exports.createReviewManager = createReviewManager;
const defaultReviewManagerConfig = {
    commentIndent: 20,
    commentIndentOffset: 20,
    editButtonAddText: 'Reply',
    editButtonEditText: 'Edit',
    editButtonEnableEdit: true,
    editButtonEnableRemove: true,
    editButtonOffset: '-10px',
    editButtonRemoveText: 'Remove',
    formatDate: null,
    readOnly: false,
    rulerMarkerColor: 'darkorange',
    rulerMarkerDarkColor: 'darkorange',
    showAddCommentGlyph: true,
    showInRuler: true,
    verticalOffset: 0,
};
const CONTROL_ATTR_NAME = 'ReviewManagerControl';
const POSITION_BELOW = 2; //above=1, below=2, exact=0
class ReviewManager {
    constructor(editor, currentUser, onChange, config, verbose) {
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = null; //TODO - consider moving onto the store
        this.widgetInlineToolbar = null;
        this.widgetInlineCommentEditor = null;
        this.onChange = onChange;
        this.editorMode = EditorMode.toolbar;
        this.config = Object.assign(Object.assign({}, defaultReviewManagerConfig), (config || {}));
        this.currentLineDecorations = [];
        this.currentCommentDecorations = [];
        this.currentLineDecorationLineNumber = null;
        this.events = [];
        this.store = { comments: {} }; //, viewZoneIdsToDelete: [] };
        this.renderStore = {};
        this.verbose = verbose;
        this.editorConfig = this.editor.getRawOptions();
        this.editor.onDidChangeConfiguration(() => this.editorConfig = this.editor.getRawOptions());
        this.editor.onMouseDown(this.handleMouseDown.bind(this));
        this.canAddCondition = this.editor.createContextKey('add-context-key', !this.config.readOnly);
        this.inlineToolbarElements = this.createInlineToolbarWidget();
        this.editorElements = this.createInlineEditorWidget();
        this.addActions();
        if (this.config.showAddCommentGlyph) {
            this.editor.onMouseMove(this.handleMouseMove.bind(this));
        }
    }
    setReadOnlyMode(value) {
        this.config.readOnly = value;
        this.canAddCondition.set(value);
        this.renderAddCommentLineDecoration(null);
    }
    load(events) {
        const store = events_comments_reducers_1.reduceComments(events);
        this.loadFromStore(store, events);
    }
    loadFromStore(store, events) {
        this.editor.changeViewZones((changeAccessor) => {
            // Remove all the existing comments     
            for (const viewState of Object.values(this.store.comments)) {
                const x = this.getRenderState(viewState.comment.id);
                if (x && x.viewZoneId !== null) {
                    changeAccessor.removeZone(x.viewZoneId);
                }
            }
            this.events = events;
            this.store = store;
            this.store.deletedCommentIds = null;
            this.store.dirtyCommentIds = null;
            this.renderStore = {};
            this.refreshComments();
            this.verbose && console.debug('Events Loaded:', events.length, 'Review Comments:', Object.values(this.store.comments).length);
        });
    }
    getThemedColor(name) {
        // editor.background: e {rgba: e}
        // editor.foreground: e {rgba: e}
        // editor.inactiveSelectionBackground: e {rgba: e}
        // editor.selectionHighlightBackground: e {rgba: e}
        // editorIndentGuide.activeBackground: e {rgba: e}
        // editorIndentGuide.background: e {rgba: e}
        const theme = this.editor._themeService.getTheme();
        let value = theme.getColor(name);
        // HACK - Buttons themes are not in monaco ... so just hack in theme for dark
        const missingThemes = {
            'dark': {
                "button.background": "#0e639c",
                "button.foreground": "#ffffff",
            },
            'light': {
                "button.background": "#007acc",
                "button.foreground": "#ffffff"
            }
        };
        if (!value) {
            value = missingThemes[theme.themeName.indexOf('dark') > -1 ? 'dark' : 'light'][name];
        }
        return value;
    }
    createInlineEditButtonsElement() {
        var root = document.createElement('div');
        root.className = 'editButtonsContainer';
        root.style.marginLeft = this.config.editButtonOffset;
        const add = document.createElement('span');
        add.innerText = this.config.editButtonAddText;
        add.className = 'editButton add';
        add.setAttribute(CONTROL_ATTR_NAME, '');
        add.onclick = () => this.setEditorMode(EditorMode.insertComment);
        root.appendChild(add);
        let remove = null;
        let edit = null;
        let spacer = null;
        if (this.config.editButtonEnableRemove) {
            spacer = document.createElement('div');
            spacer.innerText = ' ';
            root.appendChild(spacer);
            remove = document.createElement('span');
            remove.setAttribute(CONTROL_ATTR_NAME, '');
            remove.innerText = this.config.editButtonRemoveText;
            remove.className = 'editButton remove';
            remove.onclick = () => this.activeComment && this.removeComment(this.activeComment.id);
            root.appendChild(remove);
        }
        if (this.config.editButtonEnableEdit) {
            spacer = document.createElement('div');
            spacer.innerText = ' ';
            root.appendChild(spacer);
            edit = document.createElement('span');
            edit.setAttribute(CONTROL_ATTR_NAME, '');
            edit.innerText = this.config.editButtonEditText;
            edit.className = 'editButton edit';
            edit.onclick = () => this.setEditorMode(EditorMode.editComment);
            root.appendChild(edit);
        }
        return { root, add, remove, edit };
    }
    handleCancel() {
        this.setEditorMode(EditorMode.toolbar);
        this.editor.focus();
    }
    handleAddComment() {
        const lineNumber = this.activeComment ? this.activeComment.lineNumber : this.editor.getSelection().endLineNumber;
        const text = this.editorElements.textarea.value;
        const selection = this.activeComment ? null : this.editor.getSelection();
        this.addComment(lineNumber, text, selection);
        this.setEditorMode(EditorMode.toolbar);
        this.editor.focus();
    }
    handleTextAreaKeyDown(e) {
        if (e.code === "Escape") {
            this.handleCancel();
            e.preventDefault();
            console.info('preventDefault: Escape Key');
        }
        else if (e.code === "Enter" && e.ctrlKey) {
            this.handleAddComment();
            e.preventDefault();
            console.info('preventDefault: ctrl+Enter');
        }
    }
    createInlineEditorElement() {
        var root = document.createElement('span');
        root.className = "reviewCommentEditor";
        const textarea = document.createElement('textarea');
        textarea.setAttribute(CONTROL_ATTR_NAME, '');
        textarea.className = "reviewCommentEditor text";
        textarea.innerText = '';
        textarea.style.resize = "none";
        textarea.name = 'text';
        textarea.onkeydown = this.handleTextAreaKeyDown.bind(this);
        const confirm = document.createElement('button');
        confirm.setAttribute(CONTROL_ATTR_NAME, '');
        confirm.className = "reviewCommentEditor save";
        confirm.style.fontFamily = "Consolas";
        confirm.innerText = 'Add Comment';
        confirm.onclick = this.handleAddComment.bind(this);
        const cancel = document.createElement('button');
        cancel.setAttribute(CONTROL_ATTR_NAME, '');
        cancel.className = "reviewCommentEditor cancel";
        cancel.innerText = 'Cancel';
        cancel.onclick = this.handleCancel.bind(this);
        root.appendChild(textarea);
        root.appendChild(cancel);
        root.appendChild(confirm);
        return { root, confirm, cancel, textarea };
    }
    createInlineToolbarWidget() {
        const buttonsElement = this.createInlineEditButtonsElement();
        const this_ = this;
        this.widgetInlineToolbar = {
            allowEditorOverflow: true,
            getId: () => {
                return 'widgetInlineToolbar';
            },
            getDomNode: () => {
                return buttonsElement.root;
            },
            getPosition: () => {
                if (this_.activeComment && this_.editorMode == EditorMode.toolbar && !this_.config.readOnly) {
                    return {
                        position: {
                            lineNumber: this_.activeComment.lineNumber,
                            column: 1
                        },
                        preference: [POSITION_BELOW]
                    };
                }
            }
        };
        this.editor.addContentWidget(this.widgetInlineToolbar);
        return buttonsElement;
    }
    createInlineEditorWidget() {
        // doesn't re-theme when
        const editorElement = this.createInlineEditorElement();
        this.widgetInlineCommentEditor = {
            allowEditorOverflow: true,
            getId: () => {
                return 'widgetInlineEditor';
            },
            getDomNode: () => {
                return editorElement.root;
            },
            getPosition: () => {
                if (this.editorMode == EditorMode.insertComment || this.editorMode == EditorMode.editComment) {
                    return {
                        position: {
                            lineNumber: this.activeComment ? this.activeComment.lineNumber : this.editor.getPosition().lineNumber + 1,
                            column: 1
                        },
                        preference: [POSITION_BELOW]
                    };
                }
            }
        };
        this.editor.addContentWidget(this.widgetInlineCommentEditor);
        return editorElement;
    }
    setActiveComment(comment) {
        this.verbose && console.debug('setActiveComment', comment);
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
                this.renderStore[comment.id].renderStatus = events_comments_reducers_1.ReviewCommentRenderState.dirty;
            });
        }
    }
    filterAndMapComments(lineNumbers, fn) {
        for (const cs of Object.values(this.store.comments)) {
            if (lineNumbers.indexOf(cs.comment.lineNumber) > -1) {
                fn(cs.comment);
            }
        }
    }
    handleMouseMove(ev) {
        if (ev.target && ev.target.position && ev.target.position.lineNumber) {
            this.currentLineDecorationLineNumber = ev.target.position.lineNumber;
            this.renderAddCommentLineDecoration(this.config.readOnly ? null : this.currentLineDecorationLineNumber);
        }
    }
    renderAddCommentLineDecoration(lineNumber) {
        const lines = lineNumber ? [
            {
                range: new monacoWindow.monaco.Range(lineNumber, 0, lineNumber, 0),
                options: {
                    marginClassName: 'activeLineMarginClass',
                    zIndex: 100
                }
            }
        ] : [];
        this.currentLineDecorations = this.editor.deltaDecorations(this.currentLineDecorations, lines);
    }
    handleMouseDown(ev) {
        // Not ideal - but couldn't figure out a different way to identify the glyph event        
        if (ev.target.element.className && ev.target.element.className.indexOf('activeLineMarginClass') > -1) {
            this.editor.setPosition({
                lineNumber: this.currentLineDecorationLineNumber,
                column: 1
            });
            this.setEditorMode(EditorMode.insertComment);
        }
        else if (!ev.target.element.hasAttribute(CONTROL_ATTR_NAME)) {
            let activeComment = null;
            if (ev.target.detail && ev.target.detail.viewZoneId !== null) {
                for (const comment of Object.values(this.store.comments).map(c => c.comment)) {
                    const x = this.getRenderState(comment.id);
                    if (x.viewZoneId == ev.target.detail.viewZoneId) {
                        activeComment = comment;
                        break;
                    }
                }
            }
            this.setActiveComment(activeComment);
            this.refreshComments();
            this.setEditorMode(EditorMode.toolbar);
        }
    }
    calculateMarginTopOffset(includeActiveCommentHeight) {
        let count = 0;
        let marginTop = 0;
        const lineHeight = this.editorConfig.lineHeight;
        if (this.activeComment) {
            for (var item of this.iterateComments()) {
                if (item.state.comment.lineNumber === this.activeComment.lineNumber &&
                    (item.state.comment != this.activeComment || includeActiveCommentHeight)) {
                    count += this.calculateNumberOfLines(item.state.comment.text);
                }
                if (item.state.comment == this.activeComment) {
                    break;
                }
            }
            marginTop = count * lineHeight;
        }
        const result = marginTop + this.config.verticalOffset;
        return result;
    }
    layoutInlineToolbar() {
        this.inlineToolbarElements.root.style.backgroundColor = this.getThemedColor("editor.background");
        this.inlineToolbarElements.root.style.marginTop = `${this.calculateMarginTopOffset(false)}px`;
        if (this.inlineToolbarElements.remove) {
            const hasChildren = this.activeComment && this.iterateComments((c) => c.comment.id === this.activeComment.id).length > 1;
            const isSameUser = this.activeComment && this.activeComment.author === this.currentUser;
            this.inlineToolbarElements.remove.style.display = hasChildren ? 'none' : '';
            this.inlineToolbarElements.edit.style.display = hasChildren || !isSameUser ? 'none' : '';
        }
        this.editor.layoutContentWidget(this.widgetInlineToolbar);
    }
    layoutInlineCommentEditor() {
        [this.editorElements.root, this.editorElements.textarea].forEach(e => {
            e.style.backgroundColor = this.getThemedColor("editor.background");
            e.style.color = this.getThemedColor("editor.foreground");
        });
        [this.editorElements.confirm, this.editorElements.cancel]
            .forEach((button) => {
            button.style.backgroundColor = this.getThemedColor("button.background");
            button.style.color = this.getThemedColor("button.foreground");
        });
        this.editorElements.confirm.innerText = this.editorMode === EditorMode.insertComment ? "Add Comment" : "Edit Comment";
        this.editorElements.root.style.marginTop = `${this.calculateMarginTopOffset(true)}px`;
        this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
    }
    setEditorMode(mode) {
        this.editorMode = this.config.readOnly ? EditorMode.toolbar : mode;
        console.warn('setEditorMode', EditorMode[mode], 'Comment:', this.activeComment, 'ReadOnly:', this.config.readOnly, 'Result:', EditorMode[this.editorMode]);
        this.layoutInlineCommentEditor();
        this.layoutInlineToolbar();
        if (mode == EditorMode.insertComment || mode == EditorMode.editComment) {
            if (mode == EditorMode.insertComment) {
                this.editorElements.textarea.value = "";
            }
            else if (mode == EditorMode.editComment) {
                this.editorElements.textarea.value = this.activeComment ? this.activeComment.text : '';
            }
            //HACK - because the event in monaco doesn't have preventdefault which means editor takes focus back...                        
            setTimeout(() => this.editorElements.textarea.focus(), 100); //TODO - make configurable
        }
    }
    getDateTimeNow() {
        return new Date();
    }
    recurseComments(allComments, filterFn, depth, results) {
        const comments = Object.values(allComments).filter(filterFn);
        for (const cs of comments) {
            const comment = cs.comment;
            delete allComments[comment.id];
            results.push({
                depth,
                state: cs
            });
            this.recurseComments(allComments, (x) => x.comment.parentId === comment.id, depth + 1, results);
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
        const event = this.editorMode === EditorMode.editComment ?
            { type: "edit", text, targetId: this.activeComment.id }
            : { type: "create", text, lineNumber, selection, targetId: this.activeComment && this.activeComment.id };
        return this.addEvent(event);
    }
    addEvent(event) {
        event.createdBy = this.currentUser;
        event.createdAt = this.getDateTimeNow();
        event.id = uuid();
        this.events.push(event);
        this.store = events_comments_reducers_1.commentReducer(event, this.store);
        if (this.activeComment && !this.store.comments[this.activeComment.id]) {
            this.setActiveComment(null);
        }
        else if (this.activeComment && this.activeComment.status === events_comments_reducers_1.ReviewCommentStatus.deleted) {
            this.setActiveComment(null);
        }
        this.refreshComments();
        this.layoutInlineToolbar();
        if (this.onChange) {
            this.onChange(this.events);
        }
        return event;
    }
    formatDate(dt) {
        if (this.config.formatDate) {
            return this.config.formatDate(dt);
        }
        else if (dt instanceof Date) {
            return dt.toISOString();
        }
        else {
            return dt;
        }
    }
    createElement(text, className, tagName = null) {
        const span = document.createElement(tagName || 'span');
        span.className = className;
        span.innerText = text;
        return span;
    }
    getRenderState(commentId) {
        if (!this.renderStore[commentId]) {
            this.renderStore[commentId] = { viewZoneId: null, renderStatus: null };
        }
        return this.renderStore[commentId];
    }
    refreshComments() {
        this.editor.changeViewZones((changeAccessor) => {
            var _a;
            const lineNumbers = {};
            for (const cid of Array.from(this.store.deletedCommentIds || [])) {
                const viewZoneId = (_a = this.renderStore[cid]) === null || _a === void 0 ? void 0 : _a.viewZoneId;
                changeAccessor.removeZone(viewZoneId);
                this.verbose && console.debug('Zone.Delete', viewZoneId);
            }
            this.store.deletedCommentIds = null;
            for (const cid of Array.from(this.store.dirtyCommentIds || [])) {
                this.getRenderState(cid).renderStatus = events_comments_reducers_1.ReviewCommentRenderState.dirty;
            }
            this.store.dirtyCommentIds = null;
            for (const item of this.iterateComments()) {
                const x = this.getRenderState(item.state.comment.id);
                if (x.renderStatus === events_comments_reducers_1.ReviewCommentRenderState.hidden) {
                    this.verbose && console.debug('Zone.Hidden', item.state.comment.id);
                    changeAccessor.removeZone(x.viewZoneId);
                    x.viewZoneId = null;
                    continue;
                }
                if (x.renderStatus === events_comments_reducers_1.ReviewCommentRenderState.dirty) {
                    this.verbose && console.debug('Zone.Dirty', item.state.comment.id);
                    changeAccessor.removeZone(x.viewZoneId);
                    x.viewZoneId = null;
                    x.renderStatus = events_comments_reducers_1.ReviewCommentRenderState.normal;
                }
                if (!lineNumbers[item.state.comment.lineNumber]) {
                    lineNumbers[item.state.comment.lineNumber] = item.state.comment.selection;
                }
                if (x.viewZoneId == null) {
                    this.verbose && console.debug('Zone.Create', item.state.comment.id);
                    const isActive = this.activeComment == item.state.comment;
                    const domNode = this.createElement("", `reviewComment ${isActive ? 'active' : ' inactive'}`);
                    domNode.style.marginLeft = (this.config.commentIndent * (item.depth + 1)) + this.config.commentIndentOffset + "px";
                    domNode.style.backgroundColor = this.getThemedColor("editor.selectionHighlightBackground");
                    // For Debug - domNode.appendChild(this.createElement(`${item.state.comment.id}`, 'reviewComment id'))
                    domNode.appendChild(this.createElement(`${item.state.comment.author || ' '} at `, 'reviewComment author'));
                    domNode.appendChild(this.createElement(this.formatDate(item.state.comment.dt), 'reviewComment dt'));
                    if (item.state.history.length > 1) {
                        domNode.appendChild(this.createElement(`(Edited ${item.state.history.length - 1} times)`, 'reviewComment history'));
                    }
                    domNode.appendChild(this.createElement(`${item.state.comment.text}`, 'reviewComment text', 'div'));
                    x.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: item.state.comment.lineNumber,
                        heightInLines: this.calculateNumberOfLines(item.state.comment.text),
                        domNode: domNode,
                        suppressMouseDown: true // This stops focus being lost the editor - meaning keyboard shortcuts keeps working
                    });
                }
            }
            if (this.config.showInRuler) {
                const decorators = [];
                for (const [ln, selection] of Object.entries(lineNumbers)) {
                    decorators.push({
                        range: new monacoWindow.monaco.Range(ln, 0, ln, 0),
                        options: {
                            isWholeLine: true,
                            overviewRuler: {
                                color: this.config.rulerMarkerColor,
                                darkColor: this.config.rulerMarkerDarkColor,
                                position: 1
                            }
                        }
                    });
                    if (selection) {
                        decorators.push({
                            range: new monacoWindow.monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
                            options: {
                                className: 'reviewComment selection',
                            }
                        });
                    }
                }
                this.currentCommentDecorations = this.editor.deltaDecorations(this.currentCommentDecorations, decorators);
            }
        });
    }
    calculateNumberOfLines(text) {
        return text ? text.split(/\r*\n/).length + 1 : 1;
    }
    addActions() {
        this.editor.addAction({
            id: 'my-unique-id-add',
            label: 'Add Comment',
            keybindings: [
                monacoWindow.monaco.KeyMod.CtrlCmd | monacoWindow.monaco.KeyCode.F10,
            ],
            precondition: 'add-context-key',
            keybindingContext: null,
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 0,
            run: () => {
                this.setEditorMode(EditorMode.insertComment);
            }
        });
        this.editor.addAction({
            id: 'my-unique-id-next',
            label: 'Next Comment',
            keybindings: [
                monacoWindow.monaco.KeyMod.CtrlCmd | monacoWindow.monaco.KeyCode.F12,
            ],
            precondition: null,
            keybindingContext: null,
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 0.101,
            run: () => {
                this.navigateToComment(NavigationDirection.next);
            }
        });
        this.editor.addAction({
            id: 'my-unique-id-prev',
            label: 'Prev Comment',
            keybindings: [
                monacoWindow.monaco.KeyMod.CtrlCmd | monacoWindow.monaco.KeyCode.F11,
            ],
            precondition: null,
            keybindingContext: null,
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 0.102,
            run: () => {
                this.navigateToComment(NavigationDirection.prev);
            }
        });
    }
    navigateToComment(direction) {
        let currentLine = 0;
        if (this.activeComment) {
            currentLine = this.activeComment.lineNumber;
        }
        else {
            currentLine = this.editor.getPosition().lineNumber;
        }
        const comments = Object.values(this.store.comments).map(cs => cs.comment).filter((c) => {
            if (!c.parentId) {
                if (direction === NavigationDirection.next) {
                    return c.lineNumber > currentLine;
                }
                else if (direction === NavigationDirection.prev) {
                    return c.lineNumber < currentLine;
                }
            }
        });
        if (comments.length) {
            comments.sort((a, b) => {
                if (direction === NavigationDirection.next) {
                    return a.lineNumber - b.lineNumber;
                }
                else if (direction === NavigationDirection.prev) {
                    return b.lineNumber - a.lineNumber;
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