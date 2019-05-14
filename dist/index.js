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
        var add = document.createElement('button');
        add.innerText = '+';
        add.name = 'add';
        var remove = document.createElement('button');
        remove.innerText = '-';
        remove.name = 'remove';
        var root = document.createElement('span');
        root.appendChild(add);
        root.appendChild(remove);
        root.style.width = "50px";
        return root;
    };
    ReviewManager.prototype.createInlineEditorElement = function () {
        var _this = this;
        var root = document.createElement('span');
        root.className = "reviewCommentEdit";
        var textarea = document.createElement('textarea');
        textarea.className = "reviewCommentText";
        textarea.innerText = '-';
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
        save.className = "reviewCommentCancel";
        cancel.innerText = 'Cancel';
        cancel.name = 'Cancel';
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
                console.log('asdf');
                if (_this.editorMode == EditorMode.editor) {
                    return {
                        position: {
                            lineNumber: _this.activeComment ? _this.activeComment.lineNumber : _this.editor.getPosition().lineNumber
                        },
                        preference: [monacoWindow.monaco.editor.ContentWidgetPositionPreference.BELOW]
                    };
                }
            }
        };
        this.editor.addContentWidget(this.widgetInlineCommentEditor);
    };
    ReviewManager.prototype.setActiveComment = function (comment) {
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
        console.log(ev.target.element, ev.target.detail);
        if (ev.target.element.tagName === 'TEXTAREA') {
        }
        else if (ev.target.element.tagName === 'BUTTON') {
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
            return;
        }
        else {
            if (ev.target.detail) {
                var activeComment = null;
                for (var _i = 0, _a = this.iterateComments(); _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.comment.viewZoneId == ev.target.detail.viewZoneId) {
                        activeComment = item.comment;
                        break;
                    }
                }
                this.setActiveComment(activeComment);
            }
            if (this.editorMode === EditorMode.editor) {
                this.setEditorMode(EditorMode.toolbar);
            }
        }
    };
    ReviewManager.prototype.setEditorMode = function (mode) {
        var lineNumber = this.activeComment ? this.activeComment.lineNumber : this.editor.getPosition().lineNumber;
        this.editorMode = mode;
        this.filterAndMapComments([lineNumber], function (comment) {
            comment.renderStatus = mode == EditorMode.editor ? ReviewCommentStatus.hidden : ReviewCommentStatus.normal;
            console.warn(comment.text, mode);
        });
        this.refreshComments();
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
                    domNode.style.marginLeft = (25 * (item.depth + 1)) + 50 + "";
                    domNode.style.width = "100";
                    domNode.style.display = 'inline';
                    domNode.className = isActive ? 'reviewComment-active' : 'reviewComment-inactive';
                    var status_1 = document.createElement('span');
                    status_1.className = isActive ? 'reviewComment-selection-active' : 'reviewComment-selection-inactive';
                    status_1.innerText = isActive ? '>>' : '---';
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
            // precondition: null,
            // keybindingContext: null,
            // contextMenuGroupId: 'navigation',
            // contextMenuOrder: 0,
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01vbmFjb0VkaXRvckNvZGVSZXZpZXcvLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzlFQSxJQUFNLFlBQVksR0FBSSxNQUE4QixDQUFDO0FBRXJEO0lBWUksdUJBQVksRUFBVSxFQUFFLFVBQWtCLEVBQUUsTUFBYyxFQUFFLEVBQVEsRUFBRSxJQUFZLEVBQUUsUUFBMEI7UUFDMUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElB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QUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzlDO0lBQ0wsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0FBQztBQUVELElBQUssa0JBR0o7QUFIRCxXQUFLLGtCQUFrQjtJQUNuQiwyREFBSTtJQUNKLDJEQUFJO0FBQ1IsQ0FBQyxFQUhJLGtCQUFrQixLQUFsQixrQkFBa0IsUUFHdEI7QUFFRCxJQUFLLFVBR0o7QUFIRCxXQUFLLFVBQVU7SUFDWCwrQ0FBTTtJQUNOLGlEQUFPO0FBQ1gsQ0FBQyxFQUhJLFVBQVUsS0FBVixVQUFVLFFBR2Q7QUFFRCxJQUFLLG1CQUlKO0FBSkQsV0FBSyxtQkFBbUI7SUFDcEIsK0RBQUs7SUFDTCxpRUFBTTtJQUNOLGlFQUFNO0FBQ1YsQ0FBQyxFQUpJLG1CQUFtQixLQUFuQixtQkFBbUIsUUFJdkIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsImludGVyZmFjZSBNb25hY29XaW5kb3cge1xyXG4gICAgbW9uYWNvOiBhbnk7XHJcbn1cclxuXHJcbmNvbnN0IG1vbmFjb1dpbmRvdyA9ICh3aW5kb3cgYXMgYW55KSBhcyBNb25hY29XaW5kb3c7XHJcblxyXG5leHBvcnQgY2xhc3MgUmV2aWV3Q29tbWVudCB7XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgYXV0aG9yOiBzdHJpbmc7XHJcbiAgICBkdDogRGF0ZTtcclxuICAgIGxpbmVOdW1iZXI6IG51bWJlcjtcclxuICAgIHRleHQ6IHN0cmluZztcclxuICAgIGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W107XHJcblxyXG4gICAgZGVsZXRlZDogYm9vbGVhbjtcclxuICAgIHZpZXdab25lSWQ6IG51bWJlcjtcclxuICAgIHJlbmRlclN0YXR1czogUmV2aWV3Q29tbWVudFN0YXR1cztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBsaW5lTnVtYmVyOiBudW1iZXIsIGF1dGhvcjogc3RyaW5nLCBkdDogRGF0ZSwgdGV4dDogc3RyaW5nLCBjb21tZW50cz86IFJldmlld0NvbW1lbnRbXSkge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLmF1dGhvciA9IGF1dGhvcjtcclxuICAgICAgICB0aGlzLmR0ID0gZHQ7XHJcbiAgICAgICAgdGhpcy5saW5lTnVtYmVyID0gbGluZU51bWJlcjtcclxuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIHRoaXMuY29tbWVudHMgPSBjb21tZW50cyB8fCBbXTtcclxuXHJcbiAgICAgICAgLy9IQUNLIC0gdGhpcyBpcyBydW50aW1lIHN0YXRlIC0gYW5kIHNob3VsZCBiZSBtb3ZlZFxyXG4gICAgICAgIHRoaXMuZGVsZXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5ub3JtYWw7XHJcbiAgICAgICAgdGhpcy52aWV3Wm9uZUlkID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJldmlld01hbmFnZXIoZWRpdG9yOiBhbnksIGN1cnJlbnRVc2VyOiBzdHJpbmcsIGNvbW1lbnRzPzogUmV2aWV3Q29tbWVudFtdLCBvbkNoYW5nZT86IE9uQ29tbWVudHNDaGFuZ2VkKSB7XHJcbiAgICBjb25zdCBybSA9IG5ldyBSZXZpZXdNYW5hZ2VyKGVkaXRvciwgY3VycmVudFVzZXIsIG9uQ2hhbmdlKTtcclxuICAgIHJtLmxvYWQoY29tbWVudHMgfHwgW10pO1xyXG4gICAgcmV0dXJuIHJtO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmV2aWV3Q29tbWVudEl0ZXJJdGVtIHtcclxuICAgIGRlcHRoOiBudW1iZXI7XHJcbiAgICBjb21tZW50OiBSZXZpZXdDb21tZW50LFxyXG4gICAgY291bnQ6IG51bWJlclxyXG59XHJcblxyXG5pbnRlcmZhY2UgT25Db21tZW50c0NoYW5nZWQge1xyXG4gICAgKGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W10pOiB2b2lkXHJcbn1cclxuXHJcbmNsYXNzIFJldmlld01hbmFnZXIge1xyXG4gICAgY3VycmVudFVzZXI6IHN0cmluZztcclxuICAgIGVkaXRvcjogYW55O1xyXG4gICAgY29tbWVudHM6IFJldmlld0NvbW1lbnRbXTtcclxuICAgIGFjdGl2ZUNvbW1lbnQ/OiBSZXZpZXdDb21tZW50O1xyXG4gICAgd2lkZ2V0SW5saW5lVG9vbGJhcjogYW55O1xyXG4gICAgd2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvcjogYW55O1xyXG4gICAgb25DaGFuZ2U6IE9uQ29tbWVudHNDaGFuZ2VkO1xyXG4gICAgZWRpdG9yTW9kZTogRWRpdG9yTW9kZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlZGl0b3I6IGFueSwgY3VycmVudFVzZXI6IHN0cmluZywgb25DaGFuZ2U6IE9uQ29tbWVudHNDaGFuZ2VkKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlciA9IGN1cnJlbnRVc2VyO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb21tZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMud2lkZ2V0SW5saW5lVG9vbGJhciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gb25DaGFuZ2U7XHJcbiAgICAgICAgdGhpcy5lZGl0b3JNb2RlID0gRWRpdG9yTW9kZS50b29sYmFyO1xyXG5cclxuICAgICAgICB0aGlzLmFkZEFjdGlvbnMoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlubGluZVRvb2xiYXJXaWRnZXQoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlubGluZUVkaXRvcldpZGdldCgpO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5vbk1vdXNlRG93bih0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W10pIHtcclxuICAgICAgICB0aGlzLmVkaXRvci5jaGFuZ2VWaWV3Wm9uZXMoKGNoYW5nZUFjY2Vzc29yKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LnZpZXdab25lSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU2hvdWxkIHRoaXMgYmUgaW5zaWRlIHRoaXMgY2FsbGJhY2s/XHJcbiAgICAgICAgICAgIHRoaXMuY29tbWVudHMgPSBjb21tZW50cztcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRCdXR0b25zRWxlbWVudCgpIHtcclxuICAgICAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBhZGQuaW5uZXJUZXh0ID0gJysnO1xyXG4gICAgICAgIGFkZC5uYW1lID0gJ2FkZCc7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbW92ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIHJlbW92ZS5pbm5lclRleHQgPSAnLSc7XHJcbiAgICAgICAgcmVtb3ZlLm5hbWUgPSAncmVtb3ZlJztcclxuXHJcbiAgICAgICAgdmFyIHJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChhZGQpO1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVtb3ZlKTtcclxuICAgICAgICByb290LnN0eWxlLndpZHRoID0gXCI1MHB4XCI7XHJcblxyXG4gICAgICAgIHJldHVybiByb290O1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRvckVsZW1lbnQoKSB7XHJcbiAgICAgICAgdmFyIHJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgcm9vdC5jbGFzc05hbWUgPSBcInJldmlld0NvbW1lbnRFZGl0XCJcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xyXG4gICAgICAgIHRleHRhcmVhLmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudFRleHRcIjtcclxuICAgICAgICB0ZXh0YXJlYS5pbm5lclRleHQgPSAnLSc7XHJcbiAgICAgICAgdGV4dGFyZWEubmFtZSA9ICd0ZXh0JztcclxuICAgICAgICB0ZXh0YXJlYS5vbmtleXByZXNzID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFbnRlclwiICYmIGUuY3RybEtleSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgciA9IHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLnRvb2xiYXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDb21tZW50KHIubGluZU51bWJlciwgci50ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHNhdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBzYXZlLmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudFNhdmVcIjtcclxuICAgICAgICBzYXZlLmlubmVyVGV4dCA9ICdTYXZlJztcclxuICAgICAgICBzYXZlLm5hbWUgPSAnc2F2ZSc7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIHNhdmUuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50Q2FuY2VsXCI7XHJcbiAgICAgICAgY2FuY2VsLmlubmVyVGV4dCA9ICdDYW5jZWwnO1xyXG4gICAgICAgIGNhbmNlbC5uYW1lID0gJ0NhbmNlbCc7XHJcblxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQodGV4dGFyZWEpO1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoc2F2ZSk7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjYW5jZWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gcm9vdFxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZVRvb2xiYXJXaWRnZXQoKSB7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uc0VsZW1lbnQgPSB0aGlzLmNyZWF0ZUlubGluZUVkaXRCdXR0b25zRWxlbWVudCgpO1xyXG5cclxuICAgICAgICB0aGlzLndpZGdldElubGluZVRvb2xiYXIgPSB7XHJcbiAgICAgICAgICAgIGFsbG93RWRpdG9yT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgICAgIGdldElkOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3dpZGdldElubGluZVRvb2xiYXInO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREb21Ob2RlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYnV0dG9uc0VsZW1lbnQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ICYmIHRoaXMuZWRpdG9yTW9kZSA9PSBFZGl0b3JNb2RlLnRvb2xiYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZlcmVuY2U6IFttb25hY29XaW5kb3cubW9uYWNvLmVkaXRvci5Db250ZW50V2lkZ2V0UG9zaXRpb25QcmVmZXJlbmNlLkJFTE9XXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVUb29sYmFyKTsgICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRvcldpZGdldCgpIHtcclxuICAgICAgICBjb25zdCBlZGl0b3JFbGVtZW50ID0gdGhpcy5jcmVhdGVJbmxpbmVFZGl0b3JFbGVtZW50KCk7XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yID0ge1xyXG4gICAgICAgICAgICBhbGxvd0VkaXRvck92ZXJmbG93OiB0cnVlLFxyXG4gICAgICAgICAgICBnZXRJZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd3aWRnZXRJbmxpbmVFZGl0b3InO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREb21Ob2RlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWRpdG9yRWxlbWVudDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0UG9zaXRpb246ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhc2RmJylcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVkaXRvck1vZGUgPT0gRWRpdG9yTW9kZS5lZGl0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5hY3RpdmVDb21tZW50ID8gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgOiB0aGlzLmVkaXRvci5nZXRQb3NpdGlvbigpLmxpbmVOdW1iZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZmVyZW5jZTogW21vbmFjb1dpbmRvdy5tb25hY28uZWRpdG9yLkNvbnRlbnRXaWRnZXRQb3NpdGlvblByZWZlcmVuY2UuQkVMT1ddXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQ29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEFjdGl2ZUNvbW1lbnQoY29tbWVudDogUmV2aWV3Q29tbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGxpbmVOdW1iZXJzVG9NYWtlRGlydHkgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ICYmICghY29tbWVudCB8fCB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciAhPT0gY29tbWVudC5saW5lTnVtYmVyKSkge1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVyc1RvTWFrZURpcnR5LnB1c2godGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29tbWVudCkge1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVyc1RvTWFrZURpcnR5LnB1c2goY29tbWVudC5saW5lTnVtYmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudCA9IGNvbW1lbnQ7XHJcbiAgICAgICAgaWYgKGxpbmVOdW1iZXJzVG9NYWtlRGlydHkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmZpbHRlckFuZE1hcENvbW1lbnRzKGxpbmVOdW1iZXJzVG9NYWtlRGlydHksIChjb21tZW50KSA9PiB7IGNvbW1lbnQucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5kaXJ0eSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVUb29sYmFyKTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJBbmRNYXBDb21tZW50cyhsaW5lTnVtYmVyczogbnVtYmVyW10sIGZuOiB7IChjb21tZW50OiBSZXZpZXdDb21tZW50KTogdm9pZCB9KSB7XHJcbiAgICAgICAgY29uc3QgY29tbWVudHMgPSB0aGlzLml0ZXJhdGVDb21tZW50cygpO1xyXG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjb21tZW50cykge1xyXG4gICAgICAgICAgICBpZiAobGluZU51bWJlcnMuaW5kZXhPZihjLmNvbW1lbnQubGluZU51bWJlcikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgZm4oYy5jb21tZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVNb3VzZURvd24oZXY6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2LnRhcmdldC5lbGVtZW50LCBldi50YXJnZXQuZGV0YWlsKTtcclxuXHJcbiAgICAgICAgaWYgKGV2LnRhcmdldC5lbGVtZW50LnRhZ05hbWUgPT09ICdURVhUQVJFQScpIHtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChldi50YXJnZXQuZWxlbWVudC50YWdOYW1lID09PSAnQlVUVE9OJykge1xyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmVsZW1lbnQubmFtZSA9PT0gJ2FkZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLmVkaXRvcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXYudGFyZ2V0LmVsZW1lbnQubmFtZSA9PT0gJ3JlbW92ZScgJiYgdGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNvbW1lbnQodGhpcy5hY3RpdmVDb21tZW50KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ29tbWVudChudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChldi50YXJnZXQuZWxlbWVudC5uYW1lID09PSAnc2F2ZScpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHIgPSB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS50b29sYmFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkQ29tbWVudChyLmxpbmVOdW1iZXIsIHIudGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQuZGV0YWlsKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgYWN0aXZlQ29tbWVudDogUmV2aWV3Q29tbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQudmlld1pvbmVJZCA9PSBldi50YXJnZXQuZGV0YWlsLnZpZXdab25lSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ29tbWVudCA9IGl0ZW0uY29tbWVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ29tbWVudChhY3RpdmVDb21tZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5lZGl0b3JNb2RlID09PSBFZGl0b3JNb2RlLmVkaXRvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUudG9vbGJhcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRFZGl0b3JNb2RlKG1vZGU6IEVkaXRvck1vZGUpOiB7IGxpbmVOdW1iZXI6IG51bWJlciwgdGV4dDogc3RyaW5nIH0ge1xyXG4gICAgICAgIGNvbnN0IGxpbmVOdW1iZXIgPSB0aGlzLmFjdGl2ZUNvbW1lbnQgPyB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciA6IHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlcjtcclxuICAgICAgICB0aGlzLmVkaXRvck1vZGUgPSBtb2RlO1xyXG5cclxuICAgICAgICB0aGlzLmZpbHRlckFuZE1hcENvbW1lbnRzKFtsaW5lTnVtYmVyXSwgKGNvbW1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29tbWVudC5yZW5kZXJTdGF0dXMgPSBtb2RlID09IEVkaXRvck1vZGUuZWRpdG9yID8gUmV2aWV3Q29tbWVudFN0YXR1cy5oaWRkZW4gOiBSZXZpZXdDb21tZW50U3RhdHVzLm5vcm1hbDtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGNvbW1lbnQudGV4dCwgbW9kZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IubGF5b3V0Q29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZVRvb2xiYXIpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yKTtcclxuXHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvci5nZXREb21Ob2RlKCk7XHJcbiAgICAgICAgY29uc3QgdGV4dGFyZWEgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJURVhUQVJFQVtuYW1lPSd0ZXh0J11cIik7XHJcblxyXG4gICAgICAgIGlmIChtb2RlID09IEVkaXRvck1vZGUuZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRleHRhcmVhLnZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8vSEFDSyAtIGJlY2F1c2UgdGhlIGV2ZW50IGluIG1vbmFjbyBkb2Vzbid0IGhhdmUgcHJldmVudGRlZmF1bHQgd2hpY2ggbWVhbnMgZWRpdG9yIHRha2VzIGZvY3VzIGJhY2suLi5cclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0ZXh0YXJlYS5mb2N1cygpLCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdGV4dDogdGV4dGFyZWEudmFsdWUsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIG5leHRDb21tZW50SWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke25ldyBEYXRlKCkudG9TdHJpbmcoKX0tJHt0aGlzLmN1cnJlbnRVc2VyfWA7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ29tbWVudChsaW5lTnVtYmVyOiBudW1iZXIsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IG5ldyBSZXZpZXdDb21tZW50KHRoaXMubmV4dENvbW1lbnRJZCgpLCB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciwgdGhpcy5jdXJyZW50VXNlciwgbmV3IERhdGUoKSwgdGV4dClcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDb21tZW50LmNvbW1lbnRzLnB1c2goY29tbWVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IG5ldyBSZXZpZXdDb21tZW50KHRoaXMubmV4dENvbW1lbnRJZCgpLCBsaW5lTnVtYmVyLCB0aGlzLmN1cnJlbnRVc2VyLCBuZXcgRGF0ZSgpLCB0ZXh0KVxyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRzLnB1c2goY29tbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpXHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UodGhpcy5jb21tZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGl0ZXJhdGVDb21tZW50cyhjb21tZW50cz86IFJldmlld0NvbW1lbnRbXSwgZGVwdGg/OiBudW1iZXIsIGNvdW50QnlMaW5lTnVtYmVyPzogYW55LCByZXN1bHRzPzogUmV2aWV3Q29tbWVudEl0ZXJJdGVtW10pIHtcclxuICAgICAgICByZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcclxuICAgICAgICBkZXB0aCA9IGRlcHRoIHx8IDA7XHJcbiAgICAgICAgY29tbWVudHMgPSBjb21tZW50cyB8fCB0aGlzLmNvbW1lbnRzO1xyXG4gICAgICAgIGNvdW50QnlMaW5lTnVtYmVyID0gY291bnRCeUxpbmVOdW1iZXIgfHwge307XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgY29tbWVudCBvZiBjb21tZW50cykge1xyXG4gICAgICAgICAgICBjb3VudEJ5TGluZU51bWJlcltjb21tZW50LmxpbmVOdW1iZXJdID0gKGNvdW50QnlMaW5lTnVtYmVyW2NvbW1lbnQubGluZU51bWJlcl0gfHwgMCkgKyAxXHJcbiAgICAgICAgICAgIHJlc3VsdHMucHVzaCh7IGRlcHRoLCBjb21tZW50LCBjb3VudDogY291bnRCeUxpbmVOdW1iZXJbY29tbWVudC5saW5lTnVtYmVyXSB9KVxyXG4gICAgICAgICAgICB0aGlzLml0ZXJhdGVDb21tZW50cyhjb21tZW50LmNvbW1lbnRzLCBkZXB0aCArIDEsIGNvdW50QnlMaW5lTnVtYmVyLCByZXN1bHRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNvbW1lbnQoY29tbWVudDogUmV2aWV3Q29tbWVudCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cyhbY29tbWVudF0pKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uY29tbWVudC5kZWxldGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKTtcclxuICAgICAgICBpZiAodGhpcy5vbkNoYW5nZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuY29tbWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoQ29tbWVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuY2hhbmdlVmlld1pvbmVzKChjaGFuZ2VBY2Nlc3NvcikgPT4ge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHModGhpcy5jb21tZW50cywgMCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQuZGVsZXRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ0RlbGV0ZScsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUoaXRlbS5jb21tZW50LnZpZXdab25lSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQucmVuZGVyU3RhdHVzID09PSBSZXZpZXdDb21tZW50U3RhdHVzLmhpZGRlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ0hpZGRlbicsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUoaXRlbS5jb21tZW50LnZpZXdab25lSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudC5yZW5kZXJTdGF0dXMgPT09IFJldmlld0NvbW1lbnRTdGF0dXMuZGlydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdEaXJ0eScsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUoaXRlbS5jb21tZW50LnZpZXdab25lSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbW1lbnQucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5ub3JtYWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLmNvbW1lbnQudmlld1pvbmVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ0NyZWF0ZScsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvbU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IHRoaXMuYWN0aXZlQ29tbWVudCA9PSBpdGVtLmNvbW1lbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc3R5bGUubWFyZ2luTGVmdCA9ICgyNSAqIChpdGVtLmRlcHRoICsgMSkpICsgNTAgKyBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc3R5bGUud2lkdGggPSBcIjEwMFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUnO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuY2xhc3NOYW1lID0gaXNBY3RpdmUgPyAncmV2aWV3Q29tbWVudC1hY3RpdmUnIDogJ3Jldmlld0NvbW1lbnQtaW5hY3RpdmUnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0dXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmNsYXNzTmFtZSA9IGlzQWN0aXZlID8gJ3Jldmlld0NvbW1lbnQtc2VsZWN0aW9uLWFjdGl2ZScgOiAncmV2aWV3Q29tbWVudC1zZWxlY3Rpb24taW5hY3RpdmUnXHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzLmlubmVyVGV4dCA9IGlzQWN0aXZlID8gJz4+JyA6ICctLS0nO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdXRob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yLmNsYXNzTmFtZSA9ICdyZXZpZXdDb21tZW50LWF1dGhvcidcclxuICAgICAgICAgICAgICAgICAgICBhdXRob3IuaW5uZXJUZXh0ID0gaXRlbS5jb21tZW50LmF1dGhvciB8fCAnICc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGR0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGR0LmNsYXNzTmFtZSA9ICdyZXZpZXdDb21tZW50LWR0J1xyXG4gICAgICAgICAgICAgICAgICAgIGR0LmlubmVyVGV4dCA9IGl0ZW0uY29tbWVudC5kdC50b0xvY2FsZVN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQuY2xhc3NOYW1lID0gJ3Jldmlld0NvbW1lbnQtdGV4dCdcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LmlubmVyVGV4dCA9IGl0ZW0uY29tbWVudC50ZXh0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmFwcGVuZENoaWxkKHN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChkdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChhdXRob3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQodGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkID0gY2hhbmdlQWNjZXNzb3IuYWRkWm9uZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyTGluZU51bWJlcjogaXRlbS5jb21tZW50LmxpbmVOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodEluTGluZXM6IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGU6IGRvbU5vZGVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEFjdGlvbnMoKSB7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQWN0aW9uKHtcclxuICAgICAgICAgICAgaWQ6ICdteS11bmlxdWUtaWQtYWRkJyxcclxuICAgICAgICAgICAgbGFiZWw6ICdBZGQgQ29tbWVudCcsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdzOiBbXHJcbiAgICAgICAgICAgICAgICBtb25hY29XaW5kb3cubW9uYWNvLktleU1vZC5DdHJsQ21kIHwgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlDb2RlLkYxMCxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgLy8gcHJlY29uZGl0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICAvLyBrZXliaW5kaW5nQ29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgLy8gY29udGV4dE1lbnVHcm91cElkOiAnbmF2aWdhdGlvbicsXHJcbiAgICAgICAgICAgIC8vIGNvbnRleHRNZW51T3JkZXI6IDAsXHJcblxyXG4gICAgICAgICAgICBydW46ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdydW4nKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUuZWRpdG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRBY3Rpb24oe1xyXG4gICAgICAgICAgICBpZDogJ215LXVuaXF1ZS1pZC1uZXh0JyxcclxuICAgICAgICAgICAgbGFiZWw6ICdOZXh0IENvbW1lbnQnLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nczogW1xyXG4gICAgICAgICAgICAgICAgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlNb2QuQ3RybENtZCB8IG1vbmFjb1dpbmRvdy5tb25hY28uS2V5Q29kZS5GMTIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHByZWNvbmRpdGlvbjogbnVsbCxcclxuICAgICAgICAgICAga2V5YmluZGluZ0NvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51R3JvdXBJZDogJ25hdmlnYXRpb24nLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudU9yZGVyOiAwLjEsXHJcblxyXG4gICAgICAgICAgICBydW46ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUb0NvbW1lbnQoTmF2aWF0aW9uRGlyZWN0aW9uLm5leHQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQWN0aW9uKHtcclxuICAgICAgICAgICAgaWQ6ICdteS11bmlxdWUtaWQtcHJldicsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnUHJldiBDb21tZW50JyxcclxuICAgICAgICAgICAga2V5YmluZGluZ3M6IFtcclxuICAgICAgICAgICAgICAgIG1vbmFjb1dpbmRvdy5tb25hY28uS2V5TW9kLkN0cmxDbWQgfCBtb25hY29XaW5kb3cubW9uYWNvLktleUNvZGUuRjExLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwcmVjb25kaXRpb246IG51bGwsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdDb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudUdyb3VwSWQ6ICduYXZpZ2F0aW9uJyxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVPcmRlcjogMC4xLFxyXG5cclxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9Db21tZW50KE5hdmlhdGlvbkRpcmVjdGlvbi5wcmV2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlVG9Db21tZW50KGRpcmVjdGlvbjogTmF2aWF0aW9uRGlyZWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gMDtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3VycmVudExpbmUgPSB0aGlzLmVkaXRvci5nZXRQb3NpdGlvbigpLmxpbmVOdW1iZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb21tZW50cyA9IHRoaXMuY29tbWVudHMuZmlsdGVyKChjKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IE5hdmlhdGlvbkRpcmVjdGlvbi5uZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYy5saW5lTnVtYmVyID4gY3VycmVudExpbmU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBOYXZpYXRpb25EaXJlY3Rpb24ucHJldikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGMubGluZU51bWJlciA8IGN1cnJlbnRMaW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChjb21tZW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29tbWVudHMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWF0aW9uRGlyZWN0aW9uLm5leHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5saW5lTnVtYmVyIC0gYi5saW5lTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IE5hdmlhdGlvbkRpcmVjdGlvbi5wcmV2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIubGluZU51bWJlciAtIGEubGluZU51bWJlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb21tZW50ID0gY29tbWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ29tbWVudChjb21tZW50KVxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvci5yZXZlYWxMaW5lKGNvbW1lbnQubGluZU51bWJlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5lbnVtIE5hdmlhdGlvbkRpcmVjdGlvbiB7XHJcbiAgICBuZXh0LFxyXG4gICAgcHJldlxyXG59XHJcblxyXG5lbnVtIEVkaXRvck1vZGUge1xyXG4gICAgZWRpdG9yLFxyXG4gICAgdG9vbGJhclxyXG59XHJcblxyXG5lbnVtIFJldmlld0NvbW1lbnRTdGF0dXMge1xyXG4gICAgZGlydHksXHJcbiAgICBoaWRkZW4sXHJcbiAgICBub3JtYWxcclxufSJdLCJzb3VyY2VSb290IjoiIn0=