import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import { PFTriggerEventSpy, act, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { BffCheckTPPResponse } from '../../../generated-client/notifications';
import { PFEventsType } from '../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import RapidAccessGuard from '../../RapidAccessGuard';

const Guard = () => (
  <Routes>
    <Route element={<RapidAccessGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('RapidAccessGuard - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    mock.reset();
    triggerEventSpy.mockRestore();
  });

  afterAll(() => {
    mock.restore();
  });

  it('fires SEND_RAPID_ACCESS with AAR source after successful QR code exchange', async () => {
    const mockQrCode = 'qr-code';
    mock
      .onPost('/bff/v1/notifications/received/check-aar-qr-code', { aarQrCodeValue: mockQrCode })
      .reply(200, { iun: 'mock-iun' });

    await act(async () => {
      render(<Guard />, { route: `/?${AppRouteParams.AAR}=${mockQrCode}` });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_RAPID_ACCESS, {
        source: AppRouteParams.AAR,
      });
    });
  });

  it('fires SEND_RAPID_ACCESS with RETRIEVAL_ID source after successful retrieval exchange', async () => {
    const mockRetrievalId = 'retrieval-id';
    const url = `/bff/v1/notifications/received/check-tpp?retrievalId=${mockRetrievalId}`;
    mock.onGet(url).reply(200, {
      originId: 'mock-iun',
      retrievalId: mockRetrievalId,
    } as BffCheckTPPResponse);

    await act(async () => {
      render(<Guard />, { route: `/?${AppRouteParams.RETRIEVAL_ID}=${mockRetrievalId}` });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_RAPID_ACCESS, {
        source: AppRouteParams.RETRIEVAL_ID,
      });
    });
  });

  it('fires SEND_NOTIFICATION_NOT_ALLOWED when QR code exchange fails', async () => {
    const mockQrCode = 'bad-qr-code';
    mock
      .onPost('/bff/v1/notifications/received/check-aar-qr-code', { aarQrCodeValue: mockQrCode })
      .reply(500);

    await act(async () => {
      render(<Guard />, { route: `/?${AppRouteParams.AAR}=${mockQrCode}` });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_NOTIFICATION_NOT_ALLOWED);
    });
  });
});
