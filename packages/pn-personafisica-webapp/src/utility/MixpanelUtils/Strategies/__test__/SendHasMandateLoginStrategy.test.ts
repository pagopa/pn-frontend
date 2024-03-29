import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { arrayOfDelegators } from '../../../../__mocks__/Delegations.mock';
import { SendHasMandateLoginStrategy } from '../SendHasMandateLoginStrategy';

describe('Mixpanel - Has Mandate Login Strategy', () => {
  it('should return has mandate login event', () => {
    const strategy = new SendHasMandateLoginStrategy();

    const mandateGiven = strategy.performComputations({ payload: arrayOfDelegators });
    expect(mandateGiven).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_HAS_MANDATE: 'yes',
      },
    });
  });

  it('should return no if there are no active mandates', () => {
    const strategy = new SendHasMandateLoginStrategy();

    const mandateGiven = strategy.performComputations({ payload: [] });
    expect(mandateGiven).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_HAS_MANDATE: 'no',
      },
    });
  });
});
