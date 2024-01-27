"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduceComments = exports.ReviewCommentStatus = exports.ReviewCommentType = exports.ReviewCommentRenderState = exports.ReviewCommentState = exports.commentReducer = void 0;
function commentReducer(event, state) {
    var _a, _b;
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
                comment: Object.assign(Object.assign({}, parent.comment), { author: event.createdBy, dt: event.createdAt, text: (_a = event.text) !== null && _a !== void 0 ? _a : parent.comment.text, typeState: event.typeState === undefined ? parent.comment.typeState : event.typeState }),
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
            const _c = comments, _d = event.targetId, _ = _c[_d], remainingComments = __rest(_c, [typeof _d === "symbol" ? _d : _d + ""]);
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
                    type: (_b = event.commentType) !== null && _b !== void 0 ? _b : ReviewCommentType.comment,
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
})(ReviewCommentRenderState || (exports.ReviewCommentRenderState = ReviewCommentRenderState = {}));
var ReviewCommentType;
(function (ReviewCommentType) {
    ReviewCommentType[ReviewCommentType["comment"] = 1] = "comment";
    ReviewCommentType[ReviewCommentType["suggestion"] = 2] = "suggestion";
    ReviewCommentType[ReviewCommentType["task"] = 3] = "task";
})(ReviewCommentType || (exports.ReviewCommentType = ReviewCommentType = {}));
var ReviewCommentStatus;
(function (ReviewCommentStatus) {
    ReviewCommentStatus[ReviewCommentStatus["active"] = 1] = "active";
    ReviewCommentStatus[ReviewCommentStatus["deleted"] = 2] = "deleted";
    ReviewCommentStatus[ReviewCommentStatus["edit"] = 3] = "edit";
})(ReviewCommentStatus || (exports.ReviewCommentStatus = ReviewCommentStatus = {}));
function reduceComments(events, state = { comments: {}, events: [] }) {
    return events.reduce((accState, event) => commentReducer(event, accState), state);
}
exports.reduceComments = reduceComments;
//# sourceMappingURL=events-comments-reducers.js.map