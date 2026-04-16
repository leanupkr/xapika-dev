import { chromium } from "@playwright/test";

// Usage: tsx scripts/screenshot-section.ts <section-anchor> <prefix>
// 스크롤해서 특정 섹션 앞에 맞춰 3뷰포트 캡처
const SECTION_SELECTOR = process.argv[2] || "section[aria-labelledby='key-numbers-title']";
const PREFIX = process.argv[3] || "keynumbers";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 360, height: 800 },
];

async function main() {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.goto("http://localhost:3000/en", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // scroll to section
    const section = page.locator(SECTION_SELECTOR);
    if (await section.count()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2500); // wait animations + count-up
      // capture element screenshot
      await section.screenshot({ path: `screenshots/${PREFIX}-${vp.name}.png` });
      console.log(`✓ ${PREFIX}-${vp.name}.png`);
    } else {
      console.error(`✗ section not found for viewport ${vp.name}`);
    }
    await ctx.close();
  }
  await browser.close();
}

main();
