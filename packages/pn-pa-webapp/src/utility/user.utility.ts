import * as yup from 'yup';

import { basicUserDataMatcherContents, dataRegex } from '@pagopa-pn/pn-commons';

import { Organization, PNRole, PartyRole, Role } from '../models/user';

const roleMatcher: yup.SchemaOf<Role> = yup.object({
  role: yup.mixed<PNRole>().required(),
  partyRole: yup.mixed<PartyRole>().required(),
});

const organizationMatcher: yup.SchemaOf<Organization> = yup.object({
  id: yup.string().required(),
  roles: yup.array().of(roleMatcher).required(),
  fiscal_code: yup.string().matches(dataRegex.pIva).required(),
  groups: yup.array().of(yup.string()).notRequired(),
  name: yup.string().required(),
  hasGroups: yup.boolean(),
  aooParent: yup.string().notRequired(),
  subUnitCode: yup.string().notRequired(),
  subUnitType: yup.string().notRequired(),
  rootParent: yup
    .object({
      id: yup.string().notRequired(),
      description: yup.string().notRequired(),
    })
    .notRequired(),
  ipaCode: yup.string().notRequired(),
});

const isSupportOrganization = (organization: Organization) =>
  organization?.roles?.some((r) => r.role === PNRole.SUPPORT) ?? false;

export const userDataMatcher = yup
  .object({
    ...basicUserDataMatcherContents,
    family_name: yup.string().when('organization', {
      is: isSupportOrganization,
      then: yup.string().notRequired(),
      otherwise: yup.string().matches(dataRegex.name),
    }),
    fiscal_number: yup.string().when('organization', {
      is: isSupportOrganization,
      then: yup.string().notRequired(),
      otherwise: yup.string().matches(dataRegex.fiscalCode),
    }),
    name: yup.string().when('organization', {
      is: isSupportOrganization,
      then: yup.string().notRequired(),
      otherwise: yup.string().matches(dataRegex.name),
    }),
    organization: organizationMatcher,
    desired_exp: yup.number(),
  })
  .noUnknown(true);
