import * as uuid from "uuid/v4";
import * as monacoEditor from "monaco-editor";



interface MonacoWindow {
    monaco: any;
}

const monacoWindow = (window as any) as MonacoWindow;

export interface ReviewComment {
    id?: string;
    parentId?: string;
    author: string;
    dt: Date | string;
    lineNumber: number;
    text: string;
    selection?: CodeSelection;
    status?: ReviewCommentStatus;
}

export enum ReviewCommentStatus {
    active = 1,
    deleted = 2,
    edit = 3,
}

enum NavigationDirection {
    next = 1,
    prev = 2
}

enum EditorMode {
    editComment = 1,
    toolbar = 2
}

enum ReviewCommentRenderState {
    dirty = 1,
    hidden = 2,
    normal = 3
}

interface CodeSelection {
    startColumn: number,
    endColumn: number,
    startLineNumber: number,
    endLineNumber: number
}

class ReviewCommentState {
    viewZoneId: string;
    renderStatus: ReviewCommentRenderState;
    numberOfLines: number;
    comment: ReviewComment;
    history: ReviewComment[];

    constructor(comment: ReviewComment, numberOfLines: number) {
        this.renderStatus = ReviewCommentRenderState.normal;
        this.viewZoneId = null;
        this.comment = comment;
        this.numberOfLines = numberOfLines;
        this.history = []
    }
}

export function createReviewManager(editor: any, currentUser: string, comments?: ReviewComment[], onChange?: OnCommentsChanged, config?: ReviewManagerConfig): ReviewManager {
    //For Debug: (window as any).editor = editor;
    const rm = new ReviewManager(editor, currentUser, onChange, config);
    rm.load(comments || []);
    return rm;
}


interface ReviewCommentIterItem {
    depth: number;
    state: ReviewCommentState
}

interface OnCommentsChanged {
    (comments: ReviewComment[]): void
}

export interface ReviewManagerConfig {
    editButtonEnableRemove?: boolean;
    commentIndent?: number;
    commentIndentOffset?: number;
    editButtonAddText?: string;
    editButtonRemoveText?: string;
    editButtonOffset?: string;
    reviewCommentIconSelect?: string;
    reviewCommentIconActive?: string;
    showInRuler?: boolean
    verticalOffset?: number;
    formatDate?: { (dt: Date): string }
}

interface ReviewManagerConfigPrivate {
    rulerMarkerColor: any;
    rulerMarkerDarkColor: any;
    editButtonEnableRemove: boolean;
    commentIndent: number;
    commentIndentOffset: number;
    editButtonAddText: string;
    editButtonRemoveText: string;
    editButtonOffset: string;
    verticalOffset: number;
    showInRuler: boolean;
    formatDate?: { (dt: Date | string): string };
    showAddCommentGlyph: boolean
}


const defaultReviewManagerConfig: ReviewManagerConfigPrivate = {
    verticalOffset: 0,
    editButtonOffset: '-10px',
    editButtonAddText: 'Reply',
    editButtonRemoveText: 'Remove',
    editButtonEnableRemove: true,
    commentIndent: 20,
    commentIndentOffset: 20,
    showInRuler: true,
    rulerMarkerColor: 'darkorange',
    rulerMarkerDarkColor: 'darkorange',
    formatDate: null,
    showAddCommentGlyph: true,
};

const CONTROL_ATTR_NAME = 'ReviewManagerControl';
const POSITION_BELOW = 2; //above=1, below=2, exact=0



export class ReviewManager {
    currentUser: string;
    editor: monacoEditor.editor.IStandaloneCodeEditor;
    editorConfig: monacoEditor.editor.InternalEditorOptions;
    commentState: { [reviewCommentId: string]: ReviewCommentState };

    activeComment?: ReviewComment;
    widgetInlineToolbar: monacoEditor.editor.IContentWidget;
    widgetInlineCommentEditor: monacoEditor.editor.IContentWidget;
    onChange: OnCommentsChanged;
    editorMode: EditorMode;
    config: ReviewManagerConfigPrivate;

    textarea: HTMLTextAreaElement;
    currentLineDecorations: string[];
    currentCommentDecorations: string[];
    currentLineDecorationLineNumber?: number;


