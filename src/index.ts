import * as monacoEditor from "monaco-editor";
import {
  reduceComments,
  ReviewCommentStatus,
  commentReducer,
  CodeSelection,
  CommentState as ReviewCommentStore,
  ReviewCommentState,
  ReviewCommentEvent,
  ReviewComment,
  ReviewCommentRenderState,
} from "./events-comments-reducers";
import * as uuid from "uuid";
export { ReviewCommentStore, ReviewCommentEvent, reduceComments };
import "@vanillawc/wc-markdown";
import { convertMarkdownToHTML } from "./comment";

console.log("convertMarkdownToHTML:", convertMarkdownToHTML);

interface MonacoWindow {
  monaco: any;
}

const monacoWindow = (window as any) as MonacoWindow;

enum NavigationDirection {
  next = 1,
  prev = 2,
}

export enum EditorMode {
  insertComment = 1,
  editComment = 2,
  toolbar = 3,
}

export function createReviewManager(
  editor: any,
  currentUser: string,
  actions?: ReviewCommentEvent[],
  onChange?: OnActionsChanged,
  config?: ReviewManagerConfig,
  verbose?: boolean
): ReviewManager {
  //For Debug: (window as any).editor = editor;
  const rm = new ReviewManager(editor, currentUser, onChange, config, verbose);
  rm.load(actions || []);
  return rm;
}

interface ReviewCommentIterItem {
  depth: number;
  state: ReviewCommentState;
}

interface OnActionsChanged {
  (actions: ReviewCommentEvent[]): void;
}

export interface ReviewManagerConfig {
  commentIndent?: number;
  commentIndentOffset?: number;
  editButtonAddText?: string;
  editButtonEnableRemove?: boolean;
  editButtonOffset?: string;
  editButtonRemoveText?: string;
  formatDate?: { (dt: Date): string };
  readOnly?: boolean;
  reviewCommentIconActive?: string;
  reviewCommentIconSelect?: string;
  showInRuler?: boolean;
  verticalOffset?: number;
  renderComment?(isActive: boolean, comment: ReviewCommentIterItem): HTMLElement;
}

interface ReviewManagerConfigPrivate {
  commentIndent: number;
  commentIndentOffset: number;
  editButtonAddText: string;
  editButtonEditText: string;
  editButtonEnableEdit: boolean;
  editButtonEnableRemove: boolean;
  editButtonOffset: string;
  editButtonRemoveText: string;
  formatDate?: { (dt: Date | string): string };
  readOnly: boolean;
  rulerMarkerColor: any;
  rulerMarkerDarkColor: any;
  showAddCommentGlyph: boolean;
  showInRuler: boolean;
  verticalOffset: number;
  renderComment?(isActive: boolean, comment: ReviewCommentIterItem): HTMLElement;
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
  formatDate: null,
  readOnly: false,
  rulerMarkerColor: "darkorange",
  rulerMarkerDarkColor: "darkorange",
  showAddCommentGlyph: true,
  showInRuler: true,
  verticalOffset: 0,
};

const CONTROL_ATTR_NAME = "ReviewManagerControl";
const POSITION_BELOW = 2; //above=1, below=2, exact=0
const POSITION_EXACT = 0;

interface EditorElements {
  cancel: HTMLButtonElement;
  confirm: HTMLButtonElement;
  root: HTMLSpanElement;
  textarea: HTMLTextAreaElement;
}

interface InlineToolbarElements {
  add: HTMLSpanElement;
  edit: HTMLSpanElement;
  remove: HTMLSpanElement;
  root: HTMLDivElement;
}
interface RenderStoreItem {
  viewZoneId: string;
  renderStatus: ReviewCommentRenderState;
}

export class ReviewManager {
  currentUser: string;
  editor: monacoEditor.editor.IStandaloneCodeEditor;
  editorConfig: monacoEditor.editor.IEditorOptions;
  events: ReviewCommentEvent[];
  store: ReviewCommentStore;
  activeComment?: ReviewComment;
  widgetInlineToolbar: monacoEditor.editor.IContentWidget;
  widgetInlineCommentEditor: monacoEditor.editor.IContentWidget;
  onChange: OnActionsChanged;
  editorMode: EditorMode;
  config: ReviewManagerConfigPrivate;
  currentLineDecorations: string[];
  currentCommentDecorations: string[];
  currentLineDecorationLineNumber?: number;

