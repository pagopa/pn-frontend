import { vi } from 'vitest';

import { configureStore } from '@reduxjs/toolkit';

import { oneIdentityUserResponse, userResponse } from '../../../__mocks__/Auth.mock';
import { PFTriggerEventSpy } from '../../../__test__/test-utils';
import { PFEventsType } from '../../../models/PFEventsType';
import { AddressType, ChannelType } from '../../../models/contacts';
import { appReducers } from '../../../redux/store';
import PFEventStrategyFactory from '../../MixpanelUtils/PFEventStrategyFactory';
import { trackingMiddleware } from '../../mixpanel';

const store = configureStore({
  reducer: appReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(trackingMiddleware),
});

const dispatch = (type: string, payload?: unknown, params?: unknown) =>
  store.dispatch({ type, payload, meta: { arg: params } } as any);

describe('trackingMiddleware - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_AUTH_SUCCESS on exchangeToken/fulfilled', () => {
    dispatch('exchangeToken/fulfilled', userResponse, { spidToken: 'mocked-token' });
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_AUTH_SUCCESS,
      expect.objectContaining({
        payload: userResponse,
        params: { spidToken: 'mocked-token' },
      })
    );
  });

  it('fires SEND_AUTH_SUCCESS on exchangeOneIdentityCode/fulfilled', () => {
    dispatch('exchangeOneIdentityCode/fulfilled', oneIdentityUserResponse, {
      code: 'mock-code',
      state: 'mock-state',
    });
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_AUTH_SUCCESS,
      expect.objectContaining({
        payload: oneIdentityUserResponse,
        params: { code: 'mock-code', state: 'mock-state' },
      })
    );
  });

  it('fires SEND_DOWNLOAD_RESPONSE on getReceivedNotificationOtherDocument/fulfilled', () => {
    const downloadPayload = { url: 'mock-url', docType: 'mock-doctype' };
    dispatch('getReceivedNotificationOtherDocument/fulfilled', downloadPayload);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DOWNLOAD_RESPONSE,
      expect.objectContaining({
        payload: downloadPayload,
        params: undefined,
      })
    );
  });

  it('fires SEND_DOWNLOAD_RESPONSE on getReceivedNotificationLegalfact/fulfilled', () => {
    const downloadPayload = { url: 'mock-url', docType: 'mock-doctype' };
    dispatch('getReceivedNotificationLegalfact/fulfilled', downloadPayload);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DOWNLOAD_RESPONSE,
      expect.objectContaining({
        payload: downloadPayload,
        params: undefined,
      })
    );
  });

  it('fires SEND_HAS_ADDRESSES on getDigitalAddresses/fulfilled', () => {
    dispatch('getDigitalAddresses/fulfilled', []);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_HAS_ADDRESSES,
      expect.objectContaining({
        payload: [],
        params: undefined,
      })
    );
  });

  it('fires SEND_HAS_MANDATE_LOGIN on getSidemenuInformation/fulfilled', () => {
    dispatch('getSidemenuInformation/fulfilled', []);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_HAS_MANDATE_LOGIN,
      expect.objectContaining({
        payload: [],
        params: undefined,
      })
    );
  });

  it('fires SEND_MANDATE_GIVEN on getMandatesByDelegator/fulfilled', () => {
    dispatch('getMandatesByDelegator/fulfilled', []);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_MANDATE_GIVEN,
      expect.objectContaining({
        payload: [],
        params: undefined,
      })
    );
  });

  it('fires SEND_ENABLE_IO on enableIOAddress/fulfilled', () => {
    dispatch('enableIOAddress/fulfilled', {});
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ENABLE_IO,
      expect.objectContaining({
        payload: {},
        params: undefined,
      })
    );
  });

  it('fires SEND_DISABLE_IO on disableIOAddress/fulfilled', () => {
    dispatch('disableIOAddress/fulfilled');
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DISABLE_IO,
      expect.objectContaining({
        payload: undefined,
        params: undefined,
      })
    );
  });

  it('fires SEND_ACCEPT_DELEGATION on acceptMandate/fulfilled', () => {
    dispatch('acceptMandate/fulfilled', undefined, { id: 'mock-id', code: 'mock-code' });
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ACCEPT_DELEGATION,
      expect.objectContaining({
        payload: undefined,
        params: { id: 'mock-id', code: 'mock-code' },
      })
    );
  });

  it('fires SEND_ADD_ADDRESS on createOrUpdateAddress/fulfilled', () => {
    const addressParams = {
      addressType: AddressType.COURTESY,
      senderId: 'default',
      channelType: ChannelType.EMAIL,
      value: 'test@test.com',
    };
    dispatch('createOrUpdateAddress/fulfilled', undefined, addressParams);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_ADD_ADDRESS,
      expect.objectContaining({
        payload: undefined,
        params: addressParams,
      })
    );
  });

  it('fires SEND_DELETE_ADDRESS on deleteAddress/fulfilled', () => {
    const deleteParams = {
      addressType: AddressType.LEGAL,
      senderId: 'mock-sender',
      channelType: ChannelType.PEC,
    };
    dispatch('deleteAddress/fulfilled', undefined, deleteParams);
    expect(triggerEventSpy).toHaveBeenCalledWith(
      PFEventsType.SEND_DELETE_ADDRESS,
      expect.objectContaining({
        payload: undefined,
        params: deleteParams,
      })
    );
  });

  it('does not fire any event for unknown action types', () => {
    dispatch('someUnknownAction/fulfilled');
    expect(triggerEventSpy).not.toHaveBeenCalled();
  });
});
