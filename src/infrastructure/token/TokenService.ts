import jwt, { JwtPayload } from 'jsonwebtoken';

export interface Token {
  value: string;
}

export interface TokenService {
  signWithUserId(userId: string): Token;
  verifyAndGetUserId(tokenValue: string): string;
}

// TODO throws error when wrong token. Fix it with try/catch
export class TokenServiceImpl implements TokenService {
  private secret = '123';

  public signWithUserId(userId: string) {
    const tokenValue = jwt.sign({ userId }, this.secret);
    return { value: tokenValue };
  }

  public verifyAndGetUserId(tokenValue: string) {
    const payload: JwtPayload | string = jwt.verify(tokenValue, this.secret);
    return (payload as JwtPayload).userId;
  }
}
