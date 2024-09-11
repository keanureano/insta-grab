import { connect } from "puppeteer-real-browser";

const delay = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

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

    const showMoreButtonExists = async () => {
      const element = await page.$("main > div > div > div > div > button");
      return !!element;
    };

    while (await showMoreButtonExists()) {
      await page.click("main > div > div > div > div > button");
      delay(1000);
    }

    delay(1000);

    const posts = await page.$$("article > div div > a");

    const likes = [];
    const comments = [];

    for (const post of posts) {
      await post.hover();

      const [like, comment] = await post.evaluate(() => {
        const elements = document.querySelectorAll("a > div > ul > li > span");
        return [elements[0].textContent, elements[2].textContent];
      });

      likes.push(like);
      comments.push(comment);
    }

    console.log("Username:", username);
    console.log("Profile Picture:", picture);
    console.log("Likes:", likes.length);
    console.log("Comments:", comments.length);
  } catch (error) {
    console.error("Error:", error);
  } finally {
  }
});
