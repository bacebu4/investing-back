import { injectable } from 'inversify';

export interface Auth {
  sign(userId: string): string;
}

@injectable()
export class AuthImpl implements Auth {
  private secret: string = '123';

  public sign(userId: string) {
    return `signed-key-${userId}-${this.secret}`;
  }

  public verify(token: string) {
    return `${token.split('-')[2]}`;
  }
}
