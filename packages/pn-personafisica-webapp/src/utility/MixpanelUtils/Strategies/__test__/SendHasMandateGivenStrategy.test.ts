import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { mandatesByDelegate } from '../../../../__mocks__/Delegations.mock';
import { SendHasMandateGivenStrategy } from '../SendHasMandateGivensStrategy';

describe('Mixpanel - Has Mandate Given Strategy', () => {
  it('should return has mandate given event', () => {
    const strategy = new SendHasMandateGivenStrategy();

    const mandateGiven = strategy.performComputations({ payload: mandatesByDelegate });
    expect(mandateGiven).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_MANDATE_GIVEN: 'yes',
      },
    });
  });

  it('should return no if there are no active mandates', () => {
    const strategy = new SendHasMandateGivenStrategy();

    const mandateGiven = strategy.performComputations({ payload: [] });
    expect(mandateGiven).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_MANDATE_GIVEN: 'no',
      },
    });
  });
});
