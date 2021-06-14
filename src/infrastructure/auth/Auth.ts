import { injectable } from 'inversify';

export interface Auth {
  signWithUserId(userId: string): string;
  verifyAndGetUserId(userId: string): string;
}

@injectable()
export class AuthImpl implements Auth {
  private secret: string = '123';

  public signWithUserId(userId: string) {
    return `signed-key-${userId}-${this.secret}`;
  }

  public verifyAndGetUserId(token: string) {
    return `${token.split('-')[2]}`;
  }
}
