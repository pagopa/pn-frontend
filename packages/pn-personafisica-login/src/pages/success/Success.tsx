import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { getLangCode, sanitizeString } from '@pagopa-pn/pn-commons';

import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { getConfiguration } from '../../services/configuration.service';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';
import { storageRapidAccessOps } from '../../utility/storage';

const SuccessPage = () => {
  const { PF_URL } = getConfiguration();
  const { i18n } = useTranslation();

  const rapidAccess = useMemo(() => storageRapidAccessOps.read(), []);
  const token = useMemo(() => window.location.hash, []);

  const calcRedirectUrl = useCallback(() => {
    // eslint-disable-next-line functional/no-let
    let redirectUrl = PF_URL ?? '';

    // the includes check is needed to prevent xss attacks
    if (redirectUrl && [PF_URL].includes(redirectUrl) && rapidAccess) {
      storageRapidAccessOps.delete();
      const queryString = new URLSearchParams();
      queryString.append(rapidAccess.param, sanitizeString(rapidAccess.value));
      if (rapidAccess.origin) {
        queryString.append('origin', sanitizeString(rapidAccess.origin));
      }
      // eslint-disable-next-line functional/immutable-data
      redirectUrl += `?${queryString.toString()}`;
    }

    // the findIndex check is needed to prevent xss attacks
    if (redirectUrl && [PF_URL].findIndex((url) => url && redirectUrl.startsWith(url)) > -1) {
      window.location.replace(
        `${redirectUrl}${sanitizeString(token)}&lang=${sanitizeString(getLangCode(i18n.language))}`
      );
    }
  }, [rapidAccess, token, i18n.language]);

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
