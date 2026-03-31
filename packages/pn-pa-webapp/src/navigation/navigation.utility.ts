import { getConfiguration } from '../services/configuration.service';
import {
  SELFCARE_LOGIN_PATH,
  SELFCARE_LOGOUT_GOOGLE_PATH,
  SELFCARE_LOGOUT_PATH,
} from './routes.const';

export function goToSelfcareLogin(): void {
  const { SELFCARE_BASE_URL } = getConfiguration();
  window.open(`${SELFCARE_BASE_URL}${SELFCARE_LOGIN_PATH}`, '_self');
}

export function goToSelfcareLogout(isSupportUser: boolean): void {
  const { SELFCARE_BASE_URL } = getConfiguration();
  const logoutPath = isSupportUser ? SELFCARE_LOGOUT_GOOGLE_PATH : SELFCARE_LOGOUT_PATH;
  window.open(`${SELFCARE_BASE_URL}${logoutPath}`, '_self');
}
