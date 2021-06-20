import 'reflect-metadata';
import { Container, injectable } from 'inversify';
import { TYPES } from '../../src/infrastructure/container/types';
import { UUID } from '../../src/infrastructure/uuid/UUID';
import { CreateUserImpl } from '../../src/usecases/CreateUser';
import { Currency, User } from '../../src/domain/User';

const FAKE_UUID = 'generated-uuid-test';
const mockUUIDGenerate = jest.fn();
@injectable()
class UUIDFake implements UUID {
  generate() {
    mockUUIDGenerate();
    return FAKE_UUID;
  }
}

const FAKE_HASH = 'generated-hash';
const mockCryptoGenerateHash = jest.fn();
@injectable()
class CryptoFake {
  generateHash() {
    mockCryptoGenerateHash();
    return Promise.resolve(FAKE_HASH);
  }
}

const mockUserRepoSave = jest.fn();
@injectable()
class UserRepoFake {
  save(user: User) {
    mockUserRepoSave(user);
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
fakeContainer.bind(TYPES.UUID).to(UUIDFake);
fakeContainer.bind(TYPES.Crypto).to(CryptoFake);
fakeContainer.bind(TYPES.UserRepository).to(UserRepoFake);
fakeContainer.bind(TYPES.TokenService).to(AuthFake);
fakeContainer.bind(TYPES.CreateUser).to(CreateUserImpl);

const INPUT = { email: 'FAKE_MAIL', password: '123', currency: Currency.Rub };

describe('CreateUser', () => {
  let createUser;

  beforeEach(() => {
    createUser = fakeContainer.get<CreateUserImpl>(TYPES.CreateUser);
  });

  it('calls uuid', async () => {
    await createUser.invoke(INPUT);

    expect(mockUUIDGenerate).toHaveBeenCalledTimes(1);
  });

  it('calls crypto', async () => {
    await createUser.invoke(INPUT);

    expect(mockCryptoGenerateHash).toHaveBeenCalledTimes(1);
  });

  it('calls repo with user', async () => {
    await createUser.invoke(INPUT);

    expect(mockUserRepoSave).toHaveBeenCalledTimes(1);
    expect(mockUserRepoSave).toHaveBeenCalledWith(
      expect.objectContaining({
        id: FAKE_UUID,
        hashedPassword: FAKE_HASH,
        email: INPUT.email,
        currency: INPUT.currency,
        portfolio: undefined,
      })
    );
  });

  it('calls auth', async () => {
    await createUser.invoke(INPUT);

    expect(mockSignWithUserId).toHaveBeenCalledWith(FAKE_UUID);
  });

  it('returns token with userId', async () => {
    const res = await createUser.invoke(INPUT);

    expect(res).toEqual(FAKE_TOKEN);
  });
});
