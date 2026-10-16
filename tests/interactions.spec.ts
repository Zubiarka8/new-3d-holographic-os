import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import {
  expectRenderedPixels,
  expectRenderedPng,
  monitorErrors,
  openGraphics,
} from "./helpers";

test("compiles real WebGL scene and reports renderer measurements without errors", async ({
  page,
}) => {
  const errors = monitorErrors(page);
  await openGraphics(page);
  await expectRenderedPixels(page);
  await expect(page.locator("#particle-count")).toHaveText(/^[1-9][\d,]*$/);
  await expect(page.locator("#fps")).toHaveText(/^[1-9]\d*$/);
  expect(errors).toEqual([]);
});

test("mode buttons and keyboard range input update actual shared state", async ({
  page,
}) => {
  await openGraphics(page);
  for (const [mode, energy] of [
    ["STANDBY", "25"],
    ["ANALYSIS", "65"],
    ["OVERDRIVE", "100"],
  ] as const) {
    const button = page.locator(`button[data-mode="${mode}"]`);
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#app")).toHaveAttribute("data-mode", mode);
    await expect(page.locator("#core-state")).toContainText(mode);
    await expect(page.locator("#energy")).toHaveValue(energy);
  }
  await page.locator("#energy").focus();
  await page.keyboard.press("Home");
  await expect(page.locator("#energy")).toHaveValue("0");
  await expect(page.locator("#energy-output")).toHaveText("0%");
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#energy")).toHaveValue("1");
  await expect(page.locator("#energy-output")).toHaveText("1%");
});

test("scene keyboard, pointer drag and reset change orientation", async ({
  page,
}) => {
  await openGraphics(page);
  const scene = page.locator("#scene");
  await scene.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#orientation")).not.toHaveText("0° / 0°");
  await expect(page.locator("#input-channel")).toHaveText("KEYBOARD");
  await page.keyboard.press("Home");
  await expect(page.locator("#orientation")).toHaveText("0° / 0°");
  const box = await scene.boundingBox();
  if (!box) throw new Error("Scene has no interactive bounds");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + 80,
    box.y + box.height / 2 + 35,
    { steps: 5 },
  );
  await page.mouse.up();
  await expect(page.locator("#orientation")).not.toHaveText("0° / 0°");
  await page.locator("#reset").click();
  await expect(page.locator("#orientation")).toHaveText("0° / 0°");
  await scene.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#orientation")).toHaveText("4° / 0°");
});

test("capture downloads a real PNG containing the rendered scene", async ({
  page,
}) => {
  await openGraphics(page);
  const pendingDownload = page.waitForEvent("download");
  await page.locator("#capture").click();
  const download = await pendingDownload;
  expect(download.suggestedFilename()).toBe("holographic-analysis.png");
  expect(await download.failure()).toBeNull();
  const path = await download.path();
  if (!path) throw new Error("Capture download did not create a file");
  const png = await readFile(path);
  expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
  await expectRenderedPng(page, png.toString("base64"));
});

test("pause and environment controls alter renderer state", async ({
  page,
}) => {
  await openGraphics(page);
  await page.locator("#pause").click();
  await expect(page.locator("#pause")).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("#core-state")).toContainText("PAUSED");
  await page.locator("#pause").click();
  await expect(page.locator("#core-state")).toContainText("ACTIVE");
  await page.locator("#particles").uncheck();
  await expect(page.locator("#particle-count")).toHaveText("0");
  await page.locator("#particles").check();
  await expect(page.locator("#particle-count")).toHaveText(/^[1-9][\d,]*$/);
  await page.locator("#motion").check();
  await expect(page.locator("#core-state")).toContainText("STATIC");
  await page.locator("#motion").uncheck();
  await expect(page.locator("#core-state")).toContainText("ACTIVE");
  await page.locator("#pause").click();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(1200);
  const before = await page.locator("#scene").screenshot();
  await page.locator("#grid").uncheck();
  await page.waitForTimeout(150);
  const after = await page.locator("#scene").screenshot();
  expect(
    before.equals(after),
    "Spatial grid toggle changes rendered pixels",
  ).toBe(false);
});

test("system dialog traps modal focus and Escape restores opener", async ({
  page,
}) => {
  await page.goto("/");
  const opener = page.locator("#about-open");
  await opener.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#about-dialog")).toBeVisible();
  await expect(page.locator("#about-close")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#about-close")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.locator("#about-dialog")).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test("OS reduced motion initializes and updates accessible preference", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openGraphics(page);
  await expect(page.locator("#motion")).toBeChecked();
  await expect(page.locator("#core-state")).toContainText("STATIC");
  // Initial energy already equals its target; no mode/energy transition is settling.
  await page.mouse.move(0, 0);
  const staticA = await page.locator("#scene").screenshot();
  await page.waitForTimeout(350);
  const staticB = await page.locator("#scene").screenshot();
  expect(
    staticA.equals(staticB),
    "OS reduced motion freezes procedural animation",
  ).toBe(true);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.locator("#motion")).not.toBeChecked();
  await expect(page.locator("#core-state")).toContainText("ACTIVE");
});

test("mobile keeps layout within viewport and controls usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await openGraphics(page);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(391);
  await page.locator('button[data-mode="OVERDRIVE"]').click();
  await expect(page.locator("#core-state")).toContainText("OVERDRIVE");
  await page.locator("#energy").focus();
  await page.keyboard.press("Home");
  await expect(page.locator("#energy-output")).toHaveText("0%");
});

test("without WebGL exposes honest fallback while controls remain functional", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (
        this: HTMLCanvasElement,
        type: string,
        ...args: unknown[]
      ) {
        if (/webgl/i.test(type)) return null;
        return Reflect.apply(getContext, this, [type, ...args]);
      },
    });
  });
  await page.goto("/");
  await expect(page.locator("#scene")).toHaveAttribute(
    "data-ready",
    "fallback",
  );
  await expect(
    page.getByRole("heading", { name: "Graphics unavailable" }),
  ).toBeVisible();
  await expect(page.locator("#engine")).toHaveText("UNAVAILABLE");
  await expect(page.locator("#capture")).toBeDisabled();
  await page.locator('button[data-mode="STANDBY"]').click();
  await expect(page.locator("#core-state")).toContainText("STANDBY");
});
