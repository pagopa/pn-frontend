import { useEffect } from 'react';

import {
  ConsentType,
  compileOneTrustPath,
  getSessionLanguage,
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

const TermsOfServicePage: React.FC<{ type?: ConsentType }> = ({ type }) => {
  const configuration = getConfiguration();
  // eslint-disable-next-line functional/no-let
  let tos = configuration.ONE_TRUST_TOS;
  // eslint-disable-next-line functional/no-let
  let draft = configuration.ONE_TRUST_DRAFT_MODE;
  // eslint-disable-next-line functional/no-let
  let route = routes.TERMS_OF_SERVICE;
  const lang = getSessionLanguage();

  if (type === ConsentType.TOS_SERCQ) {
    tos = configuration.ONE_TRUST_TOS_SERCQ_SEND;
    draft = configuration.ONE_TRUST_SERCQ_SEND_DRAFT_MODE;
    route = routes.TERMS_OF_SERVICE_SERCQ_SEND;
  }

  useEffect(() => {
    if (tos) {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices([compileOneTrustPath(tos, draft)], false);

        void waitForElement('.otnotice-content').then(() => {
          rewriteLinks(route, '.otnotice-content a');
        });
      });
    }
  }, [lang]);

  return (
    <>
      <div role="article" id={`otnotice-${tos}`} className="otnotice"></div>
    </>
  );
};

export default TermsOfServicePage;
