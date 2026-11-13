import { InstitutionType } from '@pagopa-pn/pn-commons';

import { PNRole, PartyRole, User } from '../models/user';

function calcExpirationDate() {
  const now = new Date();
  // add 1 hour
  return now.setTime(now.getTime() + 60 * 60 * 1000);
}

export const userResponse: User = {
  sessionToken: 'mocked-session-token',
  name: 'Utente',
  family_name: 'Test Undici',
  fiscal_number: 'TSTUTN00A11A001P',
  email: 'utente.undici@mock.it',
  uid: '00000000-0000-0000-0000-000000000000',
  organization: {
    id: '5b994d4a-0fa8-47ac-9c7b-354f1d44a1ce',
    name: 'Partner Tecnologico S.p.A.',
    roles: [
      {
        partyRole: PartyRole.MANAGER,
        role: PNRole.ADMIN,
      },
    ],
    fiscal_code: '12345678901',
    hasGroups: false,
    institutionType: InstitutionType.PT,
  },
  desired_exp: calcExpirationDate(),
};

export const operatorUserResponse: User = {
  ...userResponse,
  organization: {
    ...userResponse.organization,
    roles: [
      {
        partyRole: PartyRole.OPERATOR,
        role: PNRole.OPERATOR,
      },
    ],
  },
};
