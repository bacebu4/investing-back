import { User } from '../../src/domain/User';
import { Crypto } from '../../src/infrastructure/crypto/Crypto';
import { Logger } from '../../src/infrastructure/logger/Logger';
import { UserRepository } from '../../src/infrastructure/repositories/user/UserRepository';
import {
  Token,
  TokenService,
} from '../../src/infrastructure/token/TokenService';
import { UUID } from '../../src/infrastructure/uuid/UUID';
import { CreateUserImpl } from '../../src/usecases/CreateUser/CreateUserUsecase';
import { LoginUserImpl } from '../../src/usecases/LoginUser/LoginUserUsecase';
import { fake } from './fake';

class LoggerFake implements Logger {
  info() {}
  error() {}
  child() {
    return 1 as any;
  }
  decorateRequestWithTraceId() {}
}

const mockUUIDGenerate = jest.fn();
class UUIDFake implements UUID {
  generate() {
    mockUUIDGenerate();
    return fake.uuid;
  }
}

const mockCryptoGenerateHash = jest.fn();
const mockCompareValueWithHash = jest.fn().mockResolvedValue(true);
class CryptoFake implements Crypto {
  generateHash() {
    mockCryptoGenerateHash();
    return Promise.resolve(fake.hash);
  }

  compareValueWithHash(value: string, hash: string) {
    return mockCompareValueWithHash(value, hash);
  }
}

const mockSave = jest.fn();
const mockGetByEmail = jest.fn();
const mockGetByEmailLeft = jest.fn();
const mockGetByEmailRight = jest.fn();
class UserRepoFake implements UserRepository {
  save(user: User): any {
    mockSave(user);
  }

  getByEmail(email: string): any {
    mockGetByEmail(email);
    return [mockGetByEmailLeft(), mockGetByEmailRight()];
  }

  getTickerIdBySymbolName(): any {
    return [null, '123'];
  }

  saveTicker() {
    return true as any;
  }

  getById() {
    return true as any;
  }
}

const mockSignWithUserId = jest.fn();
class AuthFake implements TokenService {
  signWithUserId(id: string) {
    mockSignWithUserId(id);
    return { value: fake.token };
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

const loginUserFactory = () =>
  new LoginUserImpl(
    new UserRepoFake(),
    new CryptoFake(),
    new AuthFake(),
    new LoggerFake()
  );

export type SetupUsecaseData = {
  createUserFactory: () => CreateUserImpl;
  loginUserFactory: () => LoginUserImpl;
  mockSave: jest.Mock<any, any>;
  mockGetByEmail: jest.Mock<any, any>;
  mockGetByEmailLeft: jest.Mock<any, any>;
  mockGetByEmailRight: jest.Mock<any, any>;
  mockCryptoGenerateHash: jest.Mock<any, any>;
  mockCompareValueWithHash: jest.Mock<any, any>;
  mockSignWithUserId: jest.Mock<any, any>;
  mockUUIDGenerate: jest.Mock<any, any>;
};

export function setup(): SetupUsecaseData {
  return {
    createUserFactory,
    loginUserFactory,
    mockSave,
    mockGetByEmail,
    mockGetByEmailLeft,
    mockGetByEmailRight,
    mockCryptoGenerateHash,
    mockCompareValueWithHash,
    mockSignWithUserId,
    mockUUIDGenerate,
  };
}
