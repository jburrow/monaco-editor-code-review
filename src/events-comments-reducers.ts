import * as uuid from "uuid/v4";

export type CommonFields = {
    id?: string,
    targetId?: string,
    createdBy?: string,
    createdAt?: Date | string,
    // script on here maybe?
};


export type ReviewCommentEvent =
    { type: 'create', lineNumber: number, text: string, selection?: CodeSelection } & CommonFields |
    { type: 'edit', text: string } & CommonFields |
    { type: 'delete' } & CommonFields;

export interface CommentState {
    comments: { [reviewCommentId: string]: ReviewCommentState };
    deletedCommentIds?: Set<string>;
    dirtyCommentIds?: Set<string>;
};


export function commentReducer(event: ReviewCommentEvent, state: CommentState) {
    const dirtyLineNumbers = new Set<number>();
    const deletedCommentIds = new Set<string>();
    const dirtyCommentIds = new Set<string>();

    switch (event.type) {
        case "edit":
            const parent = state.comments[event.targetId];
            if (!parent) break;

            parent.comment = { ...parent.comment, author: event.createdBy, dt: event.createdAt, text: event.text };
            parent.history.push(parent.comment);
            parent.numberOfLines = calculateNumberOfLines(event.text);
            dirtyLineNumbers.add(parent.comment.lineNumber);
            console.log('edit', event);
            break;

        case "delete":
            const selected = state.comments[event.targetId];
            delete state.comments[event.targetId];

            deletedCommentIds.add(selected.comment.id);
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
                    selection: event.selection,
                    text: event.text,
                    parentId: event.targetId,
                    status: ReviewCommentStatus.active
                }, calculateNumberOfLines(event.text));
                console.log('insert', event);
                dirtyLineNumbers.add(event.lineNumber);
            }
            break;
    }

    if (dirtyLineNumbers.size) {
        for (const cs of Object.values(state.comments)) {
            if (dirtyLineNumbers.has(cs.comment.lineNumber)) {
                dirtyCommentIds.add(cs.comment.id);
            }
        }
    }

    return { ...state, dirtyCommentIds, deletedCommentIds };
}

export function calculateNumberOfLines(text: string): number {
    return text ? text.split(/\r*\n/).length + 1 : 1;
}

export class ReviewCommentState {
    //viewZoneId: string;
    //renderStatus: ReviewCommentRenderState;
    numberOfLines: number;
    comment: ReviewComment;
    history: ReviewComment[];

    constructor(comment: ReviewComment, numberOfLines: number) {
        //this.renderStatus = ReviewCommentRenderState.normal;//render stuff
        //this.viewZoneId = null; //render stuff
        this.numberOfLines = numberOfLines;//render stuff

        this.comment = comment;
        this.history = [comment];
    }
}


export enum ReviewCommentRenderState {
    dirty = 1,
    hidden = 2,
    normal = 3
}

export interface CodeSelection {
    startColumn: number,
    endColumn: number,
    startLineNumber: number,
    endLineNumber: number
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

export enum ReviewCommentStatus {
    active = 1,
    deleted = 2,
    edit = 3,
}

export function reduceComments(actions: ReviewCommentEvent[], state: CommentState = null) {
    state = state || { comments: {} };

    for (const a of actions) {
        if (!a.id) {
            a.id = uuid();
        }
        state = commentReducer(a, state);
    }

    return state;
}