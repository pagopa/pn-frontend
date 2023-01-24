import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import SuccessPage from '../Success';
import '../../../locales/i18n';
import { storageAarOps, storageTypeOps } from '../../../utils/storage';
import { PF_URL, PG_URL } from '../../../utils/constants';

const mockLocationAssign = jest.fn();

const original = window.location;

describe('test login page', () => {
  beforeAll(() => {
    /* eslint-disable-next-line functional/immutable-data */
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { replace: mockLocationAssign, hash: '#token=fake-token' },
    });
  });

  afterAll(() => {
    /* eslint-disable-next-line functional/immutable-data */
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  test('test redirect - PF', () => {
    storageTypeOps.write('PF');
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(PF_URL + '#token=fake-token');
  });

  test('test redirect - PG', () => {
    storageTypeOps.write('PG');
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(PG_URL + '#token=fake-token');
  });

  test('test redirect - xss attack', () => {
    storageTypeOps.write('<script>malicious code</script>not-safe-url' as 'PF');
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).not.toBeCalled();
  });

  test('test redirect - aar', () => {
    storageTypeOps.write('PF');
    storageAarOps.write('aar-token');
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(PF_URL + '?aar=aar-token#token=fake-token');
  });

  test('test redirect - aar with xss attack', () => {
    storageTypeOps.write('PF');
    storageAarOps.write('<script>malicious code</script>aar-malicious-token');
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(PF_URL + '?aar=aar-malicious-token#token=fake-token');
  });
});
