import { MockInstance, vi } from 'vitest';

import { configureStore } from '@reduxjs/toolkit';

import { PFEventsType } from '../../../models/PFEventsType';
import { appReducers } from '../../../redux/store';
import PFEventStrategyFactory from '../../MixpanelUtils/PFEventStrategyFactory';
import { trackingMiddleware } from '../../mixpanel';

const store = configureStore({
  reducer: appReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(trackingMiddleware),
});

const dispatch = (type: string, payload: unknown = {}) =>
  store.dispatch({ type, payload, meta: { arg: {} } } as any);

describe('trackingMiddleware - Mixpanel events', () => {
  let triggerEventSpy: MockInstance<[PFEventsType, unknown?], void>;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_AUTH_SUCCESS on exchangeToken/fulfilled', () => {
    dispatch('exchangeToken/fulfilled', { sessionToken: 'mock-token' });
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_AUTH_SUCCESS,
      expect.any(Object)
    );
  });

  it('fires SEND_DOWNLOAD_RESPONSE on getReceivedNotificationOtherDocument/fulfilled', () => {
    dispatch('getReceivedNotificationOtherDocument/fulfilled');
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DOWNLOAD_RESPONSE,
      expect.any(Object)
    );
  });

  it('fires SEND_DOWNLOAD_RESPONSE on getReceivedNotificationLegalfact/fulfilled', () => {
    dispatch('getReceivedNotificationLegalfact/fulfilled');
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DOWNLOAD_RESPONSE,
      expect.any(Object)
    );
  });

  it('fires SEND_HAS_ADDRESSES on getDigitalAddresses/fulfilled', () => {
    dispatch('getDigitalAddresses/fulfilled', []);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_HAS_ADDRESSES,
      expect.any(Object)
    );
  });

  it('fires SEND_HAS_MANDATE_LOGIN on getSidemenuInformation/fulfilled', () => {
    dispatch('getSidemenuInformation/fulfilled', []);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_HAS_MANDATE_LOGIN,
      expect.any(Object)
    );
  });

  it('fires SEND_MANDATE_GIVEN on getMandatesByDelegator/fulfilled', () => {
    dispatch('getMandatesByDelegator/fulfilled', []);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_MANDATE_GIVEN,
      expect.any(Object)
    );
  });

  it('fires SEND_ENABLE_IO on enableIOAddress/fulfilled', () => {
    dispatch('enableIOAddress/fulfilled');
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ENABLE_IO,
      expect.any(Object)
    );
  });

  it('fires SEND_DISABLE_IO on disableIOAddress/fulfilled', () => {
    dispatch('disableIOAddress/fulfilled');
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DISABLE_IO,
      expect.any(Object)
    );
  });

  it('fires SEND_ACCEPT_DELEGATION on acceptMandate/fulfilled', () => {
    dispatch('acceptMandate/fulfilled');
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ACCEPT_DELEGATION,
      expect.any(Object)
    );
  });

  it('fires SEND_ADD_ADDRESS on createOrUpdateAddress/fulfilled', () => {
    dispatch('createOrUpdateAddress/fulfilled');
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_ADDRESS,
      expect.any(Object)
    );
  });

  it('fires SEND_DELETE_ADDRESS on deleteAddress/fulfilled', () => {
    dispatch('deleteAddress/fulfilled');
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DELETE_ADDRESS,
      expect.any(Object)
    );
  });

  it('does not fire any event for unknown action types', () => {
    dispatch('someUnknownAction/fulfilled');
    expect(triggerEventSpy).not.toHaveBeenCalled();
  });
});
