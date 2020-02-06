import { render } from "react-dom";
import * as React from 'react'
import * as RGL from "react-grid-layout";
import { reduceVersionControl, versionControlReducer, VersionControlState, FileEvents, FileState, VersionControlEvent, initialVersionControlState } from "./../events-version-control";
import { DiffEditor, monaco } from "@monaco-editor/react";

const ReactGridLayout = RGL.WidthProvider(RGL);

// (window as any).require.config({
// monaco.config(
//    {urls:{ monacoBase: "../node_modules/monaco-editor/min/vs" }}
// )


const Editor = (props: { fullPath: string, text: string, wsDispatch(e: VersionControlEvent): void }) => {
    const [text, setText] = React.useState<string>("");
    React.useEffect(() => {
        console.log('useEffect', props.text);
        if (props.text) {
            setText(props.text)

        }
    }, [props.text, props.fullPath]);



    return props.fullPath ? <div>
        <h3>{props.fullPath} </h3>
        <input onChange={(e) => setText(e.target.value)} value={text} type="text"></input>
        {text !== props.text ? <button onClick={() => {
            props.wsDispatch({
                type: 'commit',
                author: 'interactive!',
                events: [{ type: 'edit', fullPath: props.fullPath, text: text }]
            })
        }}>Save</button> : <div>not modified</div>}
    </div> : null;
};

const History = (props: { script: FileState }) => {
    const [selected, setSelected] = React.useState<number[]>([]);
 

    const convert = (e: FileEvents) => {
        switch (e.type) {
            case "edit":
                return `${e.fullPath} : "${e.text.substring(0, 10)} ..."`
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
                if(selected.indexOf(idx)>-1){
                    setSelected(selected.filter((i)=>i!==idx));
                } else{
                    setSelected(selected.concat(idx));
                }
        }}>{selected.indexOf(idx)>-1?'select':'deselect'}</button>

            {selected.indexOf(idx)>-1?'selected':''} {convert(h)}
        </div>))}

        </div>
    }
    return null;
};

interface AppState {
    selectedScript?: { fullPath: string, text: string };

}
type AppStateEvents = { type: 'selectScript', fullPath: string, text: string } | { type: 'editScript', fullPath: string, text: string };

const reducer = (state: AppState, event: AppStateEvents) => {
    switch (event.type) {
        case "selectScript":
            return { ...state, selectedScript: { fullPath: event.fullPath, text: event.text } }

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
    },{
        type: "commit", author: "james", id: 'id-1',
        events: [{ fullPath: "/script1.py", text: "version 1.1", type: "edit" }]
    },{
        type: "commit", author: "james", id: 'id-2',
        events: [{ fullPath: "/script1.py", text: "version 1.2", type: "edit" }]
    }]);

    

    return store;
}



export const App = () => {
    const [appState, appDispatch] = React.useReducer(reducer, {});
    const [vcStore, vcDispatch] = React.useReducer(versionControlReducer, loadVersionControlStore());
    const [wsStore, wsDispatch] = React.useReducer(versionControlReducer, initialVersionControlState());

    // React.useEffect(() => {
    //     if (appState.selectedScript) {
    //         appDispatch({ type: "selectScript", script: vcStore.files[appState.selectedScript.fullPath] })
    //     }
    // }, [vcStore])

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
                    <Editor fullPath={appState.selectedScript && appState.selectedScript.fullPath}
                        text={appState.selectedScript && appState.selectedScript.text}
                        wsDispatch={wsDispatch} />
                </div>
            </div>
            <div key="0.3" data-grid={{ x: 2, y: 0, w: 1, h: 1 }} style={{ backgroundColor: 'orange', }}>
                <h3>History</h3>
                <div className="fish">
                <History script={appState.selectedScript && vcStore.files[appState.selectedScript.fullPath]} />
                </div>
            </div>
            <div key="1.1" data-grid={{ x: 0, y: 1, w: 3, h: 1 }} style={{ backgroundColor: 'cyan', }}>

                {vcStore.version}
            </div>
        </ReactGridLayout>
    );
}




const SCM = (props: { vcStore: VersionControlState, appDispatch(event: AppStateEvents): void }) => {
    const items = Object.entries(props.vcStore.files).map(([key, value]) => <li key={key} onClick={() => {
        props.appDispatch({ type: 'selectScript', fullPath: value.fullPath, text: value.text })
    }}>{key}-{value.fullPath}</li>);
    return <ul>{items}</ul>
}



render(<App />, document.body);

function useKeyPress(targetKey:string, ctrlKey?:boolean) {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = React.useState(false);

    const testFn = (e:KeyboardEvent)=>{
        console.log(e.ctrlKey,e.key)
        const x = targetKey===null || targetKey===e.key;
        const y = ctrlKey ===null || e.ctrlKey || e.key ==='Control' ===ctrlKey;
        return x && y
    }
  
    // If pressed key is our target key then set to true
    function downHandler(e:KeyboardEvent) {
      if (testFn(e)) {
        setKeyPressed(true);
      }
    }
  
    // If released key is our target key then set to false
    const upHandler = (e:KeyboardEvent) => {
        
      if (testFn(e)) {
        setKeyPressed(false);
      }
    };
  
    // Add event listeners
    React.useEffect(() => {
      window.addEventListener('keydown', downHandler);
      window.addEventListener('keyup', upHandler);
      // Remove event listeners on cleanup
      return () => {
        window.removeEventListener('keydown', downHandler);
        window.removeEventListener('keyup', upHandler);
      };
    }, []); // Empty array ensures that effect is only run on mount and unmount
  
    return keyPressed;
  }