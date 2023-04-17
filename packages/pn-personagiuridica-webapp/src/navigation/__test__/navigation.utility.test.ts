// momentarily commented for pn-5157
// import { AppRouteType } from '@pagopa-pn/pn-commons';
import { goToLoginPortal } from '../navigation.utility';
import { getConfiguration } from "../../services/configuration.service";

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
    // momentarily commented for pn-5157
    // goToLoginPortal(AppRouteType.PG);
    goToLoginPortal();
    expect(replaceFn).toBeCalledTimes(1);
    // momentarily commented for pn-5157
    // expect(replaceFn).toBeCalledWith(`${URL_FE_LOGOUT}?type=PG`);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}`);
  });

  // momentarily commented for pn-5157
  /*
  it('goToLoginPortal - aar', () => {
    goToLoginPortal(AppRouteType.PG, 'fake-aar-token');
    expect(replaceFn).toBeCalledTimes(1);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}?type=PG&aar=fake-aar-token`);
  });

  it('goToLoginPortal - aar', () => {
    goToLoginPortal(AppRouteType.PG, '<script>malicious code</script>malicious-aar-token');
    expect(replaceFn).toBeCalledTimes(1);
    expect(replaceFn).toBeCalledWith(`${getConfiguration().URL_FE_LOGOUT}?type=PG&aar=malicious-aar-token`);
  });
  */
});
