import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    globalPrefix: process.env.GLOBAL_PREFIX || 'api',
    corsEnabled: process.env.CORS_ENABLED === 'true',
  };
});
