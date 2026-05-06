import { vi } from 'vitest';

import { AddressType, ChannelType } from '../../models/contacts';
import { store } from '../../redux/store';
import { getOnboardingAvailableFlows } from '../mixpanel';

describe('getOnboardingAvailableFlows', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return digital_domicile,courtesy,io when there are no courtesy contacts', () => {
    const baseState = store.getState();

    vi.spyOn(store, 'getState').mockReturnValue({
      ...baseState,
      contactsState: {
        ...baseState.contactsState,
        digitalAddresses: [],
      },
    });

    expect(getOnboardingAvailableFlows()).toBe('digital_domicile,courtesy,io');
  });

  it('should return digital_domicile,courtesy when there is at least one courtesy contact', () => {
    const baseState = store.getState();

    vi.spyOn(store, 'getState').mockReturnValue({
      ...baseState,
      contactsState: {
        ...baseState.contactsState,
        digitalAddresses: [
          {
            addressType: AddressType.COURTESY,
            channelType: ChannelType.EMAIL,
            senderId: 'default',
            value: 'test@mail.com',
          },
        ],
      },
    });

    expect(getOnboardingAvailableFlows()).toBe('digital_domicile,courtesy');
  });

  it('should return digital_domicile,courtesy,io when IO is DISABLED', () => {
    const baseState = store.getState();

    vi.spyOn(store, 'getState').mockReturnValue({
      ...baseState,
      contactsState: {
        ...baseState.contactsState,
        digitalAddresses: [
          {
            addressType: AddressType.COURTESY,
            channelType: ChannelType.IOMSG,
            senderId: 'default',
            value: 'DISABLED',
          },
        ],
      },
    });

    expect(getOnboardingAvailableFlows()).toBe('digital_domicile,courtesy,io');
  });
});
