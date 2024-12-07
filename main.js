const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://pro.movepump.com/", {
    waitUntil: "domcontentloaded",
  });

  await page.waitForSelector('.relative.w-full.bg-slate-900');

  const tokensOver4K = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.relative.w-full.bg-slate-900'));

    return rows
      .map((row) => {
        const name = row.querySelector('.text-left.logo-stroke-fill.font-semibold')?.innerText || "";
        const href = row.querySelector('a')?.href || "";
        const address = href.split("/token/")[1]?.split("::")[0] || "";

        // Use the properly escaped selector for market cap
        const marketCapElement = row.querySelector(
          'div.flex.gap-1.items-center > p.text-primary'
        );

        let marketCapText = marketCapElement?.innerText || "0";
        // Remove the "$" and commas, and convert shorthand values like K into numbers
        marketCapText = marketCapText.replace(/[^\d.km]/gi, ""); // Remove all non-numeric characters except k and m
        let marketCap = parseFloat(marketCapText) || 0;

        if (marketCapText.toLowerCase().includes("k")) {
          marketCap *= 1000; // Convert from thousands to actual number
        } else if (marketCapText.toLowerCase().includes("m")) {
          marketCap *= 1_000_000; // Convert from millions to actual number
        }

        const volumeElement = row.querySelector(
          'div.text-\\[10px\\].xl\\:text-\\[12px\\].font-semibold.text-white.flex.items-center.gap-1 > div.flex.gap-1.items-center > p.text-primary'
        );
        let volumeText = volumeElement?.innerText || "0";
        volumeText = volumeText.replace(/[^\d.km]/gi, ""); // Remove all non-numeric characters except k and m
        let volume = parseFloat(volumeText) || 0;

        return { name, href, address, marketCap, volume };
      })
      .filter((token) => token.marketCap > 4000 && token.volume > 500);  // Filter tokens with market cap over 4000
  });

  console.log("Tokens with Market Cap over 4000 and volume over 500:", tokensOver4K);

  await browser.close();
})();
