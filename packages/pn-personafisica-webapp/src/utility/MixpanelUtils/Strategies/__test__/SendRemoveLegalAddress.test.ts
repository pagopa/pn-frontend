import { EventPropertyType } from '@pagopa-pn/pn-commons';

import { LegalChannelType } from '../../../../models/contacts';
import { DeleteDigitalAddressParams } from '../../../../redux/contact/types';
import { SendRemoveLegalAddressStrategy } from '../SendRemoveLegalAddress';

describe('Mixpanel - Remove Legal Address Strategy', () => {
  it('should return remove legal address event if senderId is default', () => {
    const strategy = new SendRemoveLegalAddressStrategy();

    const params: { payload: string; params: DeleteDigitalAddressParams } = {
      payload: 'OK',
      params: {
        senderId: 'default',
        recipientId: 'default',
        channelType: LegalChannelType.PEC,
      },
    };

    const event = strategy.performComputations(params);

    expect(event).toEqual({
      [EventPropertyType.PROFILE]: {
        SEND_HAS_PEC: 'no',
      },
      [EventPropertyType.SUPER_PROPERTY]: {
        SEND_HAS_PEC: 'no',
      },
    });
  });

  it('should return empty object if senderId is not default', () => {
    const strategy = new SendRemoveLegalAddressStrategy();

    const params: { payload: string; params: DeleteDigitalAddressParams } = {
      payload: 'OK',
      params: {
        senderId: 'not-default',
        recipientId: 'default',
        channelType: LegalChannelType.PEC,
      },
    };

    const event = strategy.performComputations(params);

    expect(event).toEqual({});
  });
});
