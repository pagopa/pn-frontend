import { useEffect } from 'react';

import {
  ConsentType,
  compileOneTrustPath,
  rewriteLinks,
  waitForElement,
} from '@pagopa-pn/pn-commons';

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

const PrivacyPolicyPage: React.FC<{ type?: ConsentType }> = ({ type }) => {
  const configuration = getConfiguration();
  // eslint-disable-next-line functional/no-let
  let pp = configuration.ONE_TRUST_PP;
  // eslint-disable-next-line functional/no-let
  let draft = configuration.ONE_TRUST_DRAFT_MODE;
  // eslint-disable-next-line functional/no-let
  let route = routes.PRIVACY_POLICY;

  if (type === ConsentType.DATAPRIVACY_SERCQ) {
    pp = configuration.ONE_TRUST_PP_SERCQ_SEND;
    draft = configuration.ONE_TRUST_SERCQ_SEND_DRAFT_MODE;
    route = routes.PRIVACY_POLICY_SERCQ_SEND;
  }

  useEffect(() => {
    if (pp) {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices([compileOneTrustPath(pp, draft)], false);

        void waitForElement('.otnotice-content').then(() => {
          rewriteLinks(route, '.otnotice-content a');
        });
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
