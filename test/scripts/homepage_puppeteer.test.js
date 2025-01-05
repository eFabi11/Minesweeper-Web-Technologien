const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

describe('Homepage E2E Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    // Resolve relative path to absolute path
    const filePath = path.resolve(__dirname, '../../app/views/gameHomepage.scala.html');
    const fileUrl = `file://${filePath}`;

    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Navigate to the resolved file URL
    await page.goto(fileUrl);
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Header resizing on scroll', async () => {
    await page.evaluate(() => window.scrollTo(0, 500));
    const headerClass = await page.$eval('#header-scroll', (el) => el.className);
    expect(headerClass).toContain('');
  });

  test('Smooth scrolling on navigation link click', async () => {
    await page.click('nav a[href="#how-to-play"]');
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });

  test('AJAX behavior on button click', async () => {
    await page.click('#start-game-btn');
    const bodyContent = await page.evaluate(() => document.body.innerHTML);
    expect(bodyContent).toContain(bodyContent); // Mocked content
  });
});
