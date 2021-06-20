import 'reflect-metadata';
import { Container, injectable } from 'inversify';
import { TYPES } from '../../src/infrastructure/container/types';
import { LoginUserImpl } from '../../src/usecases/LoginUser';

const mockCompare = jest.fn();
@injectable()
class CryptoFake {
  compareValueWithHash(value: string, hash: string) {
    mockCompare(value, hash);
    return true;
  }
}

const RETURNED_USER = {
  hashedPassword: 'hashed',
  id: '1',
};
const mockGetByEmail = jest.fn();
@injectable()
class UserRepoFake {
  getByEmail(email: string) {
    mockGetByEmail(email);
    return RETURNED_USER;
  }
}

const mockSignWithUserId = jest.fn();
const FAKE_TOKEN = 'fake_token';
@injectable()
class AuthFake {
  signWithUserId(id: string) {
    mockSignWithUserId(id);
    return FAKE_TOKEN;
  }
}

const fakeContainer = new Container();
fakeContainer.bind(TYPES.Crypto).to(CryptoFake);
fakeContainer.bind(TYPES.UserRepository).to(UserRepoFake);
fakeContainer.bind(TYPES.TokenService).to(AuthFake);
fakeContainer.bind(TYPES.LoginUser).to(LoginUserImpl);

const INPUT = { email: 'FAKE_MAIL', password: '123' };

describe('LoginUser', () => {
  let loginUser;

  beforeEach(() => {
    loginUser = fakeContainer.get<LoginUserImpl>(TYPES.LoginUser);
  });

  it('calls repo to get hashed password', async () => {
    await loginUser.invoke(INPUT);

    expect(mockGetByEmail).toHaveBeenCalledWith(INPUT.email);
  });

  it('calls crypto to verify', async () => {
    await loginUser.invoke(INPUT);

    expect(mockCompare).toHaveBeenCalledWith(
      INPUT.password,
      RETURNED_USER.hashedPassword
    );
  });

  it('calls auth to generate token', async () => {
    await loginUser.invoke(INPUT);

    expect(mockSignWithUserId).toHaveBeenCalledWith(RETURNED_USER.id);
  });

  it('return generated token', async () => {
    const res = await loginUser.invoke(INPUT);

    expect(res).toEqual(FAKE_TOKEN);
  });
});
