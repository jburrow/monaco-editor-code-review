var jsCode = [
  '"use strict";',
  "function Person(age) {",
  "	if (age) {",
  "		this.age = age;",
  "	}",
  "}",
  "Person.prototype.getAge = function () {",
  "	return this.age;",
  "};",
].join("\n");

var editor = monaco.editor.create(document.getElementById("container"), {
  value: jsCode,
  language: "javascript",
  glyphMargin: true,
  contextmenu: false,
});

var decorations = editor.deltaDecorations(
  [],
  [
    {
      range: new monaco.Range(3, 1, 3, 1),
      options: {
        isWholeLine: true,
        className: "myContentClass",
        glyphMarginClassName: "myGlyphMarginClass",
      },
    },
  ]
);

// Add a zone to make hit testing more interesting
var viewZoneId = null;
editor.changeViewZones(function (changeAccessor) {
  var domNode = document.createElement("textarea");
  domNode.id = "xyz";
  domNode.style.background = "lightgreen";
  domNode.value = "hello james";
  domNode.style.zIndex = 100;
  domNode.style.height = 50;
  viewZoneId = changeAccessor.addZone({
    afterLineNumber: 3,
    heightInPx: 110,
    domNode: domNode,
    suppressMouseDown: false,
  });
});

var output = document.getElementById("output");
function showEvent(str) {
  while (output.childNodes.length > 6) {
    output.removeChild(output.firstChild.nextSibling.nextSibling);
  }
  output.appendChild(document.createTextNode(str));
  output.appendChild(document.createElement("br"));
}

editor.onMouseMove(function (e) {
  showEvent("mousemove - " + e.target.toString());
});
editor.onMouseDown(function (e) {
  showEvent("mousedown - " + e.target.toString());
});
editor.onContextMenu(function (e) {
  showEvent("contextmenu - " + e.target.toString());
});
editor.onMouseLeave(function (e) {
  showEvent("mouseleave");
});
