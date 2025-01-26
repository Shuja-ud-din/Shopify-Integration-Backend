import { ITokenPayload } from './common/utils/token';

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}
