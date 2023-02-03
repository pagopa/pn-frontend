import { useEffect, useState } from 'react';
import { useRewriteLinks } from '@pagopa-pn/pn-commons';

import { ONE_TRUST_PORTAL_CDN_TOS } from '../utils/constants';
import * as routes from '../navigation/routes.const';

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => void;
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
        setContentLoaded(true);
      });
    }
  }, []);
  useRewriteLinks(contentLoaded, routes.TERMS_OF_SERVICE, '.otnotice-content a');

  return (
    <>
      <div
        role="article"
        id="otnotice-b0da531e-8370-4373-8bd2-61ddc89e7fa6"
        className="otnotice"
      ></div>
    </>
  );
};

export default TermsOfServicePage;
