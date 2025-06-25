import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  getWelcomeMessage(): string {
    return 'Welcome to the Server! 🚀';
  }

  getHealth(): string {
    return 'Server is UP and RUNNING... 🚀';
  }
}
