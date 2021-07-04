import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../../domain/User';

export class Token {
  public value: string;

  constructor(token: string) {
    this.value = token;
  }
}

export interface TokenService {
  signWithUserId(userId: string): Token;
  verifyAndGetUserId(token: Token): Pick<User, 'id'>;
}

export class TokenServiceImpl implements TokenService {
  private secret = '123';

  public signWithUserId(userId: string) {
    const token = new Token(jwt.sign({ userId }, this.secret));
    return token;
  }

  public verifyAndGetUserId(token: Token) {
    const payload: JwtPayload | string = jwt.verify(token.value, this.secret);
    return (payload as JwtPayload).userId;
  }
}
