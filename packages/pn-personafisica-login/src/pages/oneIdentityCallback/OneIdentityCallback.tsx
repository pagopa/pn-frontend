import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AppRouteParams, getLangCode, sanitizeString } from '@pagopa-pn/pn-commons';

import { OneIdentityApi } from '../../api/OneIdentity/OneIdentity.api';
import { PFLoginEventsType } from '../../models/PFLoginEventsType';
import { ROUTE_ONE_IDENTITY_LOGIN_ERROR } from '../../navigation/routes.const';
import { getConfiguration } from '../../services/configuration.service';
import PFLoginEventStrategyFactory from '../../utility/MixpanelUtils/PFLoginEventStrategyFactory';

const OneIdentityCallback: React.FC = () => {
  const { i18n } = useTranslation();
  const { PF_URL } = getConfiguration();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const isValidCallback = !error && !!code && !!state;

  const redirectToErrorPage = () => {
    const params = new URLSearchParams();
    if (state) {
      params.set('state', state);
    }
    if (error) {
      params.set('error', error);
    }
    navigate(
      { pathname: ROUTE_ONE_IDENTITY_LOGIN_ERROR, search: params.toString() },
      { replace: true }
    );
  };

  async function handleOidcCallback() {
    if (!isValidCallback) {
      redirectToErrorPage();
      return;
    }

    const { nonce, aar, retrievalId, idp } = await OneIdentityApi.getOidcStateData(state);

    PFLoginEventStrategyFactory.triggerEvent(PFLoginEventsType.SEND_LOGIN_METHOD, {
      entityID: idp,
    });

    // the findIndex check is needed to prevent xss attacks
    if (PF_URL && [PF_URL].some((url) => url && PF_URL.startsWith(url))) {
      const url = new URL(PF_URL);

      if (aar) {
        url.searchParams.set(AppRouteParams.AAR, sanitizeString(aar));
      } else if (retrievalId) {
        url.searchParams.set(AppRouteParams.RETRIEVAL_ID, sanitizeString(retrievalId));
      }

      // eslint-disable-next-line functional/immutable-data
      url.hash = new URLSearchParams({
        code,
        state,
        nonce,
        lang: sanitizeString(getLangCode(i18n.language)),
      }).toString();

      window.location.replace(url.toString());
    }
  }

  useEffect(() => {
    handleOidcCallback().catch(redirectToErrorPage);
  }, []);

  return null;
};

export default OneIdentityCallback;
