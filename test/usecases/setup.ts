import { User } from '../../src/domain/User';
import { Crypto } from '../../src/infrastructure/crypto/Crypto';
import { UserRepository } from '../../src/infrastructure/repositories/UserRepository';
import {
  Token,
  TokenService,
} from '../../src/infrastructure/token/TokenService';
import { UUID } from '../../src/infrastructure/uuid/UUID';
import { CreateUserImpl } from '../../src/usecases/CreateUser/CreateUserUsecase';
import { fake } from './fake';

const mockUUIDGenerate = jest.fn();
class UUIDFake implements UUID {
  generate() {
    mockUUIDGenerate();
    return fake.uuid;
  }
}

const mockCryptoGenerateHash = jest.fn();
class CryptoFake implements Crypto {
  generateHash() {
    mockCryptoGenerateHash();
    return Promise.resolve(fake.hash);
  }

  compareValueWithHash(value: string, hash: string) {
    return Promise.resolve(true);
  }
}

const mockSave = jest.fn();
const mockGetByEmail = jest.fn();
const mockGetByEmailLeft = jest.fn();
const mockGetByEmailRight = jest.fn();
class UserRepoFake implements UserRepository {
  save(user: User) {
    mockSave(user);
  }

  getByEmail(email: string): any {
    mockGetByEmail(email);
    return [mockGetByEmailLeft(), mockGetByEmailRight()];
  }
}

const mockSignWithUserId = jest.fn();
class AuthFake implements TokenService {
  signWithUserId(id: string) {
    mockSignWithUserId(id);
    return { value: fake.uuid };
  }

  verifyAndGetUserId(token: Token) {
    return '123' as any;
  }
}

const createUserFactory = () =>
  new CreateUserImpl(
    new UserRepoFake(),
    new UUIDFake(),
    new CryptoFake(),
    new AuthFake()
  );

export type SetupUsecaseData = {
  createUserFactory: () => CreateUserImpl;
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
    createUserFactory,
    mockSave,
    mockGetByEmail,
    mockGetByEmailLeft,
    mockGetByEmailRight,
    mockCryptoGenerateHash,
    mockSignWithUserId,
    mockUUIDGenerate,
  };
}
