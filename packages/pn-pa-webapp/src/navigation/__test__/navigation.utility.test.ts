import { getConfiguration } from '../../services/configuration.service';
import { goToSelfcareLogin } from '../navigation.utility';

const exitFn = jest.fn();

describe('Tests notification.utility', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '', assign: exitFn },
    });
  });

  afterAll((): void => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  it('goToSelfcareLogin', () => {
    goToSelfcareLogin();
    expect(window.location.href).toBe(getConfiguration().SELFCARE_URL_FE_LOGIN);
  });
});
