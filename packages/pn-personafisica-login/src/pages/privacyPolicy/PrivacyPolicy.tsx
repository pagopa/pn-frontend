import { useEffect, useState } from 'react';
import { useRewriteLinks, compileOneTrustPath } from '@pagopa-pn/pn-commons';

import {
  ONE_TRUST_DRAFT_MODE,
  ONE_TRUST_PP,
  ROUTE_PRIVACY_POLICY,
} from '../../utils/constants';

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => void;
    };
    LoadNotices: (noticesUrls: Array<string>, flag: boolean) => void;
  };
};

const PrivacyPolicy = () => {
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    if (ONE_TRUST_PP) {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices(
          [
            compileOneTrustPath(
              ONE_TRUST_PP,
              ONE_TRUST_DRAFT_MODE
            ),
          ],
          false
        );
        setContentLoaded(true);
      });
    }
  }, []);

  useRewriteLinks(contentLoaded, ROUTE_PRIVACY_POLICY, '.otnotice-content a');

  return (
    <>
      <div
        id="otnotice-133242e7-ad9a-45e5-a417-b7a50c746899"
        role="article"
        className="otnotice"
      ></div>
    </>
  );
};

export default PrivacyPolicy;
