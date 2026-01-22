/* eslint-disable functional/immutable-data */
import * as yup from 'yup';

import { basicUserDataMatcherContents, dataRegex } from '@pagopa-pn/pn-commons';

import { SourceChannel, User } from '../models/User';

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

/**
 * Parses a token exchange response and constructs a User object.
 * Extracts user information from the response and conditionally includes
 * the source property if present.
 *
 * @param response - The token exchange response object containing user data
 */
export const parseTokenExchangeResponse = (response: User): User => {
  const user: User = {
    sessionToken: response.sessionToken,
    email: response.email,
    name: response.name,
    family_name: response.family_name,
    uid: response.uid,
    fiscal_number: response.fiscal_number,
    from_aa: response.from_aa,
    aud: response.aud,
    level: response.level,
    iat: response.iat,
    exp: response.exp,
    iss: response.iss,
    jti: response.jti,
  };

  if (response.source) {
    user.source = response.source;
  }

  return user;
};
