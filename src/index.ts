import { connect } from "puppeteer-real-browser";

connect({
  headless: false,
  // proxy:{
  //     host:'<proxy-host>',
  //     port:'<proxy-port>',
  //     username?:'<proxy-username>',
  //     password?:'<proxy-password>'
  // }
}).then(async ({ page, browser }) => {
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

    const picture = await page.evaluate(() => {
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

    console.log("Username:", username);
    console.log("Profile Picture:", picture);
    // console.log("Likes:", likes);
  } catch (error) {
    console.error("Error:", error);
  } finally {
  }
});
