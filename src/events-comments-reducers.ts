import * as uuid from "uuid";

export type CommonFields = {
  id?: string;
  targetId?: string;
  createdBy?: string;
  createdAt?: number;
  // script on here maybe?
  //type:''
  //status
};

export type ReviewCommentEvent =
  | ({
      type: "create";
      lineNumber: number;
      text: string;
      selection?: CodeSelection;
    } & CommonFields)
  | ({ type: "edit"; text: string } & CommonFields)
  | ({ type: "delete" } & CommonFields);

export interface ReviewCommentStore {
  comments: Record<string, ReviewCommentState>;
  deletedCommentIds?: Set<string>;
  dirtyCommentIds?: Set<string>;
  events?: ReviewCommentEvent[];
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
          text: event.text,
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

      delete comments[event.targetId];

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

export enum ReviewCommentStatus {
  active = 1,
  deleted = 2,
  edit = 3,
}

export function reduceComments(actions: ReviewCommentEvent[], state: ReviewCommentStore = null) {
  state = state || { comments: {}, events: [] };

  for (const a of actions) {
    if (!a.id) {
      a.id = uuid.v4();
    }
    state = commentReducer(a, state);
  }

  return state;
}
