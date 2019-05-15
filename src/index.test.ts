import { ReviewComment, createReviewManager } from "./index";


interface MonacoWindow {
    monaco: any;
    prompt: any;
}

const monacoWindow = (window as any) as MonacoWindow;
monacoWindow.monaco = { KeyMod: { CtrlCmd: 0 }, KeyCode: { F10: 1 } };
monacoWindow.prompt = () => 'comment';

test('can attach createReviewManager to editor', () => {
    const editor = {
        _zoneId: 0,
        _zones: {},
        addAction: () => null,
        addContentWidget: () => null,
        onMouseDown: () => null,
        changeViewZones: (cb) => cb({
            removeZone: (zoneId) => {
                console.log('deleted zone', zoneId);
                delete editor._zones[zoneId]
            },
            addZone: (zone) => {
                const zoneId = editor._zoneId++;
                editor._zones[zoneId] = zone;
                console.log('created', zoneId, zone.domNode.className);
                return zoneId;
            }
        }),
        layoutContentWidget: () => null,
        getPosition: () => { return { lineNumber: 1 } }
    };


    const rm = createReviewManager(editor, 'current.user');
    const comment = new ReviewComment('id-1', 1, "", new Date("2019-01-01"), "Comment");
    rm.load([comment]);
    expect(Object.keys(editor._zones).length).toBe(1);
    expect(rm.activeComment).toBe(null);

    rm.handleMouseDown({ target: { element: { tagName: 'DIV', }, detail: { viewZoneId: 0 } } })
    expect(rm.activeComment).toBe(comment);

    //check active comment
    //check the widget moved
    //check the contentview has active classes on it.

    rm.handleMouseDown({ target: { element: { tagName: 'BUTTON', name: 'remove' } } })
    expect(rm.comments.length).toBe(1); //TODO marked deleted ;)
    expect(Object.keys(editor._zones).length).toBe(0);

    rm.handleMouseDown({ target: { element: { tagName: 'BUTTON', name: 'add' } } });
    rm.handleMouseDown({ target: { element: { tagName: 'BUTTON', name: 'save' } } });
    expect(rm.comments.length).toBe(2);
    expect(Object.keys(editor._zones).length).toBe(1);

    rm.handleMouseDown({ target: { element: { tagName: 'BUTTON', name: 'add' } } });
    rm.handleMouseDown({ target: { element: { tagName: 'BUTTON', name: 'cancel' } } });
    expect(rm.comments.length).toBe(2);
    expect(Object.keys(editor._zones).length).toBe(1);
});