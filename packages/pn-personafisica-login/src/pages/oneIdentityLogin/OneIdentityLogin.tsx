import React from 'react';

import { useRapidAccessParam } from '../../hooks/useRapidAccessParam';
import { getConfiguration } from '../../services/configuration.service';
import {
  storageOneIdentityNonce,
  storageOneIdentityState,
  storageRapidAccessOps,
} from '../../utility/storage';
import { generateRandomUniqueString } from '../../utility/utils';

const OneIdentityLogin: React.FC = () => {
  const { ONE_IDENTITY_CLIENT_ID: clientId, ONE_IDENTITY_BASE_URL, PF_URL } = getConfiguration();
  const rapidAccess = useRapidAccessParam();

  const state = generateRandomUniqueString();
  const nonce = generateRandomUniqueString();
  const encodedRedirectUri = encodeURIComponent(`${PF_URL}/auth/callback`);

  const oidcUrl = `${ONE_IDENTITY_BASE_URL}/login?response_type=CODE&scope=openid&client_id=${clientId}&state=${state}&nonce=${nonce}&redirect_uri=${encodedRedirectUri}`;

  if (rapidAccess) {
    storageRapidAccessOps.write(rapidAccess);
  }

  storageOneIdentityState.write(state);
  storageOneIdentityNonce.write(nonce);

  window.location.assign(oidcUrl);

  return <></>;
};

export default OneIdentityLogin;
