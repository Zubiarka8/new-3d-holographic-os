import { expect, type Page } from "@playwright/test";

export function monitorErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}

export async function openGraphics(page: Page): Promise<void> {
  await page.goto("/");
  // A fallback is a real failure for graphics tests, never a silently skipped pass.
  await expect(page.locator("#scene")).toHaveAttribute("data-ready", "true");
  await expect(page.locator("#render-status")).toHaveText("OPERATIONAL");
  await expect(page.locator("#draw-calls")).toHaveText(/^[1-9]\d*$/);
}

export async function expectRenderedPixels(page: Page): Promise<void> {
  const screenshot = await page.locator("#scene").screenshot();
  await expectRenderedPng(page, screenshot.toString("base64"));
}

export async function expectRenderedPng(
  page: Page,
  encoded: string,
): Promise<void> {
  const statistics = await page.evaluate(async (encoded) => {
    const image = new Image();
    image.src = `data:image/png;base64,${encoded}`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Screenshot decoder unavailable");
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let lit = 0;
    let dark = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 1]! > 75 && pixels[i + 2]! > 100) lit++;
      if (pixels[i]! < 45 && pixels[i + 1]! < 45 && pixels[i + 2]! < 65) dark++;
    }
    return { lit, dark, width: image.width, height: image.height };
  }, encoded);
  expect(
    statistics.lit,
    "Canvas screenshot must contain rendered luminous geometry",
  ).toBeGreaterThan(100);
  expect(
    statistics.dark,
    "Rendered image includes the dark spatial field",
  ).toBeGreaterThan(100);
  expect(statistics.width).toBeGreaterThan(200);
  expect(statistics.height).toBeGreaterThan(200);
}
