import * as showdown from "showdown";
import DOMPurify from "dompurify";

const converter = new showdown.Converter();

export function convertMarkdownToHTML(text: string): string {
  return DOMPurify.sanitize(converter.makeHtml(text));
}
