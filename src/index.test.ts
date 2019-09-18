import { ReviewComment, createReviewManager, ReviewManagerConfig } from "./index";

interface MonacoWindow {
    monaco: any;
}

const monacoWindow = (window as any) as MonacoWindow;
monacoWindow.monaco = {
    KeyMod: { CtrlCmd: 0 }, KeyCode: { F10: 1 },
    Range: () => { },
    editor: { ContentWidgetPositionPreference: { BELOW: 'BELOW' } }
};

function getMockEditor() {
    const editor = {
        _zoneId: 0,
        _zones: {},
        focus: () => null,
        addAction: () => null,
        getConfiguration: () => ({ fontInfo: { lineHeight: 19 } }),
        getSelection: () => ({ startLineNumber: 15, startColumn: 1, endLineNumber: 18, endColumn: 19, selectionStartLineNumber: 15 }),
        addContentWidget: () => null,
        onMouseDown: () => null,
        onMouseMove: () => null,
        onDidChangeConfiguration: (cb) => null,
        revealLineInCenter: () => null,
        deltaDecorations: () => null,
        changeViewZones: (cb) => cb({
            removeZone: (zoneId) => {
                // console.debug('deleted zone', zoneId);
                delete editor._zones[zoneId]
            },
            addZone: (zone) => {
                const zoneId = editor._zoneId++;
                editor._zones[zoneId] = zone;
                // console.debug('created', zoneId, zone.domNode.className);
                return zoneId;
            }
        }),
        layoutContentWidget: () => null,
        getPosition: () => { return { lineNumber: 1 } },
        _themeService: {
            getTheme: () => {
                return {
                    themeName: '',
                    getColor: () => ''
                }
            }
        }
    }

    return editor;
}

test('Widget Coverage', () => {
    const editor = getMockEditor();
    const rm = createReviewManager(editor, 'current.user', [], (comments) => { });
    rm.activeComment = { id: 'id.1', author: "", dt: "", text: "", lineNumber: 1 };
    rm.widgetInlineToolbar.getId();
    rm.widgetInlineToolbar.getPosition();

    rm.setEditorMode(1);
    rm.widgetInlineCommentEditor.getId();
    rm.widgetInlineCommentEditor.getPosition();

    rm.activeComment = null;
    rm.widgetInlineCommentEditor.getPosition();
})

test('createReviewManager to editor and add comments', () => {
    const editor = getMockEditor();
    const comment: ReviewComment = { lineNumber: 1, author: "author", dt: new Date("2019-01-01"), text: "#1" };

    const rm = createReviewManager(editor, 'current.user', [comment], (comments) => { });

    expect(Object.keys(editor._zones).length).toBe(1);
    expect(rm.activeComment).toBe(null);
    expect(rm.widgetInlineToolbar.getPosition()).toBe(undefined);
    expect(rm.widgetInlineCommentEditor.getPosition()).toBe(undefined);

    const num2 = rm.addComment(2, "#2");
    expect(num2.parentId).toBe(null);
    expect(rm.comments.length).toBe(2);
    expect(Object.keys(editor._zones).length).toBe(2);

    rm.setActiveComment(num2);
    const num3 = rm.addComment(null, "#2.2");
    expect(num3.parentId).toBe(num2.id);
    expect(rm.comments.length).toBe(3);
    expect(Object.keys(editor._zones).length).toBe(3);

    rm.setActiveComment(null);
    const num4 = rm.addComment(4, "#4");
    expect(num4.parentId).toBe(null);
    expect(Object.keys(editor._zones).length).toBe(4);
});


test('load clears the comments', () => {
    const editor = getMockEditor();
    const comment: ReviewComment = { lineNumber: 1, author: "author", dt: new Date("2019-01-01"), text: "#1" };

    const rm = createReviewManager(editor, 'current.user', [comment], (comments) => { });
    rm.load([]);
    expect(Object.keys(editor._zones).length).toBe(0);
    expect(rm.comments.length).toBe(0);
    expect(Object.keys(rm.commentState).length).toBe(0);
});


test('Remove a comment via the widgets', () => {
    const editor = getMockEditor();
    const rm = createReviewManager(editor, 'current.user');

    expect(rm.activeComment).toBe(null);
    expect(rm.widgetInlineToolbar.getPosition()).toBe(undefined);
    expect(rm.widgetInlineCommentEditor.getPosition()).toBe(undefined);

    const comment = rm.addComment(1, '');
    const viewZoneId = rm.commentState[comment.id].viewZoneId;

    // Simulate a click on the comment
    rm.handleMouseDown({ target: { element: { className: "", hasAttribute: () => false }, detail: { viewZoneId: viewZoneId } } })
    expect(rm.activeComment).toBe(comment);
    expect(rm.widgetInlineToolbar.getPosition().position.lineNumber).toBe(comment.lineNumber);
    expect(rm.widgetInlineCommentEditor.getPosition()).toBe(undefined);

    rm.removeComment(comment);
    expect(comment.status).toBe(2);
    expect(rm.activeComment).toBe(null);
    expect(rm.widgetInlineToolbar.getPosition()).toBe(undefined);
    expect(rm.widgetInlineCommentEditor.getPosition()).toBe(undefined);
});

test('Enter Comment Widgets', () => {
    const editor = getMockEditor();
    const rm = createReviewManager(editor, 'current.user');

    rm.textarea.value = 'xxxx'
    rm.setEditorMode(1); // Edit Mode    
    expect(rm.textarea.value).toBe(""); //Toolbar
    rm.handleTextAreaKeyDown(({ code: 'Escape', ctrlKey: false } as any) as KeyboardEvent);
    expect(rm.editorMode).toBe(2); //Toolbar

    expect(rm.widgetInlineToolbar.getPosition()).toBe(undefined);
    expect(rm.widgetInlineCommentEditor.getPosition()).toBe(undefined);

    rm.setEditorMode(1);
    rm.textarea.value = '#5';

    rm.handleTextAreaKeyDown(({ code: 'Enter', ctrlKey: true } as any) as KeyboardEvent);
    expect(rm.editorMode).toBe(2); //Toolbar    
    expect(rm.commentState[rm.comments[0].id].viewZoneId).toBe(0);
    expect(rm.comments[0].text).toBe('#5');
});

test('Navigation - Forward and Back', () => {
    const editor = getMockEditor();
    const rm = createReviewManager(editor, 'current.user');
    const c1 = rm.addComment(1, "1");
    const c2 = rm.addComment(2, "2");
    const c3 = rm.addComment(3, "3");
    const c4 = rm.addComment(4, "4");
    const c5 = rm.addComment(5, "5");

    rm.activeComment = c1;
    const c1_1 = rm.addComment(1, "1.1");

    rm.removeComment(c2);
    rm.removeComment(c4);

    rm.activeComment = c3;

    rm.navigateToComment(2);
    expect(rm.activeComment.id).toBe(c1.id);

    rm.navigateToComment(2);
    expect(rm.activeComment.id).toBe(c1.id); // Should this wrap around to the end?

    rm.navigateToComment(1);
    expect(rm.activeComment.id).toBe(c3.id);
})