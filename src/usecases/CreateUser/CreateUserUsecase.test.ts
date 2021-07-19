import { fake } from '../../../test/usecases/fake';
import { setup, SetupUsecaseData } from '../../../test/usecases/setup';
import { Currency } from '../../domain/User/User';
import { CreateUserError } from './CreateUserErrors';
import { CreateUserImpl } from './CreateUserUsecase';

const VALID_INPUT = {
  email: 'FAKE_MAIL',
  password: '12356',
  currency: Currency.RUB,
};
const INVALID_PASSWORD = '123';

describe('CreateUser', () => {
  let createUser: CreateUserImpl;
  let setupData: SetupUsecaseData;

  beforeAll(() => {
    const s = setup();
    setupData = s;
  });

  beforeEach(() => {
    createUser = setupData.createUserFactory();
    setupData.mockGetByEmailLeft.mockReturnValue({});
    setupData.mockGetByEmailRight(null);
  });

  it('calls uuid', async () => {
    await createUser.invoke(VALID_INPUT);

    expect(setupData.mockUUIDGenerate).toHaveBeenCalledTimes(1);
  });

  it('calls crypto', async () => {
    await createUser.invoke(VALID_INPUT);

    expect(setupData.mockCryptoGenerateHash).toHaveBeenCalledTimes(1);
  });

  it('calls repo with user', async () => {
    await createUser.invoke(VALID_INPUT);

    expect(setupData.mockSave).toHaveBeenCalledTimes(1);
    expect(setupData.mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        id: fake.uuid,
        hashedPassword: fake.hash,
        email: VALID_INPUT.email,
        currency: VALID_INPUT.currency,
      })
    );
  });

  it('calls auth', async () => {
    await createUser.invoke(VALID_INPUT);

    expect(setupData.mockSignWithUserId).toHaveBeenCalledWith(fake.uuid);
  });

  it('returns token with userId', async () => {
    const [err, token] = await createUser.invoke(VALID_INPUT);

    expect(token.value).toEqual(fake.token);
    expect(err).toBe(null);
  });

  it('validate email on whether it is already taken', async () => {
    setupData.mockGetByEmailLeft.mockReturnValue(null);
    setupData.mockGetByEmailRight.mockReturnValue({});

    const [err, token] = await createUser.invoke(VALID_INPUT);

    expect(err[0]).toBeInstanceOf(CreateUserError);
    expect(token).toBe(null);
  });

  it('validate password min length', async () => {
    const [err, token] = await createUser.invoke({
      ...VALID_INPUT,
      password: INVALID_PASSWORD,
    });

    expect(err[0]).toBeInstanceOf(CreateUserError);
    expect(token).toBe(null);
  });
});
