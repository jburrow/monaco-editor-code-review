import { render } from "react-dom";
import * as React from 'react'
import * as RGL from "react-grid-layout";
import { reduceVersionControl, FileEditEvent, versionControlReducer, VersionControlState, FileEvents, FileState, VersionControlEvent, initialVersionControlState } from "./../events-version-control";
import { DiffEditor, ControlledEditor, monaco } from "@monaco-editor/react";
import * as mx from "monaco-editor";
import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import { createReviewManager, ReviewManager } from "./../index";
import { CommentState, ReviewCommentEvent } from "../events-comments-reducers";
import '../../dist/index.css';

const ReactGridLayout = RGL.WidthProvider(RGL);

monaco.init().then(() => console.log('xxxxx', (window as any).monaco));

const Editor = (props: { currentUser: string, view: SelectedView, wsDispatch(e: VersionControlEvent): void }) => {
    const [text, setText] = React.useState<string>(null);
    const [comments, setComments] = React.useState<ReviewCommentEvent[]>(null);
    const [reviewManager, setReviewManager] = React.useState<ReviewManager>(null);

    React.useEffect(() => {
        if (props.view) {
            setText(props.view.text);
            setComments([]);
        }
    }, [props.view])

    React.useEffect(() => {
        console.debug('load comments', props.view?.comments?.comments)
        if (reviewManager !== null && props.view) {
            //mx.editor.createModel()
            const model = ((window as any).monaco).editor.createModel(props.view.text,'javascript');
            reviewManager.editor.setModel(model)
            

            const cc = {}
            if (props.view.comments?.comments) {
                for (const [fn, ccc] of Object.entries(props.view.comments.comments)) {
                    cc[fn] = { ...ccc, viewZoneId: null, renderStatus: null }

                }
            }
            reviewManager.loadFromStore({ comments: cc, viewZoneIdsToDelete: [] })
        }
    }, [reviewManager, props.view]);

    function setEditor(editor) {//: monaco.editor.IStandaloneCodeEditor
        const rm = createReviewManager(editor, props.currentUser, [], (c) => { console.log('CONSOLE', c); setComments(c) })
        setReviewManager(rm);
    }

    return props.view && props.view.fullPath ? <div>
        {text !== props.view.text ? <button onClick={() => {
            props.wsDispatch({
                type: 'commit',
                author: props.currentUser,
                events: [{ type: 'edit', fullPath: props.view.fullPath, text: text }]
            })
        }}>Save</button> : <div>not modified text</div>}

        {(comments || []).length ? <button onClick={() => {
            props.wsDispatch({
                type: 'commit',
                author: props.currentUser,
                events: [{ type: 'comment', fullPath: props.view.fullPath, commentEvents: comments }]
            })
        }}>Save Comments {`${comments.length}`}</button> : <div>not modified comments</div>}

        {props.view.original ?
            <DiffEditor editorDidMount={(_modified, _original, editor) => {
                editor.getModifiedEditor().onDidChangeModelContent(() => setText(editor.getModifiedEditor().getValue()));
                setEditor(editor.getModifiedEditor());
            }}
                options={{ originalEditable: false }}
                height={200}
                modified={props.view.text}
                original={props.view.original}
            /> :
            <ControlledEditor value={props.view.text}
                height={200}
                options={{ readOnly: false }}
                editorDidMount={(_, editor) => {
                    setEditor(editor);
                }}
                onChange={(e, t) => setText(t)} />}
    </div> : null;
};

interface HistoryRow {
    revision?: string, event: FileEvents
}
const History = (props: { script: FileState, appDispatch: AppDispatch }) => {
    const [selected, setSelected] = React.useState<number[]>([]);

    const convert = (e: HistoryRow) => {
        switch (e.event.type) {
            case "edit":
                return `${e.revision} : ${e.event.fullPath} : "${e.event.text.substring(0, 10)} ..."`
            default:
                return JSON.stringify(e);
        }
    }

    if (props.script) {
        const events: HistoryRow[] = []
        for (const history of props.script.history) {
            if (history.type === 'commit') {
                for (const e of history.events) {
                    if (props.script.fullPath === e.fullPath) {
                        events.push({ revision: history.id, event: e });
                    }
                }
            }
        }

        return <div>{events.map((h, idx) => (
            <div key={idx} >
                <button onClick={() => {
                    if (selected.indexOf(idx) > -1) {
                        setSelected(selected.filter((i) => i !== idx));
                    } else {
                        setSelected(selected.concat(idx));
                    }
                }}>{selected.indexOf(idx) > -1 ? 'deselect' : 'select'}</button>

                <button onClick={() => props.appDispatch({
                    type: "selectedView",
                    fullPath: h.event.fullPath,
                    text: (h.event as FileEditEvent).text,

                })}>view</button>

                {convert(h)}
            </div>))}
            {selected.length == 2 && <button onClick={() => {
                const m = events[selected[1]];
                const original = events[selected[0]]
                props.appDispatch({
                    type: "selectedView",
                    fullPath: props.script.fullPath,
                    label: `base:${original.revision} v other:${m.revision}`,
                    text: (m.event as FileEditEvent).text,
                    original: (original.event as FileEditEvent).text
                })
            }}>diff</button>}
        </div>
    }
    return null;
};

interface AppState {
    selectedScript?: { fullPath: string };
    selectedView?: { fullPath: string, text: string, original?: string, label?: string };
}