    constructor(editor: any, currentUser: string, onChange: OnCommentsChanged, config?: ReviewManagerConfig) {
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = null;
        this.commentState = {};
        this.widgetInlineToolbar = null;
        this.widgetInlineCommentEditor = null;
        this.onChange = onChange;
        this.editorMode = EditorMode.toolbar;
        this.config = { ...defaultReviewManagerConfig, ...(config || {}) };
        this.currentLineDecorations = [];
        this.currentCommentDecorations = []
        this.currentLineDecorationLineNumber = null;

        this.editorConfig = this.editor.getConfiguration();
        this.editor.onDidChangeConfiguration(() => this.editorConfig = this.editor.getConfiguration());
        this.editor.onMouseDown(this.handleMouseDown.bind(this));
        
        this.createInlineToolbarWidget();
        this.createInlineEditorWidget();
        this.addActions();



        if (this.config.showAddCommentGlyph) {
            this.editor.onMouseMove(this.handleMouseMove.bind(this));
        }
    }

    load(comments: ReviewComment[]): void {
        this.editor.changeViewZones((changeAccessor) => {
            // Remove all the existing comments     
            for (const viewState of Object.values(this.commentState)) {
                if (viewState.viewZoneId !== null) {
                    changeAccessor.removeZone(viewState.viewZoneId);
                }
            }

            this.commentState = {};

            // Check all comments that they have unique and present id's
            for (const comment of comments) {
                const originalId = comment.id;
                let changedId = false;

                while (!comment.id || this.commentState[comment.id]) {
                    comment.id = uuid();
                    changedId = true;
                }

                if (changedId) {
                    console.warn('Comment.Id Assigned: ', originalId, ' changed to to ', comment.id, ' due to collision');
                }

                this.commentState[comment.id] = new ReviewCommentState(comment, this.calculateNumberOfLines(comment.text));
            }

            this.refreshComments();

            console.debug('Comments Loaded: ', this.commentState.length);
        })
    }

    calculateNumberOfLines(text: string): number {
        return text.split(/\r*\n/).length;
    }

