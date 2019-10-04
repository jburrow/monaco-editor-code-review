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

Object.defineProperty(exports, "__esModule", { value: true });
const uuid = __webpack_require__(/*! uuid/v4 */ "./node_modules/uuid/v4.js");
;
function commentReducer(event, state) {
    const dirtyLineNumbers = new Set();
    switch (event.type) {
        case "edit":
            const parent = state.comments[event.targetId];
            if (!parent)
                break;
            parent.comment = Object.assign(Object.assign({}, parent.comment), { author: event.createdBy, dt: event.createdAt, text: event.text });
            parent.history.push(parent.comment);
            parent.numberOfLines = calculateNumberOfLines(event.text);
            dirtyLineNumbers.add(parent.comment.lineNumber);
            console.log('edit', event);
            break;
        case "delete":
            const selected = state.comments[event.targetId];
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
        for (const cs of Object.values(state.comments)) {
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
class ReviewCommentState {
    constructor(comment, numberOfLines) {
        this.renderStatus = ReviewCommentRenderState.normal;
        this.viewZoneId = null;
        this.comment = comment;
        this.numberOfLines = numberOfLines;
        this.history = [comment];
    }
}
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
function reduceComments(actions, state = null) {
    state = state || { comments: {}, viewZoneIdsToDelete: [] };
    for (const a of actions) {
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

Object.defineProperty(exports, "__esModule", { value: true });
const events_reducers_1 = __webpack_require__(/*! ./events-reducers */ "./src/events-reducers.ts");
const uuid = __webpack_require__(/*! uuid/v4 */ "./node_modules/uuid/v4.js");
const monacoWindow = window;
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
    const rm = new ReviewManager(editor, currentUser, onChange, config, verbose);
    rm.load(actions || []);
    return rm;
}
exports.createReviewManager = createReviewManager;
const defaultReviewManagerConfig = {
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
const CONTROL_ATTR_NAME = 'ReviewManagerControl';
const POSITION_BELOW = 2; //above=1, below=2, exact=0
class ReviewManager {
    constructor(editor, currentUser, onChange, config, verbose) {
        this.currentUser = currentUser;
        this.editor = editor;
        this.activeComment = null; //TODO - consider moving onto the store
        this.widgetInlineToolbar = null;
        this.widgetInlineCommentEditor = null;
        this.onChange = onChange;
        this.editorMode = EditorMode.toolbar;
        this.config = Object.assign(Object.assign({}, defaultReviewManagerConfig), (config || {}));
        this.currentLineDecorations = [];
        this.currentCommentDecorations = [];
        this.currentLineDecorationLineNumber = null;
        this.events = [];
        this.store = { comments: {}, viewZoneIdsToDelete: [] };
        this.verbose = verbose;
        this.editorConfig = this.editor.getConfiguration();
        this.editor.onDidChangeConfiguration(() => this.editorConfig = this.editor.getConfiguration());
        this.editor.onMouseDown(this.handleMouseDown.bind(this));
        this.inlineToolbarElements = this.createInlineToolbarWidget();
        this.editorElements = this.createInlineEditorWidget();
        this.addActions();
        if (this.config.showAddCommentGlyph) {
            this.editor.onMouseMove(this.handleMouseMove.bind(this));
        }
    }
    load(events) {
        this.editor.changeViewZones((changeAccessor) => {
            // Remove all the existing comments     
            for (const viewState of Object.values(this.store.comments)) {
                if (viewState.viewZoneId !== null) {
                    changeAccessor.removeZone(viewState.viewZoneId);
                }
            }
            this.events = events;
            this.store = events_reducers_1.reduceComments(events);
            this.refreshComments();
            this.verbose && console.debug('Events Loaded:', events.length, 'Review Comments:', Object.values(this.store.comments).length);
        });
    }
    getThemedColor(name) {
        // editor.background: e {rgba: e}
        // editor.foreground: e {rgba: e}
        // editor.inactiveSelectionBackground: e {rgba: e}
        // editor.selectionHighlightBackground: e {rgba: e}
        // editorIndentGuide.activeBackground: e {rgba: e}
        // editorIndentGuide.background: e {rgba: e}
        const theme = this.editor._themeService.getTheme();
        let value = theme.getColor(name);
        // HACK - Buttons themes are not in monaco ... so just hack in theme for dark
        const missingThemes = {
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
    }
    createInlineEditButtonsElement() {
        var root = document.createElement('div');
        root.className = 'editButtonsContainer';
        root.style.marginLeft = this.config.editButtonOffset;
        const add = document.createElement('span');
        add.innerText = this.config.editButtonAddText;
        add.className = 'editButton add';
        add.setAttribute(CONTROL_ATTR_NAME, '');
        add.onclick = () => this.setEditorMode(EditorMode.insertComment);
        root.appendChild(add);
        let remove = null;
        let edit = null;
        let spacer = null;
        if (this.config.editButtonEnableRemove) {
            spacer = document.createElement('div');
            spacer.innerText = '&nbsp;';
            root.appendChild(spacer);
            remove = document.createElement('span');
            remove.setAttribute(CONTROL_ATTR_NAME, '');
            remove.innerText = this.config.editButtonRemoveText;
            remove.className = 'editButton remove';
            remove.onclick = () => this.activeComment && this.removeComment(this.activeComment.id);
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
            edit.onclick = () => this.setEditorMode(EditorMode.editComment);
            root.appendChild(edit);
        }
        return { root, add, remove, edit };
    }
    handleCancel() {
        this.setEditorMode(EditorMode.toolbar);
        this.editor.focus();
    }
    handleAddComment() {
        const lineNumber = this.activeComment ? this.activeComment.lineNumber : this.editor.getSelection().endLineNumber;
        const text = this.editorElements.textarea.value;
        const selection = this.activeComment ? null : this.editor.getSelection();
        this.addComment(lineNumber, text, selection);
        this.setEditorMode(EditorMode.toolbar);
        this.editor.focus();
    }
    handleTextAreaKeyDown(e) {
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
    }
    createInlineEditorElement() {
        var root = document.createElement('span');
        root.className = "reviewCommentEditor";
        const textarea = document.createElement('textarea');
        textarea.setAttribute(CONTROL_ATTR_NAME, '');
        textarea.className = "reviewCommentEditor text";
        textarea.innerText = '';
        textarea.style.resize = "none";
        textarea.name = 'text';
        textarea.onkeydown = this.handleTextAreaKeyDown.bind(this);
        const confirm = document.createElement('button');
        confirm.setAttribute(CONTROL_ATTR_NAME, '');
        confirm.className = "reviewCommentEditor save";
        confirm.style.fontFamily = "Consolas";
        confirm.innerText = 'Add Comment';
        confirm.onclick = this.handleAddComment.bind(this);
        const cancel = document.createElement('button');
        cancel.setAttribute(CONTROL_ATTR_NAME, '');
        cancel.className = "reviewCommentEditor cancel";
        cancel.innerText = 'Cancel';
        cancel.onclick = this.handleCancel.bind(this);
        root.appendChild(textarea);
        root.appendChild(cancel);
        root.appendChild(confirm);
        return { root, confirm, cancel, textarea };
    }
    createInlineToolbarWidget() {
        const buttonsElement = this.createInlineEditButtonsElement();
        const this_ = this;
        this.widgetInlineToolbar = {
            allowEditorOverflow: true,
            getId: () => {
                return 'widgetInlineToolbar';
            },
            getDomNode: () => {
                return buttonsElement.root;
            },
            getPosition: () => {
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
    }
    createInlineEditorWidget() {
        // doesn't re-theme when
        const editorElement = this.createInlineEditorElement();
        this.widgetInlineCommentEditor = {
            allowEditorOverflow: true,
            getId: () => {
                return 'widgetInlineEditor';
            },
            getDomNode: () => {
                return editorElement.root;
            },
            getPosition: () => {
                if (this.editorMode == EditorMode.insertComment || this.editorMode == EditorMode.editComment) {
                    return {
                        position: {
                            lineNumber: this.activeComment ? this.activeComment.lineNumber : this.editor.getPosition().lineNumber + 1,
                            column: 1
                        },
                        preference: [POSITION_BELOW]
                    };
                }
            }
        };
        this.editor.addContentWidget(this.widgetInlineCommentEditor);
        return editorElement;
    }
    setActiveComment(comment) {
        this.verbose && console.debug('setActiveComment', comment);
        const lineNumbersToMakeDirty = [];
        if (this.activeComment && (!comment || this.activeComment.lineNumber !== comment.lineNumber)) {
            lineNumbersToMakeDirty.push(this.activeComment.lineNumber);
        }
        if (comment) {
            lineNumbersToMakeDirty.push(comment.lineNumber);
        }
        this.activeComment = comment;
        if (lineNumbersToMakeDirty.length > 0) {
            this.filterAndMapComments(lineNumbersToMakeDirty, (comment) => {
                this.store.comments[comment.id].renderStatus = events_reducers_1.ReviewCommentRenderState.dirty;
            });
        }
    }
    filterAndMapComments(lineNumbers, fn) {
        for (const cs of Object.values(this.store.comments)) {
            if (lineNumbers.indexOf(cs.comment.lineNumber) > -1) {
                fn(cs.comment);
            }
        }
    }
    handleMouseMove(ev) {
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
    }
    handleMouseDown(ev) {
        // Not ideal - but couldn't figure out a different way to identify the glyph event        
        if (ev.target.element.className && ev.target.element.className.indexOf('activeLineMarginClass') > -1) {
            this.editor.setPosition({
                lineNumber: this.currentLineDecorationLineNumber,
                column: 1
            });
            this.setEditorMode(EditorMode.insertComment);
        }
        else if (!ev.target.element.hasAttribute(CONTROL_ATTR_NAME)) {
            let activeComment = null;
            if (ev.target.detail && ev.target.detail.viewZoneId !== null) {
                for (const comment of Object.values(this.store.comments).map(c => c.comment)) {
                    const viewState = this.store.comments[comment.id];
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
    }
    calculateMarginTopOffset(includeActiveCommentHeight) {
        let count = 0;
        let marginTop = 0;
        const lineHeight = this.editorConfig.fontInfo.lineHeight;
        if (this.activeComment) {
            for (var item of this.iterateComments()) {
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
        const result = marginTop + this.config.verticalOffset;
        return result;
    }
    layoutInlineToolbar() {
        this.inlineToolbarElements.root.style.backgroundColor = this.getThemedColor("editor.background");
        this.inlineToolbarElements.root.style.marginTop = `${this.calculateMarginTopOffset(false)}px`;
        if (this.inlineToolbarElements.remove) {
            const hasChildren = this.activeComment && this.iterateComments((c) => c.comment.id === this.activeComment.id).length > 1;
            const isSameUser = this.activeComment && this.activeComment.author === this.currentUser;
            this.inlineToolbarElements.remove.style.display = hasChildren ? 'none' : '';
            this.inlineToolbarElements.edit.style.display = hasChildren || !isSameUser ? 'none' : '';
        }
        this.editor.layoutContentWidget(this.widgetInlineToolbar);
    }
    layoutInlineCommentEditor() {
        [this.editorElements.root, this.editorElements.textarea].forEach(e => {
            e.style.backgroundColor = this.getThemedColor("editor.background");
            e.style.color = this.getThemedColor("editor.foreground");
        });
        [this.editorElements.confirm, this.editorElements.cancel]
            .forEach((button) => {
            button.style.backgroundColor = this.getThemedColor("button.background");
            button.style.color = this.getThemedColor("button.foreground");
        });
        this.editorElements.confirm.innerText = this.editorMode === EditorMode.insertComment ? "Add Comment" : "Edit Comment";
        this.editorElements.root.style.marginTop = `${this.calculateMarginTopOffset(true)}px`;
        this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
    }
    setEditorMode(mode) {
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
            setTimeout(() => this.editorElements.textarea.focus(), 100); //TODO - make configurable
        }
    }
    getDateTimeNow() {
        return new Date();
    }
    recurseComments(allComments, filterFn, depth, results) {
        const comments = Object.values(allComments).filter(filterFn);
        for (const cs of comments) {
            const comment = cs.comment;
            delete allComments[comment.id];
            results.push({
                depth,
                state: cs
            });
            this.recurseComments(allComments, (x) => x.comment.parentId === comment.id, depth + 1, results);
        }
    }
    iterateComments(filterFn) {
        if (!filterFn) {
            filterFn = (cs) => !cs.comment.parentId;
        }
        const copyCommentState = Object.assign({}, this.store.comments);
        const results = [];
        this.recurseComments(copyCommentState, filterFn, 0, results);
        return results;
    }
    removeComment(id) {
        return this.addEvent({ type: "delete", targetId: id });
    }
    addComment(lineNumber, text, selection) {
        const event = this.editorMode === EditorMode.editComment ?
            { type: "edit", text, targetId: this.activeComment.id }
            : { type: "create", text, lineNumber, selection, targetId: this.activeComment && this.activeComment.id };
        return this.addEvent(event);
    }
    addEvent(event) {
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
    }
    formatDate(dt) {
        if (this.config.formatDate) {
            return this.config.formatDate(dt);
        }
        else if (dt instanceof Date) {
            return dt.toISOString();
        }
        else {
            return dt;
        }
    }
    createElement(text, className, tagName = null) {
        const span = document.createElement(tagName || 'span');
        span.className = className;
        span.innerText = text;
        return span;
    }
    refreshComments() {
        this.editor.changeViewZones((changeAccessor) => {
            const lineNumbers = {};
            while (this.store.viewZoneIdsToDelete.length > 0) {
                const viewZoneId = this.store.viewZoneIdsToDelete.pop();
                changeAccessor.removeZone(viewZoneId);
                this.verbose && console.debug('Zone.Delete', viewZoneId);
            }
            for (const item of this.iterateComments()) {
                if (item.state.renderStatus === events_reducers_1.ReviewCommentRenderState.hidden) {
                    this.verbose && console.debug('Zone.Hidden', item.state.comment.id);
                    changeAccessor.removeZone(item.state.viewZoneId);
                    item.state.viewZoneId = null;
                    continue;
                }
                if (item.state.renderStatus === events_reducers_1.ReviewCommentRenderState.dirty) {
                    this.verbose && console.debug('Zone.Dirty', item.state.comment.id);
                    changeAccessor.removeZone(item.state.viewZoneId);
                    item.state.viewZoneId = null;
                    item.state.renderStatus = events_reducers_1.ReviewCommentRenderState.normal;
                }
                if (!lineNumbers[item.state.comment.lineNumber]) {
                    lineNumbers[item.state.comment.lineNumber] = item.state.comment.selection;
                }
                if (item.state.viewZoneId == null) {
                    this.verbose && console.debug('Zone.Create', item.state.comment.id);
                    const isActive = this.activeComment == item.state.comment;
                    const domNode = this.createElement("", `reviewComment ${isActive ? 'active' : ' inactive'}`);
                    domNode.style.marginLeft = (this.config.commentIndent * (item.depth + 1)) + this.config.commentIndentOffset + "px";
                    domNode.style.backgroundColor = this.getThemedColor("editor.selectionHighlightBackground");
                    // For Debug - domNode.appendChild(this.createElement(`${item.state.comment.id}`, 'reviewComment id'))
                    domNode.appendChild(this.createElement(`${item.state.comment.author || ' '} at `, 'reviewComment author'));
                    domNode.appendChild(this.createElement(this.formatDate(item.state.comment.dt), 'reviewComment dt'));
                    if (item.state.history.length > 1) {
                        domNode.appendChild(this.createElement(`(Edited ${item.state.history.length - 1} times)`, 'reviewComment history'));
                    }
                    domNode.appendChild(this.createElement(`${item.state.comment.text}`, 'reviewComment text', 'div'));
                    item.state.viewZoneId = changeAccessor.addZone({
                        afterLineNumber: item.state.comment.lineNumber,
                        heightInLines: item.state.numberOfLines,
                        domNode: domNode,
                        suppressMouseDown: true // This stops focus being lost the editor - meaning keyboard shortcuts keeps working
                    });
                }
            }
            if (this.config.showInRuler) {
                const decorators = [];
                for (const [ln, selection] of Object.entries(lineNumbers)) {
                    decorators.push({
                        range: new monacoWindow.monaco.Range(ln, 0, ln, 0),
                        options: {
                            isWholeLine: true,
                            overviewRuler: {
                                color: this.config.rulerMarkerColor,
                                darkColor: this.config.rulerMarkerDarkColor,
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
                this.currentCommentDecorations = this.editor.deltaDecorations(this.currentCommentDecorations, decorators);
            }
        });
    }
    addActions() {
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
            run: () => {
                this.setEditorMode(EditorMode.insertComment);
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
            run: () => {
                this.navigateToComment(NavigationDirection.next);
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
            run: () => {
                this.navigateToComment(NavigationDirection.prev);
            }
        });
    }
    navigateToComment(direction) {
        let currentLine = 0;
        if (this.activeComment) {
            currentLine = this.activeComment.lineNumber;
        }
        else {
            currentLine = this.editor.getPosition().lineNumber;
        }
        const comments = Object.values(this.store.comments).map(cs => cs.comment).filter((c) => {
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
            comments.sort((a, b) => {
                if (direction === NavigationDirection.next) {
                    return a.lineNumber - b.lineNumber;
                }
                else if (direction === NavigationDirection.prev) {
                    return b.lineNumber - a.lineNumber;
                }
            });
            const comment = comments[0];
            this.setActiveComment(comment);
            this.refreshComments();
            this.layoutInlineToolbar();
            this.editor.revealLineInCenter(comment.lineNumber);
        }
    }
}
exports.ReviewManager = ReviewManager;


/***/ })

/******/ });