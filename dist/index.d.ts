import * as monacoEditor from "monaco-editor";
import { reduceComments, CodeSelection, CommentState as ReviewCommentStore, ReviewCommentState, ReviewCommentEvent, ReviewComment, ReviewCommentRenderState } from "./events-comments-reducers";
export { ReviewCommentStore, ReviewCommentEvent, reduceComments };
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
export declare function createReviewManager(editor: any, currentUser: string, actions?: ReviewCommentEvent[], onChange?: OnActionsChanged, config?: ReviewManagerConfig, verbose?: boolean): ReviewManager;
interface ReviewCommentIterItem {
    depth: number;
    state: ReviewCommentState;
}
interface OnActionsChanged {
    (actions: ReviewCommentEvent[]): void;
}
export declare const defaultStyles: Record<string, {}>;
export interface ReviewManagerConfig {
    commentIndent?: number;
    commentIndentOffset?: number;
    editButtonAddText?: string;
    editButtonEnableRemove?: boolean;
    editButtonOffset?: string;
    editButtonRemoveText?: string;
    formatDate?: {
        (dt: Date): string;
    };
    readOnly?: boolean;
    reviewCommentIconActive?: string;
    reviewCommentIconSelect?: string;
    showInRuler?: boolean;
    renderComment?(isActive: boolean, comment: ReviewCommentIterItem): HTMLElement;
    styles?: Record<string, {}>;
    setClassNames?: boolean;
    verticalOffset?: number;
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
    formatDate?: {
        (dt: Date | string): string;
    };
    readOnly: boolean;
    rulerMarkerColor: any;
    rulerMarkerDarkColor: any;
    showAddCommentGlyph: boolean;
    showInRuler: boolean;
    renderComment?(isActive: boolean, comment: ReviewCommentIterItem): HTMLElement;
    styles: Record<string, {}>;
    setClassNames: boolean;
    verticalOffset: number;
}
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
export declare class ReviewManager {
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
    canCancelCondition: monacoEditor.editor.IContextKey<boolean>;
    renderStore: Record<string, RenderStoreItem>;
    constructor(editor: monacoEditor.editor.IStandaloneCodeEditor, currentUser: string, onChange: OnActionsChanged, config?: ReviewManagerConfig, verbose?: boolean);
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
    getActivePosition(): number;
    setActiveComment(comment: ReviewComment, reason?: string): boolean;
    filterAndMapComments(lineNumbers: number[], fn: {
        (comment: ReviewComment): void;
    }): void;
    handleMouseMove(ev: monacoEditor.editor.IEditorMouseEvent): void;
    renderAddCommentLineDecoration(lineNumber?: number): void;
    handleMouseDown(ev: {
        target: {
            element: {
                className: string;
                hasAttribute: {
                    (string: any): boolean;
                };
            };
            detail: any;
        };
    }): void;
    private calculateMarginTopOffset;
    layoutInlineToolbar(): void;
    layoutInlineCommentEditor(): void;
    createEmptyCommentOnCurrentLine(): ReviewComment;
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
    private measureHeighInPx;
    private getHeightCacheKey;
    private renderComment;
    addActions(): void;
    navigateToComment(direction: NavigationDirection): void;
}
