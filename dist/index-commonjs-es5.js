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

/***/ "./src/events-reducers.ts":
/*!********************************!*\
  !*** ./src/events-reducers.ts ***!
  \********************************/
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
;
function commentReducer(event, state) {
    var dirtyLineNumbers = new Set();
    switch (event.type) {
        case "edit":
            var parent_1 = state.comments[event.targetId];
            if (!parent_1)
                break;
            parent_1.comment = __assign(__assign({}, parent_1.comment), { author: event.createdBy, dt: event.createdAt, text: event.text });
            parent_1.history.push(parent_1.comment);
            parent_1.numberOfLines = calculateNumberOfLines(event.text);
            dirtyLineNumbers.add(parent_1.comment.lineNumber);
            console.log('edit', event);
            break;
        case "delete":
            var selected = state.comments[event.targetId];
            delete state.comments[event.targetId];
            if (selected.viewZoneId) {
                state.viewZoneIdsToDelete.push(selected.viewZoneId);
            }
            dirtyLineNumbers.add(selected.comment.lineNumber);
            console.log('delete', event);
            break;
        case "create":
            if (!state.comments[event.id]) {
                state.comments[event.id] = new ReviewCommentState({
                    author: event.createdBy,
                    dt: event.createdAt,
                    id: event.id,
                    lineNumber: event.lineNumber,
                    text: event.text,
                    parentId: event.targetId
                }, calculateNumberOfLines(event.text));
                console.log('insert', event);
                dirtyLineNumbers.add(event.lineNumber);
            }
            break;
    }
    if (dirtyLineNumbers.size) {
        for (var _i = 0, _a = Object.values(state.comments); _i < _a.length; _i++) {
            var cs = _a[_i];
            if (dirtyLineNumbers.has(cs.comment.lineNumber)) {
                cs.renderStatus = ReviewCommentRenderState.dirty;
            }
        }
    }
    return state;
}
exports.commentReducer = commentReducer;
function calculateNumberOfLines(text) {
    return text ? text.split(/\r*\n/).length + 1 : 1;
}
exports.calculateNumberOfLines = calculateNumberOfLines;
var ReviewCommentState = /** @class */ (function () {
    function ReviewCommentState(comment, numberOfLines) {
        this.renderStatus = ReviewCommentRenderState.normal;
        this.viewZoneId = null;
        this.comment = comment;
        this.numberOfLines = numberOfLines;
        this.history = [comment];
    }
    return ReviewCommentState;
}());
exports.ReviewCommentState = ReviewCommentState;
var ReviewCommentRenderState;
(function (ReviewCommentRenderState) {
    ReviewCommentRenderState[ReviewCommentRenderState["dirty"] = 1] = "dirty";
    ReviewCommentRenderState[ReviewCommentRenderState["hidden"] = 2] = "hidden";
    ReviewCommentRenderState[ReviewCommentRenderState["normal"] = 3] = "normal";
})(ReviewCommentRenderState = exports.ReviewCommentRenderState || (exports.ReviewCommentRenderState = {}));
var ReviewCommentStatus;
(function (ReviewCommentStatus) {
    ReviewCommentStatus[ReviewCommentStatus["active"] = 1] = "active";
    ReviewCommentStatus[ReviewCommentStatus["deleted"] = 2] = "deleted";
    ReviewCommentStatus[ReviewCommentStatus["edit"] = 3] = "edit";
})(ReviewCommentStatus = exports.ReviewCommentStatus || (exports.ReviewCommentStatus = {}));
function reduceComments(actions, state) {
    if (state === void 0) { state = null; }
    state = state || { comments: {}, viewZoneIdsToDelete: [] };
    for (var _i = 0, actions_1 = actions; _i < actions_1.length; _i++) {
        var a = actions_1[_i];
        if (!a.id) {
            a.id = uuid();
        }
        state = commentReducer(a, state);
    }
    return state;
}
exports.reduceComments = reduceComments;


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
var events_reducers_1 = __webpack_require__(/*! ./events-reducers */ "./src/events-reducers.ts");
var uuid = __webpack_require__(/*! uuid/v4 */ "./node_modules/uuid/v4.js");
var monacoWindow = window;
var NavigationDirection;
(function (NavigationDirection) {
    NavigationDirection[NavigationDirection["next"] = 1] = "next";
    NavigationDirection[NavigationDirection["prev"] = 2] = "prev";
})(NavigationDirection || (NavigationDirection = {}));
var EditorMode;
(function (EditorMode) {
    EditorMode[EditorMode["insertComment"] = 1] = "insertComment";
    EditorMode[EditorMode["editComment"] = 2] = "editComment";
    EditorMode[EditorMode["toolbar"] = 3] = "toolbar";
})(EditorMode = exports.EditorMode || (exports.EditorMode = {}));
function createReviewManager(editor, currentUser, actions, onChange, config, verbose) {
    //For Debug: (window as any).editor = editor;
    var rm = new ReviewManager(editor, currentUser, onChange, config, verbose);
    rm.load(actions || []);
    return rm;
}
exports.createReviewManager = createReviewManager;
var defaultReviewManagerConfig = {
    verticalOffset: 0,
    editButtonOffset: '-10px',
    editButtonAddText: 'Reply',
    editButtonRemoveText: 'Remove',
    editButtonEditText: 'Edit',
    editButtonEnableRemove: true,
    editButtonEnableEdit: true,
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
    function ReviewManager(editor, currentUser, onChange, config, verbose) {
        var _this = this;
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = null; //TODO - consider moving onto the store
        this.widgetInlineToolbar = null;
        this.widgetInlineCommentEditor = null;
        this.onChange = onChange;
        this.editorMode = EditorMode.toolbar;
        this.config = __assign(__assign({}, defaultReviewManagerConfig), (config || {}));
        this.currentLineDecorations = [];
        this.currentCommentDecorations = [];
        this.currentLineDecorationLineNumber = null;
        this.events = [];
        this.store = { comments: {}, viewZoneIdsToDelete: [] };
        this.verbose = verbose;
        this.editorConfig = this.editor.getConfiguration();
        this.editor.onDidChangeConfiguration(function () { return _this.editorConfig = _this.editor.getConfiguration(); });
        this.editor.onMouseDown(this.handleMouseDown.bind(this));
        this.inlineToolbarElements = this.createInlineToolbarWidget();
        this.editorElements = this.createInlineEditorWidget();
        this.addActions();
        if (this.config.showAddCommentGlyph) {
            this.editor.onMouseMove(this.handleMouseMove.bind(this));
        }
    }
    ReviewManager.prototype.load = function (events) {
        var _this = this;
        this.editor.changeViewZones(function (changeAccessor) {
            // Remove all the existing comments     
            for (var _i = 0, _a = Object.values(_this.store.comments); _i < _a.length; _i++) {
                var viewState = _a[_i];
                if (viewState.viewZoneId !== null) {
                    changeAccessor.removeZone(viewState.viewZoneId);
                }
            }
            _this.events = events;
            _this.store = events_reducers_1.reduceComments(events);
            _this.refreshComments();
            _this.verbose && console.debug('Events Loaded:', events.length, 'Review Comments:', Object.values(_this.store.comments).length);
        });
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
        add.onclick = function () { return _this.setEditorMode(EditorMode.insertComment); };
        root.appendChild(add);
        var remove = null;
        var edit = null;
        var spacer = null;
        if (this.config.editButtonEnableRemove) {
            spacer = document.createElement('div');
            spacer.innerText = '&nbsp;';
            root.appendChild(spacer);
            remove = document.createElement('span');
            remove.setAttribute(CONTROL_ATTR_NAME, '');
            remove.innerText = this.config.editButtonRemoveText;
            remove.className = 'editButton remove';
            remove.onclick = function () { return _this.activeComment && _this.removeComment(_this.activeComment.id); };
            root.appendChild(remove);
        }
        if (this.config.editButtonEnableEdit) {
            spacer = document.createElement('div');
            spacer.innerText = '&nbsp;';
            root.appendChild(spacer);
            edit = document.createElement('span');
            edit.setAttribute(CONTROL_ATTR_NAME, '');
            edit.innerText = this.config.editButtonEditText;
            edit.className = 'editButton edit';
            edit.onclick = function () { return _this.setEditorMode(EditorMode.editComment); };
            root.appendChild(edit);
        }
        return { root: root, add: add, remove: remove, edit: edit };
    };
    ReviewManager.prototype.handleCancel = function () {
        this.setEditorMode(EditorMode.toolbar);
        this.editor.focus();
    };
    ReviewManager.prototype.handleAddComment = function () {
        var lineNumber = this.activeComment ? this.activeComment.lineNumber : this.editor.getSelection().endLineNumber;
        var text = this.editorElements.textarea.value;
        var selection = this.activeComment ? null : this.editor.getSelection();
        this.addComment(lineNumber, text, selection);
        this.setEditorMode(EditorMode.toolbar);
        this.editor.focus();
    };
    ReviewManager.prototype.handleTextAreaKeyDown = function (e) {
        if (e.code === "Escape") {
            this.handleCancel();
            e.preventDefault();
            console.info('preventDefault: Escape Key');
        }
        else if (e.code === "Enter" && e.ctrlKey) {
            this.handleAddComment();
            e.preventDefault();
            console.info('preventDefault: ctrl+Enter');
        }
    };
    ReviewManager.prototype.createInlineEditorElement = function () {
        var root = document.createElement('span');
        root.className = "reviewCommentEditor";
        var textarea = document.createElement('textarea');
        textarea.setAttribute(CONTROL_ATTR_NAME, '');
        textarea.className = "reviewCommentEditor text";
        textarea.innerText = '';
        textarea.style.resize = "none";
        textarea.name = 'text';
        textarea.onkeydown = this.handleTextAreaKeyDown.bind(this);
        var confirm = document.createElement('button');
        confirm.setAttribute(CONTROL_ATTR_NAME, '');
        confirm.className = "reviewCommentEditor save";
        confirm.style.fontFamily = "Consolas";
        confirm.innerText = 'Add Comment';
        confirm.onclick = this.handleAddComment.bind(this);
        var cancel = document.createElement('button');
        cancel.setAttribute(CONTROL_ATTR_NAME, '');
        cancel.className = "reviewCommentEditor cancel";
        cancel.innerText = 'Cancel';
        cancel.onclick = this.handleCancel.bind(this);
        root.appendChild(textarea);
        root.appendChild(cancel);
        root.appendChild(confirm);
        return { root: root, confirm: confirm, cancel: cancel, textarea: textarea };
    };
    ReviewManager.prototype.createInlineToolbarWidget = function () {
        var buttonsElement = this.createInlineEditButtonsElement();
        var this_ = this;
        this.widgetInlineToolbar = {
            allowEditorOverflow: true,
            getId: function () {
                return 'widgetInlineToolbar';
            },
            getDomNode: function () {
                return buttonsElement.root;
            },
            getPosition: function () {
                if (this_.activeComment && this_.editorMode == EditorMode.toolbar) {
                    return {
                        position: {
                            lineNumber: this_.activeComment.lineNumber,
                            column: 1
                        },
                        preference: [POSITION_BELOW]
                    };
                }
            }
        };
        this.editor.addContentWidget(this.widgetInlineToolbar);
        return buttonsElement;
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
                return editorElement.root;
            },
            getPosition: function () {
                if (_this.editorMode == EditorMode.insertComment || _this.editorMode == EditorMode.editComment) {
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
        return editorElement;
    };
    ReviewManager.prototype.setActiveComment = function (comment) {
        var _this = this;
        this.verbose && console.debug('setActiveComment', comment);
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
                _this.store.comments[comment.id].renderStatus = events_reducers_1.ReviewCommentRenderState.dirty;
            });
        }
    };
    ReviewManager.prototype.filterAndMapComments = function (lineNumbers, fn) {
        for (var _i = 0, _a = Object.values(this.store.comments); _i < _a.length; _i++) {
            var cs = _a[_i];
            if (lineNumbers.indexOf(cs.comment.lineNumber) > -1) {
                fn(cs.comment);
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
            this.setEditorMode(EditorMode.insertComment);
        }
        else if (!ev.target.element.hasAttribute(CONTROL_ATTR_NAME)) {
            var activeComment = null;
            if (ev.target.detail && ev.target.detail.viewZoneId !== null) {
                for (var _i = 0, _a = Object.values(this.store.comments).map(function (c) { return c.comment; }); _i < _a.length; _i++) {
                    var comment = _a[_i];
                    var viewState = this.store.comments[comment.id];
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
    ReviewManager.prototype.calculateMarginTopOffset = function (includeActiveCommentHeight) {
        var count = 0;
        var marginTop = 0;
        var lineHeight = this.editorConfig.fontInfo.lineHeight;
        if (this.activeComment) {
            for (var _i = 0, _a = this.iterateComments(); _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.state.comment.lineNumber === this.activeComment.lineNumber &&
                    (item.state.comment != this.activeComment || includeActiveCommentHeight)) {
                    count += events_reducers_1.calculateNumberOfLines(item.state.comment.text);
                }
                if (item.state.comment == this.activeComment) {
                    break;
                }
            }
            marginTop = count * lineHeight;
        }
        var result = marginTop + this.config.verticalOffset;
        return result;
    };
    ReviewManager.prototype.layoutInlineToolbar = function () {
        var _this = this;
        this.inlineToolbarElements.root.style.backgroundColor = this.getThemedColor("editor.background");
        this.inlineToolbarElements.root.style.marginTop = this.calculateMarginTopOffset(false) + "px";
        if (this.inlineToolbarElements.remove) {
            var hasChildren = this.activeComment && this.iterateComments(function (c) { return c.comment.id === _this.activeComment.id; }).length > 1;
            var isSameUser = this.activeComment && this.activeComment.author === this.currentUser;
            this.inlineToolbarElements.remove.style.display = hasChildren ? 'none' : '';
            this.inlineToolbarElements.edit.style.display = hasChildren || !isSameUser ? 'none' : '';
        }
        this.editor.layoutContentWidget(this.widgetInlineToolbar);
    };
    ReviewManager.prototype.layoutInlineCommentEditor = function () {
        var _this = this;
        [this.editorElements.root, this.editorElements.textarea].forEach(function (e) {
            e.style.backgroundColor = _this.getThemedColor("editor.background");
            e.style.color = _this.getThemedColor("editor.foreground");
        });
        [this.editorElements.confirm, this.editorElements.cancel]
            .forEach(function (button) {
            button.style.backgroundColor = _this.getThemedColor("button.background");
            button.style.color = _this.getThemedColor("button.foreground");
        });
        this.editorElements.confirm.innerText = this.editorMode === EditorMode.insertComment ? "Add Comment" : "Edit Comment";
        this.editorElements.root.style.marginTop = this.calculateMarginTopOffset(true) + "px";
        this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
    };
    ReviewManager.prototype.setEditorMode = function (mode) {
        var _this = this;
        console.debug('setEditorMode', EditorMode[mode], this.activeComment);
        this.editorMode = mode;
        this.layoutInlineCommentEditor();
        this.layoutInlineToolbar();
        if (mode == EditorMode.insertComment || mode == EditorMode.editComment) {
            if (mode == EditorMode.insertComment) {
                this.editorElements.textarea.value = "";
            }
            else if (mode == EditorMode.editComment) {
                this.editorElements.textarea.value = this.activeComment.text;
            }
            //HACK - because the event in monaco doesn't have preventdefault which means editor takes focus back...                        
            setTimeout(function () { return _this.editorElements.textarea.focus(); }, 100); //TODO - make configurable
        }
    };
    ReviewManager.prototype.getDateTimeNow = function () {
        return new Date();
    };
    ReviewManager.prototype.recurseComments = function (allComments, filterFn, depth, results) {
        var comments = Object.values(allComments).filter(filterFn);
        var _loop_1 = function (cs) {
            var comment = cs.comment;
            delete allComments[comment.id];
            results.push({
                depth: depth,
                state: cs
            });
            this_1.recurseComments(allComments, function (x) { return x.comment.parentId === comment.id; }, depth + 1, results);
        };
        var this_1 = this;
        for (var _i = 0, comments_1 = comments; _i < comments_1.length; _i++) {
            var cs = comments_1[_i];
            _loop_1(cs);
        }
    };
    ReviewManager.prototype.iterateComments = function (filterFn) {
        if (!filterFn) {
            filterFn = function (cs) { return !cs.comment.parentId; };
        }
        var copyCommentState = __assign({}, this.store.comments);
        var results = [];
        this.recurseComments(copyCommentState, filterFn, 0, results);
        return results;
    };
    ReviewManager.prototype.removeComment = function (id) {
        return this.addEvent({ type: "delete", targetId: id });
    };
    ReviewManager.prototype.addComment = function (lineNumber, text, selection) {
        var event = this.editorMode === EditorMode.editComment ?
            { type: "edit", text: text, targetId: this.activeComment.id }
            : { type: "create", text: text, lineNumber: lineNumber, selection: selection, targetId: this.activeComment && this.activeComment.id };
        return this.addEvent(event);
    };
    ReviewManager.prototype.addEvent = function (event) {
        event.createdBy = this.currentUser;
        event.createdAt = this.getDateTimeNow();
        event.id = uuid();
        this.events.push(event);
        this.store = events_reducers_1.commentReducer(event, this.store);
        if (this.activeComment && !this.store.comments[this.activeComment.id]) {
            this.setActiveComment(null);
        }
        else if (this.activeComment && this.activeComment.status === events_reducers_1.ReviewCommentStatus.deleted) {
            this.setActiveComment(null);
            console.log('Clearing active comment');
        }
        this.refreshComments();
        this.layoutInlineToolbar();
        if (this.onChange) {
            this.onChange(this.events);
        }
        return event;
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
    ReviewManager.prototype.createElement = function (text, className, tagName) {
        if (tagName === void 0) { tagName = null; }
        var span = document.createElement(tagName || 'span');
        span.className = className;
        span.innerText = text;
        return span;
    };
    ReviewManager.prototype.refreshComments = function () {
        var _this = this;
        this.editor.changeViewZones(function (changeAccessor) {
            var lineNumbers = {};
            while (_this.store.viewZoneIdsToDelete.length > 0) {
                var viewZoneId = _this.store.viewZoneIdsToDelete.pop();
                changeAccessor.removeZone(viewZoneId);
                _this.verbose && console.debug('Zone.Delete', viewZoneId);
            }
            for (var _i = 0, _a = _this.iterateComments(); _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.state.renderStatus === events_reducers_1.ReviewCommentRenderState.hidden) {
                    _this.verbose && console.debug('Zone.Hidden', item.state.comment.id);
                    changeAccessor.removeZone(item.state.viewZoneId);
                    item.state.viewZoneId = null;
                    continue;
                }
                if (item.state.renderStatus === events_reducers_1.ReviewCommentRenderState.dirty) {
                    _this.verbose && console.debug('Zone.Dirty', item.state.comment.id);
                    changeAccessor.removeZone(item.state.viewZoneId);
                    item.state.viewZoneId = null;
                    item.state.renderStatus = events_reducers_1.ReviewCommentRenderState.normal;
                }
                if (!lineNumbers[item.state.comment.lineNumber]) {
                    lineNumbers[item.state.comment.lineNumber] = item.state.comment.selection;
                }
                if (item.state.viewZoneId == null) {
                    _this.verbose && console.debug('Zone.Create', item.state.comment.id);
                    var isActive = _this.activeComment == item.state.comment;
                    var domNode = _this.createElement("", "reviewComment " + (isActive ? 'active' : ' inactive'));
                    domNode.style.marginLeft = (_this.config.commentIndent * (item.depth + 1)) + _this.config.commentIndentOffset + "px";
                    domNode.style.backgroundColor = _this.getThemedColor("editor.selectionHighlightBackground");
                    // For Debug - domNode.appendChild(this.createElement(`${item.state.comment.id}`, 'reviewComment id'))
                    domNode.appendChild(_this.createElement((item.state.comment.author || ' ') + " at ", 'reviewComment author'));
                    domNode.appendChild(_this.createElement(_this.formatDate(item.state.comment.dt), 'reviewComment dt'));
                    if (item.state.history.length > 1) {
                        domNode.appendChild(_this.createElement("(Edited " + (item.state.history.length - 1) + " times)", 'reviewComment history'));
                    }
                    domNode.appendChild(_this.createElement("" + item.state.comment.text, 'reviewComment text', 'div'));
                    item.state.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: item.state.comment.lineNumber,
                        heightInLines: item.state.numberOfLines,
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
                _this.setEditorMode(EditorMode.insertComment);
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
        var comments = Object.values(this.store.comments).map(function (cs) { return cs.comment; }).filter(function (c) {
            if (!c.parentId) {
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


/***/ })

/******/ });