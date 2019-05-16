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
var ReviewCommentIconSelect = '---';
var ReviewCommentIconActive = '>>';
var defaultReviewManagerConfig = {
    editButtonOffset: '-75px',
    editButtonAddText: 'Reply',
    editButtonRemoveText: 'Remove',
    editButtonEnableRemove: true,
    lineHeight: 19,
    commentIndent: 20,
    commentIndentOffset: 0
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
                    status_1.innerText = isActive ? ReviewCommentIconActive : ReviewCommentIconSelect;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01vbmFjb0VkaXRvckNvZGVSZXZpZXcvLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzlFQSxJQUFNLFlBQVksR0FBSSxNQUE4QixDQUFDO0FBRXJEO0lBWUksdUJBQVksRUFBVSxFQUFFLFVBQWtCLEVBQUUsTUFBYyxFQUFFLEVBQVEsRUFBRSxJQUFZLEVBQUUsUUFBMEI7UUFDMUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElB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O0FBSkQsV0FBSyxtQkFBbUI7SUFDcEIsK0RBQUs7SUFDTCxpRUFBTTtJQUNOLGlFQUFNO0FBQ1YsQ0FBQyxFQUpJLG1CQUFtQixLQUFuQixtQkFBbUIsUUFJdkIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImludGVyZmFjZSBNb25hY29XaW5kb3cge1xyXG4gICAgbW9uYWNvOiBhbnk7XHJcbn1cclxuXHJcbmNvbnN0IG1vbmFjb1dpbmRvdyA9ICh3aW5kb3cgYXMgYW55KSBhcyBNb25hY29XaW5kb3c7XHJcblxyXG5leHBvcnQgY2xhc3MgUmV2aWV3Q29tbWVudCB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgYXV0aG9yOiBzdHJpbmc7XHJcbiAgICBkdDogRGF0ZTtcclxuICAgIGxpbmVOdW1iZXI6IG51bWJlcjtcclxuICAgIHRleHQ6IHN0cmluZztcclxuICAgIGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W107XHJcblxyXG4gICAgZGVsZXRlZDogYm9vbGVhbjtcclxuICAgIHZpZXdab25lSWQ6IG51bWJlcjtcclxuICAgIHJlbmRlclN0YXR1czogUmV2aWV3Q29tbWVudFN0YXR1cztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBsaW5lTnVtYmVyOiBudW1iZXIsIGF1dGhvcjogc3RyaW5nLCBkdDogRGF0ZSwgdGV4dDogc3RyaW5nLCBjb21tZW50cz86IFJldmlld0NvbW1lbnRbXSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmF1dGhvciA9IGF1dGhvcjtcclxuICAgICAgICB0aGlzLmR0ID0gZHQ7XHJcbiAgICAgICAgdGhpcy5saW5lTnVtYmVyID0gbGluZU51bWJlcjtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMuY29tbWVudHMgPSBjb21tZW50cyB8fCBbXTtcclxuXHJcbiAgICAgICAgLy9IQUNLIC0gdGhpcyBpcyBydW50aW1lIHN0YXRlIC0gYW5kIHNob3VsZCBiZSBtb3ZlZFxyXG4gICAgICAgIHRoaXMuZGVsZXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5ub3JtYWw7XHJcbiAgICAgICAgdGhpcy52aWV3Wm9uZUlkID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJldmlld01hbmFnZXIoZWRpdG9yOiBhbnksIGN1cnJlbnRVc2VyOiBzdHJpbmcsIGNvbW1lbnRzPzogUmV2aWV3Q29tbWVudFtdLCBvbkNoYW5nZT86IE9uQ29tbWVudHNDaGFuZ2VkKSB7XHJcbiAgICBjb25zdCBybSA9IG5ldyBSZXZpZXdNYW5hZ2VyKGVkaXRvciwgY3VycmVudFVzZXIsIG9uQ2hhbmdlKTtcclxuICAgIHJtLmxvYWQoY29tbWVudHMgfHwgW10pO1xyXG4gICAgcmV0dXJuIHJtO1xyXG59XHJcblxyXG5jb25zdCBSZXZpZXdDb21tZW50SWNvblNlbGVjdCA9ICctLS0nO1xyXG5jb25zdCBSZXZpZXdDb21tZW50SWNvbkFjdGl2ZSA9ICc+Pic7XHJcblxyXG5cclxuaW50ZXJmYWNlIFJldmlld0NvbW1lbnRJdGVySXRlbSB7XHJcbiAgICBkZXB0aDogbnVtYmVyO1xyXG4gICAgY29tbWVudDogUmV2aWV3Q29tbWVudCxcclxuICAgIGNvdW50OiBudW1iZXJcclxufVxyXG5cclxuaW50ZXJmYWNlIE9uQ29tbWVudHNDaGFuZ2VkIHtcclxuICAgIChjb21tZW50czogUmV2aWV3Q29tbWVudFtdKTogdm9pZFxyXG59XHJcblxyXG5pbnRlcmZhY2UgUmV2aWV3TWFuYWdlckNvbmZpZyB7XHJcbiAgICBlZGl0QnV0dG9uRW5hYmxlUmVtb3ZlOiBib29sZWFuO1xyXG4gICAgbGluZUhlaWdodDogbnVtYmVyO1xyXG4gICAgY29tbWVudEluZGVudDogbnVtYmVyO1xyXG4gICAgY29tbWVudEluZGVudE9mZnNldDogbnVtYmVyO1xyXG4gICAgZWRpdEJ1dHRvbkFkZFRleHQ6IHN0cmluZztcclxuICAgIGVkaXRCdXR0b25SZW1vdmVUZXh0OiBzdHJpbmc7XHJcbiAgICBlZGl0QnV0dG9uT2Zmc2V0OiBzdHJpbmc7XHJcbn1cclxuXHJcbmNvbnN0IGRlZmF1bHRSZXZpZXdNYW5hZ2VyQ29uZmlnOiBSZXZpZXdNYW5hZ2VyQ29uZmlnID0ge1xyXG4gICAgZWRpdEJ1dHRvbk9mZnNldDogJy03NXB4JyxcclxuICAgIGVkaXRCdXR0b25BZGRUZXh0OiAnUmVwbHknLFxyXG4gICAgZWRpdEJ1dHRvblJlbW92ZVRleHQ6ICdSZW1vdmUnLFxyXG4gICAgZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZTogdHJ1ZSxcclxuICAgIGxpbmVIZWlnaHQ6IDE5LFxyXG4gICAgY29tbWVudEluZGVudDogMjAsXHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0OiAwXHJcbn07XHJcblxyXG5cclxuY2xhc3MgUmV2aWV3TWFuYWdlciB7XHJcbiAgICBjdXJyZW50VXNlcjogc3RyaW5nO1xyXG4gICAgZWRpdG9yOiBhbnk7XHJcbiAgICBjb21tZW50czogUmV2aWV3Q29tbWVudFtdO1xyXG4gICAgYWN0aXZlQ29tbWVudD86IFJldmlld0NvbW1lbnQ7XHJcbiAgICB3aWRnZXRJbmxpbmVUb29sYmFyOiBhbnk7XHJcbiAgICB3aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yOiBhbnk7XHJcbiAgICBvbkNoYW5nZTogT25Db21tZW50c0NoYW5nZWQ7XHJcbiAgICBlZGl0b3JNb2RlOiBFZGl0b3JNb2RlO1xyXG4gICAgY29uZmlnOiBSZXZpZXdNYW5hZ2VyQ29uZmlnO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVkaXRvcjogYW55LCBjdXJyZW50VXNlcjogc3RyaW5nLCBvbkNoYW5nZTogT25Db21tZW50c0NoYW5nZWQpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gY3VycmVudFVzZXI7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVDb21tZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbW1lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyID0gbnVsbDtcclxuICAgICAgICB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcclxuICAgICAgICB0aGlzLmVkaXRvck1vZGUgPSBFZGl0b3JNb2RlLnRvb2xiYXI7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSBkZWZhdWx0UmV2aWV3TWFuYWdlckNvbmZpZztcclxuXHJcbiAgICAgICAgdGhpcy5hZGRBY3Rpb25zKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVJbmxpbmVUb29sYmFyV2lkZ2V0KCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVJbmxpbmVFZGl0b3JXaWRnZXQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3Iub25Nb3VzZURvd24odGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZChjb21tZW50czogUmV2aWV3Q29tbWVudFtdKSB7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuY2hhbmdlVmlld1pvbmVzKChjaGFuZ2VBY2Nlc3NvcikgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQWNjZXNzb3IucmVtb3ZlWm9uZShpdGVtLmNvbW1lbnQudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFNob3VsZCB0aGlzIGJlIGluc2lkZSB0aGlzIGNhbGxiYWNrP1xyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRzID0gY29tbWVudHM7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJbmxpbmVFZGl0QnV0dG9uc0VsZW1lbnQoKSB7XHJcbiAgICAgICAgdmFyIHJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgcm9vdC5jbGFzc05hbWUgPSAnZWRpdEJ1dHRvbnNDb250YWluZXInXHJcblxyXG4gICAgICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICBhZGQuaHJlZiA9ICcjJ1xyXG4gICAgICAgIGFkZC5pbm5lclRleHQgPSB0aGlzLmNvbmZpZy5lZGl0QnV0dG9uQWRkVGV4dDtcclxuICAgICAgICBhZGQubmFtZSA9ICdhZGQnO1xyXG4gICAgICAgIGFkZC5jbGFzc05hbWUgPSAnZWRpdEJ1dHRvbkFkZCdcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGFkZCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5lZGl0QnV0dG9uRW5hYmxlUmVtb3ZlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgICAgcmVtb3ZlLmhyZWYgPSAnIydcclxuICAgICAgICAgICAgcmVtb3ZlLmlubmVyVGV4dCA9IHRoaXMuY29uZmlnLmVkaXRCdXR0b25SZW1vdmVUZXh0O1xyXG4gICAgICAgICAgICByZW1vdmUubmFtZSA9ICdyZW1vdmUnO1xyXG4gICAgICAgICAgICByZW1vdmUuY2xhc3NOYW1lID0gJ2VkaXRCdXR0b25SZW1vdmUnXHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVtb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcm9vdC5zdHlsZS5tYXJnaW5MZWZ0ID0gdGhpcy5jb25maWcuZWRpdEJ1dHRvbk9mZnNldDtcclxuICAgICAgICByZXR1cm4gcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJbmxpbmVFZGl0b3JFbGVtZW50KCkge1xyXG4gICAgICAgIHZhciByb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHJvb3QuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50RWRpdFwiXHJcblxyXG4gICAgICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcclxuICAgICAgICB0ZXh0YXJlYS5jbGFzc05hbWUgPSBcInJldmlld0NvbW1lbnRUZXh0XCI7XHJcbiAgICAgICAgdGV4dGFyZWEuaW5uZXJUZXh0ID0gJyc7XHJcbiAgICAgICAgdGV4dGFyZWEubmFtZSA9ICd0ZXh0JztcclxuICAgICAgICB0ZXh0YXJlYS5vbmtleXByZXNzID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFbnRlclwiICYmIGUuY3RybEtleSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgciA9IHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLnRvb2xiYXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDb21tZW50KHIubGluZU51bWJlciwgci50ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHNhdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBzYXZlLmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudFNhdmVcIjtcclxuICAgICAgICBzYXZlLmlubmVyVGV4dCA9ICdTYXZlJztcclxuICAgICAgICBzYXZlLm5hbWUgPSAnc2F2ZSc7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGNhbmNlbC5jbGFzc05hbWUgPSBcInJldmlld0NvbW1lbnRDYW5jZWxcIjtcclxuICAgICAgICBjYW5jZWwuaW5uZXJUZXh0ID0gJ0NhbmNlbCc7XHJcbiAgICAgICAgY2FuY2VsLm5hbWUgPSAnY2FuY2VsJztcclxuXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0ZXh0YXJlYSk7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChzYXZlKTtcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGNhbmNlbCk7XHJcblxyXG4gICAgICAgIHJldHVybiByb290XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5saW5lVG9vbGJhcldpZGdldCgpIHtcclxuICAgICAgICBjb25zdCBidXR0b25zRWxlbWVudCA9IHRoaXMuY3JlYXRlSW5saW5lRWRpdEJ1dHRvbnNFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkZ2V0SW5saW5lVG9vbGJhciA9IHtcclxuICAgICAgICAgICAgYWxsb3dFZGl0b3JPdmVyZmxvdzogdHJ1ZSxcclxuICAgICAgICAgICAgZ2V0SWQ6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnd2lkZ2V0SW5saW5lVG9vbGJhcic7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldERvbU5vZGU6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBidXR0b25zRWxlbWVudDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0UG9zaXRpb246ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQgJiYgdGhpcy5lZGl0b3JNb2RlID09IEVkaXRvck1vZGUudG9vbGJhcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZmVyZW5jZTogW21vbmFjb1dpbmRvdy5tb25hY28uZWRpdG9yLkNvbnRlbnRXaWRnZXRQb3NpdGlvblByZWZlcmVuY2UuQkVMT1ddXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQ29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZVRvb2xiYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRvcldpZGdldCgpIHtcclxuICAgICAgICBjb25zdCBlZGl0b3JFbGVtZW50ID0gdGhpcy5jcmVhdGVJbmxpbmVFZGl0b3JFbGVtZW50KCk7XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yID0ge1xyXG4gICAgICAgICAgICBhbGxvd0VkaXRvck92ZXJmbG93OiB0cnVlLFxyXG4gICAgICAgICAgICBnZXRJZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd3aWRnZXRJbmxpbmVFZGl0b3InO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREb21Ob2RlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWRpdG9yRWxlbWVudDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0UG9zaXRpb246ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVkaXRvck1vZGUgPT0gRWRpdG9yTW9kZS5lZGl0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgYXJlIHVzaW5nIG5lZ2F0aXZlIG1hcmdpblRvcCB0byBzaGlmdCBpdCBhYm92ZSB0aGUgbGluZSB0byB0aGUgcHJldmlvdXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMuYWN0aXZlQ29tbWVudCA/IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyICsgMSA6IHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmZXJlbmNlOiBbbW9uYWNvV2luZG93Lm1vbmFjby5lZGl0b3IuQ29udGVudFdpZGdldFBvc2l0aW9uUHJlZmVyZW5jZS5CRUxPV11cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRDb250ZW50V2lkZ2V0KHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvcik7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QWN0aXZlQ29tbWVudChjb21tZW50OiBSZXZpZXdDb21tZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1Zygnc2V0QWN0aXZlQ29tbWVudCcsIGNvbW1lbnQpO1xyXG5cclxuICAgICAgICBjb25zdCBsaW5lTnVtYmVyc1RvTWFrZURpcnR5ID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCAmJiAoIWNvbW1lbnQgfHwgdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgIT09IGNvbW1lbnQubGluZU51bWJlcikpIHtcclxuICAgICAgICAgICAgbGluZU51bWJlcnNUb01ha2VEaXJ0eS5wdXNoKHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbW1lbnQpIHtcclxuICAgICAgICAgICAgbGluZU51bWJlcnNUb01ha2VEaXJ0eS5wdXNoKGNvbW1lbnQubGluZU51bWJlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFjdGl2ZUNvbW1lbnQgPSBjb21tZW50O1xyXG4gICAgICAgIGlmIChsaW5lTnVtYmVyc1RvTWFrZURpcnR5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJBbmRNYXBDb21tZW50cyhsaW5lTnVtYmVyc1RvTWFrZURpcnR5LCAoY29tbWVudCkgPT4geyBjb21tZW50LnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMuZGlydHkgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVUb29sYmFyKTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJBbmRNYXBDb21tZW50cyhsaW5lTnVtYmVyczogbnVtYmVyW10sIGZuOiB7IChjb21tZW50OiBSZXZpZXdDb21tZW50KTogdm9pZCB9KSB7XHJcbiAgICAgICAgY29uc3QgY29tbWVudHMgPSB0aGlzLml0ZXJhdGVDb21tZW50cygpO1xyXG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjb21tZW50cykge1xyXG4gICAgICAgICAgICBpZiAobGluZU51bWJlcnMuaW5kZXhPZihjLmNvbW1lbnQubGluZU51bWJlcikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgZm4oYy5jb21tZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVNb3VzZURvd24oZXY6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ2hhbmRsZU1vdXNlRG93bicsIHRoaXMuYWN0aXZlQ29tbWVudCwgZXYudGFyZ2V0LmVsZW1lbnQsIGV2LnRhcmdldC5kZXRhaWwpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChldi50YXJnZXQuZWxlbWVudC50YWdOYW1lID09PSAnVEVYVEFSRUEnKSB7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXYudGFyZ2V0LmVsZW1lbnQudGFnTmFtZSA9PT0gJ0JVVFRPTicgfHwgZXYudGFyZ2V0LmVsZW1lbnQudGFnTmFtZSA9PT0gJ0EnKSB7XHJcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQuZWxlbWVudC5uYW1lID09PSAnYWRkJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUuZWRpdG9yKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldi50YXJnZXQuZWxlbWVudC5uYW1lID09PSAncmVtb3ZlJyAmJiB0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ29tbWVudCh0aGlzLmFjdGl2ZUNvbW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDb21tZW50KG51bGwpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2LnRhcmdldC5lbGVtZW50Lm5hbWUgPT09ICdzYXZlJykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgciA9IHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLnRvb2xiYXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDb21tZW50KHIubGluZU51bWJlciwgci50ZXh0KTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldi50YXJnZXQuZWxlbWVudC5uYW1lID09PSAnY2FuY2VsJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUudG9vbGJhcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBhY3RpdmVDb21tZW50OiBSZXZpZXdDb21tZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQuZGV0YWlsICYmIGV2LnRhcmdldC5kZXRhaWwudmlld1pvbmVJZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQudmlld1pvbmVJZCA9PSBldi50YXJnZXQuZGV0YWlsLnZpZXdab25lSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ29tbWVudCA9IGl0ZW0uY29tbWVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ29tbWVudChhY3RpdmVDb21tZW50KTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVkaXRvck1vZGUgPT09IEVkaXRvck1vZGUuZWRpdG9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS50b29sYmFyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEVkaXRvck1vZGUobW9kZTogRWRpdG9yTW9kZSk6IHsgbGluZU51bWJlcjogbnVtYmVyLCB0ZXh0OiBzdHJpbmcgfSB7XHJcbiAgICAgICAgY29uc3QgbGluZU51bWJlciA9IHRoaXMuYWN0aXZlQ29tbWVudCA/IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyIDogdGhpcy5lZGl0b3IuZ2V0UG9zaXRpb24oKS5saW5lTnVtYmVyO1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3NldEVkaXRvck1vZGUnLCB0aGlzLmFjdGl2ZUNvbW1lbnQsIGxpbmVOdW1iZXIsIHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlcik7XHJcbiAgICAgICAgdGhpcy5lZGl0b3JNb2RlID0gbW9kZTtcclxuXHJcbiAgICAgICAgbGV0IGlkeCA9IDA7XHJcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcclxuICAgICAgICBsZXQgbWFyZ2luVG9wOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGNvbnN0IGxpbmVIZWlnaHQgPSB0aGlzLmNvbmZpZy5saW5lSGVpZ2h0Oy8vRklYTUUgLSBNYWdpYyBudW1iZXIgZm9yIGxpbmUgaGVpZ2h0ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LmxpbmVOdW1iZXIgPT0gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQgPT0gdGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWR4ID0gY291bnQgKyAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hcmdpblRvcCA9ICgoKytjb3VudCAtIGlkeCkgKiBsaW5lSGVpZ2h0KSAtIDI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgbm9kZSA9IHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvci5nZXREb21Ob2RlKCkgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgbm9kZS5zdHlsZS5tYXJnaW5Ub3AgPSBgLSR7bWFyZ2luVG9wfXB4YDtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IubGF5b3V0Q29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZVRvb2xiYXIpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yKTtcclxuXHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvci5nZXREb21Ob2RlKCk7XHJcbiAgICAgICAgY29uc3QgdGV4dGFyZWEgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJURVhUQVJFQVtuYW1lPSd0ZXh0J11cIik7XHJcblxyXG4gICAgICAgIGlmIChtb2RlID09IEVkaXRvck1vZGUuZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRleHRhcmVhLnZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8vSEFDSyAtIGJlY2F1c2UgdGhlIGV2ZW50IGluIG1vbmFjbyBkb2Vzbid0IGhhdmUgcHJldmVudGRlZmF1bHQgd2hpY2ggbWVhbnMgZWRpdG9yIHRha2VzIGZvY3VzIGJhY2suLi4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0ZXh0YXJlYS5mb2N1cygpLCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdGV4dDogdGV4dGFyZWEudmFsdWUsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIG5leHRDb21tZW50SWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke25ldyBEYXRlKCkudG9TdHJpbmcoKX0tJHt0aGlzLmN1cnJlbnRVc2VyfWA7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ29tbWVudChsaW5lTnVtYmVyOiBudW1iZXIsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IG5ldyBSZXZpZXdDb21tZW50KHRoaXMubmV4dENvbW1lbnRJZCgpLCB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciwgdGhpcy5jdXJyZW50VXNlciwgbmV3IERhdGUoKSwgdGV4dClcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDb21tZW50LmNvbW1lbnRzLnB1c2goY29tbWVudCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZpbHRlckFuZE1hcENvbW1lbnRzKFtsaW5lTnVtYmVyXSwgKGNvbW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbW1lbnQucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5kaXJ0eTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IG5ldyBSZXZpZXdDb21tZW50KHRoaXMubmV4dENvbW1lbnRJZCgpLCBsaW5lTnVtYmVyLCB0aGlzLmN1cnJlbnRVc2VyLCBuZXcgRGF0ZSgpLCB0ZXh0KVxyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRzLnB1c2goY29tbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpXHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UodGhpcy5jb21tZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGl0ZXJhdGVDb21tZW50cyhjb21tZW50cz86IFJldmlld0NvbW1lbnRbXSwgZGVwdGg/OiBudW1iZXIsIGNvdW50QnlMaW5lTnVtYmVyPzogYW55LCByZXN1bHRzPzogUmV2aWV3Q29tbWVudEl0ZXJJdGVtW10pIHtcclxuICAgICAgICByZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcclxuICAgICAgICBkZXB0aCA9IGRlcHRoIHx8IDA7XHJcbiAgICAgICAgY29tbWVudHMgPSBjb21tZW50cyB8fCB0aGlzLmNvbW1lbnRzO1xyXG4gICAgICAgIGNvdW50QnlMaW5lTnVtYmVyID0gY291bnRCeUxpbmVOdW1iZXIgfHwge307XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgY29tbWVudCBvZiBjb21tZW50cykge1xyXG4gICAgICAgICAgICBjb3VudEJ5TGluZU51bWJlcltjb21tZW50LmxpbmVOdW1iZXJdID0gKGNvdW50QnlMaW5lTnVtYmVyW2NvbW1lbnQubGluZU51bWJlcl0gfHwgMCkgKyAxXHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh7IGRlcHRoLCBjb21tZW50LCBjb3VudDogY291bnRCeUxpbmVOdW1iZXJbY29tbWVudC5saW5lTnVtYmVyXSB9KVxyXG4gICAgICAgICAgICB0aGlzLml0ZXJhdGVDb21tZW50cyhjb21tZW50LmNvbW1lbnRzLCBkZXB0aCArIDEsIGNvdW50QnlMaW5lTnVtYmVyLCByZXN1bHRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNvbW1lbnQoY29tbWVudDogUmV2aWV3Q29tbWVudCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cyhbY29tbWVudF0pKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uY29tbWVudC5kZWxldGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKTtcclxuICAgICAgICBpZiAodGhpcy5vbkNoYW5nZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuY29tbWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoQ29tbWVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuY2hhbmdlVmlld1pvbmVzKChjaGFuZ2VBY2Nlc3NvcikgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHModGhpcy5jb21tZW50cywgMCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQuZGVsZXRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ0RlbGV0ZScsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUoaXRlbS5jb21tZW50LnZpZXdab25lSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQucmVuZGVyU3RhdHVzID09PSBSZXZpZXdDb21tZW50U3RhdHVzLmhpZGRlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ0hpZGRlbicsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUoaXRlbS5jb21tZW50LnZpZXdab25lSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudC5yZW5kZXJTdGF0dXMgPT09IFJldmlld0NvbW1lbnRTdGF0dXMuZGlydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdEaXJ0eScsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUoaXRlbS5jb21tZW50LnZpZXdab25lSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbW1lbnQucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5ub3JtYWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLmNvbW1lbnQudmlld1pvbmVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ0NyZWF0ZScsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvbU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IHRoaXMuYWN0aXZlQ29tbWVudCA9PSBpdGVtLmNvbW1lbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc3R5bGUubWFyZ2luTGVmdCA9ICh0aGlzLmNvbmZpZy5jb21tZW50SW5kZW50ICogKGl0ZW0uZGVwdGggKyAxKSkgKyB0aGlzLmNvbmZpZy5jb21tZW50SW5kZW50T2Zmc2V0ICsgXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lJztcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmNsYXNzTmFtZSA9IGlzQWN0aXZlID8gJ3Jldmlld0NvbW1lbnQtYWN0aXZlJyA6ICdyZXZpZXdDb21tZW50LWluYWN0aXZlJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5jbGFzc05hbWUgPSBpc0FjdGl2ZSA/ICdyZXZpZXdDb21tZW50LXNlbGVjdGlvbi1hY3RpdmUnIDogJ3Jldmlld0NvbW1lbnQtc2VsZWN0aW9uLWluYWN0aXZlJ1xyXG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cy5pbm5lclRleHQgPSBpc0FjdGl2ZSA/IFJldmlld0NvbW1lbnRJY29uQWN0aXZlIDogUmV2aWV3Q29tbWVudEljb25TZWxlY3Q7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBhdXRob3IuY2xhc3NOYW1lID0gJ3Jldmlld0NvbW1lbnQtYXV0aG9yJ1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvci5pbm5lclRleHQgPSBpdGVtLmNvbW1lbnQuYXV0aG9yIHx8ICcgJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZHQuY2xhc3NOYW1lID0gJ3Jldmlld0NvbW1lbnQtZHQnXHJcbiAgICAgICAgICAgICAgICAgICAgZHQuaW5uZXJUZXh0ID0gaXRlbS5jb21tZW50LmR0LnRvTG9jYWxlU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5jbGFzc05hbWUgPSAncmV2aWV3Q29tbWVudC10ZXh0J1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQuaW5uZXJUZXh0ID0gaXRlbS5jb21tZW50LnRleHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQoc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmFwcGVuZENoaWxkKGR0KTtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmFwcGVuZENoaWxkKGF1dGhvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21tZW50LnZpZXdab25lSWQgPSBjaGFuZ2VBY2Nlc3Nvci5hZGRab25lKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXJMaW5lTnVtYmVyOiBpdGVtLmNvbW1lbnQubGluZU51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0SW5MaW5lczogMSwgLy9UT0RPIC0gRmlndXJlIG91dCBpZiBtdWx0aS1saW5lP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlOiBkb21Ob2RlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRBY3Rpb25zKCkge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZEFjdGlvbih7XHJcbiAgICAgICAgICAgIGlkOiAnbXktdW5pcXVlLWlkLWFkZCcsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnQWRkIENvbW1lbnQnLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nczogW1xyXG4gICAgICAgICAgICAgICAgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlNb2QuQ3RybENtZCB8IG1vbmFjb1dpbmRvdy5tb25hY28uS2V5Q29kZS5GMTAsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHByZWNvbmRpdGlvbjogbnVsbCxcclxuICAgICAgICAgICAga2V5YmluZGluZ0NvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51R3JvdXBJZDogJ25hdmlnYXRpb24nLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudU9yZGVyOiAwLFxyXG5cclxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncnVuJylcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLmVkaXRvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQWN0aW9uKHtcclxuICAgICAgICAgICAgaWQ6ICdteS11bmlxdWUtaWQtbmV4dCcsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnTmV4dCBDb21tZW50JyxcclxuICAgICAgICAgICAga2V5YmluZGluZ3M6IFtcclxuICAgICAgICAgICAgICAgIG1vbmFjb1dpbmRvdy5tb25hY28uS2V5TW9kLkN0cmxDbWQgfCBtb25hY29XaW5kb3cubW9uYWNvLktleUNvZGUuRjEyLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwcmVjb25kaXRpb246IG51bGwsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdDb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudUdyb3VwSWQ6ICduYXZpZ2F0aW9uJyxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVPcmRlcjogMC4xLFxyXG5cclxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9Db21tZW50KE5hdmlhdGlvbkRpcmVjdGlvbi5uZXh0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZEFjdGlvbih7XHJcbiAgICAgICAgICAgIGlkOiAnbXktdW5pcXVlLWlkLXByZXYnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ1ByZXYgQ29tbWVudCcsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdzOiBbXHJcbiAgICAgICAgICAgICAgICBtb25hY29XaW5kb3cubW9uYWNvLktleU1vZC5DdHJsQ21kIHwgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlDb2RlLkYxMSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcHJlY29uZGl0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nQ29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVHcm91cElkOiAnbmF2aWdhdGlvbicsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51T3JkZXI6IDAuMSxcclxuXHJcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ29tbWVudChOYXZpYXRpb25EaXJlY3Rpb24ucHJldik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZVRvQ29tbWVudChkaXJlY3Rpb246IE5hdmlhdGlvbkRpcmVjdGlvbikge1xyXG4gICAgICAgIGxldCBjdXJyZW50TGluZSA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCkge1xyXG4gICAgICAgICAgICBjdXJyZW50TGluZSA9IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gdGhpcy5lZGl0b3IuZ2V0UG9zaXRpb24oKS5saW5lTnVtYmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29tbWVudHMgPSB0aGlzLmNvbW1lbnRzLmZpbHRlcigoYykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBOYXZpYXRpb25EaXJlY3Rpb24ubmV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGMubGluZU51bWJlciA+IGN1cnJlbnRMaW5lO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWF0aW9uRGlyZWN0aW9uLnByZXYpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjLmxpbmVOdW1iZXIgPCBjdXJyZW50TGluZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoY29tbWVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbW1lbnRzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IE5hdmlhdGlvbkRpcmVjdGlvbi5uZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEubGluZU51bWJlciAtIGIubGluZU51bWJlcjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBOYXZpYXRpb25EaXJlY3Rpb24ucHJldikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiLmxpbmVOdW1iZXIgLSBhLmxpbmVOdW1iZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IGNvbW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNvbW1lbnQoY29tbWVudClcclxuICAgICAgICAgICAgdGhpcy5lZGl0b3IucmV2ZWFsTGluZShjb21tZW50LmxpbmVOdW1iZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZW51bSBOYXZpYXRpb25EaXJlY3Rpb24ge1xyXG4gICAgbmV4dCxcclxuICAgIHByZXZcclxufVxyXG5cclxuZW51bSBFZGl0b3JNb2RlIHtcclxuICAgIGVkaXRvcixcclxuICAgIHRvb2xiYXJcclxufVxyXG5cclxuZW51bSBSZXZpZXdDb21tZW50U3RhdHVzIHtcclxuICAgIGRpcnR5LFxyXG4gICAgaGlkZGVuLFxyXG4gICAgbm9ybWFsXHJcbn0iXSwic291cmNlUm9vdCI6IiJ9