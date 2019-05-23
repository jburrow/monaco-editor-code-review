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
    rulerMarkerColor: 'darkorange',
    rulerMarkerDarkColor: 'darkorange'
};
var CONTROL_ATTR_NAME = 'ReviewManagerControl';
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
                    item.comment.id = uuid();
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
    ReviewManager.prototype.getThemedColor = function (name) {
        // editor.background: e {rgba: e}
        // editor.foreground: e {rgba: e}
        // editor.inactiveSelectionBackground: e {rgba: e}
        // editor.selectionHighlightBackground: e {rgba: e}
        // editorIndentGuide.activeBackground: e {rgba: e}
        // editorIndentGuide.background: e {rgba: e}
        return this.editor._themeService.getTheme().getColor(name);
    };
    ReviewManager.prototype.createInlineEditButtonsElement = function () {
        var _this = this;
        var root = document.createElement('div');
        root.className = 'editButtonsContainer';
        root.style.marginLeft = this.config.editButtonOffset;
        var add = document.createElement('span');
        add.innerText = this.config.editButtonAddText;
        add.className = 'editButton add';
        add.setAttribute(CONTROL_ATTR_NAME, '');
        add.onclick = function () { return _this.setEditorMode(EditorMode.editComment); };
        root.appendChild(add);
        if (this.config.editButtonEnableRemove) {
            var spacer = document.createElement('div');
            spacer.innerText = ' ';
            root.appendChild(spacer);
            var remove = document.createElement('span');
            remove.setAttribute(CONTROL_ATTR_NAME, '');
            remove.innerText = this.config.editButtonRemoveText;
            remove.className = 'editButton remove';
            remove.onclick = function () { return _this.removeComment(_this.activeComment); };
            root.appendChild(remove);
        }
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
    ReviewManager.prototype.handleTextAreaKeyDown = function (e) {
        if (e.code === "Escape") {
            this.handleCancel();
        }
        else if (e.code === "Enter" && e.ctrlKey) {
            this.handleSave();
        }
    };
    ReviewManager.prototype.createInlineEditorElement = function () {
        var root = document.createElement('span');
        root.className = "reviewCommentEdit";
        var textarea = document.createElement('textarea');
        textarea.setAttribute(CONTROL_ATTR_NAME, '');
        textarea.className = "reviewCommentText";
        textarea.innerText = '';
        textarea.name = 'text';
        textarea.onkeydown = this.handleTextAreaKeyDown.bind(this);
        var save = document.createElement('button');
        save.setAttribute(CONTROL_ATTR_NAME, '');
        save.className = "reviewCommentSave";
        save.innerText = 'Save';
        save.onclick = this.handleSave.bind(this);
        var cancel = document.createElement('button');
        cancel.setAttribute(CONTROL_ATTR_NAME, '');
        cancel.className = "reviewCommentCancel";
        cancel.innerText = 'Cancel';
        cancel.onclick = this.handleCancel.bind(this);
        root.appendChild(textarea);
        root.appendChild(save);
        root.appendChild(cancel);
        this.textarea = textarea;
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
                if (_this.editorMode == EditorMode.editComment) {
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
        var toolbarRoot = this.widgetInlineToolbar.getDomNode();
        if (this.activeComment) {
            toolbarRoot.style.marginTop = "-" + this.calculateMarginTopOffset(2) + "px";
        }
        toolbarRoot.style.backgroundColor = this.getThemedColor("editor.background");
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
        if (ev.target.element.hasAttribute(CONTROL_ATTR_NAME)) {
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
        var _this = this;
        console.debug('setEditorMode', this.activeComment);
        var lineNumber = this.activeComment ? this.activeComment.lineNumber : this.editor.getPosition().lineNumber;
        this.editorMode = mode;
        var editorRoot = this.widgetInlineCommentEditor.getDomNode();
        editorRoot.style.marginTop = "-" + this.calculateMarginTopOffset() + "px";
        this.layoutInlineToolbar();
        this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
        var text = this.textarea.value;
        this.textarea.value = "";
        if (mode == EditorMode.editComment) {
            //HACK - because the event in monaco doesn't have preventdefault which means editor takes focus back...            
            setTimeout(function () { return _this.textarea.focus(); }, 100);
        }
        return {
            text: text,
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
                    var isActive = _this.activeComment == item.comment;
                    var domNode = document.createElement('span');
                    domNode.style.marginLeft = (_this.config.commentIndent * (item.depth + 1)) + _this.config.commentIndentOffset + "px";
                    domNode.style.backgroundColor = _this.getThemedColor("editor.selectionHighlightBackground");
                    domNode.className = "reviewComment " + (isActive ? 'active' : ' inactive');
                    var author = document.createElement('span');
                    author.className = 'reviewComment author';
                    author.innerText = (item.comment.author || ' ') + " at ";
                    var dt = document.createElement('span');
                    dt.className = 'reviewComment dt';
                    dt.innerText = item.comment.dt.toLocaleString();
                    var text = document.createElement('span');
                    text.className = 'reviewComment text';
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
                                color: _this.config.rulerMarkerColor,
                                darkColor: _this.config.rulerMarkerDarkColor,
                                position: 1
                            }
                        }
                    });
                }
                //TODO - Preserver any other decorators
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
                _this.setEditorMode(EditorMode.editComment);
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
    EditorMode[EditorMode["editComment"] = 1] = "editComment";
    EditorMode[EditorMode["toolbar"] = 2] = "toolbar";
})(EditorMode || (EditorMode = {}));
var ReviewCommentStatus;
(function (ReviewCommentStatus) {
    ReviewCommentStatus[ReviewCommentStatus["dirty"] = 1] = "dirty";
    ReviewCommentStatus[ReviewCommentStatus["hidden"] = 2] = "hidden";
    ReviewCommentStatus[ReviewCommentStatus["normal"] = 3] = "normal";
})(ReviewCommentStatus || (ReviewCommentStatus = {}));


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01vbmFjb0VkaXRvckNvZGVSZXZpZXcvLi9ub2RlX21vZHVsZXMvdXVpZC9saWIvYnl0ZXNUb1V1aWQuanMiLCJ3ZWJwYWNrOi8vTW9uYWNvRWRpdG9yQ29kZVJldmlldy8uL25vZGVfbW9kdWxlcy91dWlkL2xpYi9ybmctYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3Ly4vbm9kZV9tb2R1bGVzL3V1aWQvdjQuanMiLCJ3ZWJwYWNrOi8vTW9uYWNvRWRpdG9yQ29kZVJldmlldy8uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7O0FBR0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFD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ciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiLyoqXG4gKiBDb252ZXJ0IGFycmF5IG9mIDE2IGJ5dGUgdmFsdWVzIHRvIFVVSUQgc3RyaW5nIGZvcm1hdCBvZiB0aGUgZm9ybTpcbiAqIFhYWFhYWFhYLVhYWFgtWFhYWC1YWFhYLVhYWFhYWFhYWFhYWFxuICovXG52YXIgYnl0ZVRvSGV4ID0gW107XG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG59XG5cbmZ1bmN0aW9uIGJ5dGVzVG9VdWlkKGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gb2Zmc2V0IHx8IDA7XG4gIHZhciBidGggPSBieXRlVG9IZXg7XG4gIC8vIGpvaW4gdXNlZCB0byBmaXggbWVtb3J5IGlzc3VlIGNhdXNlZCBieSBjb25jYXRlbmF0aW9uOiBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMTc1I2M0XG4gIHJldHVybiAoW2J0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sIFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV1dKS5qb2luKCcnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBieXRlc1RvVXVpZDtcbiIsIi8vIFVuaXF1ZSBJRCBjcmVhdGlvbiByZXF1aXJlcyBhIGhpZ2ggcXVhbGl0eSByYW5kb20gIyBnZW5lcmF0b3IuICBJbiB0aGVcbi8vIGJyb3dzZXIgdGhpcyBpcyBhIGxpdHRsZSBjb21wbGljYXRlZCBkdWUgdG8gdW5rbm93biBxdWFsaXR5IG9mIE1hdGgucmFuZG9tKClcbi8vIGFuZCBpbmNvbnNpc3RlbnQgc3VwcG9ydCBmb3IgdGhlIGBjcnlwdG9gIEFQSS4gIFdlIGRvIHRoZSBiZXN0IHdlIGNhbiB2aWFcbi8vIGZlYXR1cmUtZGV0ZWN0aW9uXG5cbi8vIGdldFJhbmRvbVZhbHVlcyBuZWVkcyB0byBiZSBpbnZva2VkIGluIGEgY29udGV4dCB3aGVyZSBcInRoaXNcIiBpcyBhIENyeXB0b1xuLy8gaW1wbGVtZW50YXRpb24uIEFsc28sIGZpbmQgdGhlIGNvbXBsZXRlIGltcGxlbWVudGF0aW9uIG9mIGNyeXB0byBvbiBJRTExLlxudmFyIGdldFJhbmRvbVZhbHVlcyA9ICh0eXBlb2YoY3J5cHRvKSAhPSAndW5kZWZpbmVkJyAmJiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChjcnlwdG8pKSB8fFxuICAgICAgICAgICAgICAgICAgICAgICh0eXBlb2YobXNDcnlwdG8pICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiB3aW5kb3cubXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzID09ICdmdW5jdGlvbicgJiYgbXNDcnlwdG8uZ2V0UmFuZG9tVmFsdWVzLmJpbmQobXNDcnlwdG8pKTtcblxuaWYgKGdldFJhbmRvbVZhbHVlcykge1xuICAvLyBXSEFUV0cgY3J5cHRvIFJORyAtIGh0dHA6Ly93aWtpLndoYXR3Zy5vcmcvd2lraS9DcnlwdG9cbiAgdmFyIHJuZHM4ID0gbmV3IFVpbnQ4QXJyYXkoMTYpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG5cbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB3aGF0d2dSTkcoKSB7XG4gICAgZ2V0UmFuZG9tVmFsdWVzKHJuZHM4KTtcbiAgICByZXR1cm4gcm5kczg7XG4gIH07XG59IGVsc2Uge1xuICAvLyBNYXRoLnJhbmRvbSgpLWJhc2VkIChSTkcpXG4gIC8vXG4gIC8vIElmIGFsbCBlbHNlIGZhaWxzLCB1c2UgTWF0aC5yYW5kb20oKS4gIEl0J3MgZmFzdCwgYnV0IGlzIG9mIHVuc3BlY2lmaWVkXG4gIC8vIHF1YWxpdHkuXG4gIHZhciBybmRzID0gbmV3IEFycmF5KDE2KTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIG1hdGhSTkcoKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIHI7IGkgPCAxNjsgaSsrKSB7XG4gICAgICBpZiAoKGkgJiAweDAzKSA9PT0gMCkgciA9IE1hdGgucmFuZG9tKCkgKiAweDEwMDAwMDAwMDtcbiAgICAgIHJuZHNbaV0gPSByID4+PiAoKGkgJiAweDAzKSA8PCAzKSAmIDB4ZmY7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJuZHM7XG4gIH07XG59XG4iLCJ2YXIgcm5nID0gcmVxdWlyZSgnLi9saWIvcm5nJyk7XG52YXIgYnl0ZXNUb1V1aWQgPSByZXF1aXJlKCcuL2xpYi9ieXRlc1RvVXVpZCcpO1xuXG5mdW5jdGlvbiB2NChvcHRpb25zLCBidWYsIG9mZnNldCkge1xuICB2YXIgaSA9IGJ1ZiAmJiBvZmZzZXQgfHwgMDtcblxuICBpZiAodHlwZW9mKG9wdGlvbnMpID09ICdzdHJpbmcnKSB7XG4gICAgYnVmID0gb3B0aW9ucyA9PT0gJ2JpbmFyeScgPyBuZXcgQXJyYXkoMTYpIDogbnVsbDtcbiAgICBvcHRpb25zID0gbnVsbDtcbiAgfVxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICB2YXIgcm5kcyA9IG9wdGlvbnMucmFuZG9tIHx8IChvcHRpb25zLnJuZyB8fCBybmcpKCk7XG5cbiAgLy8gUGVyIDQuNCwgc2V0IGJpdHMgZm9yIHZlcnNpb24gYW5kIGBjbG9ja19zZXFfaGlfYW5kX3Jlc2VydmVkYFxuICBybmRzWzZdID0gKHJuZHNbNl0gJiAweDBmKSB8IDB4NDA7XG4gIHJuZHNbOF0gPSAocm5kc1s4XSAmIDB4M2YpIHwgMHg4MDtcblxuICAvLyBDb3B5IGJ5dGVzIHRvIGJ1ZmZlciwgaWYgcHJvdmlkZWRcbiAgaWYgKGJ1Zikge1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCAxNjsgKytpaSkge1xuICAgICAgYnVmW2kgKyBpaV0gPSBybmRzW2lpXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmIHx8IGJ5dGVzVG9VdWlkKHJuZHMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHY0O1xuIiwiaW1wb3J0ICogYXMgdXVpZCBmcm9tIFwidXVpZC92NFwiO1xyXG5cclxuaW50ZXJmYWNlIE1vbmFjb1dpbmRvdyB7XHJcbiAgICBtb25hY286IGFueTtcclxufVxyXG5cclxuY29uc3QgbW9uYWNvV2luZG93ID0gKHdpbmRvdyBhcyBhbnkpIGFzIE1vbmFjb1dpbmRvdztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmV2aWV3Q29tbWVudCB7XHJcbiAgICBpZD86IHN0cmluZztcclxuICAgIGF1dGhvcjogc3RyaW5nO1xyXG4gICAgZHQ6IERhdGUgfCBzdHJpbmc7XHJcbiAgICBsaW5lTnVtYmVyOiBudW1iZXI7XHJcbiAgICB0ZXh0OiBzdHJpbmc7XHJcbiAgICBjb21tZW50cz86IFJldmlld0NvbW1lbnRbXTtcclxuICAgIGRlbGV0ZWQ/OiBib29sZWFuO1xyXG59XHJcblxyXG5jbGFzcyBSZXZpZXdDb21tZW50U3RhdGUge1xyXG4gICAgdmlld1pvbmVJZDogbnVtYmVyO1xyXG4gICAgcmVuZGVyU3RhdHVzOiBSZXZpZXdDb21tZW50U3RhdHVzO1xyXG4gICAgbnVtYmVyT2ZMaW5lczogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKG51bWJlck9mTGluZXM6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5ub3JtYWw7XHJcbiAgICAgICAgdGhpcy52aWV3Wm9uZUlkID0gbnVsbDtcclxuICAgICAgICB0aGlzLm51bWJlck9mTGluZXMgPSBudW1iZXJPZkxpbmVzO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlUmV2aWV3TWFuYWdlcihlZGl0b3I6IGFueSwgY3VycmVudFVzZXI6IHN0cmluZywgY29tbWVudHM/OiBSZXZpZXdDb21tZW50W10sIG9uQ2hhbmdlPzogT25Db21tZW50c0NoYW5nZWQsIGNvbmZpZz86IFJldmlld01hbmFnZXJDb25maWcpOiBSZXZpZXdNYW5hZ2VyIHtcclxuICAgIC8vRm9yIERlYnVnOiAod2luZG93IGFzIGFueSkuZWRpdG9yID0gZWRpdG9yO1xyXG4gICAgY29uc3Qgcm0gPSBuZXcgUmV2aWV3TWFuYWdlcihlZGl0b3IsIGN1cnJlbnRVc2VyLCBvbkNoYW5nZSwgY29uZmlnKTtcclxuICAgIHJtLmxvYWQoY29tbWVudHMgfHwgW10pO1xyXG4gICAgcmV0dXJuIHJtO1xyXG59XHJcblxyXG5cclxuaW50ZXJmYWNlIFJldmlld0NvbW1lbnRJdGVySXRlbSB7XHJcbiAgICBkZXB0aDogbnVtYmVyO1xyXG4gICAgY29tbWVudDogUmV2aWV3Q29tbWVudCxcclxuICAgIHZpZXdTdGF0ZTogUmV2aWV3Q29tbWVudFN0YXRlXHJcbn1cclxuXHJcbmludGVyZmFjZSBPbkNvbW1lbnRzQ2hhbmdlZCB7XHJcbiAgICAoY29tbWVudHM6IFJldmlld0NvbW1lbnRbXSk6IHZvaWRcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZXZpZXdNYW5hZ2VyQ29uZmlnIHtcclxuICAgIGVkaXRCdXR0b25FbmFibGVSZW1vdmU/OiBib29sZWFuO1xyXG4gICAgbGluZUhlaWdodD86IG51bWJlcjtcclxuICAgIGNvbW1lbnRJbmRlbnQ/OiBudW1iZXI7XHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0PzogbnVtYmVyO1xyXG4gICAgZWRpdEJ1dHRvbkFkZFRleHQ/OiBzdHJpbmc7XHJcbiAgICBlZGl0QnV0dG9uUmVtb3ZlVGV4dD86IHN0cmluZztcclxuICAgIGVkaXRCdXR0b25PZmZzZXQ/OiBzdHJpbmc7XHJcbiAgICByZXZpZXdDb21tZW50SWNvblNlbGVjdD86IHN0cmluZztcclxuICAgIHJldmlld0NvbW1lbnRJY29uQWN0aXZlPzogc3RyaW5nO1xyXG4gICAgc2hvd0luUnVsZXI/OiBib29sZWFuXHJcbn1cclxuXHJcbmludGVyZmFjZSBSZXZpZXdNYW5hZ2VyQ29uZmlnUHJpdmF0ZSB7XHJcbiAgICBydWxlck1hcmtlckNvbG9yOiBhbnk7XHJcbiAgICBydWxlck1hcmtlckRhcmtDb2xvcjogYW55O1xyXG4gICAgZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZTogYm9vbGVhbjtcclxuICAgIGxpbmVIZWlnaHQ6IG51bWJlcjtcclxuICAgIGNvbW1lbnRJbmRlbnQ6IG51bWJlcjtcclxuICAgIGNvbW1lbnRJbmRlbnRPZmZzZXQ6IG51bWJlcjtcclxuICAgIGVkaXRCdXR0b25BZGRUZXh0OiBzdHJpbmc7XHJcbiAgICBlZGl0QnV0dG9uUmVtb3ZlVGV4dDogc3RyaW5nO1xyXG4gICAgZWRpdEJ1dHRvbk9mZnNldDogc3RyaW5nO1xyXG4gICAgc2hvd0luUnVsZXI6IGJvb2xlYW47XHJcbn1cclxuXHJcblxyXG5jb25zdCBkZWZhdWx0UmV2aWV3TWFuYWdlckNvbmZpZzogUmV2aWV3TWFuYWdlckNvbmZpZ1ByaXZhdGUgPSB7XHJcbiAgICBlZGl0QnV0dG9uT2Zmc2V0OiAnLTEwcHgnLFxyXG4gICAgZWRpdEJ1dHRvbkFkZFRleHQ6ICdSZXBseScsXHJcbiAgICBlZGl0QnV0dG9uUmVtb3ZlVGV4dDogJ1JlbW92ZScsXHJcbiAgICBlZGl0QnV0dG9uRW5hYmxlUmVtb3ZlOiB0cnVlLFxyXG4gICAgbGluZUhlaWdodDogMTksXHJcbiAgICBjb21tZW50SW5kZW50OiAyMCxcclxuICAgIGNvbW1lbnRJbmRlbnRPZmZzZXQ6IDIwLFxyXG4gICAgc2hvd0luUnVsZXI6IHRydWUsXHJcbiAgICBydWxlck1hcmtlckNvbG9yOiAnZGFya29yYW5nZScsXHJcbiAgICBydWxlck1hcmtlckRhcmtDb2xvcjogJ2RhcmtvcmFuZ2UnXHJcbn07XHJcblxyXG5jb25zdCBDT05UUk9MX0FUVFJfTkFNRSA9ICdSZXZpZXdNYW5hZ2VyQ29udHJvbCc7XHJcblxyXG5jbGFzcyBSZXZpZXdNYW5hZ2VyIHtcclxuICAgIGN1cnJlbnRVc2VyOiBzdHJpbmc7XHJcbiAgICBlZGl0b3I6IGFueTtcclxuICAgIGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W107XHJcbiAgICBjb21tZW50U3RhdGU6IHsgW3Jldmlld0NvbW1lbnRJZDogc3RyaW5nXTogUmV2aWV3Q29tbWVudFN0YXRlIH07XHJcblxyXG4gICAgYWN0aXZlQ29tbWVudD86IFJldmlld0NvbW1lbnQ7XHJcbiAgICB3aWRnZXRJbmxpbmVUb29sYmFyOiBhbnk7XHJcbiAgICB3aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yOiBhbnk7XHJcbiAgICBvbkNoYW5nZTogT25Db21tZW50c0NoYW5nZWQ7XHJcbiAgICBlZGl0b3JNb2RlOiBFZGl0b3JNb2RlO1xyXG4gICAgY29uZmlnOiBSZXZpZXdNYW5hZ2VyQ29uZmlnUHJpdmF0ZTtcclxuXHJcbiAgICB0ZXh0YXJlYTogSFRNTFRleHRBcmVhRWxlbWVudDtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoZWRpdG9yOiBhbnksIGN1cnJlbnRVc2VyOiBzdHJpbmcsIG9uQ2hhbmdlOiBPbkNvbW1lbnRzQ2hhbmdlZCwgY29uZmlnPzogUmV2aWV3TWFuYWdlckNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFVzZXIgPSBjdXJyZW50VXNlcjtcclxuICAgICAgICB0aGlzLmVkaXRvciA9IGVkaXRvcjtcclxuICAgICAgICB0aGlzLmFjdGl2ZUNvbW1lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY29tbWVudHMgPSBbXTtcclxuICAgICAgICB0aGlzLmNvbW1lbnRTdGF0ZSA9IHt9O1xyXG4gICAgICAgIHRoaXMud2lkZ2V0SW5saW5lVG9vbGJhciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9uQ2hhbmdlID0gb25DaGFuZ2U7XHJcbiAgICAgICAgdGhpcy5lZGl0b3JNb2RlID0gRWRpdG9yTW9kZS50b29sYmFyO1xyXG4gICAgICAgIHRoaXMuY29uZmlnID0geyAuLi5kZWZhdWx0UmV2aWV3TWFuYWdlckNvbmZpZywgLi4uKGNvbmZpZyB8fCB7fSkgfTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRBY3Rpb25zKCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVJbmxpbmVUb29sYmFyV2lkZ2V0KCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVJbmxpbmVFZGl0b3JXaWRnZXQoKTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3Iub25Nb3VzZURvd24odGhpcy5oYW5kbGVNb3VzZURvd24uYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZChjb21tZW50czogUmV2aWV3Q29tbWVudFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuY2hhbmdlVmlld1pvbmVzKChjaGFuZ2VBY2Nlc3NvcikgPT4ge1xyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIHRoZSBleGlzdGluZyBjb21tZW50cyAgICAgXHJcbiAgICAgICAgICAgIGZvciAoY29uc3Qgb2xkSXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2xkSXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUob2xkSXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuY29tbWVudHMgPSBjb21tZW50cyB8fCBbXTtcclxuICAgICAgICAgICAgdGhpcy5jb21tZW50U3RhdGUgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGFsbCBjb21tZW50cyB0aGF0IHRoZXkgaGF2ZSB1bmlxdWUgYW5kIHByZXNlbnQgaWQnc1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxJZCA9IGl0ZW0uY29tbWVudC5pZDtcclxuICAgICAgICAgICAgICAgIGxldCBjaGFuZ2VkSWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoIWl0ZW0uY29tbWVudC5pZCB8fCB0aGlzLmNvbW1lbnRTdGF0ZVtpdGVtLmNvbW1lbnQuaWRdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jb21tZW50LmlkID0gdXVpZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZWRJZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNoYW5nZWRJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignQ29tbWVudC5JZCBBc3NpZ25lZDogJywgb3JpZ2luYWxJZCwgJyBjaGFuZ2VkIHRvIHRvICcsIGl0ZW0uY29tbWVudC5pZCwgJyBkdWUgdG8gY29sbGlzaW9uJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21tZW50U3RhdGVbaXRlbS5jb21tZW50LmlkXSA9IG5ldyBSZXZpZXdDb21tZW50U3RhdGUodGhpcy5jYWxjdWxhdGVOdW1iZXJPZkxpbmVzKGl0ZW0uY29tbWVudC50ZXh0KSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdDb21tZW50cyBMb2FkZWQ6ICcsIHRoaXMuY29tbWVudHMubGVuZ3RoKTtcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNhbGN1bGF0ZU51bWJlck9mTGluZXModGV4dDogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGV4dC5zcGxpdCgvXFxyKlxcbi8pLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUaGVtZWRDb2xvcihuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIC8vIGVkaXRvci5iYWNrZ3JvdW5kOiBlIHtyZ2JhOiBlfVxyXG4gICAgICAgIC8vIGVkaXRvci5mb3JlZ3JvdW5kOiBlIHtyZ2JhOiBlfVxyXG4gICAgICAgIC8vIGVkaXRvci5pbmFjdGl2ZVNlbGVjdGlvbkJhY2tncm91bmQ6IGUge3JnYmE6IGV9XHJcbiAgICAgICAgLy8gZWRpdG9yLnNlbGVjdGlvbkhpZ2hsaWdodEJhY2tncm91bmQ6IGUge3JnYmE6IGV9XHJcbiAgICAgICAgLy8gZWRpdG9ySW5kZW50R3VpZGUuYWN0aXZlQmFja2dyb3VuZDogZSB7cmdiYTogZX1cclxuICAgICAgICAvLyBlZGl0b3JJbmRlbnRHdWlkZS5iYWNrZ3JvdW5kOiBlIHtyZ2JhOiBlfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmVkaXRvci5fdGhlbWVTZXJ2aWNlLmdldFRoZW1lKCkuZ2V0Q29sb3IobmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5saW5lRWRpdEJ1dHRvbnNFbGVtZW50KCkge1xyXG4gICAgICAgIHZhciByb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgICAgcm9vdC5jbGFzc05hbWUgPSAnZWRpdEJ1dHRvbnNDb250YWluZXInXHJcbiAgICAgICAgcm9vdC5zdHlsZS5tYXJnaW5MZWZ0ID0gdGhpcy5jb25maWcuZWRpdEJ1dHRvbk9mZnNldDtcclxuXHJcbiAgICAgICAgY29uc3QgYWRkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpIGFzIEhUTUxTcGFuRWxlbWVudDtcclxuICAgICAgICBhZGQuaW5uZXJUZXh0ID0gdGhpcy5jb25maWcuZWRpdEJ1dHRvbkFkZFRleHQ7XHJcbiAgICAgICAgYWRkLmNsYXNzTmFtZSA9ICdlZGl0QnV0dG9uIGFkZCdcclxuICAgICAgICBhZGQuc2V0QXR0cmlidXRlKENPTlRST0xfQVRUUl9OQU1FLCAnJyk7XHJcbiAgICAgICAgYWRkLm9uY2xpY2sgPSAoKSA9PiB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS5lZGl0Q29tbWVudCk7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChhZGQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5jb25maWcuZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBzcGFjZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuICAgICAgICAgICAgc3BhY2VyLmlubmVyVGV4dCA9ICcgJ1xyXG4gICAgICAgICAgICByb290LmFwcGVuZENoaWxkKHNwYWNlcik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZW1vdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJykgYXMgSFRNTFNwYW5FbGVtZW50O1xyXG4gICAgICAgICAgICByZW1vdmUuc2V0QXR0cmlidXRlKENPTlRST0xfQVRUUl9OQU1FLCAnJyk7XHJcbiAgICAgICAgICAgIHJlbW92ZS5pbm5lclRleHQgPSB0aGlzLmNvbmZpZy5lZGl0QnV0dG9uUmVtb3ZlVGV4dDtcclxuICAgICAgICAgICAgcmVtb3ZlLmNsYXNzTmFtZSA9ICdlZGl0QnV0dG9uIHJlbW92ZSdcclxuICAgICAgICAgICAgcmVtb3ZlLm9uY2xpY2sgPSAoKSA9PiB0aGlzLnJlbW92ZUNvbW1lbnQodGhpcy5hY3RpdmVDb21tZW50KTtcclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChyZW1vdmUpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHJldHVybiByb290O1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNhbmNlbCgpIHtcclxuICAgICAgICB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS50b29sYmFyKTtcclxuICAgICAgICB0aGlzLmVkaXRvci5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZVNhdmUoKSB7XHJcbiAgICAgICAgY29uc3QgciA9IHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLnRvb2xiYXIpO1xyXG4gICAgICAgIHRoaXMuYWRkQ29tbWVudChyLmxpbmVOdW1iZXIsIHIudGV4dCk7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVUZXh0QXJlYUtleURvd24oZTogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgICAgIGlmIChlLmNvZGUgPT09IFwiRXNjYXBlXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVDYW5jZWwoKTtcclxuICAgICAgICB9IGVsc2UgaWYgKGUuY29kZSA9PT0gXCJFbnRlclwiICYmIGUuY3RybEtleSkge1xyXG4gICAgICAgICAgICB0aGlzLmhhbmRsZVNhdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5saW5lRWRpdG9yRWxlbWVudCgpIHtcclxuICAgICAgICB2YXIgcm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSBhcyBIVE1MU3BhbkVsZW1lbnQ7XHJcbiAgICAgICAgcm9vdC5jbGFzc05hbWUgPSBcInJldmlld0NvbW1lbnRFZGl0XCJcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dGFyZWEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcbiAgICAgICAgdGV4dGFyZWEuc2V0QXR0cmlidXRlKENPTlRST0xfQVRUUl9OQU1FLCAnJyk7XHJcbiAgICAgICAgdGV4dGFyZWEuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50VGV4dFwiO1xyXG4gICAgICAgIHRleHRhcmVhLmlubmVyVGV4dCA9ICcnO1xyXG4gICAgICAgIHRleHRhcmVhLm5hbWUgPSAndGV4dCc7XHJcbiAgICAgICAgdGV4dGFyZWEub25rZXlkb3duID0gdGhpcy5oYW5kbGVUZXh0QXJlYUtleURvd24uYmluZCh0aGlzKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2F2ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgICAgIHNhdmUuc2V0QXR0cmlidXRlKENPTlRST0xfQVRUUl9OQU1FLCAnJyk7XHJcbiAgICAgICAgc2F2ZS5jbGFzc05hbWUgPSBcInJldmlld0NvbW1lbnRTYXZlXCI7XHJcbiAgICAgICAgc2F2ZS5pbm5lclRleHQgPSAnU2F2ZSc7XHJcbiAgICAgICAgc2F2ZS5vbmNsaWNrID0gdGhpcy5oYW5kbGVTYXZlLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgICAgIGNhbmNlbC5zZXRBdHRyaWJ1dGUoQ09OVFJPTF9BVFRSX05BTUUsICcnKTtcclxuICAgICAgICBjYW5jZWwuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50Q2FuY2VsXCI7XHJcbiAgICAgICAgY2FuY2VsLmlubmVyVGV4dCA9ICdDYW5jZWwnO1xyXG4gICAgICAgIGNhbmNlbC5vbmNsaWNrID0gdGhpcy5oYW5kbGVDYW5jZWwuYmluZCh0aGlzKTtcclxuXHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZCh0ZXh0YXJlYSk7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChzYXZlKTtcclxuICAgICAgICByb290LmFwcGVuZENoaWxkKGNhbmNlbCk7XHJcblxyXG4gICAgICAgIHRoaXMudGV4dGFyZWEgPSB0ZXh0YXJlYTtcclxuICAgICAgICByZXR1cm4gcm9vdFxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZVRvb2xiYXJXaWRnZXQoKSB7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uc0VsZW1lbnQgPSB0aGlzLmNyZWF0ZUlubGluZUVkaXRCdXR0b25zRWxlbWVudCgpO1xyXG5cclxuICAgICAgICB0aGlzLndpZGdldElubGluZVRvb2xiYXIgPSB7XHJcbiAgICAgICAgICAgIGFsbG93RWRpdG9yT3ZlcmZsb3c6IHRydWUsXHJcbiAgICAgICAgICAgIGdldElkOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3dpZGdldElubGluZVRvb2xiYXInO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREb21Ob2RlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYnV0dG9uc0VsZW1lbnQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ICYmIHRoaXMuZWRpdG9yTW9kZSA9PSBFZGl0b3JNb2RlLnRvb2xiYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmZXJlbmNlOiBbbW9uYWNvV2luZG93Lm1vbmFjby5lZGl0b3IuQ29udGVudFdpZGdldFBvc2l0aW9uUHJlZmVyZW5jZS5CRUxPV11cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRDb250ZW50V2lkZ2V0KHRoaXMud2lkZ2V0SW5saW5lVG9vbGJhcik7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlSW5saW5lRWRpdG9yV2lkZ2V0KCkge1xyXG4gICAgICAgIGNvbnN0IGVkaXRvckVsZW1lbnQgPSB0aGlzLmNyZWF0ZUlubGluZUVkaXRvckVsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yID0ge1xyXG4gICAgICAgICAgICBhbGxvd0VkaXRvck92ZXJmbG93OiB0cnVlLFxyXG4gICAgICAgICAgICBnZXRJZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd3aWRnZXRJbmxpbmVFZGl0b3InO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXREb21Ob2RlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWRpdG9yRWxlbWVudDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0UG9zaXRpb246ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVkaXRvck1vZGUgPT0gRWRpdG9yTW9kZS5lZGl0Q29tbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBhcmUgdXNpbmcgbmVnYXRpdmUgbWFyZ2luVG9wIHRvIHNoaWZ0IGl0IGFib3ZlIHRoZSBsaW5lIHRvIHRoZSBwcmV2aW91c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcjogdGhpcy5hY3RpdmVDb21tZW50ID8gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgKyAxIDogdGhpcy5lZGl0b3IuZ2V0UG9zaXRpb24oKS5saW5lTnVtYmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHByZWZlcmVuY2U6IFttb25hY29XaW5kb3cubW9uYWNvLmVkaXRvci5Db250ZW50V2lkZ2V0UG9zaXRpb25QcmVmZXJlbmNlLkJFTE9XXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBY3RpdmVDb21tZW50KGNvbW1lbnQ6IFJldmlld0NvbW1lbnQpIHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKCdzZXRBY3RpdmVDb21tZW50JywgY29tbWVudCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxpbmVOdW1iZXJzVG9NYWtlRGlydHkgPSBbXTtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ICYmICghY29tbWVudCB8fCB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciAhPT0gY29tbWVudC5saW5lTnVtYmVyKSkge1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVyc1RvTWFrZURpcnR5LnB1c2godGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29tbWVudCkge1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVyc1RvTWFrZURpcnR5LnB1c2goY29tbWVudC5saW5lTnVtYmVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudCA9IGNvbW1lbnQ7XHJcbiAgICAgICAgaWYgKGxpbmVOdW1iZXJzVG9NYWtlRGlydHkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmZpbHRlckFuZE1hcENvbW1lbnRzKGxpbmVOdW1iZXJzVG9NYWtlRGlydHksIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnZpZXdTdGF0ZS5yZW5kZXJTdGF0dXMgPSBSZXZpZXdDb21tZW50U3RhdHVzLmRpcnR5XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsYXlvdXRJbmxpbmVUb29sYmFyKCkge1xyXG4gICAgICAgIGNvbnN0IHRvb2xiYXJSb290ID0gdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyLmdldERvbU5vZGUoKSBhcyBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCkge1xyXG4gICAgICAgICAgICB0b29sYmFyUm9vdC5zdHlsZS5tYXJnaW5Ub3AgPSBgLSR7dGhpcy5jYWxjdWxhdGVNYXJnaW5Ub3BPZmZzZXQoMil9cHhgO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0b29sYmFyUm9vdC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmdldFRoZW1lZENvbG9yKFwiZWRpdG9yLmJhY2tncm91bmRcIik7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IubGF5b3V0Q29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZVRvb2xiYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbHRlckFuZE1hcENvbW1lbnRzKGxpbmVOdW1iZXJzOiBudW1iZXJbXSwgZm46IHsgKGNvbW1lbnQ6IFJldmlld0NvbW1lbnRJdGVySXRlbSk6IHZvaWQgfSkge1xyXG4gICAgICAgIGNvbnN0IGNvbW1lbnRzID0gdGhpcy5pdGVyYXRlQ29tbWVudHMoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGMgb2YgY29tbWVudHMpIHtcclxuICAgICAgICAgICAgaWYgKGxpbmVOdW1iZXJzLmluZGV4T2YoYy5jb21tZW50LmxpbmVOdW1iZXIpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIGZuKGMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZU1vdXNlRG93bihldjogeyB0YXJnZXQ6IHsgZWxlbWVudDogeyBoYXNBdHRyaWJ1dGU6IHsgKHN0cmluZyk6IGJvb2xlYW4gfSB9LCBkZXRhaWw6IGFueSB9IH0pIHtcclxuICAgICAgICBpZiAoZXYudGFyZ2V0LmVsZW1lbnQuaGFzQXR0cmlidXRlKENPTlRST0xfQVRUUl9OQU1FKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGFjdGl2ZUNvbW1lbnQ6IFJldmlld0NvbW1lbnQgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKGV2LnRhcmdldC5kZXRhaWwgJiYgZXYudGFyZ2V0LmRldGFpbC52aWV3Wm9uZUlkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQgPT0gZXYudGFyZ2V0LmRldGFpbC52aWV3Wm9uZUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUNvbW1lbnQgPSBpdGVtLmNvbW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNvbW1lbnQoYWN0aXZlQ29tbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yTW9kZShFZGl0b3JNb2RlLnRvb2xiYXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNhbGN1bGF0ZU1hcmdpblRvcE9mZnNldChleHRyYU9mZnNldExpbmVzOiBudW1iZXIgPSAxKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgaWR4ID0gMDtcclxuICAgICAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgICAgIGxldCBtYXJnaW5Ub3A6IG51bWJlciA9IDA7XHJcbiAgICAgICAgY29uc3QgbGluZUhlaWdodCA9IHRoaXMuY29uZmlnLmxpbmVIZWlnaHQ7Ly9GSVhNRSAtIE1hZ2ljIG51bWJlciBmb3IgbGluZSBoZWlnaHQgICAgICAgICAgICBcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQubGluZU51bWJlciA9PSB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uY29tbWVudCA9PSB0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZHggPSBjb3VudCArIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWFyZ2luVG9wID0gKChleHRyYU9mZnNldExpbmVzICsgY291bnQgLSBpZHgpICogbGluZUhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWFyZ2luVG9wO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgc2V0RWRpdG9yTW9kZShtb2RlOiBFZGl0b3JNb2RlKTogeyBsaW5lTnVtYmVyOiBudW1iZXIsIHRleHQ6IHN0cmluZyB9IHtcclxuICAgICAgICBjb25zb2xlLmRlYnVnKCdzZXRFZGl0b3JNb2RlJywgdGhpcy5hY3RpdmVDb21tZW50KTtcclxuXHJcbiAgICAgICAgY29uc3QgbGluZU51bWJlciA9IHRoaXMuYWN0aXZlQ29tbWVudCA/IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyIDogdGhpcy5lZGl0b3IuZ2V0UG9zaXRpb24oKS5saW5lTnVtYmVyO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yTW9kZSA9IG1vZGU7XHJcblxyXG4gICAgICAgIGNvbnN0IGVkaXRvclJvb3QgPSB0aGlzLndpZGdldElubGluZUNvbW1lbnRFZGl0b3IuZ2V0RG9tTm9kZSgpIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgIGVkaXRvclJvb3Quc3R5bGUubWFyZ2luVG9wID0gYC0ke3RoaXMuY2FsY3VsYXRlTWFyZ2luVG9wT2Zmc2V0KCl9cHhgO1xyXG5cclxuXHJcblxyXG4gICAgICAgIHRoaXMubGF5b3V0SW5saW5lVG9vbGJhcigpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMudGV4dGFyZWEudmFsdWU7XHJcbiAgICAgICAgdGhpcy50ZXh0YXJlYS52YWx1ZSA9IFwiXCI7XHJcblxyXG4gICAgICAgIGlmIChtb2RlID09IEVkaXRvck1vZGUuZWRpdENvbW1lbnQpIHtcclxuICAgICAgICAgICAgLy9IQUNLIC0gYmVjYXVzZSB0aGUgZXZlbnQgaW4gbW9uYWNvIGRvZXNuJ3QgaGF2ZSBwcmV2ZW50ZGVmYXVsdCB3aGljaCBtZWFucyBlZGl0b3IgdGFrZXMgZm9jdXMgYmFjay4uLiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHRoaXMudGV4dGFyZWEuZm9jdXMoKSwgMTAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGxpbmVOdW1iZXJcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENvbW1lbnQobGluZU51bWJlcjogbnVtYmVyLCB0ZXh0OiBzdHJpbmcpOiBSZXZpZXdDb21tZW50IHtcclxuICAgICAgICBjb25zdCBsbiA9IHRoaXMuYWN0aXZlQ29tbWVudCA/IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyIDogbGluZU51bWJlcjtcclxuICAgICAgICBjb25zdCBjb21tZW50OiBSZXZpZXdDb21tZW50ID0ge1xyXG4gICAgICAgICAgICBpZDogdXVpZCgpLFxyXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiBsbixcclxuICAgICAgICAgICAgYXV0aG9yOiB0aGlzLmN1cnJlbnRVc2VyLFxyXG4gICAgICAgICAgICBkdDogbmV3IERhdGUoKSxcclxuICAgICAgICAgICAgdGV4dDogdGV4dFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5jb21tZW50U3RhdGVbY29tbWVudC5pZF0gPSBuZXcgUmV2aWV3Q29tbWVudFN0YXRlKHRoaXMuY2FsY3VsYXRlTnVtYmVyT2ZMaW5lcyh0ZXh0KSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmFjdGl2ZUNvbW1lbnQuY29tbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudC5jb21tZW50cyA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlQ29tbWVudC5jb21tZW50cy5wdXNoKGNvbW1lbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29tbWVudHMucHVzaChjb21tZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuZmlsdGVyQW5kTWFwQ29tbWVudHMoW2xuXSwgKGl0ZW0pID0+IHtcclxuICAgICAgICAgICAgaXRlbS52aWV3U3RhdGUucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5kaXJ0eTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKVxyXG4gICAgICAgIHRoaXMubGF5b3V0SW5saW5lVG9vbGJhcigpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vbkNoYW5nZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuY29tbWVudHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgaXRlcmF0ZUNvbW1lbnRzKGNvbW1lbnRzPzogUmV2aWV3Q29tbWVudFtdLCBkZXB0aD86IG51bWJlciwgcmVzdWx0cz86IFJldmlld0NvbW1lbnRJdGVySXRlbVtdKSB7XHJcbiAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMgfHwgW107XHJcbiAgICAgICAgZGVwdGggPSBkZXB0aCB8fCAwO1xyXG4gICAgICAgIGNvbW1lbnRzID0gY29tbWVudHMgfHwgdGhpcy5jb21tZW50cztcclxuXHJcbiAgICAgICAgaWYgKGNvbW1lbnRzKSB7XHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgY29tbWVudCBvZiBjb21tZW50cykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICBkZXB0aCxcclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdTdGF0ZTogdGhpcy5jb21tZW50U3RhdGVbY29tbWVudC5pZF1cclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbW1lbnQuY29tbWVudHMpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLml0ZXJhdGVDb21tZW50cyhjb21tZW50LmNvbW1lbnRzLCBkZXB0aCArIDEsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzdWx0cztcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVDb21tZW50KGNvbW1lbnQ6IFJldmlld0NvbW1lbnQpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoW2NvbW1lbnRdKSkge1xyXG4gICAgICAgICAgICBpdGVtLmNvbW1lbnQuZGVsZXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQgPT0gY29tbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNvbW1lbnQobnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMubGF5b3V0SW5saW5lVG9vbGJhcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKTtcclxuICAgICAgICBpZiAodGhpcy5vbkNoYW5nZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuY29tbWVudHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZWZyZXNoQ29tbWVudHMoKSB7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuY2hhbmdlVmlld1pvbmVzKChjaGFuZ2VBY2Nlc3NvcikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBsaW5lTnVtYmVyczogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKCkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQuZGVsZXRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1pvbmUuRGVsZXRlJywgaXRlbS5jb21tZW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQWNjZXNzb3IucmVtb3ZlWm9uZShpdGVtLnZpZXdTdGF0ZS52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS52aWV3U3RhdGUucmVuZGVyU3RhdHVzID09PSBSZXZpZXdDb21tZW50U3RhdHVzLmhpZGRlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1pvbmUuSGlkZGVuJywgaXRlbS5jb21tZW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQWNjZXNzb3IucmVtb3ZlWm9uZShpdGVtLnZpZXdTdGF0ZS52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnZpZXdTdGF0ZS52aWV3Wm9uZUlkID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0udmlld1N0YXRlLnJlbmRlclN0YXR1cyA9PT0gUmV2aWV3Q29tbWVudFN0YXR1cy5kaXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1pvbmUuRGlydHknLCBpdGVtLmNvbW1lbnQuaWQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKGl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udmlld1N0YXRlLnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMubm9ybWFsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghaXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1pvbmUuQ3JlYXRlJywgaXRlbS5jb21tZW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGluZU51bWJlcnNbaXRlbS5jb21tZW50LmxpbmVOdW1iZXJdID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IHRoaXMuYWN0aXZlQ29tbWVudCA9PSBpdGVtLmNvbW1lbnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvbU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJykgYXMgSFRNTFNwYW5FbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc3R5bGUubWFyZ2luTGVmdCA9ICh0aGlzLmNvbmZpZy5jb21tZW50SW5kZW50ICogKGl0ZW0uZGVwdGggKyAxKSkgKyB0aGlzLmNvbmZpZy5jb21tZW50SW5kZW50T2Zmc2V0ICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5nZXRUaGVtZWRDb2xvcihcImVkaXRvci5zZWxlY3Rpb25IaWdobGlnaHRCYWNrZ3JvdW5kXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuY2xhc3NOYW1lID0gYHJldmlld0NvbW1lbnQgJHtpc0FjdGl2ZSA/ICdhY3RpdmUnIDogJyBpbmFjdGl2ZSd9YDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXV0aG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpIGFzIEhUTUxTcGFuRWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICBhdXRob3IuY2xhc3NOYW1lID0gJ3Jldmlld0NvbW1lbnQgYXV0aG9yJ1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvci5pbm5lclRleHQgPSBgJHtpdGVtLmNvbW1lbnQuYXV0aG9yIHx8ICcgJ30gYXQgYDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJykgYXMgSFRNTFNwYW5FbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIGR0LmNsYXNzTmFtZSA9ICdyZXZpZXdDb21tZW50IGR0J1xyXG4gICAgICAgICAgICAgICAgICAgIGR0LmlubmVyVGV4dCA9IGl0ZW0uY29tbWVudC5kdC50b0xvY2FsZVN0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpIGFzIEhUTUxTcGFuRWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LmNsYXNzTmFtZSA9ICdyZXZpZXdDb21tZW50IHRleHQnXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5pbm5lclRleHQgPSBgJHtpdGVtLmNvbW1lbnQudGV4dH0gYnkgYDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZCh0ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmFwcGVuZENoaWxkKGF1dGhvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChkdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQgPSBjaGFuZ2VBY2Nlc3Nvci5hZGRab25lKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXJMaW5lTnVtYmVyOiBpdGVtLmNvbW1lbnQubGluZU51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0SW5MaW5lczogaXRlbS52aWV3U3RhdGUubnVtYmVyT2ZMaW5lcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9tTm9kZTogZG9tTm9kZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3VwcHJlc3NNb3VzZURvd246IHRydWUgLy8gVGhpcyBzdG9wcyBmb2N1cyBiZWluZyBsb3N0IHRoZSBlZGl0b3IgLSBtZWFuaW5nIGtleWJvYXJkIHNob3J0Y3V0cyBrZWVwcyB3b3JraW5nXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvbmZpZy5zaG93SW5SdWxlcikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVjb3JhdG9ycyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBsbiBpbiBsaW5lTnVtYmVycykge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlY29yYXRvcnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiBuZXcgbW9uYWNvV2luZG93Lm1vbmFjby5SYW5nZShsbiwgMCwgbG4sIDApLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1dob2xlTGluZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJ2aWV3UnVsZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogdGhpcy5jb25maWcucnVsZXJNYXJrZXJDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXJrQ29sb3I6IHRoaXMuY29uZmlnLnJ1bGVyTWFya2VyRGFya0NvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAxXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vVE9ETyAtIFByZXNlcnZlciBhbnkgb3RoZXIgZGVjb3JhdG9yc1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0b3IuZGVsdGFEZWNvcmF0aW9ucyhbXSwgZGVjb3JhdG9ycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRBY3Rpb25zKCkge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZEFjdGlvbih7XHJcbiAgICAgICAgICAgIGlkOiAnbXktdW5pcXVlLWlkLWFkZCcsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnQWRkIENvbW1lbnQnLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nczogW1xyXG4gICAgICAgICAgICAgICAgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlNb2QuQ3RybENtZCB8IG1vbmFjb1dpbmRvdy5tb25hY28uS2V5Q29kZS5GMTAsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIHByZWNvbmRpdGlvbjogbnVsbCxcclxuICAgICAgICAgICAga2V5YmluZGluZ0NvbnRleHQ6IG51bGwsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51R3JvdXBJZDogJ25hdmlnYXRpb24nLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudU9yZGVyOiAwLFxyXG5cclxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS5lZGl0Q29tbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQWN0aW9uKHtcclxuICAgICAgICAgICAgaWQ6ICdteS11bmlxdWUtaWQtbmV4dCcsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnTmV4dCBDb21tZW50JyxcclxuICAgICAgICAgICAga2V5YmluZGluZ3M6IFtcclxuICAgICAgICAgICAgICAgIG1vbmFjb1dpbmRvdy5tb25hY28uS2V5TW9kLkN0cmxDbWQgfCBtb25hY29XaW5kb3cubW9uYWNvLktleUNvZGUuRjEyLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwcmVjb25kaXRpb246IG51bGwsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdDb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudUdyb3VwSWQ6ICduYXZpZ2F0aW9uJyxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVPcmRlcjogMC4xLFxyXG5cclxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9Db21tZW50KE5hdmlnYXRpb25EaXJlY3Rpb24ubmV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQWN0aW9uKHtcclxuICAgICAgICAgICAgaWQ6ICdteS11bmlxdWUtaWQtcHJldicsXHJcbiAgICAgICAgICAgIGxhYmVsOiAnUHJldiBDb21tZW50JyxcclxuICAgICAgICAgICAga2V5YmluZGluZ3M6IFtcclxuICAgICAgICAgICAgICAgIG1vbmFjb1dpbmRvdy5tb25hY28uS2V5TW9kLkN0cmxDbWQgfCBtb25hY29XaW5kb3cubW9uYWNvLktleUNvZGUuRjExLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwcmVjb25kaXRpb246IG51bGwsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdDb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudUdyb3VwSWQ6ICduYXZpZ2F0aW9uJyxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVPcmRlcjogMC4xLFxyXG5cclxuICAgICAgICAgICAgcnVuOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hdmlnYXRlVG9Db21tZW50KE5hdmlnYXRpb25EaXJlY3Rpb24ucHJldik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBuYXZpZ2F0ZVRvQ29tbWVudChkaXJlY3Rpb246IE5hdmlnYXRpb25EaXJlY3Rpb24pIHtcclxuICAgICAgICBsZXQgY3VycmVudExpbmUgPSAwO1xyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgY3VycmVudExpbmUgPSB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjdXJyZW50TGluZSA9IHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbW1lbnRzID0gdGhpcy5jb21tZW50cy5maWx0ZXIoKGMpID0+IHtcclxuICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWdhdGlvbkRpcmVjdGlvbi5uZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYy5saW5lTnVtYmVyID4gY3VycmVudExpbmU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSBOYXZpZ2F0aW9uRGlyZWN0aW9uLnByZXYpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjLmxpbmVOdW1iZXIgPCBjdXJyZW50TGluZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoY29tbWVudHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbW1lbnRzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IE5hdmlnYXRpb25EaXJlY3Rpb24ubmV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhLmxpbmVOdW1iZXIgLSBiLmxpbmVOdW1iZXI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWdhdGlvbkRpcmVjdGlvbi5wcmV2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIubGluZU51bWJlciAtIGEubGluZU51bWJlcjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb21tZW50ID0gY29tbWVudHNbMF07XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlQ29tbWVudChjb21tZW50KVxyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLmxheW91dElubGluZVRvb2xiYXIoKTtcclxuICAgICAgICAgICAgdGhpcy5lZGl0b3IucmV2ZWFsTGluZUluQ2VudGVyKGNvbW1lbnQubGluZU51bWJlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZW51bSBOYXZpZ2F0aW9uRGlyZWN0aW9uIHtcclxuICAgIG5leHQgPSAxLFxyXG4gICAgcHJldiA9IDJcclxufVxyXG5cclxuZW51bSBFZGl0b3JNb2RlIHtcclxuICAgIGVkaXRDb21tZW50ID0gMSxcclxuICAgIHRvb2xiYXIgPSAyXHJcbn1cclxuXHJcbmVudW0gUmV2aWV3Q29tbWVudFN0YXR1cyB7XHJcbiAgICBkaXJ0eSA9IDEsXHJcbiAgICBoaWRkZW4gPSAyLFxyXG4gICAgbm9ybWFsID0gM1xyXG59Il0sInNvdXJjZVJvb3QiOiIifQ==