import { webkit } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await webkit.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
await page.goto("http://127.0.0.1:4173");
await page.locator('#scene[data-ready="true"]').waitFor();
const samples = [];
for (const mode of ["STANDBY", "ANALYSIS", "OVERDRIVE"]) {
  await page.locator(`[data-mode="${mode}"]`).click();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(2000);
  const frames = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const intervals = [];
        let previous = 0;
        const started = performance.now();
        function sample(now) {
          if (previous) intervals.push(now - previous);
          previous = now;
          if (now - started < 5000) requestAnimationFrame(sample);
          else {
            const sorted = [...intervals].sort((a, b) => a - b);
            const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            resolve({
              frameCount: intervals.length,
              meanMs: avg,
              p50Ms: sorted[Math.floor(sorted.length * 0.5)],
              p95Ms: sorted[Math.floor(sorted.length * 0.95)],
              fps: 1000 / avg,
            });
          }
        }
        requestAnimationFrame(sample);
      }),
  );
  samples.push({
    mode,
    frames,
    renderer: await page.evaluate(() => ({
      fps: document.querySelector("#fps").textContent,
      drawCalls: document.querySelector("#draw-calls").textContent,
      particles: document.querySelector("#particle-count").textContent,
      quality: document.querySelector("#quality").textContent,
      canvas: [
        document.querySelector("canvas").width,
        document.querySelector("canvas").height,
      ],
    })),
  });
}
const result = {
  date: new Date().toISOString(),
  hardware: execFileSync("sysctl", ["-n", "machdep.cpu.brand_string"], {
    encoding: "utf8",
  }).trim(),
  os: execFileSync("sw_vers", ["-productVersion"], { encoding: "utf8" }).trim(),
  browser: await browser.version(),
  userAgent: await page.evaluate(() => navigator.userAgent),
  viewport: { width: 1440, height: 1000, dpr: 1 },
  method:
    "WebKit headless; 2s warmup + 5s requestAnimationFrame intervals per mode; no screenshots/traces during samples; RAF is scheduling, not GPU timing.",
  samples,
};
await mkdir("artifacts", { recursive: true });
await writeFile("artifacts/performance.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
await browser.close();
