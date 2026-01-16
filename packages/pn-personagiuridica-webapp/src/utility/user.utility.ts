import * as yup from 'yup';

import { basicUserDataMatcherContents, dataRegex } from '@pagopa-pn/pn-commons';

import { PNRole, PartyRole } from '../models/User';

const roleMatcher = yup.object({
  role: yup.string().oneOf(Object.values(PNRole)),
  partyRole: yup.string().oneOf(Object.values(PartyRole)),
});

const organizationMatcher = yup.object({
  id: yup.string(),
  roles: yup.array().of(roleMatcher),
  fiscal_code: yup.string().matches(dataRegex.pIvaAndFiscalCode),
  groups: yup.array().of(yup.string()),
  name: yup.string(),
});

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
    organization: organizationMatcher,
    desired_exp: yup.number(),
    hasGroup: yup.boolean(),
    source: yup
      .object({
        channel: yup.string().oneOf(['WEB']),
        details: yup.string(),
      })
      .optional(),
  })
  .noUnknown(true);