  editorElements: EditorElements;
  inlineToolbarElements: InlineToolbarElements;
  verbose: boolean;
  canAddCondition: monacoEditor.editor.IContextKey<boolean>;

  renderStore: Record<string, RenderStoreItem>;

  constructor(
    editor: monacoEditor.editor.IStandaloneCodeEditor,
    currentUser: string,
    onChange: OnActionsChanged,
    config?: ReviewManagerConfig,
    verbose?: boolean
  ) {
    this.currentUser = currentUser;
    this.editor = editor;
    this.activeComment = null; //TODO - consider moving onto the store
    this.widgetInlineToolbar = null;
    this.widgetInlineCommentEditor = null;
    this.onChange = onChange;
    this.editorMode = EditorMode.toolbar;
    this.config = { ...defaultReviewManagerConfig, ...(config || {}) };
    this.currentLineDecorations = [];
    this.currentCommentDecorations = [];
    this.currentLineDecorationLineNumber = null;
    this.events = [];
    this.store = { comments: {} }; //, viewZoneIdsToDelete: [] };
    this.renderStore = {};

    this.verbose = verbose;

    this.editorConfig = this.editor.getRawOptions();
    this.editor.onDidChangeConfiguration(() => (this.editorConfig = this.editor.getRawOptions()));
    this.editor.onMouseDown(this.handleMouseDown.bind(this));
    this.canAddCondition = this.editor.createContextKey("add-context-key", !this.config.readOnly);
    this.inlineToolbarElements = this.createInlineToolbarWidget();
    this.editorElements = this.createInlineEditorWidget();
    this.addActions();

    if (this.config.showAddCommentGlyph) {
      this.editor.onMouseMove(this.handleMouseMove.bind(this));
    }
  }

  setReadOnlyMode(value: boolean) {
    this.config.readOnly = value;
    this.canAddCondition.set(!value);
    this.renderAddCommentLineDecoration(null);
  }

  load(events: ReviewCommentEvent[]): void {
    const store = reduceComments(events);
    this.loadFromStore(store, events);
  }

