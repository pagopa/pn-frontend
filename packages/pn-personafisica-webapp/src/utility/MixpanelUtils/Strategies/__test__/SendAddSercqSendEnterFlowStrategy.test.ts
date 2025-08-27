import { EventAction, EventCategory, EventPropertyType } from '@pagopa-pn/pn-commons';

import { ContactSource } from '../../../../models/contacts';
import { SendAddSercqSendEnterFlowStrategy } from '../SendAddSercqSendEnterFlowStrategy';

describe('Mixpanel - SERCQ SEND Enter Flow Strategy', () => {
  it('should return SERCQ SEND enter flow event', () => {
    const strategy = new SendAddSercqSendEnterFlowStrategy();
    const source = ContactSource.DETTAGLIO_NOTIFICA;

    const sercqEnterFlowStrategy = strategy.performComputations({ source });
    expect(sercqEnterFlowStrategy).toEqual({
      [EventPropertyType.TRACK]: {
        event_category: EventCategory.UX,
        event_type: EventAction.ACTION,
        other_contact: 'no',
        source,
      },
    });
  });
});
