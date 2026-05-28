import MockAdapter from 'axios-mock-adapter';
import { Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';

import { oneIdentityUserResponse } from '../../../__mocks__/Auth.mock';
import { PFTriggerEventSpy, act, render, waitFor } from '../../../__test__/test-utils';
import { authClient } from '../../../api/apiClients';
import { ONE_IDENTITY_TOKEN_EXCHANGE } from '../../../api/auth/auth.routes';
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
  let triggerEventSpy: PFTriggerEventSpy;
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
});
