import { registerAs } from '@nestjs/config';

export default registerAs('shopify', () => {
  return {
    apiKey: process.env.SHOPIFY_API_KEY,
    apiSecret: process.env.SHOPIFY_API_SECRET,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    store: process.env.SHOPIFY_STORE,
  };
});
