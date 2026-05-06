import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useSearchParams } from 'react-router-dom';

import { getLangCode, sanitizeString } from '@pagopa-pn/pn-commons';

import {
  ROUTE_ONE_IDENTITY_LOGIN_ERROR,
  oneIdentityRedirectUriPath,
} from '../../navigation/routes.const';
import { getConfiguration } from '../../services/configuration.service';
import {
  storageOneIdentityNonce,
  storageOneIdentityState,
  storageRapidAccessOps,
} from '../../utility/storage';

const OneIdentityCallback: React.FC = () => {
  const { PF_URL } = getConfiguration();

  const stateFromStorage = storageOneIdentityState.read();
  const nonceFromStorage = storageOneIdentityNonce.read();

  const [searchParams] = useSearchParams();
  const oneIdentityState = searchParams.get('state');
  const oneIdentityCode = searchParams.get('code');

  const rapidAccess = storageRapidAccessOps.read();
  const { i18n } = useTranslation();

  const isValid =
    oneIdentityCode &&
    oneIdentityState &&
    nonceFromStorage &&
    oneIdentityState === stateFromStorage;

  const calcRedirectUrl = () => {
    if (!isValid) {
      return;
    }

    const redirectUrl = PF_URL;

    // the findIndex check is needed to prevent xss attacks
    if (redirectUrl && [PF_URL].some((url) => url && redirectUrl.startsWith(url))) {
      const queryParams = new URLSearchParams();
      if (rapidAccess) {
        storageRapidAccessOps.delete();
        queryParams.set(rapidAccess[0], sanitizeString(rapidAccess[1]));
      }

      const hashParams = new URLSearchParams({
        code: oneIdentityCode,
        state: oneIdentityState,
        nonce: nonceFromStorage,
        redirect_uri: encodeURIComponent(`${PF_URL}${oneIdentityRedirectUriPath}`),
        lang: sanitizeString(getLangCode(i18n.language)),
      });

      const queryString = queryParams.size > 0 ? `?${queryParams.toString()}` : '';
      const hashString = hashParams.toString();

      const url = `${redirectUrl}${queryString}#${hashString}`;

      storageOneIdentityState.delete();
      storageOneIdentityNonce.delete();

      window.location.replace(url);
    }
  };

  useEffect(() => {
    calcRedirectUrl();
  }, []);

  if (!isValid) {
    return <Navigate to={ROUTE_ONE_IDENTITY_LOGIN_ERROR} replace />;
  }

  return null;
};

export default OneIdentityCallback;
