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
                    domNode.style.marginLeft = (_this.config.commentIndent * (item.depth + 1)) + _this.config.commentIndentOffset + "px";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01vbmFjb0VkaXRvckNvZGVSZXZpZXcvLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDOUVBLElBQU0sWUFBWSxHQUFJLE1BQThCLENBQUM7QUFFckQ7SUFZSSx1QkFBWSxFQUFVLEVBQUUsVUFBa0IsRUFBRSxNQUFjLEVBQUUsRUFBUSxFQUFFLElBQVksRUFBRSxRQUEwQjtRQUMxRyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2IsSUFBSSxDQUFDLFVBQVUsR0FBRyxVQUFVLENB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QUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO1lBQzlCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN0RDtJQUNMLENBQUM7SUFDTCxvQkFBQztBQUFELENBQUM7QUFFRCxJQUFLLG1CQUdKO0FBSEQsV0FBSyxtQkFBbUI7SUFDcEIsNkRBQVE7SUFDUiw2REFBUTtBQUNaLENBQUMsRUFISSxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBR3ZCO0FBRUQsSUFBSyxVQUdKO0FBSEQsV0FBSyxVQUFVO0lBQ1gsK0NBQU07SUFDTixpREFBTztBQUNYLENBQUMsRUFISSxVQUFVLEtBQVYsVUFBVSxRQUdkO0FBRUQsSUFBSyxtQkFJSjtBQUpELFdBQUssbUJBQW1CO0lBQ3BCLCtEQUFLO0lBQ0wsaUVBQU07SUFDTixpRUFBTTtBQUNWLENBQUMsRUFKSSxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBSXZCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbnRlcmZhY2UgTW9uYWNvV2luZG93IHtcclxuICAgIG1vbmFjbzogYW55O1xyXG59XHJcblxyXG5jb25zdCBtb25hY29XaW5kb3cgPSAod2luZG93IGFzIGFueSkgYXMgTW9uYWNvV2luZG93O1xyXG5cclxuZXhwb3J0IGNsYXNzIFJldmlld0NvbW1lbnQge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIGF1dGhvcjogc3RyaW5nO1xyXG4gICAgZHQ6IERhdGU7XHJcbiAgICBsaW5lTnVtYmVyOiBudW1iZXI7XHJcbiAgICB0ZXh0OiBzdHJpbmc7XHJcbiAgICBjb21tZW50czogUmV2aWV3Q29tbWVudFtdO1xyXG5cclxuICAgIGRlbGV0ZWQ6IGJvb2xlYW47XHJcbiAgICB2aWV3Wm9uZUlkOiBudW1iZXI7XHJcbiAgICByZW5kZXJTdGF0dXM6IFJldmlld0NvbW1lbnRTdGF0dXM7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgbGluZU51bWJlcjogbnVtYmVyLCBhdXRob3I6IHN0cmluZywgZHQ6IERhdGUsIHRleHQ6IHN0cmluZywgY29tbWVudHM/OiBSZXZpZXdDb21tZW50W10pIHtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5hdXRob3IgPSBhdXRob3I7XHJcbiAgICAgICAgdGhpcy5kdCA9IGR0O1xyXG4gICAgICAgIHRoaXMubGluZU51bWJlciA9IGxpbmVOdW1iZXI7XHJcbiAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICB0aGlzLmNvbW1lbnRzID0gY29tbWVudHMgfHwgW107XHJcblxyXG4gICAgICAgIC8vSEFDSyAtIHRoaXMgaXMgcnVudGltZSBzdGF0ZSAtIGFuZCBzaG91bGQgYmUgbW92ZWRcclxuICAgICAgICB0aGlzLmRlbGV0ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMubm9ybWFsO1xyXG4gICAgICAgIHRoaXMudmlld1pvbmVJZCA9IG51bGw7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSZXZpZXdNYW5hZ2VyKGVkaXRvcjogYW55LCBjdXJyZW50VXNlcjogc3RyaW5nLCBjb21tZW50cz86IFJldmlld0NvbW1lbnRbXSwgb25DaGFuZ2U/OiBPbkNvbW1lbnRzQ2hhbmdlZCwgY29uZmlnPzogUmV2aWV3TWFuYWdlckNvbmZpZykge1xyXG4gICAgLy8od2luZG93IGFzIGFueSkuZWRpdG9yID0gZWRpdG9yOyAgICBcclxuICAgIGNvbnN0IHJtID0gbmV3IFJldmlld01hbmFnZXIoZWRpdG9yLCBjdXJyZW50VXNlciwgb25DaGFuZ2UsIGNvbmZpZyk7XHJcbiAgICBybS5sb2FkKGNvbW1lbnRzIHx8IFtdKTtcclxuICAgIHJldHVybiBybTtcclxufVxyXG5cclxuXHJcbmludGVyZmFjZSBSZXZpZXdDb21tZW50SXRlckl0ZW0ge1xyXG4gICAgZGVwdGg6IG51bWJlcjtcclxuICAgIGNvbW1lbnQ6IFJldmlld0NvbW1lbnQsXHJcbiAgICBjb3VudDogbnVtYmVyXHJcbn1cclxuXHJcbmludGVyZmFjZSBPbkNvbW1lbnRzQ2hhbmdlZCB7XHJcbiAgICAoY29tbWVudHM6IFJldmlld0NvbW1lbnRbXSk6IHZvaWRcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZXZpZXdNYW5hZ2VyQ29uZmlnIHtcclxuICAgIGVkaXRCdXR0b25FbmFibGVSZW1vdmU/OiBib29sZWFuO1xyXG4gICAgbGluZUhlaWdodD86IG51bWJlcjtcclxuICAgIGNvbW1lbnRJbmRlbnQ/OiBudW1iZXI7XHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0PzogbnVtYmVyO1xyXG4gICAgZWRpdEJ1dHRvbkFkZFRleHQ/OiBzdHJpbmc7XHJcbiAgICBlZGl0QnV0dG9uUmVtb3ZlVGV4dD86IHN0cmluZztcclxuICAgIGVkaXRCdXR0b25PZmZzZXQ/OiBzdHJpbmc7XHJcbiAgICByZXZpZXdDb21tZW50SWNvblNlbGVjdD86IHN0cmluZztcclxuICAgIHJldmlld0NvbW1lbnRJY29uQWN0aXZlPzogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmV2aWV3TWFuYWdlckNvbmZpZ1ByaXZhdGUge1xyXG4gICAgZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZTogYm9vbGVhbjtcclxuICAgIGxpbmVIZWlnaHQ6IG51bWJlcjtcclxuICAgIGNvbW1lbnRJbmRlbnQ6IG51bWJlcjtcclxuICAgIGNvbW1lbnRJbmRlbnRPZmZzZXQ6IG51bWJlcjtcclxuICAgIGVkaXRCdXR0b25BZGRUZXh0OiBzdHJpbmc7XHJcbiAgICBlZGl0QnV0dG9uUmVtb3ZlVGV4dDogc3RyaW5nO1xyXG4gICAgZWRpdEJ1dHRvbk9mZnNldDogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuY29uc3QgZGVmYXVsdFJldmlld01hbmFnZXJDb25maWc6IFJldmlld01hbmFnZXJDb25maWdQcml2YXRlID0ge1xyXG4gICAgZWRpdEJ1dHRvbk9mZnNldDogJy0xMHB4JyxcclxuICAgIGVkaXRCdXR0b25BZGRUZXh0OiAnUmVwbHknLFxyXG4gICAgZWRpdEJ1dHRvblJlbW92ZVRleHQ6ICdSZW1vdmUnLFxyXG4gICAgZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZTogdHJ1ZSxcclxuICAgIGxpbmVIZWlnaHQ6IDE5LFxyXG4gICAgY29tbWVudEluZGVudDogMjAsXHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0OiAyMCxcclxufTtcclxuXHJcblxyXG5jbGFzcyBSZXZpZXdNYW5hZ2VyIHtcclxuICAgIGN1cnJlbnRVc2VyOiBzdHJpbmc7XHJcbiAgICBlZGl0b3I6IGFueTtcclxuICAgIGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W107XHJcbiAgICBhY3RpdmVDb21tZW50PzogUmV2aWV3Q29tbWVudDtcclxuICAgIHdpZGdldElubGluZVRvb2xiYXI6IGFueTtcclxuICAgIHdpZGdldElubGluZUNvbW1lbnRFZGl0b3I6IGFueTtcclxuICAgIG9uQ2hhbmdlOiBPbkNvbW1lbnRzQ2hhbmdlZDtcclxuICAgIGVkaXRvck1vZGU6IEVkaXRvck1vZGU7XHJcbiAgICBjb25maWc6IFJldmlld01hbmFnZXJDb25maWdQcml2YXRlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVkaXRvcjogYW55LCBjdXJyZW50VXNlcjogc3RyaW5nLCBvbkNoYW5nZTogT25Db21tZW50c0NoYW5nZWQsIGNvbmZpZz86IFJldmlld01hbmFnZXJDb25maWcpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gY3VycmVudFVzZXI7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVDb21tZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbW1lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyID0gbnVsbDtcclxuICAgICAgICB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcclxuICAgICAgICB0aGlzLmVkaXRvck1vZGUgPSBFZGl0b3JNb2RlLnRvb2xiYXI7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSB7IC4uLmRlZmF1bHRSZXZpZXdNYW5hZ2VyQ29uZmlnLCAuLi4oY29uZmlnIHx8IHt9KSB9O1xyXG5cclxuICAgICAgICB0aGlzLmFkZEFjdGlvbnMoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlubGluZVRvb2xiYXJXaWRnZXQoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlubGluZUVkaXRvcldpZGdldCgpO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5vbk1vdXNlRG93bih0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W10pIHtcclxuICAgICAgICB0aGlzLmVkaXRvci5jaGFuZ2VWaWV3Wm9uZXMoKGNoYW5nZUFjY2Vzc29yKSA9PiB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LnZpZXdab25lSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU2hvdWxkIHRoaXMgYmUgaW5zaWRlIHRoaXMgY2FsbGJhY2s/XHJcbiAgICAgICAgICAgIHRoaXMuY29tbWVudHMgPSBjb21tZW50cztcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRCdXR0b25zRWxlbWVudCgpIHtcclxuICAgICAgICB2YXIgcm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHJvb3QuY2xhc3NOYW1lID0gJ2VkaXRCdXR0b25zQ29udGFpbmVyJ1xyXG5cclxuICAgICAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XHJcbiAgICAgICAgYWRkLmhyZWYgPSAnIydcclxuICAgICAgICBhZGQuaW5uZXJUZXh0ID0gdGhpcy5jb25maWcuZWRpdEJ1dHRvbkFkZFRleHQ7XHJcbiAgICAgICAgYWRkLm5hbWUgPSAnYWRkJztcclxuICAgICAgICBhZGQuY2xhc3NOYW1lID0gJ2VkaXRCdXR0b25BZGQnXHJcbiAgICAgICAgYWRkLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLmVkaXRvcilcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOy8vIFN1cHByZXNzIG5hdmlnYXRpb25cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoYWRkKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmVkaXRCdXR0b25FbmFibGVSZW1vdmUpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3BhY2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHNwYWNlci5pbm5lclRleHQgPSAnICdcclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChzcGFjZXIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpIGFzIEhUTUxBbmNob3JFbGVtZW50O1xyXG4gICAgICAgICAgICByZW1vdmUuaHJlZiA9ICcjJ1xyXG4gICAgICAgICAgICByZW1vdmUuaW5uZXJUZXh0ID0gdGhpcy5jb25maWcuZWRpdEJ1dHRvblJlbW92ZVRleHQ7XHJcbiAgICAgICAgICAgIHJlbW92ZS5uYW1lID0gJ3JlbW92ZSc7XHJcbiAgICAgICAgICAgIHJlbW92ZS5jbGFzc05hbWUgPSAnZWRpdEJ1dHRvblJlbW92ZSdcclxuICAgICAgICAgICAgcmVtb3ZlLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUNvbW1lbnQodGhpcy5hY3RpdmVDb21tZW50KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTsgLy8gU3VwcHJlc3MgbmF2aWdhdGlvblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVtb3ZlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvb3Quc3R5bGUubWFyZ2luTGVmdCA9IHRoaXMuY29uZmlnLmVkaXRCdXR0b25PZmZzZXQ7XHJcbiAgICAgICAgcmV0dXJuIHJvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ2FuY2VsKCkge1xyXG4gICAgICAgIHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLnRvb2xiYXIpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlU2F2ZSgpIHtcclxuICAgICAgICBjb25zdCByID0gdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUudG9vbGJhcik7XHJcbiAgICAgICAgdGhpcy5hZGRDb21tZW50KHIubGluZU51bWJlciwgci50ZXh0KTtcclxuICAgICAgICB0aGlzLmVkaXRvci5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRvckVsZW1lbnQoKSB7XHJcbiAgICAgICAgdmFyIHJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgcm9vdC5jbGFzc05hbWUgPSBcInJldmlld0NvbW1lbnRFZGl0XCJcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xyXG4gICAgICAgIHRleHRhcmVhLmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudFRleHRcIjtcclxuICAgICAgICB0ZXh0YXJlYS5pbm5lclRleHQgPSAnJztcclxuICAgICAgICB0ZXh0YXJlYS5uYW1lID0gJ3RleHQnO1xyXG4gICAgICAgIHRleHRhcmVhLm9ua2V5cHJlc3MgPSAoZTogS2V5Ym9hcmRFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZS5jb2RlID09PSBcIkVudGVyXCIgJiYgZS5jdHJsS2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVNhdmUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGV4dGFyZWEub25rZXlkb3duID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFc2NhcGVcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVDYW5jZWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2F2ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgICAgIHNhdmUuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50U2F2ZVwiO1xyXG4gICAgICAgIHNhdmUuaW5uZXJUZXh0ID0gJ1NhdmUnO1xyXG4gICAgICAgIHNhdmUubmFtZSA9ICdzYXZlJztcclxuICAgICAgICBzYXZlLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlU2F2ZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgICAgIGNhbmNlbC5jbGFzc05hbWUgPSBcInJldmlld0NvbW1lbnRDYW5jZWxcIjtcclxuICAgICAgICBjYW5jZWwuaW5uZXJUZXh0ID0gJ0NhbmNlbCc7XHJcbiAgICAgICAgY2FuY2VsLm5hbWUgPSAnY2FuY2VsJztcclxuICAgICAgICBjYW5jZWwub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDYW5jZWwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQodGV4dGFyZWEpO1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoc2F2ZSk7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjYW5jZWwpO1xyXG5cclxuICAgICAgICByZXR1cm4gcm9vdFxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZVRvb2xiYXJXaWRnZXQoKSB7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uc0VsZW1lbnQgPSB0aGlzLmNyZWF0ZUlubGluZUVkaXRCdXR0b25zRWxlbWVudCgpO1xyXG5cclxuICAgICAgICB0aGlzLndpZGdldElubGluZVRvb2xiYXIgPSB7XHJcbiAgICAgICAgICAgIGFsbG93RWRpdG9yT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgICAgIGdldElkOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3dpZGdldElubGluZVRvb2xiYXInO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREb21Ob2RlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYnV0dG9uc0VsZW1lbnQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ICYmIHRoaXMuZWRpdG9yTW9kZSA9PSBFZGl0b3JNb2RlLnRvb2xiYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmZXJlbmNlOiBbbW9uYWNvV2luZG93Lm1vbmFjby5lZGl0b3IuQ29udGVudFdpZGdldFBvc2l0aW9uUHJlZmVyZW5jZS5CRUxPV11cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRDb250ZW50V2lkZ2V0KHRoaXMud2lkZ2V0SW5saW5lVG9vbGJhcik7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5saW5lRWRpdG9yV2lkZ2V0KCkge1xyXG4gICAgICAgIGNvbnN0IGVkaXRvckVsZW1lbnQgPSB0aGlzLmNyZWF0ZUlubGluZUVkaXRvckVsZW1lbnQoKTtcclxuICAgICAgICB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IgPSB7XHJcbiAgICAgICAgICAgIGFsbG93RWRpdG9yT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgICAgIGdldElkOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3dpZGdldElubGluZUVkaXRvcic7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldERvbU5vZGU6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlZGl0b3JFbGVtZW50O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRQb3NpdGlvbjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZWRpdG9yTW9kZSA9PSBFZGl0b3JNb2RlLmVkaXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBhcmUgdXNpbmcgbmVnYXRpdmUgbWFyZ2luVG9wIHRvIHNoaWZ0IGl0IGFib3ZlIHRoZSBsaW5lIHRvIHRoZSBwcmV2aW91c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5hY3RpdmVDb21tZW50ID8gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgKyAxIDogdGhpcy5lZGl0b3IuZ2V0UG9zaXRpb24oKS5saW5lTnVtYmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZlcmVuY2U6IFttb25hY29XaW5kb3cubW9uYWNvLmVkaXRvci5Db250ZW50V2lkZ2V0UG9zaXRpb25QcmVmZXJlbmNlLkJFTE9XXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBY3RpdmVDb21tZW50KGNvbW1lbnQ6IFJldmlld0NvbW1lbnQpIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKCdzZXRBY3RpdmVDb21tZW50JywgY29tbWVudCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxpbmVOdW1iZXJzVG9NYWtlRGlydHkgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ICYmICghY29tbWVudCB8fCB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciAhPT0gY29tbWVudC5saW5lTnVtYmVyKSkge1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVyc1RvTWFrZURpcnR5LnB1c2godGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29tbWVudCkge1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVyc1RvTWFrZURpcnR5LnB1c2goY29tbWVudC5saW5lTnVtYmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudCA9IGNvbW1lbnQ7XHJcbiAgICAgICAgaWYgKGxpbmVOdW1iZXJzVG9NYWtlRGlydHkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmZpbHRlckFuZE1hcENvbW1lbnRzKGxpbmVOdW1iZXJzVG9NYWtlRGlydHksIChjb21tZW50KSA9PiB7IGNvbW1lbnQucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5kaXJ0eSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGF5b3V0SW5saW5lVG9vbGJhcigpIHtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvb2xiYXJSb290ID0gdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyLmdldERvbU5vZGUoKSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICAgICAgdG9vbGJhclJvb3Quc3R5bGUubWFyZ2luVG9wID0gYC0ke3RoaXMuY2FsY3VsYXRlTWFyZ2luVG9wT2Zmc2V0KDIpfXB4YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lZGl0b3IubGF5b3V0Q29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZVRvb2xiYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlckFuZE1hcENvbW1lbnRzKGxpbmVOdW1iZXJzOiBudW1iZXJbXSwgZm46IHsgKGNvbW1lbnQ6IFJldmlld0NvbW1lbnQpOiB2b2lkIH0pIHtcclxuICAgICAgICBjb25zdCBjb21tZW50cyA9IHRoaXMuaXRlcmF0ZUNvbW1lbnRzKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBjIG9mIGNvbW1lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChsaW5lTnVtYmVycy5pbmRleE9mKGMuY29tbWVudC5saW5lTnVtYmVyKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBmbihjLmNvbW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZU1vdXNlRG93bihldjogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnaGFuZGxlTW91c2VEb3duJywgdGhpcy5hY3RpdmVDb21tZW50LCBldi50YXJnZXQuZWxlbWVudCwgZXYudGFyZ2V0LmRldGFpbCk7XHJcblxyXG4gICAgICAgIGlmIChldi50YXJnZXQuZWxlbWVudC50YWdOYW1lID09PSAnVEVYVEFSRUEnIHx8IGV2LnRhcmdldC5lbGVtZW50LnRhZ05hbWUgPT09ICdCVVRUT04nIHx8IGV2LnRhcmdldC5lbGVtZW50LnRhZ05hbWUgPT09ICdBJykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFjdGl2ZUNvbW1lbnQ6IFJldmlld0NvbW1lbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5kZXRhaWwgJiYgZXYudGFyZ2V0LmRldGFpbC52aWV3Wm9uZUlkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkID09IGV2LnRhcmdldC5kZXRhaWwudmlld1pvbmVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDb21tZW50ID0gaXRlbS5jb21tZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDb21tZW50KGFjdGl2ZUNvbW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS50b29sYmFyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVNYXJnaW5Ub3BPZmZzZXQoZXh0cmFPZmZzZXRMaW5lczogbnVtYmVyID0gMSk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IGlkeCA9IDA7XHJcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcclxuICAgICAgICBsZXQgbWFyZ2luVG9wOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGNvbnN0IGxpbmVIZWlnaHQgPSB0aGlzLmNvbmZpZy5saW5lSGVpZ2h0Oy8vRklYTUUgLSBNYWdpYyBudW1iZXIgZm9yIGxpbmUgaGVpZ2h0ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LmxpbmVOdW1iZXIgPT0gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQgPT0gdGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWR4ID0gY291bnQgKyAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hcmdpblRvcCA9ICgoZXh0cmFPZmZzZXRMaW5lcyArIGNvdW50IC0gaWR4KSAqIGxpbmVIZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1hcmdpblRvcDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldEVkaXRvck1vZGUobW9kZTogRWRpdG9yTW9kZSk6IHsgbGluZU51bWJlcjogbnVtYmVyLCB0ZXh0OiBzdHJpbmcgfSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1Zygnc2V0RWRpdG9yTW9kZScsIHRoaXMuYWN0aXZlQ29tbWVudCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxpbmVOdW1iZXIgPSB0aGlzLmFjdGl2ZUNvbW1lbnQgPyB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciA6IHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlcjtcclxuICAgICAgICB0aGlzLmVkaXRvck1vZGUgPSBtb2RlO1xyXG5cclxuICAgICAgICBjb25zdCBlZGl0b3JSb290ID0gdGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yLmdldERvbU5vZGUoKSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICBlZGl0b3JSb290LnN0eWxlLm1hcmdpblRvcCA9IGAtJHt0aGlzLmNhbGN1bGF0ZU1hcmdpblRvcE9mZnNldCgpfXB4YDtcclxuXHJcbiAgICAgICAgdGhpcy5sYXlvdXRJbmxpbmVUb29sYmFyKCk7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IubGF5b3V0Q29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IpO1xyXG5cclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yLmdldERvbU5vZGUoKTtcclxuICAgICAgICBjb25zdCB0ZXh0YXJlYSA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihcIlRFWFRBUkVBW25hbWU9J3RleHQnXVwiKTtcclxuXHJcbiAgICAgICAgaWYgKG1vZGUgPT0gRWRpdG9yTW9kZS5lZGl0b3IpIHtcclxuICAgICAgICAgICAgdGV4dGFyZWEudmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICAgICAgLy9IQUNLIC0gYmVjYXVzZSB0aGUgZXZlbnQgaW4gbW9uYWNvIGRvZXNuJ3QgaGF2ZSBwcmV2ZW50ZGVmYXVsdCB3aGljaCBtZWFucyBlZGl0b3IgdGFrZXMgZm9jdXMgYmFjay4uLiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRleHRhcmVhLmZvY3VzKCksIDEwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0YXJlYS52YWx1ZSxcclxuICAgICAgICAgICAgbGluZU51bWJlcjogbGluZU51bWJlclxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgbmV4dENvbW1lbnRJZCgpIHtcclxuICAgICAgICByZXR1cm4gYCR7bmV3IERhdGUoKS50b1N0cmluZygpfS0ke3RoaXMuY3VycmVudFVzZXJ9YDtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDb21tZW50KGxpbmVOdW1iZXI6IG51bWJlciwgdGV4dDogc3RyaW5nKTogUmV2aWV3Q29tbWVudCB7XHJcbiAgICAgICAgbGV0IGNvbW1lbnQ6IFJldmlld0NvbW1lbnQgPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgY29tbWVudCA9IG5ldyBSZXZpZXdDb21tZW50KHRoaXMubmV4dENvbW1lbnRJZCgpLCB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciwgdGhpcy5jdXJyZW50VXNlciwgbmV3IERhdGUoKSwgdGV4dClcclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDb21tZW50LmNvbW1lbnRzLnB1c2goY29tbWVudCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmZpbHRlckFuZE1hcENvbW1lbnRzKFtsaW5lTnVtYmVyXSwgKGNvbW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbW1lbnQucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5kaXJ0eTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29tbWVudCA9IG5ldyBSZXZpZXdDb21tZW50KHRoaXMubmV4dENvbW1lbnRJZCgpLCBsaW5lTnVtYmVyLCB0aGlzLmN1cnJlbnRVc2VyLCBuZXcgRGF0ZSgpLCB0ZXh0KVxyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRzLnB1c2goY29tbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpXHJcbiAgICAgICAgdGhpcy5sYXlvdXRJbmxpbmVUb29sYmFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UodGhpcy5jb21tZW50cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29tbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBpdGVyYXRlQ29tbWVudHMoY29tbWVudHM/OiBSZXZpZXdDb21tZW50W10sIGRlcHRoPzogbnVtYmVyLCBjb3VudEJ5TGluZU51bWJlcj86IGFueSwgcmVzdWx0cz86IFJldmlld0NvbW1lbnRJdGVySXRlbVtdKSB7XHJcbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XHJcbiAgICAgICAgZGVwdGggPSBkZXB0aCB8fCAwO1xyXG4gICAgICAgIGNvbW1lbnRzID0gY29tbWVudHMgfHwgdGhpcy5jb21tZW50cztcclxuICAgICAgICBjb3VudEJ5TGluZU51bWJlciA9IGNvdW50QnlMaW5lTnVtYmVyIHx8IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGNvbW1lbnQgb2YgY29tbWVudHMpIHtcclxuICAgICAgICAgICAgY291bnRCeUxpbmVOdW1iZXJbY29tbWVudC5saW5lTnVtYmVyXSA9IChjb3VudEJ5TGluZU51bWJlcltjb21tZW50LmxpbmVOdW1iZXJdIHx8IDApICsgMVxyXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goeyBkZXB0aCwgY29tbWVudCwgY291bnQ6IGNvdW50QnlMaW5lTnVtYmVyW2NvbW1lbnQubGluZU51bWJlcl0gfSlcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKGNvbW1lbnQuY29tbWVudHMsIGRlcHRoICsgMSwgY291bnRCeUxpbmVOdW1iZXIsIHJlc3VsdHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ29tbWVudChjb21tZW50OiBSZXZpZXdDb21tZW50KSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKFtjb21tZW50XSkpIHtcclxuICAgICAgICAgICAgaXRlbS5jb21tZW50LmRlbGV0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ID09IGNvbW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDb21tZW50KG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLmxheW91dElubGluZVRvb2xiYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMub25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLmNvbW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVmcmVzaENvbW1lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmNoYW5nZVZpZXdab25lcygoY2hhbmdlQWNjZXNzb3IpID0+IHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKHRoaXMuY29tbWVudHMsIDApKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LmRlbGV0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdEZWxldGUnLCBpdGVtLmNvbW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LnJlbmRlclN0YXR1cyA9PT0gUmV2aWV3Q29tbWVudFN0YXR1cy5oaWRkZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdIaWRkZW4nLCBpdGVtLmNvbW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbW1lbnQudmlld1pvbmVJZCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQucmVuZGVyU3RhdHVzID09PSBSZXZpZXdDb21tZW50U3RhdHVzLmRpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnRGlydHknLCBpdGVtLmNvbW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbW1lbnQudmlld1pvbmVJZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21tZW50LnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMubm9ybWFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghaXRlbS5jb21tZW50LnZpZXdab25lSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdDcmVhdGUnLCBpdGVtLmNvbW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb21Ob2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSB0aGlzLmFjdGl2ZUNvbW1lbnQgPT0gaXRlbS5jb21tZW50O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnN0eWxlLm1hcmdpbkxlZnQgPSAodGhpcy5jb25maWcuY29tbWVudEluZGVudCAqIChpdGVtLmRlcHRoICsgMSkpICsgdGhpcy5jb25maWcuY29tbWVudEluZGVudE9mZnNldCArIFwicHhcIjtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lJztcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmNsYXNzTmFtZSA9IGlzQWN0aXZlID8gJ3Jldmlld0NvbW1lbnQtYWN0aXZlJyA6ICdyZXZpZXdDb21tZW50LWluYWN0aXZlJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvci5jbGFzc05hbWUgPSAncmV2aWV3Q29tbWVudC1hdXRob3InXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yLmlubmVyVGV4dCA9IGl0ZW0uY29tbWVudC5hdXRob3IgfHwgJyAnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBkdC5jbGFzc05hbWUgPSAncmV2aWV3Q29tbWVudC1kdCdcclxuICAgICAgICAgICAgICAgICAgICBkdC5pbm5lclRleHQgPSBpdGVtLmNvbW1lbnQuZHQudG9Mb2NhbGVTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LmNsYXNzTmFtZSA9ICdyZXZpZXdDb21tZW50LXRleHQnXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5pbm5lclRleHQgPSBpdGVtLmNvbW1lbnQudGV4dDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChkdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChhdXRob3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQodGV4dCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkID0gY2hhbmdlQWNjZXNzb3IuYWRkWm9uZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyTGluZU51bWJlcjogaXRlbS5jb21tZW50LmxpbmVOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodEluTGluZXM6IDEsIC8vVE9ETyAtIEZpZ3VyZSBvdXQgaWYgbXVsdGktbGluZT9cclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZTogZG9tTm9kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VwcHJlc3NNb3VzZURvd246IHRydWUgLy8gVGhpcyBzdG9wcyBmb2N1cyBiZWluZyBsb3N0IHRoZSBlZGl0b3IgLSBtZWFuaW5nIGtleWJvYXJkIHNob3J0Y3V0cyBrZWVwcyB3b3JraW5nXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRBY3Rpb25zKCkge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZEFjdGlvbih7XHJcbiAgICAgICAgICAgIGlkOiAnbXktdW5pcXVlLWlkLWFkZCcsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnQWRkIENvbW1lbnQnLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nczogW1xyXG4gICAgICAgICAgICAgICAgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlNb2QuQ3RybENtZCB8IG1vbmFjb1dpbmRvdy5tb25hY28uS2V5Q29kZS5GMTAsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHByZWNvbmRpdGlvbjogbnVsbCxcclxuICAgICAgICAgICAga2V5YmluZGluZ0NvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51R3JvdXBJZDogJ25hdmlnYXRpb24nLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudU9yZGVyOiAwLFxyXG5cclxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS5lZGl0b3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZEFjdGlvbih7XHJcbiAgICAgICAgICAgIGlkOiAnbXktdW5pcXVlLWlkLW5leHQnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ05leHQgQ29tbWVudCcsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdzOiBbXHJcbiAgICAgICAgICAgICAgICBtb25hY29XaW5kb3cubW9uYWNvLktleU1vZC5DdHJsQ21kIHwgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlDb2RlLkYxMixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcHJlY29uZGl0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nQ29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVHcm91cElkOiAnbmF2aWdhdGlvbicsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51T3JkZXI6IDAuMSxcclxuXHJcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ29tbWVudChOYXZpZ2F0aW9uRGlyZWN0aW9uLm5leHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZEFjdGlvbih7XHJcbiAgICAgICAgICAgIGlkOiAnbXktdW5pcXVlLWlkLXByZXYnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ1ByZXYgQ29tbWVudCcsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdzOiBbXHJcbiAgICAgICAgICAgICAgICBtb25hY29XaW5kb3cubW9uYWNvLktleU1vZC5DdHJsQ21kIHwgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlDb2RlLkYxMSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcHJlY29uZGl0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nQ29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVHcm91cElkOiAnbmF2aWdhdGlvbicsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51T3JkZXI6IDAuMSxcclxuXHJcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ29tbWVudChOYXZpZ2F0aW9uRGlyZWN0aW9uLnByZXYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmF2aWdhdGVUb0NvbW1lbnQoZGlyZWN0aW9uOiBOYXZpZ2F0aW9uRGlyZWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gMDtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3VycmVudExpbmUgPSB0aGlzLmVkaXRvci5nZXRQb3NpdGlvbigpLmxpbmVOdW1iZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb21tZW50cyA9IHRoaXMuY29tbWVudHMuZmlsdGVyKChjKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IE5hdmlnYXRpb25EaXJlY3Rpb24ubmV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGMubGluZU51bWJlciA+IGN1cnJlbnRMaW5lO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWdhdGlvbkRpcmVjdGlvbi5wcmV2KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYy5saW5lTnVtYmVyIDwgY3VycmVudExpbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGNvbW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb21tZW50cy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBOYXZpZ2F0aW9uRGlyZWN0aW9uLm5leHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5saW5lTnVtYmVyIC0gYi5saW5lTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IE5hdmlnYXRpb25EaXJlY3Rpb24ucHJldikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiLmxpbmVOdW1iZXIgLSBhLmxpbmVOdW1iZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IGNvbW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNvbW1lbnQoY29tbWVudClcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKTtcclxuICAgICAgICAgICAgdGhpcy5sYXlvdXRJbmxpbmVUb29sYmFyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLnJldmVhbExpbmVJbkNlbnRlcihjb21tZW50LmxpbmVOdW1iZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZW51bSBOYXZpZ2F0aW9uRGlyZWN0aW9uIHtcclxuICAgIG5leHQgPSAxLFxyXG4gICAgcHJldiA9IDJcclxufVxyXG5cclxuZW51bSBFZGl0b3JNb2RlIHtcclxuICAgIGVkaXRvcixcclxuICAgIHRvb2xiYXJcclxufVxyXG5cclxuZW51bSBSZXZpZXdDb21tZW50U3RhdHVzIHtcclxuICAgIGRpcnR5LFxyXG4gICAgaGlkZGVuLFxyXG4gICAgbm9ybWFsXHJcbn0iXSwic291cmNlUm9vdCI6IiJ9