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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/docs.ts");
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

/***/ "./src/docs.ts":
/*!*********************!*\
  !*** ./src/docs.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = __webpack_require__(/*! ./index */ "./src/index.ts");
var win = window;
var reviewManager = null;
var currentMode = '';
var currentEditor = null;
var theme = 'vs-dark';
function ensureMonacoIsAvailable() {
    return new Promise(function (resolve) {
        if (!win.require) {
            console.warn("Unable to find a local node_modules folder - so dynamically using cdn instead");
            var prefix = "https://microsoft.github.io/monaco-editor";
            var scriptTag = document.createElement("script");
            scriptTag.src = prefix + "/node_modules/monaco-editor/min/vs/loader.js";
            scriptTag.onload = function () {
                console.debug("Monaco loader is initialized");
                resolve(prefix);
            };
            document.body.appendChild(scriptTag);
        }
        else {
            resolve("..");
        }
    });
}
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}
function setView(mode) {
    var idx = getRandomInt((exampleSourceCode.length) / 2) * 2;
    currentMode = mode;
    document.getElementById("containerEditor").innerHTML = "";
    if (mode.startsWith("standard")) {
        currentEditor = win.monaco.editor.create(document.getElementById("containerEditor"), {
            value: exampleSourceCode[idx],
            language: "typescript",
            glyphMargin: true,
            contextmenu: true,
            automaticLayout: true,
            readOnly: mode === "standard-readonly",
            theme: theme
        });
        initReviewManager(currentEditor);
    }
    else {
        var originalModel = win.monaco.editor.createModel(exampleSourceCode[idx], "typescript");
        var modifiedModel = win.monaco.editor.createModel(exampleSourceCode[idx + 1], "typescript");
        currentEditor = win.monaco.editor.createDiffEditor(document.getElementById("containerEditor"), { renderSideBySide: mode !== "inline" });
        currentEditor.setModel({
            original: originalModel,
            modified: modifiedModel
        });
        initReviewManager(currentEditor.modifiedEditor);
    }
}
function generateDifferentContents() {
    var idx = getRandomInt((exampleSourceCode.length) / 2) * 2;
    if (currentMode.startsWith("standard")) {
        currentEditor.setValue(exampleSourceCode[idx]);
    }
    else {
        currentEditor.getModel().modified.setValue(exampleSourceCode[idx]);
        currentEditor.getModel().modified.setValue(exampleSourceCode[idx + 1]);
    }
}
var exampleSourceCode = [];
function fetchSourceCode(url) {
    return __awaiter(this, void 0, void 0, function () {
        var response, exampleText, modifiedText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    exampleText = _a.sent();
                    modifiedText = exampleText.replace(new RegExp("string", "g"), "string /* String!*/");
                    exampleSourceCode.push(url + '\n' + exampleText);
                    exampleSourceCode.push(url + '\n' + modifiedText);
                    return [2 /*return*/];
            }
        });
    });
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var prefix, response, tsobj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ensureMonacoIsAvailable()];
                case 1:
                    prefix = _a.sent();
                    return [4 /*yield*/, fetchSourceCode("../src/index.ts")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fetchSourceCode("../src/docs.ts")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, fetchSourceCode("../src/index.test.ts")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, fetch("../dist/timestamp.json")];
                case 5:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 6:
                    tsobj = _a.sent();
                    console.log("Compiled at:", tsobj.date);
                    win.require.config({
                        paths: { vs: prefix + "/node_modules/monaco-editor/min/vs" }
                    });
                    win.require(["vs/editor/editor.main"], function () {
                        setView("standard");
                    });
                    return [2 /*return*/];
            }
        });
    });
}
function initReviewManager(editor) {
    var summaryDiv = document.getElementById("summaryEditor");
    reviewManager = index_1.createReviewManager(editor, "mr reviewer", createRandomComments(), function (updatedComments) { return renderComments(summaryDiv, updatedComments); }, { editButtonEnableRemove: true });
    renderComments(summaryDiv, reviewManager.comments);
}
function toggleTheme() {
    theme = theme == 'vs' ? 'vs-dark' : 'vs';
    win.monaco.editor.setTheme(theme);
}
function generateDifferentComments() {
    reviewManager.load(createRandomComments());
}
function createRandomComments() {
    var firstLine = Math.floor(Math.random() * 10);
    return [
        {
            id: "id-0",
            lineNumber: firstLine + 1,
            author: "another reviewer",
            dt: new Date(),
            text: "at start"
        },
        {
            id: "id-2",
            lineNumber: firstLine + 50,
            author: "another reviewer",
            dt: new Date(),
            text: "at start"
        },
        {
            lineNumber: firstLine + 5,
            author: "another reviewer",
            dt: '2019-01-01 12:22:33',
            text: "this code isn't very good",
            comments: [
                {
                    lineNumber: firstLine + 5,
                    author: "original author",
                    dt: new Date(),
                    text: "I think you will find it is good enough"
                },
                {
                    lineNumber: firstLine + 5,
                    author: "original author",
                    dt: new Date(),
                    text: "I think you will find it is good enough",
                    comments: [{
                            lineNumber: firstLine + 5,
                            author: "original author",
                            dt: new Date(),
                            text: "I think you will find it is good enough",
                        }]
                },
            ]
        }
    ];
}
function renderComments(element, comments) {
    comments = comments || [];
    element.innerHTML = comments
        .map(function (comment) {
        return "<div>" + comment.id + " " + comment.lineNumber + " " + comment.author + " " + comment.text + " " + (comment.deleted ? "DELETED" : "") + "</div>";
    })
        .join("");
    console.log("Comments Changed:", comments
        .map(function (comment) {
        return comment.id + " " + comment.lineNumber + " " + comment.author + " " + comment.text + " " + comment.deleted;
    })
        .join("\n"));
}
win.setView = setView;
win.generateDifferentComments = generateDifferentComments;
win.generateDifferentContents = generateDifferentContents;
win.toggleTheme = toggleTheme;
init();


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL01vbmFjb0VkaXRvckNvZGVSZXZpZXcvLi9ub2RlX21vZHVsZXMvdXVpZC9saWIvYnl0ZXNUb1V1aWQuanMiLCJ3ZWJwYWNrOi8vTW9uYWNvRWRpdG9yQ29kZVJldmlldy8uL25vZGVfbW9kdWxlcy91dWlkL2xpYi9ybmctYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9Nb25hY29FZGl0b3JDb2RlUmV2aWV3Ly4vbm9kZV9tb2R1bGVzL3V1aWQvdjQuanMiLCJ3ZWJwYWNrOi8vTW9uYWNvRWRpdG9yQ29kZVJldmlldy8uL3NyYy9kb2NzLnRzIiwid2VicGFjazovL01vbmFjb0VkaXRvckNvZGVSZXZpZXcvLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7OztB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ZTtJQUNmLGlEQUFXO0FBQ2YsQ0FBQyxFQUhJLFVBQVUsS0FBVixVQUFVLFFBR2Q7QUFFRCxJQUFLLG1CQUlKO0FBSkQsV0FBSyxtQkFBbUI7SUFDcEIsK0RBQVM7SUFDVCxpRUFBVTtJQUNWLGlFQUFVO0FBQ2QsQ0FBQyxFQUpJLG1CQUFtQixLQUFuQixtQkFBbUIsUUFJdkIiLCJmaWxlIjoiZG9jcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2RvY3MudHNcIik7XG4iLCIvKipcbiAqIENvbnZlcnQgYXJyYXkgb2YgMTYgYnl0ZSB2YWx1ZXMgdG8gVVVJRCBzdHJpbmcgZm9ybWF0IG9mIHRoZSBmb3JtOlxuICogWFhYWFhYWFgtWFhYWC1YWFhYLVhYWFgtWFhYWFhYWFhYWFhYXG4gKi9cbnZhciBieXRlVG9IZXggPSBbXTtcbmZvciAodmFyIGkgPSAwOyBpIDwgMjU2OyArK2kpIHtcbiAgYnl0ZVRvSGV4W2ldID0gKGkgKyAweDEwMCkudG9TdHJpbmcoMTYpLnN1YnN0cigxKTtcbn1cblxuZnVuY3Rpb24gYnl0ZXNUb1V1aWQoYnVmLCBvZmZzZXQpIHtcbiAgdmFyIGkgPSBvZmZzZXQgfHwgMDtcbiAgdmFyIGJ0aCA9IGJ5dGVUb0hleDtcbiAgLy8gam9pbiB1c2VkIHRvIGZpeCBtZW1vcnkgaXNzdWUgY2F1c2VkIGJ5IGNvbmNhdGVuYXRpb246IGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMxNzUjYzRcbiAgcmV0dXJuIChbYnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSwgJy0nLFxuXHRidGhbYnVmW2krK11dLCBidGhbYnVmW2krK11dLCAnLScsXG5cdGJ0aFtidWZbaSsrXV0sIGJ0aFtidWZbaSsrXV0sICctJyxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXSxcblx0YnRoW2J1ZltpKytdXSwgYnRoW2J1ZltpKytdXV0pLmpvaW4oJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJ5dGVzVG9VdWlkO1xuIiwiLy8gVW5pcXVlIElEIGNyZWF0aW9uIHJlcXVpcmVzIGEgaGlnaCBxdWFsaXR5IHJhbmRvbSAjIGdlbmVyYXRvci4gIEluIHRoZVxuLy8gYnJvd3NlciB0aGlzIGlzIGEgbGl0dGxlIGNvbXBsaWNhdGVkIGR1ZSB0byB1bmtub3duIHF1YWxpdHkgb2YgTWF0aC5yYW5kb20oKVxuLy8gYW5kIGluY29uc2lzdGVudCBzdXBwb3J0IGZvciB0aGUgYGNyeXB0b2AgQVBJLiAgV2UgZG8gdGhlIGJlc3Qgd2UgY2FuIHZpYVxuLy8gZmVhdHVyZS1kZXRlY3Rpb25cblxuLy8gZ2V0UmFuZG9tVmFsdWVzIG5lZWRzIHRvIGJlIGludm9rZWQgaW4gYSBjb250ZXh0IHdoZXJlIFwidGhpc1wiIGlzIGEgQ3J5cHRvXG4vLyBpbXBsZW1lbnRhdGlvbi4gQWxzbywgZmluZCB0aGUgY29tcGxldGUgaW1wbGVtZW50YXRpb24gb2YgY3J5cHRvIG9uIElFMTEuXG52YXIgZ2V0UmFuZG9tVmFsdWVzID0gKHR5cGVvZihjcnlwdG8pICE9ICd1bmRlZmluZWQnICYmIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgJiYgY3J5cHRvLmdldFJhbmRvbVZhbHVlcy5iaW5kKGNyeXB0bykpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgKHR5cGVvZihtc0NyeXB0bykgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHdpbmRvdy5tc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT0gJ2Z1bmN0aW9uJyAmJiBtc0NyeXB0by5nZXRSYW5kb21WYWx1ZXMuYmluZChtc0NyeXB0bykpO1xuXG5pZiAoZ2V0UmFuZG9tVmFsdWVzKSB7XG4gIC8vIFdIQVRXRyBjcnlwdG8gUk5HIC0gaHR0cDovL3dpa2kud2hhdHdnLm9yZy93aWtpL0NyeXB0b1xuICB2YXIgcm5kczggPSBuZXcgVWludDhBcnJheSgxNik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcblxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHdoYXR3Z1JORygpIHtcbiAgICBnZXRSYW5kb21WYWx1ZXMocm5kczgpO1xuICAgIHJldHVybiBybmRzODtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIE1hdGgucmFuZG9tKCktYmFzZWQgKFJORylcbiAgLy9cbiAgLy8gSWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBNYXRoLnJhbmRvbSgpLiAgSXQncyBmYXN0LCBidXQgaXMgb2YgdW5zcGVjaWZpZWRcbiAgLy8gcXVhbGl0eS5cbiAgdmFyIHJuZHMgPSBuZXcgQXJyYXkoMTYpO1xuXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gbWF0aFJORygpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgcjsgaSA8IDE2OyBpKyspIHtcbiAgICAgIGlmICgoaSAmIDB4MDMpID09PSAwKSByID0gTWF0aC5yYW5kb20oKSAqIDB4MTAwMDAwMDAwO1xuICAgICAgcm5kc1tpXSA9IHIgPj4+ICgoaSAmIDB4MDMpIDw8IDMpICYgMHhmZjtcbiAgICB9XG5cbiAgICByZXR1cm4gcm5kcztcbiAgfTtcbn1cbiIsInZhciBybmcgPSByZXF1aXJlKCcuL2xpYi9ybmcnKTtcbnZhciBieXRlc1RvVXVpZCA9IHJlcXVpcmUoJy4vbGliL2J5dGVzVG9VdWlkJyk7XG5cbmZ1bmN0aW9uIHY0KG9wdGlvbnMsIGJ1Ziwgb2Zmc2V0KSB7XG4gIHZhciBpID0gYnVmICYmIG9mZnNldCB8fCAwO1xuXG4gIGlmICh0eXBlb2Yob3B0aW9ucykgPT0gJ3N0cmluZycpIHtcbiAgICBidWYgPSBvcHRpb25zID09PSAnYmluYXJ5JyA/IG5ldyBBcnJheSgxNikgOiBudWxsO1xuICAgIG9wdGlvbnMgPSBudWxsO1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIHZhciBybmRzID0gb3B0aW9ucy5yYW5kb20gfHwgKG9wdGlvbnMucm5nIHx8IHJuZykoKTtcblxuICAvLyBQZXIgNC40LCBzZXQgYml0cyBmb3IgdmVyc2lvbiBhbmQgYGNsb2NrX3NlcV9oaV9hbmRfcmVzZXJ2ZWRgXG4gIHJuZHNbNl0gPSAocm5kc1s2XSAmIDB4MGYpIHwgMHg0MDtcbiAgcm5kc1s4XSA9IChybmRzWzhdICYgMHgzZikgfCAweDgwO1xuXG4gIC8vIENvcHkgYnl0ZXMgdG8gYnVmZmVyLCBpZiBwcm92aWRlZFxuICBpZiAoYnVmKSB7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IDE2OyArK2lpKSB7XG4gICAgICBidWZbaSArIGlpXSA9IHJuZHNbaWldO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWYgfHwgYnl0ZXNUb1V1aWQocm5kcyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdjQ7XG4iLCJpbXBvcnQgeyBSZXZpZXdDb21tZW50LCBjcmVhdGVSZXZpZXdNYW5hZ2VyIH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuXHJcbmludGVyZmFjZSBXaW5kb3dEb2Mge1xyXG4gICAgcmVxdWlyZTogYW55O1xyXG4gICAgbW9uYWNvOiBhbnk7XHJcbiAgICBzZXRWaWV3OiBhbnk7XHJcbiAgICBnZW5lcmF0ZURpZmZlcmVudENvbW1lbnRzOiBhbnk7XHJcbiAgICBnZW5lcmF0ZURpZmZlcmVudENvbnRlbnRzOiBhbnk7XHJcbiAgICB0b2dnbGVUaGVtZTogYW55O1xyXG59XHJcblxyXG5jb25zdCB3aW4gPSAod2luZG93IGFzIGFueSkgYXMgV2luZG93RG9jO1xyXG5sZXQgcmV2aWV3TWFuYWdlcjogYW55ID0gbnVsbDtcclxubGV0IGN1cnJlbnRNb2RlOiBzdHJpbmcgPSAnJztcclxubGV0IGN1cnJlbnRFZGl0b3I6IGFueSA9IG51bGw7XHJcbmxldCB0aGVtZSA9ICd2cy1kYXJrJztcclxuXHJcbmZ1bmN0aW9uIGVuc3VyZU1vbmFjb0lzQXZhaWxhYmxlKCkge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xyXG4gICAgICAgIGlmICghd2luLnJlcXVpcmUpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFxyXG4gICAgICAgICAgICAgICAgXCJVbmFibGUgdG8gZmluZCBhIGxvY2FsIG5vZGVfbW9kdWxlcyBmb2xkZXIgLSBzbyBkeW5hbWljYWxseSB1c2luZyBjZG4gaW5zdGVhZFwiXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHZhciBwcmVmaXggPSBcImh0dHBzOi8vbWljcm9zb2Z0LmdpdGh1Yi5pby9tb25hY28tZWRpdG9yXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjcmlwdFRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XHJcbiAgICAgICAgICAgIHNjcmlwdFRhZy5zcmMgPSBwcmVmaXggKyBcIi9ub2RlX21vZHVsZXMvbW9uYWNvLWVkaXRvci9taW4vdnMvbG9hZGVyLmpzXCI7XHJcbiAgICAgICAgICAgIHNjcmlwdFRhZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiTW9uYWNvIGxvYWRlciBpcyBpbml0aWFsaXplZFwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocHJlZml4KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JpcHRUYWcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJlc29sdmUoXCIuLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UmFuZG9tSW50KG1heCkge1xyXG4gICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIE1hdGguZmxvb3IobWF4KSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldFZpZXcobW9kZSkge1xyXG4gICAgY29uc3QgaWR4ID0gZ2V0UmFuZG9tSW50KChleGFtcGxlU291cmNlQ29kZS5sZW5ndGgpIC8gMikgKiAyO1xyXG5cclxuICAgIGN1cnJlbnRNb2RlID0gbW9kZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGFpbmVyRWRpdG9yXCIpLmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICBpZiAobW9kZS5zdGFydHNXaXRoKFwic3RhbmRhcmRcIikpIHtcclxuICAgICAgICBjdXJyZW50RWRpdG9yID0gd2luLm1vbmFjby5lZGl0b3IuY3JlYXRlKFxyXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbnRhaW5lckVkaXRvclwiKSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFsdWU6IGV4YW1wbGVTb3VyY2VDb2RlW2lkeF0sXHJcbiAgICAgICAgICAgICAgICBsYW5ndWFnZTogXCJ0eXBlc2NyaXB0XCIsXHJcbiAgICAgICAgICAgICAgICBnbHlwaE1hcmdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbnRleHRtZW51OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYXV0b21hdGljTGF5b3V0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVhZE9ubHk6IG1vZGUgPT09IFwic3RhbmRhcmQtcmVhZG9ubHlcIixcclxuICAgICAgICAgICAgICAgIHRoZW1lOiB0aGVtZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgaW5pdFJldmlld01hbmFnZXIoY3VycmVudEVkaXRvcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhciBvcmlnaW5hbE1vZGVsID0gd2luLm1vbmFjby5lZGl0b3IuY3JlYXRlTW9kZWwoXHJcbiAgICAgICAgICAgIGV4YW1wbGVTb3VyY2VDb2RlW2lkeF0sXHJcbiAgICAgICAgICAgIFwidHlwZXNjcmlwdFwiXHJcbiAgICAgICAgKTtcclxuICAgICAgICB2YXIgbW9kaWZpZWRNb2RlbCA9IHdpbi5tb25hY28uZWRpdG9yLmNyZWF0ZU1vZGVsKFxyXG4gICAgICAgICAgICBleGFtcGxlU291cmNlQ29kZVtpZHggKyAxXSxcclxuICAgICAgICAgICAgXCJ0eXBlc2NyaXB0XCJcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjdXJyZW50RWRpdG9yID0gd2luLm1vbmFjby5lZGl0b3IuY3JlYXRlRGlmZkVkaXRvcihcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250YWluZXJFZGl0b3JcIiksXHJcbiAgICAgICAgICAgIHsgcmVuZGVyU2lkZUJ5U2lkZTogbW9kZSAhPT0gXCJpbmxpbmVcIiB9XHJcbiAgICAgICAgKTtcclxuICAgICAgICBjdXJyZW50RWRpdG9yLnNldE1vZGVsKHtcclxuICAgICAgICAgICAgb3JpZ2luYWw6IG9yaWdpbmFsTW9kZWwsXHJcbiAgICAgICAgICAgIG1vZGlmaWVkOiBtb2RpZmllZE1vZGVsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGluaXRSZXZpZXdNYW5hZ2VyKGN1cnJlbnRFZGl0b3IubW9kaWZpZWRFZGl0b3IpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZURpZmZlcmVudENvbnRlbnRzKCkge1xyXG4gICAgY29uc3QgaWR4ID0gZ2V0UmFuZG9tSW50KChleGFtcGxlU291cmNlQ29kZS5sZW5ndGgpIC8gMikgKiAyO1xyXG5cclxuICAgIGlmIChjdXJyZW50TW9kZS5zdGFydHNXaXRoKFwic3RhbmRhcmRcIikpIHtcclxuICAgICAgICBjdXJyZW50RWRpdG9yLnNldFZhbHVlKGV4YW1wbGVTb3VyY2VDb2RlW2lkeF0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBjdXJyZW50RWRpdG9yLmdldE1vZGVsKCkubW9kaWZpZWQuc2V0VmFsdWUoZXhhbXBsZVNvdXJjZUNvZGVbaWR4XSk7XHJcbiAgICAgICAgY3VycmVudEVkaXRvci5nZXRNb2RlbCgpLm1vZGlmaWVkLnNldFZhbHVlKGV4YW1wbGVTb3VyY2VDb2RlW2lkeCArIDFdKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgZXhhbXBsZVNvdXJjZUNvZGUgPSBbXTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGZldGNoU291cmNlQ29kZSh1cmw6IHN0cmluZykge1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xyXG4gICAgY29uc3QgZXhhbXBsZVRleHQgPSBhd2FpdCByZXNwb25zZS50ZXh0KCk7XHJcblxyXG4gICAgY29uc3QgbW9kaWZpZWRUZXh0ID0gZXhhbXBsZVRleHQucmVwbGFjZShcclxuICAgICAgICBuZXcgUmVnRXhwKFwic3RyaW5nXCIsIFwiZ1wiKSxcclxuICAgICAgICBcInN0cmluZyAvKiBTdHJpbmchKi9cIlxyXG4gICAgKTtcclxuXHJcbiAgICBleGFtcGxlU291cmNlQ29kZS5wdXNoKHVybCArICdcXG4nICsgZXhhbXBsZVRleHQpO1xyXG4gICAgZXhhbXBsZVNvdXJjZUNvZGUucHVzaCh1cmwgKyAnXFxuJyArIG1vZGlmaWVkVGV4dCk7XHJcbn1cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICB2YXIgcHJlZml4ID0gYXdhaXQgZW5zdXJlTW9uYWNvSXNBdmFpbGFibGUoKTtcclxuICAgIGF3YWl0IGZldGNoU291cmNlQ29kZShcIi4uL3NyYy9pbmRleC50c1wiKTtcclxuICAgIGF3YWl0IGZldGNoU291cmNlQ29kZShcIi4uL3NyYy9kb2NzLnRzXCIpO1xyXG4gICAgYXdhaXQgZmV0Y2hTb3VyY2VDb2RlKFwiLi4vc3JjL2luZGV4LnRlc3QudHNcIik7XHJcblxyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi4uL2Rpc3QvdGltZXN0YW1wLmpzb25cIik7XHJcbiAgICBjb25zdCB0c29iaiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGNvbnNvbGUubG9nKFwiQ29tcGlsZWQgYXQ6XCIsIHRzb2JqLmRhdGUpO1xyXG5cclxuICAgIHdpbi5yZXF1aXJlLmNvbmZpZyh7XHJcbiAgICAgICAgcGF0aHM6IHsgdnM6IHByZWZpeCArIFwiL25vZGVfbW9kdWxlcy9tb25hY28tZWRpdG9yL21pbi92c1wiIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHdpbi5yZXF1aXJlKFtcInZzL2VkaXRvci9lZGl0b3IubWFpblwiXSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHNldFZpZXcoXCJzdGFuZGFyZFwiKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpbml0UmV2aWV3TWFuYWdlcihlZGl0b3I6IGFueSkge1xyXG4gICAgdmFyIHN1bW1hcnlEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1bW1hcnlFZGl0b3JcIik7XHJcbiAgICByZXZpZXdNYW5hZ2VyID0gY3JlYXRlUmV2aWV3TWFuYWdlcihcclxuICAgICAgICBlZGl0b3IsXHJcbiAgICAgICAgXCJtciByZXZpZXdlclwiLFxyXG4gICAgICAgIGNyZWF0ZVJhbmRvbUNvbW1lbnRzKCksXHJcbiAgICAgICAgdXBkYXRlZENvbW1lbnRzID0+IHJlbmRlckNvbW1lbnRzKHN1bW1hcnlEaXYsIHVwZGF0ZWRDb21tZW50cyksXHJcbiAgICAgICAgeyBlZGl0QnV0dG9uRW5hYmxlUmVtb3ZlOiB0cnVlIH1cclxuICAgICk7XHJcblxyXG4gICAgcmVuZGVyQ29tbWVudHMoc3VtbWFyeURpdiwgcmV2aWV3TWFuYWdlci5jb21tZW50cyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvZ2dsZVRoZW1lKCkge1xyXG4gICAgdGhlbWUgPSB0aGVtZSA9PSAndnMnID8gJ3ZzLWRhcmsnIDogJ3ZzJztcclxuICAgIHdpbi5tb25hY28uZWRpdG9yLnNldFRoZW1lKHRoZW1lKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0ZURpZmZlcmVudENvbW1lbnRzKCkge1xyXG4gICAgcmV2aWV3TWFuYWdlci5sb2FkKGNyZWF0ZVJhbmRvbUNvbW1lbnRzKCkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVSYW5kb21Db21tZW50cygpOiBSZXZpZXdDb21tZW50W10ge1xyXG4gICAgY29uc3QgZmlyc3RMaW5lID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xyXG5cclxuICAgIHJldHVybiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogXCJpZC0wXCIsXHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXI6IGZpcnN0TGluZSArIDEsXHJcbiAgICAgICAgICAgIGF1dGhvcjogXCJhbm90aGVyIHJldmlld2VyXCIsXHJcbiAgICAgICAgICAgIGR0OiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgICB0ZXh0OiBcImF0IHN0YXJ0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IFwiaWQtMlwiLFxyXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiBmaXJzdExpbmUgKyA1MCxcclxuICAgICAgICAgICAgYXV0aG9yOiBcImFub3RoZXIgcmV2aWV3ZXJcIixcclxuICAgICAgICAgICAgZHQ6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICAgIHRleHQ6IFwiYXQgc3RhcnRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiBmaXJzdExpbmUgKyA1LFxyXG4gICAgICAgICAgICBhdXRob3I6IFwiYW5vdGhlciByZXZpZXdlclwiLFxyXG4gICAgICAgICAgICBkdDogJzIwMTktMDEtMDEgMTI6MjI6MzMnLFxyXG4gICAgICAgICAgICB0ZXh0OiBcInRoaXMgY29kZSBpc24ndCB2ZXJ5IGdvb2RcIixcclxuICAgICAgICAgICAgY29tbWVudHM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lTnVtYmVyOiBmaXJzdExpbmUgKyA1LFxyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhvcjogXCJvcmlnaW5hbCBhdXRob3JcIixcclxuICAgICAgICAgICAgICAgICAgICBkdDogbmV3IERhdGUoKSxcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkkgdGhpbmsgeW91IHdpbGwgZmluZCBpdCBpcyBnb29kIGVub3VnaFwiXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IGZpcnN0TGluZSArIDUsXHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yOiBcIm9yaWdpbmFsIGF1dGhvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGR0OiBuZXcgRGF0ZSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiSSB0aGluayB5b3Ugd2lsbCBmaW5kIGl0IGlzIGdvb2QgZW5vdWdoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudHM6IFt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IGZpcnN0TGluZSArIDUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF1dGhvcjogXCJvcmlnaW5hbCBhdXRob3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZHQ6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IFwiSSB0aGluayB5b3Ugd2lsbCBmaW5kIGl0IGlzIGdvb2QgZW5vdWdoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfV1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICxcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJDb21tZW50cyhlbGVtZW50LCBjb21tZW50cykge1xyXG4gICAgY29tbWVudHMgPSBjb21tZW50cyB8fCBbXTtcclxuICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gY29tbWVudHNcclxuICAgICAgICAubWFwKFxyXG4gICAgICAgICAgICBjb21tZW50ID0+XHJcbiAgICAgICAgICAgICAgICBgPGRpdj4ke2NvbW1lbnQuaWR9ICR7Y29tbWVudC5saW5lTnVtYmVyfSAke2NvbW1lbnQuYXV0aG9yfSAke1xyXG4gICAgICAgICAgICAgICAgY29tbWVudC50ZXh0XHJcbiAgICAgICAgICAgICAgICB9ICR7Y29tbWVudC5kZWxldGVkID8gXCJERUxFVEVEXCIgOiBcIlwifTwvZGl2PmBcclxuICAgICAgICApXHJcbiAgICAgICAgLmpvaW4oXCJcIik7XHJcbiAgICBjb25zb2xlLmxvZyhcclxuICAgICAgICBcIkNvbW1lbnRzIENoYW5nZWQ6XCIsXHJcbiAgICAgICAgY29tbWVudHNcclxuICAgICAgICAgICAgLm1hcChcclxuICAgICAgICAgICAgICAgIGNvbW1lbnQgPT5cclxuICAgICAgICAgICAgICAgICAgICBgJHtjb21tZW50LmlkfSAke2NvbW1lbnQubGluZU51bWJlcn0gJHtjb21tZW50LmF1dGhvcn0gJHtcclxuICAgICAgICAgICAgICAgICAgICBjb21tZW50LnRleHRcclxuICAgICAgICAgICAgICAgICAgICB9ICR7Y29tbWVudC5kZWxldGVkfWBcclxuICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAuam9pbihcIlxcblwiKVxyXG4gICAgKTtcclxufVxyXG5cclxud2luLnNldFZpZXcgPSBzZXRWaWV3O1xyXG53aW4uZ2VuZXJhdGVEaWZmZXJlbnRDb21tZW50cyA9IGdlbmVyYXRlRGlmZmVyZW50Q29tbWVudHM7XHJcbndpbi5nZW5lcmF0ZURpZmZlcmVudENvbnRlbnRzID0gZ2VuZXJhdGVEaWZmZXJlbnRDb250ZW50cztcclxud2luLnRvZ2dsZVRoZW1lID0gdG9nZ2xlVGhlbWU7XHJcbmluaXQoKTtcclxuXHJcbiIsImltcG9ydCAqIGFzIHV1aWQgZnJvbSBcInV1aWQvdjRcIjtcclxuXHJcbmludGVyZmFjZSBNb25hY29XaW5kb3cge1xyXG4gICAgbW9uYWNvOiBhbnk7XHJcbn1cclxuXHJcbmNvbnN0IG1vbmFjb1dpbmRvdyA9ICh3aW5kb3cgYXMgYW55KSBhcyBNb25hY29XaW5kb3c7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJldmlld0NvbW1lbnQge1xyXG4gICAgaWQ/OiBzdHJpbmc7XHJcbiAgICBhdXRob3I6IHN0cmluZztcclxuICAgIGR0OiBEYXRlIHwgc3RyaW5nO1xyXG4gICAgbGluZU51bWJlcjogbnVtYmVyO1xyXG4gICAgdGV4dDogc3RyaW5nO1xyXG4gICAgY29tbWVudHM/OiBSZXZpZXdDb21tZW50W107XHJcbiAgICBkZWxldGVkPzogYm9vbGVhbjtcclxufVxyXG5cclxuY2xhc3MgUmV2aWV3Q29tbWVudFN0YXRlIHtcclxuICAgIHZpZXdab25lSWQ6IG51bWJlcjtcclxuICAgIHJlbmRlclN0YXR1czogUmV2aWV3Q29tbWVudFN0YXR1cztcclxuICAgIG51bWJlck9mTGluZXM6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihudW1iZXJPZkxpbmVzOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMubm9ybWFsO1xyXG4gICAgICAgIHRoaXMudmlld1pvbmVJZCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5udW1iZXJPZkxpbmVzID0gbnVtYmVyT2ZMaW5lcztcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVJldmlld01hbmFnZXIoZWRpdG9yOiBhbnksIGN1cnJlbnRVc2VyOiBzdHJpbmcsIGNvbW1lbnRzPzogUmV2aWV3Q29tbWVudFtdLCBvbkNoYW5nZT86IE9uQ29tbWVudHNDaGFuZ2VkLCBjb25maWc/OiBSZXZpZXdNYW5hZ2VyQ29uZmlnKTogUmV2aWV3TWFuYWdlciB7XHJcbiAgICAvL0ZvciBEZWJ1ZzogKHdpbmRvdyBhcyBhbnkpLmVkaXRvciA9IGVkaXRvcjtcclxuICAgIGNvbnN0IHJtID0gbmV3IFJldmlld01hbmFnZXIoZWRpdG9yLCBjdXJyZW50VXNlciwgb25DaGFuZ2UsIGNvbmZpZyk7XHJcbiAgICBybS5sb2FkKGNvbW1lbnRzIHx8IFtdKTtcclxuICAgIHJldHVybiBybTtcclxufVxyXG5cclxuXHJcbmludGVyZmFjZSBSZXZpZXdDb21tZW50SXRlckl0ZW0ge1xyXG4gICAgZGVwdGg6IG51bWJlcjtcclxuICAgIGNvbW1lbnQ6IFJldmlld0NvbW1lbnQsXHJcbiAgICB2aWV3U3RhdGU6IFJldmlld0NvbW1lbnRTdGF0ZVxyXG59XHJcblxyXG5pbnRlcmZhY2UgT25Db21tZW50c0NoYW5nZWQge1xyXG4gICAgKGNvbW1lbnRzOiBSZXZpZXdDb21tZW50W10pOiB2b2lkXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgUmV2aWV3TWFuYWdlckNvbmZpZyB7XHJcbiAgICBlZGl0QnV0dG9uRW5hYmxlUmVtb3ZlPzogYm9vbGVhbjtcclxuICAgIGxpbmVIZWlnaHQ/OiBudW1iZXI7XHJcbiAgICBjb21tZW50SW5kZW50PzogbnVtYmVyO1xyXG4gICAgY29tbWVudEluZGVudE9mZnNldD86IG51bWJlcjtcclxuICAgIGVkaXRCdXR0b25BZGRUZXh0Pzogc3RyaW5nO1xyXG4gICAgZWRpdEJ1dHRvblJlbW92ZVRleHQ/OiBzdHJpbmc7XHJcbiAgICBlZGl0QnV0dG9uT2Zmc2V0Pzogc3RyaW5nO1xyXG4gICAgcmV2aWV3Q29tbWVudEljb25TZWxlY3Q/OiBzdHJpbmc7XHJcbiAgICByZXZpZXdDb21tZW50SWNvbkFjdGl2ZT86IHN0cmluZztcclxuICAgIHNob3dJblJ1bGVyPzogYm9vbGVhblxyXG59XHJcblxyXG5pbnRlcmZhY2UgUmV2aWV3TWFuYWdlckNvbmZpZ1ByaXZhdGUge1xyXG4gICAgcnVsZXJNYXJrZXJDb2xvcjogYW55O1xyXG4gICAgcnVsZXJNYXJrZXJEYXJrQ29sb3I6IGFueTtcclxuICAgIGVkaXRCdXR0b25FbmFibGVSZW1vdmU6IGJvb2xlYW47XHJcbiAgICBsaW5lSGVpZ2h0OiBudW1iZXI7XHJcbiAgICBjb21tZW50SW5kZW50OiBudW1iZXI7XHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0OiBudW1iZXI7XHJcbiAgICBlZGl0QnV0dG9uQWRkVGV4dDogc3RyaW5nO1xyXG4gICAgZWRpdEJ1dHRvblJlbW92ZVRleHQ6IHN0cmluZztcclxuICAgIGVkaXRCdXR0b25PZmZzZXQ6IHN0cmluZztcclxuICAgIHNob3dJblJ1bGVyOiBib29sZWFuO1xyXG59XHJcblxyXG5cclxuY29uc3QgZGVmYXVsdFJldmlld01hbmFnZXJDb25maWc6IFJldmlld01hbmFnZXJDb25maWdQcml2YXRlID0ge1xyXG4gICAgZWRpdEJ1dHRvbk9mZnNldDogJy0xMHB4JyxcclxuICAgIGVkaXRCdXR0b25BZGRUZXh0OiAnUmVwbHknLFxyXG4gICAgZWRpdEJ1dHRvblJlbW92ZVRleHQ6ICdSZW1vdmUnLFxyXG4gICAgZWRpdEJ1dHRvbkVuYWJsZVJlbW92ZTogdHJ1ZSxcclxuICAgIGxpbmVIZWlnaHQ6IDE5LFxyXG4gICAgY29tbWVudEluZGVudDogMjAsXHJcbiAgICBjb21tZW50SW5kZW50T2Zmc2V0OiAyMCxcclxuICAgIHNob3dJblJ1bGVyOiB0cnVlLFxyXG4gICAgcnVsZXJNYXJrZXJDb2xvcjogJ2RhcmtvcmFuZ2UnLFxyXG4gICAgcnVsZXJNYXJrZXJEYXJrQ29sb3I6ICdkYXJrb3JhbmdlJ1xyXG59O1xyXG5cclxuY29uc3QgQ09OVFJPTF9BVFRSX05BTUUgPSAnUmV2aWV3TWFuYWdlckNvbnRyb2wnO1xyXG5cclxuY2xhc3MgUmV2aWV3TWFuYWdlciB7XHJcbiAgICBjdXJyZW50VXNlcjogc3RyaW5nO1xyXG4gICAgZWRpdG9yOiBhbnk7XHJcbiAgICBjb21tZW50czogUmV2aWV3Q29tbWVudFtdO1xyXG4gICAgY29tbWVudFN0YXRlOiB7IFtyZXZpZXdDb21tZW50SWQ6IHN0cmluZ106IFJldmlld0NvbW1lbnRTdGF0ZSB9O1xyXG5cclxuICAgIGFjdGl2ZUNvbW1lbnQ/OiBSZXZpZXdDb21tZW50O1xyXG4gICAgd2lkZ2V0SW5saW5lVG9vbGJhcjogYW55O1xyXG4gICAgd2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvcjogYW55O1xyXG4gICAgb25DaGFuZ2U6IE9uQ29tbWVudHNDaGFuZ2VkO1xyXG4gICAgZWRpdG9yTW9kZTogRWRpdG9yTW9kZTtcclxuICAgIGNvbmZpZzogUmV2aWV3TWFuYWdlckNvbmZpZ1ByaXZhdGU7XHJcblxyXG4gICAgdGV4dGFyZWE6IEhUTUxUZXh0QXJlYUVsZW1lbnQ7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVkaXRvcjogYW55LCBjdXJyZW50VXNlcjogc3RyaW5nLCBvbkNoYW5nZTogT25Db21tZW50c0NoYW5nZWQsIGNvbmZpZz86IFJldmlld01hbmFnZXJDb25maWcpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRVc2VyID0gY3VycmVudFVzZXI7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBlZGl0b3I7XHJcbiAgICAgICAgdGhpcy5hY3RpdmVDb21tZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmNvbW1lbnRzID0gW107XHJcbiAgICAgICAgdGhpcy5jb21tZW50U3RhdGUgPSB7fTtcclxuICAgICAgICB0aGlzLndpZGdldElubGluZVRvb2xiYXIgPSBudWxsO1xyXG4gICAgICAgIHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vbkNoYW5nZSA9IG9uQ2hhbmdlO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yTW9kZSA9IEVkaXRvck1vZGUudG9vbGJhcjtcclxuICAgICAgICB0aGlzLmNvbmZpZyA9IHsgLi4uZGVmYXVsdFJldmlld01hbmFnZXJDb25maWcsIC4uLihjb25maWcgfHwge30pIH07XHJcblxyXG4gICAgICAgIHRoaXMuYWRkQWN0aW9ucygpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlSW5saW5lVG9vbGJhcldpZGdldCgpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlSW5saW5lRWRpdG9yV2lkZ2V0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLm9uTW91c2VEb3duKHRoaXMuaGFuZGxlTW91c2VEb3duLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWQoY29tbWVudHM6IFJldmlld0NvbW1lbnRbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmNoYW5nZVZpZXdab25lcygoY2hhbmdlQWNjZXNzb3IpID0+IHtcclxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCB0aGUgZXhpc3RpbmcgY29tbWVudHMgICAgIFxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG9sZEl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9sZEl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VBY2Nlc3Nvci5yZW1vdmVab25lKG9sZEl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRzID0gY29tbWVudHMgfHwgW107XHJcbiAgICAgICAgICAgIHRoaXMuY29tbWVudFN0YXRlID0ge307XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBhbGwgY29tbWVudHMgdGhhdCB0aGV5IGhhdmUgdW5pcXVlIGFuZCBwcmVzZW50IGlkJ3NcclxuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsSWQgPSBpdGVtLmNvbW1lbnQuaWQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgY2hhbmdlZElkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCFpdGVtLmNvbW1lbnQuaWQgfHwgdGhpcy5jb21tZW50U3RhdGVbaXRlbS5jb21tZW50LmlkXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0uY29tbWVudC5pZCA9IHV1aWQoKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VkSWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaGFuZ2VkSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ0NvbW1lbnQuSWQgQXNzaWduZWQ6ICcsIG9yaWdpbmFsSWQsICcgY2hhbmdlZCB0byB0byAnLCBpdGVtLmNvbW1lbnQuaWQsICcgZHVlIHRvIGNvbGxpc2lvbicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudFN0YXRlW2l0ZW0uY29tbWVudC5pZF0gPSBuZXcgUmV2aWV3Q29tbWVudFN0YXRlKHRoaXMuY2FsY3VsYXRlTnVtYmVyT2ZMaW5lcyhpdGVtLmNvbW1lbnQudGV4dCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpO1xyXG5cclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnQ29tbWVudHMgTG9hZGVkOiAnLCB0aGlzLmNvbW1lbnRzLmxlbmd0aCk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBjYWxjdWxhdGVOdW1iZXJPZkxpbmVzKHRleHQ6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRleHQuc3BsaXQoL1xccipcXG4vKS5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGhlbWVkQ29sb3IobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAvLyBlZGl0b3IuYmFja2dyb3VuZDogZSB7cmdiYTogZX1cclxuICAgICAgICAvLyBlZGl0b3IuZm9yZWdyb3VuZDogZSB7cmdiYTogZX1cclxuICAgICAgICAvLyBlZGl0b3IuaW5hY3RpdmVTZWxlY3Rpb25CYWNrZ3JvdW5kOiBlIHtyZ2JhOiBlfVxyXG4gICAgICAgIC8vIGVkaXRvci5zZWxlY3Rpb25IaWdobGlnaHRCYWNrZ3JvdW5kOiBlIHtyZ2JhOiBlfVxyXG4gICAgICAgIC8vIGVkaXRvckluZGVudEd1aWRlLmFjdGl2ZUJhY2tncm91bmQ6IGUge3JnYmE6IGV9XHJcbiAgICAgICAgLy8gZWRpdG9ySW5kZW50R3VpZGUuYmFja2dyb3VuZDogZSB7cmdiYTogZX1cclxuICAgICAgICByZXR1cm4gdGhpcy5lZGl0b3IuX3RoZW1lU2VydmljZS5nZXRUaGVtZSgpLmdldENvbG9yKG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRCdXR0b25zRWxlbWVudCgpIHtcclxuICAgICAgICB2YXIgcm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG4gICAgICAgIHJvb3QuY2xhc3NOYW1lID0gJ2VkaXRCdXR0b25zQ29udGFpbmVyJ1xyXG4gICAgICAgIHJvb3Quc3R5bGUubWFyZ2luTGVmdCA9IHRoaXMuY29uZmlnLmVkaXRCdXR0b25PZmZzZXQ7XHJcblxyXG4gICAgICAgIGNvbnN0IGFkZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSBhcyBIVE1MU3BhbkVsZW1lbnQ7XHJcbiAgICAgICAgYWRkLmlubmVyVGV4dCA9IHRoaXMuY29uZmlnLmVkaXRCdXR0b25BZGRUZXh0O1xyXG4gICAgICAgIGFkZC5jbGFzc05hbWUgPSAnZWRpdEJ1dHRvbiBhZGQnXHJcbiAgICAgICAgYWRkLnNldEF0dHJpYnV0ZShDT05UUk9MX0FUVFJfTkFNRSwgJycpO1xyXG4gICAgICAgIGFkZC5vbmNsaWNrID0gKCkgPT4gdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUuZWRpdENvbW1lbnQpO1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoYWRkKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmVkaXRCdXR0b25FbmFibGVSZW1vdmUpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3BhY2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JykgYXMgSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgICAgICAgIHNwYWNlci5pbm5lclRleHQgPSAnICdcclxuICAgICAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChzcGFjZXIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpIGFzIEhUTUxTcGFuRWxlbWVudDtcclxuICAgICAgICAgICAgcmVtb3ZlLnNldEF0dHJpYnV0ZShDT05UUk9MX0FUVFJfTkFNRSwgJycpO1xyXG4gICAgICAgICAgICByZW1vdmUuaW5uZXJUZXh0ID0gdGhpcy5jb25maWcuZWRpdEJ1dHRvblJlbW92ZVRleHQ7XHJcbiAgICAgICAgICAgIHJlbW92ZS5jbGFzc05hbWUgPSAnZWRpdEJ1dHRvbiByZW1vdmUnXHJcbiAgICAgICAgICAgIHJlbW92ZS5vbmNsaWNrID0gKCkgPT4gdGhpcy5yZW1vdmVDb21tZW50KHRoaXMuYWN0aXZlQ29tbWVudCk7XHJcbiAgICAgICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQocmVtb3ZlKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDYW5jZWwoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUudG9vbGJhcik7XHJcbiAgICAgICAgdGhpcy5lZGl0b3IuZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVTYXZlKCkge1xyXG4gICAgICAgIGNvbnN0IHIgPSB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS50b29sYmFyKTtcclxuICAgICAgICB0aGlzLmFkZENvbW1lbnQoci5saW5lTnVtYmVyLCByLnRleHQpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmZvY3VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlVGV4dEFyZWFLZXlEb3duKGU6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgICAgICBpZiAoZS5jb2RlID09PSBcIkVzY2FwZVwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2FuY2VsKCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChlLmNvZGUgPT09IFwiRW50ZXJcIiAmJiBlLmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5oYW5kbGVTYXZlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRvckVsZW1lbnQoKSB7XHJcbiAgICAgICAgdmFyIHJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJykgYXMgSFRNTFNwYW5FbGVtZW50O1xyXG4gICAgICAgIHJvb3QuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50RWRpdFwiXHJcblxyXG4gICAgICAgIGNvbnN0IHRleHRhcmVhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xyXG4gICAgICAgIHRleHRhcmVhLnNldEF0dHJpYnV0ZShDT05UUk9MX0FUVFJfTkFNRSwgJycpO1xyXG4gICAgICAgIHRleHRhcmVhLmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudFRleHRcIjtcclxuICAgICAgICB0ZXh0YXJlYS5pbm5lclRleHQgPSAnJztcclxuICAgICAgICB0ZXh0YXJlYS5uYW1lID0gJ3RleHQnO1xyXG4gICAgICAgIHRleHRhcmVhLm9ua2V5ZG93biA9IHRoaXMuaGFuZGxlVGV4dEFyZWFLZXlEb3duLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNhdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBzYXZlLnNldEF0dHJpYnV0ZShDT05UUk9MX0FUVFJfTkFNRSwgJycpO1xyXG4gICAgICAgIHNhdmUuY2xhc3NOYW1lID0gXCJyZXZpZXdDb21tZW50U2F2ZVwiO1xyXG4gICAgICAgIHNhdmUuaW5uZXJUZXh0ID0gJ1NhdmUnO1xyXG4gICAgICAgIHNhdmUub25jbGljayA9IHRoaXMuaGFuZGxlU2F2ZS5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICBjb25zdCBjYW5jZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBjYW5jZWwuc2V0QXR0cmlidXRlKENPTlRST0xfQVRUUl9OQU1FLCAnJyk7XHJcbiAgICAgICAgY2FuY2VsLmNsYXNzTmFtZSA9IFwicmV2aWV3Q29tbWVudENhbmNlbFwiO1xyXG4gICAgICAgIGNhbmNlbC5pbm5lclRleHQgPSAnQ2FuY2VsJztcclxuICAgICAgICBjYW5jZWwub25jbGljayA9IHRoaXMuaGFuZGxlQ2FuY2VsLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQodGV4dGFyZWEpO1xyXG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoc2F2ZSk7XHJcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjYW5jZWwpO1xyXG5cclxuICAgICAgICB0aGlzLnRleHRhcmVhID0gdGV4dGFyZWE7XHJcbiAgICAgICAgcmV0dXJuIHJvb3RcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVJbmxpbmVUb29sYmFyV2lkZ2V0KCkge1xyXG4gICAgICAgIGNvbnN0IGJ1dHRvbnNFbGVtZW50ID0gdGhpcy5jcmVhdGVJbmxpbmVFZGl0QnV0dG9uc0VsZW1lbnQoKTtcclxuXHJcbiAgICAgICAgdGhpcy53aWRnZXRJbmxpbmVUb29sYmFyID0ge1xyXG4gICAgICAgICAgICBhbGxvd0VkaXRvck92ZXJmbG93OiB0cnVlLFxyXG4gICAgICAgICAgICBnZXRJZDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd3aWRnZXRJbmxpbmVUb29sYmFyJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0RG9tTm9kZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbnNFbGVtZW50O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRQb3NpdGlvbjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCAmJiB0aGlzLmVkaXRvck1vZGUgPT0gRWRpdG9yTW9kZS50b29sYmFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyICsgMSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcHJlZmVyZW5jZTogW21vbmFjb1dpbmRvdy5tb25hY28uZWRpdG9yLkNvbnRlbnRXaWRnZXRQb3NpdGlvblByZWZlcmVuY2UuQkVMT1ddXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0b3IuYWRkQ29udGVudFdpZGdldCh0aGlzLndpZGdldElubGluZVRvb2xiYXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUlubGluZUVkaXRvcldpZGdldCgpIHtcclxuICAgICAgICBjb25zdCBlZGl0b3JFbGVtZW50ID0gdGhpcy5jcmVhdGVJbmxpbmVFZGl0b3JFbGVtZW50KCk7XHJcblxyXG4gICAgICAgIHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvciA9IHtcclxuICAgICAgICAgICAgYWxsb3dFZGl0b3JPdmVyZmxvdzogdHJ1ZSxcclxuICAgICAgICAgICAgZ2V0SWQ6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnd2lkZ2V0SW5saW5lRWRpdG9yJztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0RG9tTm9kZTogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVkaXRvckVsZW1lbnQ7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldFBvc2l0aW9uOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lZGl0b3JNb2RlID09IEVkaXRvck1vZGUuZWRpdENvbW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgYXJlIHVzaW5nIG5lZ2F0aXZlIG1hcmdpblRvcCB0byBzaGlmdCBpdCBhYm92ZSB0aGUgbGluZSB0byB0aGUgcHJldmlvdXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXI6IHRoaXMuYWN0aXZlQ29tbWVudCA/IHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyICsgMSA6IHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwcmVmZXJlbmNlOiBbbW9uYWNvV2luZG93Lm1vbmFjby5lZGl0b3IuQ29udGVudFdpZGdldFBvc2l0aW9uUHJlZmVyZW5jZS5CRUxPV11cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRDb250ZW50V2lkZ2V0KHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvcik7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QWN0aXZlQ29tbWVudChjb21tZW50OiBSZXZpZXdDb21tZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1Zygnc2V0QWN0aXZlQ29tbWVudCcsIGNvbW1lbnQpO1xyXG5cclxuICAgICAgICBjb25zdCBsaW5lTnVtYmVyc1RvTWFrZURpcnR5ID0gW107XHJcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29tbWVudCAmJiAoIWNvbW1lbnQgfHwgdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIgIT09IGNvbW1lbnQubGluZU51bWJlcikpIHtcclxuICAgICAgICAgICAgbGluZU51bWJlcnNUb01ha2VEaXJ0eS5wdXNoKHRoaXMuYWN0aXZlQ29tbWVudC5saW5lTnVtYmVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbW1lbnQpIHtcclxuICAgICAgICAgICAgbGluZU51bWJlcnNUb01ha2VEaXJ0eS5wdXNoKGNvbW1lbnQubGluZU51bWJlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmFjdGl2ZUNvbW1lbnQgPSBjb21tZW50O1xyXG4gICAgICAgIGlmIChsaW5lTnVtYmVyc1RvTWFrZURpcnR5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5maWx0ZXJBbmRNYXBDb21tZW50cyhsaW5lTnVtYmVyc1RvTWFrZURpcnR5LCAoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaXRlbS52aWV3U3RhdGUucmVuZGVyU3RhdHVzID0gUmV2aWV3Q29tbWVudFN0YXR1cy5kaXJ0eVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGF5b3V0SW5saW5lVG9vbGJhcigpIHtcclxuICAgICAgICBjb25zdCB0b29sYmFyUm9vdCA9IHRoaXMud2lkZ2V0SW5saW5lVG9vbGJhci5nZXREb21Ob2RlKCkgYXMgSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgdG9vbGJhclJvb3Quc3R5bGUubWFyZ2luVG9wID0gYC0ke3RoaXMuY2FsY3VsYXRlTWFyZ2luVG9wT2Zmc2V0KDIpfXB4YDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdG9vbGJhclJvb3Quc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5nZXRUaGVtZWRDb2xvcihcImVkaXRvci5iYWNrZ3JvdW5kXCIpO1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmxheW91dENvbnRlbnRXaWRnZXQodGhpcy53aWRnZXRJbmxpbmVUb29sYmFyKTtcclxuICAgIH1cclxuXHJcbiAgICBmaWx0ZXJBbmRNYXBDb21tZW50cyhsaW5lTnVtYmVyczogbnVtYmVyW10sIGZuOiB7IChjb21tZW50OiBSZXZpZXdDb21tZW50SXRlckl0ZW0pOiB2b2lkIH0pIHtcclxuICAgICAgICBjb25zdCBjb21tZW50cyA9IHRoaXMuaXRlcmF0ZUNvbW1lbnRzKCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBjIG9mIGNvbW1lbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChsaW5lTnVtYmVycy5pbmRleE9mKGMuY29tbWVudC5saW5lTnVtYmVyKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBmbihjKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVNb3VzZURvd24oZXY6IHsgdGFyZ2V0OiB7IGVsZW1lbnQ6IHsgaGFzQXR0cmlidXRlOiB7IChzdHJpbmcpOiBib29sZWFuIH0gfSwgZGV0YWlsOiBhbnkgfSB9KSB7XHJcbiAgICAgICAgaWYgKGV2LnRhcmdldC5lbGVtZW50Lmhhc0F0dHJpYnV0ZShDT05UUk9MX0FUVFJfTkFNRSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBhY3RpdmVDb21tZW50OiBSZXZpZXdDb21tZW50ID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmIChldi50YXJnZXQuZGV0YWlsICYmIGV2LnRhcmdldC5kZXRhaWwudmlld1pvbmVJZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgdGhpcy5pdGVyYXRlQ29tbWVudHMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtLnZpZXdTdGF0ZS52aWV3Wm9uZUlkID09IGV2LnRhcmdldC5kZXRhaWwudmlld1pvbmVJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVDb21tZW50ID0gaXRlbS5jb21tZW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDb21tZW50KGFjdGl2ZUNvbW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hDb21tZW50cygpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEVkaXRvck1vZGUoRWRpdG9yTW9kZS50b29sYmFyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVNYXJnaW5Ub3BPZmZzZXQoZXh0cmFPZmZzZXRMaW5lczogbnVtYmVyID0gMSk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IGlkeCA9IDA7XHJcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcclxuICAgICAgICBsZXQgbWFyZ2luVG9wOiBudW1iZXIgPSAwO1xyXG4gICAgICAgIGNvbnN0IGxpbmVIZWlnaHQgPSB0aGlzLmNvbmZpZy5saW5lSGVpZ2h0Oy8vRklYTUUgLSBNYWdpYyBudW1iZXIgZm9yIGxpbmUgaGVpZ2h0ICAgICAgICAgICAgXHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZUNvbW1lbnQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LmxpbmVOdW1iZXIgPT0gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmNvbW1lbnQgPT0gdGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWR4ID0gY291bnQgKyAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hcmdpblRvcCA9ICgoZXh0cmFPZmZzZXRMaW5lcyArIGNvdW50IC0gaWR4KSAqIGxpbmVIZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG1hcmdpblRvcDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHNldEVkaXRvck1vZGUobW9kZTogRWRpdG9yTW9kZSk6IHsgbGluZU51bWJlcjogbnVtYmVyLCB0ZXh0OiBzdHJpbmcgfSB7XHJcbiAgICAgICAgY29uc29sZS5kZWJ1Zygnc2V0RWRpdG9yTW9kZScsIHRoaXMuYWN0aXZlQ29tbWVudCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxpbmVOdW1iZXIgPSB0aGlzLmFjdGl2ZUNvbW1lbnQgPyB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciA6IHRoaXMuZWRpdG9yLmdldFBvc2l0aW9uKCkubGluZU51bWJlcjtcclxuICAgICAgICB0aGlzLmVkaXRvck1vZGUgPSBtb2RlO1xyXG5cclxuICAgICAgICBjb25zdCBlZGl0b3JSb290ID0gdGhpcy53aWRnZXRJbmxpbmVDb21tZW50RWRpdG9yLmdldERvbU5vZGUoKSBhcyBIVE1MRWxlbWVudDtcclxuICAgICAgICBlZGl0b3JSb290LnN0eWxlLm1hcmdpblRvcCA9IGAtJHt0aGlzLmNhbGN1bGF0ZU1hcmdpblRvcE9mZnNldCgpfXB4YDtcclxuXHJcblxyXG5cclxuICAgICAgICB0aGlzLmxheW91dElubGluZVRvb2xiYXIoKTtcclxuICAgICAgICB0aGlzLmVkaXRvci5sYXlvdXRDb250ZW50V2lkZ2V0KHRoaXMud2lkZ2V0SW5saW5lQ29tbWVudEVkaXRvcik7XHJcblxyXG4gICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLnRleHRhcmVhLnZhbHVlO1xyXG4gICAgICAgIHRoaXMudGV4dGFyZWEudmFsdWUgPSBcIlwiO1xyXG5cclxuICAgICAgICBpZiAobW9kZSA9PSBFZGl0b3JNb2RlLmVkaXRDb21tZW50KSB7XHJcbiAgICAgICAgICAgIC8vSEFDSyAtIGJlY2F1c2UgdGhlIGV2ZW50IGluIG1vbmFjbyBkb2Vzbid0IGhhdmUgcHJldmVudGRlZmF1bHQgd2hpY2ggbWVhbnMgZWRpdG9yIHRha2VzIGZvY3VzIGJhY2suLi4gICAgICAgICAgICBcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnRleHRhcmVhLmZvY3VzKCksIDEwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0LFxyXG4gICAgICAgICAgICBsaW5lTnVtYmVyOiBsaW5lTnVtYmVyXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDb21tZW50KGxpbmVOdW1iZXI6IG51bWJlciwgdGV4dDogc3RyaW5nKTogUmV2aWV3Q29tbWVudCB7XHJcbiAgICAgICAgY29uc3QgbG4gPSB0aGlzLmFjdGl2ZUNvbW1lbnQgPyB0aGlzLmFjdGl2ZUNvbW1lbnQubGluZU51bWJlciA6IGxpbmVOdW1iZXI7XHJcbiAgICAgICAgY29uc3QgY29tbWVudDogUmV2aWV3Q29tbWVudCA9IHtcclxuICAgICAgICAgICAgaWQ6IHV1aWQoKSxcclxuICAgICAgICAgICAgbGluZU51bWJlcjogbG4sXHJcbiAgICAgICAgICAgIGF1dGhvcjogdGhpcy5jdXJyZW50VXNlcixcclxuICAgICAgICAgICAgZHQ6IG5ldyBEYXRlKCksXHJcbiAgICAgICAgICAgIHRleHQ6IHRleHRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuY29tbWVudFN0YXRlW2NvbW1lbnQuaWRdID0gbmV3IFJldmlld0NvbW1lbnRTdGF0ZSh0aGlzLmNhbGN1bGF0ZU51bWJlck9mTGluZXModGV4dCkpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5hY3RpdmVDb21tZW50LmNvbW1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUNvbW1lbnQuY29tbWVudHMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUNvbW1lbnQuY29tbWVudHMucHVzaChjb21tZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvbW1lbnRzLnB1c2goY29tbWVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmZpbHRlckFuZE1hcENvbW1lbnRzKFtsbl0sIChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgIGl0ZW0udmlld1N0YXRlLnJlbmRlclN0YXR1cyA9IFJldmlld0NvbW1lbnRTdGF0dXMuZGlydHk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKClcclxuICAgICAgICB0aGlzLmxheW91dElubGluZVRvb2xiYXIoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLmNvbW1lbnRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBjb21tZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGl0ZXJhdGVDb21tZW50cyhjb21tZW50cz86IFJldmlld0NvbW1lbnRbXSwgZGVwdGg/OiBudW1iZXIsIHJlc3VsdHM/OiBSZXZpZXdDb21tZW50SXRlckl0ZW1bXSkge1xyXG4gICAgICAgIHJlc3VsdHMgPSByZXN1bHRzIHx8IFtdO1xyXG4gICAgICAgIGRlcHRoID0gZGVwdGggfHwgMDtcclxuICAgICAgICBjb21tZW50cyA9IGNvbW1lbnRzIHx8IHRoaXMuY29tbWVudHM7XHJcblxyXG4gICAgICAgIGlmIChjb21tZW50cykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGNvbW1lbnQgb2YgY29tbWVudHMpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVwdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWVudCxcclxuICAgICAgICAgICAgICAgICAgICB2aWV3U3RhdGU6IHRoaXMuY29tbWVudFN0YXRlW2NvbW1lbnQuaWRdXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjb21tZW50LmNvbW1lbnRzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVyYXRlQ29tbWVudHMoY29tbWVudC5jb21tZW50cywgZGVwdGggKyAxLCByZXN1bHRzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ29tbWVudChjb21tZW50OiBSZXZpZXdDb21tZW50KSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHRoaXMuaXRlcmF0ZUNvbW1lbnRzKFtjb21tZW50XSkpIHtcclxuICAgICAgICAgICAgaXRlbS5jb21tZW50LmRlbGV0ZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50ID09IGNvbW1lbnQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVDb21tZW50KG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLmxheW91dElubGluZVRvb2xiYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucmVmcmVzaENvbW1lbnRzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMub25DaGFuZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLmNvbW1lbnRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVmcmVzaENvbW1lbnRzKCkge1xyXG4gICAgICAgIHRoaXMuZWRpdG9yLmNoYW5nZVZpZXdab25lcygoY2hhbmdlQWNjZXNzb3IpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbGluZU51bWJlcnM6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiB0aGlzLml0ZXJhdGVDb21tZW50cygpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5jb21tZW50LmRlbGV0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdab25lLkRlbGV0ZScsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUoaXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0udmlld1N0YXRlLnJlbmRlclN0YXR1cyA9PT0gUmV2aWV3Q29tbWVudFN0YXR1cy5oaWRkZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdab25lLkhpZGRlbicsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZUFjY2Vzc29yLnJlbW92ZVpvbmUoaXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52aWV3U3RhdGUudmlld1pvbmVJZCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLnZpZXdTdGF0ZS5yZW5kZXJTdGF0dXMgPT09IFJldmlld0NvbW1lbnRTdGF0dXMuZGlydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdab25lLkRpcnR5JywgaXRlbS5jb21tZW50LmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlQWNjZXNzb3IucmVtb3ZlWm9uZShpdGVtLnZpZXdTdGF0ZS52aWV3Wm9uZUlkKTtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnZpZXdTdGF0ZS52aWV3Wm9uZUlkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnZpZXdTdGF0ZS5yZW5kZXJTdGF0dXMgPSBSZXZpZXdDb21tZW50U3RhdHVzLm5vcm1hbDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWl0ZW0udmlld1N0YXRlLnZpZXdab25lSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdab25lLkNyZWF0ZScsIGl0ZW0uY29tbWVudC5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVOdW1iZXJzW2l0ZW0uY29tbWVudC5saW5lTnVtYmVyXSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSB0aGlzLmFjdGl2ZUNvbW1lbnQgPT0gaXRlbS5jb21tZW50O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb21Ob2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpIGFzIEhUTUxTcGFuRWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnN0eWxlLm1hcmdpbkxlZnQgPSAodGhpcy5jb25maWcuY29tbWVudEluZGVudCAqIChpdGVtLmRlcHRoICsgMSkpICsgdGhpcy5jb25maWcuY29tbWVudEluZGVudE9mZnNldCArIFwicHhcIjtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuZ2V0VGhlbWVkQ29sb3IoXCJlZGl0b3Iuc2VsZWN0aW9uSGlnaGxpZ2h0QmFja2dyb3VuZFwiKTtcclxuICAgICAgICAgICAgICAgICAgICBkb21Ob2RlLmNsYXNzTmFtZSA9IGByZXZpZXdDb21tZW50ICR7aXNBY3RpdmUgPyAnYWN0aXZlJyA6ICcgaW5hY3RpdmUnfWA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGF1dGhvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSBhcyBIVE1MU3BhbkVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aG9yLmNsYXNzTmFtZSA9ICdyZXZpZXdDb21tZW50IGF1dGhvcidcclxuICAgICAgICAgICAgICAgICAgICBhdXRob3IuaW5uZXJUZXh0ID0gYCR7aXRlbS5jb21tZW50LmF1dGhvciB8fCAnICd9IGF0IGA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGR0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpIGFzIEhUTUxTcGFuRWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICBkdC5jbGFzc05hbWUgPSAncmV2aWV3Q29tbWVudCBkdCdcclxuICAgICAgICAgICAgICAgICAgICBkdC5pbm5lclRleHQgPSBpdGVtLmNvbW1lbnQuZHQudG9Mb2NhbGVTdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSBhcyBIVE1MU3BhbkVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dC5jbGFzc05hbWUgPSAncmV2aWV3Q29tbWVudCB0ZXh0J1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQuaW5uZXJUZXh0ID0gYCR7aXRlbS5jb21tZW50LnRleHR9IGJ5IGA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQodGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZG9tTm9kZS5hcHBlbmRDaGlsZChhdXRob3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvbU5vZGUuYXBwZW5kQ2hpbGQoZHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnZpZXdTdGF0ZS52aWV3Wm9uZUlkID0gY2hhbmdlQWNjZXNzb3IuYWRkWm9uZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyTGluZU51bWJlcjogaXRlbS5jb21tZW50LmxpbmVOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodEluTGluZXM6IGl0ZW0udmlld1N0YXRlLm51bWJlck9mTGluZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbU5vZGU6IGRvbU5vZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1cHByZXNzTW91c2VEb3duOiB0cnVlIC8vIFRoaXMgc3RvcHMgZm9jdXMgYmVpbmcgbG9zdCB0aGUgZWRpdG9yIC0gbWVhbmluZyBrZXlib2FyZCBzaG9ydGN1dHMga2VlcHMgd29ya2luZ1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jb25maWcuc2hvd0luUnVsZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlY29yYXRvcnMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbG4gaW4gbGluZU51bWJlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWNvcmF0b3JzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZTogbmV3IG1vbmFjb1dpbmRvdy5tb25hY28uUmFuZ2UobG4sIDAsIGxuLCAwKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNXaG9sZUxpbmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdmVydmlld1J1bGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHRoaXMuY29uZmlnLnJ1bGVyTWFya2VyQ29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGFya0NvbG9yOiB0aGlzLmNvbmZpZy5ydWxlck1hcmtlckRhcmtDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogMVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL1RPRE8gLSBQcmVzZXJ2ZXIgYW55IG90aGVyIGRlY29yYXRvcnNcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLmRlbHRhRGVjb3JhdGlvbnMoW10sIGRlY29yYXRvcnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQWN0aW9ucygpIHtcclxuICAgICAgICB0aGlzLmVkaXRvci5hZGRBY3Rpb24oe1xyXG4gICAgICAgICAgICBpZDogJ215LXVuaXF1ZS1pZC1hZGQnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ0FkZCBDb21tZW50JyxcclxuICAgICAgICAgICAga2V5YmluZGluZ3M6IFtcclxuICAgICAgICAgICAgICAgIG1vbmFjb1dpbmRvdy5tb25hY28uS2V5TW9kLkN0cmxDbWQgfCBtb25hY29XaW5kb3cubW9uYWNvLktleUNvZGUuRjEwLFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICBwcmVjb25kaXRpb246IG51bGwsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdDb250ZXh0OiBudWxsLFxyXG4gICAgICAgICAgICBjb250ZXh0TWVudUdyb3VwSWQ6ICduYXZpZ2F0aW9uJyxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVPcmRlcjogMCxcclxuXHJcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JNb2RlKEVkaXRvck1vZGUuZWRpdENvbW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZEFjdGlvbih7XHJcbiAgICAgICAgICAgIGlkOiAnbXktdW5pcXVlLWlkLW5leHQnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ05leHQgQ29tbWVudCcsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdzOiBbXHJcbiAgICAgICAgICAgICAgICBtb25hY29XaW5kb3cubW9uYWNvLktleU1vZC5DdHJsQ21kIHwgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlDb2RlLkYxMixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcHJlY29uZGl0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nQ29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVHcm91cElkOiAnbmF2aWdhdGlvbicsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51T3JkZXI6IDAuMSxcclxuXHJcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ29tbWVudChOYXZpZ2F0aW9uRGlyZWN0aW9uLm5leHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdG9yLmFkZEFjdGlvbih7XHJcbiAgICAgICAgICAgIGlkOiAnbXktdW5pcXVlLWlkLXByZXYnLFxyXG4gICAgICAgICAgICBsYWJlbDogJ1ByZXYgQ29tbWVudCcsXHJcbiAgICAgICAgICAgIGtleWJpbmRpbmdzOiBbXHJcbiAgICAgICAgICAgICAgICBtb25hY29XaW5kb3cubW9uYWNvLktleU1vZC5DdHJsQ21kIHwgbW9uYWNvV2luZG93Lm1vbmFjby5LZXlDb2RlLkYxMSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcHJlY29uZGl0aW9uOiBudWxsLFxyXG4gICAgICAgICAgICBrZXliaW5kaW5nQ29udGV4dDogbnVsbCxcclxuICAgICAgICAgICAgY29udGV4dE1lbnVHcm91cElkOiAnbmF2aWdhdGlvbicsXHJcbiAgICAgICAgICAgIGNvbnRleHRNZW51T3JkZXI6IDAuMSxcclxuXHJcbiAgICAgICAgICAgIHJ1bjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvQ29tbWVudChOYXZpZ2F0aW9uRGlyZWN0aW9uLnByZXYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgbmF2aWdhdGVUb0NvbW1lbnQoZGlyZWN0aW9uOiBOYXZpZ2F0aW9uRGlyZWN0aW9uKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRMaW5lID0gMDtcclxuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb21tZW50KSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRMaW5lID0gdGhpcy5hY3RpdmVDb21tZW50LmxpbmVOdW1iZXI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY3VycmVudExpbmUgPSB0aGlzLmVkaXRvci5nZXRQb3NpdGlvbigpLmxpbmVOdW1iZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBjb21tZW50cyA9IHRoaXMuY29tbWVudHMuZmlsdGVyKChjKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChkaXJlY3Rpb24gPT09IE5hdmlnYXRpb25EaXJlY3Rpb24ubmV4dCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGMubGluZU51bWJlciA+IGN1cnJlbnRMaW5lO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gTmF2aWdhdGlvbkRpcmVjdGlvbi5wcmV2KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYy5saW5lTnVtYmVyIDwgY3VycmVudExpbmU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKGNvbW1lbnRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb21tZW50cy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBOYXZpZ2F0aW9uRGlyZWN0aW9uLm5leHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5saW5lTnVtYmVyIC0gYi5saW5lTnVtYmVyO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09IE5hdmlnYXRpb25EaXJlY3Rpb24ucHJldikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBiLmxpbmVOdW1iZXIgLSBhLmxpbmVOdW1iZXI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29tbWVudCA9IGNvbW1lbnRzWzBdO1xyXG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUNvbW1lbnQoY29tbWVudClcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoQ29tbWVudHMoKTtcclxuICAgICAgICAgICAgdGhpcy5sYXlvdXRJbmxpbmVUb29sYmFyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLnJldmVhbExpbmVJbkNlbnRlcihjb21tZW50LmxpbmVOdW1iZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuXHJcbmVudW0gTmF2aWdhdGlvbkRpcmVjdGlvbiB7XHJcbiAgICBuZXh0ID0gMSxcclxuICAgIHByZXYgPSAyXHJcbn1cclxuXHJcbmVudW0gRWRpdG9yTW9kZSB7XHJcbiAgICBlZGl0Q29tbWVudCA9IDEsXHJcbiAgICB0b29sYmFyID0gMlxyXG59XHJcblxyXG5lbnVtIFJldmlld0NvbW1lbnRTdGF0dXMge1xyXG4gICAgZGlydHkgPSAxLFxyXG4gICAgaGlkZGVuID0gMixcclxuICAgIG5vcm1hbCA9IDNcclxufSJdLCJzb3VyY2VSb290IjoiIn0=