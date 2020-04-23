import { createReviewManager, EditorMode } from "./index";
import { ReviewCommentEvent } from "./events-comments-reducers";

interface MonacoWindow {
  monaco: any;
}

class Range {
  constructor() {}
}

const monacoWindow = (window as any) as MonacoWindow;
monacoWindow.monaco = {
  KeyMod: { CtrlCmd: 0 },
  KeyCode: { F10: 1 },
  Range,
  editor: { ContentWidgetPositionPreference: { BELOW: "BELOW" } }
};

function getMockEditor() {
  const editor = {
    _zoneId: 0,
    _zones: {},
    _actions: [],
    focus: () => null,
    addAction: action => editor._actions.push(action),
    createContextKey: name => {
      return { set: () => null };
    },
    getRawOptions: () => ({ lineHeight: 19 }),
    getSelection: () => ({
      startLineNumber: 15,
      startColumn: 1,
      endLineNumber: 18,
      endColumn: 19,
      selectionStartLineNumber: 15
    }),
    addContentWidget: () => null,
    onMouseDown: () => null,
    onMouseMove: () => null,
    onDidChangeConfiguration: cb => null,
    revealLineInCenter: () => null,
    deltaDecorations: () => null,
    changeViewZones: cb =>
      cb({
        removeZone: zoneId => {
          // console.debug('deleted zone', zoneId);
          delete editor._zones[zoneId];
        },
        addZone: zone => {
          const zoneId = editor._zoneId++;
          editor._zones[zoneId] = zone;
          // console.debug('created', zoneId, zone.domNode.className);
          return zoneId;
        }
      }),
    layoutContentWidget: () => null,
    getPosition: () => {
      return { lineNumber: 1 };
    },
    _themeService: {
      getTheme: () => {
        return {
          themeName: "",
          getColor: () => ""
        };
      }
    }
  };

  return editor;
}

test("Widget Coverage", () => {
  const editor = getMockEditor();
  const rm = createReviewManager(editor, "current.user", [], comments => {});
  rm.activeComment = {
    selection: undefined,
    status: 1,
    id: "id.1",
    author: "",
    dt: "",
    text: "",
    lineNumber: 1
  };
  rm.widgetInlineToolbar.getId();
  rm.widgetInlineToolbar.getPosition();

  rm.setEditorMode(EditorMode.insertComment);
  rm.widgetInlineCommentEditor.getId();
  rm.widgetInlineCommentEditor.getPosition();

  rm.activeComment = null;
  rm.widgetInlineCommentEditor.getPosition();

  editor._actions.map(action => action.run());
});

test("createReviewManager to editor and add comments", () => {
  const editor = getMockEditor();
  const comment: ReviewCommentEvent = {
    type: "create",
    lineNumber: 1,
    createdBy: "author",
    createdAt: new Date("2019-01-01"),
    text: "#1"
  };

  const rm = createReviewManager(
    editor,
    "current.user",
    [comment],
    comments => {}
  );

  expect(Object.keys(editor._zones).length).toBe(1);
  expect(rm.activeComment).toBe(null);
  expect(rm.widgetInlineToolbar.getPosition()).toBe(undefined);
  expect(rm.widgetInlineCommentEditor.getPosition()).toBe(undefined);

  const num2 = rm.addComment(2, "#2");
  expect(num2.targetId).toBe(null);
  expect(Object.keys(rm.store.comments).length).toBe(2);
  expect(Object.keys(editor._zones).length).toBe(2);

  rm.setActiveComment(rm.store.comments[num2.id].comment);

  const num3 = rm.addComment(null, "#2.2");
  expect(num3.targetId).toBe(num2.id);
  expect(Object.keys(rm.store.comments).length).toBe(3);
  expect(Object.keys(editor._zones).length).toBe(3);

  rm.setActiveComment(null);
  const num4 = rm.addComment(4, "#4");
  expect(num4.targetId).toBe(null);
  expect(Object.keys(editor._zones).length).toBe(4);
});

test("load clears the comments", () => {
  const editor = getMockEditor();
  const comment: ReviewCommentEvent = {
    type: "create",
    lineNumber: 1,
    createdBy: "author",
    createdAt: new Date("2019-01-01"),
    text: "#1"
  };

  const rm = createReviewManager(
    editor,
    "current.user",
    [comment],
    comments => {}
  );
  rm.load([]);
  expect(Object.keys(editor._zones).length).toBe(0);
  expect(Object.keys(rm.store.comments).length).toBe(0);
});

