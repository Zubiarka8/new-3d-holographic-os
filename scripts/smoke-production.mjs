import { webkit, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const previewUrl =
  process.env.PREVIEW_URL ?? "http://127.0.0.1:4174/new-3d-holographic-os/";
const previewOrigin = new URL(previewUrl).origin;
const browser = await webkit.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
const external = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
page.on("request", (r) => {
  if (!r.url().startsWith(previewOrigin) && !r.url().startsWith("data:"))
    external.push(r.url());
});
await page.goto(previewUrl);
await expect(page.locator("#scene")).toHaveAttribute("data-ready", "true");
await expect(page.locator("#fps")).toHaveText(/^[1-9]\d*$/);
await page.locator('[data-mode="OVERDRIVE"]').click();
await expect(page.locator("#energy")).toHaveValue("100");
await page.locator("#pause").click();
await expect(page.locator("#pause")).toHaveAttribute("aria-pressed", "true");
await page.waitForTimeout(200);
await mkdir("artifacts/screenshots", { recursive: true });
await page.screenshot({
  path: "artifacts/screenshots/production-overdrive.png",
  fullPage: true,
});
expect(errors).toEqual([]);
expect(external).toEqual([]);
const result = {
  browser: await browser.version(),
  url: page.url(),
  errors,
  externalRequests: external,
  mode: "OVERDRIVE",
  paused: true,
};
await writeFile(
  "artifacts/production-smoke.json",
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result));
await browser.close();
