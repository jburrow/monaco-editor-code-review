interface MonacoWindow {
    monaco: any;
}

const monacoWindow = (window as any) as MonacoWindow;

export class ReviewComment {
    id: string;
    author: string;
    dt: Date;
    lineNumber: number;
    text: string;
    comments: ReviewComment[];

    deleted: boolean;
    viewZoneId: number;
    renderStatus: ReviewCommentStatus;

    constructor(id: string, lineNumber: number, author: string, dt: Date, text: string, comments?: ReviewComment[]) {
        this.id = id;
        this.author = author;
        this.dt = dt;
        this.lineNumber = lineNumber;
        this.text = text;
        this.comments = comments || [];

        //HACK - this is runtime state - and should be moved
        this.deleted = false;
        this.renderStatus = ReviewCommentStatus.normal;
        this.viewZoneId = null;
    }
}

export function createReviewManager(editor: any, currentUser: string, comments?: ReviewComment[], onChange?: OnCommentsChanged, config?: ReviewManagerConfig) {
    //(window as any).editor = editor;    
    const rm = new ReviewManager(editor, currentUser, onChange, config);
    rm.load(comments || []);
    return rm;
}


interface ReviewCommentIterItem {
    depth: number;
    comment: ReviewComment,
    count: number
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
}

interface ReviewManagerConfigPrivate {
    editButtonEnableRemove: boolean;
    lineHeight: number;
    commentIndent: number;
    commentIndentOffset: number;
    editButtonAddText: string;
    editButtonRemoveText: string;
    editButtonOffset: string;
}


const defaultReviewManagerConfig: ReviewManagerConfigPrivate = {
    editButtonOffset: '-10px',
    editButtonAddText: 'Reply',
    editButtonRemoveText: 'Remove',
    editButtonEnableRemove: true,
    lineHeight: 19,
    commentIndent: 20,
    commentIndentOffset: 20,
};


class ReviewManager {
    currentUser: string;
    editor: any;
    comments: ReviewComment[];
    activeComment?: ReviewComment;
    widgetInlineToolbar: any;
    widgetInlineCommentEditor: any;
    onChange: OnCommentsChanged;
    editorMode: EditorMode;
    config: ReviewManagerConfigPrivate;

