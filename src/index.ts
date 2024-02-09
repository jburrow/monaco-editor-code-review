import type * as monacoEditor from "monaco-editor";
import {
  reduceComments,
  ReviewCommentStatus,
  commentReducer,
  type CodeSelection,
  type ReviewCommentStore,
  ReviewCommentState,
  type ProposedReviewCommentEvent,
  type ReviewComment,
  ReviewCommentRenderState,
  type ReviewCommentEvent,
} from "./events-comments-reducers";

import { convertMarkdownToHTML } from "./comment";
import * as uuid from "uuid";

export {
  type ReviewCommentStore,
  type ProposedReviewCommentEvent as ReviewCommentEvent,
  reduceComments,
  ReviewCommentStatus,
  commentReducer,
  type CodeSelection,
  ReviewCommentState,
  type ReviewComment,
  ReviewCommentRenderState,
  convertMarkdownToHTML,
};

interface MonacoWindow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  monaco: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const monacoWindow = window as any as MonacoWindow;

enum NavigationDirection {
  next = 1,
  prev = 2,
}

export enum EditorMode {
  insertComment = 1,
  replyComment = 2,
  editComment = 3,
  toolbar = 4,
}

export function createReviewManager(
  editor: monacoEditor.editor.IStandaloneCodeEditor,
  currentUser: string,
  events?: ReviewCommentEvent[],
  onChange?: OnActionsChanged,
  config?: ReviewManagerConfig,
  verbose?: boolean,
): ReviewManager {
  // For Debug: (window as any).editor = editor;
  const rm = new ReviewManager(editor, currentUser, onChange, config, verbose);
  rm.load(events ?? []);
  return rm;
}

export interface ReviewCommentIterItem {
  depth: number;
  state: ReviewCommentState;
}

type OnActionsChanged = (actions: ReviewCommentEvent[]) => void;

interface IEventRenderStoreItem {
  target?: { detail?: RenderStoreItem };
}

export const defaultStyles: Record<string, unknown> = {
  reviewComment: {
    "font-family": `font-family: Monaco, Menlo, Consolas, "Droid Sans Mono", "Inconsolata",
  "Courier New", monospace;`,
    "font-size": "12px",
  },
  "reviewComment.dt": {},
  "reviewComment.active": { border: "1px solid darkorange" },
  "reviewComment.inactive": {},
  "reviewComment.author": {},
  "reviewComment.text": {},
  reviewCommentEditor: {
    padding: "5px",
    border: "1px solid blue",
    "margin-left": "1px",
    "box-shadow": " 0px 0px 4px 2px lightblue",
    "font-family": 'font-family: Monaco, Menlo, Consolas, "Droid Sans Mono", "Inconsolata"',
  },
  "reviewCommentEditor.save": { width: "150px" },
  "reviewCommentEditor.cancel": { width: "150px" },
  "reviewCommentEditor.text": { width: "calc(100% - 5px)", resize: "none" },
  editButtonsContainer: { cursor: "pointer", fontSize: "12px" },
  "editButton.add": {},
  "editButton.remove": {},
  "editButton.edit": {},
};

export interface ReviewManagerConfig {
  commentIndent?: number;
  commentIndentOffset?: number;
  editButtonAddText?: string;
  editButtonEnableRemove?: boolean;
  editButtonOffset?: string;
  editButtonRemoveText?: string;
  formatDate?: FormatDate;
  readOnly?: boolean;
  reviewCommentIconActive?: string;
  reviewCommentIconSelect?: string;
  showInRuler?: boolean;
  renderComment?: (isActive: boolean, comment: ReviewCommentIterItem) => HTMLElement;
  styles?: Record<string, unknown>;
  setClassNames?: boolean;
  verticalOffset?: number;
  enableMarkdown?: boolean;
}

export type FormatDate = (dt: Date | string) => string;

interface ReviewManagerConfigPrivate {
  commentIndent: number;
  commentIndentOffset: number;
  editButtonAddText: string;
  editButtonEditText: string;
  editButtonEnableEdit: boolean;
  editButtonEnableRemove: boolean;
  editButtonOffset: string;
  editButtonRemoveText: string;
  formatDate?: FormatDate;
  readOnly: boolean;
  rulerMarkerColor: string;
  rulerMarkerDarkColor: string;
  showAddCommentGlyph: boolean;
  showInRuler: boolean;
  renderComment?: (isActive: boolean, comment: ReviewCommentIterItem) => HTMLElement;
  styles: Record<string, unknown>;
  setClassNames: boolean;
  verticalOffset: number;
  enableMarkdown: boolean;
}

const defaultReviewManagerConfig: ReviewManagerConfigPrivate = {
  commentIndent: 20,
  commentIndentOffset: 20,
  editButtonAddText: "Reply",
  editButtonEditText: "Edit",
  editButtonEnableEdit: true,
  editButtonEnableRemove: true,
  editButtonOffset: "-10px",
  editButtonRemoveText: "Remove",

  readOnly: false,
  rulerMarkerColor: "darkorange",
  rulerMarkerDarkColor: "darkorange",
  showAddCommentGlyph: true,
  showInRuler: true,
  styles: { ...defaultStyles },
  setClassNames: true,
  verticalOffset: 0,
  enableMarkdown: false,
};

