import { render } from "react-dom";
import * as React from 'react'
import * as RGL from "react-grid-layout";
import { reduceVersionControl, FileEditEvent, versionControlReducer, VersionControlState, FileEvents, FileState, VersionControlEvent, initialVersionControlState } from "./../events-version-control";
import { DiffEditor, ControlledEditor } from "@monaco-editor/react";

const ReactGridLayout = RGL.WidthProvider(RGL);

const Editor = (props: { view: { fullPath: string, text: string, original?: string }, wsDispatch(e: VersionControlEvent): void }) => {
    const [text, setText] = React.useState<string>("");

    return props.view && props.view.fullPath ? <div>
        <h3>{props.view.fullPath} </h3>
        {props.view.original ?
            <DiffEditor editorDidMount={(modified, original, editor) => { console.warn(modified(), original(), editor.getModifiedEditor().getValue()); }}
                modified={props.view.text}
                original={props.view.original} /> :
            <ControlledEditor value={props.view.text}
                options={{ readOnly:false}}
                onChange={(e, t) => setText(t)} />}

        {text !== props.view.text ? <button onClick={() => {
            props.wsDispatch({
                type: 'commit',
                author: 'interactive!',
                events: [{ type: 'edit', fullPath: props.view.fullPath, text: text }]
            })
        }}>Save</button> : <div>not modified</div>}
    </div> : null;
};

const History = (props: { script: FileState, appDispatch: AppDispatch }) => {
    const [selected, setSelected] = React.useState<number[]>([]);
    const convert = (e: FileEvents) => {
        switch (e.type) {
            case "edit":
                return `${e.fullPath} : "${e.text.substring(0, 10)} ..."`
            default:
                return JSON.stringify(e);
        }
    }

    if (props.script) {
        const events: FileEvents[] = []
        for (const history of props.script.history) {
            if (history.type === 'commit') {
                for (const e of history.events) {
                    if (props.script.fullPath === e.fullPath) {
                        events.push(e);
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
                    fullPath: h.fullPath,
                    text: (h as FileEditEvent).text
                })}>view</button>

                {convert(h)}
            </div>))}
            {selected.length == 2 && <button onClick={() => props.appDispatch({
                type: "selectedView",
                fullPath: props.script.fullPath,
                text: (events[selected[1]] as FileEditEvent).text,
                original: (events[selected[0]] as FileEditEvent).text
            })}>diff</button>}
        </div>
    }
    return null;
};

interface AppState {
    selectedScript?: { fullPath: string, text: string };
    selectedView?: { fullPath: string, text: string, original?: string };
}
type AppStateEvents = { type: 'selectScript', fullPath: string, text: string } | { type: 'selectedView', fullPath: string, text: string, original?: string };

const reducer = (state: AppState, event: AppStateEvents) => {
    switch (event.type) {
        case "selectScript":
            return { ...state, selectedScript: { fullPath: event.fullPath, text: event.text } }
        case "selectedView":
            return { ...state, selectedView: { fullPath: event.fullPath, text: event.text, original: event.original } }
    }
    return state;
}

function loadVersionControlStore(): VersionControlState {
    const events: FileEvents[] = [
        { fullPath: "/script1.py", text: "version 1", type: "edit" },
        { fullPath: "/script2.py", text: "version 1", type: "edit" },
        { fullPath: "/script3.py", text: "version 1", type: "edit" }];

    const store = reduceVersionControl([{
        type: "commit", author: "james", id: 'id-0',
        events: events
    }, {
        type: "commit", author: "james", id: 'id-1',
        events: [{ fullPath: "/script1.py", text: "version 1.1", type: "edit" }]
    }, {
        type: "commit", author: "james", id: 'id-2',
        events: [{ fullPath: "/script1.py", text: "version 1.2", type: "edit" }]
    }]);

    return store;
}

export const App = () => {
    const [appState, appDispatch] = React.useReducer(reducer, {});
    const [vcStore, vcDispatch] = React.useReducer(versionControlReducer, loadVersionControlStore());
    const [wsStore, wsDispatch] = React.useReducer(versionControlReducer, initialVersionControlState());

    return (
        <ReactGridLayout
            className="layout"
            rowHeight={400}
            cols={3}
            draggableCancel={".fish"}
        >
            <div key="0.1" data-grid={{ x: 0, y: 0, w: 1, h: 1 }} style={{ backgroundColor: 'pink', }}>
                <div className="fish">
                    <h3>version-control</h3>
                    <SCM appDispatch={appDispatch} vcStore={vcStore} />
                    {vcStore.events.length}
                    <h3>working set</h3>
                    <SCM appDispatch={appDispatch} vcStore={wsStore} />
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
            <div key="0.2" data-grid={{ x: 1, y: 0, w: 1, h: 1, }} style={{ backgroundColor: 'yellow', }} >
                <h3>Editor</h3>
                <div className="fish">

                    <Editor view={appState.selectedView}

                        wsDispatch={wsDispatch} />
                </div>
            </div>
            <div key="0.3" data-grid={{ x: 2, y: 0, w: 1, h: 1 }} style={{ backgroundColor: 'orange', }}>
                <h3>History</h3>
                <div className="fish">
                    <History script={appState.selectedScript && vcStore.files[appState.selectedScript.fullPath]}
                        appDispatch={appDispatch}
                    />
                </div>
            </div>
            <div key="1.1" data-grid={{ x: 0, y: 1, w: 3, h: 1 }} style={{ backgroundColor: 'cyan', }}>
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
    for (const e of props.vcStore.events.reverse()) {
        if (e.type == 'commit') {
            rows.push(`commit: ${e.id}`)
            for (const fe of e.events) {
                rows.push(JSON.stringify(fe))
            }
        }
    }
    return <div>
        {rows.map((r, idx) => <div key={idx}>{r}</div>)}
    </div>
}
type AppDispatch = (event: AppStateEvents) => void;

const SCM = (props: { vcStore: VersionControlState, appDispatch: AppDispatch }) => {
    const items = Object.entries(props.vcStore.files).map(([key, value]) => <li key={key} onClick={() => {
        props.appDispatch({ type: 'selectScript', fullPath: value.fullPath, text: value.text })
    }}>{key}-{value.fullPath}</li>);
    return <ul>{items}</ul>
}

render(<App />, document.body);