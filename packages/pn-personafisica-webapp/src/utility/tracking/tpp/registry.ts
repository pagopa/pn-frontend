import { uxScreenView } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../../models/PFEventsType';

export const tppRegistry = {
  [PFEventsType.SEND_LANDING_PAGE]: {
    build: () => uxScreenView(),
  },
};
