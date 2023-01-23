import { goToLoginPortal } from '../navigation.utility';

const replaceFn = jest.fn();

describe('Tests navigation utility methods', () => {
  const { location } = window;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    delete window.location;
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    window.location = {
      href: '',
      replace: replaceFn,
    };
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  afterAll((): void => {
    window.location = location;
  });

  it('goToLoginPortal', () => {
    goToLoginPortal('fake-origin');
    expect(replaceFn).toBeCalledTimes(1);
    expect(replaceFn).toBeCalledWith('logout?origin=fake-origin');
  });
});
