/* eslint-disable functional/immutable-data */
import * as yup from 'yup';

import { basicUserDataMatcherContents, dataRegex } from '@pagopa-pn/pn-commons';

import { SourceChannel } from '../../models/User';

export const userDataMatcher = yup
  .object({
    ...basicUserDataMatcherContents,
    from_aa: yup.boolean(),
    level: yup.string().matches(dataRegex.lettersAndNumbers),
    iat: yup.number(),
    exp: yup.number(),
    aud: yup.string().matches(dataRegex.simpleServer),
    iss: yup.string().url(),
    jti: yup.string().matches(dataRegex.lettersNumbersAndDashs),
    source: yup
      .object({
        channel: yup.string().oneOf(Object.values(SourceChannel)), // UserSource.channel
        details: yup.string(),
        retrievalId: yup.string().matches(/^[ -~]{1,50}$/),
      })
      .optional(),
  })
  .noUnknown(true);
