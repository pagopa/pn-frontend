import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { render } from '../../../__test__/test-utils';
import { getConfiguration } from '../../../services/configuration.service';
import { storageRapidAccessOps } from '../../../utility/storage';
import SuccessPage from '../Success';

const mockLocationAssign = vi.fn();

// mock imports
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
    expect(mockLocationAssign).toHaveBeenCalled();
    expect(mockLocationAssign).toHaveBeenCalledWith(
      getConfiguration().PF_URL + '#token=fake-token&lang=it'
    );
  });

  it('test redirect - aar', () => {
    storageRapidAccessOps.write([AppRouteParams.AAR, 'aar-token']);
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toHaveBeenCalled();
    expect(mockLocationAssign).toHaveBeenCalledWith(
      getConfiguration().PF_URL + '?aar=aar-token#token=fake-token&lang=it'
    );
  });

  it('test redirect - retrievalId', () => {
    storageRapidAccessOps.write([AppRouteParams.RETRIEVAL_ID, 'retrieval-id']);
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toBeCalled();
    expect(mockLocationAssign).toBeCalledWith(
      getConfiguration().PF_URL + '?retrievalId=retrieval-id#token=fake-token&lang=it'
    );
  });

  it('test redirect - aar with xss attack', () => {
    storageRapidAccessOps.write([
      AppRouteParams.AAR,
      '<script>malicious code</script>aar-malicious-token',
    ]);
    render(
      <BrowserRouter>
        <SuccessPage />
      </BrowserRouter>
    );

    expect(mockLocationAssign).toHaveBeenCalled();
    expect(mockLocationAssign).toHaveBeenCalledWith(
      getConfiguration().PF_URL + '?aar=aar-malicious-token#token=fake-token&lang=it'
    );
  });
});
