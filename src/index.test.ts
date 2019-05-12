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
        addAction: () => null,
        addContentWidget: () => null,
        onMouseDown: () => null,
        changeViewZones: (cb) => cb({
            removeZone: () => null,
            addZone: () => 1
        }),
        layoutContentWidget: () => null,
        getPosition: () => { return { lineNumber: 1 } }
    };

    const rm = createReviewManager(editor, 'current.user');
    rm.load([new ReviewComment(1, "", new Date("2019-01-01"), "Comment")]);
    rm.setActiveComment(rm.comments[0]);

    //check active comment
    //check the widget moved
    //check the contentview has active classes on it.

    rm.handleMouseDown({ target: { element: { tagName: 'BUTTON', name: 'remove' } } })
    expect(rm.comments.length).toBe(1); //TODO marked deleted ;)

    rm.handleMouseDown({ target: { element: { tagName: 'BUTTON', name: 'add' } } })
    expect(rm.comments.length).toBe(2);
});