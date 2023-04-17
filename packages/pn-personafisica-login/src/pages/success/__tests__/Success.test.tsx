import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { AppRouteType } from '@pagopa-pn/pn-commons';

import '../../../locales/i18n';
import { storageAarOps, storageTypeOps } from '../../../utils/storage';
import SuccessPage from '../Success';
import { getConfiguration } from "../../../services/configuration.service";

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
  test.skip('test redirect - PG', () => {
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
  test.skip('test redirect - xss attack', () => {
    storageTypeOps.write('<script>malicious code</script>not-safe-url' as AppRouteType.PF);
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).not.toBeCalled();
  });

  test('test redirect - aar', () => {
    storageTypeOps.write(AppRouteType.PF);
    storageAarOps.write('aar-token');
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(getConfiguration().PF_URL + '?aar=aar-token#token=fake-token');
  });

  test('test redirect - aar with xss attack', () => {
    storageTypeOps.write(AppRouteType.PF);
    storageAarOps.write('<script>malicious code</script>aar-malicious-token');
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(getConfiguration().PF_URL + '?aar=aar-malicious-token#token=fake-token');
  });

  // momentarily commented for pn-5157
  test.skip('test redirect - disambiguation page', () => {
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