interface SelectedView {
    fullPath: string, label?: string, text: string, original?: string, comments?: CommentState
}
type AppStateEvents = { type: 'selectScript', fullPath: string } |
    { type: 'selectedView', } & SelectedView;

const reducer = (state: AppState, event: AppStateEvents) => {
    switch (event.type) {
        case "selectScript":
            return { ...state, selectedScript: { fullPath: event.fullPath } }
        case "selectedView":
            return {
                ...state, selectedView: {
                    fullPath: event.fullPath,
                    text: event.text,
                    original: event.original,
                    label: event.label,
                    comments: event.comments
                }
            }
    }
    return state;
}

function loadVersionControlStore(): VersionControlState {
    const events: FileEvents[] = [
        { fullPath: "/script1.py", text: "function version(){ return 's1.1'}", type: "edit" },
        { fullPath: "/script2.py", text: "function version(){ return 's2.1'}", type: "edit" },
        { fullPath: "/script3.py", text: "function version(){ return 's3.1'}", type: "edit" }];

    const store = reduceVersionControl([{
        type: "commit", author: "james", id: 'id-0',
        events: events
    }, {
        type: "commit", author: "james", id: 'id-1',
        events: [{ fullPath: "/script1.py", text: "function version(){ return 's1.2'}", type: "edit" }]
    }, {
        type: "commit", author: "james", id: 'id-2',
        events: [{ fullPath: "/script1.py", text: "function version(){ return 's1.3'}", type: "edit" }]
    }]);

    return store;
}

export const App = () => {
    const [appState, appDispatch] = React.useReducer(reducer, {});
    const [vcStore, vcDispatch] = React.useReducer(versionControlReducer, loadVersionControlStore());
    const [wsStore, wsDispatch] = React.useReducer(versionControlReducer, initialVersionControlState());
    const [cmtStore, cmtDispatch] = React.useReducer(() => null, {});
    const currentUser = 'xyz-user';

    return (
        <ReactGridLayout
            rowHeight={30}
            maxRows={20}
            compactType={null}
            cols={12}
            useCSSTransforms={false}
            draggableCancel={".fish"}

        >
            <div key="0.1" data-grid={{ x: 0, y: 0, w: 3, h: 8 }} style={{ backgroundColor: 'pink', }}>
                <div className="fish">
                    <h3>version-control</h3>
                    <SCM appDispatch={appDispatch} files={vcStore.files} />
                    {vcStore.events.length}
                    <h3>working set</h3>
                    <SCM appDispatch={appDispatch} files={wsStore.files} />
                    {wsStore.events.length}
                    <button onClick={() => {
                        let events = [];
                        for (const e of wsStore.events) {
                            if (e.type == 'commit') {
                                events = events.concat(e.events);
                            }
                        }

                        vcDispatch({
                            type: "commit", author: "james", id: 'id-2',
                            events: events
                        })
                        wsDispatch({ type: "reset" });

                    }}>Commit</button>
                </div>
            </div>
            <div key="0.2" data-grid={{ x: 3, y: 0, w: 6, h: 8, }} style={{ backgroundColor: 'yellow', }} >
                {appState.selectedView ? <h5>Editor - {appState.selectedView.fullPath} - {appState.selectedView.label}</h5> : 'Editor'}
                <div className="fish" style={{ height: "calc(100% - 100px)", backgroundColor: 'red' }}>

                    <Editor currentUser={currentUser} view={appState.selectedView}

                        wsDispatch={wsDispatch} />
                </div>
            </div>
            <div key="0.3" data-grid={{ x: 9, y: 0, w: 3, h: 8 }} style={{ backgroundColor: 'orange', }}>
                <h3>History</h3>
                <div className="fish">
                    <History script={appState.selectedScript && vcStore.files[appState.selectedScript.fullPath]}
                        appDispatch={appDispatch}
                    />
                </div>
            </div>
            <div key="1.1" data-grid={{ x: 0, y: 1, w: 12, h: 10 }} style={{ backgroundColor: 'cyan', }}>
                <h3>VC History</h3>
                <div className="fish">
                    <VCHistory vcStore={vcStore} />
                </div>
                {vcStore.version}
            </div>
        </ReactGridLayout>
    );
}

const VCHistory = (props: { vcStore: VersionControlState }) => {
    const rows = [];
    for (const e of props.vcStore.events) {
        if (e.type == 'commit') {
            rows.push(`commit: ${e.id}`)
            for (const fe of e.events) {
                rows.push(JSON.stringify(fe))
            }
        }
    }
    return <div>
        {rows.reverse().map((r, idx) => <div key={idx}>{r}</div>)}
    </div>
}
type AppDispatch = (event: AppStateEvents) => void;

const SCM = (props: { files: Record<string, FileState>, appDispatch: AppDispatch }) => {
    const handleClick = (fullPath: string) => {
        const value = props.files[fullPath];
        props.appDispatch({ type: 'selectScript', fullPath: value.fullPath })
        props.appDispatch({ type: 'selectedView', fullPath: value.fullPath, text: value.text, comments: value.comments });
    };

    const items = Object.entries(props.files).map(([key, value]) => <XXX key={value.fullPath} fullPath={value.fullPath} onClick={handleClick} />);
    return <ul>{items}</ul>
}

const XXX = (props: { fullPath: string, onClick(fullPath: string): void }) => {
    return <li onClick={() => props.onClick(props.fullPath)}>{props.fullPath}</li>
}

render(<App />, document.body);