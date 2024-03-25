import { EventAction, EventCategory } from '@pagopa-pn/pn-commons';

import { arrayOfDelegates, arrayOfDelegators } from '../../../../__mocks__/Delegations.mock';
import { DelegationStatus } from '../../../status.utility';
import { SendYourMandatesStrategy } from '../SendYourMandatesStrategy';

describe('Mixpanel - Send Your Mandates Strategy', () => {
  it('should return your mandates event', () => {
    const strategy = new SendYourMandatesStrategy();

    const delegates = arrayOfDelegates;
    const delegators = arrayOfDelegators;

    const yourMandatesEvents = strategy.performComputations({ delegates, delegators });
    expect(yourMandatesEvents).toEqual({
      event_category: EventCategory.UX,
      event_type: EventAction.SCREEN_VIEW,
      total_mandates_given_count: delegates.length,
      pending_mandates_given_count: delegates.filter((d) => d.status === DelegationStatus.PENDING)
        .length,
      active_mandates_given_count: delegates.filter((d) => d.status === DelegationStatus.ACTIVE)
        .length,
      total_mandates_received_count: delegators.length,
      pending_mandates_received_count: delegators.filter(
        (d) => d.status === DelegationStatus.PENDING
      ).length,
      active_mandates_received_count: delegators.filter((d) => d.status === DelegationStatus.ACTIVE)
        .length,
    });
  });
});
