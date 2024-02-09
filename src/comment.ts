// Code Snippet: Markdown to HTML

import * as showdown from "showdown";

const converter = new showdown.Converter();

export function convertMarkdownToHTML(text: string): string {
  return converter.makeHtml(text);
}
