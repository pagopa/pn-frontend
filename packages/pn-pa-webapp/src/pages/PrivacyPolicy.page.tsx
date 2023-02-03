import { useRewriteLinks } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';
import { ONE_TRUST_PORTAL_CDN_PP } from '../utils/constants';
import * as routes from '../navigation/routes.const';

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => void;
    };
    LoadNotices: (noticesUrls: Array<string>, flag: boolean) => void;
  };
};

const PrivacyPolicyPage = () => {
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    if (ONE_TRUST_PORTAL_CDN_PP) {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices([ONE_TRUST_PORTAL_CDN_PP], false);
        setContentLoaded(true);
      });
    }
  }, []);

  useRewriteLinks(contentLoaded, routes.PRIVACY_POLICY, '.otnotice-content a');

  return (
    <>
      <div
        role="article"
        id="otnotice-4824a110-316e-42fd-b492-8e2b0513db70"
        className="otnotice"
      ></div>
    </>
  );
};

export default PrivacyPolicyPage;
