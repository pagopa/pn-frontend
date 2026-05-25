import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { MockInstance, vi } from 'vitest';

import { AppRouteParams } from '@pagopa-pn/pn-commons';

import {
  oneIdentityAarUserResponse,
  oneIdentityRetriavlIdUserResponse,
  oneIdentityUserResponse,
  userResponse,
} from '../../../__mocks__/Auth.mock';
import { act, render, waitFor } from '../../../__test__/test-utils';
import { authClient } from '../../../api/apiClients';
import { AUTH_TOKEN_EXCHANGE, ONE_IDENTITY_TOKEN_EXCHANGE } from '../../../api/auth/auth.routes';
import { PFEventsType } from '../../../models/PFEventsType';
import PFEventStrategyFactory from '../../../utility/MixpanelUtils/PFEventStrategyFactory';
import SessionGuard from '../../SessionGuard';

const Guard = () => (
  <Routes>
    <Route element={<SessionGuard />}>
      <Route path="/" element={<div>Generic Page</div>} />
    </Route>
  </Routes>
);

describe('SessionGuard - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(authClient);
    vi.stubGlobal('open', vi.fn());
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
    vi.unstubAllGlobals();
  });

  it('fires SEND_AUTH_SUCCESS with no source after successful SPID token exchange', async () => {
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(200, userResponse);

    await act(async () => {
      render(<Guard />, { route: '/#token=valid_spid_token' });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_AUTH_SUCCESS, {
        source: undefined,
      });
    });
  });

  it('fires SEND_AUTH_SUCCESS with AAR source after SPID token exchange with AAR param', async () => {
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(200, userResponse);

    await act(async () => {
      render(<Guard />, {
        route: `/?${AppRouteParams.AAR}=some-aar-value#token=valid_spid_token`,
      });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_AUTH_SUCCESS, {
        source: AppRouteParams.AAR,
      });
    });
  });

  it('fires SEND_AUTH_SUCCESS with RETRIEVAL_ID source after SPID token exchange with retrievalId param', async () => {
    mock.onPost(AUTH_TOKEN_EXCHANGE()).reply(200, userResponse);

    await act(async () => {
      render(<Guard />, {
        route: `/?${AppRouteParams.RETRIEVAL_ID}=some-retrieval-id#token=valid_spid_token`,
      });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_AUTH_SUCCESS, {
        source: AppRouteParams.RETRIEVAL_ID,
      });
    });
  });

  it('fires SEND_LOGIN_METHOD after successful One Identity token exchange', async () => {
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, oneIdentityUserResponse);

    await act(async () => {
      render(<Guard />, { route: '/#code=valid_code&state=some_state' });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_LOGIN_METHOD, {
        entityID: oneIdentityUserResponse.idp,
      });
    });
  });

  it('fires SEND_AUTH_SUCCESS with source undefined when no AAR or retrievalId', async () => {
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, oneIdentityUserResponse);

    await act(async () => {
      render(<Guard />, { route: '/#code=valid_code&state=some_state' });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_AUTH_SUCCESS, {
        source: undefined,
      });
    });
  });

  it('fires SEND_AUTH_SUCCESS with AAR after successful One Identity token exchange', async () => {
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, oneIdentityAarUserResponse);

    await act(async () => {
      render(<Guard />, { route: '/#code=valid_code&state=some_state' });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_AUTH_SUCCESS, {
        source: AppRouteParams.AAR,
      });
    });
  });

  it('fires SEND_AUTH_SUCCESS with Retrieval ID after successful One Identity token exchange', async () => {
    mock.onPost(ONE_IDENTITY_TOKEN_EXCHANGE()).reply(200, oneIdentityRetriavlIdUserResponse);

    await act(async () => {
      render(<Guard />, { route: '/#code=valid_code&state=some_state' });
    });

    await waitFor(() => {
      expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_AUTH_SUCCESS, {
        source: AppRouteParams.RETRIEVAL_ID,
      });
    });
  });
});
