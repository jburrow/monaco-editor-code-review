/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
let uuidCount = 0;

jest.mock("uuid", () => ({
  v1: () => `${--uuidCount}`,
  v4: () => `${--uuidCount}`,
  v5: () => `${--uuidCount}`,
}));

import { createReviewManager, EditorMode } from "./index";
import { ReviewCommentEvent, ReviewCommentType } from "./events-comments-reducers";


interface MonacoWindow {
  monaco: any;
}

class Range {
  constructor() { }
}

const monacoWindow = window as any as MonacoWindow;
monacoWindow.monaco = {
  KeyMod: { CtrlCmd: 0 },
  KeyCode: { F10: 1 },
  Range,
  editor: { ContentWidgetPositionPreference: { BELOW: "BELOW" } },
};

function getMockEditor(): any {
  const editor = {
    _zoneId: 0,
    _zones: {} as Record<string, any>,
    _actions: [],
    _position: null,
    focus: () => null,
    addAction: (action: never) => editor._actions.push(action),
    createContextKey: () => {
      return { set: () => null };
    },
    getRawOptions: () => ({ lineHeight: 19 }),
    getSelection: () => ({
      startLineNumber: 15,
      startColumn: 1,
      endLineNumber: 18,
      endColumn: 19,
      selectionStartLineNumber: 15,
    }),
    addContentWidget: () => null,
    onMouseDown: () => null,
    onMouseMove: () => null,
    onDidChangeConfiguration: () => null,
    revealLineInCenter: () => null,
    deltaDecorations: (oldDecorations: any, newDecorations: any): any => newDecorations,
    changeViewZones: (cb: any) =>
      cb({
        removeZone: (zoneId: string): void => {
          console.debug("deleted zone", zoneId);
          delete editor._zones[zoneId as any];
        },
        addZone: (zone: any): string => {
          const zoneId = `mock-zone-${editor._zoneId++}`;
          editor._zones[zoneId] = zone;
          console.debug("created", zoneId);
          return zoneId;
        },
      }),
    layoutContentWidget: () => null,
    setPosition: (position: any) => (editor._position = position),
    getPosition: () => editor._position,
    _themeService: {
      getTheme: () => {
        return {
          themeName: "",
          getColor: () => "",
        };
      },
    },
  };

  return editor;
}

test("Widget Coverage", () => {
  const editor = getMockEditor();
  const rm = createReviewManager(editor, "current.user", [], () => { });
  rm.activeComment = {
    selection: undefined,
    status: 1,
    id: "id.1",
    author: "",
    dt: 0,
    text: "",
    lineNumber: 1,
    type: ReviewCommentType.comment,
    typeState: undefined,
  };
  rm.widgetInlineToolbar?.getId();
  rm.widgetInlineToolbar?.getPosition();

  rm.setEditorMode(EditorMode.insertComment);
  rm.widgetInlineCommentEditor?.getId();
  rm.widgetInlineCommentEditor?.getPosition();

  rm.activeComment = undefined;
  rm.widgetInlineCommentEditor?.getPosition();

  editor._actions.map((action: never) => (action as any as { run(): void }).run());
});

test("createReviewManager to editor and add comments", () => {
  const editor = getMockEditor();
  const comment: ReviewCommentEvent = {
    id: "1",
    type: "create",
    lineNumber: 1,
    createdBy: "author",
    createdAt: new Date("2019-01-01").getTime(),
    text: "#1",
    commentType: ReviewCommentType.comment,
    typeState: undefined,
  };

  const rm = createReviewManager(editor, "current.user", [comment], () => { });
  expect(Object.keys(rm.store.comments)).toEqual([comment.id]);
  expect(Object.keys(editor._zones).length).toBe(1);
  expect(rm.activeComment).toBe(undefined);
  expect(rm.widgetInlineToolbar?.getPosition()).toBe(null);
  expect(rm.widgetInlineCommentEditor?.getPosition()).toBe(null);

  const num2 = rm.addComment(2, "#2");
  expect(num2.targetId).toBe(undefined);
  expect(Object.keys(rm.store.comments)).toEqual([comment.id, num2.id]);
  expect(Object.keys(editor._zones).length).toBe(2);

  const activeComment = rm.store.comments[num2.id].comment;
  rm.setActiveComment(activeComment);

  const num3 = rm.addComment(1, "#2.2");
  expect(num3.targetId).toBe(num2.id);
  expect(Object.keys(rm.store.comments).sort()).toEqual([comment.id, num2.id, num3.id].sort());
  expect(Object.keys(editor._zones).length).toBe(3);

  rm.setActiveComment(undefined);
  const num4 = rm.addComment(4, "#4");
  expect(num4.targetId).toBe(undefined);
  expect(Object.keys(editor._zones).length).toBe(4);
});