    getThemedColor(name: string): string {
        // editor.background: e {rgba: e}
        // editor.foreground: e {rgba: e}
        // editor.inactiveSelectionBackground: e {rgba: e}
        // editor.selectionHighlightBackground: e {rgba: e}
        // editorIndentGuide.activeBackground: e {rgba: e}
        // editorIndentGuide.background: e {rgba: e}
        const theme = (this.editor as any)._themeService.getTheme();
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
        }
        if (!value) {
            value = missingThemes[theme.themeName.indexOf('dark') > -1 ? 'dark' : 'light'][name];
        }
        return value;
    }

    createInlineEditButtonsElement() {
        var root = document.createElement('div') as HTMLDivElement;
        root.className = 'editButtonsContainer'
        root.style.marginLeft = this.config.editButtonOffset;

        const add = document.createElement('span') as HTMLSpanElement;
        add.innerText = this.config.editButtonAddText;
        add.className = 'editButton add'
        add.setAttribute(CONTROL_ATTR_NAME, '');
        add.onclick = () => this.setEditorMode(EditorMode.editComment);
        root.appendChild(add);

        if (this.config.editButtonEnableRemove) {
            const spacer = document.createElement('div') as HTMLDivElement;
            spacer.innerText = ' '
            root.appendChild(spacer);

            const remove = document.createElement('span') as HTMLSpanElement;
            remove.setAttribute(CONTROL_ATTR_NAME, '');
            remove.innerText = this.config.editButtonRemoveText;
            remove.className = 'editButton remove'
            remove.onclick = () => this.removeComment(this.activeComment);
            root.appendChild(remove);
        }


        return root;
    }

    handleCancel() {
        this.setEditorMode(EditorMode.toolbar);
        this.editor.focus();
    }

    handleAddComment() {
        this.setEditorMode(EditorMode.toolbar);
        const lineNumber = this.activeComment ? this.activeComment.lineNumber : this.editor.getSelection().endLineNumber;
        const text = this.textarea.value;
        const selection = this.activeComment ? null : this.editor.getSelection() as CodeSelection;
        this.addComment(lineNumber, text, selection);
        this.editor.focus();
    }

    handleTextAreaKeyDown(e: KeyboardEvent) {
        if (e.code === "Escape") {
            this.handleCancel();
        } else if (e.code === "Enter" && e.ctrlKey) {
            this.handleAddComment();
        }
    }

    createInlineEditorElement() {
        var root = document.createElement('span') as HTMLSpanElement;
        root.className = "reviewCommentEditor"

        const textarea = document.createElement('textarea') as HTMLTextAreaElement;
        textarea.setAttribute(CONTROL_ATTR_NAME, '');
        textarea.className = "reviewCommentEditor text";
        textarea.innerText = '';
        textarea.name = 'text';
        textarea.onkeydown = this.handleTextAreaKeyDown.bind(this);

        const add = document.createElement('button') as HTMLButtonElement;
        add.setAttribute(CONTROL_ATTR_NAME, '');
        add.className = "reviewCommentEditor save";
        add.style.fontFamily = "Consolas";
        add.innerText = 'Add Comment';
        add.onclick = this.handleAddComment.bind(this);

        const cancel = document.createElement('button') as HTMLButtonElement;
        cancel.setAttribute(CONTROL_ATTR_NAME, '');
        cancel.className = "reviewCommentEditor cancel";
        cancel.innerText = 'Cancel';
        cancel.onclick = this.handleCancel.bind(this);

        root.appendChild(textarea);
        root.appendChild(add);
        root.appendChild(cancel);

        this.textarea = textarea;
        return root
    }

    createInlineToolbarWidget() {
        const buttonsElement = this.createInlineEditButtonsElement();

        this.widgetInlineToolbar = {
            allowEditorOverflow: true,
            getId: () => {
                return 'widgetInlineToolbar';
            },
            getDomNode: () => {
                return buttonsElement;
            },
            getPosition: () => {
                if (this.activeComment && this.editorMode == EditorMode.toolbar) {
                    return {
                        position: {
                            lineNumber: this.activeComment.lineNumber,
                            column: 1
                        },
                        preference: [POSITION_BELOW]
                    }
                }
            }
        };

        this.editor.addContentWidget(this.widgetInlineToolbar);
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
                return editorElement;
            },
            getPosition: () => {
                if (this.editorMode == EditorMode.editComment) {
                    return {
                        position: {
                            lineNumber: this.activeComment ? this.activeComment.lineNumber : this.editor.getPosition().lineNumber + 1,
                            column: 1
                        },
                        preference: [POSITION_BELOW]
                    }
                }
            }
        };

        this.editor.addContentWidget(this.widgetInlineCommentEditor);
    }

    setActiveComment(comment: ReviewComment) {
        console.debug('setActiveComment', comment);

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
                this.commentState[comment.id].renderStatus = ReviewCommentRenderState.dirty;
            });
        }
    }


    filterAndMapComments(lineNumbers: number[], fn: { (comment: ReviewComment): void }) {
        for (const cs of Object.values(this.commentState)) {
            if (lineNumbers.indexOf(cs.comment.lineNumber) > -1) {
                fn(cs.comment);
            }
        }
    }

    handleMouseMove(ev) {
        if (ev.target && ev.target.position && ev.target.position.lineNumber) {
            this.currentLineDecorationLineNumber = ev.target.position.lineNumber;
            this.currentLineDecorations = this.editor.deltaDecorations(this.currentLineDecorations, [
                {
                    range: new monacoWindow.monaco.Range(ev.target.position.lineNumber, 0, ev.target.position.lineNumber, 0),
                    options: {
                        marginClassName: 'activeLineMarginClass',
                        zIndex: 100
                    }
                }
            ]);
        }
    }

    handleMouseDown(ev: { target: { element: { className: string, hasAttribute: { (string): boolean } }, detail: any } }) {
        // Not ideal - but couldn't figure out a different way to identify the glyph event        
        if (ev.target.element.className && ev.target.element.className.indexOf('activeLineMarginClass') > -1) {
            this.editor.setPosition({
                lineNumber: this.currentLineDecorationLineNumber,
                column: 1
            });
            this.setEditorMode(EditorMode.editComment);
        } else if (!ev.target.element.hasAttribute(CONTROL_ATTR_NAME)) {
            let activeComment: ReviewComment = null;

            if (ev.target.detail && ev.target.detail.viewZoneId !== null) {
                for (const comment of Object.values(this.commentState).map(c => c.comment)) {
                    const viewState = this.commentState[comment.id];
                    if (viewState.viewZoneId == ev.target.detail.viewZoneId) {
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

    private calculateMarginTopOffset(): number {
        let idx = 0;
        let count = 0;
        let marginTop = 0;
        const lineHeight = this.editorConfig.fontInfo.lineHeight;

        if (this.activeComment) {
            for (var item of this.iterateComments()) {
                if (item.state.comment.lineNumber == this.activeComment.lineNumber) {
                    count++;
                }

                if (item.state.comment == this.activeComment) {
                    idx = count + 0;
                }
            }
            marginTop = idx * lineHeight;
        }

        return marginTop + this.config.verticalOffset;
    }

    layoutInlineToolbar() {
        const root = this.widgetInlineToolbar.getDomNode() as HTMLElement;
        root.style.backgroundColor = this.getThemedColor("editor.background");
        root.style.marginTop = `${this.calculateMarginTopOffset()}px`;

        this.editor.layoutContentWidget(this.widgetInlineToolbar);
    }

    layoutInlineCommentEditor() {
        const root = this.widgetInlineCommentEditor.getDomNode() as HTMLElement;

        Array.prototype.slice.call(root.getElementsByTagName('textarea')).concat([root]).forEach(e => {
            e.style.backgroundColor = this.getThemedColor("editor.background");
            e.style.color = this.getThemedColor("editor.foreground");
        })

        Array.prototype.slice.call(root.getElementsByTagName('button'))
            .forEach((button) => {
                button.style.backgroundColor = this.getThemedColor("button.background");
                button.style.color = this.getThemedColor("button.foreground");
            });

        root.style.marginTop = `${this.calculateMarginTopOffset()}px`;
        this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
    }

    setEditorMode(mode: EditorMode) {
        console.debug('setEditorMode', this.activeComment);

        this.editorMode = mode;

        this.layoutInlineCommentEditor();
        this.layoutInlineToolbar();

        if (mode == EditorMode.editComment) {
            this.textarea.value = "";
            //HACK - because the event in monaco doesn't have preventdefault which means editor takes focus back...                        
            setTimeout(() => this.textarea.focus(), 100);
        }
    }

    addComment(lineNumber: number, text: string, selection?: CodeSelection): ReviewComment {
        const ln = this.activeComment ? this.activeComment.lineNumber : lineNumber;
        const comment: ReviewComment = {
            id: uuid(),
            lineNumber: ln,
            author: this.currentUser,
            dt: new Date(),
            text: text,
            status: ReviewCommentStatus.active,
            selection: selection,
            parentId: this.activeComment ? this.activeComment.id : null
        };

        this.commentState[comment.id] = new ReviewCommentState(comment, this.calculateNumberOfLines(text));

        // Make all comments for this line as dirty.
        this.filterAndMapComments([ln], (comment) => {
            this.commentState[comment.id].renderStatus = ReviewCommentRenderState.dirty;
        });

        this.refreshComments()
        this.layoutInlineToolbar();
        if (this.onChange) {
            this.onChange(Object.values(this.commentState).map(cs => cs.comment));
        }

        return comment;
    }

    private compareComments(a: ReviewCommentState, b: ReviewCommentState) {
        return a.comment.dt > b.comment.dt ? 1 : -1;
    }

    private recurseComments(allComments: { [key: string]: ReviewCommentState }, filterFn: { (c: ReviewCommentState): boolean }, depth: number, results: ReviewCommentIterItem[]) {
        const comments = Object.values(allComments).filter(filterFn).sort(this.compareComments);
        for (const cs of comments) {
            const comment = cs.comment;
            delete allComments[comment.id];

            results.push({
                depth,
                state: cs
            });
            this.recurseComments(allComments,
                (x) => x.comment.parentId === comment.id,
                depth + 1,
                results);
        }
    }

    private processEdits(allComments: { [key: string]: ReviewCommentState }) {
        const edits = Object.values(allComments).filter(c => c.comment.status === ReviewCommentStatus.edit).sort(this.compareComments);
        for (const e of edits) {
            if (allComments[e.comment.parentId]) {


                allComments[e.comment.parentId].history.push(allComments[e.comment.parentId].comment);
                allComments[e.comment.parentId] = e;

            }
        }
    }

    private iterateComments(filterFn?: { (c: ReviewCommentState): boolean }) {
        if (!filterFn) {
            filterFn = (cs: ReviewCommentState) => !cs.comment.parentId;
        }
        const copyCommentState = { ...this.commentState };
        const results: ReviewCommentIterItem[] = [];
        this.recurseComments(copyCommentState, filterFn, 0, results);
        return results;
    }

    removeComment(comment: ReviewComment) {
        for (const item of this.iterateComments((cs) => cs.comment.id === comment.id)) {
            item.state.comment.status = ReviewCommentStatus.deleted;
        }
        if (this.activeComment == comment) {
            this.setActiveComment(null);
            this.layoutInlineToolbar();
        }

        this.refreshComments();
        if (this.onChange) {
            this.onChange(Object.values(this.commentState).map(cs => cs.comment));
        }
    }

    private formatDate(dt: Date | string) {
        if (this.config.formatDate) {
            return this.config.formatDate(dt)
        } else if (dt instanceof Date) {
            return dt.toISOString();
        } else {
            return dt;
        }
    }

    refreshComments() {
        this.editor.changeViewZones((changeAccessor: {
            addZone: { (zone: { afterLineNumber: number, heightInLines: number, domNode: HTMLElement, suppressMouseDown: boolean }): string },
            removeZone: { (id: string): void }
        }) => {
            const lineNumbers: { [key: number]: CodeSelection } = {};

            for (const item of this.iterateComments()) {
                if (item.state.comment.status && item.state.comment.status === ReviewCommentStatus.deleted) {
                    console.debug('Zone.Delete', item.state.comment.id);

                    changeAccessor.removeZone(item.state.viewZoneId);
                    continue;
                }

                if (item.state.renderStatus === ReviewCommentRenderState.hidden) {
                    console.debug('Zone.Hidden', item.state.comment.id);

                    changeAccessor.removeZone(item.state.viewZoneId);
                    item.state.viewZoneId = null;

                    continue;
                }

                if (item.state.renderStatus === ReviewCommentRenderState.dirty) {
                    console.debug('Zone.Dirty', item.state.comment.id);

                    changeAccessor.removeZone(item.state.viewZoneId);
                    item.state.viewZoneId = null;
                    item.state.renderStatus = ReviewCommentRenderState.normal;
                }

                if (!lineNumbers[item.state.comment.lineNumber]) {
                    lineNumbers[item.state.comment.lineNumber] = item.state.comment.selection;
                }

                if (item.state.viewZoneId == null) {
                    console.debug('Zone.Create', item.state.comment.id);

                    const isActive = this.activeComment == item.state.comment;

                    const domNode = document.createElement('span') as HTMLSpanElement;
                    domNode.style.marginLeft = (this.config.commentIndent * (item.depth + 1)) + this.config.commentIndentOffset + "px";
                    domNode.style.backgroundColor = this.getThemedColor("editor.selectionHighlightBackground");
                    domNode.className = `reviewComment ${isActive ? 'active' : ' inactive'}`;

                    const author = document.createElement('span') as HTMLSpanElement;
                    author.className = 'reviewComment author'
                    author.innerText = `${item.state.comment.author || ' '} at `;

                    const dt = document.createElement('span') as HTMLSpanElement;
                    dt.className = 'reviewComment dt'
                    dt.innerText = this.formatDate(item.state.comment.dt);

                    const text = document.createElement('span') as HTMLSpanElement;
                    text.className = 'reviewComment text'
                    text.innerText = `${item.state.comment.text} by `;

                    domNode.appendChild(text);
                    domNode.appendChild(author);
                    domNode.appendChild(dt);

                    item.state.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: item.state.comment.lineNumber,
                        heightInLines: item.state.numberOfLines,
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
                    })

                    if (selection) {
                        decorators.push({
                            range: new monacoWindow.monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
                            options: {
                                className: 'reviewComment selection',
                            }
                        })
                    }
                }

                this.currentCommentDecorations = this.editor.deltaDecorations(this.currentCommentDecorations, decorators);
            }
        });
    }

    addActions() {
        this.editor.addAction({
            id: 'my-unique-id-add',
            label: 'Add Comment',
            keybindings: [
                monacoWindow.monaco.KeyMod.CtrlCmd | monacoWindow.monaco.KeyCode.F10,
            ],
            precondition: null,
            keybindingContext: null,
            contextMenuGroupId: 'navigation',
            contextMenuOrder: 0,

            run: () => {
                this.setEditorMode(EditorMode.editComment);
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
            contextMenuOrder: 0.1,

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
            contextMenuOrder: 0.1,

            run: () => {
                this.navigateToComment(NavigationDirection.prev);
            }
        });
    }

    navigateToComment(direction: NavigationDirection) {
        let currentLine = 0;
        if (this.activeComment) {
            currentLine = this.activeComment.lineNumber;
        } else {
            currentLine = this.editor.getPosition().lineNumber;
        }

        const comments = Object.values(this.commentState).map(cs => cs.comment).filter((c) => {
            if (c.status !== ReviewCommentStatus.deleted && !c.parentId) {
                if (direction === NavigationDirection.next) {
                    return c.lineNumber > currentLine;
                } else if (direction === NavigationDirection.prev) {
                    return c.lineNumber < currentLine;
                }
            }
        });

        if (comments.length) {
            comments.sort((a, b) => {
                if (direction === NavigationDirection.next) {
                    return a.lineNumber - b.lineNumber;
                } else if (direction === NavigationDirection.prev) {
                    return b.lineNumber - a.lineNumber;
                }
            });

            const comment = comments[0];
            this.setActiveComment(comment)
            this.refreshComments();
            this.layoutInlineToolbar();
            this.editor.revealLineInCenter(comment.lineNumber);
        }
    }
}


