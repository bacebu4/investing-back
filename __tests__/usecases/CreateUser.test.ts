import 'reflect-metadata';
import { TYPES } from '../../src/infrastructure/container/types';
import { CreateUserImpl } from '../../src/usecases/CreateUser';
import { Currency } from '../../src/domain/User';
import { BaseError } from '../../src/domain/Error';
import { setup, SetupUsecaseData } from '../../test/usecases/setup';
import { fake } from '../../test/usecases/fake';

const INPUT = { email: 'FAKE_MAIL', password: '12356', currency: Currency.Rub };

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
    setupData.mockGetByEmail.mockReturnValue(false);
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
        portfolio: undefined,
      })
    );
  });

  it('calls auth', async () => {
    await createUser.invoke(INPUT);

    expect(setupData.mockSignWithUserId).toHaveBeenCalledWith(fake.uuid);
  });

  it('returns token with userId', async () => {
    const res = await createUser.invoke(INPUT);

    expect(res).toEqual(fake.uuid);
  });

  it('validate email on whether it is already taken', async () => {
    setupData.mockGetByEmail.mockReturnValue(true);

    let err;
    await createUser.invoke(INPUT).catch((e) => (err = e));

    expect(err).toBeInstanceOf(BaseError);
    expect((err as BaseError).message).toBe('User already exists');
  });

  it('validate password min length', async () => {
    let err;

    await createUser
      .invoke({ ...INPUT, password: '12' })
      .catch((e) => (err = e));

    expect(err).toBeInstanceOf(BaseError);
    expect((err as BaseError).message).toBe('Password is weak.');
  });
});
