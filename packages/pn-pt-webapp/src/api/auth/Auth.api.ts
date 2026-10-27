import { authClient } from '../apiClients';
import { AUTH_LOGOUT } from './auth.routes';

export const AuthApi = {
  logout: (token: string): Promise<void> =>
    authClient.post(AUTH_LOGOUT(), null, { headers: { Authorization: `Bearer ${token}` } }),
};
