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
};
var ReviewManager = /** @class */ (function () {
    function ReviewManager(editor, currentUser, onChange, config) {
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = null;
        this.comments = [];
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
            return true; // Suppress navigation
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
                return true; // Suppress navigation
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
            this.filterAndMapComments(lineNumbersToMakeDirty, function (comment) { comment.renderStatus = ReviewCommentStatus.dirty; });
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
                fn(c.comment);
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
        var comment = null;
        if (this.activeComment) {
            comment = new ReviewComment(this.nextCommentId(), this.activeComment.lineNumber, this.currentUser, new Date(), text);
            this.activeComment.comments.push(comment);
            this.filterAndMapComments([lineNumber], function (comment) {
                comment.renderStatus = ReviewCommentStatus.dirty;
            });
        }
        else {
            comment = new ReviewComment(this.nextCommentId(), lineNumber, this.currentUser, new Date(), text);
            this.comments.push(comment);
        }
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
                    item.comment.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: item.comment.lineNumber,
                        heightInLines: 1,
                        domNode: domNode,
                        suppressMouseDown: true // This stops focus being lost the editor - meaning keyboard shortcuts keeps working
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01vbmFjb0VkaXRvckNvZGVSZXZpZXcvLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUVBLElBQU0sWUFBWSxHQUFJLE1BQThCLENBQUM7QUFFckQ7SUFZSSx1QkFBWSxFQUFVLEVBQUUsVUFBa0IsRUFBRSxNQUFjLEVBQUUsRUFBUSxFQUFFLElBQVksRUFBRSxRQUEwQjtRQUMxRyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENB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QUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO1lBQzlCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN0RDtJQUNMLENBQUM7SUFDTCxvQkFBQztBQUFELENBQUM7QUFFRCxJQUFLLG1CQUdKO0FBSEQsV0FBSyxtQkFBbUI7SUFDcEIsNkRBQVE7SUFDUiw2REFBUTtBQUNaLENBQUMsRUFISSxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBR3ZCO0FBRUQsSUFBSyxVQUdKO0FBSEQsV0FBSyxVQUFVO0lBQ1gsK0NBQU07SUFDTixpREFBTztBQUNYLENBQUMsRUFISSxVQUFVLEtBQVYsVUFBVSxRQUdkO0FBRUQsSUFBSyxtQkFJSjtBQUpELFdBQUssbUJBQW1CO0lBQ3BCLCtEQUFLO0lBQ0wsaUVBQU07SUFDTixpRUFBTTtBQUNWLENBQUMsRUFKSSxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBSXZCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbnRlcmZhY2UgTW9uYWNvV2luZG93IHtcclxuICAgIG1vbmFjbzogYW55O1xyXG59XHJcblxyXG5jb25zdCBtb25hY29XaW5kb3cgPSAod2luZG93IGFzIGFueSkgYXMgTW9uYWNvV2luZG93O1xyXG5cclxuZXhwb3J0IGNsYXNzIFJldmlld0NvbW1lbnQge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIGF1dGhvcjogc3RyaW5nO1xyXG4gICAgZHQ6IERhdGU7XHJcbiAgICBsaW5lTnVtYmVyOiBudW1iZXI7XHJcbiAgICB0ZXh0OiBzdHJpbmc7XHJcbiAgICBjb21tZW50czogUmV2aWV3Q29tbWVudFtdO1xyXG5cclxuICAgIGRlbGV0ZWQ6IGJvb2xlYW47XHJcbiAgICB2aWV3Wm9uZUlkOiBudW1iZXI7XHJcbiAgICByZW5kZXJTdGF0dXM6IFJldmlld0NvbW1lbnRTdGF0dXM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbGluZU51bWJlcjogbnVtYmVyLCBhdXRob3I6IHN0cmluZywgZHQ6IERhdGUsIHRleHQ6IHN0cmluZywgY29tbWVudHM/OiBSZXZpZXdDb21tZW50W10pIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5hdXRob3IgPSBhdXRob3I7XHJcbiAgICAgICAgdGhpcy5kdCA9IGR0O1xyXG4gICAgICAgIHRoaXMubGluZU51bWJlciA9IGxpbmVOdW1iZXI7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICB0aGlzLmNvbW1lbnRzID0gY29tbWVudHMgfHwgW107XHJcblxyXG4gICAgICAgIC8vSEFDSyAtIHRoaXMgaXMgcnVudGltZSBzdGF0ZSAtIGFuZCBzaG91bGQgYmUgbW92ZWRcclxuICAgICAgICB0aGlzLmRlbGV0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMubm9ybWFsO1xyXG4gICAgICAgIHRoaXMudmlld1pvbmVJZCA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXZpZXdNYW5hZ2VyKGVkaXRvcjogYW55LCBjdXJyZW50VXNlcjogc3RyaW5nLCBjb21tZW50cz86IFJldmlld0NvbW1lbnRbXSwgb25DaGFuZ2U/OiBPbkNvbW1lbnRzQ2hhbmdlZCwgY29uZmlnPzogUmV2aWV3TWFuYWdlckNvbmZpZykge1xyXG4gICAgLy8od2luZG93IGFzIGFueSkuZWRpdG9yID0gZWRpdG9yOyAgICBcclxuICAgIGNvbnN0IHJtID0gbmV3IFJldmlld01hbmFnZXIoZWRpdG9yLCBjdXJyZW50VXNlciwgb25DaGFuZ2UsIGNvbmZpZyk7XHJcbiAgICBybS5sb2FkKGNvbW1lbnRzIHx8IFtdKTtcclxuICAgIHJldHVybiBybTtcclxufVxyXG5cclxuXHJcbmludGVyZmFjZSBSZXZpZXdDb21tZW50SXRlckl0ZW0ge1xyXG4gICAgZGVwdGg6IG51bWJlcjtcclxuICAgIGNvbW1lbnQ6IFJldmlld0NvbW1lbnQsXHJcbiAgICBjb3VudDogbnVtYmVyXHJcbn1cclxuXHJcbmludGVyZmFjZSBPbkNvbW1lbnRzQ2hhbmdlZCB7XHJcbiAgICAoY29tbWVudHM6IFJldmlld0NvbW1lbnRbXSk6IHZvaWRcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZXZpZXdNYW5hZ2VyQ29uZmlnIHtcclxuICAgIGVkaXRCdXR0b25FbmFibGVSZW1vdmU/OiBib29sZWFuO1xyXG4gICAgbGluZUhlaWdodD86IG51bWJlcjtcclxuICAgIGNvbW1lbnRJbmRlbnQ/OiBudW1iZXI7XHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0PzogbnVtYmVyO1xyXG4gICAgZWRpdEJ1dHRvbkFkZFRleHQ/OiBzdHJpbmc7XHJcbiAgICBlZGl0QnV0dG9uUmVtb3ZlVGV4dD86IHN0cmluZztcclxuICAgIGVkaXRCdXR0b25PZmZzZXQ/OiBzdHJpbmc7XHJcbiAgICByZXZpZXdDb21tZW50SWNvblNlbGVjdD86IHN0cmluZztcclxuICAgIHJldmlld0NvbW1lbnRJY29uQWN0aXZlPzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmV2aWV3TWFuYWdlckNvbmZpZ1ByaXZhdGUge1xyXG4gICAgZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZTogYm9vbGVhbjtcclxuICAgIGxpbmVIZWlnaHQ6IG51bWJlcjtcclxuICAgIGNvbW1lbnRJbmRlbnQ6IG51bWJlcjtcclxuICAgIGNvbW1lbnRJbmRlbnRPZmZzZXQ6IG51bWJlcjtcclxuICAgIGVkaXRCdXR0b25BZGRUZXh0OiBzdHJpbmc7XHJcbiAgICBlZGl0QnV0dG9uUmVtb3ZlVGV4dDogc3RyaW5nO1xyXG4gICAgZWRpdEJ1dHRvbk9mZnNldDogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuY29uc3QgZGVmYXVsdFJldmlld01hbmFnZXJDb25maWc6IFJldmlld01hbmFnZXJDb25maWdQcml2YXRlID0ge1xyXG4gICAgZWRpdEJ1dHRvbk9mZnNldDogJy0xMHB4JyxcclxuICAgIGVkaXRCdXR0b25BZGRUZXh0OiAnUmVwbHknLFxyXG4gICAgZWRpdEJ1dHRvblJlbW92ZVRleHQ6ICdSZW1vdmUnLFxyXG4gICAgZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZTogdHJ1ZSxcclxuICAgIGxpbmVIZWlnaHQ6IDE5LFxyXG4gICAgY29tbWVudEluZGVudDogMjAsXHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0OiAyMCxcclxufTtcclxuXHJcblxyXG5jbGFzcyBSZXZpZXdNYW5hZ2VyIHtcclxuICAgIGN1cnJlbnRVc2VyOiBzdHJpbmc7XHJcbiAgICBlZGl0b3I6IGFueTtcclxuICAgIGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W107XHJcbiAgICBhY3RpdmVDb21tZW50PzogUmV2aWV3Q29tbWVudDtcclxuICAgIHdpZGdldElubGluZVRvb2xiYXI6IGFueTtcclxuICAgIHdpZGdldElubGluZUNvbW1lbnRFZGl0b3I6IGFueTtcclxuICAgIG9uQ2hhbmdlOiBPbkNvbW1lbnRzQ2hhbmdlZDtcclxuICAgIGVkaXRvck1vZGU6IEVkaXRvck1vZGU7XHJcbiAgICBjb25maWc6IFJldmlld01hbmFnZXJDb25maWdQcml2YXRlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVkaXRvcjogYW55LCBjdXJyZW50VXNlcjogc3RyaW5nLCBvbkNoYW5nZTogT25Db21tZW50c0NoYW5nZWQsIGNvbmZpZz86IFJldmlld01hbmFnZXJDb25maWcpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gY3VycmVudFVzZXI7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVDb21tZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbW1lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyID0gbnVsbDtcclxuICAgICAgICB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcclxuICAgICAgICB0aGlzLmVkaXRvck1vZGUgPSBFZGl0b3JNb2RlLnRvb2xiYXI7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSB7IC4uLmRlZmF1bHRSZXZpZXdNYW5hZ2VyQ29uZmlnLCAuLi4oY29uZmlnIHx8IHt9KSB9O1xyXG5cclxuICAgICAgICB0aGlzLmFkZEFjdGlvbnMoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlubGluZVRvb2xiYXJXaWRnZXQoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlubGluZUVkaXRvcldpZGdldCgpO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5vbk1vdXNlRG93bih0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W10pIHtcclxuICAgICAgICB0aGlzLmVkaXRvci5jaGFuZ2VWaWV3Wm9uZXMoKGNoYW5nZUFjY2Vzc29yKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LnZpZXdab25lSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU2hvdWxkIHRoaXMgYmUgaW5zaWRlIHRoaXMgY2FsbGJhY2s/XHJcbiAgICAgICAgICAgIHRoaXMuY29tbWVudHMgPSBjb21tZW50cztcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRCdXR0b25zRWxlbWVudCgpIHtcclxuICAgICAgICB2YXIgcm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHJvb3QuY2xhc3NOYW1lID0gJ2VkaXRCdXR0b25zQ29udGFpbmVyJ1xyXG5cclxuICAgICAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XHJcbiAgICAgICAgYWRkLmhyZWYgPSAnIydcclxuICAgICAgICBhZGQuaW5uZXJUZXh0ID0gdGhpcy5jb25maWcuZWRpdEJ1dHRvbkFkZFRleHQ7XHJcbiAgICAgICAgYWRkLm5hbWUgPSAnYWRkJztcclxuICAgICAgICBhZGQuY2xhc3NOYW1lID0gJ2VkaXRCdXR0b25BZGQnXHJcbiAgICAgICAgYWRkLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLmVkaXRvcilcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7Ly8gU3VwcHJlc3MgbmF2aWdhdGlvblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChhZGQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBzcGFjZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgc3BhY2VyLmlubmVyVGV4dCA9ICcgJ1xyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKHNwYWNlcik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZW1vdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHJlbW92ZS5ocmVmID0gJyMnXHJcbiAgICAgICAgICAgIHJlbW92ZS5pbm5lclRleHQgPSB0aGlzLmNvbmZpZy5lZGl0QnV0dG9uUmVtb3ZlVGV4dDtcclxuICAgICAgICAgICAgcmVtb3ZlLm5hbWUgPSAncmVtb3ZlJztcclxuICAgICAgICAgICAgcmVtb3ZlLmNsYXNzTmFtZSA9ICdlZGl0QnV0dG9uUmVtb3ZlJ1xyXG4gICAgICAgICAgICByZW1vdmUub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ29tbWVudCh0aGlzLmFjdGl2ZUNvbW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7IC8vIFN1cHByZXNzIG5hdmlnYXRpb25cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKHJlbW92ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb290LnN0eWxlLm1hcmdpbkxlZnQgPSB0aGlzLmNvbmZpZy5lZGl0QnV0dG9uT2Zmc2V0O1xyXG4gICAgICAgIHJldHVybiByb290O1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNhbmNlbCgpIHtcclxuICAgICAgICB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS50b29sYmFyKTtcclxuICAgICAgICB0aGlzLmVkaXRvci5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVNhdmUoKSB7XHJcbiAgICAgICAgY29uc3QgciA9IHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLnRvb2xiYXIpO1xyXG4gICAgICAgIHRoaXMuYWRkQ29tbWVudChyLmxpbmVOdW1iZXIsIHIudGV4dCk7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJbmxpbmVFZGl0b3JFbGVtZW50KCkge1xyXG4gICAgICAgIHZhciByb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgIHJvb3QuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50RWRpdFwiXHJcblxyXG4gICAgICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcclxuICAgICAgICB0ZXh0YXJlYS5jbGFzc05hbWUgPSBcInJldmlld0NvbW1lbnRUZXh0XCI7XHJcbiAgICAgICAgdGV4dGFyZWEuaW5uZXJUZXh0ID0gJyc7XHJcbiAgICAgICAgdGV4dGFyZWEubmFtZSA9ICd0ZXh0JztcclxuICAgICAgICB0ZXh0YXJlYS5vbmtleXByZXNzID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFbnRlclwiICYmIGUuY3RybEtleSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTYXZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRleHRhcmVhLm9ua2V5ZG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IFwiRXNjYXBlXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2FuY2VsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNhdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBzYXZlLmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudFNhdmVcIjtcclxuICAgICAgICBzYXZlLmlubmVyVGV4dCA9ICdTYXZlJztcclxuICAgICAgICBzYXZlLm5hbWUgPSAnc2F2ZSc7XHJcbiAgICAgICAgc2F2ZS5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVNhdmUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBjYW5jZWwuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50Q2FuY2VsXCI7XHJcbiAgICAgICAgY2FuY2VsLmlubmVyVGV4dCA9ICdDYW5jZWwnO1xyXG4gICAgICAgIGNhbmNlbC5uYW1lID0gJ2NhbmNlbCc7XHJcbiAgICAgICAgY2FuY2VsLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2FuY2VsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb290LmFwcGVuZENoaWxkKHRleHRhcmVhKTtcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKHNhdmUpO1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2FuY2VsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJvb3RcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJbmxpbmVUb29sYmFyV2lkZ2V0KCkge1xyXG4gICAgICAgIGNvbnN0IGJ1dHRvbnNFbGVtZW50ID0gdGhpcy5jcmVhdGVJbmxpbmVFZGl0QnV0dG9uc0VsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyID0ge1xyXG4gICAgICAgICAgICBhbGxvd0VkaXRvck92ZXJmbG93OiB0cnVlLFxyXG4gICAgICAgICAgICBnZXRJZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd3aWRnZXRJbmxpbmVUb29sYmFyJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0RG9tTm9kZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbnNFbGVtZW50O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRQb3NpdGlvbjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCAmJiB0aGlzLmVkaXRvck1vZGUgPT0gRWRpdG9yTW9kZS50b29sYmFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZmVyZW5jZTogW21vbmFjb1dpbmRvdy5tb25hY28uZWRpdG9yLkNvbnRlbnRXaWRnZXRQb3NpdGlvblByZWZlcmVuY2UuQkVMT1ddXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQ29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZVRvb2xiYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRvcldpZGdldCgpIHtcclxuICAgICAgICBjb25zdCBlZGl0b3JFbGVtZW50ID0gdGhpcy5jcmVhdGVJbmxpbmVFZGl0b3JFbGVtZW50KCk7XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yID0ge1xyXG4gICAgICAgICAgICBhbGxvd0VkaXRvck92ZXJmbG93OiB0cnVlLFxyXG4gICAgICAgICAgICBnZXRJZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd3aWRnZXRJbmxpbmVFZGl0b3InO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREb21Ob2RlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWRpdG9yRWxlbWVudDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0UG9zaXRpb246ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVkaXRvck1vZGUgPT0gRWRpdG9yTW9kZS5lZGl0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgYXJlIHVzaW5nIG5lZ2F0aXZlIG1hcmdpblRvcCB0byBzaGlmdCBpdCBhYm92ZSB0aGUgbGluZSB0byB0aGUgcHJldmlvdXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMuYWN0aXZlQ29tbWVudCA/IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyICsgMSA6IHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmZXJlbmNlOiBbbW9uYWNvV2luZG93Lm1vbmFjby5lZGl0b3IuQ29udGVudFdpZGdldFBvc2l0aW9uUHJlZmVyZW5jZS5CRUxPV11cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRDb250ZW50V2lkZ2V0KHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvcik7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QWN0aXZlQ29tbWVudChjb21tZW50OiBSZXZpZXdDb21tZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1Zygnc2V0QWN0aXZlQ29tbWVudCcsIGNvbW1lbnQpO1xyXG5cclxuICAgICAgICBjb25zdCBsaW5lTnVtYmVyc1RvTWFrZURpcnR5ID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCAmJiAoIWNvbW1lbnQgfHwgdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgIT09IGNvbW1lbnQubGluZU51bWJlcikpIHtcclxuICAgICAgICAgICAgbGluZU51bWJlcnNUb01ha2VEaXJ0eS5wdXNoKHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbW1lbnQpIHtcclxuICAgICAgICAgICAgbGluZU51bWJlcnNUb01ha2VEaXJ0eS5wdXNoKGNvbW1lbnQubGluZU51bWJlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFjdGl2ZUNvbW1lbnQgPSBjb21tZW50O1xyXG4gICAgICAgIGlmIChsaW5lTnVtYmVyc1RvTWFrZURpcnR5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJBbmRNYXBDb21tZW50cyhsaW5lTnVtYmVyc1RvTWFrZURpcnR5LCAoY29tbWVudCkgPT4geyBjb21tZW50LnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMuZGlydHkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGxheW91dElubGluZVRvb2xiYXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCkge1xyXG4gICAgICAgICAgICBjb25zdCB0b29sYmFyUm9vdCA9IHRoaXMud2lkZ2V0SW5saW5lVG9vbGJhci5nZXREb21Ob2RlKCkgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHRvb2xiYXJSb290LnN0eWxlLm1hcmdpblRvcCA9IGAtJHt0aGlzLmNhbGN1bGF0ZU1hcmdpblRvcE9mZnNldCgyKX1weGA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVUb29sYmFyKTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJBbmRNYXBDb21tZW50cyhsaW5lTnVtYmVyczogbnVtYmVyW10sIGZuOiB7IChjb21tZW50OiBSZXZpZXdDb21tZW50KTogdm9pZCB9KSB7XHJcbiAgICAgICAgY29uc3QgY29tbWVudHMgPSB0aGlzLml0ZXJhdGVDb21tZW50cygpO1xyXG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjb21tZW50cykge1xyXG4gICAgICAgICAgICBpZiAobGluZU51bWJlcnMuaW5kZXhPZihjLmNvbW1lbnQubGluZU51bWJlcikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgZm4oYy5jb21tZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVNb3VzZURvd24oZXY6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ2hhbmRsZU1vdXNlRG93bicsIHRoaXMuYWN0aXZlQ29tbWVudCwgZXYudGFyZ2V0LmVsZW1lbnQsIGV2LnRhcmdldC5kZXRhaWwpO1xyXG5cclxuICAgICAgICBpZiAoZXYudGFyZ2V0LmVsZW1lbnQudGFnTmFtZSA9PT0gJ1RFWFRBUkVBJyB8fCBldi50YXJnZXQuZWxlbWVudC50YWdOYW1lID09PSAnQlVUVE9OJyB8fCBldi50YXJnZXQuZWxlbWVudC50YWdOYW1lID09PSAnQScpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBhY3RpdmVDb21tZW50OiBSZXZpZXdDb21tZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQuZGV0YWlsICYmIGV2LnRhcmdldC5kZXRhaWwudmlld1pvbmVJZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQudmlld1pvbmVJZCA9PSBldi50YXJnZXQuZGV0YWlsLnZpZXdab25lSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ29tbWVudCA9IGl0ZW0uY29tbWVudDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ29tbWVudChhY3RpdmVDb21tZW50KTtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUudG9vbGJhcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2FsY3VsYXRlTWFyZ2luVG9wT2Zmc2V0KGV4dHJhT2Zmc2V0TGluZXM6IG51bWJlciA9IDEpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBpZHggPSAwO1xyXG4gICAgICAgIGxldCBjb3VudCA9IDA7XHJcbiAgICAgICAgbGV0IG1hcmdpblRvcDogbnVtYmVyID0gMDtcclxuICAgICAgICBjb25zdCBsaW5lSGVpZ2h0ID0gdGhpcy5jb25maWcubGluZUhlaWdodDsvL0ZJWE1FIC0gTWFnaWMgbnVtYmVyIGZvciBsaW5lIGhlaWdodCAgICAgICAgICAgIFxyXG5cclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudC5saW5lTnVtYmVyID09IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50ID09IHRoaXMuYWN0aXZlQ29tbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkeCA9IGNvdW50ICsgMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYXJnaW5Ub3AgPSAoKGV4dHJhT2Zmc2V0TGluZXMgKyBjb3VudCAtIGlkeCkgKiBsaW5lSGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtYXJnaW5Ub3A7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXRFZGl0b3JNb2RlKG1vZGU6IEVkaXRvck1vZGUpOiB7IGxpbmVOdW1iZXI6IG51bWJlciwgdGV4dDogc3RyaW5nIH0ge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ3NldEVkaXRvck1vZGUnLCB0aGlzLmFjdGl2ZUNvbW1lbnQpO1xyXG5cclxuICAgICAgICBjb25zdCBsaW5lTnVtYmVyID0gdGhpcy5hY3RpdmVDb21tZW50ID8gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgOiB0aGlzLmVkaXRvci5nZXRQb3NpdGlvbigpLmxpbmVOdW1iZXI7XHJcbiAgICAgICAgdGhpcy5lZGl0b3JNb2RlID0gbW9kZTtcclxuXHJcbiAgICAgICAgY29uc3QgZWRpdG9yUm9vdCA9IHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvci5nZXREb21Ob2RlKCkgYXMgSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgZWRpdG9yUm9vdC5zdHlsZS5tYXJnaW5Ub3AgPSBgLSR7dGhpcy5jYWxjdWxhdGVNYXJnaW5Ub3BPZmZzZXQoKX1weGA7XHJcblxyXG4gICAgICAgIHRoaXMubGF5b3V0SW5saW5lVG9vbGJhcigpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yKTtcclxuXHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvci5nZXREb21Ob2RlKCk7XHJcbiAgICAgICAgY29uc3QgdGV4dGFyZWEgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJURVhUQVJFQVtuYW1lPSd0ZXh0J11cIik7XHJcblxyXG4gICAgICAgIGlmIChtb2RlID09IEVkaXRvck1vZGUuZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRleHRhcmVhLnZhbHVlID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIC8vSEFDSyAtIGJlY2F1c2UgdGhlIGV2ZW50IGluIG1vbmFjbyBkb2Vzbid0IGhhdmUgcHJldmVudGRlZmF1bHQgd2hpY2ggbWVhbnMgZWRpdG9yIHRha2VzIGZvY3VzIGJhY2suLi4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0ZXh0YXJlYS5mb2N1cygpLCAxMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgdGV4dDogdGV4dGFyZWEudmFsdWUsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIG5leHRDb21tZW50SWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIGAke25ldyBEYXRlKCkudG9TdHJpbmcoKX0tJHt0aGlzLmN1cnJlbnRVc2VyfWA7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ29tbWVudChsaW5lTnVtYmVyOiBudW1iZXIsIHRleHQ6IHN0cmluZyk6IFJldmlld0NvbW1lbnQge1xyXG4gICAgICAgIGxldCBjb21tZW50OiBSZXZpZXdDb21tZW50ID0gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGNvbW1lbnQgPSBuZXcgUmV2aWV3Q29tbWVudCh0aGlzLm5leHRDb21tZW50SWQoKSwgdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIsIHRoaXMuY3VycmVudFVzZXIsIG5ldyBEYXRlKCksIHRleHQpXHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudC5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJBbmRNYXBDb21tZW50cyhbbGluZU51bWJlcl0sIChjb21tZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb21tZW50LnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMuZGlydHk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbW1lbnQgPSBuZXcgUmV2aWV3Q29tbWVudCh0aGlzLm5leHRDb21tZW50SWQoKSwgbGluZU51bWJlciwgdGhpcy5jdXJyZW50VXNlciwgbmV3IERhdGUoKSwgdGV4dClcclxuICAgICAgICAgICAgdGhpcy5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKVxyXG4gICAgICAgIHRoaXMubGF5b3V0SW5saW5lVG9vbGJhcigpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vbkNoYW5nZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuY29tbWVudHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaXRlcmF0ZUNvbW1lbnRzKGNvbW1lbnRzPzogUmV2aWV3Q29tbWVudFtdLCBkZXB0aD86IG51bWJlciwgY291bnRCeUxpbmVOdW1iZXI/OiBhbnksIHJlc3VsdHM/OiBSZXZpZXdDb21tZW50SXRlckl0ZW1bXSkge1xyXG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xyXG4gICAgICAgIGRlcHRoID0gZGVwdGggfHwgMDtcclxuICAgICAgICBjb21tZW50cyA9IGNvbW1lbnRzIHx8IHRoaXMuY29tbWVudHM7XHJcbiAgICAgICAgY291bnRCeUxpbmVOdW1iZXIgPSBjb3VudEJ5TGluZU51bWJlciB8fCB7fTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBjb21tZW50IG9mIGNvbW1lbnRzKSB7XHJcbiAgICAgICAgICAgIGNvdW50QnlMaW5lTnVtYmVyW2NvbW1lbnQubGluZU51bWJlcl0gPSAoY291bnRCeUxpbmVOdW1iZXJbY29tbWVudC5saW5lTnVtYmVyXSB8fCAwKSArIDFcclxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHsgZGVwdGgsIGNvbW1lbnQsIGNvdW50OiBjb3VudEJ5TGluZU51bWJlcltjb21tZW50LmxpbmVOdW1iZXJdIH0pXHJcblxyXG4gICAgICAgICAgICB0aGlzLml0ZXJhdGVDb21tZW50cyhjb21tZW50LmNvbW1lbnRzLCBkZXB0aCArIDEsIGNvdW50QnlMaW5lTnVtYmVyLCByZXN1bHRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNvbW1lbnQoY29tbWVudDogUmV2aWV3Q29tbWVudCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cyhbY29tbWVudF0pKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uY29tbWVudC5kZWxldGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCA9PSBjb21tZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ29tbWVudChudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5sYXlvdXRJbmxpbmVUb29sYmFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpO1xyXG4gICAgICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UodGhpcy5jb21tZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlZnJlc2hDb21tZW50cygpIHtcclxuICAgICAgICB0aGlzLmVkaXRvci5jaGFuZ2VWaWV3Wm9uZXMoKGNoYW5nZUFjY2Vzc29yKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cyh0aGlzLmNvbW1lbnRzLCAwKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudC5kZWxldGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnRGVsZXRlJywgaXRlbS5jb21tZW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQWNjZXNzb3IucmVtb3ZlWm9uZShpdGVtLmNvbW1lbnQudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudC5yZW5kZXJTdGF0dXMgPT09IFJldmlld0NvbW1lbnRTdGF0dXMuaGlkZGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnSGlkZGVuJywgaXRlbS5jb21tZW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQWNjZXNzb3IucmVtb3ZlWm9uZShpdGVtLmNvbW1lbnQudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21tZW50LnZpZXdab25lSWQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LnJlbmRlclN0YXR1cyA9PT0gUmV2aWV3Q29tbWVudFN0YXR1cy5kaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ0RpcnR5JywgaXRlbS5jb21tZW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQWNjZXNzb3IucmVtb3ZlWm9uZShpdGVtLmNvbW1lbnQudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21tZW50LnZpZXdab25lSWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tbWVudC5yZW5kZXJTdGF0dXMgPSBSZXZpZXdDb21tZW50U3RhdHVzLm5vcm1hbDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnQ3JlYXRlJywgaXRlbS5jb21tZW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9tTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQWN0aXZlID0gdGhpcy5hY3RpdmVDb21tZW50ID09IGl0ZW0uY29tbWVudDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5zdHlsZS5tYXJnaW5MZWZ0ID0gKHRoaXMuY29uZmlnLmNvbW1lbnRJbmRlbnQgKiAoaXRlbS5kZXB0aCArIDEpKSArIHRoaXMuY29uZmlnLmNvbW1lbnRJbmRlbnRPZmZzZXQgKyBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUnO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuY2xhc3NOYW1lID0gaXNBY3RpdmUgPyAncmV2aWV3Q29tbWVudC1hY3RpdmUnIDogJ3Jldmlld0NvbW1lbnQtaW5hY3RpdmUnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhdXRob3IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yLmNsYXNzTmFtZSA9ICdyZXZpZXdDb21tZW50LWF1dGhvcidcclxuICAgICAgICAgICAgICAgICAgICBhdXRob3IuaW5uZXJUZXh0ID0gaXRlbS5jb21tZW50LmF1dGhvciB8fCAnICc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGR0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGR0LmNsYXNzTmFtZSA9ICdyZXZpZXdDb21tZW50LWR0J1xyXG4gICAgICAgICAgICAgICAgICAgIGR0LmlubmVyVGV4dCA9IGl0ZW0uY29tbWVudC5kdC50b0xvY2FsZVN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQuY2xhc3NOYW1lID0gJ3Jldmlld0NvbW1lbnQtdGV4dCdcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LmlubmVyVGV4dCA9IGl0ZW0uY29tbWVudC50ZXh0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmFwcGVuZENoaWxkKGR0KTtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmFwcGVuZENoaWxkKGF1dGhvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21tZW50LnZpZXdab25lSWQgPSBjaGFuZ2VBY2Nlc3Nvci5hZGRab25lKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXJMaW5lTnVtYmVyOiBpdGVtLmNvbW1lbnQubGluZU51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0SW5MaW5lczogMSwgLy9UT0RPIC0gRmlndXJlIG91dCBpZiBtdWx0aS1saW5lP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlOiBkb21Ob2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdXBwcmVzc01vdXNlRG93bjogdHJ1ZSAvLyBUaGlzIHN0b3BzIGZvY3VzIGJlaW5nIGxvc3QgdGhlIGVkaXRvciAtIG1lYW5pbmcga2V5Ym9hcmQgc2hvcnRjdXRzIGtlZXBzIHdvcmtpbmdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEFjdGlvbnMoKSB7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQWN0aW9uKHtcclxuICAgICAgICAgICAgaWQ6ICdteS11bmlxdWUtaWQtYWRkJyxcclxuICAgICAgICAgICAgbGFiZWw6ICdBZGQgQ29tbWVudCcsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdzOiBbXHJcbiAgICAgICAgICAgICAgICBtb25hY29XaW5kb3cubW9uYWNvLktleU1vZC5DdHJsQ21kIHwgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlDb2RlLkYxMCxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcHJlY29uZGl0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nQ29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVHcm91cElkOiAnbmF2aWdhdGlvbicsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51T3JkZXI6IDAsXHJcblxyXG4gICAgICAgICAgICBydW46ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLmVkaXRvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQWN0aW9uKHtcclxuICAgICAgICAgICAgaWQ6ICdteS11bmlxdWUtaWQtbmV4dCcsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnTmV4dCBDb21tZW50JyxcclxuICAgICAgICAgICAga2V5YmluZGluZ3M6IFtcclxuICAgICAgICAgICAgICAgIG1vbmFjb1dpbmRvdy5tb25hY28uS2V5TW9kLkN0cmxDbWQgfCBtb25hY29XaW5kb3cubW9uYWNvLktleUNvZGUuRjEyLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwcmVjb25kaXRpb246IG51bGwsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdDb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudUdyb3VwSWQ6ICduYXZpZ2F0aW9uJyxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVPcmRlcjogMC4xLFxyXG5cclxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9Db21tZW50KE5hdmlnYXRpb25EaXJlY3Rpb24ubmV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQWN0aW9uKHtcclxuICAgICAgICAgICAgaWQ6ICdteS11bmlxdWUtaWQtcHJldicsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnUHJldiBDb21tZW50JyxcclxuICAgICAgICAgICAga2V5YmluZGluZ3M6IFtcclxuICAgICAgICAgICAgICAgIG1vbmFjb1dpbmRvdy5tb25hY28uS2V5TW9kLkN0cmxDbWQgfCBtb25hY29XaW5kb3cubW9uYWNvLktleUNvZGUuRjExLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwcmVjb25kaXRpb246IG51bGwsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdDb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudUdyb3VwSWQ6ICduYXZpZ2F0aW9uJyxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVPcmRlcjogMC4xLFxyXG5cclxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9Db21tZW50KE5hdmlnYXRpb25EaXJlY3Rpb24ucHJldik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZVRvQ29tbWVudChkaXJlY3Rpb246IE5hdmlnYXRpb25EaXJlY3Rpb24pIHtcclxuICAgICAgICBsZXQgY3VycmVudExpbmUgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgY3VycmVudExpbmUgPSB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdXJyZW50TGluZSA9IHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbW1lbnRzID0gdGhpcy5jb21tZW50cy5maWx0ZXIoKGMpID0+IHtcclxuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWdhdGlvbkRpcmVjdGlvbi5uZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYy5saW5lTnVtYmVyID4gY3VycmVudExpbmU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBOYXZpZ2F0aW9uRGlyZWN0aW9uLnByZXYpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjLmxpbmVOdW1iZXIgPCBjdXJyZW50TGluZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoY29tbWVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbW1lbnRzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IE5hdmlnYXRpb25EaXJlY3Rpb24ubmV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLmxpbmVOdW1iZXIgLSBiLmxpbmVOdW1iZXI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWdhdGlvbkRpcmVjdGlvbi5wcmV2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIubGluZU51bWJlciAtIGEubGluZU51bWJlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb21tZW50ID0gY29tbWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ29tbWVudChjb21tZW50KVxyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLmxheW91dElubGluZVRvb2xiYXIoKTtcclxuICAgICAgICAgICAgdGhpcy5lZGl0b3IucmV2ZWFsTGluZUluQ2VudGVyKGNvbW1lbnQubGluZU51bWJlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5lbnVtIE5hdmlnYXRpb25EaXJlY3Rpb24ge1xyXG4gICAgbmV4dCA9IDEsXHJcbiAgICBwcmV2ID0gMlxyXG59XHJcblxyXG5lbnVtIEVkaXRvck1vZGUge1xyXG4gICAgZWRpdG9yLFxyXG4gICAgdG9vbGJhclxyXG59XHJcblxyXG5lbnVtIFJldmlld0NvbW1lbnRTdGF0dXMge1xyXG4gICAgZGlydHksXHJcbiAgICBoaWRkZW4sXHJcbiAgICBub3JtYWxcclxufSJdLCJzb3VyY2VSb290IjoiIn0=