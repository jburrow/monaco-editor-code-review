"use strict";
// Code Snippet: Markdown to HTML
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertMarkdownToHTML = void 0;
const showdown = require("showdown");
const converter = new showdown.Converter();
function convertMarkdownToHTML(text) {
    return converter.makeHtml(text);
}
exports.convertMarkdownToHTML = convertMarkdownToHTML;
//# sourceMappingURL=comment.js.map