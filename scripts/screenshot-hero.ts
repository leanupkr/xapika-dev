import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("http://localhost:3000/en/design-system", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(2000);

  // Find the Hero Preview section and screenshot it
  const heroSection = page.locator('[data-section="hero-preview"]');
  if (await heroSection.count()) {
    await heroSection.screenshot({
      path: "screenshots/hero-preview-desktop.png",
    });
    console.log("✓ hero-preview-desktop.png");
  } else {
    // Fallback: scroll to bottom area and take viewport screenshot
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 1200));
    await page.waitForTimeout(500);
    await page.screenshot({
      path: "screenshots/hero-preview-desktop.png",
    });
    console.log("✓ hero-preview-desktop.png (full viewport fallback)");
  }

  await browser.close();
}

main();
