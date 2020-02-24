export declare type CommonFields = {
    id?: string;
    targetId?: string;
    createdBy?: string;
    createdAt?: Date | string;
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
export interface CommentState {
    comments: Record<string, ReviewCommentState>;
    deletedCommentIds?: Set<string>;
    dirtyCommentIds?: Set<string>;
}
export declare function commentReducer(event: ReviewCommentEvent, state: CommentState): {
    comments: {
        [x: string]: ReviewCommentState;
    };
    dirtyCommentIds: Set<string>;
    deletedCommentIds: Set<string>;
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
    dt: Date | string;
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
export declare function reduceComments(actions: ReviewCommentEvent[], state?: CommentState): CommentState;
