import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { render } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import { storageAarOps } from '../../../utility/storage';
import SuccessPage from '../Success';

const mockLocationAssign = vi.fn();

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

describe('test login page', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { replace: mockLocationAssign, hash: '#token=fake-token' },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  it('test redirect', () => {
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );
    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(
      getConfiguration().PF_URL + '#token=fake-token&lang=it'
    );
  });

  it('test redirect - aar', () => {
    storageAarOps.write('aar-token');
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(
      getConfiguration().PF_URL + '?aar=aar-token#token=fake-token&lang=it'
    );
  });

  it('test redirect - aar with xss attack', () => {
    storageAarOps.write('<script>malicious code</script>aar-malicious-token');
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(
      getConfiguration().PF_URL + '?aar=aar-malicious-token#token=fake-token&lang=it'
    );
  });
});
