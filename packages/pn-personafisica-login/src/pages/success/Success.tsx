import { useCallback, useEffect, useMemo } from 'react';

import { AppRouteParams, AppRouteType, sanitizeString } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../../services/configuration.service';
import { storageAarOps, storageTypeOps } from '../../utility/storage';

const SuccessPage = () => {
  const { PF_URL } = getConfiguration();

  const typeUrl = useMemo(() => AppRouteType.PF, []);
  const aar = useMemo(() => storageAarOps.read(), []);
  const token = useMemo(() => window.location.hash, []);

  const calcRedirectUrl = useCallback(
    (type: AppRouteType): string => {
      // eslint-disable-next-line functional/no-let
      let redirectUrl = PF_URL ?? '';
      // let redirectUrl = '';
      if (PF_URL && type === AppRouteType.PF) {
        storageTypeOps.delete();
        // eslint-disable-next-line functional/immutable-data
        redirectUrl = PF_URL;
      }

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

      return redirectUrl;
    },
    [aar, token]
  );

  useEffect(() => {
    calcRedirectUrl(typeUrl);
  }, [typeUrl]);

  return null;
};

export default SuccessPage;
