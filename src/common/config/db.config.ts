import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  return {
    mongoUrl: process.env.MONGO_URI,
  };
});
