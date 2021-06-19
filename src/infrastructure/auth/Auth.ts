import { injectable } from 'inversify';
import jwt, { JwtPayload } from 'jsonwebtoken';

export interface Auth {
  signWithUserId(userId: string): string;
  verifyAndGetUserId(userId: string): string;
}

@injectable()
export class AuthImpl implements Auth {
  private secret: string = '123';

  public signWithUserId(userId: string) {
    return jwt.sign({ userId }, this.secret);
  }

  public verifyAndGetUserId(token: string) {
    const payload: JwtPayload | string = jwt.verify(token, this.secret);
    return (payload as JwtPayload).userId;
  }
}
