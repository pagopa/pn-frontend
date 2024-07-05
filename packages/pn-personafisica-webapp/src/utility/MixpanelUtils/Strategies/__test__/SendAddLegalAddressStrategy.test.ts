import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { digitalLegalAddresses } from '../../../../__mocks__/Contacts.mock';
import { SendAddLegalAddressStrategy } from '../SendAddLegalAddressStrategy';

describe('Mixpanel - Add Legal Address Strategy', () => {
  it('should return empty object if payload is empty', () => {
    const strategy = new SendAddLegalAddressStrategy();
    const event = strategy.performComputations({
      payload: undefined,
    });

    expect(event).toEqual({});
  });

  it('should return has pec when adding a PEC address', () => {
    const strategy = new SendAddLegalAddressStrategy();
    const address = digitalLegalAddresses[0];

    const event = strategy.performComputations({
      payload: address,
    });

    expect(event).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_HAS_PEC: 'yes',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_PEC: 'yes',
      },
    });
  });
});
