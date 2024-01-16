import { useEffect, useMemo } from 'react';

import { compileOneTrustPath, rewriteLinks, waitForElement } from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';
import { getConfiguration } from '../services/configuration.service';

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => void;
    };
    LoadNotices: (noticesUrls: Array<string>, flag: boolean) => void;
  };
};

const PrivacyPolicyPage = () => {
  const configuration = useMemo(() => getConfiguration(), []);

  const { ONE_TRUST_PP, ONE_TRUST_DRAFT_MODE } = configuration;

  useEffect(() => {
    if (ONE_TRUST_PP) {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices(
          [compileOneTrustPath(ONE_TRUST_PP, ONE_TRUST_DRAFT_MODE)],
          false
        );
      });

      void waitForElement('.otnotice-content').then(() => {
        rewriteLinks(routes.PRIVACY_POLICY, '.otnotice-content a');
      });
    }
  }, []);

  return (
    <>
      <div
        role="article"
        id="otnotice-365c84c5-9329-4ec5-89f5-e53572eda132"
        className="otnotice"
      ></div>
    </>
  );
};

export default PrivacyPolicyPage;
