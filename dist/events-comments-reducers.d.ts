export declare type CommonFields = {
    id?: string;
    targetId?: string;
    createdBy?: string;
    createdAt?: number;
};
export declare type ReviewCommentEvent = ({
    type: "create";
    lineNumber: number;
    text: string;
    selection?: CodeSelection;
} & CommonFields) | ({
    type: "edit";
    text: string;
} & CommonFields) | ({
    type: "delete";
} & CommonFields);
export interface ReviewCommentStore {
    comments: Record<string, ReviewCommentState>;
    deletedCommentIds?: Set<string>;
    dirtyCommentIds?: Set<string>;
    events?: ReviewCommentEvent[];
}
export declare function commentReducer(event: ReviewCommentEvent, state: ReviewCommentStore): {
    comments: {
        [x: string]: ReviewCommentState;
    };
    dirtyCommentIds: Set<string>;
    deletedCommentIds: Set<string>;
    events: ReviewCommentEvent[];
};
export declare class ReviewCommentState {
    comment: ReviewComment;
    history: ReviewComment[];
    constructor(comment: ReviewComment);
}
export declare enum ReviewCommentRenderState {
    dirty = 1,
    hidden = 2,
    normal = 3
}
export interface CodeSelection {
    startColumn: number;
    endColumn: number;
    startLineNumber: number;
    endLineNumber: number;
}
export interface ReviewComment {
    id: string;
    parentId?: string;
    author: string;
    dt: number;
    lineNumber: number;
    text: string;
    selection: CodeSelection;
    status: ReviewCommentStatus;
}
export declare enum ReviewCommentStatus {
    active = 1,
    deleted = 2,
    edit = 3
}
export declare function reduceComments(actions: ReviewCommentEvent[], state?: ReviewCommentStore): ReviewCommentStore;
