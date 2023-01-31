import { useEffect, useState } from 'react';
import { useDocumentationUnauthorized } from '@pagopa-pn/pn-commons';

import { ONE_TRUST_PORTAL_CDN_TOS } from '../utils/constants';
import * as routes from '../navigation/routes.const';

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => {
        finally: (cbk: () => void) => void;
      };
    };
    LoadNotices: (noticesUrls: Array<string>, flag: boolean) => void;
  };
};

const TermsOfServicePage = () => {
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    if (ONE_TRUST_PORTAL_CDN_TOS) {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices([ONE_TRUST_PORTAL_CDN_TOS], false);
      }).finally(() => {
        setContentLoaded(true);
      });
    }
  }, []);
  useDocumentationUnauthorized(contentLoaded, routes.TERMS_OF_SERVICE);

  return (
    <>
      <div
        role="article"
        id="otnotice-083fb982-149c-4241-be09-12ae67d88b66"
        className="otnotice"
      ></div>
    </>
  );
};

export default TermsOfServicePage;
