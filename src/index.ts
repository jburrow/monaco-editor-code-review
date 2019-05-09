interface MonacoWindow {
    monaco: any;
}

const monacoWindow = (window as any) as MonacoWindow;

class ReviewComment {
    author: string;
    dt: Date;
    lineNumber: number;
    text: string;
    comments: ReviewComment[];

    deleted: boolean;
    viewZoneId: number;

    constructor(lineNumber: number, author: string, dt: Date, text: string, comments?: ReviewComment[]) {
        this.author = author;
        this.dt = dt;
        this.lineNumber = lineNumber;
        this.text = text;
        this.comments = comments || [];

        //HACK - this is runtime state - and should be moved
        this.deleted = false;
        this.viewZoneId = null;
    }
}

function createReviewManager(editor: any, currentUser: string, comments: ReviewComment[]) {
    return new ReviewManager(editor, currentUser, comments);
}


interface ReviewCommentIterItem{
    depth:number;
    comment: ReviewComment,
    count:number
}


class ReviewManager {
    currentUser: string;
    editor: any;
    comments: ReviewComment[];
    activeComment?: ReviewComment;
    controlsWidget: any;

    constructor(editor: any, currentUser: string, comments: ReviewComment[]) {
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = null;
        this.comments = comments || [];
        this.controlsWidget = null;

        this.addActions();
        this.createControlPanel();

        this.editor.onMouseDown(this.handleMouseDown.bind(this));

        if (this.comments.length) {
            this.refreshComments();
        }
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

    configureControlsWidget(comment:ReviewComment) {
        this.activeComment = comment;
        this.editor.layoutContentWidget(this.controlsWidget);
    }

    handleMouseDown(ev:any) {
        if (ev.target.element.tagName === 'BUTTON') {
            if (ev.target.element.name === 'add') {
                this.captureComment()
            } else if (ev.target.element.name === 'remove' && this.activeComment) {
                this.removeComment(this.activeComment);
            }

            this.configureControlsWidget(null);
        } else if (ev.target.detail) {
            let activeComment:ReviewComment = null;
            for (const item of this.iterateComments()) {
                if (item.comment.viewZoneId == ev.target.detail.viewZoneId) {
                    activeComment = item.comment;
                    break;
                }
            }

            this.configureControlsWidget(activeComment);
        }
    }

    addComment(lineNumber:number, text:string) {        
        if (this.activeComment) {
            const comment = new ReviewComment(this.activeComment.lineNumber, this.currentUser, new Date(), text)
            this.activeComment.comments.push(comment);
        } else {
            const comment = new ReviewComment(lineNumber, this.currentUser, new Date(), text)
            this.comments.push(comment);
        }

        this.refreshComments()
    }

    iterateComments(comments?: ReviewComment[], depth?: number, countByLineNumber?: any, results?:ReviewCommentIterItem[]) {
        results = results||[];
        depth = depth || 0;
        comments = comments || this.comments;
        countByLineNumber = countByLineNumber || {};

        for(const comment of comments){            
            countByLineNumber[comment.lineNumber] = (countByLineNumber[comment.lineNumber] || 0) + 1
            results.push({ depth, comment, count: countByLineNumber[comment.lineNumber] })
            this.iterateComments(comment.comments, depth + 1, countByLineNumber, results);
        }

        return results;
    }

    removeComment(comment:ReviewComment) {
        for (const item of this.iterateComments([comment])) {
            item.comment.deleted = true;
        }
        this.refreshComments();
    }

    refreshComments() {        
        this.editor.changeViewZones((changeAccessor) => {
            for (const item of this.iterateComments(this.comments, 0)) {
                if (!item.comment.viewZoneId) {
                    const domNode = document.createElement('div');

                    domNode.style.marginLeft = (25 * (item.depth + 1)) + 50 + "";
                    domNode.style.width = "100";
                    domNode.style.display = 'inline';

                    //TODO - Figure out a nice way to in-line an icon maybe via font?
                    const icon = document.createElement('span');
                    icon.style.backgroundColor = '#c9c9c9';
                    icon.innerText = '...';

                    const author = document.createElement('span');
                    author.innerText = item.comment.author || ' ';
                    author.style.marginRight = "10";

                    const dt = document.createElement('span');
                    dt.innerText = item.comment.dt.toLocaleString();
                    dt.style.marginRight = "10";

                    const text = document.createElement('span');
                    text.innerText = item.comment.text;

                    domNode.appendChild(icon);
                    domNode.appendChild(dt);
                    domNode.appendChild(author);
                    domNode.appendChild(text);

                    item.comment.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: item.comment.lineNumber,
                        heightInLines: 1,
                        domNode: domNode
                    });
                }

                if (item.comment.deleted) {
                    changeAccessor.removeZone(item.comment.viewZoneId);
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

        this.addComment(line, message);
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