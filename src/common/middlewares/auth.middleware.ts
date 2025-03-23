import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { verifyToken } from '../utils/token';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const decoded = verifyToken(token);
      req.user = decoded;

      next();
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Invalid token', err);
    }
  }
}
