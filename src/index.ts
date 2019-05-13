interface MonacoWindow {
    monaco: any;
}

const monacoWindow = (window as any) as MonacoWindow;

export class ReviewComment {
    id:string;
    author: string;
    dt: Date;
    lineNumber: number;
    text: string;
    comments: ReviewComment[];

    deleted: boolean;
    viewZoneId: number;
    isDirty: boolean;

    constructor(id:string, lineNumber: number, author: string, dt: Date, text: string, comments?: ReviewComment[]) {
        this.id = id;
        this.author = author;
        this.dt = dt;
        this.lineNumber = lineNumber;
        this.text = text;
        this.comments = comments || [];

        //HACK - this is runtime state - and should be moved
        this.deleted = false;
        this.isDirty = false;
        this.viewZoneId = null;
    }
}

export function createReviewManager(editor: any, currentUser: string, comments?: ReviewComment[], onChange?: OnCommentsChanged) {
    const rm = new ReviewManager(editor, currentUser, onChange);
    rm.load(comments||[]);
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

class ReviewManager {
    currentUser: string;
    editor: any;
    comments: ReviewComment[];
    activeComment?: ReviewComment;
    controlsWidget: any;
    onChange: OnCommentsChanged;

    constructor(editor: any, currentUser: string, onChange: OnCommentsChanged) {
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = null;
        this.comments = [];
        this.controlsWidget = null;
        this.onChange = onChange;

        this.addActions();
        this.createControlPanel();

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

    createControlPanel() {
        this.controlsWidget = {
            domNode: null,
            allowEditorOverflow: true,
            getId: function () {
                return 'controlsWidget';
            },
            getDomNode: function () {
                if (!this.domNode) {
                    const add = document.createElement('button');
                    add.innerText = '+';
                    add.name = 'add';

                    const remove = document.createElement('button');
                    remove.innerText = '-';
                    remove.name = 'remove';

                    this.domNode = document.createElement('span');
                    this.domNode.appendChild(add);
                    this.domNode.appendChild(remove);
                    this.domNode.style.width = 50;
                }
                return this.domNode;
            },
            getPosition: () => {
                if (this.activeComment) {
                    return {
                        position: {
                            lineNumber: this.activeComment.lineNumber,
                        },
                        preference: [monacoWindow.monaco.editor.ContentWidgetPositionPreference.BELOW]
                    }
                }
            }
        };

        this.editor.addContentWidget(this.controlsWidget);
    }

    configureControlsWidget(comment: ReviewComment) {
        this.setActiveComment(comment);

        this.editor.layoutContentWidget(this.controlsWidget);
    }

    setActiveComment(comment: ReviewComment) {
        const lineNumbersToMakeDirty = [];
        if (this.activeComment && (!comment || this.activeComment.lineNumber !== comment.lineNumber)) {
            lineNumbersToMakeDirty.push(this.activeComment.lineNumber);
        }
        if (comment) {
            lineNumbersToMakeDirty.push(comment.lineNumber);
        }

        this.activeComment = comment;
        if (lineNumbersToMakeDirty.length > 0) {
            this.markLineNumberDirty(lineNumbersToMakeDirty);
        }

        this.refreshComments();
    }

    markLineNumberDirty(lineNumbers: number[]) {
        const comments = this.iterateComments();
        for (const c of comments) {
            if (lineNumbers.indexOf(c.comment.lineNumber) > -1) {
                c.comment.isDirty = true;
            }
        }
    }

    handleMouseDown(ev: any) {
        if (ev.target.element.tagName === 'BUTTON') {
            if (ev.target.element.name === 'add') {
                this.captureComment()
            } else if (ev.target.element.name === 'remove' && this.activeComment) {
                this.removeComment(this.activeComment);
            }

            this.configureControlsWidget(null);

        } else if (ev.target.detail) {
            let activeComment: ReviewComment = null;
            for (const item of this.iterateComments()) {
                if (item.comment.viewZoneId == ev.target.detail.viewZoneId) {
                    activeComment = item.comment;
                    break;
                }
            }

            this.configureControlsWidget(activeComment);
        }
    }

    nextCommentId(){
        return `${new Date().toString()}-${this.currentUser}`;  
    }

    addComment(lineNumber: number, text: string) {
        if (this.activeComment) {
            const comment = new ReviewComment(this.nextCommentId(), this.activeComment.lineNumber, this.currentUser, new Date(), text)
            this.activeComment.comments.push(comment);
        } else {
            const comment = new ReviewComment(this.nextCommentId(), lineNumber, this.currentUser, new Date(), text)
            this.comments.push(comment);
        }

        this.refreshComments()

        if(this.onChange){
            this.onChange(this.comments);
        }
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
        this.refreshComments();
        if (this.onChange) {
            this.onChange(this.comments);
        }
    }

    refreshComments() {
        this.editor.changeViewZones((changeAccessor) => {
            for (const item of this.iterateComments(this.comments, 0)) {
                if (item.comment.deleted) {
                    changeAccessor.removeZone(item.comment.viewZoneId);
                    continue;
                }

                if (item.comment.isDirty) {
                    changeAccessor.removeZone(item.comment.viewZoneId);
                    item.comment.viewZoneId = null;
                    item.comment.isDirty = false;
                }

                if (!item.comment.viewZoneId) {
                    const domNode = document.createElement('div');
                    const isActive = this.activeComment == item.comment;

                    domNode.style.marginLeft = (25 * (item.depth + 1)) + 50 + "";
                    domNode.style.width = "100";
                    domNode.style.display = 'inline';
                    domNode.className = isActive ? 'reviewComment-active' : 'reviewComment-inactive';

                    const status = document.createElement('span');
                    status.className = isActive ? 'reviewComment-selection-active' : 'reviewComment-selection-inactive'
                    status.innerText = isActive ? '>>' : '---';

                    const author = document.createElement('span');
                    author.className = 'reviewComment-author'
                    author.innerText = item.comment.author || ' ';

                    const dt = document.createElement('span');
                    dt.className = 'reviewComment-dt'
                    dt.innerText = item.comment.dt.toLocaleString();

                    const text = document.createElement('span');
                    text.className = 'reviewComment-text'
                    text.innerText = item.comment.text;

                    domNode.appendChild(status);

                    domNode.appendChild(dt);
                    domNode.appendChild(author);
                    domNode.appendChild(text);

                    item.comment.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: item.comment.lineNumber,
                        heightInLines: 1,
                        domNode: domNode
                    });
                }
            }
        });
    }

    captureComment() {
        let promptMessage = 'Mesage';
        if (this.activeComment) {
            promptMessage += '- ' + this.activeComment.text;
        }

        const line = this.editor.getPosition().lineNumber;
        const message = prompt(promptMessage);

        if (message) {
            this.addComment(line, message);
        }
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
                this.captureComment()
                return null;
            }
        });

        
    }
}