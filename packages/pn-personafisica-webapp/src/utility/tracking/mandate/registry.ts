import { profile } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../../models/PFEventsType';

export const mandateRegistry = {
  [PFEventsType.SEND_ACCEPT_DELEGATION]: {
    build: () => profile({ SEND_HAS_MANDATE: 'yes' }),
  },
};
