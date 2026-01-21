import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { getLangCode, sanitizeString } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../../services/configuration.service';
import {
  storageOneIdentityNonce,
  storageOneIdentityState,
  storageRapidAccessOps,
} from '../../utility/storage';
import LoginError from '../loginError/LoginError';

const OneIdentityCallback: React.FC = () => {
  const { PF_URL } = getConfiguration();

  const stateFromStorage = storageOneIdentityState.read();
  const nonceFromStorage = storageOneIdentityNonce.read();

  const [searchParams] = useSearchParams();
  const oneIdentityState = searchParams.get('state');
  const oneIdentityCode = searchParams.get('code');

  const redirect_uri = `${PF_URL}/auth/callback`;

  const rapidAccess = useMemo(() => storageRapidAccessOps.read(), []);
  const { i18n } = useTranslation();

  const isValid =
    oneIdentityCode &&
    oneIdentityState &&
    nonceFromStorage &&
    oneIdentityState === stateFromStorage;

  const calcRedirectUrl = useCallback(() => {
    if (!isValid) {
      return;
    }

    const redirectUrl = PF_URL;

    // the findIndex check is needed to prevent xss attacks
    if (redirectUrl && [PF_URL].findIndex((url) => url && redirectUrl.startsWith(url)) > -1) {
      const queryParams = new URLSearchParams();
      if (rapidAccess) {
        storageRapidAccessOps.delete();
        queryParams.set(rapidAccess[0], sanitizeString(rapidAccess[1]));
      }

      const hashParams = new URLSearchParams({
        code: oneIdentityCode,
        state: oneIdentityState,
        nonce: nonceFromStorage,
        redirect_uri: encodeURIComponent(redirect_uri),
        lang: sanitizeString(getLangCode(i18n.language)),
      });

      const queryString = queryParams ? `?${queryParams.toString()}` : '';
      const hashString = hashParams.toString();

      const url = `${redirectUrl}${queryString}#${hashString}`;

      storageOneIdentityState.delete();
      storageOneIdentityNonce.delete();

      window.location.replace(url);
    }
  }, [
    rapidAccess,
    oneIdentityCode,
    oneIdentityState,
    nonceFromStorage,
    isValid,
    i18n.language,
    PF_URL,
    redirect_uri,
  ]);

  useEffect(() => {
    calcRedirectUrl();
  }, [calcRedirectUrl]);

  if (!isValid) {
    return <LoginError />;
  }

  return null;
};

export default OneIdentityCallback;
