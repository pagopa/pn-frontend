import { vi } from 'vitest';

import { digitalAddressesSercq } from '../../../../__mocks__/Contacts.mock';
import { PFTriggerEventSpy, fireEvent, render } from '../../../../__test__/test-utils';
import { PFEventsType } from '../../../../models/PFEventsType';
import { ChannelType, ContactSource } from '../../../../models/contacts';
import PFEventStrategyFactory from '../../../../utility/MixpanelUtils/PFEventStrategyFactory';
import NotificationsEmptyState from '../../NotificationsEmptyState';

const sercqSendDefault = digitalAddressesSercq.find(
  (addr) => addr.senderId === 'default' && addr.channelType === ChannelType.SERCQ_SEND
);

describe('NotificationsEmptyState component - Mixpanel events', () => {
  let triggerEventSpy: PFTriggerEventSpy;

  beforeEach(() => {
    triggerEventSpy = vi.spyOn(PFEventStrategyFactory, 'triggerEvent');
  });

  afterEach(() => {
    triggerEventSpy.mockRestore();
  });

  it('fires SEND_VIEW_CONTACT_DETAILS when go-to-contacts link is clicked', () => {
    const { getByTestId } = render(
      <NotificationsEmptyState filtersApplied={false} onCleanFilters={vi.fn()} />,
      { preloadedState: { contactsState: { digitalAddresses: [sercqSendDefault] } } }
    );
    fireEvent.click(getByTestId('link-route-contacts'));
    expect(triggerEventSpy).toHaveBeenCalledWith(PFEventsType.SEND_VIEW_CONTACT_DETAILS, {
      source: ContactSource.HOME_NOTIFICHE,
    });
  });
});
