import { render } from "react-dom";
import * as React from 'react'
import * as RGL from "react-grid-layout";
import { reduceVersionControl, versionControlReducer, VersionControlState, FileEvents, FileState } from "./../events-version-control";
import { DiffEditor, monaco } from "@monaco-editor/react";

const ReactGridLayout = RGL.WidthProvider(RGL);

// (window as any).require.config({
// monaco.config(
//    {urls:{ monacoBase: "../node_modules/monaco-editor/min/vs" }}
// )


const Editor = (props:{script:FileState}) => {
    return <div>{JSON.stringify(props.script)}</div>;
};

const History = (props:{script:FileState}) => {
    if(props.script){
        return <ul>{props.script.history.map((h)=><li key={h.id}>{h.type}</li>)}</ul>
    }
    return null;
    };

interface AppState{
    selectedScript?:null;
}
type AppStateEvents={type:'selectScript',script:FileState};

const reducer = (state:AppState,event:AppStateEvents)=>{
    switch(event.type){
        case "selectScript":
            return {...state,selectedScript:event.script}
            break;
    }
    return state;
}


function loadVersionControlStore():VersionControlState{
    const events: FileEvents[] = [
        { fullPath: "/script1.py", text: "version 1", type: "edit" },
        { fullPath: "/script2.py", text: "version 1", type: "edit" },
        { fullPath: "/script3.py", text: "version 1", type: "edit" }];
    
    const store = reduceVersionControl([{
        type: "commit", author: "james", id:'id-0',
        events: events
    }]);

    return store;
}

export const App = () => {
    const [state, d]=React.useReducer(reducer,{});
    const [vcStore, dd]=React.useReducer(versionControlReducer,loadVersionControlStore());
    
    return (
        <ReactGridLayout
            className="layout"
            rowHeight={1024}
            cols={3}
        >
            <div key="1" data-grid={{ x: 0, y: 0, w: 1, h: 1 }} style={{ backgroundColor: 'pink',  }}>
                <SCM d={d} vcStore={vcStore}/>
            </div>
            <div key="2" data-grid={{ x: 1, y: 0, w: 1, h: 1 }} style={{ backgroundColor: 'yellow',}}>
                <Editor script={state.selectedScript}/>
            </div>
            <div key="3" data-grid={{ x: 2, y: 0, w: 1, h: 1 }} style={{ backgroundColor: 'orange',}}>
                <History script={state.selectedScript}/>
            </div>
        </ReactGridLayout>
    );
}


const SCM = (props:{vcStore:VersionControlState,d:any}) => {
    const items = Object.entries(props.vcStore.files).map(([key, value]) => <li key={key} onClick={() => {
        console.log(value);
        props.d({type:'selectScript',script:value})}}>{key}-{value.fullPath}</li>);
    return <ul>{items}</ul>
}



render(<App />, document.body);