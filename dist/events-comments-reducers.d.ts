export type ProposedReviewCommentEvent = ({
    type: "create";
    lineNumber: number;
    text: string;
    selection?: CodeSelection;
    commentType?: ReviewCommentType;
    typeState?: ReviewCommentTypeState;
    targetId?: string;
}) | ({
    type: "edit";
    text?: string;
    typeState?: ReviewCommentTypeState;
    targetId: string;
}) | ({
    type: "delete";
    targetId: string;
});
export type ReviewCommentEvent = ProposedReviewCommentEvent & {
    id: string;
    createdAt: number;
    createdBy: string;
};
export interface ReviewCommentStore {
    comments: Record<string, ReviewCommentState>;
    deletedCommentIds?: Set<string>;
    dirtyCommentIds?: Set<string>;
    events: ReviewCommentEvent[];
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
export declare enum ReviewCommentType {
    comment = 1,
    suggestion = 2,
    task = 3
}
export type ReviewCommentTypeState = unknown;
export interface CodeSelection {
    startColumn: number;
    endColumn: number;
    startLineNumber: number;
    endLineNumber: number;
}
export interface ReviewComment {
    id: string;
    parentId?: string;
    author: string | undefined;
    dt: number | undefined;
    lineNumber: number;
    text: string;
    selection: CodeSelection | undefined;
    status: ReviewCommentStatus;
    type: ReviewCommentType;
    typeState: ReviewCommentTypeState;
}
export declare enum ReviewCommentStatus {
    active = 1,
    deleted = 2,
    edit = 3
}
export declare function reduceComments(events: ReviewCommentEvent[], state?: ReviewCommentStore): ReviewCommentStore;
