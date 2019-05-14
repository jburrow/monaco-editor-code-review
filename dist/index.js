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
        var root = document.createElement('span');
        root.className = "reviewCommentEdit";
        var textarea = document.createElement('textarea');
        textarea.className = "reviewCommentText";
        textarea.innerText = '-';
        textarea.name = 'text';
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
                if (_this.activeComment && _this.editorMode == EditorMode.editor) {
                    return {
                        position: {
                            lineNumber: _this.activeComment.lineNumber,
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
        console.log(ev.target.element);
        if (ev.target.element.tagName === 'TEXTAREA') {
        }
        else if (ev.target.element.tagName === 'BUTTON') {
            if (ev.target.element.name === 'add') {
                this.editorMode = EditorMode.editor;
                this.filterAndMapComments([this.editor.getPosition().lineNumber], function (comment) { comment.renderStatus = ReviewCommentStatus.hidden; });
                this.refreshComments();
                this.editor.layoutContentWidget(this.widgetInlineToolbar);
                this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
                // this.captureComment()
            }
            else if (ev.target.element.name === 'remove' && this.activeComment) {
                this.removeComment(this.activeComment);
                this.setActiveComment(null);
            }
            else if (ev.target.element.name === 'save') {
                var lineNumber = this.editor.getPosition().lineNumber;
                this.editorMode = EditorMode.toolbar;
                var element = this.widgetInlineCommentEditor.getDomNode();
                var text = element.querySelector("TEXTAREA[name='text']").value;
                this.filterAndMapComments([lineNumber], function (comment) { comment.renderStatus = ReviewCommentStatus.normal; });
                this.editor.layoutContentWidget(this.widgetInlineToolbar);
                this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
                this.addComment(lineNumber, text);
            }
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
            this.setActiveComment(activeComment);
        }
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
                    changeAccessor.removeZone(item.comment.viewZoneId);
                    continue;
                }
                if (item.comment.renderStatus === ReviewCommentStatus.hidden) {
                    changeAccessor.removeZone(item.comment.viewZoneId);
                    item.comment.viewZoneId = null;
                    continue;
                }
                if (item.comment.renderStatus === ReviewCommentStatus.dirty) {
                    changeAccessor.removeZone(item.comment.viewZoneId);
                    item.comment.viewZoneId = null;
                    item.comment.renderStatus = ReviewCommentStatus.normal;
                }
                if (!item.comment.viewZoneId) {
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
    ReviewManager.prototype.captureComment = function () {
        var promptMessage = 'Mesage';
        if (this.activeComment) {
            promptMessage += '- ' + this.activeComment.text;
        }
        var line = this.editor.getPosition().lineNumber;
        var message = prompt(promptMessage);
        if (message) {
            this.addComment(line, message);
        }
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
                return null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01vbmFjb0VkaXRvckNvZGVSZXZpZXcvLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQzlFQSxJQUFNLFlBQVksR0FBSSxNQUE4QixDQUFDO0FBRXJEO0lBYUksdUJBQVksRUFBVSxFQUFFLFVBQWtCLEVBQUUsTUFBYyxFQUFFLEVBQVEsRUFBRSxJQUFZLEVBQUUsUUFBMEI7UUFDMUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUNiLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElB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SUFBSSxFQUFFO29CQUM5QyxPQUFPLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQztpQkFDdEM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM5QztJQUNMLENBQUM7SUFDTCxvQkFBQztBQUFELENBQUM7QUFFRCxJQUFLLGtCQUdKO0FBSEQsV0FBSyxrQkFBa0I7SUFDbkIsMkRBQUk7SUFDSiwyREFBSTtBQUNSLENBQUMsRUFISSxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBR3RCO0FBRUQsSUFBSyxVQUdKO0FBSEQsV0FBSyxVQUFVO0lBQ1gsK0NBQU07SUFDTixpREFBTztBQUNYLENBQUMsRUFISSxVQUFVLEtBQVYsVUFBVSxRQUdkO0FBRUQsSUFBSyxtQkFJSjtBQUpELFdBQUssbUJBQW1CO0lBQ3BCLCtEQUFLO0lBQ0wsaUVBQU07SUFDTixpRUFBTTtBQUNWLENBQUMsRUFKSSxtQkFBbUIsS0FBbkIsbUJBQW1CLFFBSXZCIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbnRlcmZhY2UgTW9uYWNvV2luZG93IHtcclxuICAgIG1vbmFjbzogYW55O1xyXG59XHJcblxyXG5jb25zdCBtb25hY29XaW5kb3cgPSAod2luZG93IGFzIGFueSkgYXMgTW9uYWNvV2luZG93O1xyXG5cclxuZXhwb3J0IGNsYXNzIFJldmlld0NvbW1lbnQge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIGF1dGhvcjogc3RyaW5nO1xyXG4gICAgZHQ6IERhdGU7XHJcbiAgICBsaW5lTnVtYmVyOiBudW1iZXI7XHJcbiAgICB0ZXh0OiBzdHJpbmc7XHJcbiAgICBjb21tZW50czogUmV2aWV3Q29tbWVudFtdO1xyXG5cclxuICAgIGRlbGV0ZWQ6IGJvb2xlYW47XHJcbiAgICB2aWV3Wm9uZUlkOiBudW1iZXI7XHJcbiAgICByZW5kZXJTdGF0dXM6IFJldmlld0NvbW1lbnRTdGF0dXM7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGxpbmVOdW1iZXI6IG51bWJlciwgYXV0aG9yOiBzdHJpbmcsIGR0OiBEYXRlLCB0ZXh0OiBzdHJpbmcsIGNvbW1lbnRzPzogUmV2aWV3Q29tbWVudFtdKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMuYXV0aG9yID0gYXV0aG9yO1xyXG4gICAgICAgIHRoaXMuZHQgPSBkdDtcclxuICAgICAgICB0aGlzLmxpbmVOdW1iZXIgPSBsaW5lTnVtYmVyO1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgdGhpcy5jb21tZW50cyA9IGNvbW1lbnRzIHx8IFtdO1xyXG5cclxuICAgICAgICAvL0hBQ0sgLSB0aGlzIGlzIHJ1bnRpbWUgc3RhdGUgLSBhbmQgc2hvdWxkIGJlIG1vdmVkXHJcbiAgICAgICAgdGhpcy5kZWxldGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJTdGF0dXMgPSBSZXZpZXdDb21tZW50U3RhdHVzLm5vcm1hbDtcclxuICAgICAgICB0aGlzLnZpZXdab25lSWQgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmV2aWV3TWFuYWdlcihlZGl0b3I6IGFueSwgY3VycmVudFVzZXI6IHN0cmluZywgY29tbWVudHM/OiBSZXZpZXdDb21tZW50W10sIG9uQ2hhbmdlPzogT25Db21tZW50c0NoYW5nZWQpIHtcclxuICAgIGNvbnN0IHJtID0gbmV3IFJldmlld01hbmFnZXIoZWRpdG9yLCBjdXJyZW50VXNlciwgb25DaGFuZ2UpO1xyXG4gICAgcm0ubG9hZChjb21tZW50cyB8fCBbXSk7XHJcbiAgICByZXR1cm4gcm07XHJcbn1cclxuXHJcbmludGVyZmFjZSBSZXZpZXdDb21tZW50SXRlckl0ZW0ge1xyXG4gICAgZGVwdGg6IG51bWJlcjtcclxuICAgIGNvbW1lbnQ6IFJldmlld0NvbW1lbnQsXHJcbiAgICBjb3VudDogbnVtYmVyXHJcbn1cclxuXHJcbmludGVyZmFjZSBPbkNvbW1lbnRzQ2hhbmdlZCB7XHJcbiAgICAoY29tbWVudHM6IFJldmlld0NvbW1lbnRbXSk6IHZvaWRcclxufVxyXG5cclxuY2xhc3MgUmV2aWV3TWFuYWdlciB7XHJcbiAgICBjdXJyZW50VXNlcjogc3RyaW5nO1xyXG4gICAgZWRpdG9yOiBhbnk7XHJcbiAgICBjb21tZW50czogUmV2aWV3Q29tbWVudFtdO1xyXG4gICAgYWN0aXZlQ29tbWVudD86IFJldmlld0NvbW1lbnQ7XHJcbiAgICB3aWRnZXRJbmxpbmVUb29sYmFyOiBhbnk7XHJcbiAgICB3aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yOiBhbnk7XHJcbiAgICBvbkNoYW5nZTogT25Db21tZW50c0NoYW5nZWQ7XHJcbiAgICBlZGl0b3JNb2RlOiBFZGl0b3JNb2RlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVkaXRvcjogYW55LCBjdXJyZW50VXNlcjogc3RyaW5nLCBvbkNoYW5nZTogT25Db21tZW50c0NoYW5nZWQpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gY3VycmVudFVzZXI7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVDb21tZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbW1lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyID0gbnVsbDtcclxuICAgICAgICB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcclxuICAgICAgICB0aGlzLmVkaXRvck1vZGUgPSBFZGl0b3JNb2RlLnRvb2xiYXI7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQWN0aW9ucygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlSW5saW5lVG9vbGJhcldpZGdldCgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlSW5saW5lRWRpdG9yV2lkZ2V0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLm9uTW91c2VEb3duKHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWQoY29tbWVudHM6IFJldmlld0NvbW1lbnRbXSkge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmNoYW5nZVZpZXdab25lcygoY2hhbmdlQWNjZXNzb3IpID0+IHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQudmlld1pvbmVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUoaXRlbS5jb21tZW50LnZpZXdab25lSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTaG91bGQgdGhpcyBiZSBpbnNpZGUgdGhpcyBjYWxsYmFjaz9cclxuICAgICAgICAgICAgdGhpcy5jb21tZW50cyA9IGNvbW1lbnRzO1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpO1xyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5saW5lRWRpdEJ1dHRvbnNFbGVtZW50KCkge1xyXG4gICAgICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgIGFkZC5pbm5lclRleHQgPSAnKyc7XHJcbiAgICAgICAgYWRkLm5hbWUgPSAnYWRkJztcclxuXHJcbiAgICAgICAgY29uc3QgcmVtb3ZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgcmVtb3ZlLmlubmVyVGV4dCA9ICctJztcclxuICAgICAgICByZW1vdmUubmFtZSA9ICdyZW1vdmUnO1xyXG5cclxuICAgICAgICB2YXIgcm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGFkZCk7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChyZW1vdmUpO1xyXG4gICAgICAgIHJvb3Quc3R5bGUud2lkdGggPSBcIjUwcHhcIjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJvb3Q7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5saW5lRWRpdG9yRWxlbWVudCgpIHtcclxuICAgICAgICB2YXIgcm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICByb290LmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudEVkaXRcIlxyXG5cclxuICAgICAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcbiAgICAgICAgdGV4dGFyZWEuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50VGV4dFwiO1xyXG4gICAgICAgIHRleHRhcmVhLmlubmVyVGV4dCA9ICctJztcclxuICAgICAgICB0ZXh0YXJlYS5uYW1lID0gJ3RleHQnO1xyXG5cclxuICAgICAgICBjb25zdCBzYXZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgc2F2ZS5jbGFzc05hbWUgPSBcInJldmlld0NvbW1lbnRTYXZlXCI7XHJcbiAgICAgICAgc2F2ZS5pbm5lclRleHQgPSAnU2F2ZSc7XHJcbiAgICAgICAgc2F2ZS5uYW1lID0gJ3NhdmUnO1xyXG5cclxuICAgICAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICBzYXZlLmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudENhbmNlbFwiO1xyXG4gICAgICAgIGNhbmNlbC5pbm5lclRleHQgPSAnQ2FuY2VsJztcclxuICAgICAgICBjYW5jZWwubmFtZSA9ICdDYW5jZWwnO1xyXG5cclxuICAgICAgICByb290LmFwcGVuZENoaWxkKHRleHRhcmVhKTtcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKHNhdmUpO1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2FuY2VsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJvb3RcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJbmxpbmVUb29sYmFyV2lkZ2V0KCkge1xyXG4gICAgICAgIGNvbnN0IGJ1dHRvbnNFbGVtZW50ID0gdGhpcy5jcmVhdGVJbmxpbmVFZGl0QnV0dG9uc0VsZW1lbnQoKTtcclxuICAgICAgICB0aGlzLndpZGdldElubGluZVRvb2xiYXIgPSB7XHJcbiAgICAgICAgICAgIGFsbG93RWRpdG9yT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgICAgIGdldElkOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3dpZGdldElubGluZVRvb2xiYXInO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREb21Ob2RlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYnV0dG9uc0VsZW1lbnQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ICYmIHRoaXMuZWRpdG9yTW9kZSA9PSBFZGl0b3JNb2RlLnRvb2xiYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZlcmVuY2U6IFttb25hY29XaW5kb3cubW9uYWNvLmVkaXRvci5Db250ZW50V2lkZ2V0UG9zaXRpb25QcmVmZXJlbmNlLkJFTE9XXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVUb29sYmFyKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJbmxpbmVFZGl0b3JXaWRnZXQoKSB7XHJcbiAgICAgICAgY29uc3QgZWRpdG9yRWxlbWVudCA9IHRoaXMuY3JlYXRlSW5saW5lRWRpdG9yRWxlbWVudCgpO1xyXG4gICAgICAgIHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvciA9IHtcclxuICAgICAgICAgICAgYWxsb3dFZGl0b3JPdmVyZmxvdzogdHJ1ZSxcclxuICAgICAgICAgICAgZ2V0SWQ6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnd2lkZ2V0SW5saW5lRWRpdG9yJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0RG9tTm9kZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVkaXRvckVsZW1lbnQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ICYmIHRoaXMuZWRpdG9yTW9kZSA9PSBFZGl0b3JNb2RlLmVkaXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZmVyZW5jZTogW21vbmFjb1dpbmRvdy5tb25hY28uZWRpdG9yLkNvbnRlbnRXaWRnZXRQb3NpdGlvblByZWZlcmVuY2UuQkVMT1ddXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQ29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEFjdGl2ZUNvbW1lbnQoY29tbWVudDogUmV2aWV3Q29tbWVudCkge1xyXG4gICAgICAgIGNvbnN0IGxpbmVOdW1iZXJzVG9NYWtlRGlydHkgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ICYmICghY29tbWVudCB8fCB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciAhPT0gY29tbWVudC5saW5lTnVtYmVyKSkge1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVyc1RvTWFrZURpcnR5LnB1c2godGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29tbWVudCkge1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVyc1RvTWFrZURpcnR5LnB1c2goY29tbWVudC5saW5lTnVtYmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudCA9IGNvbW1lbnQ7XHJcbiAgICAgICAgaWYgKGxpbmVOdW1iZXJzVG9NYWtlRGlydHkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmZpbHRlckFuZE1hcENvbW1lbnRzKGxpbmVOdW1iZXJzVG9NYWtlRGlydHksIChjb21tZW50KSA9PiB7IGNvbW1lbnQucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5kaXJ0eSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVUb29sYmFyKTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJBbmRNYXBDb21tZW50cyhsaW5lTnVtYmVyczogbnVtYmVyW10sIGZuOiB7IChjb21tZW50OiBSZXZpZXdDb21tZW50KTogdm9pZCB9KSB7XHJcbiAgICAgICAgY29uc3QgY29tbWVudHMgPSB0aGlzLml0ZXJhdGVDb21tZW50cygpO1xyXG4gICAgICAgIGZvciAoY29uc3QgYyBvZiBjb21tZW50cykge1xyXG4gICAgICAgICAgICBpZiAobGluZU51bWJlcnMuaW5kZXhPZihjLmNvbW1lbnQubGluZU51bWJlcikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgZm4oYy5jb21tZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVNb3VzZURvd24oZXY6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGV2LnRhcmdldC5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgaWYgKGV2LnRhcmdldC5lbGVtZW50LnRhZ05hbWUgPT09ICdURVhUQVJFQScpIHtcclxuXHJcbiAgICAgICAgfSBlbHNlIGlmIChldi50YXJnZXQuZWxlbWVudC50YWdOYW1lID09PSAnQlVUVE9OJykge1xyXG4gICAgICAgICAgICBpZiAoZXYudGFyZ2V0LmVsZW1lbnQubmFtZSA9PT0gJ2FkZCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yTW9kZSA9IEVkaXRvck1vZGUuZWRpdG9yO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQW5kTWFwQ29tbWVudHMoW3RoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlcl0sIChjb21tZW50KSA9PiB7IGNvbW1lbnQucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5oaWRkZW4gfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVUb29sYmFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yKTtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMuY2FwdHVyZUNvbW1lbnQoKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2LnRhcmdldC5lbGVtZW50Lm5hbWUgPT09ICdyZW1vdmUnICYmIHRoaXMuYWN0aXZlQ29tbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVDb21tZW50KHRoaXMuYWN0aXZlQ29tbWVudCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNvbW1lbnQobnVsbCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXYudGFyZ2V0LmVsZW1lbnQubmFtZSA9PT0gJ3NhdmUnKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lTnVtYmVyID0gdGhpcy5lZGl0b3IuZ2V0UG9zaXRpb24oKS5saW5lTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0b3JNb2RlID0gRWRpdG9yTW9kZS50b29sYmFyO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvci5nZXREb21Ob2RlKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiVEVYVEFSRUFbbmFtZT0ndGV4dCddXCIpLnZhbHVlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsdGVyQW5kTWFwQ29tbWVudHMoW2xpbmVOdW1iZXJdLCAoY29tbWVudCkgPT4geyBjb21tZW50LnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMubm9ybWFsIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVUb29sYmFyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZENvbW1lbnQobGluZU51bWJlcix0ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXYudGFyZ2V0LmRldGFpbCkge1xyXG4gICAgICAgICAgICBsZXQgYWN0aXZlQ29tbWVudDogUmV2aWV3Q29tbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LnZpZXdab25lSWQgPT0gZXYudGFyZ2V0LmRldGFpbC52aWV3Wm9uZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlQ29tbWVudCA9IGl0ZW0uY29tbWVudDtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDb21tZW50KGFjdGl2ZUNvbW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuZXh0Q29tbWVudElkKCkge1xyXG4gICAgICAgIHJldHVybiBgJHtuZXcgRGF0ZSgpLnRvU3RyaW5nKCl9LSR7dGhpcy5jdXJyZW50VXNlcn1gO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENvbW1lbnQobGluZU51bWJlcjogbnVtYmVyLCB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSBuZXcgUmV2aWV3Q29tbWVudCh0aGlzLm5leHRDb21tZW50SWQoKSwgdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIsIHRoaXMuY3VycmVudFVzZXIsIG5ldyBEYXRlKCksIHRleHQpXHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudC5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSBuZXcgUmV2aWV3Q29tbWVudCh0aGlzLm5leHRDb21tZW50SWQoKSwgbGluZU51bWJlciwgdGhpcy5jdXJyZW50VXNlciwgbmV3IERhdGUoKSwgdGV4dClcclxuICAgICAgICAgICAgdGhpcy5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKVxyXG5cclxuICAgICAgICBpZiAodGhpcy5vbkNoYW5nZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuY29tbWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpdGVyYXRlQ29tbWVudHMoY29tbWVudHM/OiBSZXZpZXdDb21tZW50W10sIGRlcHRoPzogbnVtYmVyLCBjb3VudEJ5TGluZU51bWJlcj86IGFueSwgcmVzdWx0cz86IFJldmlld0NvbW1lbnRJdGVySXRlbVtdKSB7XHJcbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XHJcbiAgICAgICAgZGVwdGggPSBkZXB0aCB8fCAwO1xyXG4gICAgICAgIGNvbW1lbnRzID0gY29tbWVudHMgfHwgdGhpcy5jb21tZW50cztcclxuICAgICAgICBjb3VudEJ5TGluZU51bWJlciA9IGNvdW50QnlMaW5lTnVtYmVyIHx8IHt9O1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGNvbW1lbnQgb2YgY29tbWVudHMpIHtcclxuICAgICAgICAgICAgY291bnRCeUxpbmVOdW1iZXJbY29tbWVudC5saW5lTnVtYmVyXSA9IChjb3VudEJ5TGluZU51bWJlcltjb21tZW50LmxpbmVOdW1iZXJdIHx8IDApICsgMVxyXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goeyBkZXB0aCwgY29tbWVudCwgY291bnQ6IGNvdW50QnlMaW5lTnVtYmVyW2NvbW1lbnQubGluZU51bWJlcl0gfSlcclxuICAgICAgICAgICAgdGhpcy5pdGVyYXRlQ29tbWVudHMoY29tbWVudC5jb21tZW50cywgZGVwdGggKyAxLCBjb3VudEJ5TGluZU51bWJlciwgcmVzdWx0cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVDb21tZW50KGNvbW1lbnQ6IFJldmlld0NvbW1lbnQpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoW2NvbW1lbnRdKSkge1xyXG4gICAgICAgICAgICBpdGVtLmNvbW1lbnQuZGVsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMub25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLmNvbW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVmcmVzaENvbW1lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmNoYW5nZVZpZXdab25lcygoY2hhbmdlQWNjZXNzb3IpID0+IHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKHRoaXMuY29tbWVudHMsIDApKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LmRlbGV0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LnJlbmRlclN0YXR1cyA9PT0gUmV2aWV3Q29tbWVudFN0YXR1cy5oaWRkZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbW1lbnQudmlld1pvbmVJZCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQucmVuZGVyU3RhdHVzID09PSBSZXZpZXdDb21tZW50U3RhdHVzLmRpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQWNjZXNzb3IucmVtb3ZlWm9uZShpdGVtLmNvbW1lbnQudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21tZW50LnZpZXdab25lSWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tbWVudC5yZW5kZXJTdGF0dXMgPSBSZXZpZXdDb21tZW50U3RhdHVzLm5vcm1hbDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0uY29tbWVudC52aWV3Wm9uZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9tTm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzQWN0aXZlID0gdGhpcy5hY3RpdmVDb21tZW50ID09IGl0ZW0uY29tbWVudDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5zdHlsZS5tYXJnaW5MZWZ0ID0gKDI1ICogKGl0ZW0uZGVwdGggKyAxKSkgKyA1MCArIFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5zdHlsZS53aWR0aCA9IFwiMTAwXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5jbGFzc05hbWUgPSBpc0FjdGl2ZSA/ICdyZXZpZXdDb21tZW50LWFjdGl2ZScgOiAncmV2aWV3Q29tbWVudC1pbmFjdGl2ZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuY2xhc3NOYW1lID0gaXNBY3RpdmUgPyAncmV2aWV3Q29tbWVudC1zZWxlY3Rpb24tYWN0aXZlJyA6ICdyZXZpZXdDb21tZW50LXNlbGVjdGlvbi1pbmFjdGl2ZSdcclxuICAgICAgICAgICAgICAgICAgICBzdGF0dXMuaW5uZXJUZXh0ID0gaXNBY3RpdmUgPyAnPj4nIDogJy0tLSc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBhdXRob3IuY2xhc3NOYW1lID0gJ3Jldmlld0NvbW1lbnQtYXV0aG9yJ1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvci5pbm5lclRleHQgPSBpdGVtLmNvbW1lbnQuYXV0aG9yIHx8ICcgJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgZHQuY2xhc3NOYW1lID0gJ3Jldmlld0NvbW1lbnQtZHQnXHJcbiAgICAgICAgICAgICAgICAgICAgZHQuaW5uZXJUZXh0ID0gaXRlbS5jb21tZW50LmR0LnRvTG9jYWxlU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5jbGFzc05hbWUgPSAncmV2aWV3Q29tbWVudC10ZXh0J1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQuaW5uZXJUZXh0ID0gaXRlbS5jb21tZW50LnRleHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQoc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmFwcGVuZENoaWxkKGR0KTtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmFwcGVuZENoaWxkKGF1dGhvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21tZW50LnZpZXdab25lSWQgPSBjaGFuZ2VBY2Nlc3Nvci5hZGRab25lKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXJMaW5lTnVtYmVyOiBpdGVtLmNvbW1lbnQubGluZU51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0SW5MaW5lczogMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZTogZG9tTm9kZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2FwdHVyZUNvbW1lbnQoKSB7XHJcbiAgICAgICAgbGV0IHByb21wdE1lc3NhZ2UgPSAnTWVzYWdlJztcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIHByb21wdE1lc3NhZ2UgKz0gJy0gJyArIHRoaXMuYWN0aXZlQ29tbWVudC50ZXh0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbGluZSA9IHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlcjtcclxuICAgICAgICBjb25zdCBtZXNzYWdlID0gcHJvbXB0KHByb21wdE1lc3NhZ2UpO1xyXG5cclxuICAgICAgICBpZiAobWVzc2FnZSkge1xyXG4gICAgICAgICAgICB0aGlzLmFkZENvbW1lbnQobGluZSwgbWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFkZEFjdGlvbnMoKSB7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQWN0aW9uKHtcclxuICAgICAgICAgICAgaWQ6ICdteS11bmlxdWUtaWQtYWRkJyxcclxuICAgICAgICAgICAgbGFiZWw6ICdBZGQgQ29tbWVudCcsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdzOiBbXHJcbiAgICAgICAgICAgICAgICBtb25hY29XaW5kb3cubW9uYWNvLktleU1vZC5DdHJsQ21kIHwgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlDb2RlLkYxMCxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcHJlY29uZGl0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nQ29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVHcm91cElkOiAnbmF2aWdhdGlvbicsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51T3JkZXI6IDAsXHJcblxyXG4gICAgICAgICAgICBydW46ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FwdHVyZUNvbW1lbnQoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQWN0aW9uKHtcclxuICAgICAgICAgICAgaWQ6ICdteS11bmlxdWUtaWQtbmV4dCcsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnTmV4dCBDb21tZW50JyxcclxuICAgICAgICAgICAga2V5YmluZGluZ3M6IFtcclxuICAgICAgICAgICAgICAgIG1vbmFjb1dpbmRvdy5tb25hY28uS2V5TW9kLkN0cmxDbWQgfCBtb25hY29XaW5kb3cubW9uYWNvLktleUNvZGUuRjEyLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwcmVjb25kaXRpb246IG51bGwsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdDb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudUdyb3VwSWQ6ICduYXZpZ2F0aW9uJyxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVPcmRlcjogMC4xLFxyXG5cclxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9Db21tZW50KE5hdmlhdGlvbkRpcmVjdGlvbi5uZXh0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZEFjdGlvbih7XHJcbiAgICAgICAgICAgIGlkOiAnbXktdW5pcXVlLWlkLXByZXYnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ1ByZXYgQ29tbWVudCcsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdzOiBbXHJcbiAgICAgICAgICAgICAgICBtb25hY29XaW5kb3cubW9uYWNvLktleU1vZC5DdHJsQ21kIHwgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlDb2RlLkYxMSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcHJlY29uZGl0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nQ29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVHcm91cElkOiAnbmF2aWdhdGlvbicsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51T3JkZXI6IDAuMSxcclxuXHJcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ29tbWVudChOYXZpYXRpb25EaXJlY3Rpb24ucHJldik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlVG9Db21tZW50KGRpcmVjdGlvbjogTmF2aWF0aW9uRGlyZWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gMDtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3VycmVudExpbmUgPSB0aGlzLmVkaXRvci5nZXRQb3NpdGlvbigpLmxpbmVOdW1iZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb21tZW50cyA9IHRoaXMuY29tbWVudHMuZmlsdGVyKChjKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IE5hdmlhdGlvbkRpcmVjdGlvbi5uZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYy5saW5lTnVtYmVyID4gY3VycmVudExpbmU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBOYXZpYXRpb25EaXJlY3Rpb24ucHJldikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGMubGluZU51bWJlciA8IGN1cnJlbnRMaW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChjb21tZW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29tbWVudHMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWF0aW9uRGlyZWN0aW9uLm5leHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5saW5lTnVtYmVyIC0gYi5saW5lTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IE5hdmlhdGlvbkRpcmVjdGlvbi5wcmV2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIubGluZU51bWJlciAtIGEubGluZU51bWJlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb21tZW50ID0gY29tbWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ29tbWVudChjb21tZW50KVxyXG4gICAgICAgICAgICB0aGlzLmVkaXRvci5yZXZlYWxMaW5lKGNvbW1lbnQubGluZU51bWJlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5lbnVtIE5hdmlhdGlvbkRpcmVjdGlvbiB7XHJcbiAgICBuZXh0LFxyXG4gICAgcHJldlxyXG59XHJcblxyXG5lbnVtIEVkaXRvck1vZGUge1xyXG4gICAgZWRpdG9yLFxyXG4gICAgdG9vbGJhclxyXG59XHJcblxyXG5lbnVtIFJldmlld0NvbW1lbnRTdGF0dXMge1xyXG4gICAgZGlydHksXHJcbiAgICBoaWRkZW4sXHJcbiAgICBub3JtYWxcclxufSJdLCJzb3VyY2VSb290IjoiIn0=