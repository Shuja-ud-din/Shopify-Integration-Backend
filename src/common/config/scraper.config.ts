import { registerAs } from '@nestjs/config';

export default registerAs('scraper', () => {
  return {
    ebayUrl: process.env.EBAY_SCRAPER_URL,
    costcoUrl: process.env.COSTCO_SCRAPER_URL,
  };
});
