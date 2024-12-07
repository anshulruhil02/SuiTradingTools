const puppeteer = require("puppeteer");

(async () => {
  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Navigate to the webpage
  await page.goto("https://pro.movepump.com/", {
    waitUntil: "domcontentloaded",
  });

  // Wait for the tokens to load (adjust selector as necessary)
  await page.waitForSelector('.relative.w-full.bg-slate-900'); // Adjusted to the parent container of the token rows

  // Click the filter button
  const filterButtonSelector = 'button.mantine-Button-root.rounded-full'; // Replace with actual selector for the filter button
  await page.waitForSelector(filterButtonSelector); // Wait for the filter button to appear
  await page.click(filterButtonSelector); // Click the filter button
  console.log("Filter button clicked successfully!");

  // Extract data for the first three tokens
  const tokens = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('.relative.w-full.bg-slate-900')); // Replace with row selector
    return rows.slice(0, 3).map((row) => {
      const name = row.querySelector('.text-left.logo-stroke-fill.font-semibold')?.innerText || ""; // Extract token name
      const href = row.querySelector('a')?.href || "";
      const address = href.split("/token/")[1]?.split("::")[0] || "";
      return { name, href, address };
    });
  });

  // Log the first 3 tokens
  console.log("First 3 Tokens:", tokens);

  // Close the browser
  await browser.close();
})();