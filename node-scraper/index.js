import chromium from '@sparticuz/chromium';
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteerExtra.use(StealthPlugin());

export const handler = async (event, context) => {
  let browser = null;

  try {
    const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_NAME;

    const browserOptions = isLambda
      ? {
          executablePath: await chromium.executablePath(),
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process',
            '--disable-gpu',
          ],
          headless: true,
        }
      : {
          executablePath:
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          headless: true,
        };

    browser = await puppeteerExtra.launch(browserOptions);
    const page = await browser.newPage();

    // Set headers and user-agent to avoid bot detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    );

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
    });

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (
        ['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const url =
      'https://www.costco.com.au/Electronics/Audio-Video/AirPods/AirPods-4-With-Active-Noise-Cancellation/p/202170';
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Wait for .notranslate ng-star-inserted to be available
    await page.waitForSelector('.notranslate.ng-star-inserted');

    // Extract data from adobeProductData
    const product = await page.evaluate(() => {
      const name = document.querySelector('.product-name').innerText;
      const product = document.querySelector(
        '.notranslate.ng-star-inserted',
      ).innerText;

      return {
        name,
        product,
      };
    });

    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ product }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
