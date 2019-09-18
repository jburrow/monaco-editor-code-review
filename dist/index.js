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
var ReviewCommentStatus;
(function (ReviewCommentStatus) {
    ReviewCommentStatus[ReviewCommentStatus["active"] = 1] = "active";
    ReviewCommentStatus[ReviewCommentStatus["deleted"] = 2] = "deleted";
})(ReviewCommentStatus = exports.ReviewCommentStatus || (exports.ReviewCommentStatus = {}));
var ReviewCommentState = /** @class */ (function () {
    function ReviewCommentState(numberOfLines) {
        this.renderStatus = ReviewCommentRenderState.normal;
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
    verticalOffset: 0,
    editButtonOffset: '-10px',
    editButtonAddText: 'Reply',
    editButtonRemoveText: 'Remove',
    editButtonEnableRemove: true,
    commentIndent: 20,
    commentIndentOffset: 20,
    showInRuler: true,
    rulerMarkerColor: 'darkorange',
    rulerMarkerDarkColor: 'darkorange',
    formatDate: null,
    showAddCommentGlyph: true,
};
var CONTROL_ATTR_NAME = 'ReviewManagerControl';
var POSITION_BELOW = 2; //above=1, below=2, exact=0
var ReviewManager = /** @class */ (function () {
    function ReviewManager(editor, currentUser, onChange, config) {
        var _this = this;
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = null;
        this.comments = [];
        this.commentState = {};
        this.widgetInlineToolbar = null;
        this.widgetInlineCommentEditor = null;
        this.onChange = onChange;
        this.editorMode = EditorMode.toolbar;
        this.config = __assign(__assign({}, defaultReviewManagerConfig), (config || {}));
        this.currentLineDecorations = [];
        this.currentCommentDecorations = [];
        this.currentLineDecorationLineNumber = null;
        this.addActions();
        this.createInlineToolbarWidget();
        this.createInlineEditorWidget();
        this.editor.onMouseDown(this.handleMouseDown.bind(this));
        this.editor.onDidChangeModelDecorations(this.handleDidChangeModelDecorations.bind(this));
        this.editorConfig = this.editor.getConfiguration();
        this.editor.onDidChangeConfiguration(function () { return _this.editorConfig = _this.editor.getConfiguration(); });
        if (this.config.showAddCommentGlyph) {
            this.editor.onMouseMove(this.handleMouseMove.bind(this));
        }
    }
    ReviewManager.prototype.handleDidChangeModelDecorations = function (e) {
        console.log('handleDidChangeModelDecorations', e);
    };
    ReviewManager.prototype.load = function (comments) {
        var _this = this;
        this.editor.changeViewZones(function (changeAccessor) {
            // Remove all the existing comments     
            for (var _i = 0, _a = Object.values(_this.commentState); _i < _a.length; _i++) {
                var viewState = _a[_i];
                if (viewState.viewZoneId !== null) {
                    changeAccessor.removeZone(viewState.viewZoneId);
                }
            }
            _this.comments = comments || [];
            _this.commentState = {};
            // Check all comments that they have unique and present id's
            for (var _b = 0, comments_1 = comments; _b < comments_1.length; _b++) {
                var comment = comments_1[_b];
                var originalId = comment.id;
                var changedId = false;
                while (!comment.id || _this.commentState[comment.id]) {
                    comment.id = uuid();
                    changedId = true;
                }
                if (changedId) {
                    console.warn('Comment.Id Assigned: ', originalId, ' changed to to ', comment.id, ' due to collision');
                }
                _this.commentState[comment.id] = new ReviewCommentState(_this.calculateNumberOfLines(comment.text));
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
        var theme = this.editor._themeService.getTheme();
        var value = theme.getColor(name);
        // HACK - Buttons themes are not in monaco ... so just hack in theme for dark
        var missingThemes = {
            'dark': {
                "button.background": "#0e639c",
                "button.foreground": "#ffffff",
            },
            'light': {
                "button.background": "#007acc",
                "button.foreground": "#ffffff"
            }
        };
        if (!value) {
            value = missingThemes[theme.themeName.indexOf('dark') > -1 ? 'dark' : 'light'][name];
        }
        return value;
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
    ReviewManager.prototype.handleAddComment = function () {
        this.setEditorMode(EditorMode.toolbar);
        var lineNumber = this.activeComment ? this.activeComment.lineNumber : this.editor.getSelection().endLineNumber;
        var text = this.textarea.value;
        var selection = this.activeComment ? null : this.editor.getSelection();
        this.addComment(lineNumber, text, selection);
        this.editor.focus();
    };
    ReviewManager.prototype.handleTextAreaKeyDown = function (e) {
        if (e.code === "Escape") {
            this.handleCancel();
        }
        else if (e.code === "Enter" && e.ctrlKey) {
            this.handleAddComment();
        }
    };
    ReviewManager.prototype.createInlineEditorElement = function () {
        var root = document.createElement('span');
        root.className = "reviewCommentEditor";
        var textarea = document.createElement('textarea');
        textarea.setAttribute(CONTROL_ATTR_NAME, '');
        textarea.className = "reviewCommentEditor text";
        textarea.innerText = '';
        textarea.name = 'text';
        textarea.onkeydown = this.handleTextAreaKeyDown.bind(this);
        var add = document.createElement('button');
        add.setAttribute(CONTROL_ATTR_NAME, '');
        add.className = "reviewCommentEditor save";
        add.style.fontFamily = "Consolas";
        add.innerText = 'Add Comment';
        add.onclick = this.handleAddComment.bind(this);
        var cancel = document.createElement('button');
        cancel.setAttribute(CONTROL_ATTR_NAME, '');
        cancel.className = "reviewCommentEditor cancel";
        cancel.innerText = 'Cancel';
        cancel.onclick = this.handleCancel.bind(this);
        root.appendChild(textarea);
        root.appendChild(add);
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
                            lineNumber: _this.activeComment.lineNumber,
                            column: 1
                        },
                        preference: [POSITION_BELOW]
                    };
                }
            }
        };
        this.editor.addContentWidget(this.widgetInlineToolbar);
    };
    ReviewManager.prototype.createInlineEditorWidget = function () {
        var _this = this;
        // doesn't re-theme when
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
                            lineNumber: _this.activeComment ? _this.activeComment.lineNumber : _this.editor.getPosition().lineNumber + 1,
                            column: 1
                        },
                        preference: [POSITION_BELOW]
                    };
                }
            }
        };
        this.editor.addContentWidget(this.widgetInlineCommentEditor);
    };
    ReviewManager.prototype.setActiveComment = function (comment) {
        var _this = this;
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
            this.filterAndMapComments(lineNumbersToMakeDirty, function (comment) {
                _this.commentState[comment.id].renderStatus = ReviewCommentRenderState.dirty;
            });
        }
    };
    ReviewManager.prototype.filterAndMapComments = function (lineNumbers, fn) {
        for (var _i = 0, _a = this.comments; _i < _a.length; _i++) {
            var comment = _a[_i];
            if (lineNumbers.indexOf(comment.lineNumber) > -1) {
                fn(comment);
            }
        }
    };
    ReviewManager.prototype.handleMouseMove = function (ev) {
        if (ev.target && ev.target.position && ev.target.position.lineNumber) {
            this.currentLineDecorationLineNumber = ev.target.position.lineNumber;
            this.currentLineDecorations = this.editor.deltaDecorations(this.currentLineDecorations, [
                {
                    range: new monacoWindow.monaco.Range(ev.target.position.lineNumber, 0, ev.target.position.lineNumber, 0),
                    options: {
                        marginClassName: 'activeLineMarginClass',
                        zIndex: 100
                    }
                }
            ]);
        }
    };
    ReviewManager.prototype.handleMouseDown = function (ev) {
        // Not ideal - but couldn't figure out a different way to identify the glyph event        
        if (ev.target.element.className && ev.target.element.className.indexOf('activeLineMarginClass') > -1) {
            this.editor.setPosition({
                lineNumber: this.currentLineDecorationLineNumber,
                column: 1
            });
            this.setEditorMode(EditorMode.editComment);
        }
        else if (!ev.target.element.hasAttribute(CONTROL_ATTR_NAME)) {
            var activeComment = null;
            if (ev.target.detail && ev.target.detail.viewZoneId !== null) {
                for (var _i = 0, _a = this.comments; _i < _a.length; _i++) {
                    var comment = _a[_i];
                    var viewState = this.commentState[comment.id];
                    if (viewState.viewZoneId == ev.target.detail.viewZoneId) {
                        activeComment = comment;
                        break;
                    }
                }
            }
            this.setActiveComment(activeComment);
            this.refreshComments();
            this.setEditorMode(EditorMode.toolbar);
        }
    };
    ReviewManager.prototype.calculateMarginTopOffset = function () {
        var idx = 0;
        var count = 0;
        var marginTop = 0;
        var lineHeight = this.editorConfig.fontInfo.lineHeight;
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
            marginTop = idx * lineHeight;
        }
        return marginTop + this.config.verticalOffset;
    };
    ReviewManager.prototype.layoutInlineToolbar = function () {
        var root = this.widgetInlineToolbar.getDomNode();
        root.style.backgroundColor = this.getThemedColor("editor.background");
        root.style.marginTop = this.calculateMarginTopOffset() + "px";
        this.editor.layoutContentWidget(this.widgetInlineToolbar);
    };
    ReviewManager.prototype.layoutInlineCommentEditor = function () {
        var _this = this;
        var root = this.widgetInlineCommentEditor.getDomNode();
        Array.prototype.slice.call(root.getElementsByTagName('textarea')).concat([root]).forEach(function (e) {
            e.style.backgroundColor = _this.getThemedColor("editor.background");
            e.style.color = _this.getThemedColor("editor.foreground");
        });
        Array.prototype.slice.call(root.getElementsByTagName('button'))
            .forEach(function (button) {
            button.style.backgroundColor = _this.getThemedColor("button.background");
            button.style.color = _this.getThemedColor("button.foreground");
        });
        root.style.marginTop = this.calculateMarginTopOffset() + "px";
        this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
    };
    ReviewManager.prototype.setEditorMode = function (mode) {
        var _this = this;
        console.debug('setEditorMode', this.activeComment);
        this.editorMode = mode;
        this.layoutInlineCommentEditor();
        this.layoutInlineToolbar();
        if (mode == EditorMode.editComment) {
            this.textarea.value = "";
            //HACK - because the event in monaco doesn't have preventdefault which means editor takes focus back...                        
            setTimeout(function () { return _this.textarea.focus(); }, 100);
        }
    };
    ReviewManager.prototype.addComment = function (lineNumber, text, selection) {
        var _this = this;
        var ln = this.activeComment ? this.activeComment.lineNumber : lineNumber;
        var comment = {
            id: uuid(),
            lineNumber: ln,
            author: this.currentUser,
            dt: new Date(),
            text: text,
            status: ReviewCommentStatus.active,
            selection: selection,
            parentId: this.activeComment ? this.activeComment.id : null
        };
        this.commentState[comment.id] = new ReviewCommentState(this.calculateNumberOfLines(text));
        this.comments.push(comment);
        this.filterAndMapComments([ln], function (comment) {
            _this.commentState[comment.id].renderStatus = ReviewCommentRenderState.dirty;
        });
        this.refreshComments();
        this.layoutInlineToolbar();
        if (this.onChange) {
            this.onChange(this.comments);
        }
        return comment;
    };
    ReviewManager.prototype.recurseComments = function (allComments, filterFn, depth, results) {
        var comments = Object.values(allComments).filter(filterFn).sort(function (a, b) { return a.dt > b.dt ? 1 : -1; });
        var _loop_1 = function (comment) {
            delete allComments[comment.id];
            results.push({
                depth: depth,
                comment: comment,
                viewState: this_1.commentState[comment.id]
            });
            this_1.recurseComments(allComments, function (x) { return x.parentId === comment.id; }, depth + 1, results);
        };
        var this_1 = this;
        for (var _i = 0, comments_2 = comments; _i < comments_2.length; _i++) {
            var comment = comments_2[_i];
            _loop_1(comment);
        }
    };
    ReviewManager.prototype.iterateComments = function (filterFn) {
        if (!filterFn) {
            filterFn = function (c) { return !c.parentId; };
        }
        var tmpComments = (this.comments).reduce(function (obj, item) {
            obj[item.id] = item;
            return obj;
        }, {});
        var results = [];
        this.recurseComments(tmpComments, filterFn, 0, results);
        return results;
    };
    ReviewManager.prototype.removeComment = function (comment) {
        for (var _i = 0, _a = this.iterateComments(function (c) { return c.id === comment.id; }); _i < _a.length; _i++) {
            var item = _a[_i];
            item.comment.status = ReviewCommentStatus.deleted;
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
    ReviewManager.prototype.formatDate = function (dt) {
        if (this.config.formatDate) {
            return this.config.formatDate(dt);
        }
        else if (dt instanceof Date) {
            return dt.toISOString();
        }
        else {
            return dt;
        }
    };
    ReviewManager.prototype.refreshComments = function () {
        var _this = this;
        this.editor.changeViewZones(function (changeAccessor) {
            var lineNumbers = {};
            for (var _i = 0, _a = _this.iterateComments(); _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.comment.status && item.comment.status === ReviewCommentStatus.deleted) {
                    console.debug('Zone.Delete', item.comment.id);
                    changeAccessor.removeZone(item.viewState.viewZoneId);
                    continue;
                }
                if (item.viewState.renderStatus === ReviewCommentRenderState.hidden) {
                    console.debug('Zone.Hidden', item.comment.id);
                    changeAccessor.removeZone(item.viewState.viewZoneId);
                    item.viewState.viewZoneId = null;
                    continue;
                }
                if (item.viewState.renderStatus === ReviewCommentRenderState.dirty) {
                    console.debug('Zone.Dirty', item.comment.id);
                    changeAccessor.removeZone(item.viewState.viewZoneId);
                    item.viewState.viewZoneId = null;
                    item.viewState.renderStatus = ReviewCommentRenderState.normal;
                }
                if (!lineNumbers[item.comment.lineNumber]) {
                    lineNumbers[item.comment.lineNumber] = item.comment.selection;
                }
                if (item.viewState.viewZoneId == null) {
                    console.debug('Zone.Create', item.comment.id);
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
                    dt.innerText = _this.formatDate(item.comment.dt);
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
                for (var _b = 0, _c = Object.entries(lineNumbers); _b < _c.length; _b++) {
                    var _d = _c[_b], ln = _d[0], selection = _d[1];
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
                    if (selection) {
                        decorators.push({
                            range: new monacoWindow.monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn),
                            options: {
                                className: 'reviewComment selection',
                            }
                        });
                    }
                }
                _this.currentCommentDecorations = _this.editor.deltaDecorations(_this.currentCommentDecorations, decorators);
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
            if (c.status !== ReviewCommentStatus.deleted && !c.parentId) {
                if (direction === NavigationDirection.next) {
                    return c.lineNumber > currentLine;
                }
                else if (direction === NavigationDirection.prev) {
                    return c.lineNumber < currentLine;
                }
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
exports.ReviewManager = ReviewManager;
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
var ReviewCommentRenderState;
(function (ReviewCommentRenderState) {
    ReviewCommentRenderState[ReviewCommentRenderState["dirty"] = 1] = "dirty";
    ReviewCommentRenderState[ReviewCommentRenderState["hidden"] = 2] = "hidden";
    ReviewCommentRenderState[ReviewCommentRenderState["normal"] = 3] = "normal";
})(ReviewCommentRenderState || (ReviewCommentRenderState = {}));


/***/ })

/******/ });
//# sourceMappingURL=index.js.map