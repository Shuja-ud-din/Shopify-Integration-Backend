import chromium from '@sparticuz/chromium';
import puppeteerExtra from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteerExtra.use(StealthPlugin());

export const handler = async (event, context) => {
  let browser = null;

  try {
    // Parse the event body to get URLs
    const requestBody = JSON.parse(event.body || '{}');
    const products = requestBody.products;

    if (!Array.isArray(products) || products.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Missing or invalid 'products' parameter. Must be a non-empty array.",
        }),
      };
    }

    // Determine environment (Lambda or local)
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

    // Launch browser once
    browser = await puppeteerExtra.launch(browserOptions);
    const page = await browser.newPage();

    // Set User-Agent and headers
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    );

    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
    });

    // Block unnecessary resources
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

    // Function to scrape data from a page
    const scrapeData = async (url) => {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

        // Wait for key element to be available
        await page.waitForSelector('.notranslate.ng-star-inserted', {
          timeout: 5000,
        });

        // Extract data
        const product = await page.evaluate(() => {
          const title =
            document.querySelector('.product-name')?.innerText || 'N/A';
          const price =
            document.querySelector('.notranslate.ng-star-inserted')
              ?.innerText || 'N/A';

          const imageUrl =
            document
              .querySelector('div.primary-image-wrapper picture img')
              ?.getAttribute('src') || null;

          const buyNowButton =
            document.querySelector('button.btn-secondary.buynow-button') !==
            null;
          const addToCartButton =
            document.querySelector('button#add-to-cart-button') !== null;

          const available = buyNowButton && addToCartButton;

          return {
            title,
            stockQty: 1,
            price: price ? parseFloat(price.match(/\d+\.\d+/)[0]) : null,
            available,
            imageUrl: `https://www.costco.com.au${imageUrl}`,
          };
        });

        return { url, ...product };
      } catch (error) {
        return { url, success: false, error: error.message };
      }
    };

    // Process all URLs
    const results = [];
    for (const product of products) {
      let result = await scrapeData(product.url);
      result.id = product.id;

      if (result.success === false) {
        console.error(`Error scraping product ${product.url}: ${result.error}`);
      } else {
        results.push(result);
      }
    }

    // Close browser
    await browser.close();

    return {
      statusCode: 200,
      body: JSON.stringify(results),
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
