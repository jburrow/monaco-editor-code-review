import { ReviewComment, createReviewManager } from "./index";

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
        addContentWidget: () => null,
        onMouseDown: () => null,
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
    rm.widgetInlineToolbar.getId();
    rm.widgetInlineToolbar.getPosition();

    rm.setEditorMode(1);
    rm.widgetInlineCommentEditor.getId();
    rm.widgetInlineCommentEditor.getPosition();
})

test('can attach createReviewManager to editor', () => {
    const editor = getMockEditor();
    const comment: ReviewComment = { lineNumber: 1, author: "author", dt: new Date("2019-01-01"), text: "#1" };

    const rm = createReviewManager(editor, 'current.user', [], (comments) => { });
    rm.load([comment]);
    expect(Object.keys(editor._zones).length).toBe(1);
    expect(rm.activeComment).toBe(null);

    rm.handleMouseDown({ target: { element: { hasAttribute: () => false }, detail: { viewZoneId: 0 } } })
    expect(rm.activeComment).toBe(comment);

    //check active comment
    //check the widget moved
    //check the contentview has active classes on it.

    rm.removeComment(comment);
    expect(rm.activeComment).toBe(null);

    expect(rm.comments.length).toBe(1); //TODO marked deleted ;)
    expect(Object.keys(editor._zones).length).toBe(0);

    const num2 = rm.addComment(2, "#2");
    expect(rm.comments.length).toBe(2);
    expect(Object.keys(editor._zones).length).toBe(1);

    rm.setActiveComment(num2);
    const num3 = rm.addComment(null, "#2.2");
    expect(rm.comments.length).toBe(2);
    expect(Object.keys(editor._zones).length).toBe(2);

    rm.setActiveComment(null);
    const num4 = rm.addComment(4, "#4");
    expect(Object.keys(editor._zones).length).toBe(3);

    rm.setActiveComment(num4);

    rm.navigateToComment(2);
    expect(rm.activeComment.text).toBe('#2');

    rm.navigateToComment(2);
    expect(rm.activeComment.text).toBe('#1');

    rm.navigateToComment(1);
    expect(rm.activeComment.text).toBe('#2');

    console.debug('COMMENTS', rm.comments.length, rm.comments);

    rm.setActiveComment(null);

    rm.setEditorMode(1); // Edit Mode
    rm.handleTextAreaKeyDown(({ code: 'Escape', ctrlKey: false } as any) as KeyboardEvent);
    expect(rm.editorMode).toBe(2); //Toolbar

    rm.setEditorMode(1);
    rm.textarea.value = '#5';

    rm.handleTextAreaKeyDown(({ code: 'Enter', ctrlKey: true } as any) as KeyboardEvent);
    expect(rm.editorMode).toBe(2); //Toolbar
    expect(rm.textarea.value).toBe("");
    expect(Object.keys(editor._zones).length).toBe(4);
    expect(rm.comments[3].text).toBe('#5');
});