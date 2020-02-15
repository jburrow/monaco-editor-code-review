!function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=2)}([,function(e,t,n){var o=n(4),i=n(5);e.exports=function(e,t,n){var r=t&&n||0;"string"==typeof e&&(t="binary"===e?new Array(16):null,e=null);var s=(e=e||{}).random||(e.rng||o)();if(s[6]=15&s[6]|64,s[8]=63&s[8]|128,t)for(var m=0;m<16;++m)t[r+m]=s[m];return t||i(s)}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(3);t.reduceComments=o.reduceComments;const i=n(1),r=window;var s,m;!function(e){e[e.next=1]="next",e[e.prev=2]="prev"}(s||(s={})),function(e){e[e.insertComment=1]="insertComment",e[e.editComment=2]="editComment",e[e.toolbar=3]="toolbar"}(m=t.EditorMode||(t.EditorMode={})),t.createReviewManager=function(e,t,n,o,i,r){const s=new a(e,t,o,i,r);return s.load(n||[]),s};const d={commentIndent:20,commentIndentOffset:20,editButtonAddText:"Reply",editButtonEditText:"Edit",editButtonEnableEdit:!0,editButtonEnableRemove:!0,editButtonOffset:"-10px",editButtonRemoveText:"Remove",formatDate:null,readOnly:!1,rulerMarkerColor:"darkorange",rulerMarkerDarkColor:"darkorange",showAddCommentGlyph:!0,showInRuler:!0,verticalOffset:0};class a{constructor(e,t,n,o,i){this.currentUser=t,this.editor=e,this.activeComment=null,this.widgetInlineToolbar=null,this.widgetInlineCommentEditor=null,this.onChange=n,this.editorMode=m.toolbar,this.config=Object.assign(Object.assign({},d),o||{}),this.currentLineDecorations=[],this.currentCommentDecorations=[],this.currentLineDecorationLineNumber=null,this.events=[],this.store={comments:{}},this.renderStore={},this.verbose=i,this.editorConfig=this.editor.getRawOptions(),this.editor.onDidChangeConfiguration(()=>this.editorConfig=this.editor.getRawOptions()),this.editor.onMouseDown(this.handleMouseDown.bind(this)),this.canAddCondition=this.editor.createContextKey("add-context-key",!this.config.readOnly),this.inlineToolbarElements=this.createInlineToolbarWidget(),this.editorElements=this.createInlineEditorWidget(),this.addActions(),this.config.showAddCommentGlyph&&this.editor.onMouseMove(this.handleMouseMove.bind(this))}setReadOnlyMode(e){this.config.readOnly=e,this.canAddCondition.set(e),this.renderAddCommentLineDecoration(null)}load(e){const t=o.reduceComments(e);this.loadFromStore(t,e)}loadFromStore(e,t){this.editor.changeViewZones(n=>{for(const e of Object.values(this.store.comments)){const t=this.getRenderState(e.comment.id);t&&null!==t.viewZoneId&&n.removeZone(t.viewZoneId)}this.events=t,this.store=e,this.store.deletedCommentIds=null,this.store.dirtyCommentIds=null,this.renderStore={},this.refreshComments(),this.verbose&&console.debug("Events Loaded:",t.length,"Review Comments:",Object.values(this.store.comments).length)})}getThemedColor(e){const t=this.editor._themeService.getTheme();let n=t.getColor(e);return n||(n={dark:{"button.background":"#0e639c","button.foreground":"#ffffff"},light:{"button.background":"#007acc","button.foreground":"#ffffff"}}[t.themeName.indexOf("dark")>-1?"dark":"light"][e]),n}createInlineEditButtonsElement(){var e=document.createElement("div");e.className="editButtonsContainer",e.style.marginLeft=this.config.editButtonOffset;const t=document.createElement("span");t.innerText=this.config.editButtonAddText,t.className="editButton add",t.setAttribute("ReviewManagerControl",""),t.onclick=()=>this.setEditorMode(m.insertComment),e.appendChild(t);let n=null,o=null,i=null;return this.config.editButtonEnableRemove&&(i=document.createElement("div"),i.innerText=" ",e.appendChild(i),n=document.createElement("span"),n.setAttribute("ReviewManagerControl",""),n.innerText=this.config.editButtonRemoveText,n.className="editButton remove",n.onclick=()=>this.activeComment&&this.removeComment(this.activeComment.id),e.appendChild(n)),this.config.editButtonEnableEdit&&(i=document.createElement("div"),i.innerText=" ",e.appendChild(i),o=document.createElement("span"),o.setAttribute("ReviewManagerControl",""),o.innerText=this.config.editButtonEditText,o.className="editButton edit",o.onclick=()=>this.setEditorMode(m.editComment),e.appendChild(o)),{root:e,add:t,remove:n,edit:o}}handleCancel(){this.setEditorMode(m.toolbar),this.editor.focus()}handleAddComment(){const e=this.activeComment?this.activeComment.lineNumber:this.editor.getSelection().endLineNumber,t=this.editorElements.textarea.value,n=this.activeComment?null:this.editor.getSelection();this.addComment(e,t,n),this.setEditorMode(m.toolbar),this.editor.focus()}handleTextAreaKeyDown(e){"Escape"===e.code?(this.handleCancel(),e.preventDefault(),console.info("preventDefault: Escape Key")):"Enter"===e.code&&e.ctrlKey&&(this.handleAddComment(),e.preventDefault(),console.info("preventDefault: ctrl+Enter"))}createInlineEditorElement(){var e=document.createElement("span");e.className="reviewCommentEditor";const t=document.createElement("textarea");t.setAttribute("ReviewManagerControl",""),t.className="reviewCommentEditor text",t.innerText="",t.style.resize="none",t.name="text",t.onkeydown=this.handleTextAreaKeyDown.bind(this);const n=document.createElement("button");n.setAttribute("ReviewManagerControl",""),n.className="reviewCommentEditor save",n.style.fontFamily="Consolas",n.innerText="Add Comment",n.onclick=this.handleAddComment.bind(this);const o=document.createElement("button");return o.setAttribute("ReviewManagerControl",""),o.className="reviewCommentEditor cancel",o.innerText="Cancel",o.onclick=this.handleCancel.bind(this),e.appendChild(t),e.appendChild(o),e.appendChild(n),{root:e,confirm:n,cancel:o,textarea:t}}createInlineToolbarWidget(){const e=this.createInlineEditButtonsElement(),t=this;return this.widgetInlineToolbar={allowEditorOverflow:!0,getId:()=>"widgetInlineToolbar",getDomNode:()=>e.root,getPosition:()=>{if(t.activeComment&&t.editorMode==m.toolbar&&!t.config.readOnly)return{position:{lineNumber:t.activeComment.lineNumber,column:1},preference:[2]}}},this.editor.addContentWidget(this.widgetInlineToolbar),e}createInlineEditorWidget(){const e=this.createInlineEditorElement();return this.widgetInlineCommentEditor={allowEditorOverflow:!0,getId:()=>"widgetInlineEditor",getDomNode:()=>e.root,getPosition:()=>{if(this.editorMode==m.insertComment||this.editorMode==m.editComment)return{position:{lineNumber:this.activeComment?this.activeComment.lineNumber:this.editor.getPosition().lineNumber+1,column:1},preference:[2]}}},this.editor.addContentWidget(this.widgetInlineCommentEditor),e}setActiveComment(e){this.verbose&&console.debug("setActiveComment",e);const t=[];!this.activeComment||e&&this.activeComment.lineNumber===e.lineNumber||t.push(this.activeComment.lineNumber),e&&t.push(e.lineNumber),this.activeComment=e,t.length>0&&this.filterAndMapComments(t,e=>{this.renderStore[e.id].renderStatus=o.ReviewCommentRenderState.dirty})}filterAndMapComments(e,t){for(const n of Object.values(this.store.comments))e.indexOf(n.comment.lineNumber)>-1&&t(n.comment)}handleMouseMove(e){e.target&&e.target.position&&e.target.position.lineNumber&&(this.currentLineDecorationLineNumber=e.target.position.lineNumber,this.renderAddCommentLineDecoration(this.config.readOnly?null:this.currentLineDecorationLineNumber))}renderAddCommentLineDecoration(e){const t=e?[{range:new r.monaco.Range(e,0,e,0),options:{marginClassName:"activeLineMarginClass",zIndex:100}}]:[];this.currentLineDecorations=this.editor.deltaDecorations(this.currentLineDecorations,t)}handleMouseDown(e){if(e.target.element.className&&e.target.element.className.indexOf("activeLineMarginClass")>-1)this.editor.setPosition({lineNumber:this.currentLineDecorationLineNumber,column:1}),this.setEditorMode(m.insertComment);else if(!e.target.element.hasAttribute("ReviewManagerControl")){let t=null;if(e.target.detail&&null!==e.target.detail.viewZoneId)for(const n of Object.values(this.store.comments).map(e=>e.comment)){if(this.getRenderState(n.id).viewZoneId==e.target.detail.viewZoneId){t=n;break}}this.setActiveComment(t),this.refreshComments(),this.setEditorMode(m.toolbar)}}calculateMarginTopOffset(e){let t=0,n=0;const i=this.editorConfig.lineHeight;if(this.activeComment){for(var r of this.iterateComments())if(r.state.comment.lineNumber!==this.activeComment.lineNumber||r.state.comment==this.activeComment&&!e||(t+=o.calculateNumberOfLines(r.state.comment.text)),r.state.comment==this.activeComment)break;n=t*i}return n+this.config.verticalOffset}layoutInlineToolbar(){if(this.inlineToolbarElements.root.style.backgroundColor=this.getThemedColor("editor.background"),this.inlineToolbarElements.root.style.marginTop=`${this.calculateMarginTopOffset(!1)}px`,this.inlineToolbarElements.remove){const e=this.activeComment&&this.iterateComments(e=>e.comment.id===this.activeComment.id).length>1,t=this.activeComment&&this.activeComment.author===this.currentUser;this.inlineToolbarElements.remove.style.display=e?"none":"",this.inlineToolbarElements.edit.style.display=e||!t?"none":""}this.editor.layoutContentWidget(this.widgetInlineToolbar)}layoutInlineCommentEditor(){[this.editorElements.root,this.editorElements.textarea].forEach(e=>{e.style.backgroundColor=this.getThemedColor("editor.background"),e.style.color=this.getThemedColor("editor.foreground")}),[this.editorElements.confirm,this.editorElements.cancel].forEach(e=>{e.style.backgroundColor=this.getThemedColor("button.background"),e.style.color=this.getThemedColor("button.foreground")}),this.editorElements.confirm.innerText=this.editorMode===m.insertComment?"Add Comment":"Edit Comment",this.editorElements.root.style.marginTop=`${this.calculateMarginTopOffset(!0)}px`,this.editor.layoutContentWidget(this.widgetInlineCommentEditor)}setEditorMode(e){this.editorMode=this.config.readOnly?m.toolbar:e,console.warn("setEditorMode",m[e],"Comment:",this.activeComment,"ReadOnly:",this.config.readOnly,"Result:",m[this.editorMode]),this.layoutInlineCommentEditor(),this.layoutInlineToolbar(),e!=m.insertComment&&e!=m.editComment||(e==m.insertComment?this.editorElements.textarea.value="":e==m.editComment&&(this.editorElements.textarea.value=this.activeComment?this.activeComment.text:""),setTimeout(()=>this.editorElements.textarea.focus(),100))}getDateTimeNow(){return new Date}recurseComments(e,t,n,o){const i=Object.values(e).filter(t);for(const t of i){const i=t.comment;delete e[i.id],o.push({depth:n,state:t}),this.recurseComments(e,e=>e.comment.parentId===i.id,n+1,o)}}iterateComments(e){e||(e=e=>!e.comment.parentId);const t=Object.assign({},this.store.comments),n=[];return this.recurseComments(t,e,0,n),n}removeComment(e){return this.addEvent({type:"delete",targetId:e})}addComment(e,t,n){const o=this.editorMode===m.editComment?{type:"edit",text:t,targetId:this.activeComment.id}:{type:"create",text:t,lineNumber:e,selection:n,targetId:this.activeComment&&this.activeComment.id};return this.addEvent(o)}addEvent(e){return e.createdBy=this.currentUser,e.createdAt=this.getDateTimeNow(),e.id=i(),this.events.push(e),this.store=o.commentReducer(e,this.store),this.activeComment&&!this.store.comments[this.activeComment.id]?this.setActiveComment(null):this.activeComment&&this.activeComment.status===o.ReviewCommentStatus.deleted&&this.setActiveComment(null),this.refreshComments(),this.layoutInlineToolbar(),this.onChange&&this.onChange(this.events),e}formatDate(e){return this.config.formatDate?this.config.formatDate(e):e instanceof Date?e.toISOString():e}createElement(e,t,n=null){const o=document.createElement(n||"span");return o.className=t,o.innerText=e,o}getRenderState(e){return this.renderStore[e]||(this.renderStore[e]={viewZoneId:null,renderStatus:null}),this.renderStore[e]}refreshComments(){this.editor.changeViewZones(e=>{var t;const n={};for(const n of Array.from(this.store.deletedCommentIds||[])){const o=null===(t=this.renderStore[n])||void 0===t?void 0:t.viewZoneId;e.removeZone(o),this.verbose&&console.debug("Zone.Delete",o)}this.store.deletedCommentIds=null;for(const e of Array.from(this.store.dirtyCommentIds||[]))this.getRenderState(e).renderStatus=o.ReviewCommentRenderState.dirty;this.store.dirtyCommentIds=null;for(const t of this.iterateComments()){const i=this.getRenderState(t.state.comment.id);if(i.renderStatus!==o.ReviewCommentRenderState.hidden){if(i.renderStatus===o.ReviewCommentRenderState.dirty&&(this.verbose&&console.debug("Zone.Dirty",t.state.comment.id),e.removeZone(i.viewZoneId),i.viewZoneId=null,i.renderStatus=o.ReviewCommentRenderState.normal),n[t.state.comment.lineNumber]||(n[t.state.comment.lineNumber]=t.state.comment.selection),null==i.viewZoneId){this.verbose&&console.debug("Zone.Create",t.state.comment.id);const n=this.activeComment==t.state.comment,o=this.createElement("",`reviewComment ${n?"active":" inactive"}`);o.style.marginLeft=this.config.commentIndent*(t.depth+1)+this.config.commentIndentOffset+"px",o.style.backgroundColor=this.getThemedColor("editor.selectionHighlightBackground"),o.appendChild(this.createElement(`${t.state.comment.author||" "} at `,"reviewComment author")),o.appendChild(this.createElement(this.formatDate(t.state.comment.dt),"reviewComment dt")),t.state.history.length>1&&o.appendChild(this.createElement(`(Edited ${t.state.history.length-1} times)`,"reviewComment history")),o.appendChild(this.createElement(`${t.state.comment.text}`,"reviewComment text","div")),i.viewZoneId=e.addZone({afterLineNumber:t.state.comment.lineNumber,heightInLines:t.state.numberOfLines,domNode:o,suppressMouseDown:!0})}}else this.verbose&&console.debug("Zone.Hidden",t.state.comment.id),e.removeZone(i.viewZoneId),i.viewZoneId=null}if(this.config.showInRuler){const e=[];for(const[t,o]of Object.entries(n))e.push({range:new r.monaco.Range(t,0,t,0),options:{isWholeLine:!0,overviewRuler:{color:this.config.rulerMarkerColor,darkColor:this.config.rulerMarkerDarkColor,position:1}}}),o&&e.push({range:new r.monaco.Range(o.startLineNumber,o.startColumn,o.endLineNumber,o.endColumn),options:{className:"reviewComment selection"}});this.currentCommentDecorations=this.editor.deltaDecorations(this.currentCommentDecorations,e)}})}addActions(){this.editor.addAction({id:"my-unique-id-add",label:"Add Comment",keybindings:[r.monaco.KeyMod.CtrlCmd|r.monaco.KeyCode.F10],precondition:"add-context-key",keybindingContext:null,contextMenuGroupId:"navigation",contextMenuOrder:0,run:()=>{this.setEditorMode(m.insertComment)}}),this.editor.addAction({id:"my-unique-id-next",label:"Next Comment",keybindings:[r.monaco.KeyMod.CtrlCmd|r.monaco.KeyCode.F12],precondition:null,keybindingContext:null,contextMenuGroupId:"navigation",contextMenuOrder:.101,run:()=>{this.navigateToComment(s.next)}}),this.editor.addAction({id:"my-unique-id-prev",label:"Prev Comment",keybindings:[r.monaco.KeyMod.CtrlCmd|r.monaco.KeyCode.F11],precondition:null,keybindingContext:null,contextMenuGroupId:"navigation",contextMenuOrder:.102,run:()=>{this.navigateToComment(s.prev)}})}navigateToComment(e){let t=0;t=this.activeComment?this.activeComment.lineNumber:this.editor.getPosition().lineNumber;const n=Object.values(this.store.comments).map(e=>e.comment).filter(n=>{if(!n.parentId){if(e===s.next)return n.lineNumber>t;if(e===s.prev)return n.lineNumber<t}});if(n.length){n.sort((t,n)=>e===s.next?t.lineNumber-n.lineNumber:e===s.prev?n.lineNumber-t.lineNumber:void 0);const t=n[0];this.setActiveComment(t),this.refreshComments(),this.layoutInlineToolbar(),this.editor.revealLineInCenter(t.lineNumber)}}}t.ReviewManager=a},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const o=n(1);function i(e,t){const n=new Set,o=new Set,i=new Set;switch(e.type){case"edit":const i=t.comments[e.targetId];if(!i)break;i.comment=Object.assign(Object.assign({},i.comment),{author:e.createdBy,dt:e.createdAt,text:e.text}),i.history.push(i.comment),i.numberOfLines=r(e.text),n.add(i.comment.lineNumber),console.log("edit",e);break;case"delete":const d=t.comments[e.targetId];delete t.comments[e.targetId],o.add(d.comment.id),n.add(d.comment.lineNumber),console.log("delete",e);break;case"create":t.comments[e.id]||(t.comments[e.id]=new s({author:e.createdBy,dt:e.createdAt,id:e.id,lineNumber:e.lineNumber,selection:e.selection,text:e.text,parentId:e.targetId,status:m.active},r(e.text)),console.log("insert",e),n.add(e.lineNumber))}if(n.size)for(const e of Object.values(t.comments))n.has(e.comment.lineNumber)&&i.add(e.comment.id);return Object.assign(Object.assign({},t),{dirtyCommentIds:i,deletedCommentIds:o})}function r(e){return e?e.split(/\r*\n/).length+1:1}t.commentReducer=i,t.calculateNumberOfLines=r;class s{constructor(e,t){this.numberOfLines=t,this.comment=e,this.history=[e]}}var m;t.ReviewCommentState=s,function(e){e[e.dirty=1]="dirty",e[e.hidden=2]="hidden",e[e.normal=3]="normal"}(t.ReviewCommentRenderState||(t.ReviewCommentRenderState={})),function(e){e[e.active=1]="active",e[e.deleted=2]="deleted",e[e.edit=3]="edit"}(m=t.ReviewCommentStatus||(t.ReviewCommentStatus={})),t.reduceComments=function(e,t=null){t=t||{comments:{}};for(const n of e)n.id||(n.id=o()),t=i(n,t);return t}},function(e,t){var n="undefined"!=typeof crypto&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto)||"undefined"!=typeof msCrypto&&"function"==typeof window.msCrypto.getRandomValues&&msCrypto.getRandomValues.bind(msCrypto);if(n){var o=new Uint8Array(16);e.exports=function(){return n(o),o}}else{var i=new Array(16);e.exports=function(){for(var e,t=0;t<16;t++)0==(3&t)&&(e=4294967296*Math.random()),i[t]=e>>>((3&t)<<3)&255;return i}}},function(e,t){for(var n=[],o=0;o<256;++o)n[o]=(o+256).toString(16).substr(1);e.exports=function(e,t){var o=t||0,i=n;return[i[e[o++]],i[e[o++]],i[e[o++]],i[e[o++]],"-",i[e[o++]],i[e[o++]],"-",i[e[o++]],i[e[o++]],"-",i[e[o++]],i[e[o++]],"-",i[e[o++]],i[e[o++]],i[e[o++]],i[e[o++]],i[e[o++]],i[e[o++]]].join("")}}]);