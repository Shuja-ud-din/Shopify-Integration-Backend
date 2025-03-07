import { registerAs } from '@nestjs/config';

export default registerAs('scraper', () => {
  return {
    ebayScrapeUrl: process.env.EBAY_SCRAPER_URL,
    costcoScrapeUrl: process.env.COSTCO_SCRAPER_URL,
  };
});
