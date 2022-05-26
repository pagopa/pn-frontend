import { PartyRole } from '../../../models/user';
import { User } from '../types';

export const userResponse: User = {
  sessionToken: 'mocked-session-token',
  name: 'Mario',
  family_name: 'Rossi',
  fiscal_number: 'RSSMRA80A01H501U',
  email: 'mocked-email',
  uid: 'mocked-uid',
  organization: {
    id: 'mocked-id',
    roles: [
      {
        partyRole: PartyRole.MANAGER,
        role: '',
      },
    ],
    fiscal_code: 'mocked-organization-fiscal-code',
  },
};
