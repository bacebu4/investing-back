import 'reflect-metadata';
import { TYPES } from '../../src/infrastructure/container/types';
import { CreateUserImpl } from '../../src/usecases/CreateUser/CreateUserUsecase';
import { Currency } from '../../src/domain/User';
import { setup, SetupUsecaseData } from '../../test/usecases/setup';
import { fake } from '../../test/usecases/fake';
import { UsecaseError } from '../../src/usecases/UsecaseError';

const INPUT = { email: 'FAKE_MAIL', password: '12356', currency: Currency.Rub };
const INVALID_PASSWORD = '123';

describe('CreateUser', () => {
  let createUser: CreateUserImpl;
  let setupData: SetupUsecaseData;

  beforeAll(() => {
    const s = setup();

    s.fakeContainer.bind(TYPES.CreateUser).to(CreateUserImpl);
    setupData = s;
  });

  beforeEach(() => {
    createUser = setupData.fakeContainer.get<CreateUserImpl>(TYPES.CreateUser);
    setupData.mockGetByEmailLeft.mockReturnValue({});
    setupData.mockGetByEmailRight(null);
  });

  it('calls uuid', async () => {
    await createUser.invoke(INPUT);

    expect(setupData.mockUUIDGenerate).toHaveBeenCalledTimes(1);
  });

  it('calls crypto', async () => {
    await createUser.invoke(INPUT);

    expect(setupData.mockCryptoGenerateHash).toHaveBeenCalledTimes(1);
  });

  it('calls repo with user', async () => {
    await createUser.invoke(INPUT);

    expect(setupData.mockSave).toHaveBeenCalledTimes(1);
    expect(setupData.mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        id: fake.uuid,
        hashedPassword: fake.hash,
        email: INPUT.email,
        currency: INPUT.currency,
      })
    );
  });

  it('calls auth', async () => {
    await createUser.invoke(INPUT);

    expect(setupData.mockSignWithUserId).toHaveBeenCalledWith(fake.uuid);
  });

  it('returns token with userId', async () => {
    const [err, token] = await createUser.invoke(INPUT);

    expect(token).toEqual(fake.uuid);
    expect(err).toBe(null);
  });

  it('validate email on whether it is already taken', async () => {
    setupData.mockGetByEmailLeft.mockReturnValue(null);

    const [err, token] = await createUser.invoke(INPUT);

    expect(err[0]).toBeInstanceOf(UsecaseError);
    expect(token).toBe(null);
  });

  it('validate password min length', async () => {
    const [err, token] = await createUser.invoke({
      ...INPUT,
      password: INVALID_PASSWORD,
    });

    expect(err[0]).toBeInstanceOf(UsecaseError);
    expect(token).toBe(null);
  });
});
