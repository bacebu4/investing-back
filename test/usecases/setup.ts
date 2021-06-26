import { Container, injectable } from 'inversify';
import { User } from '../../src/domain/User';
import { TYPES } from '../../src/infrastructure/container/types';
import { UUID } from '../../src/infrastructure/uuid/UUID';
import { fake } from './fake';

const mockUUIDGenerate = jest.fn();
@injectable()
class UUIDFake implements UUID {
  generate() {
    mockUUIDGenerate();
    return fake.uuid;
  }
}

const mockCryptoGenerateHash = jest.fn();
@injectable()
class CryptoFake {
  generateHash() {
    mockCryptoGenerateHash();
    return Promise.resolve(fake.hash);
  }
}

const mockSave = jest.fn();
const mockGetByEmail = jest.fn();
const mockGetByEmailLeft = jest.fn();
const mockGetByEmailRight = jest.fn();
@injectable()
class UserRepoFake {
  save(user: User) {
    mockSave(user);
  }

  getByEmail(email: string) {
    mockGetByEmail(email);
    return [mockGetByEmailLeft(), mockGetByEmailRight()];
  }
}

const mockSignWithUserId = jest.fn();
@injectable()
class AuthFake {
  signWithUserId(id: string) {
    mockSignWithUserId(id);
    return { value: fake.uuid };
  }
}

const fakeContainer = new Container();
fakeContainer.bind(TYPES.UUID).to(UUIDFake);
fakeContainer.bind(TYPES.Crypto).to(CryptoFake);
fakeContainer.bind(TYPES.UserRepository).to(UserRepoFake);
fakeContainer.bind(TYPES.TokenService).to(AuthFake);

export type SetupUsecaseData = {
  fakeContainer: Container;
  mockSave: jest.Mock<any, any>;
  mockGetByEmail: jest.Mock<any, any>;
  mockGetByEmailLeft: jest.Mock<any, any>;
  mockGetByEmailRight: jest.Mock<any, any>;
  mockCryptoGenerateHash: jest.Mock<any, any>;
  mockSignWithUserId: jest.Mock<any, any>;
  mockUUIDGenerate: jest.Mock<any, any>;
};

export function setup(): SetupUsecaseData {
  return {
    fakeContainer,
    mockSave,
    mockGetByEmail,
    mockGetByEmailLeft,
    mockGetByEmailRight,
    mockCryptoGenerateHash,
    mockSignWithUserId,
    mockUUIDGenerate,
  };
}
