import * as uuid from "uuid/v4";

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
    deleted = 2
}

interface CodeSelection {
    startColumn: number,
    endColumn: number,
    startLineNumber: number,
    endLineNumber: number
}

class ReviewCommentState {
    viewZoneId: number;
    renderStatus: ReviewCommentRenderState;
    numberOfLines: number;

    constructor(numberOfLines: number) {
        this.renderStatus = ReviewCommentRenderState.normal;
        this.viewZoneId = null;
        this.numberOfLines = numberOfLines;
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
    comment: ReviewComment,
    viewState: ReviewCommentState
}

interface OnCommentsChanged {
    (comments: ReviewComment[]): void
}

export interface ReviewManagerConfig {
    editButtonEnableRemove?: boolean;
    lineHeight?: number;
    commentIndent?: number;
    commentIndentOffset?: number;
    editButtonAddText?: string;
    editButtonRemoveText?: string;
    editButtonOffset?: string;
    reviewCommentIconSelect?: string;
    reviewCommentIconActive?: string;
    showInRuler?: boolean
}

interface ReviewManagerConfigPrivate {
    rulerMarkerColor: any;
    rulerMarkerDarkColor: any;
    editButtonEnableRemove: boolean;
    lineHeight: number;
    commentIndent: number;
    commentIndentOffset: number;
    editButtonAddText: string;
    editButtonRemoveText: string;
    editButtonOffset: string;
    showInRuler: boolean;
}


const defaultReviewManagerConfig: ReviewManagerConfigPrivate = {
    editButtonOffset: '-10px',
    editButtonAddText: 'Reply',
    editButtonRemoveText: 'Remove',
    editButtonEnableRemove: true,
    lineHeight: 19,
    commentIndent: 20,
    commentIndentOffset: 20,
    showInRuler: true,
    rulerMarkerColor: 'darkorange',
    rulerMarkerDarkColor: 'darkorange'
};

const CONTROL_ATTR_NAME = 'ReviewManagerControl';

class ReviewManager {
    currentUser: string;
    editor: any;
    comments: ReviewComment[];
    commentState: { [reviewCommentId: string]: ReviewCommentState };

    activeComment?: ReviewComment;
    widgetInlineToolbar: any;
    widgetInlineCommentEditor: any;
    onChange: OnCommentsChanged;
    editorMode: EditorMode;
    config: ReviewManagerConfigPrivate;

    textarea: HTMLTextAreaElement;


    constructor(editor: any, currentUser: string, onChange: OnCommentsChanged, config?: ReviewManagerConfig) {
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = null;
        this.comments = [];
        this.commentState = {};
        this.widgetInlineToolbar = null;
        this.widgetInlineCommentEditor = null;
        this.onChange = onChange;
        this.editorMode = EditorMode.toolbar;
        this.config = { ...defaultReviewManagerConfig, ...(config || {}) };

        this.addActions();
        this.createInlineToolbarWidget();
        this.createInlineEditorWidget();

        this.editor.onMouseDown(this.handleMouseDown.bind(this));
    }

