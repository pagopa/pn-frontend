import * as yup from 'yup';

import { InstitutionType, basicUserDataMatcherContents, dataRegex } from '@pagopa-pn/pn-commons';

import { Organization, PNRole, PartyRole, Role } from '../models/user';

const roleMatcher: yup.SchemaOf<Role> = yup.object({
  role: yup.mixed<PNRole>().oneOf(Object.values(PNRole)).required(),
  partyRole: yup.mixed<PartyRole>().required(),
});

const organizationMatcher: yup.SchemaOf<Organization> = yup.object({
  id: yup.string().required(),
  roles: yup.array().of(roleMatcher).required(),
  fiscal_code: yup.string().matches(dataRegex.pIva).required(),
  groups: yup.array().of(yup.string()).notRequired(),
  name: yup.string().required(),
  hasGroups: yup.boolean(),
  institutionType: yup.mixed<InstitutionType>().oneOf([InstitutionType.PT]).required(),
});

export const userDataMatcher = yup
  .object({
    ...basicUserDataMatcherContents,
    family_name: yup.string().matches(dataRegex.name),
    fiscal_number: yup.string().matches(dataRegex.fiscalCode),
    name: yup.string().matches(dataRegex.name),
    organization: organizationMatcher,
    desired_exp: yup.number(),
  })
  .noUnknown(true);
