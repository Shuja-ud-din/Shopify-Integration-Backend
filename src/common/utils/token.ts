import * as jwt from 'jsonwebtoken';

export interface ITokenPayload {
  email: string;
  id: string;
}

export const generateToken = (payload: ITokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN;

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): ITokenPayload => {
  const secret = process.env.JWT_SECRET;

  return jwt.verify(token, secret) as ITokenPayload;
};
