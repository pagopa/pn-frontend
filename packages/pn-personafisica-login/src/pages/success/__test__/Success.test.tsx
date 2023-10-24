import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AppRouteType } from '@pagopa-pn/pn-commons';

import { render } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import { storageAarOps, storageTypeOps } from '../../../utility/storage';
import SuccessPage from '../Success';

const mockLocationAssign = jest.fn();

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translation hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
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
    storageTypeOps.write(AppRouteType.PF);
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );
    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(getConfiguration().PF_URL + '#token=fake-token');
  });

  it('test redirect - aar', () => {
    storageTypeOps.write(AppRouteType.PF);
    storageAarOps.write('aar-token');
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(
      getConfiguration().PF_URL + '?aar=aar-token#token=fake-token'
    );
  });

  it('test redirect - aar with xss attack', () => {
    storageTypeOps.write(AppRouteType.PF);
    storageAarOps.write('<script>malicious code</script>aar-malicious-token');
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(
      getConfiguration().PF_URL + '?aar=aar-malicious-token#token=fake-token'
    );
  });
});
