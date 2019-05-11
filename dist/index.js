"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var monacoWindow = window;
var ReviewComment = /** @class */ (function () {
    function ReviewComment(lineNumber, author, dt, text, comments) {
        this.author = author;
        this.dt = dt;
        this.lineNumber = lineNumber;
        this.text = text;
        this.comments = comments || [];
        //HACK - this is runtime state - and should be moved
        this.deleted = false;
        this.viewZoneId = null;
    }
    return ReviewComment;
}());
exports.ReviewComment = ReviewComment;
function createReviewManager(editor, currentUser, comments) {
    return new ReviewManager(editor, currentUser, comments);
}
exports.createReviewManager = createReviewManager;
var ReviewManager = /** @class */ (function () {
    function ReviewManager(editor, currentUser, comments) {
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
    ReviewManager.prototype.createControlPanel = function () {
        var _this = this;
        this.controlsWidget = {
            domNode: null,
            allowEditorOverflow: true,
            getId: function () {
                return 'controlsWidget';
            },
            getDomNode: function () {
                if (!this.domNode) {
                    var add = document.createElement('button');
                    add.innerText = '???';
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
            getPosition: function () {
                if (_this.activeComment) {
                    return {
                        position: {
                            lineNumber: _this.activeComment.lineNumber,
                        },
                        preference: [monacoWindow.monaco.editor.ContentWidgetPositionPreference.BELOW]
                    };
                }
            }
        };
        this.editor.addContentWidget(this.controlsWidget);
    };
    ReviewManager.prototype.configureControlsWidget = function (comment) {
        this.activeComment = comment;
        this.editor.layoutContentWidget(this.controlsWidget);
    };
    ReviewManager.prototype.handleMouseDown = function (ev) {
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
            for (var _i = 0, _a = this.iterateComments(); _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.comment.viewZoneId == ev.target.detail.viewZoneId) {
                    activeComment = item.comment;
                    break;
                }
            }
            this.configureControlsWidget(activeComment);
        }
    };
    ReviewManager.prototype.addComment = function (lineNumber, text) {
        if (this.activeComment) {
            var comment = new ReviewComment(this.activeComment.lineNumber, this.currentUser, new Date(), text);
            this.activeComment.comments.push(comment);
        }
        else {
            var comment = new ReviewComment(lineNumber, this.currentUser, new Date(), text);
            this.comments.push(comment);
        }
        this.refreshComments();
    };
    ReviewManager.prototype.iterateComments = function (comments, depth, countByLineNumber, results) {
        results = results || [];
        depth = depth || 0;
        comments = comments || this.comments;
        countByLineNumber = countByLineNumber || {};
        for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
            var comment = comments_1[_i];
            countByLineNumber[comment.lineNumber] = (countByLineNumber[comment.lineNumber] || 0) + 1;
            results.push({ depth: depth, comment: comment, count: countByLineNumber[comment.lineNumber] });
            this.iterateComments(comment.comments, depth + 1, countByLineNumber, results);
        }
        return results;
    };
    ReviewManager.prototype.removeComment = function (comment) {
        for (var _i = 0, _a = this.iterateComments([comment]); _i < _a.length; _i++) {
            var item = _a[_i];
            item.comment.deleted = true;
        }
        this.refreshComments();
    };
    ReviewManager.prototype.refreshComments = function () {
        var _this = this;
        this.editor.changeViewZones(function (changeAccessor) {
            for (var _i = 0, _a = _this.iterateComments(_this.comments, 0); _i < _a.length; _i++) {
                var item = _a[_i];
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
    };
    ReviewManager.prototype.captureComment = function () {
        var promptMessage = 'Mesage';
        if (this.activeComment) {
            promptMessage += '- ' + this.activeComment.text;
        }
        var line = this.editor.getPosition().lineNumber;
        var message = prompt(promptMessage);
        this.addComment(line, message);
    };
    ReviewManager.prototype.addActions = function () {
        var _this = this;
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
            run: function () {
                _this.captureComment();
                return null;
            }
        });
    };
    return ReviewManager;
}());
//# sourceMappingURL=index.js.map