import { vi } from 'vitest';

import { PFLoginTriggerEventSpy, act, render } from '../../../../__test__/test-utils';
import { OneIdentityErrorCode } from '../../../../models/OneIdentity';
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
    await act(async () =>
      render(<OneIdentityLoginError />, { route: `/?error=${OneIdentityErrorCode.SERVER_ERROR}` })
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: OneIdentityErrorCode.SERVER_ERROR,
    });
  });

  it('fires SEND_LOGIN_FAILURE on mount when authorize fails', async () => {
    await act(async () =>
      render(<OneIdentityLoginError />, {
        route: `/?error=${OneIdentityErrorCode.AUTHORIZE_ERROR}`,
      })
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: OneIdentityErrorCode.AUTHORIZE_ERROR,
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
        route: `/?error=${OneIdentityErrorCode.ACCESS_DENIED}&error_description=21`,
      })
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: '21',
    });
  });

  it('fires SEND_LOGIN_FAILURE with the error code as reason when access_denied has no description', async () => {
    await act(async () =>
      render(<OneIdentityLoginError />, { route: `/?error=${OneIdentityErrorCode.ACCESS_DENIED}` })
    );
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: OneIdentityErrorCode.ACCESS_DENIED,
    });
  });

  it('fires SEND_LOGIN_FAILURE on mount when error param is missing', async () => {
    await act(async () => render(<OneIdentityLoginError />));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFLoginEventsType.SEND_LOGIN_FAILURE, {
      reason: null,
    });
  });
});
