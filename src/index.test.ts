import { ReviewComment, createReviewManager } from "./index";


interface MonacoWindow {
    monaco: any;
    prompt: any;
}

const monacoWindow = (window as any) as MonacoWindow;
monacoWindow.monaco = {
    KeyMod: { CtrlCmd: 0 }, KeyCode: { F10: 1 },
    Range: () => { }
};
monacoWindow.prompt = () => 'comment';

test('can attach createReviewManager to editor', () => {
    const editor = {
        _zoneId: 0,
        _zones: {},
        addAction: () => null,
        addContentWidget: () => null,
        onMouseDown: () => null,
        revealLineInCenter: () => null,
        deltaDecorations: () => null,
        changeViewZones: (cb) => cb({
            removeZone: (zoneId) => {
                console.debug('deleted zone', zoneId);
                delete editor._zones[zoneId]
            },
            addZone: (zone) => {
                const zoneId = editor._zoneId++;
                editor._zones[zoneId] = zone;
                console.debug('created', zoneId, zone.domNode.className);
                return zoneId;
            }
        }),
        layoutContentWidget: () => null,
        getPosition: () => { return { lineNumber: 1 } }
    };

    const comment: ReviewComment = { id: 'id-1', lineNumber: 1, author: "author", dt: new Date("2019-01-01"), text: "#1" };

    const rm = createReviewManager(editor, 'current.user', [], (comments) => { });
    rm.load([comment]);
    expect(Object.keys(editor._zones).length).toBe(1);
    expect(rm.activeComment).toBe(null);

    rm.handleMouseDown({ target: { element: { tagName: 'DIV', }, detail: { viewZoneId: 0 } } })
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
});