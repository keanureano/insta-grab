import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());
puppeteer.launch({ headless: false, slowMo: 50 }).then(async (browser) => {
  const page = await browser.newPage();

  try {
    await page.goto("https://www.instagram.com/nodejs.tech/", {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector("section > div > div > h2", {
      timeout: 10000,
    });

    const username = await page.evaluate(() => {
      const element = document.querySelector(
        "section > div > div > h2"
      ) as HTMLElement;
      return element ? element.textContent : null;
    });

    const profilePic = await page.evaluate(() => {
      const element = document.querySelector(
        "header > div > div > span > img"
      ) as HTMLImageElement;
      return element ? element.src : null;
    });

    // const posts = await page.$$("article > div > div > a");

    // const likes = [];

    // for (const post in posts) {
    //   await page.hover(post);

    //   const like = await page.evaluate(() => {
    //     const element = document.querySelector("a > div > ul > li > span");
    //     return element ? element.textContent : null;
    //   });

    //   likes.push(like);
    // }

    // console.log("Likes:", likes);
    console.log("Username:", username);
    console.log("Profile Picture:", profilePic);
  } catch (error) {
    console.error("Error:", error);
  } finally {
  }
});
