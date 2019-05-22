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

/***/ "./node_modules/uuid/lib/bytesToUuid.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/bytesToUuid.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),

/***/ "./node_modules/uuid/lib/rng-browser.js":
/*!**********************************************!*\
  !*** ./node_modules/uuid/lib/rng-browser.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),

/***/ "./node_modules/uuid/v4.js":
/*!*********************************!*\
  !*** ./node_modules/uuid/v4.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(/*! ./lib/rng */ "./node_modules/uuid/lib/rng-browser.js");
var bytesToUuid = __webpack_require__(/*! ./lib/bytesToUuid */ "./node_modules/uuid/lib/bytesToUuid.js");

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),

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
var uuid = __webpack_require__(/*! uuid/v4 */ "./node_modules/uuid/v4.js");
var monacoWindow = window;
var ReviewCommentState = /** @class */ (function () {
    function ReviewCommentState(numberOfLines) {
        this.renderStatus = ReviewCommentStatus.normal;
        this.viewZoneId = null;
        this.numberOfLines = numberOfLines;
    }
    return ReviewCommentState;
}());
function createReviewManager(editor, currentUser, comments, onChange, config) {
    //For Debug: (window as any).editor = editor;    
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
                _this.commentState[item.comment.id] = new ReviewCommentState(_this.calculateNumberOfLines(item.comment.text));
            }
            _this.refreshComments();
            console.debug('Comments Loaded: ', _this.comments.length);
        });
    };
    ReviewManager.prototype.calculateNumberOfLines = function (text) {
        return text.split(/\r*\n/).length;
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
        textarea.style.lineHeight = '1';
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
    ReviewManager.prototype.addComment = function (lineNumber, text) {
        var ln = this.activeComment ? this.activeComment.lineNumber : lineNumber;
        var comment = {
            id: uuid(),
            lineNumber: ln,
            author: this.currentUser,
            dt: new Date(),
            text: text
        };
        this.commentState[comment.id] = new ReviewCommentState(this.calculateNumberOfLines(text));
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
    ReviewManager.prototype.iterateComments = function (comments, depth, results) {
        results = results || [];
        depth = depth || 0;
        comments = comments || this.comments;
        if (comments) {
            for (var _i = 0, comments_2 = comments; _i < comments_2.length; _i++) {
                var comment = comments_2[_i];
                results.push({
                    depth: depth,
                    comment: comment,
                    viewState: this.commentState[comment.id]
                });
                if (comment.comments) {
                    this.iterateComments(comment.comments, depth + 1, results);
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
                    author.innerText = (item.comment.author || ' ') + " at ";
                    var dt = document.createElement('span');
                    dt.className = 'reviewComment-dt';
                    dt.innerText = item.comment.dt.toLocaleString();
                    var text = document.createElement('span');
                    text.className = 'reviewComment-text';
                    text.innerText = item.comment.text + " by ";
                    domNode.appendChild(text);
                    domNode.appendChild(author);
                    domNode.appendChild(dt);
                    item.viewState.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: item.comment.lineNumber,
                        heightInLines: item.viewState.numberOfLines,
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
                                color: "darkorange",
                                darkColor: "darkorange",
                                position: 1
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01vbmFjb0VkaXRvckNvZGVSZXZpZXcvLi9ub2RlX21vZHVsZXMvdXVpZC9saWIvYnl0ZXNUb1V1aWQuanMiLCJ3ZWJwYWNrOi8vTW9uYWNvRWRpdG9yQ29kZVJldmlldy8uL25vZGVfbW9kdWxlcy91dWlkL2xpYi9ybmctYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3Ly4vbm9kZV9tb2R1bGVzL3V1aWQvdjQuanMiLCJ3ZWJwYWNrOi8vTW9uYWNvRWRpdG9yQ29kZVJldmlldy8uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFD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QztxQkFBTSxJQUFJLFNBQVMsS0FBSyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUU7b0JBQy9DLE9BQU8sQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDO2lCQUN0QztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7WUFDOUIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxDQUFDO1lBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3REO0lBQ0wsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0FBQztBQUdELElBQUssbUJBR0o7QUFIRCxXQUFLLG1CQUFtQjtJQUNwQiw2REFBUTtJQUNSLDZEQUFRO0FBQ1osQ0FBQyxFQUhJLG1CQUFtQixLQUFuQixtQkFBbUIsUUFHdkI7QUFFRCxJQUFLLFVBR0o7QUFIRCxXQUFLLFVBQVU7SUFDWCwrQ0FBTTtJQUNOLGlEQUFPO0FBQ1gsQ0FBQyxFQUhJLFVBQVUsS0FBVixVQUFVLFFBR2Q7QUFFRCxJQUFLLG1CQUlKO0FBSkQsV0FBSyxtQkFBbUI7SUFDcEIsK0RBQUs7SUFDTCxpRUFBTTtJQUNOLGlFQUFNO0FBQ1YsQ0FBQyxFQUpJLG1CQUFtQixLQUFuQixtQkFBbUIsUUFJdkIiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIi8qKlxuICogQ29udmVydCBhcnJheSBvZiAxNiBieXRlIHZhbHVlcyB0byBVVUlEIHN0cmluZyBmb3JtYXQgb2YgdGhlIGZvcm06XG4gKiBYWFhYWFhYWC1YWFhYLVhYWFgtWFhYWC1YWFhYWFhYWFhYWFhcbiAqL1xudmFyIGJ5dGVUb0hleCA9IFtdO1xuZm9yICh2YXIgaSA9IDA7IGkgPCAyNTY7ICsraSkge1xuICBieXRlVG9IZXhbaV0gPSAoaSArIDB4MTAwKS50b1N0cmluZygxNikuc3Vic3RyKDEpO1xufVxuXG5mdW5jdGlvbiBieXRlc1RvVXVpZChidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IG9mZnNldCB8fCAwO1xuICB2YXIgYnRoID0gYnl0ZVRvSGV4O1xuICAvLyBqb2luIHVzZWQgdG8gZml4IG1lbW9yeSBpc3N1ZSBjYXVzZWQgYnkgY29uY2F0ZW5hdGlvbjogaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9MzE3NSNjNFxuICByZXR1cm4gKFtidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCBcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dXSkuam9pbignJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnl0ZXNUb1V1aWQ7XG4iLCIvLyBVbmlxdWUgSUQgY3JlYXRpb24gcmVxdWlyZXMgYSBoaWdoIHF1YWxpdHkgcmFuZG9tICMgZ2VuZXJhdG9yLiAgSW4gdGhlXG4vLyBicm93c2VyIHRoaXMgaXMgYSBsaXR0bGUgY29tcGxpY2F0ZWQgZHVlIHRvIHVua25vd24gcXVhbGl0eSBvZiBNYXRoLnJhbmRvbSgpXG4vLyBhbmQgaW5jb25zaXN0ZW50IHN1cHBvcnQgZm9yIHRoZSBgY3J5cHRvYCBBUEkuICBXZSBkbyB0aGUgYmVzdCB3ZSBjYW4gdmlhXG4vLyBmZWF0dXJlLWRldGVjdGlvblxuXG4vLyBnZXRSYW5kb21WYWx1ZXMgbmVlZHMgdG8gYmUgaW52b2tlZCBpbiBhIGNvbnRleHQgd2hlcmUgXCJ0aGlzXCIgaXMgYSBDcnlwdG9cbi8vIGltcGxlbWVudGF0aW9uLiBBbHNvLCBmaW5kIHRoZSBjb21wbGV0ZSBpbXBsZW1lbnRhdGlvbiBvZiBjcnlwdG8gb24gSUUxMS5cbnZhciBnZXRSYW5kb21WYWx1ZXMgPSAodHlwZW9mKGNyeXB0bykgIT0gJ3VuZGVmaW5lZCcgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQoY3J5cHRvKSkgfHxcbiAgICAgICAgICAgICAgICAgICAgICAodHlwZW9mKG1zQ3J5cHRvKSAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93Lm1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PSAnZnVuY3Rpb24nICYmIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKG1zQ3J5cHRvKSk7XG5cbmlmIChnZXRSYW5kb21WYWx1ZXMpIHtcbiAgLy8gV0hBVFdHIGNyeXB0byBSTkcgLSBodHRwOi8vd2lraS53aGF0d2cub3JnL3dpa2kvQ3J5cHRvXG4gIHZhciBybmRzOCA9IG5ldyBVaW50OEFycmF5KDE2KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gd2hhdHdnUk5HKCkge1xuICAgIGdldFJhbmRvbVZhbHVlcyhybmRzOCk7XG4gICAgcmV0dXJuIHJuZHM4O1xuICB9O1xufSBlbHNlIHtcbiAgLy8gTWF0aC5yYW5kb20oKS1iYXNlZCAoUk5HKVxuICAvL1xuICAvLyBJZiBhbGwgZWxzZSBmYWlscywgdXNlIE1hdGgucmFuZG9tKCkuICBJdCdzIGZhc3QsIGJ1dCBpcyBvZiB1bnNwZWNpZmllZFxuICAvLyBxdWFsaXR5LlxuICB2YXIgcm5kcyA9IG5ldyBBcnJheSgxNik7XG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXRoUk5HKCkge1xuICAgIGZvciAodmFyIGkgPSAwLCByOyBpIDwgMTY7IGkrKykge1xuICAgICAgaWYgKChpICYgMHgwMykgPT09IDApIHIgPSBNYXRoLnJhbmRvbSgpICogMHgxMDAwMDAwMDA7XG4gICAgICBybmRzW2ldID0gciA+Pj4gKChpICYgMHgwMykgPDwgMykgJiAweGZmO1xuICAgIH1cblxuICAgIHJldHVybiBybmRzO1xuICB9O1xufVxuIiwidmFyIHJuZyA9IHJlcXVpcmUoJy4vbGliL3JuZycpO1xudmFyIGJ5dGVzVG9VdWlkID0gcmVxdWlyZSgnLi9saWIvYnl0ZXNUb1V1aWQnKTtcblxuZnVuY3Rpb24gdjQob3B0aW9ucywgYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBidWYgJiYgb2Zmc2V0IHx8IDA7XG5cbiAgaWYgKHR5cGVvZihvcHRpb25zKSA9PSAnc3RyaW5nJykge1xuICAgIGJ1ZiA9IG9wdGlvbnMgPT09ICdiaW5hcnknID8gbmV3IEFycmF5KDE2KSA6IG51bGw7XG4gICAgb3B0aW9ucyA9IG51bGw7XG4gIH1cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgdmFyIHJuZHMgPSBvcHRpb25zLnJhbmRvbSB8fCAob3B0aW9ucy5ybmcgfHwgcm5nKSgpO1xuXG4gIC8vIFBlciA0LjQsIHNldCBiaXRzIGZvciB2ZXJzaW9uIGFuZCBgY2xvY2tfc2VxX2hpX2FuZF9yZXNlcnZlZGBcbiAgcm5kc1s2XSA9IChybmRzWzZdICYgMHgwZikgfCAweDQwO1xuICBybmRzWzhdID0gKHJuZHNbOF0gJiAweDNmKSB8IDB4ODA7XG5cbiAgLy8gQ29weSBieXRlcyB0byBidWZmZXIsIGlmIHByb3ZpZGVkXG4gIGlmIChidWYpIHtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgMTY7ICsraWkpIHtcbiAgICAgIGJ1ZltpICsgaWldID0gcm5kc1tpaV07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZiB8fCBieXRlc1RvVXVpZChybmRzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2NDtcbiIsImltcG9ydCAqIGFzIHV1aWQgZnJvbSBcInV1aWQvdjRcIjtcclxuXHJcbmludGVyZmFjZSBNb25hY29XaW5kb3cge1xyXG4gICAgbW9uYWNvOiBhbnk7XHJcbn1cclxuXHJcbmNvbnN0IG1vbmFjb1dpbmRvdyA9ICh3aW5kb3cgYXMgYW55KSBhcyBNb25hY29XaW5kb3c7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJldmlld0NvbW1lbnQge1xyXG4gICAgaWQ/OiBzdHJpbmc7XHJcbiAgICBhdXRob3I6IHN0cmluZztcclxuICAgIGR0OiBEYXRlIHwgc3RyaW5nO1xyXG4gICAgbGluZU51bWJlcjogbnVtYmVyO1xyXG4gICAgdGV4dDogc3RyaW5nO1xyXG4gICAgY29tbWVudHM/OiBSZXZpZXdDb21tZW50W107XHJcbiAgICBkZWxldGVkPzogYm9vbGVhbjtcclxufVxyXG5cclxuY2xhc3MgUmV2aWV3Q29tbWVudFN0YXRlIHtcclxuICAgIHZpZXdab25lSWQ6IG51bWJlcjtcclxuICAgIHJlbmRlclN0YXR1czogUmV2aWV3Q29tbWVudFN0YXR1cztcclxuICAgIG51bWJlck9mTGluZXM6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihudW1iZXJPZkxpbmVzOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMubm9ybWFsO1xyXG4gICAgICAgIHRoaXMudmlld1pvbmVJZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5udW1iZXJPZkxpbmVzID0gbnVtYmVyT2ZMaW5lcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJldmlld01hbmFnZXIoZWRpdG9yOiBhbnksIGN1cnJlbnRVc2VyOiBzdHJpbmcsIGNvbW1lbnRzPzogUmV2aWV3Q29tbWVudFtdLCBvbkNoYW5nZT86IE9uQ29tbWVudHNDaGFuZ2VkLCBjb25maWc/OiBSZXZpZXdNYW5hZ2VyQ29uZmlnKTogUmV2aWV3TWFuYWdlciB7XHJcbiAgICAvL0ZvciBEZWJ1ZzogKHdpbmRvdyBhcyBhbnkpLmVkaXRvciA9IGVkaXRvcjsgICAgXHJcbiAgICBjb25zdCBybSA9IG5ldyBSZXZpZXdNYW5hZ2VyKGVkaXRvciwgY3VycmVudFVzZXIsIG9uQ2hhbmdlLCBjb25maWcpO1xyXG4gICAgcm0ubG9hZChjb21tZW50cyB8fCBbXSk7XHJcbiAgICByZXR1cm4gcm07XHJcbn1cclxuXHJcblxyXG5pbnRlcmZhY2UgUmV2aWV3Q29tbWVudEl0ZXJJdGVtIHtcclxuICAgIGRlcHRoOiBudW1iZXI7XHJcbiAgICBjb21tZW50OiBSZXZpZXdDb21tZW50LFxyXG4gICAgdmlld1N0YXRlOiBSZXZpZXdDb21tZW50U3RhdGVcclxufVxyXG5cclxuaW50ZXJmYWNlIE9uQ29tbWVudHNDaGFuZ2VkIHtcclxuICAgIChjb21tZW50czogUmV2aWV3Q29tbWVudFtdKTogdm9pZFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJldmlld01hbmFnZXJDb25maWcge1xyXG4gICAgZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZT86IGJvb2xlYW47XHJcbiAgICBsaW5lSGVpZ2h0PzogbnVtYmVyO1xyXG4gICAgY29tbWVudEluZGVudD86IG51bWJlcjtcclxuICAgIGNvbW1lbnRJbmRlbnRPZmZzZXQ/OiBudW1iZXI7XHJcbiAgICBlZGl0QnV0dG9uQWRkVGV4dD86IHN0cmluZztcclxuICAgIGVkaXRCdXR0b25SZW1vdmVUZXh0Pzogc3RyaW5nO1xyXG4gICAgZWRpdEJ1dHRvbk9mZnNldD86IHN0cmluZztcclxuICAgIHJldmlld0NvbW1lbnRJY29uU2VsZWN0Pzogc3RyaW5nO1xyXG4gICAgcmV2aWV3Q29tbWVudEljb25BY3RpdmU/OiBzdHJpbmc7XHJcbiAgICBzaG93SW5SdWxlcj86IGJvb2xlYW5cclxufVxyXG5cclxuaW50ZXJmYWNlIFJldmlld01hbmFnZXJDb25maWdQcml2YXRlIHtcclxuICAgIGVkaXRCdXR0b25FbmFibGVSZW1vdmU6IGJvb2xlYW47XHJcbiAgICBsaW5lSGVpZ2h0OiBudW1iZXI7XHJcbiAgICBjb21tZW50SW5kZW50OiBudW1iZXI7XHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0OiBudW1iZXI7XHJcbiAgICBlZGl0QnV0dG9uQWRkVGV4dDogc3RyaW5nO1xyXG4gICAgZWRpdEJ1dHRvblJlbW92ZVRleHQ6IHN0cmluZztcclxuICAgIGVkaXRCdXR0b25PZmZzZXQ6IHN0cmluZztcclxuICAgIHNob3dJblJ1bGVyOiBib29sZWFuO1xyXG59XHJcblxyXG5cclxuY29uc3QgZGVmYXVsdFJldmlld01hbmFnZXJDb25maWc6IFJldmlld01hbmFnZXJDb25maWdQcml2YXRlID0ge1xyXG4gICAgZWRpdEJ1dHRvbk9mZnNldDogJy0xMHB4JyxcclxuICAgIGVkaXRCdXR0b25BZGRUZXh0OiAnUmVwbHknLFxyXG4gICAgZWRpdEJ1dHRvblJlbW92ZVRleHQ6ICdSZW1vdmUnLFxyXG4gICAgZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZTogdHJ1ZSxcclxuICAgIGxpbmVIZWlnaHQ6IDE5LFxyXG4gICAgY29tbWVudEluZGVudDogMjAsXHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0OiAyMCxcclxuICAgIHNob3dJblJ1bGVyOiB0cnVlLFxyXG59O1xyXG5cclxuXHJcbmNsYXNzIFJldmlld01hbmFnZXIge1xyXG4gICAgY3VycmVudFVzZXI6IHN0cmluZztcclxuICAgIGVkaXRvcjogYW55O1xyXG4gICAgY29tbWVudHM6IFJldmlld0NvbW1lbnRbXTtcclxuICAgIGNvbW1lbnRTdGF0ZTogeyBbcmV2aWV3Q29tbWVudElkOiBzdHJpbmddOiBSZXZpZXdDb21tZW50U3RhdGUgfTtcclxuXHJcbiAgICBhY3RpdmVDb21tZW50PzogUmV2aWV3Q29tbWVudDtcclxuICAgIHdpZGdldElubGluZVRvb2xiYXI6IGFueTtcclxuICAgIHdpZGdldElubGluZUNvbW1lbnRFZGl0b3I6IGFueTtcclxuICAgIG9uQ2hhbmdlOiBPbkNvbW1lbnRzQ2hhbmdlZDtcclxuICAgIGVkaXRvck1vZGU6IEVkaXRvck1vZGU7XHJcbiAgICBjb25maWc6IFJldmlld01hbmFnZXJDb25maWdQcml2YXRlO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihlZGl0b3I6IGFueSwgY3VycmVudFVzZXI6IHN0cmluZywgb25DaGFuZ2U6IE9uQ29tbWVudHNDaGFuZ2VkLCBjb25maWc/OiBSZXZpZXdNYW5hZ2VyQ29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VXNlciA9IGN1cnJlbnRVc2VyO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yID0gZWRpdG9yO1xyXG4gICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5jb21tZW50cyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY29tbWVudFN0YXRlID0ge307XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyID0gbnVsbDtcclxuICAgICAgICB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub25DaGFuZ2UgPSBvbkNoYW5nZTtcclxuICAgICAgICB0aGlzLmVkaXRvck1vZGUgPSBFZGl0b3JNb2RlLnRvb2xiYXI7XHJcbiAgICAgICAgdGhpcy5jb25maWcgPSB7IC4uLmRlZmF1bHRSZXZpZXdNYW5hZ2VyQ29uZmlnLCAuLi4oY29uZmlnIHx8IHt9KSB9O1xyXG5cclxuICAgICAgICB0aGlzLmFkZEFjdGlvbnMoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlubGluZVRvb2xiYXJXaWRnZXQoKTtcclxuICAgICAgICB0aGlzLmNyZWF0ZUlubGluZUVkaXRvcldpZGdldCgpO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5vbk1vdXNlRG93bih0aGlzLmhhbmRsZU1vdXNlRG93bi5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBsb2FkKGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W10pOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmVkaXRvci5jaGFuZ2VWaWV3Wm9uZXMoKGNoYW5nZUFjY2Vzc29yKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgdGhlIGV4aXN0aW5nIGNvbW1lbnRzICAgICBcclxuICAgICAgICAgICAgZm9yIChjb25zdCBvbGRJdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvbGRJdGVtLnZpZXdTdGF0ZS52aWV3Wm9uZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQWNjZXNzb3IucmVtb3ZlWm9uZShvbGRJdGVtLnZpZXdTdGF0ZS52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5jb21tZW50cyA9IGNvbW1lbnRzIHx8IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRTdGF0ZSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgYWxsIGNvbW1lbnRzIHRoYXQgdGhleSBoYXZlIHVuaXF1ZSBhbmQgcHJlc2VudCBpZCdzXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbElkID0gaXRlbS5jb21tZW50LmlkO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNoYW5nZWRJZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlICghaXRlbS5jb21tZW50LmlkIHx8IHRoaXMuY29tbWVudFN0YXRlW2l0ZW0uY29tbWVudC5pZF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbW1lbnQuaWQgPSAnYXV0b2lkLScgKyBNYXRoLnJhbmRvbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWRJZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoYW5nZWRJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQ29tbWVudC5JZCBBc3NpZ25lZDogJywgb3JpZ2luYWxJZCwgJyBjaGFuZ2VkIHRvIHRvICcsIGl0ZW0uY29tbWVudC5pZCwgJyBkdWUgdG8gY29sbGlzaW9uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21tZW50U3RhdGVbaXRlbS5jb21tZW50LmlkXSA9IG5ldyBSZXZpZXdDb21tZW50U3RhdGUodGhpcy5jYWxjdWxhdGVOdW1iZXJPZkxpbmVzKGl0ZW0uY29tbWVudC50ZXh0KSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdDb21tZW50cyBMb2FkZWQ6ICcsIHRoaXMuY29tbWVudHMubGVuZ3RoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBjYWxjdWxhdGVOdW1iZXJPZkxpbmVzKHRleHQ6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRleHQuc3BsaXQoL1xccipcXG4vKS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5saW5lRWRpdEJ1dHRvbnNFbGVtZW50KCkge1xyXG4gICAgICAgIHZhciByb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgcm9vdC5jbGFzc05hbWUgPSAnZWRpdEJ1dHRvbnNDb250YWluZXInXHJcblxyXG4gICAgICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKSBhcyBIVE1MQW5jaG9yRWxlbWVudDtcclxuICAgICAgICBhZGQuaHJlZiA9ICcjJ1xyXG4gICAgICAgIGFkZC5pbm5lclRleHQgPSB0aGlzLmNvbmZpZy5lZGl0QnV0dG9uQWRkVGV4dDtcclxuICAgICAgICBhZGQubmFtZSA9ICdhZGQnO1xyXG4gICAgICAgIGFkZC5jbGFzc05hbWUgPSAnZWRpdEJ1dHRvbkFkZCdcclxuICAgICAgICBhZGQub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUuZWRpdG9yKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7Ly8gU3VwcHJlc3MgbmF2aWdhdGlvblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChhZGQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBzcGFjZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgc3BhY2VyLmlubmVyVGV4dCA9ICcgJ1xyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKHNwYWNlcik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZW1vdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJykgYXMgSFRNTEFuY2hvckVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHJlbW92ZS5ocmVmID0gJyMnXHJcbiAgICAgICAgICAgIHJlbW92ZS5pbm5lclRleHQgPSB0aGlzLmNvbmZpZy5lZGl0QnV0dG9uUmVtb3ZlVGV4dDtcclxuICAgICAgICAgICAgcmVtb3ZlLm5hbWUgPSAncmVtb3ZlJztcclxuICAgICAgICAgICAgcmVtb3ZlLmNsYXNzTmFtZSA9ICdlZGl0QnV0dG9uUmVtb3ZlJ1xyXG4gICAgICAgICAgICByZW1vdmUub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQ29tbWVudCh0aGlzLmFjdGl2ZUNvbW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBTdXBwcmVzcyBuYXZpZ2F0aW9uXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChyZW1vdmUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcm9vdC5zdHlsZS5tYXJnaW5MZWZ0ID0gdGhpcy5jb25maWcuZWRpdEJ1dHRvbk9mZnNldDtcclxuICAgICAgICByZXR1cm4gcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDYW5jZWwoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUudG9vbGJhcik7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVTYXZlKCkge1xyXG4gICAgICAgIGNvbnN0IHIgPSB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS50b29sYmFyKTtcclxuICAgICAgICB0aGlzLmFkZENvbW1lbnQoci5saW5lTnVtYmVyLCByLnRleHQpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5saW5lRWRpdG9yRWxlbWVudCgpIHtcclxuICAgICAgICB2YXIgcm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICByb290LmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudEVkaXRcIlxyXG5cclxuICAgICAgICBjb25zdCB0ZXh0YXJlYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XHJcbiAgICAgICAgdGV4dGFyZWEuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50VGV4dFwiO1xyXG4gICAgICAgIHRleHRhcmVhLmlubmVyVGV4dCA9ICcnO1xyXG4gICAgICAgIHRleHRhcmVhLm5hbWUgPSAndGV4dCc7XHJcbiAgICAgICAgdGV4dGFyZWEuc3R5bGUubGluZUhlaWdodCA9ICcxJztcclxuICAgICAgICB0ZXh0YXJlYS5vbmtleXByZXNzID0gKGU6IEtleWJvYXJkRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gXCJFbnRlclwiICYmIGUuY3RybEtleSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTYXZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHRleHRhcmVhLm9ua2V5ZG93biA9IChlOiBLZXlib2FyZEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlLmNvZGUgPT09IFwiRXNjYXBlXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2FuY2VsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNhdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBzYXZlLmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudFNhdmVcIjtcclxuICAgICAgICBzYXZlLmlubmVyVGV4dCA9ICdTYXZlJztcclxuICAgICAgICBzYXZlLm5hbWUgPSAnc2F2ZSc7XHJcbiAgICAgICAgc2F2ZS5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVNhdmUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBjYW5jZWwuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50Q2FuY2VsXCI7XHJcbiAgICAgICAgY2FuY2VsLmlubmVyVGV4dCA9ICdDYW5jZWwnO1xyXG4gICAgICAgIGNhbmNlbC5uYW1lID0gJ2NhbmNlbCc7XHJcbiAgICAgICAgY2FuY2VsLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2FuY2VsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByb290LmFwcGVuZENoaWxkKHRleHRhcmVhKTtcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKHNhdmUpO1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY2FuY2VsKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJvb3RcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJbmxpbmVUb29sYmFyV2lkZ2V0KCkge1xyXG4gICAgICAgIGNvbnN0IGJ1dHRvbnNFbGVtZW50ID0gdGhpcy5jcmVhdGVJbmxpbmVFZGl0QnV0dG9uc0VsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyID0ge1xyXG4gICAgICAgICAgICBhbGxvd0VkaXRvck92ZXJmbG93OiB0cnVlLFxyXG4gICAgICAgICAgICBnZXRJZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd3aWRnZXRJbmxpbmVUb29sYmFyJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0RG9tTm9kZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbnNFbGVtZW50O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRQb3NpdGlvbjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCAmJiB0aGlzLmVkaXRvck1vZGUgPT0gRWRpdG9yTW9kZS50b29sYmFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZmVyZW5jZTogW21vbmFjb1dpbmRvdy5tb25hY28uZWRpdG9yLkNvbnRlbnRXaWRnZXRQb3NpdGlvblByZWZlcmVuY2UuQkVMT1ddXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQ29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZVRvb2xiYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRvcldpZGdldCgpIHtcclxuICAgICAgICBjb25zdCBlZGl0b3JFbGVtZW50ID0gdGhpcy5jcmVhdGVJbmxpbmVFZGl0b3JFbGVtZW50KCk7XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yID0ge1xyXG4gICAgICAgICAgICBhbGxvd0VkaXRvck92ZXJmbG93OiB0cnVlLFxyXG4gICAgICAgICAgICBnZXRJZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd3aWRnZXRJbmxpbmVFZGl0b3InO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREb21Ob2RlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWRpdG9yRWxlbWVudDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0UG9zaXRpb246ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVkaXRvck1vZGUgPT0gRWRpdG9yTW9kZS5lZGl0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgYXJlIHVzaW5nIG5lZ2F0aXZlIG1hcmdpblRvcCB0byBzaGlmdCBpdCBhYm92ZSB0aGUgbGluZSB0byB0aGUgcHJldmlvdXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMuYWN0aXZlQ29tbWVudCA/IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyICsgMSA6IHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmZXJlbmNlOiBbbW9uYWNvV2luZG93Lm1vbmFjby5lZGl0b3IuQ29udGVudFdpZGdldFBvc2l0aW9uUHJlZmVyZW5jZS5CRUxPV11cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRDb250ZW50V2lkZ2V0KHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvcik7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QWN0aXZlQ29tbWVudChjb21tZW50OiBSZXZpZXdDb21tZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1Zygnc2V0QWN0aXZlQ29tbWVudCcsIGNvbW1lbnQpO1xyXG5cclxuICAgICAgICBjb25zdCBsaW5lTnVtYmVyc1RvTWFrZURpcnR5ID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCAmJiAoIWNvbW1lbnQgfHwgdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgIT09IGNvbW1lbnQubGluZU51bWJlcikpIHtcclxuICAgICAgICAgICAgbGluZU51bWJlcnNUb01ha2VEaXJ0eS5wdXNoKHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbW1lbnQpIHtcclxuICAgICAgICAgICAgbGluZU51bWJlcnNUb01ha2VEaXJ0eS5wdXNoKGNvbW1lbnQubGluZU51bWJlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFjdGl2ZUNvbW1lbnQgPSBjb21tZW50O1xyXG4gICAgICAgIGlmIChsaW5lTnVtYmVyc1RvTWFrZURpcnR5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJBbmRNYXBDb21tZW50cyhsaW5lTnVtYmVyc1RvTWFrZURpcnR5LCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS52aWV3U3RhdGUucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5kaXJ0eVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGF5b3V0SW5saW5lVG9vbGJhcigpIHtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvb2xiYXJSb290ID0gdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyLmdldERvbU5vZGUoKSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICAgICAgdG9vbGJhclJvb3Quc3R5bGUubWFyZ2luVG9wID0gYC0ke3RoaXMuY2FsY3VsYXRlTWFyZ2luVG9wT2Zmc2V0KDIpfXB4YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lZGl0b3IubGF5b3V0Q29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZVRvb2xiYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlckFuZE1hcENvbW1lbnRzKGxpbmVOdW1iZXJzOiBudW1iZXJbXSwgZm46IHsgKGNvbW1lbnQ6IFJldmlld0NvbW1lbnRJdGVySXRlbSk6IHZvaWQgfSkge1xyXG4gICAgICAgIGNvbnN0IGNvbW1lbnRzID0gdGhpcy5pdGVyYXRlQ29tbWVudHMoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY29tbWVudHMpIHtcclxuICAgICAgICAgICAgaWYgKGxpbmVOdW1iZXJzLmluZGV4T2YoYy5jb21tZW50LmxpbmVOdW1iZXIpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIGZuKGMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZU1vdXNlRG93bihldjogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1ZygnaGFuZGxlTW91c2VEb3duJywgdGhpcy5hY3RpdmVDb21tZW50LCBldi50YXJnZXQuZWxlbWVudCwgZXYudGFyZ2V0LmRldGFpbCk7XHJcblxyXG4gICAgICAgIGlmIChldi50YXJnZXQuZWxlbWVudC50YWdOYW1lID09PSAnVEVYVEFSRUEnIHx8IGV2LnRhcmdldC5lbGVtZW50LnRhZ05hbWUgPT09ICdCVVRUT04nIHx8IGV2LnRhcmdldC5lbGVtZW50LnRhZ05hbWUgPT09ICdBJykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFjdGl2ZUNvbW1lbnQ6IFJldmlld0NvbW1lbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5kZXRhaWwgJiYgZXYudGFyZ2V0LmRldGFpbC52aWV3Wm9uZUlkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQgPT0gZXYudGFyZ2V0LmRldGFpbC52aWV3Wm9uZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNvbW1lbnQgPSBpdGVtLmNvbW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNvbW1lbnQoYWN0aXZlQ29tbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLnRvb2xiYXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNhbGN1bGF0ZU1hcmdpblRvcE9mZnNldChleHRyYU9mZnNldExpbmVzOiBudW1iZXIgPSAxKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgaWR4ID0gMDtcclxuICAgICAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgICAgIGxldCBtYXJnaW5Ub3A6IG51bWJlciA9IDA7XHJcbiAgICAgICAgY29uc3QgbGluZUhlaWdodCA9IHRoaXMuY29uZmlnLmxpbmVIZWlnaHQ7Ly9GSVhNRSAtIE1hZ2ljIG51bWJlciBmb3IgbGluZSBoZWlnaHQgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQubGluZU51bWJlciA9PSB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudCA9PSB0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZHggPSBjb3VudCArIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWFyZ2luVG9wID0gKChleHRyYU9mZnNldExpbmVzICsgY291bnQgLSBpZHgpICogbGluZUhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWFyZ2luVG9wO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0RWRpdG9yTW9kZShtb2RlOiBFZGl0b3JNb2RlKTogeyBsaW5lTnVtYmVyOiBudW1iZXIsIHRleHQ6IHN0cmluZyB9IHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKCdzZXRFZGl0b3JNb2RlJywgdGhpcy5hY3RpdmVDb21tZW50KTtcclxuXHJcbiAgICAgICAgY29uc3QgbGluZU51bWJlciA9IHRoaXMuYWN0aXZlQ29tbWVudCA/IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyIDogdGhpcy5lZGl0b3IuZ2V0UG9zaXRpb24oKS5saW5lTnVtYmVyO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yTW9kZSA9IG1vZGU7XHJcblxyXG4gICAgICAgIGNvbnN0IGVkaXRvclJvb3QgPSB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IuZ2V0RG9tTm9kZSgpIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgIGVkaXRvclJvb3Quc3R5bGUubWFyZ2luVG9wID0gYC0ke3RoaXMuY2FsY3VsYXRlTWFyZ2luVG9wT2Zmc2V0KCl9cHhgO1xyXG5cclxuICAgICAgICB0aGlzLmxheW91dElubGluZVRvb2xiYXIoKTtcclxuICAgICAgICB0aGlzLmVkaXRvci5sYXlvdXRDb250ZW50V2lkZ2V0KHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvcik7XHJcblxyXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IuZ2V0RG9tTm9kZSgpO1xyXG4gICAgICAgIGNvbnN0IHRleHRhcmVhID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiVEVYVEFSRUFbbmFtZT0ndGV4dCddXCIpO1xyXG5cclxuICAgICAgICBpZiAobW9kZSA9PSBFZGl0b3JNb2RlLmVkaXRvcikge1xyXG4gICAgICAgICAgICB0ZXh0YXJlYS52YWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICAvL0hBQ0sgLSBiZWNhdXNlIHRoZSBldmVudCBpbiBtb25hY28gZG9lc24ndCBoYXZlIHByZXZlbnRkZWZhdWx0IHdoaWNoIG1lYW5zIGVkaXRvciB0YWtlcyBmb2N1cyBiYWNrLi4uICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGV4dGFyZWEuZm9jdXMoKSwgMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRleHQ6IHRleHRhcmVhLnZhbHVlLCAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgYWRkQ29tbWVudChsaW5lTnVtYmVyOiBudW1iZXIsIHRleHQ6IHN0cmluZyk6IFJldmlld0NvbW1lbnQge1xyXG4gICAgICAgIGNvbnN0IGxuID0gdGhpcy5hY3RpdmVDb21tZW50ID8gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgOiBsaW5lTnVtYmVyO1xyXG4gICAgICAgIGNvbnN0IGNvbW1lbnQ6IFJldmlld0NvbW1lbnQgPSB7XHJcbiAgICAgICAgICAgIGlkOiB1dWlkKCksXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxuLFxyXG4gICAgICAgICAgICBhdXRob3I6IHRoaXMuY3VycmVudFVzZXIsXHJcbiAgICAgICAgICAgIGR0OiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0XHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmNvbW1lbnRTdGF0ZVtjb21tZW50LmlkXSA9IG5ldyBSZXZpZXdDb21tZW50U3RhdGUodGhpcy5jYWxjdWxhdGVOdW1iZXJPZkxpbmVzKHRleHQpKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuYWN0aXZlQ29tbWVudC5jb21tZW50cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmVDb21tZW50LmNvbW1lbnRzID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hY3RpdmVDb21tZW50LmNvbW1lbnRzLnB1c2goY29tbWVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5maWx0ZXJBbmRNYXBDb21tZW50cyhbbG5dLCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICBpdGVtLnZpZXdTdGF0ZS5yZW5kZXJTdGF0dXMgPSBSZXZpZXdDb21tZW50U3RhdHVzLmRpcnR5O1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpXHJcbiAgICAgICAgdGhpcy5sYXlvdXRJbmxpbmVUb29sYmFyKCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UodGhpcy5jb21tZW50cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29tbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBpdGVyYXRlQ29tbWVudHMoY29tbWVudHM/OiBSZXZpZXdDb21tZW50W10sIGRlcHRoPzogbnVtYmVyLCByZXN1bHRzPzogUmV2aWV3Q29tbWVudEl0ZXJJdGVtW10pIHtcclxuICAgICAgICByZXN1bHRzID0gcmVzdWx0cyB8fCBbXTtcclxuICAgICAgICBkZXB0aCA9IGRlcHRoIHx8IDA7XHJcbiAgICAgICAgY29tbWVudHMgPSBjb21tZW50cyB8fCB0aGlzLmNvbW1lbnRzO1xyXG5cclxuICAgICAgICBpZiAoY29tbWVudHMpIHtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBjb21tZW50IG9mIGNvbW1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIGRlcHRoLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgdmlld1N0YXRlOiB0aGlzLmNvbW1lbnRTdGF0ZVtjb21tZW50LmlkXVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoY29tbWVudC5jb21tZW50cykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKGNvbW1lbnQuY29tbWVudHMsIGRlcHRoICsgMSwgcmVzdWx0cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNvbW1lbnQoY29tbWVudDogUmV2aWV3Q29tbWVudCkge1xyXG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cyhbY29tbWVudF0pKSB7XHJcbiAgICAgICAgICAgIGl0ZW0uY29tbWVudC5kZWxldGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCA9PSBjb21tZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ29tbWVudChudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5sYXlvdXRJbmxpbmVUb29sYmFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpO1xyXG4gICAgICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25DaGFuZ2UodGhpcy5jb21tZW50cyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlZnJlc2hDb21tZW50cygpIHtcclxuICAgICAgICB0aGlzLmVkaXRvci5jaGFuZ2VWaWV3Wm9uZXMoKGNoYW5nZUFjY2Vzc29yKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmVOdW1iZXJzOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0ge307XHJcblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudC5kZWxldGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnWm9uZS5EZWxldGUnLCBpdGVtLmNvbW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLnZpZXdTdGF0ZS5yZW5kZXJTdGF0dXMgPT09IFJldmlld0NvbW1lbnRTdGF0dXMuaGlkZGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnWm9uZS5IaWRkZW4nLCBpdGVtLmNvbW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS52aWV3U3RhdGUucmVuZGVyU3RhdHVzID09PSBSZXZpZXdDb21tZW50U3RhdHVzLmRpcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnWm9uZS5EaXJ0eScsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUoaXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52aWV3U3RhdGUucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5ub3JtYWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCFpdGVtLnZpZXdTdGF0ZS52aWV3Wm9uZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnWm9uZS5DcmVhdGUnLCBpdGVtLmNvbW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyc1tpdGVtLmNvbW1lbnQubGluZU51bWJlcl0gPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb21Ob2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSB0aGlzLmFjdGl2ZUNvbW1lbnQgPT0gaXRlbS5jb21tZW50O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnN0eWxlLm1hcmdpbkxlZnQgPSAodGhpcy5jb25maWcuY29tbWVudEluZGVudCAqIChpdGVtLmRlcHRoICsgMSkpICsgdGhpcy5jb25maWcuY29tbWVudEluZGVudE9mZnNldCArIFwicHhcIjtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lJztcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmNsYXNzTmFtZSA9IGlzQWN0aXZlID8gJ3Jldmlld0NvbW1lbnQgcmV2aWV3Q29tbWVudC1hY3RpdmUnIDogJ3Jldmlld0NvbW1lbnQgcmV2aWV3Q29tbWVudC1pbmFjdGl2ZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBhdXRob3IuY2xhc3NOYW1lID0gJ3Jldmlld0NvbW1lbnQtYXV0aG9yJ1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvci5pbm5lclRleHQgPWAke2l0ZW0uY29tbWVudC5hdXRob3IgfHwgJyAnfSBhdCBgO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICBkdC5jbGFzc05hbWUgPSAncmV2aWV3Q29tbWVudC1kdCdcclxuICAgICAgICAgICAgICAgICAgICBkdC5pbm5lclRleHQgPSBpdGVtLmNvbW1lbnQuZHQudG9Mb2NhbGVTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LmNsYXNzTmFtZSA9ICdyZXZpZXdDb21tZW50LXRleHQnXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5pbm5lclRleHQgPSBgJHtpdGVtLmNvbW1lbnQudGV4dH0gYnkgYDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZCh0ZXh0KTsgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQoYXV0aG9yKTtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmFwcGVuZENoaWxkKGR0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCA9IGNoYW5nZUFjY2Vzc29yLmFkZFpvbmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhZnRlckxpbmVOdW1iZXI6IGl0ZW0uY29tbWVudC5saW5lTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHRJbkxpbmVzOiBpdGVtLnZpZXdTdGF0ZS5udW1iZXJPZkxpbmVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkb21Ob2RlOiBkb21Ob2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdXBwcmVzc01vdXNlRG93bjogdHJ1ZSAvLyBUaGlzIHN0b3BzIGZvY3VzIGJlaW5nIGxvc3QgdGhlIGVkaXRvciAtIG1lYW5pbmcga2V5Ym9hcmQgc2hvcnRjdXRzIGtlZXBzIHdvcmtpbmdcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY29uZmlnLnNob3dJblJ1bGVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZWNvcmF0b3JzID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGxuIGluIGxpbmVOdW1iZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVjb3JhdG9ycy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IG5ldyBtb25hY29XaW5kb3cubW9uYWNvLlJhbmdlKGxuLCAwLCBsbiwgMCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzV2hvbGVMaW5lOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcnZpZXdSdWxlcjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcImRhcmtvcmFuZ2VcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXJrQ29sb3I6IFwiZGFya29yYW5nZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLmRlbHRhRGVjb3JhdGlvbnMoW10sIGRlY29yYXRvcnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQWN0aW9ucygpIHtcclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRBY3Rpb24oe1xyXG4gICAgICAgICAgICBpZDogJ215LXVuaXF1ZS1pZC1hZGQnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ0FkZCBDb21tZW50JyxcclxuICAgICAgICAgICAga2V5YmluZGluZ3M6IFtcclxuICAgICAgICAgICAgICAgIG1vbmFjb1dpbmRvdy5tb25hY28uS2V5TW9kLkN0cmxDbWQgfCBtb25hY29XaW5kb3cubW9uYWNvLktleUNvZGUuRjEwLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwcmVjb25kaXRpb246IG51bGwsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdDb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudUdyb3VwSWQ6ICduYXZpZ2F0aW9uJyxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVPcmRlcjogMCxcclxuXHJcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUuZWRpdG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRBY3Rpb24oe1xyXG4gICAgICAgICAgICBpZDogJ215LXVuaXF1ZS1pZC1uZXh0JyxcclxuICAgICAgICAgICAgbGFiZWw6ICdOZXh0IENvbW1lbnQnLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nczogW1xyXG4gICAgICAgICAgICAgICAgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlNb2QuQ3RybENtZCB8IG1vbmFjb1dpbmRvdy5tb25hY28uS2V5Q29kZS5GMTIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHByZWNvbmRpdGlvbjogbnVsbCxcclxuICAgICAgICAgICAga2V5YmluZGluZ0NvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51R3JvdXBJZDogJ25hdmlnYXRpb24nLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudU9yZGVyOiAwLjEsXHJcblxyXG4gICAgICAgICAgICBydW46ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUb0NvbW1lbnQoTmF2aWdhdGlvbkRpcmVjdGlvbi5uZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRBY3Rpb24oe1xyXG4gICAgICAgICAgICBpZDogJ215LXVuaXF1ZS1pZC1wcmV2JyxcclxuICAgICAgICAgICAgbGFiZWw6ICdQcmV2IENvbW1lbnQnLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nczogW1xyXG4gICAgICAgICAgICAgICAgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlNb2QuQ3RybENtZCB8IG1vbmFjb1dpbmRvdy5tb25hY28uS2V5Q29kZS5GMTEsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHByZWNvbmRpdGlvbjogbnVsbCxcclxuICAgICAgICAgICAga2V5YmluZGluZ0NvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51R3JvdXBJZDogJ25hdmlnYXRpb24nLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudU9yZGVyOiAwLjEsXHJcblxyXG4gICAgICAgICAgICBydW46ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmF2aWdhdGVUb0NvbW1lbnQoTmF2aWdhdGlvbkRpcmVjdGlvbi5wcmV2KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIG5hdmlnYXRlVG9Db21tZW50KGRpcmVjdGlvbjogTmF2aWdhdGlvbkRpcmVjdGlvbikge1xyXG4gICAgICAgIGxldCBjdXJyZW50TGluZSA9IDA7XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCkge1xyXG4gICAgICAgICAgICBjdXJyZW50TGluZSA9IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gdGhpcy5lZGl0b3IuZ2V0UG9zaXRpb24oKS5saW5lTnVtYmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY29tbWVudHMgPSB0aGlzLmNvbW1lbnRzLmZpbHRlcigoYykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBOYXZpZ2F0aW9uRGlyZWN0aW9uLm5leHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjLmxpbmVOdW1iZXIgPiBjdXJyZW50TGluZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IE5hdmlnYXRpb25EaXJlY3Rpb24ucHJldikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGMubGluZU51bWJlciA8IGN1cnJlbnRMaW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChjb21tZW50cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29tbWVudHMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWdhdGlvbkRpcmVjdGlvbi5uZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEubGluZU51bWJlciAtIGIubGluZU51bWJlcjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBOYXZpZ2F0aW9uRGlyZWN0aW9uLnByZXYpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYi5saW5lTnVtYmVyIC0gYS5saW5lTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbW1lbnQgPSBjb21tZW50c1swXTtcclxuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDb21tZW50KGNvbW1lbnQpXHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMubGF5b3V0SW5saW5lVG9vbGJhcigpO1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRvci5yZXZlYWxMaW5lSW5DZW50ZXIoY29tbWVudC5saW5lTnVtYmVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5lbnVtIE5hdmlnYXRpb25EaXJlY3Rpb24ge1xyXG4gICAgbmV4dCA9IDEsXHJcbiAgICBwcmV2ID0gMlxyXG59XHJcblxyXG5lbnVtIEVkaXRvck1vZGUge1xyXG4gICAgZWRpdG9yLFxyXG4gICAgdG9vbGJhclxyXG59XHJcblxyXG5lbnVtIFJldmlld0NvbW1lbnRTdGF0dXMge1xyXG4gICAgZGlydHksXHJcbiAgICBoaWRkZW4sXHJcbiAgICBub3JtYWxcclxufSJdLCJzb3VyY2VSb290IjoiIn0=