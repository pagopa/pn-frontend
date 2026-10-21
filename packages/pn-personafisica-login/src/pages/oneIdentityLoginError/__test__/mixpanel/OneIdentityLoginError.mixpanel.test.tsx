import { vi } from 'vitest';

import { PFLoginTriggerEventSpy, act, render } from '../../../../__test__/test-utils';
import { PFLoginEventsType } from '../../../../models/PFLoginEventsType';
import PFLoginEventStrategyFactory from '../../../../utility/MixpanelUtils/PFLoginEventStrategyFactory';
import OneIdentityLoginError from '../../OneIdentityLoginError';

describe('One Identity Login Error page - Mixpanel events', () => {
  let triggerEventSpy: PFLoginTriggerEventSpy;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFLoginEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_LOGIN_FAILURE on mount with a known error code', async () => {
    await act(async () => render(<OneIdentityLoginError />, { route: '/?error=server_error' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: 'server_error',
    });
  });

  it('fires SEND_LOGIN_FAILURE on mount with an unknown error code', async () => {
    await act(async () => render(<OneIdentityLoginError />, { route: '/?error=random_error' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: 'random_error',
    });
  });

  it('fires SEND_LOGIN_FAILURE with the error description as reason when error is access_denied', async () => {
    await act(async () =>
      render(<OneIdentityLoginError />, {
        route: '/?error=access_denied&error_description=21',
      })
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: '21',
    });
  });

  it('fires SEND_LOGIN_FAILURE with the error code as reason when access_denied has no description', async () => {
    await act(async () => render(<OneIdentityLoginError />, { route: '/?error=access_denied' }));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: 'access_denied',
    });
  });

  it('fires SEND_LOGIN_FAILURE on mount when error param is missing', async () => {
    await act(async () => render(<OneIdentityLoginError />));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: null,
    });
  });
});
