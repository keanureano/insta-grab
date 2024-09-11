import { connect, PageWithCursor } from "puppeteer-real-browser";
import dotenv from "dotenv";

dotenv.config();

connect({
  headless: false,
  // proxy: {
  //   host: '<proxy-host>',
  //   port: '<proxy-port>',
  //   username?: '<proxy-username>',
  //   password?: '<proxy-password>'
  // }
}).then(async ({ page, browser }) => {
  try {
    await loginToInstagram(page);

    await goToInstagramAccount(page, "facebook");

    const username = await getUsername(page);
    const picture = await getProfilePicture(page);

    await loadAllPostsByScrolling(page);

    const { likes, comments } = await getLikesAndComments(page);

    console.log("Results:");
    console.log(`Username: ${username}`);
    console.log(`Profile Picture URL: ${picture}`);
    console.log(`Likes: ${likes}`);
    console.log(`Comments: ${comments}`);
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Optionally close the browser here
    // await browser.close();
    console.log("Finished execution.");
  }
});

const navigateToPage = async (page: PageWithCursor, url: string) => {
  console.log(`Navigating to ${url}`);
  await page.goto(url, { waitUntil: "networkidle2" });
};

const loginToInstagram = async (page: PageWithCursor) => {
  await navigateToPage(page, "https://www.instagram.com/accounts/login/");
  await page.waitForSelector("input[name='username']", { timeout: 10000 });
  await page.type("input[name='username']", process.env.IG_USERNAME || "");
  await page.type("input[name='password']", process.env.IG_PASSWORD || "");
  await page.click("button[type='submit']");

  console.log("Submitted credentials. Waiting for navigation...");
  await page.waitForNavigation({ waitUntil: "networkidle2" });
  console.log("Log in successful.");
};

const goToInstagramAccount = async (page: PageWithCursor, account: string) => {
  await navigateToPage(page, `https://www.instagram.com/${account}`);
  await page.waitForSelector("section > div div > a > h2", {
    timeout: 10000,
  });
  console.log("Page loaded and selector is visible.");
};

const getUsername = async (page: PageWithCursor) => {
  console.log("Fetching username...");
  return page.evaluate(() => {
    const element = document.querySelector(
      "section > div div > a > h2"
    ) as HTMLElement;
    return element ? element.textContent : null;
  });
};

const getProfilePicture = async (page: PageWithCursor) => {
  console.log("Fetching profile picture...");
  return page.evaluate(() => {
    const element = document.querySelector(
      "img[alt*='profile picture']"
    ) as HTMLImageElement;
    return element ? element.src : null;
  });
};

const delay = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

const loadAllPostsByScrolling = async (
  page: PageWithCursor,
  maxScrolls: number = 1
) => {
  let scrollCount = 0;
  let lastHeight = 0;

  while (scrollCount < maxScrolls) {
    console.log(`Scrolled down to load posts ${scrollCount} times`);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await delay(2000); // Wait for new content to load

    const newHeight = await page.evaluate(() => document.body.scrollHeight);

    if (newHeight === lastHeight) {
      console.log("No more posts to load.");
      break;
    }

    lastHeight = newHeight;
    scrollCount++;
  }

  console.log("Finished scrolling and loading all posts.");
};

const getLikesAndComments = async (page: PageWithCursor) => {
  console.log("Fetching posts...");
  const posts = await page.$$("main > div > div:nth-child(3) > div div > a");
  console.log(
    `${posts.length} Posts fetched. Processing likes and comments...`
  );
  const likes: string[] = [];
  const comments: string[] = [];

  for (const post of posts) {
    await page.evaluate((element) => element.scrollIntoView(), post);

    await post.hover();

    const [like, comment] = await post.evaluate((post) => {
      const elements = post.querySelectorAll("div > ul > li > span");
      return [elements[0]?.textContent || "", elements[2]?.textContent || ""];
    });

    likes.push(like);
    comments.push(comment);
  }

  return { likes, comments };
};
