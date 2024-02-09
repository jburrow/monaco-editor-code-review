// Code Snippet: Markdown to HTML
// x

import * as showdown from "showdown";

const converter = new showdown.Converter();

export function convertMarkdownToHTML(text: string): string {
  return converter.makeHtml(text);
}
