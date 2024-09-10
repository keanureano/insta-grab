import puppeteer from "puppeteer";
function freeze(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.instagram.com/nodejs.tech/", {
    waitUntil: "networkidle2",
  });
  try {
    // Wait for the <h2> element to appear
    await page.waitForSelector("h2", { timeout: 10000 }); // Wait for up to 10 seconds

    // Extract the text content of the <h2> element
    const username = await page.evaluate(() => {
      const element = document.querySelector("h2");
      return element ? element.textContent : null;
    });

    console.log("Username:", username);
  } catch (error) {
    console.error("Error:", error);
  } finally {
  }
}

main();
