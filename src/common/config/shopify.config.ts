import { registerAs } from '@nestjs/config';

export default registerAs('shopify', () => {
  return {
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    store: process.env.SHOPIFY_STORE,
  };
});