    constructor(editor: any, currentUser: string, onChange: OnCommentsChanged, config?: ReviewManagerConfig) {
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = null;
        this.comments = [];
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

    load(comments: ReviewComment[]) {
        this.editor.changeViewZones((changeAccessor) => {
            for (const item of this.iterateComments()) {
                if (item.comment.viewZoneId) {
                    changeAccessor.removeZone(item.comment.viewZoneId);
                }
            }

            // Should this be inside this callback?
            this.comments = comments;
            this.refreshComments();
        })
    }

    createInlineEditButtonsElement() {
        var root = document.createElement('div');
        root.className = 'editButtonsContainer'

        const add = document.createElement('a') as HTMLAnchorElement;
        add.href = '#'
        add.innerText = this.config.editButtonAddText;
        add.name = 'add';
        add.className = 'editButtonAdd'
        add.onclick = () => {
            this.setEditorMode(EditorMode.editor)
            return true;// Suppress navigation
        };
        root.appendChild(add);

        if (this.config.editButtonEnableRemove) {
            const spacer = document.createElement('div');
            spacer.innerText = ' '
            root.appendChild(spacer);

            const remove = document.createElement('a') as HTMLAnchorElement;
            remove.href = '#'
            remove.innerText = this.config.editButtonRemoveText;
            remove.name = 'remove';
            remove.className = 'editButtonRemove'
            remove.onclick = () => {
                this.removeComment(this.activeComment);
                return true; // Suppress navigation
            }
            root.appendChild(remove);
        }

        root.style.marginLeft = this.config.editButtonOffset;
        return root;
    }

    handleCancel() {
        this.setEditorMode(EditorMode.toolbar);
        this.editor.focus();
    }

    handleSave() {
        const r = this.setEditorMode(EditorMode.toolbar);
        this.addComment(r.lineNumber, r.text);
        this.editor.focus();
    }

    createInlineEditorElement() {
        var root = document.createElement('span');
        root.className = "reviewCommentEdit"

        const textarea = document.createElement('textarea');
        textarea.className = "reviewCommentText";
        textarea.innerText = '';
        textarea.name = 'text';
        textarea.onkeypress = (e: KeyboardEvent) => {
            if (e.code === "Enter" && e.ctrlKey) {
                this.handleSave();
            }
        };
        textarea.onkeydown = (e: KeyboardEvent) => {
            if (e.code === "Escape") {
                this.handleCancel();
            }
        }

        const save = document.createElement('button') as HTMLButtonElement;
        save.className = "reviewCommentSave";
        save.innerText = 'Save';
        save.name = 'save';
        save.onclick = () => {
            this.handleSave();
        };

        const cancel = document.createElement('button') as HTMLButtonElement;
        cancel.className = "reviewCommentCancel";
        cancel.innerText = 'Cancel';
        cancel.name = 'cancel';
        cancel.onclick = () => {
            this.handleCancel();
        }

        root.appendChild(textarea);
        root.appendChild(save);
        root.appendChild(cancel);

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
                if (this.editorMode == EditorMode.editor) {
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
            this.filterAndMapComments(lineNumbersToMakeDirty, (comment) => { comment.renderStatus = ReviewCommentStatus.dirty });
        }
    }

    layoutInlineToolbar() {
        if (this.activeComment) {
            const toolbarRoot = this.widgetInlineToolbar.getDomNode() as HTMLElement;
            toolbarRoot.style.marginTop = `-${this.calculateMarginTopOffset(2)}px`;
        }
        this.editor.layoutContentWidget(this.widgetInlineToolbar);
    }

    filterAndMapComments(lineNumbers: number[], fn: { (comment: ReviewComment): void }) {
        const comments = this.iterateComments();
        for (const c of comments) {
            if (lineNumbers.indexOf(c.comment.lineNumber) > -1) {
                fn(c.comment);
            }
        }
    }

    handleMouseDown(ev: any) {
        console.debug('handleMouseDown', this.activeComment, ev.target.element, ev.target.detail);

        if (ev.target.element.tagName === 'TEXTAREA' || ev.target.element.tagName === 'BUTTON' || ev.target.element.tagName === 'A') {
            return;
        } else {
            let activeComment: ReviewComment = null;

            if (ev.target.detail && ev.target.detail.viewZoneId !== undefined) {
                for (const item of this.iterateComments()) {
                    if (item.comment.viewZoneId == ev.target.detail.viewZoneId) {
                        activeComment = item.comment;
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

    private setEditorMode(mode: EditorMode): { lineNumber: number, text: string } {
        console.debug('setEditorMode', this.activeComment);

        const lineNumber = this.activeComment ? this.activeComment.lineNumber : this.editor.getPosition().lineNumber;
        this.editorMode = mode;

        const editorRoot = this.widgetInlineCommentEditor.getDomNode() as HTMLElement;
        editorRoot.style.marginTop = `-${this.calculateMarginTopOffset()}px`;

        this.layoutInlineToolbar();
        this.editor.layoutContentWidget(this.widgetInlineCommentEditor);

        const element = this.widgetInlineCommentEditor.getDomNode();
        const textarea = element.querySelector("TEXTAREA[name='text']");

        if (mode == EditorMode.editor) {
            textarea.value = "";

            //HACK - because the event in monaco doesn't have preventdefault which means editor takes focus back...            
            setTimeout(() => textarea.focus(), 100);
        }

        return {
            text: textarea.value,
            lineNumber: lineNumber
        };
    }

    nextCommentId() {
        return `${new Date().toString()}-${this.currentUser}`;
    }

    addComment(lineNumber: number, text: string): ReviewComment {
        let comment: ReviewComment = null;
        if (this.activeComment) {
            comment = new ReviewComment(this.nextCommentId(), this.activeComment.lineNumber, this.currentUser, new Date(), text)
            this.activeComment.comments.push(comment);

            this.filterAndMapComments([lineNumber], (comment) => {
                comment.renderStatus = ReviewCommentStatus.dirty;
            });
        } else {
            comment = new ReviewComment(this.nextCommentId(), lineNumber, this.currentUser, new Date(), text)
            this.comments.push(comment);
        }

        this.refreshComments()
        this.layoutInlineToolbar();

        if (this.onChange) {
            this.onChange(this.comments);
        }

        return comment;
    }

    iterateComments(comments?: ReviewComment[], depth?: number, countByLineNumber?: any, results?: ReviewCommentIterItem[]) {
        results = results || [];
        depth = depth || 0;
        comments = comments || this.comments;
        countByLineNumber = countByLineNumber || {};

        for (const comment of comments) {
            countByLineNumber[comment.lineNumber] = (countByLineNumber[comment.lineNumber] || 0) + 1
            results.push({ depth, comment, count: countByLineNumber[comment.lineNumber] })

            this.iterateComments(comment.comments, depth + 1, countByLineNumber, results);
        }

        return results;
    }

    removeComment(comment: ReviewComment) {
        for (const item of this.iterateComments([comment])) {
            item.comment.deleted = true;
        }
        if (this.activeComment == comment) {s            
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
            for (const item of this.iterateComments(this.comments, 0)) {
                if (item.comment.deleted) {
                    console.debug('Delete', item.comment.id);

                    changeAccessor.removeZone(item.comment.viewZoneId);
                    continue;
                }

                if (item.comment.renderStatus === ReviewCommentStatus.hidden) {
                    console.debug('Hidden', item.comment.id);

                    changeAccessor.removeZone(item.comment.viewZoneId);
                    item.comment.viewZoneId = null;

                    continue;
                }

                if (item.comment.renderStatus === ReviewCommentStatus.dirty) {
                    console.debug('Dirty', item.comment.id);

                    changeAccessor.removeZone(item.comment.viewZoneId);
                    item.comment.viewZoneId = null;
                    item.comment.renderStatus = ReviewCommentStatus.normal;
                }

                if (!item.comment.viewZoneId) {
                    console.debug('Create', item.comment.id);

                    const domNode = document.createElement('div');
                    const isActive = this.activeComment == item.comment;

                    domNode.style.marginLeft = (this.config.commentIndent * (item.depth + 1)) + this.config.commentIndentOffset + "";
                    domNode.style.display = 'inline';
                    domNode.className = isActive ? 'reviewComment-active' : 'reviewComment-inactive';

                    const author = document.createElement('span');
                    author.className = 'reviewComment-author'
                    author.innerText = item.comment.author || ' ';

                    const dt = document.createElement('span');
                    dt.className = 'reviewComment-dt'
                    dt.innerText = item.comment.dt.toLocaleString();

                    const text = document.createElement('span');
                    text.className = 'reviewComment-text'
                    text.innerText = item.comment.text;

                    domNode.appendChild(dt);
                    domNode.appendChild(author);
                    domNode.appendChild(text);

                    item.comment.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: item.comment.lineNumber,
                        heightInLines: 1, //TODO - Figure out if multi-line?
                        domNode: domNode,
                        suppressMouseDown: true // This stops focus being lost the editor - meaning keyboard shortcuts keeps working
                    });
                }
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
                this.setEditorMode(EditorMode.editor);
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
    editor,
    toolbar
}

enum ReviewCommentStatus {
    dirty,
    hidden,
    normal
}