  loadFromStore(store: ReviewCommentStore, events: ReviewCommentEvent[]) {
    this.editor.changeViewZones((changeAccessor: monacoEditor.editor.IViewZoneChangeAccessor) => {
      // Remove all the existing comments
      for (const viewState of Object.values(this.store.comments)) {
        const x = this.getRenderState(viewState.comment.id);
        if (x && x.viewZoneId !== null) {
          changeAccessor.removeZone(x.viewZoneId);
        }
      }

      this.events = events;
      this.store = store;
      this.store.deletedCommentIds = null;
      this.store.dirtyCommentIds = null;
      this.renderStore = {};

      this.refreshComments();

      this.verbose &&
        console.debug("Events Loaded:", events.length, "Review Comments:", Object.values(this.store.comments).length);
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

    const themeService = (this.editor as any)._themeService;
    if (themeService.getTheme) {
      // v21
      theme = themeService.getTheme();
      themeName = theme.themeName;
    } else if (themeService._theme) {
      //v20
      theme = themeService._theme;
    }

    value = theme.getColor(name);

    // HACK - Buttons themes are not in monaco ... so just hack in theme for dark
    const missingThemes = {
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
      value = missingThemes[themeName.indexOf("dark") > -1 ? "dark" : "light"][name];
    }
    return value;
  }

  createInlineEditButtonsElement(): InlineToolbarElements {
    var root = document.createElement("div") as HTMLDivElement;
    root.className = "editButtonsContainer";
    root.style.marginLeft = this.config.editButtonOffset;

    const add = document.createElement("span") as HTMLSpanElement;
    add.innerText = this.config.editButtonAddText;
    add.className = "editButton add";
    add.setAttribute(CONTROL_ATTR_NAME, "");
    add.onclick = () => this.setEditorMode(EditorMode.insertComment, "add-comment");
    root.appendChild(add);

    let remove = null;
    let edit = null;
    let spacer = null;

    if (this.config.editButtonEnableRemove) {
      spacer = document.createElement("div") as HTMLDivElement;
      spacer.innerText = " ";
      root.appendChild(spacer);

      remove = document.createElement("span") as HTMLSpanElement;
      remove.setAttribute(CONTROL_ATTR_NAME, "");
      remove.innerText = this.config.editButtonRemoveText;
      remove.className = "editButton remove";
      remove.onclick = () => this.activeComment && this.removeComment(this.activeComment.id);
      root.appendChild(remove);
    }

    if (this.config.editButtonEnableEdit) {
      spacer = document.createElement("div") as HTMLDivElement;
      spacer.innerText = " ";
      root.appendChild(spacer);

      edit = document.createElement("span") as HTMLSpanElement;
      edit.setAttribute(CONTROL_ATTR_NAME, "");
      edit.innerText = this.config.editButtonEditText;
      edit.className = "editButton edit";
      edit.onclick = () => this.setEditorMode(EditorMode.editComment, "edit");
      root.appendChild(edit);
    }

    return { root, add, remove, edit };
  }

  handleCancel() {
    this.setEditorMode(EditorMode.toolbar, "cancel");
    this.editor.focus();
  }

  handleAddComment() {
    const lineNumber = this.activeComment ? this.activeComment.lineNumber : this.editor.getSelection().endLineNumber;
    const text = this.editorElements.textarea.value;
    const selection = this.activeComment ? null : (this.editor.getSelection() as CodeSelection);
    this.addComment(lineNumber, text, selection);
    this.setEditorMode(EditorMode.toolbar, "add-comment-1");
    this.editor.focus();
  }

  handleTextAreaKeyDown(e: KeyboardEvent) {
    if (e.code === "Escape") {
      this.handleCancel();
      e.preventDefault();
      console.info("preventDefault: Escape Key");
    } else if (e.code === "Enter" && e.ctrlKey) {
      this.handleAddComment();
      e.preventDefault();
      console.info("preventDefault: ctrl+Enter");
    }
  }

  createInlineEditorElement(): EditorElements {
    var root = document.createElement("div") as HTMLDivElement;
    root.className = "reviewCommentEditor";

    const textarea = document.createElement("textarea") as HTMLTextAreaElement;
    textarea.setAttribute(CONTROL_ATTR_NAME, "");
    textarea.className = "reviewCommentEditor text";
    textarea.innerText = "";
    textarea.style.resize = "none";
    textarea.style.width = "100%";
    textarea.name = "text";
    textarea.onkeydown = this.handleTextAreaKeyDown.bind(this);

    const confirm = document.createElement("button") as HTMLButtonElement;
    confirm.setAttribute(CONTROL_ATTR_NAME, "");
    confirm.className = "reviewCommentEditor save";
    confirm.style.fontFamily = "Consolas";
    confirm.innerText = "Add Comment";
    confirm.onclick = this.handleAddComment.bind(this);

    const cancel = document.createElement("button") as HTMLButtonElement;
    cancel.setAttribute(CONTROL_ATTR_NAME, "");
    cancel.className = "reviewCommentEditor cancel";
    cancel.innerText = "Cancel";
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
      },
    };

    this.editor.addContentWidget(this.widgetInlineToolbar);
    return buttonsElement;
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
        if (this.editorMode == EditorMode.insertComment || this.editorMode == EditorMode.editComment) {
          const position = this.editor.getPosition();

          return {
            position: {
              lineNumber: this.activeComment ? this.activeComment.lineNumber : position.lineNumber + 1,
              column: position.column,
            },
            preference: [POSITION_EXACT],
          };
        }
      },
    };

    this.editor.addContentWidget(this.widgetInlineCommentEditor);
    return editorElement;
  }

  setActiveComment(comment: ReviewComment) {
    this.verbose && console.debug("setActiveComment", comment);

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
        this.renderStore[comment.id].renderStatus = ReviewCommentRenderState.dirty;
      });
    }
  }

  filterAndMapComments(lineNumbers: number[], fn: { (comment: ReviewComment): void }) {
    for (const cs of Object.values(this.store.comments)) {
      if (lineNumbers.indexOf(cs.comment.lineNumber) > -1) {
        fn(cs.comment);
      }
    }
  }

  handleMouseMove(ev: monacoEditor.editor.IEditorMouseEvent) {
    if (ev.target && ev.target.position && ev.target.position.lineNumber) {
      this.currentLineDecorationLineNumber = ev.target.position.lineNumber;
      this.renderAddCommentLineDecoration(this.config.readOnly === true ? null : this.currentLineDecorationLineNumber);
    }
  }

  renderAddCommentLineDecoration(lineNumber?: number) {
    const lines = lineNumber
      ? [
          {
            range: new monacoWindow.monaco.Range(lineNumber, 0, lineNumber, 0),
            options: {
              marginClassName: "activeLineMarginClass",
              zIndex: 100,
            },
          },
        ]
      : [];
    this.currentLineDecorations = this.editor.deltaDecorations(this.currentLineDecorations, lines);
  }

  handleMouseDown(ev: {
    target: {
      element: { className: string; hasAttribute: { (string): boolean } };
      detail: any;
    };
  }) {
    // Not ideal - but couldn't figure out a different way to identify the glyph event
    if (ev.target.element.className && ev.target.element.className.indexOf("activeLineMarginClass") > -1) {
      this.editor.setPosition({
        lineNumber: this.currentLineDecorationLineNumber,
        column: 1,
      });
      this.setEditorMode(EditorMode.insertComment, "mouse-down-1");
    } else if (!ev.target.element.hasAttribute(CONTROL_ATTR_NAME)) {
      let activeComment: ReviewComment = null;

      if (ev.target.detail && ev.target.detail.viewZoneId !== null) {
        for (const comment of Object.values(this.store.comments).map((c) => c.comment)) {
          const x = this.getRenderState(comment.id);
          if (x.viewZoneId == ev.target.detail.viewZoneId) {
            activeComment = comment;
            break;
          }
        }
      }
      this.setActiveComment(activeComment);
      this.refreshComments();
      this.setEditorMode(EditorMode.toolbar, "mouse-down-2");
    }
  }

  private calculateMarginTopOffset(includeActiveCommentHeight: boolean): number {
    let count = 0;
    let marginTop = 0;
    const lineHeight = this.editorConfig.lineHeight;

    if (this.activeComment) {
      for (var item of this.iterateComments()) {
        if (
          item.state.comment.lineNumber === this.activeComment.lineNumber &&
          (item.state.comment != this.activeComment || includeActiveCommentHeight)
        ) {
          count += this.calculateNumberOfLines(item.state.comment.text);
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
      const hasChildren =
        this.activeComment && this.iterateComments((c) => c.comment.id === this.activeComment.id).length > 1;
      const isSameUser = this.activeComment && this.activeComment.author === this.currentUser;
      this.inlineToolbarElements.remove.style.display = hasChildren ? "none" : "";
      this.inlineToolbarElements.edit.style.display = hasChildren || !isSameUser ? "none" : "";
    }

    this.editor.layoutContentWidget(this.widgetInlineToolbar);
  }

  layoutInlineCommentEditor() {
    [this.editorElements.root, this.editorElements.textarea].forEach((e) => {
      e.style.backgroundColor = this.getThemedColor("editor.background");
      e.style.color = this.getThemedColor("editor.foreground");
    });

    [this.editorElements.confirm, this.editorElements.cancel].forEach((button) => {
      button.style.backgroundColor = this.getThemedColor("button.background");
      button.style.color = this.getThemedColor("button.foreground");
    });

    this.editorElements.confirm.innerText =
      this.editorMode === EditorMode.insertComment ? "Add Comment" : "Edit Comment";

    this.editor.layoutContentWidget(this.widgetInlineCommentEditor);
  }

  setEditorMode(mode: EditorMode, why: string = null) {
    this.editorMode = this.config.readOnly ? EditorMode.toolbar : mode;
    this.verbose &&
      console.log(
        "setEditorMode",
        EditorMode[mode],
        why,
        "Comment:",
        this.activeComment,
        "ReadOnly:",
        this.config.readOnly,
        "Result:",
        EditorMode[this.editorMode]
      );

    this.layoutInlineToolbar();
    this.layoutInlineCommentEditor();

    if (mode == EditorMode.insertComment || mode == EditorMode.editComment) {
      if (mode == EditorMode.insertComment) {
        this.editorElements.textarea.value = "";
      } else if (mode == EditorMode.editComment) {
        this.editorElements.textarea.value = this.activeComment ? this.activeComment.text : "";
      }
      //HACK - because the event in monaco doesn't have preventdefault which means editor takes focus back...
      setTimeout(() => this.editorElements.textarea.focus(), 100); //TODO - make configurable
    }
  }

  getDateTimeNow(): number {
    return new Date().getTime();
  }

  private recurseComments(
    allComments: { [key: string]: ReviewCommentState },
    filterFn: { (c: ReviewCommentState): boolean },
    depth: number,
    results: ReviewCommentIterItem[]
  ) {
    const comments = Object.values(allComments).filter(filterFn);
    for (const cs of comments) {
      const comment = cs.comment;
      delete allComments[comment.id];

      results.push({
        depth,
        state: cs,
      });
      this.recurseComments(allComments, (x) => x.comment.parentId === comment.id, depth + 1, results);
    }
  }

  private iterateComments(filterFn?: { (c: ReviewCommentState): boolean }) {
    if (!filterFn) {
      filterFn = (cs: ReviewCommentState) => !cs.comment.parentId;
    }
    const copyCommentState = { ...this.store.comments };
    const results: ReviewCommentIterItem[] = [];
    this.recurseComments(copyCommentState, filterFn, 0, results);
    return results;
  }

  removeComment(id: string) {
    return this.addEvent({ type: "delete", targetId: id });
  }

  addComment(lineNumber: number, text: string, selection?: CodeSelection) {
    const event: ReviewCommentEvent =
      this.editorMode === EditorMode.editComment
        ? { type: "edit", text, targetId: this.activeComment.id }
        : {
            type: "create",
            text,
            lineNumber,
            selection,
            targetId: this.activeComment && this.activeComment.id,
          };

    return this.addEvent(event);
  }

  private addEvent(event: ReviewCommentEvent) {
    event.createdBy = this.currentUser;
    event.createdAt = this.getDateTimeNow();
    event.id = uuid.v4();

    this.events.push(event);
    this.store = commentReducer(event, this.store);

    if (this.activeComment && !this.store.comments[this.activeComment.id]) {
      this.setActiveComment(null);
    } else if (this.activeComment && this.activeComment.status === ReviewCommentStatus.deleted) {
      this.setActiveComment(null);
    }

    this.refreshComments();
    this.layoutInlineToolbar();

    if (this.onChange) {
      this.onChange(this.events);
    }

    return event;
  }

  private formatDate(dt: number) {
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

  private createElement(text: string, className: string, tagName: string = null) {
    const span = document.createElement(tagName || "span") as HTMLSpanElement;
    span.className = className;
    span.innerText = text;
    return span;
  }

  getRenderState(commentId: string): RenderStoreItem {
    if (!this.renderStore[commentId]) {
      this.renderStore[commentId] = { viewZoneId: null, renderStatus: null };
    }
    return this.renderStore[commentId];
  }

  refreshComments() {
    this.editor.changeViewZones((changeAccessor) => {
      const lineNumbers: { [key: number]: CodeSelection } = {};

      for (const cid of Array.from(this.store.deletedCommentIds || [])) {
        const viewZoneId = this.renderStore[cid]?.viewZoneId;
        changeAccessor.removeZone(viewZoneId);
        this.verbose && console.debug("Zone.Delete", viewZoneId);
      }
      this.store.deletedCommentIds = null;

      for (const cid of Array.from(this.store.dirtyCommentIds || [])) {
        this.getRenderState(cid).renderStatus = ReviewCommentRenderState.dirty;
      }
      this.store.dirtyCommentIds = null;

      for (const item of this.iterateComments()) {
        const rs = this.getRenderState(item.state.comment.id);

        if (rs.renderStatus === ReviewCommentRenderState.hidden) {
          this.verbose && console.debug("Zone.Hidden", item.state.comment.id);

          changeAccessor.removeZone(rs.viewZoneId);
          rs.viewZoneId = null;

          continue;
        }

        if (rs.renderStatus === ReviewCommentRenderState.dirty) {
          this.verbose && console.debug("Zone.Dirty", item.state.comment.id);

          changeAccessor.removeZone(rs.viewZoneId);
          rs.viewZoneId = null;
          rs.renderStatus = ReviewCommentRenderState.normal;
        }

        if (!lineNumbers[item.state.comment.lineNumber]) {
          lineNumbers[item.state.comment.lineNumber] = item.state.comment.selection;
        }

        if (rs.viewZoneId == null) {
          this.verbose && console.debug("Zone.Create", item.state.comment.id);

          const isActive = this.activeComment == item.state.comment;

          const domNode = this.config.renderComment
            ? this.config.renderComment(isActive, item)
            : this.renderComment(isActive, item);

          document.body.appendChild(domNode);
          const height = domNode.offsetHeight;
          document.body.removeChild(domNode);

          rs.viewZoneId = changeAccessor.addZone({
            afterLineNumber: item.state.comment.lineNumber,
            heightInPx: height,
            onComputedHeight: (x) => {
              console.log(x, height, item.state.comment.text);
            },
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
                selection.endColumn
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

  private renderComment(isActive: boolean, item: ReviewCommentIterItem) {
    const domNode = this.createElement("", `reviewComment ${isActive ? "active" : " inactive"}`);
    domNode.style.marginLeft = this.config.commentIndent * (item.depth + 1) + this.config.commentIndentOffset + "px";
    domNode.style.backgroundColor = "red"; //this.getThemedColor("editor.selectionHighlightBackground");

    // // For Debug - domNode.appendChild(this.createElement(`${item.state.comment.id}`, 'reviewComment id'))
    domNode.appendChild(this.createElement(`${item.state.comment.author || " "} at `, "reviewComment author"));
    domNode.appendChild(this.createElement(this.formatDate(item.state.comment.dt), "reviewComment dt"));
    if (item.state.history.length > 1) {
      domNode.appendChild(
        this.createElement(`(Edited ${item.state.history.length - 1} times)`, "reviewComment history")
      );
    }

    const n = document.createElement("div");
    n.innerHTML = convertMarkdownToHTML(item.state.comment.text);
    domNode.appendChild(n);
    // domNode.appendChild(this.createElement(, "reviewComment text", "div"));
    // const n = document.createElement("wc-markdown");
    // n.style.width = "200px";
    // n.style.display = "inline-block";
    // n.innerHTML = item.state.comment.text;

    // // `###  Mar

    // // This sampcle is loaded from theThis sampcle is loaded from theThis sampcle is loaded from theThis sampcle is loaded from theThis sampcle is loaded from theThis sampcle is loaded from theThis sampcle is loaded from theThis sampcle is loaded from theThis sampcle is loaded from the \`innerHTML of the\` \`<wc-markdown>\` tag
    // // `;
    // ////*[@id="containerEditor"]/div/div[3]/div/div[1]/div[2]/div[1]/div[3]/span[1]/wc-markdown/pre/code
    // //document.querySelector("#containerEditor > div > div.editor.modified > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs-dark.mac")
    domNode.appendChild(n);

    return domNode;
  }

  calculateNumberOfLines(text: string): number {
    return 10;
    text ? text.split(/\r*\n/).length + 1 : 1;
  }

  addActions() {
    this.editor.addAction({
      id: "my-unique-id-add",
      label: "Add Comment",
      keybindings: [monacoWindow.monaco.KeyMod.CtrlCmd | monacoWindow.monaco.KeyCode.F10],
      precondition: "add-context-key",
      keybindingContext: null,
      contextMenuGroupId: "navigation",
      contextMenuOrder: 0,

      run: () => {
        this.setEditorMode(EditorMode.insertComment, "add-comment-x");
      },
    });

    this.editor.addAction({
      id: "my-unique-id-next",
      label: "Next Comment",
      keybindings: [monacoWindow.monaco.KeyMod.CtrlCmd | monacoWindow.monaco.KeyCode.F12],
      precondition: null,
      keybindingContext: null,
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
      precondition: null,
      keybindingContext: null,
      contextMenuGroupId: "navigation",
      contextMenuOrder: 0.102,

      run: () => {
        this.navigateToComment(NavigationDirection.prev);
      },
    });
  }

  navigateToComment(direction: NavigationDirection) {
    let currentLine = 0;
    if (this.activeComment) {
      currentLine = this.activeComment.lineNumber;
    } else {
      currentLine = this.editor.getPosition().lineNumber;
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

    if (comments.length) {
      comments.sort((a, b) => {
        if (direction === NavigationDirection.next) {
          return a.lineNumber - b.lineNumber;
        } else if (direction === NavigationDirection.prev) {
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