test("load clears the comments", () => {
  const editor = getMockEditor();
  const comment: ReviewCommentEvent = {
    id: "1",
    type: "create",
    lineNumber: 1,
    createdBy: "author",
    createdAt: new Date("2019-01-01").getTime(),
    text: "#1",
    commentType: ReviewCommentType.comment,
    typeState: undefined,
  };

  const rm = createReviewManager(editor, "current.user", [comment], () => { });
  rm.load([]);
  expect(Object.keys(editor._zones).length).toBe(0);
  expect(Object.keys(rm.store.comments).length).toBe(0);
});

test("Mouse behaviours", () => {
  const editor = getMockEditor();
  const rm = createReviewManager(editor, "current.user", [], undefined, undefined, true);

  expect(rm.activeComment).toBe(undefined);
  expect(rm.widgetInlineToolbar?.getPosition()).toBe(null);
  expect(rm.widgetInlineCommentEditor?.getPosition()).toBe(null);

  const lineNumber = 789;
  const comment = rm.addComment(lineNumber, "comment-text");
  expect(rm.getRenderState(comment.id).viewZoneId?.startsWith("mock-")).toBeTruthy();
  expect(Object.keys(editor._zones).length).toBe(1);
  expect(rm.activeComment).toBeFalsy();
  expect(rm.currentLineDecorations?.length).toBe(0);

  rm.handleMouseMove({ target: { position: { lineNumber: 888 } } } as any);
  expect(rm.currentLineDecorations.length).toBe(1);
  expect(rm.currentLineDecorationLineNumber).toBe(888);

  rm.handleMouseDown({
    target: {
      element: { className: "", hasAttribute: () => false },
      detail: { viewZoneId: rm.getRenderState(comment.id).viewZoneId },
    },
  } as any);

  expect(rm.activeComment).toBeTruthy();
  expect(rm.editorMode).toBe(EditorMode.toolbar);

  rm.handleMouseDown({
    target: {
      element: { className: "activeLineMarginClass", hasAttribute: () => false },
      detail: { viewZoneId: rm.getRenderState(comment.id).viewZoneId },
    },
  } as any);
  expect(rm.editorMode).toBe(EditorMode.insertComment);
  expect(rm.editor.getPosition()?.lineNumber).toBe(888);
  expect(rm.activeComment).toBeFalsy();
});

test("Remove a comment via the widgets", () => {
  const editor = getMockEditor();
  const rm = createReviewManager(editor, "current.user", [], undefined, undefined, true);

  expect(rm.activeComment).toBe(undefined);
  expect(rm.widgetInlineToolbar?.getPosition()).toBe(null);
  expect(rm.widgetInlineCommentEditor?.getPosition()).toBe(null);

  const comment = rm.addComment(1, "");
  expect(rm.getRenderState(comment.id).viewZoneId?.startsWith("mock-")).toBeTruthy();
  expect(Object.keys(editor._zones).length).toBe(1);

  // Coverage Only - Simulate the mouse moving over a line of code....
  rm.handleMouseMove({ target: { position: { lineNumber: 1 } } } as any);

  // Coverage Only - Simulate a click on the comment
  rm.handleMouseDown({
    target: {
      element: { className: "", hasAttribute: () => false },
      detail: { viewZoneId: 1 },
    },
  } as any);

  expect(rm.widgetInlineToolbar?.getPosition()).toBe(null);
  expect(rm.widgetInlineCommentEditor?.getPosition()).toBe(null);

  const deletedComment = rm.removeComment(comment.id);
  expect(deletedComment.targetId).toBe(comment.id);
  expect(Object.values(rm.store.comments).length).toBe(0);

  expect(Object.keys(editor._zones).length).toBe(0);
  expect(rm.activeComment).toBe(undefined);
  expect(rm.widgetInlineToolbar?.getPosition()).toBe(null);
  expect(rm.widgetInlineCommentEditor?.getPosition()).toBe(null);
});

