import { chromium } from "@playwright/test";

const BASE_URL = "http://localhost:3000";

async function main() {
  const browser = await chromium.launch();

  // 1. Desktop Hero (1440px)
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/hero-desktop.png" });
    console.log("✓ hero-desktop.png");
    await ctx.close();
  }

  // 2. Tablet Hero (768px)
  {
    const ctx = await browser.newContext({ viewport: { width: 768, height: 1024 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/hero-tablet.png" });
    console.log("✓ hero-tablet.png");
    await ctx.close();
  }

  // 3. Mobile Hero (360px)
  {
    const ctx = await browser.newContext({ viewport: { width: 360, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle" });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: "screenshots/hero-mobile.png" });
    console.log("✓ hero-mobile.png");
    await ctx.close();
  }

  // 4. Scrolled (scrollY=400) — nav blur transition
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: "instant" }));
    await page.waitForTimeout(500);
    await page.screenshot({ path: "screenshots/hero-scrolled.png" });
    console.log("✓ hero-scrolled.png");
    await ctx.close();
  }

  // 5. Cross-fade at 6s — second slide
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE_URL}/en`, { waitUntil: "networkidle" });
    await page.waitForTimeout(7000); // wait for cross-fade to second image
    await page.screenshot({ path: "screenshots/hero-crossfade.png" });
    console.log("✓ hero-crossfade.png");
    await ctx.close();
  }

  await browser.close();
}

main();
