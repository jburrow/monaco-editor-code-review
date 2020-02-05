import * as React from 'react'
import * as RGL from "react-grid-layout";

const ReactGridLayout = RGL.WidthProvider(RGL);

/**
 * This layout demonstrates how to use static grid elements.
 * Static elements are not draggable or resizable, and cannot be moved.
 */
export const StaticElementsLayout = (props:{onLayoutChange(layout:any):void})=> {


    return (
      <ReactGridLayout
        className="layout"
        onLayoutChange={props.onLayoutChange}
        rowHeight={50}
        cols={3}
      >
        <div key="1" data-grid={{ x: 0, y: 0, w: 1, h: 1 }} style={{backgroundColor:'pink',height:"100%",width:"100%"}}>
          <span className="text">1</span>
        </div>
        <div key="2" data-grid={{ x: 1, y: 0, w: 1, h: 1 }}>
          <span className="text">2 - Static</span>
        </div>
        <div key="3" data-grid={{ x: 2, y: 0, w: 1, h: 1 }}>
          <span className="text">3</span>
        </div>
  
      </ReactGridLayout>
    );
        }