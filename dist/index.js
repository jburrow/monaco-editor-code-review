var MonacoEditorCodeReview =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var monacoWindow = window;
var ReviewComment = /** @class */ (function () {
    function ReviewComment(id, lineNumber, author, dt, text, comments) {
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
    return ReviewComment;
}());
exports.ReviewComment = ReviewComment;
function createReviewManager(editor, currentUser, comments, onChange) {
    var rm = new ReviewManager(editor, currentUser, onChange);
    rm.load(comments || []);
    return rm;
}
exports.createReviewManager = createReviewManager;
var defaultReviewManagerConfig = {
    editButtonOffset: '-75px',
    editButtonAddText: 'Reply',
    editButtonRemoveText: 'Remove',
    editButtonEnableRemove: true,
    lineHeight: 19,
    commentIndent: 20,
    commentIndentOffset: 0,
    reviewCommentIconSelect: '---',
    reviewCommentIconActive: '>>'
};
var ReviewManager = /** @class */ (function () {
    function ReviewManager(editor, currentUser, onChange) {
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = null;
        this.comments = [];
        this.widgetInlineToolbar = null;
        this.widgetInlineCommentEditor = null;
        this.onChange = onChange;
        this.editorMode = EditorMode.toolbar;
        this.config = defaultReviewManagerConfig;
        this.addActions();
        this.createInlineToolbarWidget();
        this.createInlineEditorWidget();
        this.editor.onMouseDown(this.handleMouseDown.bind(this));
    }
    ReviewManager.prototype.load = function (comments) {
        var _this = this;
        this.editor.changeViewZones(function (changeAccessor) {
            for (var _i = 0, _a = _this.iterateComments(); _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.comment.viewZoneId) {
                    changeAccessor.removeZone(item.comment.viewZoneId);
                }
            }
            // Should this be inside this callback?
            _this.comments = comments;
            _this.refreshComments();
        });
    };
    ReviewManager.prototype.createInlineEditButtonsElement = function () {
        var root = document.createElement('span');
        root.className = 'editButtonsContainer';
        var add = document.createElement('a');
        add.href = '#';
        add.innerText = this.config.editButtonAddText;
        add.name = 'add';
        add.className = 'editButtonAdd';
        root.appendChild(add);
        if (this.config.editButtonEnableRemove) {
            var remove = document.createElement('a');
            remove.href = '#';
            remove.innerText = this.config.editButtonRemoveText;
            remove.name = 'remove';
            remove.className = 'editButtonRemove';
            root.appendChild(remove);
        }
        root.style.marginLeft = this.config.editButtonOffset;
        return root;
    };
    ReviewManager.prototype.createInlineEditorElement = function () {
        var _this = this;
        var root = document.createElement('span');
        root.className = "reviewCommentEdit";
        var textarea = document.createElement('textarea');
        textarea.className = "reviewCommentText";
        textarea.innerText = '';
        textarea.name = 'text';
        textarea.onkeypress = function (e) {
            if (e.code === "Enter" && e.ctrlKey) {
                var r = _this.setEditorMode(EditorMode.toolbar);
                _this.addComment(r.lineNumber, r.text);
            }
        };
        var save = document.createElement('button');
        save.className = "reviewCommentSave";
        save.innerText = 'Save';
        save.name = 'save';
        var cancel = document.createElement('button');
        cancel.className = "reviewCommentCancel";
        cancel.innerText = 'Cancel';
        cancel.name = 'cancel';
        root.appendChild(textarea);
        root.appendChild(save);
        root.appendChild(cancel);
        return root;
    };
    ReviewManager.prototype.createInlineToolbarWidget = function () {
        var _this = this;
        var buttonsElement = this.createInlineEditButtonsElement();
        this.widgetInlineToolbar = {
            allowEditorOverflow: true,
            getId: function () {
                return 'widgetInlineToolbar';
            },
            getDomNode: function () {
                return buttonsElement;
            },
            getPosition: function () {
                if (_this.activeComment && _this.editorMode == EditorMode.toolbar) {
                    return {
                        position: {
                            lineNumber: _this.activeComment.lineNumber,
                        },
                        preference: [monacoWindow.monaco.editor.ContentWidgetPositionPreference.BELOW]
                    };
                }
            }
        };
        this.editor.addContentWidget(this.widgetInlineToolbar);
    };
    ReviewManager.prototype.createInlineEditorWidget = function () {
        var _this = this;
        var editorElement = this.createInlineEditorElement();
        this.widgetInlineCommentEditor = {
            allowEditorOverflow: true,
            getId: function () {
                return 'widgetInlineEditor';
            },
            getDomNode: function () {
                return editorElement;
            },
            getPosition: function () {
                if (_this.editorMode == EditorMode.editor) {
                    return {
                        position: {
                            // We are using negative marginTop to shift it above the line to the previous
                            lineNumber: _this.activeComment ? _this.activeComment.lineNumber + 1 : _this.editor.getPosition().lineNumber
                        },
                        preference: [monacoWindow.monaco.editor.ContentWidgetPositionPreference.BELOW]
                    };
                }
            }
        };
        this.editor.addContentWidget(this.widgetInlineCommentEditor);
    };
    ReviewManager.prototype.setActiveComment = function (comment) {
        console.debug('setActiveComment', comment);
        var lineNumbersToMakeDirty = [];
        if (this.activeComment && (!comment || this.activeComment.lineNumber !== comment.lineNumber)) {
            lineNumbersToMakeDirty.push(this.activeComment.lineNumber);
        }
        if (comment) {
            lineNumbersToMakeDirty.push(comment.lineNumber);
        }
        this.activeComment = comment;
        if (lineNumbersToMakeDirty.length > 0) {
            this.filterAndMapComments(lineNumbersToMakeDirty, function (comment) { comment.renderStatus = ReviewCommentStatus.dirty; });
        }
        this.refreshComments();
        this.editor.layoutContentWidget(this.widgetInlineToolbar);
    };
    ReviewManager.prototype.filterAndMapComments = function (lineNumbers, fn) {
        var comments = this.iterateComments();
        for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
            var c = comments_1[_i];
            if (lineNumbers.indexOf(c.comment.lineNumber) > -1) {
                fn(c.comment);
            }
        }
    };
    ReviewManager.prototype.handleMouseDown = function (ev) {
        console.debug('handleMouseDown', this.activeComment, ev.target.element, ev.target.detail);
        if (ev.target.element.tagName === 'TEXTAREA') {
        }
        else if (ev.target.element.tagName === 'BUTTON' || ev.target.element.tagName === 'A') {
            if (ev.target.element.name === 'add') {
                this.setEditorMode(EditorMode.editor);
            }
            else if (ev.target.element.name === 'remove' && this.activeComment) {
                this.removeComment(this.activeComment);
                this.setActiveComment(null);
            }
            else if (ev.target.element.name === 'save') {
                var r = this.setEditorMode(EditorMode.toolbar);
                this.addComment(r.lineNumber, r.text);
            }
            else if (ev.target.element.name === 'cancel') {
                this.setEditorMode(EditorMode.toolbar);
            }
            return;
        }
        else {
            var activeComment = null;
            if (ev.target.detail && ev.target.detail.viewZoneId !== undefined) {
                for (var _i = 0, _a = this.iterateComments(); _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.comment.viewZoneId == ev.target.detail.viewZoneId) {
                        activeComment = item.comment;
                        break;
                    }
                }
            }
            this.setActiveComment(activeComment);
            if (this.editorMode === EditorMode.editor) {
                this.setEditorMode(EditorMode.toolbar);
            }
        }
    };
    ReviewManager.prototype.setEditorMode = function (mode) {
        var lineNumber = this.activeComment ? this.activeComment.lineNumber : this.editor.getPosition().lineNumber;
        console.debug('setEditorMode', this.activeComment, lineNumber, this.editor.getPosition().lineNumber);
        this.editorMode = mode;
        var idx = 0;
        var count = 0;
        var marginTop = 0;
        var lineHeight = this.config.lineHeight; //FIXME - Magic number for line height            
        if (this.activeComment) {
            for (var _i = 0, _a = this.iterateComments(); _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.comment.lineNumber == this.activeComment.lineNumber) {
                    count++;
                }
                if (item.comment == this.activeComment) {
                    idx = count + 0;
                }
            }
            marginTop = ((++count - idx) * lineHeight) - 2;
        }
        var node = this.widgetInlineCommentEditor.getDomNode();
        node.style.marginTop = "-" + marginTop + "px";
        this.editor.layoutContentWidget(this.widgetInlineToolbar);
        this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
        var element = this.widgetInlineCommentEditor.getDomNode();
        var textarea = element.querySelector("TEXTAREA[name='text']");
        if (mode == EditorMode.editor) {
            textarea.value = "";
            //HACK - because the event in monaco doesn't have preventdefault which means editor takes focus back...            
            setTimeout(function () { return textarea.focus(); }, 100);
        }
        return {
            text: textarea.value,
            lineNumber: lineNumber
        };
    };
    ReviewManager.prototype.nextCommentId = function () {
        return new Date().toString() + "-" + this.currentUser;
    };
    ReviewManager.prototype.addComment = function (lineNumber, text) {
        if (this.activeComment) {
            var comment = new ReviewComment(this.nextCommentId(), this.activeComment.lineNumber, this.currentUser, new Date(), text);
            this.activeComment.comments.push(comment);
            this.filterAndMapComments([lineNumber], function (comment) {
                comment.renderStatus = ReviewCommentStatus.dirty;
            });
        }
        else {
            var comment = new ReviewComment(this.nextCommentId(), lineNumber, this.currentUser, new Date(), text);
            this.comments.push(comment);
        }
        this.refreshComments();
        if (this.onChange) {
            this.onChange(this.comments);
        }
    };
    ReviewManager.prototype.iterateComments = function (comments, depth, countByLineNumber, results) {
        results = results || [];
        depth = depth || 0;
        comments = comments || this.comments;
        countByLineNumber = countByLineNumber || {};
        for (var _i = 0, comments_2 = comments; _i < comments_2.length; _i++) {
            var comment = comments_2[_i];
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
        if (this.onChange) {
            this.onChange(this.comments);
        }
    };
    ReviewManager.prototype.refreshComments = function () {
        var _this = this;
        this.editor.changeViewZones(function (changeAccessor) {
            for (var _i = 0, _a = _this.iterateComments(_this.comments, 0); _i < _a.length; _i++) {
                var item = _a[_i];
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
                    var domNode = document.createElement('div');
                    var isActive = _this.activeComment == item.comment;
                    domNode.style.marginLeft = (_this.config.commentIndent * (item.depth + 1)) + _this.config.commentIndentOffset + "";
                    domNode.style.display = 'inline';
                    domNode.className = isActive ? 'reviewComment-active' : 'reviewComment-inactive';
                    var status_1 = document.createElement('span');
                    status_1.className = isActive ? 'reviewComment-selection-active' : 'reviewComment-selection-inactive';
                    status_1.innerText = isActive ? _this.config.reviewCommentIconActive : _this.config.reviewCommentIconSelect;
                    var author = document.createElement('span');
                    author.className = 'reviewComment-author';
                    author.innerText = item.comment.author || ' ';
                    var dt = document.createElement('span');
                    dt.className = 'reviewComment-dt';
                    dt.innerText = item.comment.dt.toLocaleString();
                    var text = document.createElement('span');
                    text.className = 'reviewComment-text';
                    text.innerText = item.comment.text;
                    domNode.appendChild(status_1);
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
                console.log('run');
                _this.setEditorMode(EditorMode.editor);
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
            run: function () {
                _this.navigateToComment(NaviationDirection.next);
                return null;
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
            run: function () {
                _this.navigateToComment(NaviationDirection.prev);
            }
        });
    };
    ReviewManager.prototype.navigateToComment = function (direction) {
        var currentLine = 0;
        if (this.activeComment) {
            currentLine = this.activeComment.lineNumber;
        }
        else {
            currentLine = this.editor.getPosition().lineNumber;
        }
        var comments = this.comments.filter(function (c) {
            if (direction === NaviationDirection.next) {
                return c.lineNumber > currentLine;
            }
            else if (direction === NaviationDirection.prev) {
                return c.lineNumber < currentLine;
            }
        });
        if (comments.length) {
            comments.sort(function (a, b) {
                if (direction === NaviationDirection.next) {
                    return a.lineNumber - b.lineNumber;
                }
                else if (direction === NaviationDirection.prev) {
                    return b.lineNumber - a.lineNumber;
                }
            });
            var comment = comments[0];
            this.setActiveComment(comment);
            this.editor.revealLine(comment.lineNumber);
        }
    };
    return ReviewManager;
}());
var NaviationDirection;
(function (NaviationDirection) {
    NaviationDirection[NaviationDirection["next"] = 0] = "next";
    NaviationDirection[NaviationDirection["prev"] = 1] = "prev";
})(NaviationDirection || (NaviationDirection = {}));
var EditorMode;
(function (EditorMode) {
    EditorMode[EditorMode["editor"] = 0] = "editor";
    EditorMode[EditorMode["toolbar"] = 1] = "toolbar";
})(EditorMode || (EditorMode = {}));
var ReviewCommentStatus;
(function (ReviewCommentStatus) {
    ReviewCommentStatus[ReviewCommentStatus["dirty"] = 0] = "dirty";
    ReviewCommentStatus[ReviewCommentStatus["hidden"] = 1] = "hidden";
    ReviewCommentStatus[ReviewCommentStatus["normal"] = 2] = "normal";
})(ReviewCommentStatus || (ReviewCommentStatus = {}));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01vbmFjb0VkaXRvckNvZGVSZXZpZXcvLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzlFQSxJQUFNLFlBQVksR0FBSSxNQUE4QixDQUFDO0FBRXJEO0lBWUksdUJBQVksRUFBVSxFQUFFLFVBQWtCLEVBQUUsTUFBYyxFQUFFLEVBQVEsRUFBRSxJQUFZLEVBQUUsUUFBMEI7UUFDMUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLEVBQUUsQ0FBQztRQUUvQixvREFBb0Q7UUFDcEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLFlBQVksR0FBRyxtQkFBbUIsQ0FBQyxNQUFNLENBQUM7UUFDL0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7SUFDM0IsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0FBQztBQXpCWSxzQ0FBYTtBQTJCMUIsU0FBZ0IsbUJBQW1CLENBQUMsTUFBVyxFQUFFLFdBQW1CLEVBQUUsUUFBMEIsRUFBRSxRQUE0QjtJQUMxSCxJQUFNLEVBQUUsR0FBRyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzVELEVBQUUsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3hCLE9BQU8sRUFBRSxDQUFDO0FBQ2QsQ0FBQztBQUpELGtEQUlDO0FBeUJELElBQU0sMEJBQTBCLEdBQXdCO0lBQ3BELGdCQUFnQixFQUFFLE9BQU87SUFDekIsaUJBQWlCLEVBQUUsT0FBTztJQUMxQixvQkFBb0IsRUFBRSxRQUFRO0lBQzlCLHNCQUFzQixFQUFFLElBQUk7SUFDNUIsVUFBVSxFQUFFLEVBQUU7SUFDZCxhQUFhLEVBQUUsRUFBRTtJQUNqQixtQkFBbUIsRUFBRSxDQUFDO0lBQ3RCLHVCQUF1QixFQUFHLEtBQUs7SUFDL0IsdUJBQXVCLEVBQUcsSUFBSTtDQUNqQyxDQUFDO0FBR0Y7SUFXSSx1QkFBWSxNQUFXLEVBQUUsV0FBbUIsRUFBRSxRQUEyQjtRQUNyRSxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBQ2hDLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxJQUFJLENBQUM7UUFDdEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxNQUFNLEdBQUcsMEJBQTBCLENBQUM7UUFFekMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBQ2pDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxDQUFDO1FBRWhDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELDRCQUFJLEdBQUosVUFBSyxRQUF5QjtRQUE5QixpQkFZQztRQVhHLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLFVBQUMsY0FBYztZQUN2QyxLQUFtQixVQUFzQixFQUF0QixVQUFJLENBQUMsZUFBZSxFQUFFLEVBQXRCLGNBQXNCLEVBQXRCLElBQXNCLEVBQUU7Z0JBQXRDLElBQU0sSUFBSTtnQkFDWCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO29CQUN6QixjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ3REO2FBQ0o7WUFFRCx1Q0FBdUM7WUFDdkMsS0FBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7WUFDekIsS0FBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxzREFBOEIsR0FBOUI7UUFDSSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxTQUFTLEdBQUcsc0JBQXNCO1FBRXZDLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDeEMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHO1FBQ2QsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDO1FBQzlDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsZUFBZTtRQUMvQixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXRCLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRTtZQUNwQyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRztZQUNqQixNQUFNLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUM7WUFDcEQsTUFBTSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7WUFDdkIsTUFBTSxDQUFDLFNBQVMsR0FBRyxrQkFBa0I7WUFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QjtRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7UUFDckQsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELGlEQUF5QixHQUF6QjtRQUFBLGlCQThCQztRQTdCRyxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxTQUFTLEdBQUcsbUJBQW1CO1FBRXBDLElBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDcEQsUUFBUSxDQUFDLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztRQUN6QyxRQUFRLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztRQUN4QixRQUFRLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztRQUN2QixRQUFRLENBQUMsVUFBVSxHQUFHLFVBQUMsQ0FBZ0I7WUFDbkMsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFO2dCQUNqQyxJQUFNLENBQUMsR0FBRyxLQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDakQsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN6QztRQUNMLENBQUMsQ0FBQztRQUVGLElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztRQUVuQixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQUM7UUFDekMsTUFBTSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7UUFDNUIsTUFBTSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7UUFFdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFekIsT0FBTyxJQUFJO0lBQ2YsQ0FBQztJQUVELGlEQUF5QixHQUF6QjtRQUFBLGlCQXdCQztRQXZCRyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsOEJBQThCLEVBQUUsQ0FBQztRQUU3RCxJQUFJLENBQUMsbUJBQW1CLEdBQUc7WUFDdkIsbUJBQW1CLEVBQUUsSUFBSTtZQUN6QixLQUFLLEVBQUU7Z0JBQ0gsT0FBTyxxQkFBcUIsQ0FBQztZQUNqQyxDQUFDO1lBQ0QsVUFBVSxFQUFFO2dCQUNSLE9BQU8sY0FBYyxDQUFDO1lBQzFCLENBQUM7WUFDRCxXQUFXLEVBQUU7Z0JBQ1QsSUFBSSxLQUFJLENBQUMsYUFBYSxJQUFJLEtBQUksQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRTtvQkFDN0QsT0FBTzt3QkFDSCxRQUFRLEVBQUU7NEJBQ04sVUFBVSxFQUFFLEtBQUksQ0FBQyxhQUFhLENBQUMsVUFBVTt5QkFDNUM7d0JBQ0QsVUFBVSxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsK0JBQStCLENBQUMsS0FBSyxDQUFDO3FCQUNqRjtpQkFDSjtZQUNMLENBQUM7U0FDSixDQUFDO1FBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsZ0RBQXdCLEdBQXhCO1FBQUEsaUJBd0JDO1FBdkJHLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBQ3ZELElBQUksQ0FBQyx5QkFBeUIsR0FBRztZQUM3QixtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLEtBQUssRUFBRTtnQkFDSCxPQUFPLG9CQUFvQixDQUFDO1lBQ2hDLENBQUM7WUFDRCxVQUFVLEVBQUU7Z0JBQ1IsT0FBTyxhQUFhLENBQUM7WUFDekIsQ0FBQztZQUNELFdBQVcsRUFBRTtnQkFDVCxJQUFJLEtBQUksQ0FBQyxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRTtvQkFDdEMsT0FBTzt3QkFDSCxRQUFRLEVBQUU7NEJBQ04sNkVBQTZFOzRCQUM3RSxVQUFVLEVBQUUsS0FBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVU7eUJBQzVHO3dCQUNELFVBQVUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLCtCQUErQixDQUFDLEtBQUssQ0FBQztxQkFDakY7aUJBQ0o7WUFDTCxDQUFDO1NBQ0osQ0FBQztRQUVGLElBQUksQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELHdDQUFnQixHQUFoQixVQUFpQixPQUFzQjtRQUNuQyxPQUFPLENBQUMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTNDLElBQU0sc0JBQXNCLEdBQUcsRUFBRSxDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUMxRixzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM5RDtRQUNELElBQUksT0FBTyxFQUFFO1lBQ1Qsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNuRDtRQUVELElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDO1FBQzdCLElBQUksc0JBQXNCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsc0JBQXNCLEVBQUUsVUFBQyxPQUFPLElBQU8sT0FBTyxDQUFDLFlBQVksR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEg7UUFFRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsNENBQW9CLEdBQXBCLFVBQXFCLFdBQXFCLEVBQUUsRUFBc0M7UUFDOUUsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hDLEtBQWdCLFVBQVEsRUFBUixxQkFBUSxFQUFSLHNCQUFRLEVBQVIsSUFBUSxFQUFFO1lBQXJCLElBQU0sQ0FBQztZQUNSLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ2pCO1NBQ0o7SUFDTCxDQUFDO0lBRUQsdUNBQWUsR0FBZixVQUFnQixFQUFPO1FBQ25CLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTFGLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLFVBQVUsRUFBRTtTQUU3QzthQUFNLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxLQUFLLFFBQVEsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssR0FBRyxFQUFFO1lBQ3BGLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTtnQkFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDekM7aUJBQU0sSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7Z0JBQ2xFLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN2QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDL0I7aUJBQU0sSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO2dCQUMxQyxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDakQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN6QztpQkFBTSxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7Z0JBQzVDLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzFDO1lBQ0QsT0FBTztTQUNWO2FBQU07WUFDSCxJQUFJLGFBQWEsR0FBa0IsSUFBSSxDQUFDO1lBRXhDLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtnQkFDL0QsS0FBbUIsVUFBc0IsRUFBdEIsU0FBSSxDQUFDLGVBQWUsRUFBRSxFQUF0QixjQUFzQixFQUF0QixJQUFzQixFQUFFO29CQUF0QyxJQUFNLElBQUk7b0JBQ1gsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7d0JBQ3hELGFBQWEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO3dCQUM3QixNQUFNO3FCQUNUO2lCQUNKO2FBQ0o7WUFDRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFckMsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxNQUFNLEVBQUU7Z0JBQ3ZDLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzFDO1NBQ0o7SUFDTCxDQUFDO0lBRU8scUNBQWEsR0FBckIsVUFBc0IsSUFBZ0I7UUFDbEMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDO1FBQzdHLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDckcsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFFdkIsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQ1osSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxTQUFTLEdBQVcsQ0FBQyxDQUFDO1FBQzFCLElBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLG1EQUFrRDtRQUU1RixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDcEIsS0FBaUIsVUFBc0IsRUFBdEIsU0FBSSxDQUFDLGVBQWUsRUFBRSxFQUF0QixjQUFzQixFQUF0QixJQUFzQixFQUFFO2dCQUFwQyxJQUFJLElBQUk7Z0JBQ1QsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRTtvQkFDMUQsS0FBSyxFQUFFLENBQUM7aUJBQ1g7Z0JBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7b0JBQ3BDLEdBQUcsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2lCQUNuQjthQUNKO1lBQ0QsU0FBUyxHQUFHLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEQ7UUFFRCxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMseUJBQXlCLENBQUMsVUFBVSxFQUFpQixDQUFDO1FBQ3RFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQUksU0FBUyxPQUFJLENBQUM7UUFFekMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRWhFLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM1RCxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLHVCQUF1QixDQUFDLENBQUM7UUFFaEUsSUFBSSxJQUFJLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRTtZQUMzQixRQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUVwQixtSEFBbUg7WUFDbkgsVUFBVSxDQUFDLGNBQU0sZUFBUSxDQUFDLEtBQUssRUFBRSxFQUFoQixDQUFnQixFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQzNDO1FBRUQsT0FBTztZQUNILElBQUksRUFBRSxRQUFRLENBQUMsS0FBSztZQUNwQixVQUFVLEVBQUUsVUFBVTtTQUN6QixDQUFDO0lBQ04sQ0FBQztJQUVELHFDQUFhLEdBQWI7UUFDSSxPQUFVLElBQUksSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLFNBQUksSUFBSSxDQUFDLFdBQWEsQ0FBQztJQUMxRCxDQUFDO0lBRUQsa0NBQVUsR0FBVixVQUFXLFVBQWtCLEVBQUUsSUFBWTtRQUN2QyxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDcEIsSUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUM7WUFDMUgsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLFVBQUMsT0FBTztnQkFDNUMsT0FBTyxDQUFDLFlBQVksR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7U0FDTjthQUFNO1lBQ0gsSUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDO1lBQ3ZHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxDQUFDLGVBQWUsRUFBRTtRQUV0QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDZixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNoQztJQUNMLENBQUM7SUFFRCx1Q0FBZSxHQUFmLFVBQWdCLFFBQTBCLEVBQUUsS0FBYyxFQUFFLGlCQUF1QixFQUFFLE9BQWlDO1FBQ2xILE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3hCLEtBQUssR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDO1FBQ25CLFFBQVEsR0FBRyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNyQyxpQkFBaUIsR0FBRyxpQkFBaUIsSUFBSSxFQUFFLENBQUM7UUFFNUMsS0FBc0IsVUFBUSxFQUFSLHFCQUFRLEVBQVIsc0JBQVEsRUFBUixJQUFRLEVBQUU7WUFBM0IsSUFBTSxPQUFPO1lBQ2QsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDeEYsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssU0FBRSxPQUFPLFdBQUUsS0FBSyxFQUFFLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQzlFLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ2pGO1FBRUQsT0FBTyxPQUFPLENBQUM7SUFDbkIsQ0FBQztJQUVELHFDQUFhLEdBQWIsVUFBYyxPQUFzQjtRQUNoQyxLQUFtQixVQUErQixFQUEvQixTQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBL0IsY0FBK0IsRUFBL0IsSUFBK0IsRUFBRTtZQUEvQyxJQUFNLElBQUk7WUFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDL0I7UUFDRCxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdkIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDaEM7SUFDTCxDQUFDO0lBRUQsdUNBQWUsR0FBZjtRQUFBLGlCQWtFQztRQWpFRyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxVQUFDLGNBQWM7WUFDdkMsS0FBbUIsVUFBc0MsRUFBdEMsVUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxFQUF0QyxjQUFzQyxFQUF0QyxJQUFzQyxFQUFFO2dCQUF0RCxJQUFNLElBQUk7Z0JBQ1gsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRTtvQkFDdEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFFekMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNuRCxTQUFTO2lCQUNaO2dCQUVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEtBQUssbUJBQW1CLENBQUMsTUFBTSxFQUFFO29CQUMxRCxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUV6QyxjQUFjLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztvQkFFL0IsU0FBUztpQkFDWjtnQkFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxLQUFLLG1CQUFtQixDQUFDLEtBQUssRUFBRTtvQkFDekQsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFFeEMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNuRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7b0JBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQztpQkFDMUQ7Z0JBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO29CQUMxQixPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUV6QyxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUM5QyxJQUFNLFFBQVEsR0FBRyxLQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBRXBELE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxHQUFHLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxFQUFFLENBQUM7b0JBQ2pILE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztvQkFDakMsT0FBTyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyx3QkFBd0IsQ0FBQztvQkFFakYsSUFBTSxRQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDOUMsUUFBTSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsQ0FBQyxrQ0FBa0M7b0JBQ25HLFFBQU0sQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDO29CQUV4RyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUM5QyxNQUFNLENBQUMsU0FBUyxHQUFHLHNCQUFzQjtvQkFDekMsTUFBTSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUM7b0JBRTlDLElBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsa0JBQWtCO29CQUNqQyxFQUFFLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUVoRCxJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUM1QyxJQUFJLENBQUMsU0FBUyxHQUFHLG9CQUFvQjtvQkFDckMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztvQkFFbkMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxRQUFNLENBQUMsQ0FBQztvQkFDNUIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDeEIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDNUIsT0FBTyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFFMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQzt3QkFDN0MsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVTt3QkFDeEMsYUFBYSxFQUFFLENBQUM7d0JBQ2hCLE9BQU8sRUFBRSxPQUFPO3FCQUNuQixDQUFDLENBQUM7aUJBQ047YUFDSjtRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGtDQUFVLEdBQVY7UUFBQSxpQkFrREM7UUFqREcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7WUFDbEIsRUFBRSxFQUFFLGtCQUFrQjtZQUN0QixLQUFLLEVBQUUsYUFBYTtZQUNwQixXQUFXLEVBQUU7Z0JBQ1QsWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUc7YUFDdkU7WUFDRCxZQUFZLEVBQUUsSUFBSTtZQUNsQixpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLGtCQUFrQixFQUFFLFlBQVk7WUFDaEMsZ0JBQWdCLEVBQUUsQ0FBQztZQUVuQixHQUFHLEVBQUU7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7Z0JBQ2xCLEtBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFDLENBQUM7U0FDSixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNsQixFQUFFLEVBQUUsbUJBQW1CO1lBQ3ZCLEtBQUssRUFBRSxjQUFjO1lBQ3JCLFdBQVcsRUFBRTtnQkFDVCxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRzthQUN2RTtZQUNELFlBQVksRUFBRSxJQUFJO1lBQ2xCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsa0JBQWtCLEVBQUUsWUFBWTtZQUNoQyxnQkFBZ0IsRUFBRSxHQUFHO1lBRXJCLEdBQUcsRUFBRTtnQkFDRCxLQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hELE9BQU8sSUFBSSxDQUFDO1lBQ2hCLENBQUM7U0FDSixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNsQixFQUFFLEVBQUUsbUJBQW1CO1lBQ3ZCLEtBQUssRUFBRSxjQUFjO1lBQ3JCLFdBQVcsRUFBRTtnQkFDVCxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRzthQUN2RTtZQUNELFlBQVksRUFBRSxJQUFJO1lBQ2xCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsa0JBQWtCLEVBQUUsWUFBWTtZQUNoQyxnQkFBZ0IsRUFBRSxHQUFHO1lBRXJCLEdBQUcsRUFBRTtnQkFDRCxLQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEQsQ0FBQztTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCx5Q0FBaUIsR0FBakIsVUFBa0IsU0FBNkI7UUFDM0MsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNwQixXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7U0FDL0M7YUFBTTtZQUNILFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQztTQUN0RDtRQUVELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQztZQUNwQyxJQUFJLFNBQVMsS0FBSyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3ZDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7YUFDckM7aUJBQU0sSUFBSSxTQUFTLEtBQUssa0JBQWtCLENBQUMsSUFBSSxFQUFFO2dCQUM5QyxPQUFPLENBQUMsQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO2FBQ3JDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDakIsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO2dCQUNmLElBQUksU0FBUyxLQUFLLGtCQUFrQixDQUFDLElBQUksRUFBRTtvQkFDdkMsT0FBTyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUM7aUJBQ3RDO3FCQUFNLElBQUksU0FBUyxLQUFLLGtCQUFrQixDQUFDLElBQUksRUFBRTtvQkFDOUMsT0FBTyxDQUFDLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUM7aUJBQ3RDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDOUM7SUFDTCxDQUFDO0lBQ0wsb0JBQUM7QUFBRCxDQUFDO0FBRUQsSUFBSyxrQkFHSjtBQUhELFdBQUssa0JBQWtCO0lBQ25CLDJEQUFJO0lBQ0osMkRBQUk7QUFDUixDQUFDLEVBSEksa0JBQWtCLEtBQWxCLGtCQUFrQixRQUd0QjtBQUVELElBQUssVUFHSjtBQUhELFdBQUssVUFBVTtJQUNYLCtDQUFNO0lBQ04saURBQU87QUFDWCxDQUFDLEVBSEksVUFBVSxLQUFWLFVBQVUsUUFHZDtBQUVELElBQUssbUJBSUo7QUFKRCxXQUFLLG1CQUFtQjtJQUNwQiwrREFBSztJQUNMLGlFQUFNO0lBQ04saUVBQU07QUFDVixDQUFDLEVBSkksbUJBQW1CLEtBQW5CLG1CQUFtQixRQUl2QiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiaW50ZXJmYWNlIE1vbmFjb1dpbmRvdyB7XHJcbiAgICBtb25hY286IGFueTtcclxufVxyXG5cclxuY29uc3QgbW9uYWNvV2luZG93ID0gKHdpbmRvdyBhcyBhbnkpIGFzIE1vbmFjb1dpbmRvdztcclxuXHJcbmV4cG9ydCBjbGFzcyBSZXZpZXdDb21tZW50IHtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBhdXRob3I6IHN0cmluZztcclxuICAgIGR0OiBEYXRlO1xyXG4gICAgbGluZU51bWJlcjogbnVtYmVyO1xyXG4gICAgdGV4dDogc3RyaW5nO1xyXG4gICAgY29tbWVudHM6IFJldmlld0NvbW1lbnRbXTtcclxuXHJcbiAgICBkZWxldGVkOiBib29sZWFuO1xyXG4gICAgdmlld1pvbmVJZDogbnVtYmVyO1xyXG4gICAgcmVuZGVyU3RhdHVzOiBSZXZpZXdDb21tZW50U3RhdHVzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGxpbmVOdW1iZXI6IG51bWJlciwgYXV0aG9yOiBzdHJpbmcsIGR0OiBEYXRlLCB0ZXh0OiBzdHJpbmcsIGNvbW1lbnRzPzogUmV2aWV3Q29tbWVudFtdKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMuYXV0aG9yID0gYXV0aG9yO1xyXG4gICAgICAgIHRoaXMuZHQgPSBkdDtcclxuICAgICAgICB0aGlzLmxpbmVOdW1iZXIgPSBsaW5lTnVtYmVyO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy5jb21tZW50cyA9IGNvbW1lbnRzIHx8IFtdO1xyXG5cclxuICAgICAgICAvL0hBQ0sgLSB0aGlzIGlzIHJ1bnRpbWUgc3RhdGUgLSBhbmQgc2hvdWxkIGJlIG1vdmVkXHJcbiAgICAgICAgdGhpcy5kZWxldGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJTdGF0dXMgPSBSZXZpZXdDb21tZW50U3RhdHVzLm5vcm1hbDtcclxuICAgICAgICB0aGlzLnZpZXdab25lSWQgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmV2aWV3TWFuYWdlcihlZGl0b3I6IGFueSwgY3VycmVudFVzZXI6IHN0cmluZywgY29tbWVudHM/OiBSZXZpZXdDb21tZW50W10sIG9uQ2hhbmdlPzogT25Db21tZW50c0NoYW5nZWQpIHtcclxuICAgIGNvbnN0IHJtID0gbmV3IFJldmlld01hbmFnZXIoZWRpdG9yLCBjdXJyZW50VXNlciwgb25DaGFuZ2UpO1xyXG4gICAgcm0ubG9hZChjb21tZW50cyB8fCBbXSk7XHJcbiAgICByZXR1cm4gcm07XHJcbn1cclxuXHJcblxyXG5pbnRlcmZhY2UgUmV2aWV3Q29tbWVudEl0ZXJJdGVtIHtcclxuICAgIGRlcHRoOiBudW1iZXI7XHJcbiAgICBjb21tZW50OiBSZXZpZXdDb21tZW50LFxyXG4gICAgY291bnQ6IG51bWJlclxyXG59XHJcblxyXG5pbnRlcmZhY2UgT25Db21tZW50c0NoYW5nZWQge1xyXG4gICAgKGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W10pOiB2b2lkXHJcbn1cclxuXHJcbmludGVyZmFjZSBSZXZpZXdNYW5hZ2VyQ29uZmlnIHtcclxuICAgIGVkaXRCdXR0b25FbmFibGVSZW1vdmU6IGJvb2xlYW47XHJcbiAgICBsaW5lSGVpZ2h0OiBudW1iZXI7XHJcbiAgICBjb21tZW50SW5kZW50OiBudW1iZXI7XHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0OiBudW1iZXI7XHJcbiAgICBlZGl0QnV0dG9uQWRkVGV4dDogc3RyaW5nO1xyXG4gICAgZWRpdEJ1dHRvblJlbW92ZVRleHQ6IHN0cmluZztcclxuICAgIGVkaXRCdXR0b25PZmZzZXQ6IHN0cmluZztcclxuICAgIHJldmlld0NvbW1lbnRJY29uU2VsZWN0OnN0cmluZztcclxuICAgIHJldmlld0NvbW1lbnRJY29uQWN0aXZlOnN0cmluZztcclxufVxyXG5cclxuY29uc3QgZGVmYXVsdFJldmlld01hbmFnZXJDb25maWc6IFJldmlld01hbmFnZXJDb25maWcgPSB7XHJcbiAgICBlZGl0QnV0dG9uT2Zmc2V0OiAnLTc1cHgnLFxyXG4gICAgZWRpdEJ1dHRvbkFkZFRleHQ6ICdSZXBseScsXHJcbiAgICBlZGl0QnV0dG9uUmVtb3ZlVGV4dDogJ1JlbW92ZScsXHJcbiAgICBlZGl0QnV0dG9uRW5hYmxlUmVtb3ZlOiB0cnVlLFxyXG4gICAgbGluZUhlaWdodDogMTksXHJcbiAgICBjb21tZW50SW5kZW50OiAyMCxcclxuICAgIGNvbW1lbnRJbmRlbnRPZmZzZXQ6IDAsXHJcbiAgICByZXZpZXdDb21tZW50SWNvblNlbGVjdCA6ICctLS0nLFxyXG4gICAgcmV2aWV3Q29tbWVudEljb25BY3RpdmUgOiAnPj4nXHJcbn07XHJcblxyXG5cclxuY2xhc3MgUmV2aWV3TWFuYWdlciB7XHJcbiAgICBjdXJyZW50VXNlcjogc3RyaW5nO1xyXG4gICAgZWRpdG9yOiBhbnk7XHJcbiAgICBjb21tZW50czogUmV2aWV3Q29tbWVudFtdO1xyXG4gICAgYWN0aXZlQ29tbWVudD86IFJldmlld0NvbW1lbnQ7XHJcbiAgICB3aWRnZXRJbmxpbmVUb29sYmFyOiBhbnk7XHJcbiAgICB3aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yOiBhbnk7XHJcbiAgICBvbkNoYW5nZTogT25Db21tZW50c0NoYW5nZWQ7XHJcbiAgICBlZGl0b3JNb2RlOiBFZGl0b3JNb2RlO1xyXG4gICAgY29uZmlnOiBSZXZpZXdNYW5hZ2VyQ29uZmlnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVkaXRvcjogYW55LCBjdXJyZW50VXNlcjogc3RyaW5nLCBvbkNoYW5nZTogT25Db21tZW50c0NoYW5nZWQpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gY3VycmVudFVzZXI7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVDb21tZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbW1lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyID0gbnVsbDtcclxuICAgICAgICB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcclxuICAgICAgICB0aGlzLmVkaXRvck1vZGUgPSBFZGl0b3JNb2RlLnRvb2xiYXI7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBkZWZhdWx0UmV2aWV3TWFuYWdlckNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5hZGRBY3Rpb25zKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVJbmxpbmVUb29sYmFyV2lkZ2V0KCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVJbmxpbmVFZGl0b3JXaWRnZXQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3Iub25Nb3VzZURvd24odGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZChjb21tZW50czogUmV2aWV3Q29tbWVudFtdKSB7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuY2hhbmdlVmlld1pvbmVzKChjaGFuZ2VBY2Nlc3NvcikgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQWNjZXNzb3IucmVtb3ZlWm9uZShpdGVtLmNvbW1lbnQudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFNob3VsZCB0aGlzIGJlIGluc2lkZSB0aGlzIGNhbGxiYWNrP1xyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRzID0gY29tbWVudHM7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJbmxpbmVFZGl0QnV0dG9uc0VsZW1lbnQoKSB7XHJcbiAgICAgICAgdmFyIHJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgcm9vdC5jbGFzc05hbWUgPSAnZWRpdEJ1dHRvbnNDb250YWluZXInXHJcblxyXG4gICAgICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICBhZGQuaHJlZiA9ICcjJ1xyXG4gICAgICAgIGFkZC5pbm5lclRleHQgPSB0aGlzLmNvbmZpZy5lZGl0QnV0dG9uQWRkVGV4dDtcclxuICAgICAgICBhZGQubmFtZSA9ICdhZGQnO1xyXG4gICAgICAgIGFkZC5jbGFzc05hbWUgPSAnZWRpdEJ1dHRvbkFkZCdcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGFkZCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5lZGl0QnV0dG9uRW5hYmxlUmVtb3ZlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgcmVtb3ZlLmhyZWYgPSAnIydcclxuICAgICAgICAgICAgcmVtb3ZlLmlubmVyVGV4dCA9IHRoaXMuY29uZmlnLmVkaXRCdXR0b25SZW1vdmVUZXh0O1xyXG4gICAgICAgICAgICByZW1vdmUubmFtZSA9ICdyZW1vdmUnO1xyXG4gICAgICAgICAgICByZW1vdmUuY2xhc3NOYW1lID0gJ2VkaXRCdXR0b25SZW1vdmUnXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVtb3ZlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvb3Quc3R5bGUubWFyZ2luTGVmdCA9IHRoaXMuY29uZmlnLmVkaXRCdXR0b25PZmZzZXQ7XHJcbiAgICAgICAgcmV0dXJuIHJvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5saW5lRWRpdG9yRWxlbWVudCgpIHtcclxuICAgICAgICB2YXIgcm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICByb290LmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudEVkaXRcIlxyXG5cclxuICAgICAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcbiAgICAgICAgdGV4dGFyZWEuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50VGV4dFwiO1xyXG4gICAgICAgIHRleHRhcmVhLmlubmVyVGV4dCA9ICcnO1xyXG4gICAgICAgIHRleHRhcmVhLm5hbWUgPSAndGV4dCc7XHJcbiAgICAgICAgdGV4dGFyZWEub25rZXlwcmVzcyA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IFwiRW50ZXJcIiAmJiBlLmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS50b29sYmFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29tbWVudChyLmxpbmVOdW1iZXIsIHIudGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBzYXZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgc2F2ZS5jbGFzc05hbWUgPSBcInJldmlld0NvbW1lbnRTYXZlXCI7XHJcbiAgICAgICAgc2F2ZS5pbm5lclRleHQgPSAnU2F2ZSc7XHJcbiAgICAgICAgc2F2ZS5uYW1lID0gJ3NhdmUnO1xyXG5cclxuICAgICAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBjYW5jZWwuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50Q2FuY2VsXCI7XHJcbiAgICAgICAgY2FuY2VsLmlubmVyVGV4dCA9ICdDYW5jZWwnO1xyXG4gICAgICAgIGNhbmNlbC5uYW1lID0gJ2NhbmNlbCc7XHJcblxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQodGV4dGFyZWEpO1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoc2F2ZSk7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjYW5jZWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gcm9vdFxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZVRvb2xiYXJXaWRnZXQoKSB7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uc0VsZW1lbnQgPSB0aGlzLmNyZWF0ZUlubGluZUVkaXRCdXR0b25zRWxlbWVudCgpO1xyXG5cclxuICAgICAgICB0aGlzLndpZGdldElubGluZVRvb2xiYXIgPSB7XHJcbiAgICAgICAgICAgIGFsbG93RWRpdG9yT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgICAgIGdldElkOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3dpZGdldElubGluZVRvb2xiYXInO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREb21Ob2RlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYnV0dG9uc0VsZW1lbnQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ICYmIHRoaXMuZWRpdG9yTW9kZSA9PSBFZGl0b3JNb2RlLnRvb2xiYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZlcmVuY2U6IFttb25hY29XaW5kb3cubW9uYWNvLmVkaXRvci5Db250ZW50V2lkZ2V0UG9zaXRpb25QcmVmZXJlbmNlLkJFTE9XXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVUb29sYmFyKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJbmxpbmVFZGl0b3JXaWRnZXQoKSB7XHJcbiAgICAgICAgY29uc3QgZWRpdG9yRWxlbWVudCA9IHRoaXMuY3JlYXRlSW5saW5lRWRpdG9yRWxlbWVudCgpO1xyXG4gICAgICAgIHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvciA9IHtcclxuICAgICAgICAgICAgYWxsb3dFZGl0b3JPdmVyZmxvdzogdHJ1ZSxcclxuICAgICAgICAgICAgZ2V0SWQ6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnd2lkZ2V0SW5saW5lRWRpdG9yJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0RG9tTm9kZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVkaXRvckVsZW1lbnQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lZGl0b3JNb2RlID09IEVkaXRvck1vZGUuZWRpdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGFyZSB1c2luZyBuZWdhdGl2ZSBtYXJnaW5Ub3AgdG8gc2hpZnQgaXQgYWJvdmUgdGhlIGxpbmUgdG8gdGhlIHByZXZpb3VzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiB0aGlzLmFjdGl2ZUNvbW1lbnQgPyB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciArIDEgOiB0aGlzLmVkaXRvci5nZXRQb3NpdGlvbigpLmxpbmVOdW1iZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZmVyZW5jZTogW21vbmFjb1dpbmRvdy5tb25hY28uZWRpdG9yLkNvbnRlbnRXaWRnZXRQb3NpdGlvblByZWZlcmVuY2UuQkVMT1ddXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQ29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEFjdGl2ZUNvbW1lbnQoY29tbWVudDogUmV2aWV3Q29tbWVudCkge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3NldEFjdGl2ZUNvbW1lbnQnLCBjb21tZW50KTtcclxuXHJcbiAgICAgICAgY29uc3QgbGluZU51bWJlcnNUb01ha2VEaXJ0eSA9IFtdO1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQgJiYgKCFjb21tZW50IHx8IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyICE9PSBjb21tZW50LmxpbmVOdW1iZXIpKSB7XHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzVG9NYWtlRGlydHkucHVzaCh0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjb21tZW50KSB7XHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzVG9NYWtlRGlydHkucHVzaChjb21tZW50LmxpbmVOdW1iZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hY3RpdmVDb21tZW50ID0gY29tbWVudDtcclxuICAgICAgICBpZiAobGluZU51bWJlcnNUb01ha2VEaXJ0eS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyQW5kTWFwQ29tbWVudHMobGluZU51bWJlcnNUb01ha2VEaXJ0eSwgKGNvbW1lbnQpID0+IHsgY29tbWVudC5yZW5kZXJTdGF0dXMgPSBSZXZpZXdDb21tZW50U3RhdHVzLmRpcnR5IH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKTtcclxuICAgICAgICB0aGlzLmVkaXRvci5sYXlvdXRDb250ZW50V2lkZ2V0KHRoaXMud2lkZ2V0SW5saW5lVG9vbGJhcik7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyQW5kTWFwQ29tbWVudHMobGluZU51bWJlcnM6IG51bWJlcltdLCBmbjogeyAoY29tbWVudDogUmV2aWV3Q29tbWVudCk6IHZvaWQgfSkge1xyXG4gICAgICAgIGNvbnN0IGNvbW1lbnRzID0gdGhpcy5pdGVyYXRlQ29tbWVudHMoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY29tbWVudHMpIHtcclxuICAgICAgICAgICAgaWYgKGxpbmVOdW1iZXJzLmluZGV4T2YoYy5jb21tZW50LmxpbmVOdW1iZXIpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIGZuKGMuY29tbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlTW91c2VEb3duKGV2OiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKCdoYW5kbGVNb3VzZURvd24nLCB0aGlzLmFjdGl2ZUNvbW1lbnQsIGV2LnRhcmdldC5lbGVtZW50LCBldi50YXJnZXQuZGV0YWlsKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoZXYudGFyZ2V0LmVsZW1lbnQudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJykge1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKGV2LnRhcmdldC5lbGVtZW50LnRhZ05hbWUgPT09ICdCVVRUT04nIHx8IGV2LnRhcmdldC5lbGVtZW50LnRhZ05hbWUgPT09ICdBJykge1xyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmVsZW1lbnQubmFtZSA9PT0gJ2FkZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLmVkaXRvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXYudGFyZ2V0LmVsZW1lbnQubmFtZSA9PT0gJ3JlbW92ZScgJiYgdGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNvbW1lbnQodGhpcy5hY3RpdmVDb21tZW50KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ29tbWVudChudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldi50YXJnZXQuZWxlbWVudC5uYW1lID09PSAnc2F2ZScpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS50b29sYmFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29tbWVudChyLmxpbmVOdW1iZXIsIHIudGV4dCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXYudGFyZ2V0LmVsZW1lbnQubmFtZSA9PT0gJ2NhbmNlbCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLnRvb2xiYXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgYWN0aXZlQ29tbWVudDogUmV2aWV3Q29tbWVudCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmRldGFpbCAmJiBldi50YXJnZXQuZGV0YWlsLnZpZXdab25lSWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LnZpZXdab25lSWQgPT0gZXYudGFyZ2V0LmRldGFpbC52aWV3Wm9uZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNvbW1lbnQgPSBpdGVtLmNvbW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNvbW1lbnQoYWN0aXZlQ29tbWVudCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5lZGl0b3JNb2RlID09PSBFZGl0b3JNb2RlLmVkaXRvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUudG9vbGJhcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRFZGl0b3JNb2RlKG1vZGU6IEVkaXRvck1vZGUpOiB7IGxpbmVOdW1iZXI6IG51bWJlciwgdGV4dDogc3RyaW5nIH0ge1xyXG4gICAgICAgIGNvbnN0IGxpbmVOdW1iZXIgPSB0aGlzLmFjdGl2ZUNvbW1lbnQgPyB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciA6IHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlcjtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKCdzZXRFZGl0b3JNb2RlJywgdGhpcy5hY3RpdmVDb21tZW50LCBsaW5lTnVtYmVyLCB0aGlzLmVkaXRvci5nZXRQb3NpdGlvbigpLmxpbmVOdW1iZXIpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yTW9kZSA9IG1vZGU7XHJcblxyXG4gICAgICAgIGxldCBpZHggPSAwO1xyXG4gICAgICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICAgICAgbGV0IG1hcmdpblRvcDogbnVtYmVyID0gMDtcclxuICAgICAgICBjb25zdCBsaW5lSGVpZ2h0ID0gdGhpcy5jb25maWcubGluZUhlaWdodDsvL0ZJWE1FIC0gTWFnaWMgbnVtYmVyIGZvciBsaW5lIGhlaWdodCAgICAgICAgICAgIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudC5saW5lTnVtYmVyID09IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50ID09IHRoaXMuYWN0aXZlQ29tbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkeCA9IGNvdW50ICsgMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYXJnaW5Ub3AgPSAoKCsrY291bnQgLSBpZHgpICogbGluZUhlaWdodCkgLSAyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IG5vZGUgPSB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IuZ2V0RG9tTm9kZSgpIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgIG5vZGUuc3R5bGUubWFyZ2luVG9wID0gYC0ke21hcmdpblRvcH1weGA7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVUb29sYmFyKTtcclxuICAgICAgICB0aGlzLmVkaXRvci5sYXlvdXRDb250ZW50V2lkZ2V0KHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvcik7XHJcblxyXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IuZ2V0RG9tTm9kZSgpO1xyXG4gICAgICAgIGNvbnN0IHRleHRhcmVhID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiVEVYVEFSRUFbbmFtZT0ndGV4dCddXCIpO1xyXG5cclxuICAgICAgICBpZiAobW9kZSA9PSBFZGl0b3JNb2RlLmVkaXRvcikge1xyXG4gICAgICAgICAgICB0ZXh0YXJlYS52YWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAvL0hBQ0sgLSBiZWNhdXNlIHRoZSBldmVudCBpbiBtb25hY28gZG9lc24ndCBoYXZlIHByZXZlbnRkZWZhdWx0IHdoaWNoIG1lYW5zIGVkaXRvciB0YWtlcyBmb2N1cyBiYWNrLi4uICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGV4dGFyZWEuZm9jdXMoKSwgMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRleHQ6IHRleHRhcmVhLnZhbHVlLFxyXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBuZXh0Q29tbWVudElkKCkge1xyXG4gICAgICAgIHJldHVybiBgJHtuZXcgRGF0ZSgpLnRvU3RyaW5nKCl9LSR7dGhpcy5jdXJyZW50VXNlcn1gO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENvbW1lbnQobGluZU51bWJlcjogbnVtYmVyLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSBuZXcgUmV2aWV3Q29tbWVudCh0aGlzLm5leHRDb21tZW50SWQoKSwgdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIsIHRoaXMuY3VycmVudFVzZXIsIG5ldyBEYXRlKCksIHRleHQpXHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudC5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJBbmRNYXBDb21tZW50cyhbbGluZU51bWJlcl0sIChjb21tZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb21tZW50LnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMuZGlydHk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSBuZXcgUmV2aWV3Q29tbWVudCh0aGlzLm5leHRDb21tZW50SWQoKSwgbGluZU51bWJlciwgdGhpcy5jdXJyZW50VXNlciwgbmV3IERhdGUoKSwgdGV4dClcclxuICAgICAgICAgICAgdGhpcy5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKVxyXG5cclxuICAgICAgICBpZiAodGhpcy5vbkNoYW5nZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuY29tbWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpdGVyYXRlQ29tbWVudHMoY29tbWVudHM/OiBSZXZpZXdDb21tZW50W10sIGRlcHRoPzogbnVtYmVyLCBjb3VudEJ5TGluZU51bWJlcj86IGFueSwgcmVzdWx0cz86IFJldmlld0NvbW1lbnRJdGVySXRlbVtdKSB7XHJcbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XHJcbiAgICAgICAgZGVwdGggPSBkZXB0aCB8fCAwO1xyXG4gICAgICAgIGNvbW1lbnRzID0gY29tbWVudHMgfHwgdGhpcy5jb21tZW50cztcclxuICAgICAgICBjb3VudEJ5TGluZU51bWJlciA9IGNvdW50QnlMaW5lTnVtYmVyIHx8IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGNvbW1lbnQgb2YgY29tbWVudHMpIHtcclxuICAgICAgICAgICAgY291bnRCeUxpbmVOdW1iZXJbY29tbWVudC5saW5lTnVtYmVyXSA9IChjb3VudEJ5TGluZU51bWJlcltjb21tZW50LmxpbmVOdW1iZXJdIHx8IDApICsgMVxyXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goeyBkZXB0aCwgY29tbWVudCwgY291bnQ6IGNvdW50QnlMaW5lTnVtYmVyW2NvbW1lbnQubGluZU51bWJlcl0gfSlcclxuICAgICAgICAgICAgdGhpcy5pdGVyYXRlQ29tbWVudHMoY29tbWVudC5jb21tZW50cywgZGVwdGggKyAxLCBjb3VudEJ5TGluZU51bWJlciwgcmVzdWx0cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVDb21tZW50KGNvbW1lbnQ6IFJldmlld0NvbW1lbnQpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoW2NvbW1lbnRdKSkge1xyXG4gICAgICAgICAgICBpdGVtLmNvbW1lbnQuZGVsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMub25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLmNvbW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVmcmVzaENvbW1lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmNoYW5nZVZpZXdab25lcygoY2hhbmdlQWNjZXNzb3IpID0+IHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKHRoaXMuY29tbWVudHMsIDApKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LmRlbGV0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdEZWxldGUnLCBpdGVtLmNvbW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LnJlbmRlclN0YXR1cyA9PT0gUmV2aWV3Q29tbWVudFN0YXR1cy5oaWRkZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdIaWRkZW4nLCBpdGVtLmNvbW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbW1lbnQudmlld1pvbmVJZCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQucmVuZGVyU3RhdHVzID09PSBSZXZpZXdDb21tZW50U3RhdHVzLmRpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnRGlydHknLCBpdGVtLmNvbW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbW1lbnQudmlld1pvbmVJZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21tZW50LnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMubm9ybWFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghaXRlbS5jb21tZW50LnZpZXdab25lSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdDcmVhdGUnLCBpdGVtLmNvbW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb21Ob2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSB0aGlzLmFjdGl2ZUNvbW1lbnQgPT0gaXRlbS5jb21tZW50O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnN0eWxlLm1hcmdpbkxlZnQgPSAodGhpcy5jb25maWcuY29tbWVudEluZGVudCAqIChpdGVtLmRlcHRoICsgMSkpICsgdGhpcy5jb25maWcuY29tbWVudEluZGVudE9mZnNldCArIFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5jbGFzc05hbWUgPSBpc0FjdGl2ZSA/ICdyZXZpZXdDb21tZW50LWFjdGl2ZScgOiAncmV2aWV3Q29tbWVudC1pbmFjdGl2ZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuY2xhc3NOYW1lID0gaXNBY3RpdmUgPyAncmV2aWV3Q29tbWVudC1zZWxlY3Rpb24tYWN0aXZlJyA6ICdyZXZpZXdDb21tZW50LXNlbGVjdGlvbi1pbmFjdGl2ZSdcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuaW5uZXJUZXh0ID0gaXNBY3RpdmUgPyB0aGlzLmNvbmZpZy5yZXZpZXdDb21tZW50SWNvbkFjdGl2ZSA6IHRoaXMuY29uZmlnLnJldmlld0NvbW1lbnRJY29uU2VsZWN0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdXRob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yLmNsYXNzTmFtZSA9ICdyZXZpZXdDb21tZW50LWF1dGhvcidcclxuICAgICAgICAgICAgICAgICAgICBhdXRob3IuaW5uZXJUZXh0ID0gaXRlbS5jb21tZW50LmF1dGhvciB8fCAnICc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGR0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGR0LmNsYXNzTmFtZSA9ICdyZXZpZXdDb21tZW50LWR0J1xyXG4gICAgICAgICAgICAgICAgICAgIGR0LmlubmVyVGV4dCA9IGl0ZW0uY29tbWVudC5kdC50b0xvY2FsZVN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQuY2xhc3NOYW1lID0gJ3Jldmlld0NvbW1lbnQtdGV4dCdcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LmlubmVyVGV4dCA9IGl0ZW0uY29tbWVudC50ZXh0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmFwcGVuZENoaWxkKHN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChkdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChhdXRob3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQodGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkID0gY2hhbmdlQWNjZXNzb3IuYWRkWm9uZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyTGluZU51bWJlcjogaXRlbS5jb21tZW50LmxpbmVOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodEluTGluZXM6IDEsIC8vVE9ETyAtIEZpZ3VyZSBvdXQgaWYgbXVsdGktbGluZT9cclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZTogZG9tTm9kZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQWN0aW9ucygpIHtcclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRBY3Rpb24oe1xyXG4gICAgICAgICAgICBpZDogJ215LXVuaXF1ZS1pZC1hZGQnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ0FkZCBDb21tZW50JyxcclxuICAgICAgICAgICAga2V5YmluZGluZ3M6IFtcclxuICAgICAgICAgICAgICAgIG1vbmFjb1dpbmRvdy5tb25hY28uS2V5TW9kLkN0cmxDbWQgfCBtb25hY29XaW5kb3cubW9uYWNvLktleUNvZGUuRjEwLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwcmVjb25kaXRpb246IG51bGwsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdDb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudUdyb3VwSWQ6ICduYXZpZ2F0aW9uJyxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVPcmRlcjogMCxcclxuXHJcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3J1bicpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS5lZGl0b3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZEFjdGlvbih7XHJcbiAgICAgICAgICAgIGlkOiAnbXktdW5pcXVlLWlkLW5leHQnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ05leHQgQ29tbWVudCcsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdzOiBbXHJcbiAgICAgICAgICAgICAgICBtb25hY29XaW5kb3cubW9uYWNvLktleU1vZC5DdHJsQ21kIHwgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlDb2RlLkYxMixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcHJlY29uZGl0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nQ29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVHcm91cElkOiAnbmF2aWdhdGlvbicsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51T3JkZXI6IDAuMSxcclxuXHJcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ29tbWVudChOYXZpYXRpb25EaXJlY3Rpb24ubmV4dCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRBY3Rpb24oe1xyXG4gICAgICAgICAgICBpZDogJ215LXVuaXF1ZS1pZC1wcmV2JyxcclxuICAgICAgICAgICAgbGFiZWw6ICdQcmV2IENvbW1lbnQnLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nczogW1xyXG4gICAgICAgICAgICAgICAgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlNb2QuQ3RybENtZCB8IG1vbmFjb1dpbmRvdy5tb25hY28uS2V5Q29kZS5GMTEsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHByZWNvbmRpdGlvbjogbnVsbCxcclxuICAgICAgICAgICAga2V5YmluZGluZ0NvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51R3JvdXBJZDogJ25hdmlnYXRpb24nLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudU9yZGVyOiAwLjEsXHJcblxyXG4gICAgICAgICAgICBydW46ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUb0NvbW1lbnQoTmF2aWF0aW9uRGlyZWN0aW9uLnByZXYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmF2aWdhdGVUb0NvbW1lbnQoZGlyZWN0aW9uOiBOYXZpYXRpb25EaXJlY3Rpb24pIHtcclxuICAgICAgICBsZXQgY3VycmVudExpbmUgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgY3VycmVudExpbmUgPSB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdXJyZW50TGluZSA9IHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbW1lbnRzID0gdGhpcy5jb21tZW50cy5maWx0ZXIoKGMpID0+IHtcclxuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWF0aW9uRGlyZWN0aW9uLm5leHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjLmxpbmVOdW1iZXIgPiBjdXJyZW50TGluZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IE5hdmlhdGlvbkRpcmVjdGlvbi5wcmV2KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYy5saW5lTnVtYmVyIDwgY3VycmVudExpbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGNvbW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb21tZW50cy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBOYXZpYXRpb25EaXJlY3Rpb24ubmV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLmxpbmVOdW1iZXIgLSBiLmxpbmVOdW1iZXI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWF0aW9uRGlyZWN0aW9uLnByZXYpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYi5saW5lTnVtYmVyIC0gYS5saW5lTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSBjb21tZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDb21tZW50KGNvbW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLnJldmVhbExpbmUoY29tbWVudC5saW5lTnVtYmVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmVudW0gTmF2aWF0aW9uRGlyZWN0aW9uIHtcclxuICAgIG5leHQsXHJcbiAgICBwcmV2XHJcbn1cclxuXHJcbmVudW0gRWRpdG9yTW9kZSB7XHJcbiAgICBlZGl0b3IsXHJcbiAgICB0b29sYmFyXHJcbn1cclxuXHJcbmVudW0gUmV2aWV3Q29tbWVudFN0YXR1cyB7XHJcbiAgICBkaXJ0eSxcclxuICAgIGhpZGRlbixcclxuICAgIG5vcm1hbFxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ==