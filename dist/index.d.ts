import type * as monacoEditor from "monaco-editor";
import { reduceComments, ReviewCommentStatus, commentReducer, type CodeSelection, type ReviewCommentStore, ReviewCommentState, type ProposedReviewCommentEvent, type ReviewComment, ReviewCommentRenderState, type ReviewCommentEvent } from "./events-comments-reducers";
import { convertMarkdownToHTML } from "./comment";
export { type ReviewCommentStore, type ProposedReviewCommentEvent as ReviewCommentEvent, reduceComments, ReviewCommentStatus, commentReducer, type CodeSelection, ReviewCommentState, type ReviewComment, ReviewCommentRenderState, convertMarkdownToHTML, };
declare enum NavigationDirection {
    next = 1,
    prev = 2
}
export declare enum EditorMode {
    insertComment = 1,
    replyComment = 2,
    editComment = 3,
    toolbar = 4
}
export declare function createReviewManager(editor: monacoEditor.editor.IStandaloneCodeEditor, currentUser: string, events?: ReviewCommentEvent[], onChange?: OnActionsChanged, config?: ReviewManagerConfig, verbose?: boolean): ReviewManager;
export interface ReviewCommentIterItem {
    depth: number;
    state: ReviewCommentState;
}
type OnActionsChanged = (actions: ReviewCommentEvent[]) => void;
interface IEventRenderStoreItem {
    target?: {
        detail?: RenderStoreItem;
    };
}
export declare const defaultStyles: Record<string, unknown>;
/**
 * Keybindings are monaco keybinding values, e.g. [monaco.KeyMod.CtrlCmd | monaco.KeyCode.F10]
 */
export interface ReviewManagerKeybindings {
    addComment?: number[];
    cancel?: number[];
    nextComment?: number[];
    prevComment?: number[];
}
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
    keybindings?: ReviewManagerKeybindings;
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
    keybindings: Required<ReviewManagerKeybindings>;
}
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
export declare class ReviewManager {
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
    currentLineDecorations: monacoEditor.editor.IEditorDecorationsCollection;
    currentCommentDecorations: monacoEditor.editor.IEditorDecorationsCollection;
    currentLineDecorationLineNumber?: number;
    editorElements: EditorElements;
    inlineToolbarElements: InlineToolbarElements;
    verbose: boolean;
    canAddCondition: monacoEditor.editor.IContextKey<boolean>;
    canCancelCondition: monacoEditor.editor.IContextKey<boolean>;
    private _renderStore;
    private _disposables;
    constructor(editor: monacoEditor.editor.IStandaloneCodeEditor, currentUser: string, onChange?: OnActionsChanged, config?: ReviewManagerConfig, verbose?: boolean);
    /**
     * Removes all view zones, decorations, widgets, actions and event listeners that this
     * ReviewManager attached to the editor. Call this when unmounting the editor or the
     * hosting component.
     */
    dispose(): void;
    private debug;
    createCustomCssClasses(): void;
    setReadOnlyMode(value: boolean): void;
    load(events: ReviewCommentEvent[]): void;
    loadFromStore(store: ReviewCommentStore, events: ReviewCommentEvent[]): void;
    getThemedColor(name: string): string;
    applyStyles(element: HTMLElement, className: string): void;
    createInlineEditButtonsElement(): InlineToolbarElements;
    handleCancel(): void;
    handleAddComment(): void;
    handleTextAreaKeyDown(e: KeyboardEvent): void;
    createInlineEditorElement(): EditorElements;
    createInlineToolbarWidget(): InlineToolbarElements;
    calculateConfirmButtonText(): "Add Comment" | "Reply to Comment" | "Edit Comment";
    createInlineEditorWidget(): EditorElements;
    getActivePosition(): number | undefined;
    setActiveComment(comment?: ReviewComment, reason?: string): boolean;
    filterAndMapComments(lineNumbers: number[], fn: (comment: ReviewComment) => void): void;
    handleMouseMove(ev: monacoEditor.editor.IEditorMouseEvent & IEventRenderStoreItem): void;
    renderAddCommentLineDecoration(lineNumber?: number): void;
    private findCommentByViewZoneId;
    handleMouseDown(ev: monacoEditor.editor.IEditorMouseEvent & IEventRenderStoreItem): void;
    private calculateMarginTopOffset;
    layoutInlineToolbar(): void;
    layoutInlineCommentEditor(): void;
    setEditorMode(mode: EditorMode, why?: string): void;
    getDateTimeNow(): number;
    private recurseComments;
    private iterateComments;
    removeComment(id: string): ReviewCommentEvent;
    addComment(lineNumber: number, text: string, selection?: CodeSelection): ReviewCommentEvent;
    private addEvent;
    private formatDate;
    private createElement;
    getRenderState(commentId: string): RenderStoreItem;
    editId: string;
    commentHeightCache: Record<string, number>;
    refreshComments(): void;
    private measureHeightInPx;
    private getHeightCacheKey;
    private renderComment;
    addActions(): void;
    navigateToComment(direction: NavigationDirection): void;
}
