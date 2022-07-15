"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceComments = exports.ReviewCommentStatus = exports.ReviewCommentRenderState = exports.ReviewCommentState = exports.commentReducer = void 0;
const uuid = require("uuid");
function commentReducer(event, state) {
    const dirtyLineNumbers = new Set();
    const deletedCommentIds = new Set();
    const dirtyCommentIds = new Set();
    const events = (state.events || []).concat([event]);
    let comments = Object.assign({}, state.comments);
    switch (event.type) {
        case "edit":
            const parent = comments[event.targetId];
            if (!parent)
                break;
            const edit = {
                comment: Object.assign(Object.assign({}, parent.comment), { author: event.createdBy, dt: event.createdAt, text: event.text }),
                history: parent.history.concat(parent.comment),
            };
            dirtyLineNumbers.add(edit.comment.lineNumber);
            // console.debug("edit", event);
            comments[event.targetId] = edit;
            break;
        case "delete":
            const selected = comments[event.targetId];
            if (!selected)
                break;
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
exports.commentReducer = commentReducer;
class ReviewCommentState {
    constructor(comment) {
        this.comment = comment;
        this.history = [comment];
    }
}
exports.ReviewCommentState = ReviewCommentState;
var ReviewCommentRenderState;
(function (ReviewCommentRenderState) {
    ReviewCommentRenderState[ReviewCommentRenderState["dirty"] = 1] = "dirty";
    ReviewCommentRenderState[ReviewCommentRenderState["hidden"] = 2] = "hidden";
    ReviewCommentRenderState[ReviewCommentRenderState["normal"] = 3] = "normal";
})(ReviewCommentRenderState = exports.ReviewCommentRenderState || (exports.ReviewCommentRenderState = {}));
var ReviewCommentStatus;
(function (ReviewCommentStatus) {
    ReviewCommentStatus[ReviewCommentStatus["active"] = 1] = "active";
    ReviewCommentStatus[ReviewCommentStatus["deleted"] = 2] = "deleted";
    ReviewCommentStatus[ReviewCommentStatus["edit"] = 3] = "edit";
})(ReviewCommentStatus = exports.ReviewCommentStatus || (exports.ReviewCommentStatus = {}));
function reduceComments(actions, state = null) {
    state = state || { comments: {}, events: [] };
    for (const a of actions) {
        if (!a.id) {
            a.id = uuid.v4();
        }
        state = commentReducer(a, state);
    }
    return state;
}
exports.reduceComments = reduceComments;
//# sourceMappingURL=events-comments-reducers.js.map