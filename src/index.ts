import puppeteer from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.instagram.com/nodejs.tech/", {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector("section > div > div > h2", { timeout: 10000 });

    const { username, picture } = await page.evaluate(() => {
      const usernameElement = document.querySelector(
        "section > div > div > h2"
      );
      const pictureElement = document.querySelector(
        "header > div > div > span > img"
      ) as HTMLImageElement;

      return {
        username: usernameElement ? usernameElement.textContent?.trim() : null,
        picture: pictureElement ? pictureElement.src : null,
      };
    });

    console.log("Username:", username);
    console.log("Picture:", picture);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await browser.close();
  }
}

main();
