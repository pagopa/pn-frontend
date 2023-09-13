import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AppRouteType } from '@pagopa-pn/pn-commons';

import { fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import { storageAarOps, storageTypeOps } from '../../../utils/storage';
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

  it('test redirect - PF', () => {
    storageTypeOps.write(AppRouteType.PF);
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );
    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(getConfiguration().PF_URL + '#token=fake-token');
  });

  // momentarily skipped for pn-5157 - pg login is managed by selfcare pnpg
  it.skip('test redirect - PG', () => {
    storageTypeOps.write(AppRouteType.PG);
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(getConfiguration().PG_URL + '#token=fake-token');
  });

  // momentarily commented for pn-5157
  it.skip('test redirect - xss attack', () => {
    storageTypeOps.write('<script>malicious code</script>not-safe-url' as AppRouteType.PF);
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).not.toBeCalled();
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

  // momentarily commented for pn-5157
  it.skip('test redirect - disambiguation page', () => {
    storageTypeOps.write('' as AppRouteType.PF);
    const { queryByTestId } = render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );
    expect(mockLocationAssign).not.toBeCalled();
    // check disambiguation elements renderign
    const pfBox = queryByTestId('pf-box');
    const pgBox = queryByTestId('pg-box');
    const confirmButton = queryByTestId('confirm-button');
    expect(pfBox).toBeInTheDocument();
    expect(pgBox).toBeInTheDocument();
    expect(confirmButton).toBeInTheDocument();
    // check that confirm button is initially disabled
    // select a box and check the button activation
    expect(confirmButton).toBeDisabled();
    fireEvent.click(pfBox!);
    waitFor(() => expect(confirmButton).toBeEnabled());
    // check redirect
    fireEvent.click(confirmButton!);
    waitFor(() => {
      expect(mockLocationAssign).toBeCalled();
      expect(mockLocationAssign).toBeCalledWith(getConfiguration().PF_URL + '#token=fake-token');
    });
  });
});