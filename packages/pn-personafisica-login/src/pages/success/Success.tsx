import { useCallback, useEffect, useMemo } from 'react';

import { AppRouteParams, sanitizeString } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../../services/configuration.service';
import { storageAarOps } from '../../utility/storage';

const SuccessPage = () => {
  const { PF_URL } = getConfiguration();

  const aar = useMemo(() => storageAarOps.read(), []);
  const token = useMemo(() => window.location.hash, []);

  const calcRedirectUrl = useCallback(() => {
    // eslint-disable-next-line functional/no-let
    let redirectUrl = PF_URL ?? '';

    // the includes check is needed to prevent xss attacks
    if (redirectUrl && [PF_URL].includes(redirectUrl) && aar) {
      storageAarOps.delete();
      // eslint-disable-next-line functional/immutable-data
      redirectUrl += `?${AppRouteParams.AAR}=${sanitizeString(aar)}`;
    }

    // the findIndex check is needed to prevent xss attacks
    if (redirectUrl && [PF_URL].findIndex((url) => url && redirectUrl.startsWith(url)) > -1) {
      window.location.replace(`${redirectUrl}${sanitizeString(token)}`);
    }
  }, [aar, token]);

  useEffect(() => {
    calcRedirectUrl();
  }, []);

  return null;
};

export default SuccessPage;
