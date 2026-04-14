import { PNRole, PartyRole, User } from '../models/User';

export const adminUser: User = {
  sessionToken: 'mocked-session-token',
  name: 'Mario',
  family_name: 'Rossi',
  fiscal_number: 'RSSMRA80A01H501U',
  email: 'info@agid.gov.it',
  from_aa: false,
  uid: 'a6c1350d-1d69-4209-8bf8-31de58c79d6f',
  aud: 'portale-pg.dev.pn.pagopa.it',
  level: 'L2',
  iat: 1646394256,
  exp: 1646397856,
  iss: 'https://spid-hub-test.dev.pn.pagopa.it',
  jti: 'mockedJTI004',
  desired_exp: 0,
  organization: {
    id: 'mocked-id',
    name: 'mocked-organization',
    roles: [
      {
        partyRole: PartyRole.MANAGER,
        role: PNRole.ADMIN,
      },
    ],
    fiscal_code: '12345678910',
  },
  hasGroup: false,
};

export const adminUserWithGroup: User = {
  ...adminUser,
  hasGroup: true,
};

export const operatorUser: User = {
  ...adminUser,
  organization: {
    ...adminUser.organization,
    roles: [
      {
        partyRole: PartyRole.OPERATOR,
        role: PNRole.OPERATOR,
      },
    ],
  },
};
