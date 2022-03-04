import { UserRole } from "../../../models/user";
import { User } from "../types";

export const userResponse: User = {
  sessionToken: 'mocked-session-token',
  name: 'Mario',
  family_name: 'Rossi',
  fiscal_number: 'RSSMRA80A01H501U',
  organization: {
    id: 'mocked-id',
    role: UserRole.REFERENTE_AMMINISTRATIVO,
  },
};