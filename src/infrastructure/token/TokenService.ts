import jwt, { JwtPayload } from 'jsonwebtoken';
import { Token } from '../../domain/Token';
import { Either, left, right } from '../../lib/Either';
import { TokenServiceError, TokenServiceErrorCode } from './TokenServiceError';

export interface TokenService {
  signWithUserId(userId: string): Token;
  verifyAndGetUserId(tokenValue: string): Either<TokenServiceError, string>;
}

export class TokenServiceImpl implements TokenService {
  private secret = '123';

  public signWithUserId(userId: string) {
    const tokenValue = jwt.sign({ userId }, this.secret);
    return { value: tokenValue };
  }

  public verifyAndGetUserId(
    tokenValue: string
  ): Either<TokenServiceError, string> {
    try {
      const payload: JwtPayload | string = jwt.verify(tokenValue, this.secret);
      const userId = (payload as JwtPayload)?.userId;

      if (userId) {
        return right(userId);
      }

      return left(
        new TokenServiceError(TokenServiceErrorCode.UNEXPECTED_ERROR)
      );
    } catch {
      return left(new TokenServiceError(TokenServiceErrorCode.NOT_VALID));
    }
  }
}