test("Toggling read-only comments", () => {
  const now = () => new Date("2010-01-01").getTime();
  const editor = getMockEditor();
  const rm = createReviewManager(editor, "current.user", [
    {
      type: "create",
      id: "id1",
      createdBy: "original.author",
      createdAt: now(),
      lineNumber: 1,
      text: "text",
    },
  ]);
  rm.getDateTimeNow = now;

  rm.setReadOnlyMode(false);
  rm.setEditorMode(EditorMode.editComment);
  expect(rm.editorMode).toBe(EditorMode.editComment);
  expect(rm.config.readOnly).toBe(false);

  rm.setEditorMode(EditorMode.toolbar);
  rm.setReadOnlyMode(true);
  rm.setEditorMode(EditorMode.editComment);
  expect(rm.editorMode).toBe(EditorMode.toolbar);
  expect(rm.config.readOnly).toBe(true);
});

test("Edited Comments", () => {
  const now = () => new Date("2010-01-01").getTime();
  const editor = getMockEditor();
  const rm = createReviewManager(editor, "current.user", [
    {
      type: "create",
      id: "id1",
      createdBy: "original.author",
      createdAt: now(),
      lineNumber: 1,
      text: "text",
    },
  ]);
  rm.getDateTimeNow = now;

  expect(Object.values(rm.store.comments).length).toBe(1);
  const comment = Object.values(rm.store.comments)[0].comment;
  rm.setActiveComment(comment);
  rm.setEditorMode(EditorMode.editComment);
  rm.addComment(1, "editted");

  const expectedEdittedComment = {
    selection: undefined,
    status: 1,
    author: "current.user", //Copied from edit
    dt: rm.getDateTimeNow(), //Copied from edit
    id: comment.id,
    lineNumber: comment.lineNumber,
    text: "editted", //Copied from edit
    parentId: undefined,
    type: ReviewCommentType.comment,
    typeState: undefined,
  };

  const comments = Object.values(rm.store.comments);
  console.log(rm.store);
  expect(comments.length).toBe(1);
  expect(comments[0].comment.author).toBe("current.user");
  expect(comments[0].comment).toStrictEqual(expectedEdittedComment);
  expect(comments[0].history.length).toBe(2);
});

test("Enter Comment Widgets", () => {
  const editor = getMockEditor();
  const rm = createReviewManager(editor, "current.user");

  rm.editorElements.textarea.value = "xxxx";
  rm.setEditorMode(EditorMode.insertComment); // Edit Mode
  expect(rm.editorElements.textarea.value).toBe(""); //Toolbar
  rm.handleTextAreaKeyDown({
    code: "Escape",
    ctrlKey: false,
    preventDefault: () => null,
  } as any as KeyboardEvent);
  expect(rm.editorMode).toBe(EditorMode.toolbar); //Toolbar

  expect(rm.widgetInlineToolbar?.getPosition()).toBe(null);
  expect(rm.widgetInlineCommentEditor?.getPosition()).toBe(null);

  rm.setEditorMode(EditorMode.insertComment);
  rm.editorElements.textarea.value = "#5";

  rm.handleTextAreaKeyDown({
    code: "Enter",
    ctrlKey: true,
    preventDefault: () => null,
  } as any as KeyboardEvent);
  expect(rm.editorMode).toBe(EditorMode.toolbar); //Toolbar

  const cs = Object.values(rm.store.comments)[0];
  expect(cs.comment.text).toBe("#5");
  //expect(cs.viewZoneId).toBe(0);
});

test("Navigation - Forward and Back", () => {
  const editor = getMockEditor();
  const rm = createReviewManager(editor, "current.user");
  const c1 = rm.addComment(1, "1");
  const c2 = rm.addComment(2, "2");
  const c3 = rm.addComment(3, "3");
  const c4 = rm.addComment(4, "4");
  rm.addComment(5, "5");

  rm.setActiveComment(rm.store.comments[c1.id].comment);
  rm.addComment(1, "1.1");

  rm.removeComment(c2.id);
  rm.removeComment(c4.id);

  rm.setActiveComment(rm.store.comments[c3.id].comment);

  rm.navigateToComment(2);
  expect(rm.activeComment?.id).toBe(c1.id);

  rm.navigateToComment(2);
  expect(rm.activeComment?.id).toBe(c1.id); // Should this wrap around to the end?

  rm.navigateToComment(1);
  expect(rm.activeComment?.id).toBe(c3.id);
});
