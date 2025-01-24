import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => {
  return {
    url: process.env.REDIS_URL,
  };
});
