import { useCallback, useEffect, useMemo } from 'react';

import { AppRouteParams, getSessionLanguage, sanitizeString } from '@pagopa-pn/pn-commons';

import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { getConfiguration } from '../../services/configuration.service';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';
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
      window.location.replace(
        `${redirectUrl}${sanitizeString(token)}&lang=${sanitizeString(getSessionLanguage())}`
      );
    }
  }, [aar, token]);

  useEffect(() => {
    calcRedirectUrl();

    const IDP = sessionStorage.getItem('IDP');

    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_LOGIN_METHOD, {
      entityID: IDP,
    });

    sessionStorage.removeItem('IDP');
  }, []);

  return null;
};

export default SuccessPage;
