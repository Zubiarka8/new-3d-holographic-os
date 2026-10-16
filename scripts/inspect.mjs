import { webkit } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await webkit.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.goto("http://127.0.0.1:4173");
await page.waitForTimeout(3000);
await mkdir("artifacts/screenshots", { recursive: true });
await page.screenshot({
  path: "artifacts/screenshots/initial-desktop.png",
  fullPage: true,
});
const result = await page.evaluate(() => ({
  ready: document.querySelector("canvas").dataset.ready,
  fps: document.querySelector("#fps").textContent,
  calls: document.querySelector("#draw-calls").textContent,
  userAgent: navigator.userAgent,
  viewport: [innerWidth, innerHeight],
  dpr: devicePixelRatio,
  canvasSize: [
    document.querySelector("canvas").width,
    document.querySelector("canvas").height,
  ],
}));
console.log(JSON.stringify({ result, errors }));
await writeFile(
  "artifacts/screenshots/initial-inspection.json",
  JSON.stringify({ result, errors }, null, 2),
);
await browser.close();
