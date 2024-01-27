import { v4 as uuidv4 } from 'uuid';



export type ProposedReviewCommentEvent =
  | ({
    type: "create";
    lineNumber: number;
    text: string;
    selection?: CodeSelection;
    commentType?: ReviewCommentType;
    typeState?: ReviewCommentTypeState;
    targetId?: string;
  })
  | ({ type: "edit"; text?: string, typeState?: ReviewCommentTypeState, targetId: string })
  | ({ type: "delete", targetId: string });


export type ReviewCommentEvent = ProposedReviewCommentEvent & { id: string, createdAt: number, createdBy: string };

export interface ReviewCommentStore {
  comments: Record<string, ReviewCommentState>;
  deletedCommentIds?: Set<string>;
  dirtyCommentIds?: Set<string>;
  events: ReviewCommentEvent[];
}

export function commentReducer(event: ReviewCommentEvent, state: ReviewCommentStore) {
  const dirtyLineNumbers = new Set<number>();
  const deletedCommentIds = new Set<string>();
  const dirtyCommentIds = new Set<string>();
  const events = (state.events || []).concat([event]);
  let comments = { ...state.comments };

  switch (event.type) {
    case "edit":
      const parent = comments[event.targetId];
      if (!parent) break;

      const edit: ReviewCommentState = {
        comment: {
          ...parent.comment,
          author: event.createdBy,
          dt: event.createdAt,
          text: event.text ?? parent.comment.text,
          typeState: event.typeState === undefined ? parent.comment.typeState : event.typeState
        },
        history: parent.history.concat(parent.comment),
      };

      dirtyLineNumbers.add(edit.comment.lineNumber);
      // console.debug("edit", event);

      comments[event.targetId] = edit;
      break;

    case "delete":
      const selected = comments[event.targetId];
      if (!selected) break;

      const { [event.targetId]: _, ...remainingComments } = comments;
      comments = remainingComments;

      deletedCommentIds.add(selected.comment.id);
      dirtyLineNumbers.add(selected.comment.lineNumber);
      //console.debug("delete", event);
      break;

    case "create":
      if (!comments[event.id]) {
        comments[event.id] = new ReviewCommentState({
          author: event.createdBy,
          dt: event.createdAt,
          id: event.id,
          lineNumber: event.lineNumber,
          selection: event.selection,
          text: event.text,
          parentId: event.targetId,
          status: ReviewCommentStatus.active,
          type: event.commentType ?? ReviewCommentType.comment,
          typeState: event.typeState
        });
        //console.debug("insert", event);
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

  return { comments, dirtyCommentIds, deletedCommentIds, events };
}

export class ReviewCommentState {
  comment: ReviewComment;
  history: ReviewComment[];

  constructor(comment: ReviewComment) {
    this.comment = comment;
    this.history = [comment];
  }
}

export enum ReviewCommentRenderState {
  dirty = 1,
  hidden = 2,
  normal = 3,
}

export enum ReviewCommentType {
  comment = 1,
  suggestion = 2,
  task = 3,
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

export enum ReviewCommentStatus {
  active = 1,
  deleted = 2,
  edit = 3,
}


export function reduceComments(events: ReviewCommentEvent[], state: ReviewCommentStore = { comments: {}, events: [] }): ReviewCommentStore {
  return events.reduce((accState, event) => commentReducer(event, accState), state);
}