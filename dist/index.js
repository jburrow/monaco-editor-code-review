var monacoWindow = window;
class ReviewComment {
    constructor(lineNumber, author, dt, text, comments) {
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
function createReviewManager(editor, currentUser, comments) {
    return new ReviewManager(editor, currentUser, comments);
}
class ReviewManager {
    constructor(editor, currentUser, comments) {
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
                    var add = document.createElement('button');
                    add.innerText = '+';
                    add.name = 'add';
                    var remove = document.createElement('button');
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
                    };
                }
            }
        };
        this.editor.addContentWidget(this.controlsWidget);
    }
    configureControlsWidget(comment) {
        this.activeComment = comment;
        this.editor.layoutContentWidget(this.controlsWidget);
    }
    handleMouseDown(ev) {
        if (ev.target.element.tagName === 'BUTTON') {
            if (ev.target.element.name === 'add') {
                this.captureComment();
            }
            else if (ev.target.element.name === 'remove' && this.activeComment) {
                this.removeComment(this.activeComment);
            }
            this.configureControlsWidget(null);
        }
        else if (ev.target.detail) {
            var activeComment = null;
            for (var item of this.iterateComments()) {
                if (item.comment.viewZoneId == ev.target.detail.viewZoneId) {
                    activeComment = item.comment;
                    break;
                }
            }
            this.configureControlsWidget(activeComment);
        }
    }
    addComment(line, text) {
        var comment = new ReviewComment(line, this.currentUser, new Date(), text);
        if (this.activeComment) {
            this.activeComment.comments.push(comment);
        }
        else {
            this.comments.push(comment);
        }
        this.refreshComments();
    }
    *iterateComments(comments, depth, countByLineNumber) {
        depth = depth || 0;
        comments = comments || this.comments;
        countByLineNumber = countByLineNumber || {};
        for (var i = comments.length - 1; i >= 0; i--) {
            var comment = comments[i];
            countByLineNumber[comment.lineNumber] = (countByLineNumber[comment.lineNumber] || 0) + 1;
            yield { depth, comment, count: countByLineNumber[comment.lineNumber] };
            yield* this.iterateComments(comment.comments, depth + 1, countByLineNumber);
        }
        return;
    }
    removeComment(comment) {
        for (var item of this.iterateComments([comment])) {
            item.comment.deleted = true;
        }
        this.refreshComments();
    }
    refreshComments() {
        var viewZoneId = null;
        this.editor.changeViewZones((changeAccessor) => {
            for (var item of this.iterateComments(this.comments, 0)) {
                if (!item.comment.viewZoneId) {
                    var domNode = document.createElement('div');
                    domNode.style.marginLeft = (25 * (item.depth + 1)) + 50 + "";
                    domNode.style.width = "100";
                    domNode.style.display = 'inline';
                    //TODO - Figure out a nice way to in-line an icon maybe via font?
                    var icon = document.createElement('span');
                    icon.style.backgroundColor = '#c9c9c9';
                    icon.innerText = '...';
                    var author = document.createElement('span');
                    author.innerText = item.comment.author || ' ';
                    author.style.marginRight = "10";
                    var dt = document.createElement('span');
                    dt.innerText = item.comment.dt.toLocaleString();
                    dt.style.marginRight = "10";
                    var text = document.createElement('span');
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
        message = 'Mesage';
        if (this.activeComment) {
            message += '- ' + this.activeComment.text;
        }
        var message = prompt(message);
        var line = this.editor.getPosition().lineNumber;
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
                this.captureComment();
                return null;
            }
        });
    }
}
//# sourceMappingURL=index.js.map