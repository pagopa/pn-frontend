import { AppRouteType } from '@pagopa-pn/pn-commons';
import { URL_FE_LOGOUT } from '../../utils/constants';
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
    goToLoginPortal(AppRouteType.PG);
    expect(replaceFn).toBeCalledTimes(1);
    expect(replaceFn).toBeCalledWith(`${URL_FE_LOGOUT}?type=PG`);
  });

  it('goToLoginPortal - aar', () => {
    goToLoginPortal(AppRouteType.PG, 'fake-aar-token');
    expect(replaceFn).toBeCalledTimes(1);
    expect(replaceFn).toBeCalledWith(`${URL_FE_LOGOUT}?type=PG&aar=fake-aar-token`);
  });

  it('goToLoginPortal - aar', () => {
    goToLoginPortal(AppRouteType.PG, '<script>malicious code</script>malicious-aar-token');
    expect(replaceFn).toBeCalledTimes(1);
    expect(replaceFn).toBeCalledWith(`${URL_FE_LOGOUT}?type=PG&aar=malicious-aar-token`);
  });
});