    load(comments: ReviewComment[]): void {
        this.editor.changeViewZones((changeAccessor) => {
            // Remove all the existing comments     
            for (const viewState of Object.values(this.commentState)) {
                if (viewState.viewZoneId) {
                    changeAccessor.removeZone(viewState.viewZoneId);
                }
            }

            this.comments = comments || [];
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

                this.commentState[comment.id] = new ReviewCommentState(this.calculateNumberOfLines(comment.text));
            }

            this.refreshComments();

            console.debug('Comments Loaded: ', this.comments.length);
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
        return this.editor._themeService.getTheme().getColor(name);
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

    handleSave() {
        const r = this.setEditorMode(EditorMode.toolbar);
        const selection = this.activeComment ? null : this.editor.getSelection() as CodeSelection;
        this.addComment(r.lineNumber, r.text, selection);
        this.editor.focus();
    }

    handleTextAreaKeyDown(e: KeyboardEvent) {
        if (e.code === "Escape") {
            this.handleCancel();
        } else if (e.code === "Enter" && e.ctrlKey) {
            this.handleSave();
        }
    }

    createInlineEditorElement() {
        var root = document.createElement('span') as HTMLSpanElement;
        root.className = "reviewCommentEdit"

        const textarea = document.createElement('textarea') as HTMLTextAreaElement;
        textarea.setAttribute(CONTROL_ATTR_NAME, '');
        textarea.className = "reviewCommentText";
        textarea.innerText = '';
        textarea.name = 'text';
        textarea.onkeydown = this.handleTextAreaKeyDown.bind(this);

        const save = document.createElement('button') as HTMLButtonElement;
        save.setAttribute(CONTROL_ATTR_NAME, '');
        save.className = "reviewCommentSave";
        save.innerText = 'Save';
        save.onclick = this.handleSave.bind(this);

        const cancel = document.createElement('button') as HTMLButtonElement;
        cancel.setAttribute(CONTROL_ATTR_NAME, '');
        cancel.className = "reviewCommentCancel";
        cancel.innerText = 'Cancel';
        cancel.onclick = this.handleCancel.bind(this);

        root.appendChild(textarea);
        root.appendChild(save);
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
                            lineNumber: this.activeComment.lineNumber + 1,
                        },
                        preference: [monacoWindow.monaco.editor.ContentWidgetPositionPreference.BELOW]
                    }
                }
            }
        };

        this.editor.addContentWidget(this.widgetInlineToolbar);
    }

    createInlineEditorWidget() {
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
                            // We are using negative marginTop to shift it above the line to the previous
                            lineNumber: this.activeComment ? this.activeComment.lineNumber + 1 : this.editor.getPosition().lineNumber
                        },
                        preference: [monacoWindow.monaco.editor.ContentWidgetPositionPreference.BELOW]
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

    layoutInlineToolbar() {
        const toolbarRoot = this.widgetInlineToolbar.getDomNode() as HTMLElement;

        if (this.activeComment) {
            toolbarRoot.style.marginTop = `-${this.calculateMarginTopOffset(2)}px`;
        }
        toolbarRoot.style.backgroundColor = this.getThemedColor("editor.background");
        this.editor.layoutContentWidget(this.widgetInlineToolbar);
    }

    filterAndMapComments(lineNumbers: number[], fn: { (comment: ReviewComment): void }) {
        for (const comment of this.comments) {
            if (lineNumbers.indexOf(comment.lineNumber) > -1) {
                fn(comment);
            }
        }
    }

    handleMouseDown(ev: { target: { element: { hasAttribute: { (string): boolean } }, detail: any } }) {
        if (ev.target.element.hasAttribute(CONTROL_ATTR_NAME)) {
            return;
        } else {
            let activeComment: ReviewComment = null;

            if (ev.target.detail && ev.target.detail.viewZoneId !== undefined) {
                for (const comment of this.comments) {
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

    private calculateMarginTopOffset(extraOffsetLines: number = 1): number {
        let idx = 0;
        let count = 0;
        let marginTop: number = 0;
        const lineHeight = this.config.lineHeight;//FIXME - Magic number for line height            

        if (this.activeComment) {
            for (var item of this.iterateComments()) {
                if (item.comment.lineNumber == this.activeComment.lineNumber) {
                    count++;
                }

                if (item.comment == this.activeComment) {
                    idx = count + 0;
                }
            }
            marginTop = ((extraOffsetLines + count - idx) * lineHeight);
        }

        return marginTop;
    }

    setEditorMode(mode: EditorMode): { lineNumber: number, text: string } {
        console.debug('setEditorMode', this.activeComment);

        const lineNumber = this.activeComment ? this.activeComment.lineNumber : this.editor.getSelection().endLineNumber;
        this.editorMode = mode;

        const editorRoot = this.widgetInlineCommentEditor.getDomNode() as HTMLElement;
        editorRoot.style.marginTop = `-${this.calculateMarginTopOffset()}px`;

        this.layoutInlineToolbar();
        this.editor.layoutContentWidget(this.widgetInlineCommentEditor);

        const text = this.textarea.value;
        this.textarea.value = "";

        if (mode == EditorMode.editComment) {
            //HACK - because the event in monaco doesn't have preventdefault which means editor takes focus back...            
            setTimeout(() => this.textarea.focus(), 100);
        }

        return {
            text: text,
            lineNumber: lineNumber //TODO - stop returning this as it is a mess
        };
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

        this.commentState[comment.id] = new ReviewCommentState(this.calculateNumberOfLines(text));
        this.comments.push(comment);

        this.filterAndMapComments([ln], (comment) => {
            this.commentState[comment.id].renderStatus = ReviewCommentRenderState.dirty;
        });

        this.refreshComments()
        this.layoutInlineToolbar();

        if (this.onChange) {
            this.onChange(this.comments);
        }

        return comment;
    }

    private recurseComments(allComments: { [key: string]: ReviewComment }, filterFn: { (c: ReviewComment): boolean }, depth: number, results: ReviewCommentIterItem[]) {
        const comments = Object.values(allComments).filter(filterFn); //TODO - sort by dt
        for (const comment of comments) {
            delete allComments[comment.id];

            results.push({
                depth,
                comment,
                viewState: this.commentState[comment.id]
            });
            this.recurseComments(allComments,
                (x) => x.parentId === comment.id,
                depth + 1,
                results);
        }
    }

    private iterateComments(filterFn?: { (c: ReviewComment): boolean }) {
        if (!filterFn) {
            filterFn = (c: ReviewComment) => !c.parentId;
        }
        const tmpComments: { [key: string]: ReviewComment } = (this.comments).reduce((obj, item) => {
            obj[item.id] = item
            return obj
        }, {});

        const results: ReviewCommentIterItem[] = [];
        this.recurseComments(tmpComments, filterFn, 0, results);
        return results;
    }

    removeComment(comment: ReviewComment) {
        for (const item of this.iterateComments((c) => c.id === comment.id)) {
            item.comment.status = ReviewCommentStatus.deleted;
        }
        if (this.activeComment == comment) {
            this.setActiveComment(null);
            this.layoutInlineToolbar();
        }

        this.refreshComments();
        if (this.onChange) {
            this.onChange(this.comments);
        }
    }

    refreshComments() {
        this.editor.changeViewZones((changeAccessor) => {
            const lineNumbers: { [key: number]: CodeSelection } = {};

            for (const item of this.iterateComments()) {
                if (item.comment.status && item.comment.status === ReviewCommentStatus.deleted) {
                    console.debug('Zone.Delete', item.comment.id);

                    changeAccessor.removeZone(item.viewState.viewZoneId);
                    continue;
                }

                if (item.viewState.renderStatus === ReviewCommentRenderState.hidden) {
                    console.debug('Zone.Hidden', item.comment.id);

                    changeAccessor.removeZone(item.viewState.viewZoneId);
                    item.viewState.viewZoneId = null;

                    continue;
                }

                if (item.viewState.renderStatus === ReviewCommentRenderState.dirty) {
                    console.debug('Zone.Dirty', item.comment.id);

                    changeAccessor.removeZone(item.viewState.viewZoneId);
                    item.viewState.viewZoneId = null;
                    item.viewState.renderStatus = ReviewCommentRenderState.normal;
                }



                if (!lineNumbers[item.comment.lineNumber]) {
                    lineNumbers[item.comment.lineNumber] = item.comment.selection;
                }

                if (!item.viewState.viewZoneId) {
                    console.debug('Zone.Create', item.comment.id);

                    const isActive = this.activeComment == item.comment;

                    const domNode = document.createElement('span') as HTMLSpanElement;
                    domNode.style.marginLeft = (this.config.commentIndent * (item.depth + 1)) + this.config.commentIndentOffset + "px";
                    domNode.style.backgroundColor = this.getThemedColor("editor.selectionHighlightBackground");
                    domNode.className = `reviewComment ${isActive ? 'active' : ' inactive'}`;

                    const author = document.createElement('span') as HTMLSpanElement;
                    author.className = 'reviewComment author'
                    author.innerText = `${item.comment.author || ' '} at `;

                    const dt = document.createElement('span') as HTMLSpanElement;
                    dt.className = 'reviewComment dt'
                    dt.innerText = item.comment.dt.toLocaleString();

                    const text = document.createElement('span') as HTMLSpanElement;
                    text.className = 'reviewComment text'
                    text.innerText = `${item.comment.text} by `;

                    domNode.appendChild(text);
                    domNode.appendChild(author);
                    domNode.appendChild(dt);

                    item.viewState.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: item.comment.lineNumber,
                        heightInLines: item.viewState.numberOfLines,
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

                //TODO - Preserver any other decorators
                this.editor.deltaDecorations([], decorators);
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

        const comments = this.comments.filter((c) => {
            if (direction === NavigationDirection.next) {
                return c.lineNumber > currentLine;
            } else if (direction === NavigationDirection.prev) {
                return c.lineNumber < currentLine;
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