const CONTROL_ATTR_NAME = "ReviewManagerControl";
const POSITION_BELOW = 2; // above=1, below=2, exact=0

interface EditorElements {
  cancel: HTMLButtonElement;
  confirm: HTMLButtonElement;
  root: HTMLSpanElement;
  textarea: HTMLTextAreaElement;
}

interface InlineToolbarElements {
  add: HTMLSpanElement;
  edit?: HTMLSpanElement;
  remove?: HTMLSpanElement;
  root: HTMLDivElement;
}
interface RenderStoreItem {
  viewZoneId?: string;
  renderStatus?: ReviewCommentRenderState;
}

export class ReviewManager {
  currentUser: string;
  editor: monacoEditor.editor.IStandaloneCodeEditor;
  editorConfig: monacoEditor.editor.IEditorOptions;
  events: ReviewCommentEvent[];
  store: ReviewCommentStore;
  activeComment?: ReviewComment;
  widgetInlineToolbar?: monacoEditor.editor.IContentWidget;
  widgetInlineCommentEditor?: monacoEditor.editor.IContentWidget;
  onChange?: OnActionsChanged;
  editorMode: EditorMode;
  config: ReviewManagerConfigPrivate;
  currentLineDecorations: string[];
  currentCommentDecorations: string[];
  currentLineDecorationLineNumber?: number;

  editorElements: EditorElements;
  inlineToolbarElements: InlineToolbarElements;
  verbose: boolean;
  canAddCondition: monacoEditor.editor.IContextKey<boolean>;
  canCancelCondition: monacoEditor.editor.IContextKey<boolean>;
  private _renderStore: Record<string, RenderStoreItem>;

  constructor(
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    currentUser: string,
    onChange?: OnActionsChanged,
    config?: ReviewManagerConfig,
    verbose?: boolean,
  ) {
    this.currentUser = currentUser;
    this.editor = editor;
    this.activeComment = undefined; // TODO - consider moving onto the store
    this.widgetInlineToolbar = undefined;
    this.widgetInlineCommentEditor = undefined;
    this.onChange = onChange;
    this.editorMode = EditorMode.toolbar;
    this.config = { ...defaultReviewManagerConfig, ...(config ?? {}) };
    this.currentLineDecorations = [];
    this.currentCommentDecorations = [];
    this.currentLineDecorationLineNumber = undefined;
    this.events = [];
    this.store = { comments: {}, events: [] };
    this._renderStore = {};

    this.verbose = verbose === true;
    this.editorConfig = this.editor.getRawOptions() ?? {};
    this.editor.onDidChangeConfiguration(() => (this.editorConfig = this.editor.getRawOptions()));
    this.editor.onMouseDown(this.handleMouseDown.bind(this));
    this.canAddCondition = this.editor.createContextKey("add-context-key", !this.config.readOnly);
    this.canCancelCondition = this.editor.createContextKey("cancel-context-key", false);
    this.inlineToolbarElements = this.createInlineToolbarWidget();
    this.editorElements = this.createInlineEditorWidget();
    this.addActions();

    if (this.config.showAddCommentGlyph) {
      this.editor.onMouseMove(this.handleMouseMove.bind(this));
    }

    this.createCustomCssClasses();
  }

