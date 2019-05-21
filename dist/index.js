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

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var monacoWindow = window;
var ReviewCommentState = /** @class */ (function () {
    function ReviewCommentState() {
        this.renderStatus = ReviewCommentStatus.normal;
        this.viewZoneId = null;
    }
    return ReviewCommentState;
}());
function createReviewManager(editor, currentUser, comments, onChange, config) {
    //(window as any).editor = editor;    
    var rm = new ReviewManager(editor, currentUser, onChange, config);
    rm.load(comments || []);
    return rm;
}
exports.createReviewManager = createReviewManager;
var defaultReviewManagerConfig = {
    editButtonOffset: '-10px',
    editButtonAddText: 'Reply',
    editButtonRemoveText: 'Remove',
    editButtonEnableRemove: true,
    lineHeight: 19,
    commentIndent: 20,
    commentIndentOffset: 20,
    showInRuler: true,
};
var ReviewManager = /** @class */ (function () {
    function ReviewManager(editor, currentUser, onChange, config) {
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = null;
        this.comments = [];
        this.commentState = {};
        this.widgetInlineToolbar = null;
        this.widgetInlineCommentEditor = null;
        this.onChange = onChange;
        this.editorMode = EditorMode.toolbar;
        this.config = __assign({}, defaultReviewManagerConfig, (config || {}));
        this.addActions();
        this.createInlineToolbarWidget();
        this.createInlineEditorWidget();
        this.editor.onMouseDown(this.handleMouseDown.bind(this));
    }
    ReviewManager.prototype.load = function (comments) {
        var _this = this;
        this.editor.changeViewZones(function (changeAccessor) {
            // Remove all the existing comments     
            for (var _i = 0, _a = _this.iterateComments(); _i < _a.length; _i++) {
                var oldItem = _a[_i];
                if (oldItem.viewState.viewZoneId) {
                    changeAccessor.removeZone(oldItem.viewState.viewZoneId);
                }
            }
            _this.comments = comments || [];
            _this.commentState = {};
            // Check all comments that they have unique and present id's
            for (var _b = 0, _c = _this.iterateComments(); _b < _c.length; _b++) {
                var item = _c[_b];
                var originalId = item.comment.id;
                var changedId = false;
                while (!item.comment.id || _this.commentState[item.comment.id]) {
                    item.comment.id = 'autoid-' + Math.random();
                    changedId = true;
                }
                if (changedId) {
                    console.warn('Comment.Id Assigned: ', originalId, ' changed to to ', item.comment.id, ' due to collision');
                }
                _this.commentState[item.comment.id] = new ReviewCommentState();
            }
            _this.refreshComments();
            console.debug('Comments Loaded: ', _this.comments.length);
        });
    };
    ReviewManager.prototype.createInlineEditButtonsElement = function () {
        var _this = this;
        var root = document.createElement('div');
        root.className = 'editButtonsContainer';
        var add = document.createElement('a');
        add.href = '#';
        add.innerText = this.config.editButtonAddText;
        add.name = 'add';
        add.className = 'editButtonAdd';
        add.onclick = function () {
            _this.setEditorMode(EditorMode.editor);
            return false; // Suppress navigation
        };
        root.appendChild(add);
        if (this.config.editButtonEnableRemove) {
            var spacer = document.createElement('div');
            spacer.innerText = ' ';
            root.appendChild(spacer);
            var remove = document.createElement('a');
            remove.href = '#';
            remove.innerText = this.config.editButtonRemoveText;
            remove.name = 'remove';
            remove.className = 'editButtonRemove';
            remove.onclick = function () {
                _this.removeComment(_this.activeComment);
                return false; // Suppress navigation
            };
            root.appendChild(remove);
        }
        root.style.marginLeft = this.config.editButtonOffset;
        return root;
    };
    ReviewManager.prototype.handleCancel = function () {
        this.setEditorMode(EditorMode.toolbar);
        this.editor.focus();
    };
    ReviewManager.prototype.handleSave = function () {
        var r = this.setEditorMode(EditorMode.toolbar);
        this.addComment(r.lineNumber, r.text);
        this.editor.focus();
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
                _this.handleSave();
            }
        };
        textarea.onkeydown = function (e) {
            if (e.code === "Escape") {
                _this.handleCancel();
            }
        };
        var save = document.createElement('button');
        save.className = "reviewCommentSave";
        save.innerText = 'Save';
        save.name = 'save';
        save.onclick = function () {
            _this.handleSave();
        };
        var cancel = document.createElement('button');
        cancel.className = "reviewCommentCancel";
        cancel.innerText = 'Cancel';
        cancel.name = 'cancel';
        cancel.onclick = function () {
            _this.handleCancel();
        };
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
                            lineNumber: _this.activeComment.lineNumber + 1,
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
            this.filterAndMapComments(lineNumbersToMakeDirty, function (item) {
                item.viewState.renderStatus = ReviewCommentStatus.dirty;
            });
        }
    };
    ReviewManager.prototype.layoutInlineToolbar = function () {
        if (this.activeComment) {
            var toolbarRoot = this.widgetInlineToolbar.getDomNode();
            toolbarRoot.style.marginTop = "-" + this.calculateMarginTopOffset(2) + "px";
        }
        this.editor.layoutContentWidget(this.widgetInlineToolbar);
    };
    ReviewManager.prototype.filterAndMapComments = function (lineNumbers, fn) {
        var comments = this.iterateComments();
        for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
            var c = comments_1[_i];
            if (lineNumbers.indexOf(c.comment.lineNumber) > -1) {
                fn(c);
            }
        }
    };
    ReviewManager.prototype.handleMouseDown = function (ev) {
        console.debug('handleMouseDown', this.activeComment, ev.target.element, ev.target.detail);
        if (ev.target.element.tagName === 'TEXTAREA' || ev.target.element.tagName === 'BUTTON' || ev.target.element.tagName === 'A') {
            return;
        }
        else {
            var activeComment = null;
            if (ev.target.detail && ev.target.detail.viewZoneId !== undefined) {
                for (var _i = 0, _a = this.iterateComments(); _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (item.viewState.viewZoneId == ev.target.detail.viewZoneId) {
                        activeComment = item.comment;
                        break;
                    }
                }
            }
            this.setActiveComment(activeComment);
            this.refreshComments();
            this.setEditorMode(EditorMode.toolbar);
        }
    };
    ReviewManager.prototype.calculateMarginTopOffset = function (extraOffsetLines) {
        if (extraOffsetLines === void 0) { extraOffsetLines = 1; }
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
            marginTop = ((extraOffsetLines + count - idx) * lineHeight);
        }
        return marginTop;
    };
    ReviewManager.prototype.setEditorMode = function (mode) {
        console.debug('setEditorMode', this.activeComment);
        var lineNumber = this.activeComment ? this.activeComment.lineNumber : this.editor.getPosition().lineNumber;
        this.editorMode = mode;
        var editorRoot = this.widgetInlineCommentEditor.getDomNode();
        editorRoot.style.marginTop = "-" + this.calculateMarginTopOffset() + "px";
        this.layoutInlineToolbar();
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
        var ln = this.activeComment ? this.activeComment.lineNumber : lineNumber;
        var comment = {
            id: this.nextCommentId(),
            lineNumber: ln,
            author: this.currentUser,
            dt: new Date(),
            text: text
        };
        this.commentState[comment.id] = new ReviewCommentState();
        if (this.activeComment) {
            if (!this.activeComment.comments) {
                this.activeComment.comments = [];
            }
            this.activeComment.comments.push(comment);
        }
        else {
            this.comments.push(comment);
        }
        this.filterAndMapComments([ln], function (item) {
            item.viewState.renderStatus = ReviewCommentStatus.dirty;
        });
        this.refreshComments();
        this.layoutInlineToolbar();
        if (this.onChange) {
            this.onChange(this.comments);
        }
        return comment;
    };
    ReviewManager.prototype.iterateComments = function (comments, depth, countByLineNumber, results) {
        results = results || [];
        depth = depth || 0;
        comments = comments || this.comments;
        countByLineNumber = countByLineNumber || {};
        if (comments) {
            for (var _i = 0, comments_2 = comments; _i < comments_2.length; _i++) {
                var comment = comments_2[_i];
                countByLineNumber[comment.lineNumber] = (countByLineNumber[comment.lineNumber] || 0) + 1;
                results.push({
                    depth: depth,
                    comment: comment,
                    count: countByLineNumber[comment.lineNumber],
                    viewState: this.commentState[comment.id]
                });
                if (comment.comments) {
                    this.iterateComments(comment.comments, depth + 1, countByLineNumber, results);
                }
            }
        }
        return results;
    };
    ReviewManager.prototype.removeComment = function (comment) {
        for (var _i = 0, _a = this.iterateComments([comment]); _i < _a.length; _i++) {
            var item = _a[_i];
            item.comment.deleted = true;
        }
        if (this.activeComment == comment) {
            this.setActiveComment(null);
            this.layoutInlineToolbar();
        }
        this.refreshComments();
        if (this.onChange) {
            this.onChange(this.comments);
        }
    };
    ReviewManager.prototype.refreshComments = function () {
        var _this = this;
        this.editor.changeViewZones(function (changeAccessor) {
            var lineNumbers = {};
            for (var _i = 0, _a = _this.iterateComments(); _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.comment.deleted) {
                    console.debug('Zone.Delete', item.comment.id);
                    changeAccessor.removeZone(item.viewState.viewZoneId);
                    continue;
                }
                if (item.viewState.renderStatus === ReviewCommentStatus.hidden) {
                    console.debug('Zone.Hidden', item.comment.id);
                    changeAccessor.removeZone(item.viewState.viewZoneId);
                    item.viewState.viewZoneId = null;
                    continue;
                }
                if (item.viewState.renderStatus === ReviewCommentStatus.dirty) {
                    console.debug('Zone.Dirty', item.comment.id);
                    changeAccessor.removeZone(item.viewState.viewZoneId);
                    item.viewState.viewZoneId = null;
                    item.viewState.renderStatus = ReviewCommentStatus.normal;
                }
                if (!item.viewState.viewZoneId) {
                    console.debug('Zone.Create', item.comment.id);
                    lineNumbers[item.comment.lineNumber] = 0;
                    var domNode = document.createElement('div');
                    var isActive = _this.activeComment == item.comment;
                    domNode.style.marginLeft = (_this.config.commentIndent * (item.depth + 1)) + _this.config.commentIndentOffset + "px";
                    domNode.style.display = 'inline';
                    domNode.className = isActive ? 'reviewComment reviewComment-active' : 'reviewComment reviewComment-inactive';
                    var author = document.createElement('span');
                    author.className = 'reviewComment-author';
                    author.innerText = item.comment.author || ' ';
                    var dt = document.createElement('span');
                    dt.className = 'reviewComment-dt';
                    dt.innerText = item.comment.dt.toLocaleString();
                    var text = document.createElement('span');
                    text.className = 'reviewComment-text';
                    text.innerText = item.comment.text;
                    domNode.appendChild(dt);
                    domNode.appendChild(author);
                    domNode.appendChild(text);
                    item.viewState.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: item.comment.lineNumber,
                        heightInLines: 1,
                        domNode: domNode,
                        suppressMouseDown: true // This stops focus being lost the editor - meaning keyboard shortcuts keeps working
                    });
                }
            }
            if (_this.config.showInRuler) {
                var decorators = [];
                for (var ln in lineNumbers) {
                    decorators.push({
                        range: new monacoWindow.monaco.Range(ln, 0, ln, 0),
                        options: {
                            isWholeLine: true,
                            overviewRuler: {
                                color: "red",
                                darkColor: "green",
                                position: 7
                            }
                        }
                    });
                }
                _this.editor.deltaDecorations([], decorators);
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
                _this.navigateToComment(NavigationDirection.next);
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
                _this.navigateToComment(NavigationDirection.prev);
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
            if (direction === NavigationDirection.next) {
                return c.lineNumber > currentLine;
            }
            else if (direction === NavigationDirection.prev) {
                return c.lineNumber < currentLine;
            }
        });
        if (comments.length) {
            comments.sort(function (a, b) {
                if (direction === NavigationDirection.next) {
                    return a.lineNumber - b.lineNumber;
                }
                else if (direction === NavigationDirection.prev) {
                    return b.lineNumber - a.lineNumber;
                }
            });
            var comment = comments[0];
            this.setActiveComment(comment);
            this.refreshComments();
            this.layoutInlineToolbar();
            this.editor.revealLineInCenter(comment.lineNumber);
        }
    };
    return ReviewManager;
}());
var NavigationDirection;
(function (NavigationDirection) {
    NavigationDirection[NavigationDirection["next"] = 1] = "next";
    NavigationDirection[NavigationDirection["prev"] = 2] = "prev";
})(NavigationDirection || (NavigationDirection = {}));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01vbmFjb0VkaXRvckNvZGVSZXZpZXcvLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUVBLElBQU0sWUFBWSxHQUFJLE1BQThCLENBQUM7QUEyQnJEO0lBSUk7UUFDSSxJQUFJLENBQUMsWUFBWSxHQUFHLG1CQUFtQixDQUFDLE1BQU0sQ0FBQztRQUMvQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUMzQixDQUFDO0lBQ0wseUJBQUM7QUFBRCxDQUFDO0FBRUQsU0FBZ0IsbUJBQW1CLENBQUMsTUFBVyxFQUFFLFdBQW1CLEVBQUUsUUFBMEIsRUFBRSxRQUE0QixFQUFFLE1BQTRCO0lBQ3hKLHNDQUFzQztJ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UUFBUSxDQUFDLE1BQU0sRUFBRTtZQUNqQixRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxTQUFTLEtBQUssbUJBQW1CLENBQUMsSUFBSSxFQUFFO29CQUN4QyxPQUFPLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQztpQkFDdEM7cUJBQU0sSUFBSSxTQUFTLEtBQUssbUJBQW1CLENBQUMsSUFBSSxFQUFFO29CQUMvQyxPQUFPLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQztpQkFDdEM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO1lBQzlCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN0RDtJQUNMLENBQUM7SUFDTCxvQkFBQztBQUFELENBQUM7QUFFRCxJQUFLLG1CQUdKO0FBSEQsV0FBSyxtQkFBbUI7SUFDcEIsNkRBQVE7SUFDUiw2REFBUTtBQUNaLENBQUMsRUFISSxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBR3ZCO0FBRUQsSUFBSyxVQUdKO0FBSEQsV0FBSyxVQUFVO0lBQ1gsK0NBQU07SUFDTixpREFBTztBQUNYLENBQUMsRUFISSxVQUFVLEtBQVYsVUFBVSxRQUdkO0FBRUQsSUFBSyxtQkFJSjtBQUpELFdBQUssbUJBQW1CO0lBQ3BCLCtEQUFLO0lBQ0wsaUVBQU07SUFDTixpRUFBTTtBQUNWLENBQUMsRUFKSSxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBSXZCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgeyBpc1RlbXBsYXRlRWxlbWVudCB9IGZyb20gXCJAYmFiZWwvdHlwZXNcIjtcclxuXHJcbmludGVyZmFjZSBNb25hY29XaW5kb3cge1xyXG4gICAgbW9uYWNvOiBhbnk7XHJcbn1cclxuXHJcbmNvbnN0IG1vbmFjb1dpbmRvdyA9ICh3aW5kb3cgYXMgYW55KSBhcyBNb25hY29XaW5kb3c7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJldmlld0NvbW1lbnQge1xyXG4gICAgaWQ/OiBzdHJpbmc7XHJcbiAgICBhdXRob3I6IHN0cmluZztcclxuICAgIGR0OiBEYXRlO1xyXG4gICAgbGluZU51bWJlcjogbnVtYmVyO1xyXG4gICAgdGV4dDogc3RyaW5nO1xyXG4gICAgY29tbWVudHM/OiBSZXZpZXdDb21tZW50W107XHJcbiAgICBkZWxldGVkPzogYm9vbGVhbjtcclxuICAgIC8vIHZpZXdab25lSWQ6IG51bWJlcjtcclxuICAgIC8vIHJlbmRlclN0YXR1czogUmV2aWV3Q29tbWVudFN0YXR1cztcclxuXHJcbiAgICAvLyBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBsaW5lTnVtYmVyOiBudW1iZXIsIGF1dGhvcjogc3RyaW5nLCBkdDogRGF0ZSwgdGV4dDogc3RyaW5nLCBjb21tZW50cz86IFJldmlld0NvbW1lbnRbXSkge1xyXG4gICAgLy8gICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIC8vICAgICB0aGlzLmF1dGhvciA9IGF1dGhvcjtcclxuICAgIC8vICAgICB0aGlzLmR0ID0gZHQ7XHJcbiAgICAvLyAgICAgdGhpcy5saW5lTnVtYmVyID0gbGluZU51bWJlcjtcclxuICAgIC8vICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgLy8gICAgIHRoaXMuY29tbWVudHMgPSBjb21tZW50cyB8fCBbXTtcclxuXHJcbiAgICAvLyAgICAgLy9IQUNLIC0gdGhpcyBpcyBydW50aW1lIHN0YXRlIC0gYW5kIHNob3VsZCBiZSBtb3ZlZFxyXG4gICAgLy8gICAgIHRoaXMuZGVsZXRlZCA9IGZhbHNlO1xyXG5cclxuICAgIC8vIH1cclxufVxyXG5cclxuY2xhc3MgUmV2aWV3Q29tbWVudFN0YXRlIHtcclxuICAgIHZpZXdab25lSWQ6IG51bWJlcjtcclxuICAgIHJlbmRlclN0YXR1czogUmV2aWV3Q29tbWVudFN0YXR1cztcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMubm9ybWFsO1xyXG4gICAgICAgIHRoaXMudmlld1pvbmVJZCA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXZpZXdNYW5hZ2VyKGVkaXRvcjogYW55LCBjdXJyZW50VXNlcjogc3RyaW5nLCBjb21tZW50cz86IFJldmlld0NvbW1lbnRbXSwgb25DaGFuZ2U/OiBPbkNvbW1lbnRzQ2hhbmdlZCwgY29uZmlnPzogUmV2aWV3TWFuYWdlckNvbmZpZyk6IFJldmlld01hbmFnZXIge1xyXG4gICAgLy8od2luZG93IGFzIGFueSkuZWRpdG9yID0gZWRpdG9yOyAgICBcclxuICAgIGNvbnN0IHJtID0gbmV3IFJldmlld01hbmFnZXIoZWRpdG9yLCBjdXJyZW50VXNlciwgb25DaGFuZ2UsIGNvbmZpZyk7XHJcbiAgICBybS5sb2FkKGNvbW1lbnRzIHx8IFtdKTtcclxuICAgIHJldHVybiBybTtcclxufVxyXG5cclxuXHJcbmludGVyZmFjZSBSZXZpZXdDb21tZW50SXRlckl0ZW0ge1xyXG4gICAgZGVwdGg6IG51bWJlcjtcclxuICAgIGNvbW1lbnQ6IFJldmlld0NvbW1lbnQsXHJcbiAgICBjb3VudDogbnVtYmVyLFxyXG4gICAgdmlld1N0YXRlOiBSZXZpZXdDb21tZW50U3RhdGVcclxufVxyXG5cclxuaW50ZXJmYWNlIE9uQ29tbWVudHNDaGFuZ2VkIHtcclxuICAgIChjb21tZW50czogUmV2aWV3Q29tbWVudFtdKTogdm9pZFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJldmlld01hbmFnZXJDb25maWcge1xyXG4gICAgZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZT86IGJvb2xlYW47XHJcbiAgICBsaW5lSGVpZ2h0PzogbnVtYmVyO1xyXG4gICAgY29tbWVudEluZGVudD86IG51bWJlcjtcclxuICAgIGNvbW1lbnRJbmRlbnRPZmZzZXQ/OiBudW1iZXI7XHJcbiAgICBlZGl0QnV0dG9uQWRkVGV4dD86IHN0cmluZztcclxuICAgIGVkaXRCdXR0b25SZW1vdmVUZXh0Pzogc3RyaW5nO1xyXG4gICAgZWRpdEJ1dHRvbk9mZnNldD86IHN0cmluZztcclxuICAgIHJldmlld0NvbW1lbnRJY29uU2VsZWN0Pzogc3RyaW5nO1xyXG4gICAgcmV2aWV3Q29tbWVudEljb25BY3RpdmU/OiBzdHJpbmc7XHJcbiAgICBzaG93SW5SdWxlcj86IGJvb2xlYW5cclxufVxyXG5cclxuaW50ZXJmYWNlIFJldmlld01hbmFnZXJDb25maWdQcml2YXRlIHtcclxuICAgIGVkaXRCdXR0b25FbmFibGVSZW1vdmU6IGJvb2xlYW47XHJcbiAgICBsaW5lSGVpZ2h0OiBudW1iZXI7XHJcbiAgICBjb21tZW50SW5kZW50OiBudW1iZXI7XHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0OiBudW1iZXI7XHJcbiAgICBlZGl0QnV0dG9uQWRkVGV4dDogc3RyaW5nO1xyXG4gICAgZWRpdEJ1dHRvblJlbW92ZVRleHQ6IHN0cmluZztcclxuICAgIGVkaXRCdXR0b25PZmZzZXQ6IHN0cmluZztcclxuICAgIHNob3dJblJ1bGVyOiBib29sZWFuO1xyXG59XHJcblxyXG5cclxuY29uc3QgZGVmYXVsdFJldmlld01hbmFnZXJDb25maWc6IFJldmlld01hbmFnZXJDb25maWdQcml2YXRlID0ge1xyXG4gICAgZWRpdEJ1dHRvbk9mZnNldDogJy0xMHB4JyxcclxuICAgIGVkaXRCdXR0b25BZGRUZXh0OiAnUmVwbHknLFxyXG4gICAgZWRpdEJ1dHRvblJlbW92ZVRleHQ6ICdSZW1vdmUnLFxyXG4gICAgZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZTogdHJ1ZSxcclxuICAgIGxpbmVIZWlnaHQ6IDE5LFxyXG4gICAgY29tbWVudEluZGVudDogMjAsXHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0OiAyMCxcclxuICAgIHNob3dJblJ1bGVyOiB0cnVlLFxyXG59O1xyXG5cclxuXHJcbmNsYXNzIFJldmlld01hbmFnZXIge1xyXG4gICAgY3VycmVudFVzZXI6IHN0cmluZztcclxuICAgIGVkaXRvcjogYW55O1xyXG4gICAgY29tbWVudHM6IFJldmlld0NvbW1lbnRbXTtcclxuICAgIGNvbW1lbnRTdGF0ZTogeyBbcmV2aWV3Q29tbWVudElkOiBzdHJpbmddOiBSZXZpZXdDb21tZW50U3RhdGUgfTtcclxuXHJcbiAgICBhY3RpdmVDb21tZW50PzogUmV2aWV3Q29tbWVudDtcclxuICAgIHdpZGdldElubGluZVRvb2xiYXI6IGFueTtcclxuICAgIHdpZGdldElubGluZUNvbW1lbnRFZGl0b3I6IGFueTtcclxuICAgIG9uQ2hhbmdlOiBPbkNvbW1lbnRzQ2hhbmdlZDtcclxuICAgIGVkaXRvck1vZGU6IEVkaXRvck1vZGU7XHJcbiAgICBjb25maWc6IFJldmlld01hbmFnZXJDb25maWdQcml2YXRlO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlZGl0b3I6IGFueSwgY3VycmVudFVzZXI6IHN0cmluZywgb25DaGFuZ2U6IE9uQ29tbWVudHNDaGFuZ2VkLCBjb25maWc/OiBSZXZpZXdNYW5hZ2VyQ29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlciA9IGN1cnJlbnRVc2VyO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb21tZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY29tbWVudFN0YXRlID0ge307XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyID0gbnVsbDtcclxuICAgICAgICB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcclxuICAgICAgICB0aGlzLmVkaXRvck1vZGUgPSBFZGl0b3JNb2RlLnRvb2xiYXI7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSB7IC4uLmRlZmF1bHRSZXZpZXdNYW5hZ2VyQ29uZmlnLCAuLi4oY29uZmlnIHx8IHt9KSB9O1xyXG5cclxuICAgICAgICB0aGlzLmFkZEFjdGlvbnMoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlubGluZVRvb2xiYXJXaWRnZXQoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlubGluZUVkaXRvcldpZGdldCgpO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5vbk1vdXNlRG93bih0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmVkaXRvci5jaGFuZ2VWaWV3Wm9uZXMoKGNoYW5nZUFjY2Vzc29yKSA9PiB7ICAgICAgIFxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIHRoZSBleGlzdGluZyBjb21tZW50cyAgICAgXHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgb2xkSXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkSXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUob2xkSXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH0gICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29tbWVudHMgPSBjb21tZW50cyB8fCBbXTtcclxuICAgICAgICAgICAgdGhpcy5jb21tZW50U3RhdGUgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGFsbCBjb21tZW50cyB0aGF0IHRoZXkgaGF2ZSB1bmlxdWUgYW5kIHByZXNlbnQgaWQnc1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxJZCA9IGl0ZW0uY29tbWVudC5pZDtcclxuICAgICAgICAgICAgICAgIGxldCBjaGFuZ2VkSWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoIWl0ZW0uY29tbWVudC5pZCB8fCB0aGlzLmNvbW1lbnRTdGF0ZVtpdGVtLmNvbW1lbnQuaWRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21tZW50LmlkID0gJ2F1dG9pZC0nICsgTWF0aC5yYW5kb20oKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkSWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VkSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NvbW1lbnQuSWQgQXNzaWduZWQ6ICcsIG9yaWdpbmFsSWQsICcgY2hhbmdlZCB0byB0byAnLCBpdGVtLmNvbW1lbnQuaWQsICcgZHVlIHRvIGNvbGxpc2lvbicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudFN0YXRlW2l0ZW0uY29tbWVudC5pZF0gPSBuZXcgUmV2aWV3Q29tbWVudFN0YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdDb21tZW50cyBMb2FkZWQ6ICcsIHRoaXMuY29tbWVudHMubGVuZ3RoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRCdXR0b25zRWxlbWVudCgpIHtcclxuICAgICAgICB2YXIgcm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHJvb3QuY2xhc3NOYW1lID0gJ2VkaXRCdXR0b25zQ29udGFpbmVyJ1xyXG5cclxuICAgICAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XHJcbiAgICAgICAgYWRkLmhyZWYgPSAnIydcclxuICAgICAgICBhZGQuaW5uZXJUZXh0ID0gdGhpcy5jb25maWcuZWRpdEJ1dHRvbkFkZFRleHQ7XHJcbiAgICAgICAgYWRkLm5hbWUgPSAnYWRkJztcclxuICAgICAgICBhZGQuY2xhc3NOYW1lID0gJ2VkaXRCdXR0b25BZGQnXHJcbiAgICAgICAgYWRkLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLmVkaXRvcilcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOy8vIFN1cHByZXNzIG5hdmlnYXRpb25cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoYWRkKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmVkaXRCdXR0b25FbmFibGVSZW1vdmUpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3BhY2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHNwYWNlci5pbm5lclRleHQgPSAnICdcclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChzcGFjZXIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpIGFzIEhUTUxBbmNob3JFbGVtZW50O1xyXG4gICAgICAgICAgICByZW1vdmUuaHJlZiA9ICcjJ1xyXG4gICAgICAgICAgICByZW1vdmUuaW5uZXJUZXh0ID0gdGhpcy5jb25maWcuZWRpdEJ1dHRvblJlbW92ZVRleHQ7XHJcbiAgICAgICAgICAgIHJlbW92ZS5uYW1lID0gJ3JlbW92ZSc7XHJcbiAgICAgICAgICAgIHJlbW92ZS5jbGFzc05hbWUgPSAnZWRpdEJ1dHRvblJlbW92ZSdcclxuICAgICAgICAgICAgcmVtb3ZlLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNvbW1lbnQodGhpcy5hY3RpdmVDb21tZW50KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gU3VwcHJlc3MgbmF2aWdhdGlvblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVtb3ZlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvb3Quc3R5bGUubWFyZ2luTGVmdCA9IHRoaXMuY29uZmlnLmVkaXRCdXR0b25PZmZzZXQ7XHJcbiAgICAgICAgcmV0dXJuIHJvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ2FuY2VsKCkge1xyXG4gICAgICAgIHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLnRvb2xiYXIpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU2F2ZSgpIHtcclxuICAgICAgICBjb25zdCByID0gdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUudG9vbGJhcik7XHJcbiAgICAgICAgdGhpcy5hZGRDb21tZW50KHIubGluZU51bWJlciwgci50ZXh0KTtcclxuICAgICAgICB0aGlzLmVkaXRvci5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRvckVsZW1lbnQoKSB7XHJcbiAgICAgICAgdmFyIHJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgcm9vdC5jbGFzc05hbWUgPSBcInJldmlld0NvbW1lbnRFZGl0XCJcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xyXG4gICAgICAgIHRleHRhcmVhLmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudFRleHRcIjtcclxuICAgICAgICB0ZXh0YXJlYS5pbm5lclRleHQgPSAnJztcclxuICAgICAgICB0ZXh0YXJlYS5uYW1lID0gJ3RleHQnO1xyXG4gICAgICAgIHRleHRhcmVhLm9ua2V5cHJlc3MgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5jb2RlID09PSBcIkVudGVyXCIgJiYgZS5jdHJsS2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNhdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGV4dGFyZWEub25rZXlkb3duID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFc2NhcGVcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDYW5jZWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2F2ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgICAgIHNhdmUuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50U2F2ZVwiO1xyXG4gICAgICAgIHNhdmUuaW5uZXJUZXh0ID0gJ1NhdmUnO1xyXG4gICAgICAgIHNhdmUubmFtZSA9ICdzYXZlJztcclxuICAgICAgICBzYXZlLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU2F2ZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgICAgIGNhbmNlbC5jbGFzc05hbWUgPSBcInJldmlld0NvbW1lbnRDYW5jZWxcIjtcclxuICAgICAgICBjYW5jZWwuaW5uZXJUZXh0ID0gJ0NhbmNlbCc7XHJcbiAgICAgICAgY2FuY2VsLm5hbWUgPSAnY2FuY2VsJztcclxuICAgICAgICBjYW5jZWwub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDYW5jZWwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQodGV4dGFyZWEpO1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoc2F2ZSk7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjYW5jZWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gcm9vdFxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZVRvb2xiYXJXaWRnZXQoKSB7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uc0VsZW1lbnQgPSB0aGlzLmNyZWF0ZUlubGluZUVkaXRCdXR0b25zRWxlbWVudCgpO1xyXG5cclxuICAgICAgICB0aGlzLndpZGdldElubGluZVRvb2xiYXIgPSB7XHJcbiAgICAgICAgICAgIGFsbG93RWRpdG9yT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgICAgIGdldElkOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3dpZGdldElubGluZVRvb2xiYXInO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREb21Ob2RlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYnV0dG9uc0VsZW1lbnQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ICYmIHRoaXMuZWRpdG9yTW9kZSA9PSBFZGl0b3JNb2RlLnRvb2xiYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmZXJlbmNlOiBbbW9uYWNvV2luZG93Lm1vbmFjby5lZGl0b3IuQ29udGVudFdpZGdldFBvc2l0aW9uUHJlZmVyZW5jZS5CRUxPV11cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRDb250ZW50V2lkZ2V0KHRoaXMud2lkZ2V0SW5saW5lVG9vbGJhcik7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5saW5lRWRpdG9yV2lkZ2V0KCkge1xyXG4gICAgICAgIGNvbnN0IGVkaXRvckVsZW1lbnQgPSB0aGlzLmNyZWF0ZUlubGluZUVkaXRvckVsZW1lbnQoKTtcclxuICAgICAgICB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IgPSB7XHJcbiAgICAgICAgICAgIGFsbG93RWRpdG9yT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgICAgIGdldElkOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3dpZGdldElubGluZUVkaXRvcic7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldERvbU5vZGU6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlZGl0b3JFbGVtZW50O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRQb3NpdGlvbjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZWRpdG9yTW9kZSA9PSBFZGl0b3JNb2RlLmVkaXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBhcmUgdXNpbmcgbmVnYXRpdmUgbWFyZ2luVG9wIHRvIHNoaWZ0IGl0IGFib3ZlIHRoZSBsaW5lIHRvIHRoZSBwcmV2aW91c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5hY3RpdmVDb21tZW50ID8gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgKyAxIDogdGhpcy5lZGl0b3IuZ2V0UG9zaXRpb24oKS5saW5lTnVtYmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZlcmVuY2U6IFttb25hY29XaW5kb3cubW9uYWNvLmVkaXRvci5Db250ZW50V2lkZ2V0UG9zaXRpb25QcmVmZXJlbmNlLkJFTE9XXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBY3RpdmVDb21tZW50KGNvbW1lbnQ6IFJldmlld0NvbW1lbnQpIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKCdzZXRBY3RpdmVDb21tZW50JywgY29tbWVudCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxpbmVOdW1iZXJzVG9NYWtlRGlydHkgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ICYmICghY29tbWVudCB8fCB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciAhPT0gY29tbWVudC5saW5lTnVtYmVyKSkge1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVyc1RvTWFrZURpcnR5LnB1c2godGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29tbWVudCkge1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVyc1RvTWFrZURpcnR5LnB1c2goY29tbWVudC5saW5lTnVtYmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudCA9IGNvbW1lbnQ7XHJcbiAgICAgICAgaWYgKGxpbmVOdW1iZXJzVG9NYWtlRGlydHkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmZpbHRlckFuZE1hcENvbW1lbnRzKGxpbmVOdW1iZXJzVG9NYWtlRGlydHksIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnZpZXdTdGF0ZS5yZW5kZXJTdGF0dXMgPSBSZXZpZXdDb21tZW50U3RhdHVzLmRpcnR5XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsYXlvdXRJbmxpbmVUb29sYmFyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgY29uc3QgdG9vbGJhclJvb3QgPSB0aGlzLndpZGdldElubGluZVRvb2xiYXIuZ2V0RG9tTm9kZSgpIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgICB0b29sYmFyUm9vdC5zdHlsZS5tYXJnaW5Ub3AgPSBgLSR7dGhpcy5jYWxjdWxhdGVNYXJnaW5Ub3BPZmZzZXQoMil9cHhgO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVkaXRvci5sYXlvdXRDb250ZW50V2lkZ2V0KHRoaXMud2lkZ2V0SW5saW5lVG9vbGJhcik7XHJcbiAgICB9XHJcblxyXG4gICAgZmlsdGVyQW5kTWFwQ29tbWVudHMobGluZU51bWJlcnM6IG51bWJlcltdLCBmbjogeyAoY29tbWVudDogUmV2aWV3Q29tbWVudEl0ZXJJdGVtKTogdm9pZCB9KSB7XHJcbiAgICAgICAgY29uc3QgY29tbWVudHMgPSB0aGlzLml0ZXJhdGVDb21tZW50cygpO1xyXG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjb21tZW50cykge1xyXG4gICAgICAgICAgICBpZiAobGluZU51bWJlcnMuaW5kZXhPZihjLmNvbW1lbnQubGluZU51bWJlcikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgZm4oYyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlTW91c2VEb3duKGV2OiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKCdoYW5kbGVNb3VzZURvd24nLCB0aGlzLmFjdGl2ZUNvbW1lbnQsIGV2LnRhcmdldC5lbGVtZW50LCBldi50YXJnZXQuZGV0YWlsKTtcclxuXHJcbiAgICAgICAgaWYgKGV2LnRhcmdldC5lbGVtZW50LnRhZ05hbWUgPT09ICdURVhUQVJFQScgfHwgZXYudGFyZ2V0LmVsZW1lbnQudGFnTmFtZSA9PT0gJ0JVVFRPTicgfHwgZXYudGFyZ2V0LmVsZW1lbnQudGFnTmFtZSA9PT0gJ0EnKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBsZXQgYWN0aXZlQ29tbWVudDogUmV2aWV3Q29tbWVudCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmRldGFpbCAmJiBldi50YXJnZXQuZGV0YWlsLnZpZXdab25lSWQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCA9PSBldi50YXJnZXQuZGV0YWlsLnZpZXdab25lSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ29tbWVudCA9IGl0ZW0uY29tbWVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ29tbWVudChhY3RpdmVDb21tZW50KTtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUudG9vbGJhcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2FsY3VsYXRlTWFyZ2luVG9wT2Zmc2V0KGV4dHJhT2Zmc2V0TGluZXM6IG51bWJlciA9IDEpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBpZHggPSAwO1xyXG4gICAgICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICAgICAgbGV0IG1hcmdpblRvcDogbnVtYmVyID0gMDtcclxuICAgICAgICBjb25zdCBsaW5lSGVpZ2h0ID0gdGhpcy5jb25maWcubGluZUhlaWdodDsvL0ZJWE1FIC0gTWFnaWMgbnVtYmVyIGZvciBsaW5lIGhlaWdodCAgICAgICAgICAgIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudC5saW5lTnVtYmVyID09IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50ID09IHRoaXMuYWN0aXZlQ29tbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkeCA9IGNvdW50ICsgMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYXJnaW5Ub3AgPSAoKGV4dHJhT2Zmc2V0TGluZXMgKyBjb3VudCAtIGlkeCkgKiBsaW5lSGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtYXJnaW5Ub3A7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRFZGl0b3JNb2RlKG1vZGU6IEVkaXRvck1vZGUpOiB7IGxpbmVOdW1iZXI6IG51bWJlciwgdGV4dDogc3RyaW5nIH0ge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3NldEVkaXRvck1vZGUnLCB0aGlzLmFjdGl2ZUNvbW1lbnQpO1xyXG5cclxuICAgICAgICBjb25zdCBsaW5lTnVtYmVyID0gdGhpcy5hY3RpdmVDb21tZW50ID8gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgOiB0aGlzLmVkaXRvci5nZXRQb3NpdGlvbigpLmxpbmVOdW1iZXI7XHJcbiAgICAgICAgdGhpcy5lZGl0b3JNb2RlID0gbW9kZTtcclxuXHJcbiAgICAgICAgY29uc3QgZWRpdG9yUm9vdCA9IHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvci5nZXREb21Ob2RlKCkgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgZWRpdG9yUm9vdC5zdHlsZS5tYXJnaW5Ub3AgPSBgLSR7dGhpcy5jYWxjdWxhdGVNYXJnaW5Ub3BPZmZzZXQoKX1weGA7XHJcblxyXG4gICAgICAgIHRoaXMubGF5b3V0SW5saW5lVG9vbGJhcigpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yKTtcclxuXHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvci5nZXREb21Ob2RlKCk7XHJcbiAgICAgICAgY29uc3QgdGV4dGFyZWEgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJURVhUQVJFQVtuYW1lPSd0ZXh0J11cIik7XHJcblxyXG4gICAgICAgIGlmIChtb2RlID09IEVkaXRvck1vZGUuZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRleHRhcmVhLnZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8vSEFDSyAtIGJlY2F1c2UgdGhlIGV2ZW50IGluIG1vbmFjbyBkb2Vzbid0IGhhdmUgcHJldmVudGRlZmF1bHQgd2hpY2ggbWVhbnMgZWRpdG9yIHRha2VzIGZvY3VzIGJhY2suLi4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0ZXh0YXJlYS5mb2N1cygpLCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdGV4dDogdGV4dGFyZWEudmFsdWUsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIG5leHRDb21tZW50SWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke25ldyBEYXRlKCkudG9TdHJpbmcoKX0tJHt0aGlzLmN1cnJlbnRVc2VyfWA7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ29tbWVudChsaW5lTnVtYmVyOiBudW1iZXIsIHRleHQ6IHN0cmluZyk6IFJldmlld0NvbW1lbnQge1xyXG4gICAgICAgIGNvbnN0IGxuID0gdGhpcy5hY3RpdmVDb21tZW50ID8gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgOiBsaW5lTnVtYmVyO1xyXG4gICAgICAgIGNvbnN0IGNvbW1lbnQ6IFJldmlld0NvbW1lbnQgPSB7XHJcbiAgICAgICAgICAgIGlkOiB0aGlzLm5leHRDb21tZW50SWQoKSxcclxuICAgICAgICAgICAgbGluZU51bWJlcjogbG4sXHJcbiAgICAgICAgICAgIGF1dGhvcjogdGhpcy5jdXJyZW50VXNlcixcclxuICAgICAgICAgICAgZHQ6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY29tbWVudFN0YXRlW2NvbW1lbnQuaWRdID0gbmV3IFJldmlld0NvbW1lbnRTdGF0ZSgpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5hY3RpdmVDb21tZW50LmNvbW1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUNvbW1lbnQuY29tbWVudHMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNvbW1lbnQuY29tbWVudHMucHVzaChjb21tZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRzLnB1c2goY29tbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZpbHRlckFuZE1hcENvbW1lbnRzKFtsbl0sIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0udmlld1N0YXRlLnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMuZGlydHk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKClcclxuICAgICAgICB0aGlzLmxheW91dElubGluZVRvb2xiYXIoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLmNvbW1lbnRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb21tZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGl0ZXJhdGVDb21tZW50cyhjb21tZW50cz86IFJldmlld0NvbW1lbnRbXSwgZGVwdGg/OiBudW1iZXIsIGNvdW50QnlMaW5lTnVtYmVyPzogYW55LCByZXN1bHRzPzogUmV2aWV3Q29tbWVudEl0ZXJJdGVtW10pIHtcclxuICAgICAgICByZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcclxuICAgICAgICBkZXB0aCA9IGRlcHRoIHx8IDA7XHJcbiAgICAgICAgY29tbWVudHMgPSBjb21tZW50cyB8fCB0aGlzLmNvbW1lbnRzO1xyXG4gICAgICAgIGNvdW50QnlMaW5lTnVtYmVyID0gY291bnRCeUxpbmVOdW1iZXIgfHwge307XHJcbiAgICAgICAgaWYgKGNvbW1lbnRzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgY29tbWVudCBvZiBjb21tZW50cykge1xyXG4gICAgICAgICAgICAgICAgY291bnRCeUxpbmVOdW1iZXJbY29tbWVudC5saW5lTnVtYmVyXSA9IChjb3VudEJ5TGluZU51bWJlcltjb21tZW50LmxpbmVOdW1iZXJdIHx8IDApICsgMVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBkZXB0aCxcclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiBjb3VudEJ5TGluZU51bWJlcltjb21tZW50LmxpbmVOdW1iZXJdLFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdTdGF0ZTogdGhpcy5jb21tZW50U3RhdGVbY29tbWVudC5pZF1cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbW1lbnQuY29tbWVudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZXJhdGVDb21tZW50cyhjb21tZW50LmNvbW1lbnRzLCBkZXB0aCArIDEsIGNvdW50QnlMaW5lTnVtYmVyLCByZXN1bHRzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ29tbWVudChjb21tZW50OiBSZXZpZXdDb21tZW50KSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKFtjb21tZW50XSkpIHtcclxuICAgICAgICAgICAgaXRlbS5jb21tZW50LmRlbGV0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ID09IGNvbW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDb21tZW50KG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLmxheW91dElubGluZVRvb2xiYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMub25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLmNvbW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVmcmVzaENvbW1lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmNoYW5nZVZpZXdab25lcygoY2hhbmdlQWNjZXNzb3IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGluZU51bWJlcnM6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LmRlbGV0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdab25lLkRlbGV0ZScsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUoaXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0udmlld1N0YXRlLnJlbmRlclN0YXR1cyA9PT0gUmV2aWV3Q29tbWVudFN0YXR1cy5oaWRkZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdab25lLkhpZGRlbicsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUoaXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLnZpZXdTdGF0ZS5yZW5kZXJTdGF0dXMgPT09IFJldmlld0NvbW1lbnRTdGF0dXMuZGlydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdab25lLkRpcnR5JywgaXRlbS5jb21tZW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQWNjZXNzb3IucmVtb3ZlWm9uZShpdGVtLnZpZXdTdGF0ZS52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnZpZXdTdGF0ZS52aWV3Wm9uZUlkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnZpZXdTdGF0ZS5yZW5kZXJTdGF0dXMgPSBSZXZpZXdDb21tZW50U3RhdHVzLm5vcm1hbDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdab25lLkNyZWF0ZScsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXJzW2l0ZW0uY29tbWVudC5saW5lTnVtYmVyXSA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvbU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IHRoaXMuYWN0aXZlQ29tbWVudCA9PSBpdGVtLmNvbW1lbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc3R5bGUubWFyZ2luTGVmdCA9ICh0aGlzLmNvbmZpZy5jb21tZW50SW5kZW50ICogKGl0ZW0uZGVwdGggKyAxKSkgKyB0aGlzLmNvbmZpZy5jb21tZW50SW5kZW50T2Zmc2V0ICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUnO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuY2xhc3NOYW1lID0gaXNBY3RpdmUgPyAncmV2aWV3Q29tbWVudCByZXZpZXdDb21tZW50LWFjdGl2ZScgOiAncmV2aWV3Q29tbWVudCByZXZpZXdDb21tZW50LWluYWN0aXZlJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvci5jbGFzc05hbWUgPSAncmV2aWV3Q29tbWVudC1hdXRob3InXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yLmlubmVyVGV4dCA9IGl0ZW0uY29tbWVudC5hdXRob3IgfHwgJyAnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBkdC5jbGFzc05hbWUgPSAncmV2aWV3Q29tbWVudC1kdCdcclxuICAgICAgICAgICAgICAgICAgICBkdC5pbm5lclRleHQgPSBpdGVtLmNvbW1lbnQuZHQudG9Mb2NhbGVTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LmNsYXNzTmFtZSA9ICdyZXZpZXdDb21tZW50LXRleHQnXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5pbm5lclRleHQgPSBpdGVtLmNvbW1lbnQudGV4dDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChkdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChhdXRob3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQodGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQgPSBjaGFuZ2VBY2Nlc3Nvci5hZGRab25lKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXJMaW5lTnVtYmVyOiBpdGVtLmNvbW1lbnQubGluZU51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0SW5MaW5lczogMSwgLy9UT0RPIC0gRmlndXJlIG91dCBpZiBtdWx0aS1saW5lP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlOiBkb21Ob2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdXBwcmVzc01vdXNlRG93bjogdHJ1ZSAvLyBUaGlzIHN0b3BzIGZvY3VzIGJlaW5nIGxvc3QgdGhlIGVkaXRvciAtIG1lYW5pbmcga2V5Ym9hcmQgc2hvcnRjdXRzIGtlZXBzIHdvcmtpbmdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLnNob3dJblJ1bGVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZWNvcmF0b3JzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGxuIGluIGxpbmVOdW1iZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVjb3JhdG9ycy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IG5ldyBtb25hY29XaW5kb3cubW9uYWNvLlJhbmdlKGxuLCAwLCBsbiwgMCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzV2hvbGVMaW5lOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcnZpZXdSdWxlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcInJlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhcmtDb2xvcjogXCJncmVlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiA3XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLmRlbHRhRGVjb3JhdGlvbnMoW10sIGRlY29yYXRvcnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQWN0aW9ucygpIHtcclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRBY3Rpb24oe1xyXG4gICAgICAgICAgICBpZDogJ215LXVuaXF1ZS1pZC1hZGQnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ0FkZCBDb21tZW50JyxcclxuICAgICAgICAgICAga2V5YmluZGluZ3M6IFtcclxuICAgICAgICAgICAgICAgIG1vbmFjb1dpbmRvdy5tb25hY28uS2V5TW9kLkN0cmxDbWQgfCBtb25hY29XaW5kb3cubW9uYWNvLktleUNvZGUuRjEwLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwcmVjb25kaXRpb246IG51bGwsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdDb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudUdyb3VwSWQ6ICduYXZpZ2F0aW9uJyxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVPcmRlcjogMCxcclxuXHJcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUuZWRpdG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRBY3Rpb24oe1xyXG4gICAgICAgICAgICBpZDogJ215LXVuaXF1ZS1pZC1uZXh0JyxcclxuICAgICAgICAgICAgbGFiZWw6ICdOZXh0IENvbW1lbnQnLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nczogW1xyXG4gICAgICAgICAgICAgICAgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlNb2QuQ3RybENtZCB8IG1vbmFjb1dpbmRvdy5tb25hY28uS2V5Q29kZS5GMTIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHByZWNvbmRpdGlvbjogbnVsbCxcclxuICAgICAgICAgICAga2V5YmluZGluZ0NvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51R3JvdXBJZDogJ25hdmlnYXRpb24nLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudU9yZGVyOiAwLjEsXHJcblxyXG4gICAgICAgICAgICBydW46ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUb0NvbW1lbnQoTmF2aWdhdGlvbkRpcmVjdGlvbi5uZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRBY3Rpb24oe1xyXG4gICAgICAgICAgICBpZDogJ215LXVuaXF1ZS1pZC1wcmV2JyxcclxuICAgICAgICAgICAgbGFiZWw6ICdQcmV2IENvbW1lbnQnLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nczogW1xyXG4gICAgICAgICAgICAgICAgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlNb2QuQ3RybENtZCB8IG1vbmFjb1dpbmRvdy5tb25hY28uS2V5Q29kZS5GMTEsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHByZWNvbmRpdGlvbjogbnVsbCxcclxuICAgICAgICAgICAga2V5YmluZGluZ0NvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51R3JvdXBJZDogJ25hdmlnYXRpb24nLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudU9yZGVyOiAwLjEsXHJcblxyXG4gICAgICAgICAgICBydW46ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUb0NvbW1lbnQoTmF2aWdhdGlvbkRpcmVjdGlvbi5wcmV2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlVG9Db21tZW50KGRpcmVjdGlvbjogTmF2aWdhdGlvbkRpcmVjdGlvbikge1xyXG4gICAgICAgIGxldCBjdXJyZW50TGluZSA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCkge1xyXG4gICAgICAgICAgICBjdXJyZW50TGluZSA9IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gdGhpcy5lZGl0b3IuZ2V0UG9zaXRpb24oKS5saW5lTnVtYmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29tbWVudHMgPSB0aGlzLmNvbW1lbnRzLmZpbHRlcigoYykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBOYXZpZ2F0aW9uRGlyZWN0aW9uLm5leHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjLmxpbmVOdW1iZXIgPiBjdXJyZW50TGluZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IE5hdmlnYXRpb25EaXJlY3Rpb24ucHJldikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGMubGluZU51bWJlciA8IGN1cnJlbnRMaW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChjb21tZW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29tbWVudHMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWdhdGlvbkRpcmVjdGlvbi5uZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEubGluZU51bWJlciAtIGIubGluZU51bWJlcjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBOYXZpZ2F0aW9uRGlyZWN0aW9uLnByZXYpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYi5saW5lTnVtYmVyIC0gYS5saW5lTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSBjb21tZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDb21tZW50KGNvbW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMubGF5b3V0SW5saW5lVG9vbGJhcigpO1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRvci5yZXZlYWxMaW5lSW5DZW50ZXIoY29tbWVudC5saW5lTnVtYmVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmVudW0gTmF2aWdhdGlvbkRpcmVjdGlvbiB7XHJcbiAgICBuZXh0ID0gMSxcclxuICAgIHByZXYgPSAyXHJcbn1cclxuXHJcbmVudW0gRWRpdG9yTW9kZSB7XHJcbiAgICBlZGl0b3IsXHJcbiAgICB0b29sYmFyXHJcbn1cclxuXHJcbmVudW0gUmV2aWV3Q29tbWVudFN0YXR1cyB7XHJcbiAgICBkaXJ0eSxcclxuICAgIGhpZGRlbixcclxuICAgIG5vcm1hbFxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ==