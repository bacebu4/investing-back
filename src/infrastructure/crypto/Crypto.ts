import bcrypt from 'bcrypt';

export interface Crypto {
  generateHash(value: string): Promise<string>;
  compareValueWithHash(value: string, hash: string): Promise<boolean>;
}

export class CryptoImpl implements Crypto {
  public async generateHash(value: string) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(value, salt);
    return hash;
  }

  public async compareValueWithHash(value: string, hash: string) {
    const result = await bcrypt.compare(value, hash);
    return result;
  }
}
