import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useSearchParams } from 'react-router-dom';

import { AppRouteParams, getLangCode, sanitizeString } from '@pagopa-pn/pn-commons';

import { OneIdentityApi } from '../../api/OneIdentity/OneIdentity.api';
import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { ROUTE_ONE_IDENTITY_LOGIN_ERROR } from '../../navigation/routes.const';
import { getConfiguration } from '../../services/configuration.service';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';

const OneIdentityCallback: React.FC = () => {
  const { i18n } = useTranslation();
  const { PF_URL } = getConfiguration();

  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const isValidCallback = code && state;

  async function handleOidcCallback() {
    if (!isValidCallback) {
      return;
    }

    const { nonce, aar, retrievalId, idp } = await OneIdentityApi.getOidcStateData(state);

    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_LOGIN_METHOD, {
      entityID: idp,
    });

    // the findIndex check is needed to prevent xss attacks
    if (PF_URL && [PF_URL].some((url) => url && PF_URL.startsWith(url))) {
      const queryParams = new URLSearchParams();

      if (aar) {
        queryParams.set(AppRouteParams.AAR, sanitizeString(aar));
      } else if (retrievalId) {
        queryParams.set(AppRouteParams.RETRIEVAL_ID, sanitizeString(retrievalId));
      }

      const hashParams = new URLSearchParams({
        code,
        state,
        nonce,
        lang: sanitizeString(getLangCode(i18n.language)),
      });

      const queryString = queryParams.size > 0 ? `?${queryParams.toString()}` : '';
      const hashString = hashParams.toString();

      const url = `${PF_URL}${queryString}#${hashString}`;

      window.location.replace(url);
    }
  }

  useEffect(() => {
    void handleOidcCallback();
  }, []);

  if (!isValidCallback) {
    return <Navigate to={ROUTE_ONE_IDENTITY_LOGIN_ERROR} replace />;
  }

  return null;
};

export default OneIdentityCallback;