test("Remove a comment via the widgets", () => {
  const editor = getMockEditor();
  const rm = createReviewManager(
    editor,
    "current.user",
    null,
    null,
    null,
    true
  );

  expect(rm.activeComment).toBe(null);
  expect(rm.widgetInlineToolbar.getPosition()).toBe(undefined);
  expect(rm.widgetInlineCommentEditor.getPosition()).toBe(undefined);

  const comment = rm.addComment(1, "");
  const viewZoneId = rm.renderStore[comment.id].viewZoneId;
  expect(Object.keys(editor._zones).length).toBe(1);

  // Simulate a click on the comment
  rm.handleMouseDown({
    target: {
      element: { className: "", hasAttribute: () => false },
      detail: { viewZoneId }
    }
  });
  expect(rm.activeComment.id).toBe(comment.id);
  //TODO - expect(rm.widgetInlineToolbar.getPosition().position.lineNumber).toBe(comment.lineNumber);
  expect(rm.widgetInlineCommentEditor.getPosition()).toBe(undefined);

  const deletedComment = rm.removeComment(comment.id);
  expect(deletedComment.targetId).toBe(comment.id);
  expect(Object.values(rm.store.comments).length).toBe(0);
  //expect(rm.store.viewZoneIdsToDelete.length).toBe(0);
  expect(Object.keys(editor._zones).length).toBe(0);
  expect(rm.activeComment).toBe(null);
  expect(rm.widgetInlineToolbar.getPosition()).toBe(undefined);
  expect(rm.widgetInlineCommentEditor.getPosition()).toBe(undefined);
});

test("Toggling read-only comments", () => {
  const now = () => new Date("2010-01-01");
  const editor = getMockEditor();
  const rm = createReviewManager(editor, "current.user", [
    {
      type: "create",
      id: "id1",
      createdBy: "original.author",
      createdAt: now(),
      lineNumber: 1,
      text: "text"
    }
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
  const now = () => new Date("2010-01-01");
  const editor = getMockEditor();
  const rm = createReviewManager(editor, "current.user", [
    {
      type: "create",
      id: "id1",
      createdBy: "original.author",
      createdAt: now(),
      lineNumber: 1,
      text: "text"
    }
  ]);
  rm.getDateTimeNow = now;

  expect(Object.values(rm.store.comments).length).toBe(1);
  const comment = Object.values(rm.store.comments)[0].comment;
  rm.setActiveComment(comment);
  rm.setEditorMode(EditorMode.editComment);
  rm.addComment(null, "editted");

  const expectedEdittedComment = {
    selection: undefined,
    status: 1,
    author: "current.user", //Copied from edit
    dt: rm.getDateTimeNow(), //Copied from edit
    id: comment.id,
    lineNumber: comment.lineNumber,
    text: "editted", //Copied from edit
    parentId: undefined
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
  rm.handleTextAreaKeyDown(({
    code: "Escape",
    ctrlKey: false,
    preventDefault: () => null
  } as any) as KeyboardEvent);
  expect(rm.editorMode).toBe(EditorMode.toolbar); //Toolbar

  expect(rm.widgetInlineToolbar.getPosition()).toBe(undefined);
  expect(rm.widgetInlineCommentEditor.getPosition()).toBe(undefined);

  rm.setEditorMode(EditorMode.insertComment);
  rm.editorElements.textarea.value = "#5";

  rm.handleTextAreaKeyDown(({
    code: "Enter",
    ctrlKey: true,
    preventDefault: () => null
  } as any) as KeyboardEvent);
  expect(rm.editorMode).toBe(EditorMode.toolbar); //Toolbar

  const cs = Object.values(rm.store.comments)[0];
  expect(cs.comment.text).toBe("#5");
  //expect(cs.viewZoneId).toBe(0);
});

test("Count number of lines", () => {
  const editor = getMockEditor();
  const rm = createReviewManager(editor, "current.user");
  const lines = rm.calculateNumberOfLines("line\nline");
  expect(lines).toBe(3);
});

test("Navigation - Forward and Back", () => {
  const editor = getMockEditor();
  const rm = createReviewManager(editor, "current.user");
  const c1 = rm.addComment(1, "1");
  const c2 = rm.addComment(2, "2");
  const c3 = rm.addComment(3, "3");
  const c4 = rm.addComment(4, "4");
  const c5 = rm.addComment(5, "5");

  rm.setActiveComment(rm.store.comments[c1.id].comment);
  const c1_1 = rm.addComment(1, "1.1");

  rm.removeComment(c2.id);
  rm.removeComment(c4.id);

  rm.setActiveComment(rm.store.comments[c3.id].comment);

  rm.navigateToComment(2);
  expect(rm.activeComment.id).toBe(c1.id);

  rm.navigateToComment(2);
  expect(rm.activeComment.id).toBe(c1.id); // Should this wrap around to the end?

  rm.navigateToComment(1);
  expect(rm.activeComment.id).toBe(c3.id);
});
