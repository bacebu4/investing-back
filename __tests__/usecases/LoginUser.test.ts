import { setup, SetupUsecaseData } from '../../test/usecases/setup';
import { fake } from '../../test/usecases/fake';
import { LoginUserImpl } from '../../src/usecases/LoginUser/LoginUserUsecase';
import { LoginUserError } from '../../src/usecases/LoginUser/LoginUserErrors';

const INPUT = {
  email: 'FAKE_MAIL',
  password: '12356',
};

describe('LoginUser', () => {
  let loginUser: LoginUserImpl;
  let setupData: SetupUsecaseData;

  beforeAll(() => {
    const s = setup();
    setupData = s;
  });

  beforeEach(() => {
    loginUser = setupData.loginUserFactory();
    setupData.mockGetByEmailLeft.mockReturnValue(null);
    setupData.mockGetByEmailRight.mockReturnValue(fake.user);
    setupData.mockCompareValueWithHash.mockReturnValue(true);
  });

  it('calls user repo with input email', async () => {
    await loginUser.invoke(INPUT);

    expect(setupData.mockGetByEmail).toHaveBeenCalledWith(INPUT.email);
  });

  it('calls crypto with input password and hashed password', async () => {
    await loginUser.invoke(INPUT);

    expect(setupData.mockCompareValueWithHash).toHaveBeenCalledWith(
      INPUT.password,
      fake.user.hashedPassword
    );
  });

  it('fails if user not found', async () => {
    setupData.mockGetByEmailLeft.mockReturnValue('some error');
    setupData.mockGetByEmailRight.mockReturnValue(null);

    const [error] = await loginUser.invoke(INPUT);

    expect(error).not.toBe(null);
    expect(error[0]).toBeInstanceOf(LoginUserError);
  });

  it('fails if passwords not matched', async () => {
    setupData.mockCompareValueWithHash.mockReturnValue(false);

    const [error] = await loginUser.invoke(INPUT);

    expect(error).not.toBe(null);
    expect(error[0]).toBeInstanceOf(LoginUserError);
  });

  it('succeeds', async () => {
    const [error, token] = await loginUser.invoke(INPUT);

    expect(error).toBe(null);
    expect(token).toBe(fake.token);
  });
});
