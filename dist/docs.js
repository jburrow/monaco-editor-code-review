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
    reviewManager = index_1.createReviewManager(editor, "mr reviewer", createRandomComments(), function (updatedComments) { return renderComments(updatedComments); }, { editButtonEnableRemove: true });
    renderComments(reviewManager.comments);
}
function toggleTheme() {
    theme = theme == 'vs' ? 'vs-dark' : 'vs';
    win.monaco.editor.setTheme(theme);
}
function generateDifferentComments() {
    reviewManager.load(createRandomComments());
    renderComments(reviewManager.comments);
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
            id: "id-1",
            lineNumber: firstLine + 50,
            author: "another reviewer",
            dt: new Date(),
            text: "at start"
        },
        {
            id: "id-2",
            parentId: "id-1",
            lineNumber: firstLine + 5,
            author: "another reviewer",
            dt: '2019-01-01 12:22:33',
            text: "this code isn't very good",
        },
        {
            id: "id-3",
            parentId: "id-2",
            lineNumber: firstLine + 5,
            author: "original author",
            dt: new Date(),
            text: "I think you will find it is good enough"
        },
        {
            parentId: "id-3",
            lineNumber: firstLine + 5,
            author: "original author",
            dt: new Date(),
            text: "I think you will find it is good enough",
        },
        {
            parentId: "id-3",
            lineNumber: firstLine + 5,
            author: "original author",
            dt: new Date(),
            text: "I think you will find it is good enough",
        }
    ];
}
function renderComments(comments) {
    comments = comments || [];
    document.getElementById("summaryEditor").innerHTML = reviewManager.comments
        .map(function (comment) {
        return "<div style=\"display:flex;height:16px;text-decoration:" + (comment.status && comment.status === 2 ? 'line-through' : 'normal') + "\">\n                    <div style=\"width:100px;overflow:hidden;\">" + comment.id + "</div>\n                    <div style=\"width:50px;overflow:hidden;\">" + comment.lineNumber + "</div>\n                    <div style=\"width:100px;overflow:hidden;\">" + comment.author + "</div> \n                    <div style=\"width:100px;overflow:hidden;\">" + comment.dt + "</div> \n                    <div style=\"width:300px;overflow:hidden;\">" + comment.text + "</div>                    \n                </div>";
    })
        .join("");
}
function clearComments() {
    reviewManager.load([]);
    renderComments([]);
}
win.setView = setView;
win.generateDifferentComments = generateDifferentComments;
win.generateDifferentContents = generateDifferentContents;
win.toggleTheme = toggleTheme;
win.clearComments = clearComments;
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
            for (var _i = 0, _a = Object.values(_this.commentState); _i < _a.length; _i++) {
                var viewState = _a[_i];
                if (viewState.viewZoneId) {
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
    ReviewManager.prototype.layoutInlineToolbar = function () {
        var toolbarRoot = this.widgetInlineToolbar.getDomNode();
        if (this.activeComment) {
            toolbarRoot.style.marginTop = "-" + this.calculateMarginTopOffset(2) + "px";
        }
        toolbarRoot.style.backgroundColor = this.getThemedColor("editor.background");
        this.editor.layoutContentWidget(this.widgetInlineToolbar);
    };
    ReviewManager.prototype.filterAndMapComments = function (lineNumbers, fn) {
        for (var _i = 0, _a = this.comments; _i < _a.length; _i++) {
            var comment = _a[_i];
            if (lineNumbers.indexOf(comment.lineNumber) > -1) {
                fn(comment);
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
        var _this = this;
        var ln = this.activeComment ? this.activeComment.lineNumber : lineNumber;
        var comment = {
            id: uuid(),
            lineNumber: ln,
            author: this.currentUser,
            dt: new Date(),
            text: text,
            status: ReviewCommentStatus.active,
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
    ReviewManager.prototype._recurse = function (allComments, filterFn, depth, results) {
        var comments = Object.values(allComments).filter(filterFn); //TODO - sort by dt
        var _loop_1 = function (comment) {
            delete allComments[comment.id];
            results.push({
                depth: depth,
                comment: comment,
                viewState: this_1.commentState[comment.id]
            });
            this_1._recurse(allComments, function (x) { return x.parentId === comment.id; }, depth + 1, results);
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
        this._recurse(tmpComments, filterFn, 0, results);
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
var ReviewCommentRenderState;
(function (ReviewCommentRenderState) {
    ReviewCommentRenderState[ReviewCommentRenderState["dirty"] = 1] = "dirty";
    ReviewCommentRenderState[ReviewCommentRenderState["hidden"] = 2] = "hidden";
    ReviewCommentRenderState[ReviewCommentRenderState["normal"] = 3] = "normal";
})(ReviewCommentRenderState || (ReviewCommentRenderState = {}));


/***/ })

/******/ });
//# sourceMappingURL=docs.js.map