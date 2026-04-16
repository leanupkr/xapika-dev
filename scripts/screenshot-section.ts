import { chromium } from "@playwright/test";

// Usage: tsx scripts/screenshot-section.ts <section-anchor> <prefix>
// viewport 스크린샷: section을 화면 상단에 맞춰 고정 뷰포트 캡처
const SECTION_SELECTOR = process.argv[2] || "section[aria-labelledby='key-numbers-title']";
const PREFIX = process.argv[3] || "keynumbers";

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 360, height: 1200 },
];

async function main() {
  const browser = await chromium.launch();
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    await page.goto("http://localhost:3000/en", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    const section = page.locator(SECTION_SELECTOR);
    if (!(await section.count())) {
      console.error(`✗ section not found for viewport ${vp.name}`);
      await ctx.close();
      continue;
    }

    // section을 뷰포트 상단에 맞추되 sticky header(약 72px) 위로 24px 여백
    await section.evaluate((el) => {
      const y = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: "instant" });
    });
    await page.waitForTimeout(2500); // animations + count-up

    // viewport 스크린샷 (fullPage: false → viewport 크기와 동일)
    await page.screenshot({
      path: `screenshots/${PREFIX}-${vp.name}.png`,
      fullPage: false,
    });
    console.log(`✓ ${PREFIX}-${vp.name}.png (${vp.width}x${vp.height})`);

    // section 높이가 viewport보다 크면 아래쪽도 한 장 더 촬영
    const sectionHeight = await section.evaluate((el) => el.getBoundingClientRect().height);
    if (sectionHeight > vp.height - 96) {
      await section.evaluate((el, vpHeight) => {
        const rect = el.getBoundingClientRect();
        const y = rect.top + window.scrollY + rect.height - vpHeight + 48;
        window.scrollTo({ top: y, behavior: "instant" });
      }, vp.height);
      await page.waitForTimeout(600);
      await page.screenshot({
        path: `screenshots/${PREFIX}-${vp.name}-bottom.png`,
        fullPage: false,
      });
      console.log(`✓ ${PREFIX}-${vp.name}-bottom.png`);
    }

    await ctx.close();
  }
  await browser.close();
}

main();
