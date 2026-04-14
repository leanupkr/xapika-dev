import { chromium } from "@playwright/test";

const BASE_URL = "http://localhost:3000";
const PAGES = [{ path: "/en/design-system", name: "design-system" }];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 360, height: 800 },
];

async function main() {
  const browser = await chromium.launch();

  for (const page of PAGES) {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const p = await context.newPage();
      await p.goto(`${BASE_URL}${page.path}`, { waitUntil: "networkidle" });
      await p.waitForTimeout(1000);
      await p.screenshot({
        path: `screenshots/${page.name}-${viewport.name}.png`,
        fullPage: true,
      });
      await context.close();
      console.log(`✓ ${page.name}-${viewport.name}.png`);
    }
  }

  await browser.close();
}

main();
