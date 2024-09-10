import puppeteer from "puppeteer";

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.instagram.com/nodejs.tech/", {
    waitUntil: "networkidle2",
  });
}

main();
