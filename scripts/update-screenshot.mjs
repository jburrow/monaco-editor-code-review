// Regenerates examples/screenshot.png from a running demo server.
//
// Usage:
//   npm run build:demo
//   npx vite preview --port 4173   (in another terminal, or backgrounded)
//   npm run screenshot [-- <url> <outfile>]
//
// Uses puppeteer-core against a locally installed Chrome/Edge (override with CHROME_PATH).

import { existsSync } from "node:fs";
import puppeteer from "puppeteer-core";

const url = process.argv[2] ?? "http://localhost:4173/examples/index.html";
const out = process.argv[3] ?? "examples/screenshot.png";

const candidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);

const executablePath = candidates.find((p) => existsSync(p));
if (!executablePath) {
  console.error("No Chrome/Edge found - set CHROME_PATH");
  process.exit(1);
}

const browser = await puppeteer.launch({ executablePath, headless: "new" });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1360, height: 860, deviceScaleFactor: 1.5 });
  await page.goto(url, { waitUntil: "networkidle2", timeout: 60_000 });

  // Wait for the editor and at least one rendered comment view zone
  await page.waitForSelector(".monaco-editor", { timeout: 60_000 });
  await page.waitForSelector(".monaco-review-comment", { timeout: 60_000 });
  await new Promise((resolve) => setTimeout(resolve, 1_500));

  // Activate a comment so the Reply/Edit/Remove toolbar is visible
  await page.click(".monaco-review-comment").catch(() => {});
  await new Promise((resolve) => setTimeout(resolve, 500));

  await page.screenshot({ path: out });
  console.log("Saved", out);
} finally {
  await browser.close();
}
