import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getLangCode, sanitizeString } from '@pagopa-pn/pn-commons';

import { ROUTE_ONE_IDENTITY_LOGIN_ERROR } from '../../navigation/routes.const';
import { getConfiguration } from '../../services/configuration.service';

const OneIdentityCallback: React.FC = () => {
  const { i18n } = useTranslation();
  const { PF_URL } = getConfiguration();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const isValidCallback = !error && !!code && !!state;

  const redirectToErrorPage = () => {
    const params = new URLSearchParams();
    if (state) {
      params.set('state', state);
    }
    if (error) {
      params.set('error', error);
    }
    if (errorDescription) {
      params.set('error_description', errorDescription);
    }
    navigate(
      { pathname: ROUTE_ONE_IDENTITY_LOGIN_ERROR, search: params.toString() },
      { replace: true }
    );
  };

  const handleOidcCallback = () => {
    if (!isValidCallback) {
      redirectToErrorPage();
      return;
    }

    // the findIndex check is needed to prevent xss attacks
    if (PF_URL && [PF_URL].some((url) => url && PF_URL.startsWith(url))) {
      const url = new URL(PF_URL);

      // eslint-disable-next-line functional/immutable-data
      url.hash = new URLSearchParams({
        code,
        state,
        lang: sanitizeString(getLangCode(i18n.language)),
      }).toString();

      window.location.replace(url.toString());
    }
  };

  useEffect(() => {
    handleOidcCallback();
  }, []);

  return null;
};

export default OneIdentityCallback;
