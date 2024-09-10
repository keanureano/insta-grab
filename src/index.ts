import puppeteer from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.instagram.com/nodejs.tech/", {
    waitUntil: "networkidle2",
  });

  try {
    await page.waitForSelector("section > div > div > h2", { timeout: 10000 });

    const username = await page.evaluate(() => {
      const element = document.querySelector(
        "section > div > div > h2"
      ) as HTMLElement;
      return element ? element.textContent : null;
    });

    const profilePic = await page.evaluate(() => {
      const element = document.querySelector(
        "header > div > div> span > img"
      ) as HTMLImageElement;
      return element ? element.src : null;
    });

    console.log("Username:", username);
    console.log("Profile Picture:", profilePic);
  } catch (error) {
    console.error("Error:", error);
  } finally {
  }
}

main();
