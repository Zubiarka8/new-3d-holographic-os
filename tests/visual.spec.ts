import { expect, test } from "@playwright/test";
import { expectRenderedPixels, monitorErrors, openGraphics } from "./helpers";

test("captures desktop modes, real animation, pause and mobile composition", async ({
  page,
}, testInfo) => {
  const errors = monitorErrors(page);
  await openGraphics(page);
  await page.mouse.move(0, 0);
  for (const mode of ["STANDBY", "ANALYSIS", "OVERDRIVE"]) {
    await page.locator(`button[data-mode="${mode}"]`).click();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(1000);
    await expectRenderedPixels(page);
    const path = `artifacts/screenshots/desktop-${mode.toLowerCase()}.png`;
    await page.screenshot({ path, fullPage: true });
    await testInfo.attach(`desktop-${mode}`, {
      path,
      contentType: "image/png",
    });
  }
  const liveA = await page
    .locator("#scene")
    .screenshot({ path: "artifacts/screenshots/live-a.png" });
  await page.waitForTimeout(350);
  const liveB = await page
    .locator("#scene")
    .screenshot({ path: "artifacts/screenshots/live-b.png" });
  expect(liveA.equals(liveB), "Live procedural scene must animate").toBe(false);
  await page.locator("#pause").click();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(2200);
  const pausedA = await page
    .locator("#scene")
    .screenshot({ path: "artifacts/screenshots/paused-a.png" });
  await page.waitForTimeout(350);
  const pausedB = await page
    .locator("#scene")
    .screenshot({ path: "artifacts/screenshots/paused-b.png" });
  expect(
    pausedA.equals(pausedB),
    "Pause must freeze the canvas after transition settles",
  ).toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#pause").click();
  for (const mode of ["STANDBY", "ANALYSIS", "OVERDRIVE"]) {
    await page.locator(`button[data-mode="${mode}"]`).click();
    await page.waitForTimeout(800);
    await expectRenderedPixels(page);
    await page.screenshot({
      path: `artifacts/screenshots/mobile-${mode.toLowerCase()}.png`,
      fullPage: true,
    });
  }
  expect(
    errors,
    "Console includes shader compilation and WebGL errors",
  ).toEqual([]);
  await testInfo.attach("capture-parameters", {
    body: JSON.stringify({
      browser: "WebKit",
      desktop: "1440x1000",
      mobile: "390x844",
      deviceScaleFactor: 1,
      modes: ["STANDBY", "ANALYSIS", "OVERDRIVE"],
      baselineApproved: false,
    }),
    contentType: "application/json",
  });
});
