import { PartyRole, PNRole, User } from '../types';

export const userResponse: User = {
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
    name: 'mocked-organizzation',
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