  createCustomCssClasses(): void {
    const id = "monaco_review_custom_styles";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = "monaco_review_custom_styles";
      style.innerHTML = `

    .activeLineMarginClass {
      z-index:10;
      background-image: url("data:image/svg+xml;base64,Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5MYXllciAxPC90aXRsZT4KICA8ZyBpZD0ic3ZnXzIiPgogICA8cGF0aCBmaWxsPSJkYXJrb3JhbmdlIiBkPSJtMTIuNDAxMzUsMTUuMjE0NzlsLTkuMjY4MjIsMHEtMS4xNTU3NSwwIC0xLjk2Njk5LC0wLjcyNzJ0LTAuODExMjUsLTEuNzYzMjFsMCwtOS45NjE2NXEwLC0xLjAzNjAxIDAuODExMjUsLTEuNzYzMjF0MS45NjY5OSwtMC43MjcybDkuMjY4MjIsMHExLjE1NTc0LDAgMS45NjY5OSwwLjcyNzJ0MC44MTEyNSwxLjc2MzIxbDAsOS45NjE2NXEwLDEuMDM2MDEgLTAuODExMjUsMS43NjMyMXQtMS45NjY5OSwwLjcyNzJ6bS05LjI2ODIyLC0xMy4yODg4M3EtMC4zNzc4NCwwIC0wLjY1NTY2LDAuMjQ5MDR0LTAuMjc3ODMsMC41ODc3M2wwLDkuOTYxNjVxMCwwLjMzODcgMC4yNzc4MywwLjU4Nzc0dDAuNjU1NjYsMC4yNDkwNGw5LjI2ODIyLDBxMC4zNzc4NCwwIDAuNjQ0NTUsLTAuMjQ5MDR0MC4yNjY3MSwtMC41ODc3NGwwLC05Ljk2MTY1cTAsLTAuMzM4NjkgLTAuMjY2NzEsLTAuNTg3NzN0LTAuNjQ0NTUsLTAuMjQ5MDRsLTkuMjY4MjIsMHptOC4zMzQ3Myw0Ljk4MDgybC03LjQwMTI0LDBxLTAuNDY2NzQsMCAtMC40NjY3NCwtMC4zOTg0N3EwLC0wLjE3OTMxIDAuMTMzMzUsLTAuMjk4ODV0MC4zMzMzOSwtMC4xMTk1NGw3LjQwMTI0LDBxMC4yMDAwMywwIDAuMzMzMzksMC4xMTk1NHQwLjEzMzM1LDAuMjk4ODVxMCwwLjM5ODQ3IC0wLjQ2Njc0LDAuMzk4NDd6bTAsLTIuNDkwNDFsLTcuNDAxMjQsMHEtMC4yMDAwMywwIC0wLjMzMzM5LC0wLjExOTU0dC0wLjEzMzM1LC0wLjI5ODg1cTAsLTAuMzk4NDcgMC40NjY3NCwtMC4zOTg0N2w3LjQwMTI0LDBxMC40NjY3NCwwIDAuNDY2NzQsMC4zOTg0N3EwLDAuMTc5MzEgLTAuMTMzMzUsMC4yOTg4NXQtMC4zMzMzOSwwLjExOTU0em0wLDQuOTgwODJsLTcuNDAxMjQsMHEtMC4yMDAwMywwIC0wLjMzMzM5LC0wLjExOTU0dC0wLjEzMzM1LC0wLjI5ODg1cTAsLTAuMzk4NDYgMC40NjY3NCwtMC4zOTg0Nmw3LjQwMTI0LDBxMC40NjY3NCwwIDAuNDY2NzQsMC4zOTg0NnEwLDAuMTc5MzEgLTAuMTMzMzUsMC4yOTg4NXQtMC4zMzMzOSwwLjExOTU0em0wLDIuNDkwNDFsLTcuNDAxMjQsMHEtMC40NjY3NCwwIC0wLjQ2Njc0LC0wLjM5ODQ2cTAsLTAuMTc5MzEgMC4xMzMzNSwtMC4yOTg4NXQwLjMzMzM5LC0wLjExOTU0bDcuNDAxMjQsMHEwLjIwMDAzLDAgMC4zMzMzOSwwLjExOTU0dDAuMTMzMzUsMC4yOTg4NXEwLDAuMzk4NDYgLTAuNDY2NzQsMC4zOTg0NnoiIGlkPSJzdmdfMSIgc3Ryb2tlPSJudWxsIi8+CiAgPC9nPgogPC9nPgo8L3N2Zz4=");
    }`;

      document.getElementsByTagName("head")[0].appendChild(style);
    }
  }

  setReadOnlyMode(value: boolean): void {
    this.config.readOnly = value;
    this.canAddCondition.set(!value);
    this.renderAddCommentLineDecoration(undefined);
  }

  load(events: ReviewCommentEvent[]): void {
    const store = reduceComments(events);
    this.loadFromStore(store, events);
  }

  loadFromStore(store: ReviewCommentStore, events: ReviewCommentEvent[]): void {
    this.editor.changeViewZones((changeAccessor: monacoEditor.editor.IViewZoneChangeAccessor) => {
      // Remove all the existing comments
      for (const viewState of Object.values(this.store.comments)) {
        const rs = this.getRenderState(viewState.comment.id);
        if (rs.viewZoneId) {
          changeAccessor.removeZone(rs.viewZoneId);
        }
      }

      this.events = events;
      this.store = store;
      this.store.deletedCommentIds = undefined;
      this.store.dirtyCommentIds = undefined;
      this._renderStore = {};

      this.refreshComments();

      this.verbose &&
        console.debug(
          "[monaco-review] Events Loaded:",
          events.length,
          "Review Comments:",
          Object.values(this.store.comments).length,
        );
    });
  }

  getThemedColor(name: string): string {
    // editor.background: e {rgba: e}
    // editor.foreground: e {rgba: e}
    // editor.inactiveSelectionBackground: e {rgba: e}
    // editor.selectionHighlightBackground: e {rgba: e}
    // editorIndentGuide.activeBackground: e {rgba: e}
    // editorIndentGuide.background: e {rgba: e}
    let themeName = null;
    let value = null;
    let theme = null;

    const themeService = (
      this.editor as unknown as {
        _themeService: {
          _theme?: { getColor: (name: string) => string };
          getTheme: () => { themeName?: string; getColor: (name: string) => string };
        };
      }
    )._themeService;

    if (themeService.getTheme !== undefined) {
      // v21
      theme = themeService.getTheme();
      themeName = theme.themeName;
    } else if (themeService._theme !== undefined) {
      // v20
      theme = themeService._theme;
    }

    value = theme?.getColor(name);

    // HACK - Buttons themes are not in monaco ... so just hack in theme for dark
    const missingThemes: Record<string, Record<string, string>> = {
      dark: {
        "button.background": "#0e639c",
        "button.foreground": "#ffffff",
      },
      light: {
        "button.background": "#007acc",
        "button.foreground": "#ffffff",
      },
    };
    if (!value) {
      value = missingThemes[themeName?.includes("dark") ? "dark" : "light"][name];
    }
    return value;
  }

  applyStyles(element: HTMLElement, className: string) {
    if (this.config.styles[className] === undefined) {
      console.warn("[monaco-review] [CLASSNAME]", className);
    } else {
      const styles = this.config.styles[className] as { [s: string]: string };
      if (styles) {
        for (const [key, value] of Object.entries<string>(styles)) {
          element.style.setProperty(key, value);
        }
      }

      if (this.config.setClassNames) {
        element.className = className;
      }
    }
  }

  createInlineEditButtonsElement(): InlineToolbarElements {
    const root = document.createElement("div");
    this.applyStyles(root, "editButtonsContainer");
    root.style.marginLeft = this.config.editButtonOffset;
    // root.style.marginTop = "100px";
    // root.style.fontSize = "12px";

    const add = document.createElement("span");
    add.innerText = this.config.editButtonAddText;
    this.applyStyles(add, "editButton.add");
    add.setAttribute(CONTROL_ATTR_NAME, "");
    add.onclick = () => {
      this.setEditorMode(EditorMode.replyComment, "reply-comment-inline-button");
    };
    root.appendChild(add);

    let remove;
    let edit;
    let spacer = null;

    if (this.config.editButtonEnableRemove) {
      spacer = document.createElement("div");
      spacer.innerText = " ";
      root.appendChild(spacer);

      remove = document.createElement("span");
      remove.setAttribute(CONTROL_ATTR_NAME, "");
      remove.innerText = this.config.editButtonRemoveText;
      this.applyStyles(remove, "editButton.remove");

      remove.onclick = () => this.activeComment && this.removeComment(this.activeComment.id);
      root.appendChild(remove);
    }

    if (this.config.editButtonEnableEdit) {
      spacer = document.createElement("div");
      spacer.innerText = " ";
      root.appendChild(spacer);

      edit = document.createElement("span");
      edit.setAttribute(CONTROL_ATTR_NAME, "");
      edit.innerText = this.config.editButtonEditText;

      this.applyStyles(edit, "editButton.edit");
      edit.onclick = () => {
        this.setEditorMode(EditorMode.editComment, "edit-comment-button");
      };
      root.appendChild(edit);
    }

    return { root, add, remove, edit };
  }

  handleCancel() {
    console.debug("[monaco-review] [handleCancel]");
    this.setActiveComment(undefined, "cancel");
    this.setEditorMode(EditorMode.toolbar, "cancel");
    this.editor.focus();
  }

  handleAddComment() {
    // FIX - this isn't right.
    const lineNumber = this.activeComment
      ? this.activeComment.lineNumber
      : this.editor.getSelection()?.endLineNumber ?? 1;
    const text = this.editorElements.textarea.value;
    const selection = this.activeComment ? undefined : (this.editor.getSelection() as CodeSelection);
    this.addComment(lineNumber, text, selection);
    this.setEditorMode(EditorMode.toolbar, "add-comment-1");
    this.editor.focus();
  }

  handleTextAreaKeyDown(e: KeyboardEvent) {
    if (e.code === "Escape") {
      this.handleCancel();
      e.preventDefault();
      console.info("[handleTextAreaKeyDown] preventDefault: Escape Key");
    } else if (e.code === "Enter" && e.ctrlKey) {
      this.handleAddComment();
      e.preventDefault();
      console.info("[handleTextAreaKeyDown] preventDefault: ctrl+Enter");
    }
  }

  createInlineEditorElement(): EditorElements {
    const root = document.createElement("div");
    this.applyStyles(root, "reviewCommentEditor");

    const textarea = document.createElement("textarea");
    textarea.setAttribute(CONTROL_ATTR_NAME, "");
    this.applyStyles(textarea, "reviewCommentEditor.text");
    textarea.innerText = "";
    textarea.rows = 3;
    textarea.name = "text";
    textarea.onkeydown = this.handleTextAreaKeyDown.bind(this);

    const confirm = document.createElement("button");
    confirm.setAttribute(CONTROL_ATTR_NAME, "");
    this.applyStyles(confirm, "reviewCommentEditor.save");

    confirm.innerText = "placeholder add";
    confirm.onclick = this.handleAddComment.bind(this);

    const cancel = document.createElement("button");
    cancel.setAttribute(CONTROL_ATTR_NAME, "");
    this.applyStyles(cancel, "reviewCommentEditor.cancel");
    cancel.innerText = "Cancel";
    cancel.onclick = this.handleCancel.bind(this);

    root.appendChild(textarea);
    root.appendChild(cancel);
    root.appendChild(confirm);

    return { root, confirm, cancel, textarea };
  }

  createInlineToolbarWidget() {
    const buttonsElement = this.createInlineEditButtonsElement();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const this_ = this;

    this.widgetInlineToolbar = {
      allowEditorOverflow: true,
      getId: () => {
        return "widgetInlineToolbar";
      },
      getDomNode: () => {
        return buttonsElement.root;
      },
      getPosition: () => {
        if (this_.activeComment && this_.editorMode == EditorMode.toolbar && !this_.config.readOnly) {
          return {
            position: {
              lineNumber: this_.activeComment.lineNumber,
              column: 1,
            },
            preference: [POSITION_BELOW],
          };
        }
        return null;
      },
    };

    this.editor.addContentWidget(this.widgetInlineToolbar);
    return buttonsElement;
  }

  calculateConfirmButtonText() {
    if (this.editorMode == EditorMode.insertComment) {
      return "Add Comment";
    }
    if (this.editorMode == EditorMode.replyComment) {
      return "Reply to Comment";
    } else {
      return "Edit Comment";
    }
  }

  createInlineEditorWidget(): EditorElements {
    // doesn't re-theme when
    const editorElement = this.createInlineEditorElement();

    this.widgetInlineCommentEditor = {
      allowEditorOverflow: true,
      getId: () => {
        return "widgetInlineEditor";
      },
      getDomNode: () => {
        return editorElement.root;
      },
      getPosition: () => {
        if (this.editorMode != EditorMode.toolbar) {
          const lineNumber = this.getActivePosition();
          if (lineNumber !== undefined) {
            editorElement.confirm.innerText = this.calculateConfirmButtonText();
            return {
              position: {
                lineNumber,
                column: 1,
              },
              preference: [2],
            };
          }
        }
        return null;
      },
    };

    this.editor.addContentWidget(this.widgetInlineCommentEditor);
    return editorElement;
  }

  getActivePosition(): number | undefined {
    const position = this.editor.getPosition();
    const activePosition = this.activeComment ? this.activeComment.lineNumber : position?.lineNumber;
    // does it need an offset?
    console.debug(
      "[monaco-review] [getActivePosition]",
      activePosition,
      this.activeComment?.lineNumber,
      position?.lineNumber,
    );
    return activePosition;
  }

  setActiveComment(comment?: ReviewComment, reason?: string) {
    this.verbose && console.debug("[monaco-review] [setActiveComment]", comment, reason);

    this.canCancelCondition.set(Boolean(this.activeComment));

    const isDifferentComment = this.activeComment !== comment;

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
        const rs = this.getRenderState(comment.id);
        rs.renderStatus = ReviewCommentRenderState.dirty;
      });
    }

    return isDifferentComment;
  }

  filterAndMapComments(lineNumbers: number[], fn: (comment: ReviewComment) => void) {
    for (const cs of Object.values(this.store.comments)) {
      if (lineNumbers.includes(cs.comment.lineNumber)) {
        fn(cs.comment);
      }
    }
  }

  handleMouseMove(ev: monacoEditor.editor.IEditorMouseEvent & IEventRenderStoreItem) {
    if (
      !ev.target?.detail?.viewZoneId &&
      ev.target?.position?.lineNumber &&
      ev.target.position.lineNumber !== this.currentLineDecorationLineNumber
    ) {
      this.currentLineDecorationLineNumber = ev.target.position.lineNumber;
      this.renderAddCommentLineDecoration(this.config.readOnly ? undefined : this.currentLineDecorationLineNumber);
    }
  }

  renderAddCommentLineDecoration(lineNumber?: number) {
    const modelDeltaDecorations: monacoEditor.editor.IModelDeltaDecoration[] = lineNumber
      ? [
          {
            range: new monacoWindow.monaco.Range(lineNumber, 0, lineNumber, 0),
            options: {
              marginClassName: "activeLineMarginClass", // TODO - fix the creation of this style
              zIndex: 100,
            },
          },
        ]
      : [];
    this.currentLineDecorations = this.editor.deltaDecorations(this.currentLineDecorations, modelDeltaDecorations);
  }

  private findCommentByViewZoneId(viewZoneId: string | undefined): ReviewComment | undefined {
    if (viewZoneId) {
      for (const cs of Object.values(this.store.comments)) {
        const rs = this.getRenderState(cs.comment.id);
        if (rs.viewZoneId === viewZoneId) {
          return cs.comment;
        }
      }
    }
  }

  handleMouseDown(ev: monacoEditor.editor.IEditorMouseEvent & IEventRenderStoreItem) {
    // Not ideal - but couldn't figure out a different way to identify the glyph event

    if (
      ev.target?.element?.className &&
      ev?.target?.element?.className.indexOf("activeLineMarginClass") > -1 &&
      this.currentLineDecorationLineNumber !== undefined
    ) {
      this.editor.setPosition({
        lineNumber: this.currentLineDecorationLineNumber,
        column: 1,
      });
      this.setEditorMode(EditorMode.insertComment, "mouse-down-1");
    } else if (!ev.target?.element?.hasAttribute(CONTROL_ATTR_NAME)) {
      const detail = ev.target.detail;
      const activeComment = this.findCommentByViewZoneId(detail?.viewZoneId);
      const commentChanged = this.setActiveComment(activeComment, "handleMouseDown");

      this.refreshComments();

      if (commentChanged && this.activeComment) {
        this.setEditorMode(EditorMode.toolbar, "mouse-down-2");
      }
    }
  }

  private calculateMarginTopOffset(includeActiveCommentHeight: boolean): number {
    let marginTop = 0;

    if (this.activeComment) {
      for (const item of this.iterateComments()) {
        if (
          item.state.comment.lineNumber === this.activeComment.lineNumber &&
          (item.state.comment != this.activeComment || includeActiveCommentHeight)
        ) {
          marginTop += this.commentHeightCache[this.getHeightCacheKey(item)] ?? 0;
        }

        if (item.state.comment == this.activeComment) {
          break;
        }
      }
    }
    return marginTop + this.config.verticalOffset;
  }

  layoutInlineToolbar() {
    this.inlineToolbarElements.root.style.backgroundColor = this.getThemedColor("editor.background");
    this.inlineToolbarElements.root.style.marginTop = `${this.calculateMarginTopOffset(false)}px`;

    if (this.inlineToolbarElements.remove) {
      const hasChildren =
        this.activeComment && this.iterateComments((c) => c.comment.id === this.activeComment?.id).length > 1;
      const isSameUser = this.activeComment && this.activeComment.author === this.currentUser;
      this.inlineToolbarElements.remove.style.display = hasChildren ? "none" : "";
      if (this.inlineToolbarElements.edit) {
        this.inlineToolbarElements.edit.style.display = hasChildren || !isSameUser ? "none" : "";
      }
    }
    if (this.widgetInlineToolbar) {
      this.editor.layoutContentWidget(this.widgetInlineToolbar);
    }
  }

  layoutInlineCommentEditor() {
    this.editorElements.root.style.backgroundColor = this.getThemedColor("editor.selectionHighlightBackground");
    this.editorElements.root.style.color = this.getThemedColor("editor.foreground");
    this.editorElements.root.style.marginTop = `${this.config.verticalOffset}px`;

    this.editorElements.textarea.style.backgroundColor = this.getThemedColor("editor.background");
    this.editorElements.textarea.style.color = this.getThemedColor("editor.foreground");

    [this.editorElements.confirm, this.editorElements.cancel].forEach((button) => {
      button.style.backgroundColor = this.getThemedColor("button.background");
      button.style.color = this.getThemedColor("button.foreground");
    });

    this.editorElements.confirm.innerText = this.editorMode === EditorMode.editComment ? "Edit Comment" : "Add Comment";

    if (this.widgetInlineCommentEditor) {
      this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
    }
  }

  setEditorMode(mode: EditorMode, why: string = "") {
    const activeComment = mode === EditorMode.insertComment ? undefined : this.activeComment;

    this.editorMode = this.config.readOnly ? EditorMode.toolbar : mode;
    this.verbose &&
      console.debug(
        "[monaco-review] setEditorMode",
        EditorMode[mode],
        why,
        "Comment:",
        activeComment,
        "ReadOnly:",
        this.config.readOnly,
        "Result:",
        EditorMode[this.editorMode],
      );

    this.layoutInlineToolbar();
    this.layoutInlineCommentEditor();
    this.setActiveComment(activeComment);
    this.refreshComments();

    if (mode != EditorMode.toolbar) {
      if (mode == EditorMode.insertComment || mode == EditorMode.replyComment) {
        this.editorElements.textarea.value = "";
      } else if (mode == EditorMode.editComment) {
        this.editorElements.textarea.value = activeComment?.text ? activeComment.text : "";
      }
      // HACK - because the event in monaco doesn't have preventdefault which means editor takes focus back...
      setTimeout(() => {
        this.editorElements.textarea.focus();
      }, 100); // TODO - make configurable
    }
  }

  getDateTimeNow(): number {
    return new Date().getTime();
  }

  private recurseComments(
    allComments: Record<string, ReviewCommentState>,
    filterFn: (c: ReviewCommentState) => boolean,
    depth: number,
    results: ReviewCommentIterItem[],
  ) {
    const comments = Object.values(allComments).filter(filterFn);
    for (const cs of comments) {
      const comment = cs.comment;
      delete allComments[comment.id];

      results.push({
        depth,
        state: cs,
      });
      this.recurseComments(allComments, (rcs) => rcs.comment.parentId === comment.id, depth + 1, results);
    }
  }

  private iterateComments(filterFn?: (c: ReviewCommentState) => boolean): ReviewCommentIterItem[] {
    if (!filterFn) {
      filterFn = (cs: ReviewCommentState) => !cs.comment.parentId;
    }
    const copyCommentState = { ...this.store.comments };
    const results: ReviewCommentIterItem[] = [];
    this.recurseComments(copyCommentState, filterFn, 0, results);
    return results;
  }

  removeComment(id: string): ReviewCommentEvent {
    return this.addEvent({ type: "delete", targetId: id });
  }

  addComment(lineNumber: number, text: string, selection?: CodeSelection): ReviewCommentEvent {
    const event: ProposedReviewCommentEvent =
      this.editorMode === EditorMode.editComment && this.activeComment?.id
        ? { type: "edit", text, targetId: this.activeComment.id }
        : {
            type: "create",
            text,
            lineNumber,
            selection,
            targetId: this.activeComment?.id,
          };

    return this.addEvent(event);
  }

  private addEvent(event: ProposedReviewCommentEvent): ReviewCommentEvent {
    const populatedEvent: ReviewCommentEvent = {
      ...event,
      createdBy: this.currentUser,
      createdAt: this.getDateTimeNow(),
      id: uuid.v4(),
    };

    console.debug("[addEvent]", populatedEvent);

    this.events.push(populatedEvent);
    this.store = commentReducer(populatedEvent, this.store);

    this.setActiveComment(undefined);
    this.refreshComments();
    this.layoutInlineToolbar();

    if (this.onChange) {
      this.onChange(this.events);
    }

    return populatedEvent;
  }

  private formatDate(dt: number): string {
    if (Number.isInteger(dt)) {
      try {
        const d = new Date(dt);
        if (this.config.formatDate) {
          return this.config.formatDate(d);
        } else {
          return d.toISOString();
        }
      } catch {
        console.warn("[formatDate] Unable to convert", dt, "to date object");
      }
    }
    return `${dt}`;
  }

  private createElement(text: string, className: string, tagName: string | undefined = undefined) {
    const span = document.createElement(tagName || "span") as HTMLSpanElement;
    this.applyStyles(span, className);
    if (text) {
      span.innerText = text;
    }
    return span;
  }

  getRenderState(commentId: string): RenderStoreItem {
    if (!this._renderStore[commentId]) {
      this._renderStore[commentId] = { viewZoneId: undefined, renderStatus: undefined };
    }
    return this._renderStore[commentId];
  }

  editId: string = "";
  commentHeightCache: Record<string, number> = {};

  refreshComments() {
    this.editor.changeViewZones((changeAccessor) => {
      const lineNumbers: Record<number, CodeSelection | undefined> = {};

      if (this.editorMode !== EditorMode.toolbar) {
        // This creates a blank section viewZone that makes space for the interactive text file for editing
        if (this.editId) {
          changeAccessor.removeZone(this.editId);
        }

        const node = document.createElement("div");
        // node.style.backgroundColor = "orange";
        const afterLineNumber = this.getActivePosition();
        if (afterLineNumber !== undefined) {
          this.editId = changeAccessor.addZone({
            afterLineNumber,
            heightInPx: 100,
            domNode: node,
            suppressMouseDown: true,
          });
        }
      } else if (this.editId) {
        changeAccessor.removeZone(this.editId);
      }

      for (const cid of Array.from(this.store.deletedCommentIds || [])) {
        const viewZoneId = this.getRenderState(cid).viewZoneId;
        if (viewZoneId) {
          changeAccessor.removeZone(viewZoneId);
          this.verbose && console.debug("[monaco-review] Zone.Delete", viewZoneId);
        }
      }
      this.store.deletedCommentIds = undefined;

      for (const cid of Array.from(this.store.dirtyCommentIds || [])) {
        this.getRenderState(cid).renderStatus = ReviewCommentRenderState.dirty;
      }
      this.store.dirtyCommentIds = undefined;

      for (const item of this.iterateComments()) {
        const rs = this.getRenderState(item.state.comment.id);

        if (rs.renderStatus === ReviewCommentRenderState.hidden && rs.viewZoneId) {
          this.verbose && console.debug("[monaco-review] Zone.Hidden", item.state.comment.id);

          changeAccessor.removeZone(rs.viewZoneId);
          rs.viewZoneId = undefined;

          continue;
        }

        if (rs.renderStatus === ReviewCommentRenderState.dirty && rs.viewZoneId) {
          this.verbose && console.debug("[monaco-review] Zone.Dirty", item.state.comment.id);

          changeAccessor.removeZone(rs.viewZoneId);
          rs.viewZoneId = undefined;
          rs.renderStatus = ReviewCommentRenderState.normal;
        }

        if (!lineNumbers[item.state.comment.lineNumber]) {
          lineNumbers[item.state.comment.lineNumber] = item.state.comment.selection;
        }

        if (rs.viewZoneId == undefined) {
          this.verbose && console.debug("[monaco-review] Zone.Create", item.state.comment.id);

          const isActive = this.activeComment == item.state.comment;

          const domNode = this.config.renderComment
            ? this.config.renderComment(isActive, item)
            : this.renderComment(isActive, item);

          const heightInPx = this.measureHeighInPx(item, domNode);

          rs.viewZoneId = changeAccessor.addZone({
            afterLineNumber: item.state.comment.lineNumber,
            heightInPx,
            domNode,
            suppressMouseDown: true, // This stops focus being lost the editor - meaning keyboard shortcuts keeps working
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
                position: 1,
              },
            },
          });

          if (selection) {
            decorators.push({
              range: new monacoWindow.monaco.Range(
                selection.startLineNumber,
                selection.startColumn,
                selection.endLineNumber,
                selection.endColumn,
              ),
              options: {
                className: "reviewComment selection",
              },
            });
          }
        }

        this.currentCommentDecorations = this.editor.deltaDecorations(this.currentCommentDecorations, decorators);
      }
    });
  }

  private measureHeighInPx(item: ReviewCommentIterItem, domNode: HTMLElement): number {
    const cacheKey = this.getHeightCacheKey(item);
    // attach to dom to calculate height
    if (this.commentHeightCache[cacheKey] === undefined) {
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = "0px";
      container.appendChild(domNode);
      document.body.appendChild(container);
      const height = container.offsetHeight;
      document.body.removeChild(container);
      container.removeChild(domNode);

      this.commentHeightCache[cacheKey] = height;

      console.debug("[monaco-review] calculated height", height);
    } else {
      console.debug("[monaco-review] using cached height", cacheKey, this.commentHeightCache[item.state.comment.id]);
    }
    return this.commentHeightCache[cacheKey];
  }

  private getHeightCacheKey(item: ReviewCommentIterItem) {
    return `${item.state.comment.id}-${item.state.history.length}`;
  }

  private renderComment(isActive: boolean, item: ReviewCommentIterItem): HTMLElement {
    const rootNode = this.createElement("", "reviewComment"); // .${isActive ? "active" : "inactive"}`);
    rootNode.style.marginLeft = this.config.commentIndent * (item.depth + 1) + this.config.commentIndentOffset + "px";
    rootNode.style.backgroundColor = this.getThemedColor("editor.selectionHighlightBackground");

    const domNode = this.createElement("", `reviewComment.${isActive ? "active" : "inactive"}`);
    rootNode.appendChild(domNode);

    // // For Debug - domNode.appendChild(this.createElement(`${item.state.comment.id}`, 'reviewComment id'))
    domNode.appendChild(this.createElement(`${item.state.comment.author || " "} at `, "reviewComment.author"));
    if (item.state.comment.dt) {
      domNode.appendChild(this.createElement(this.formatDate(item.state.comment.dt), "reviewComment.dt"));
    }
    if (item.state.history.length > 1) {
      domNode.appendChild(
        this.createElement(`(Edited ${item.state.history.length - 1} times)`, "reviewComment.history"),
      );
    }

    const textNode = this.createElement("", "reviewComment.text", "div");
    textNode.style.width = "70vw";
    if (this.config.enableMarkdown) {
      textNode.innerHTML = convertMarkdownToHTML(item.state.comment.text);
    } else {
      textNode.innerText = item.state.comment.text;
    }

    rootNode.appendChild(textNode);

    return rootNode;
  }

  addActions() {
    this.editor.addAction({
      id: "my-unique-id-cancel",
      label: "Cancel Comment",
      keybindings: [monacoWindow.monaco.KeyCode.Escape],
      precondition: "cancel-context-key",
      keybindingContext: undefined,
      contextMenuGroupId: "navigation",
      contextMenuOrder: 0,
      run: () => {
        this.handleCancel();
      },
    });

    this.editor.addAction({
      id: "my-unique-id-add",
      label: "Add Comment",
      keybindings: [monacoWindow.monaco.KeyMod.CtrlCmd | monacoWindow.monaco.KeyCode.F10],
      precondition: "add-context-key",
      keybindingContext: undefined,
      contextMenuGroupId: "navigation",
      contextMenuOrder: 0,

      run: () => {
        this.setEditorMode(EditorMode.insertComment, "add-comment-context-menu");
      },
    });

    this.editor.addAction({
      id: "my-unique-id-next",
      label: "Next Comment",
      keybindings: [monacoWindow.monaco.KeyMod.CtrlCmd | monacoWindow.monaco.KeyCode.F12],
      precondition: undefined,
      keybindingContext: undefined,
      contextMenuGroupId: "navigation",
      contextMenuOrder: 0.101,

      run: () => {
        this.navigateToComment(NavigationDirection.next);
      },
    });

    this.editor.addAction({
      id: "my-unique-id-prev",
      label: "Prev Comment",
      keybindings: [monacoWindow.monaco.KeyMod.CtrlCmd | monacoWindow.monaco.KeyCode.F11],
      precondition: undefined,
      keybindingContext: undefined,
      contextMenuGroupId: "navigation",
      contextMenuOrder: 0.102,

      run: () => {
        this.navigateToComment(NavigationDirection.prev);
      },
    });
  }

  navigateToComment(direction: NavigationDirection) {
    let currentLine = 0;
    const position = this.editor.getPosition();
    if (this.activeComment) {
      currentLine = this.activeComment.lineNumber;
    } else if (position) {
      currentLine = position.lineNumber;
    } else {
      return;
    }

    const comments = Object.values(this.store.comments)
      .map((cs) => cs.comment)
      .filter((c) => {
        if (!c.parentId) {
          if (direction === NavigationDirection.next) {
            return c.lineNumber > currentLine;
          } else if (direction === NavigationDirection.prev) {
            return c.lineNumber < currentLine;
          }
        }
      });

    if (comments.length > 0) {
      comments.sort((a, b) => {
        if (direction === NavigationDirection.next) {
          return a.lineNumber - b.lineNumber;
        } else if (direction === NavigationDirection.prev) {
          return b.lineNumber - a.lineNumber;
        } else {
          return 0;
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
