import { compileOneTrustPath, useRewriteLinks } from '@pagopa-pn/pn-commons';
import { useEffect, useState } from 'react';

import * as routes from '../navigation/routes.const';
import { getConfiguration } from "../services/configuration.service";

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => void;
    };
    LoadNotices: (noticesUrls: Array<string>, flag: boolean) => void;
  };
};

const PrivacyPolicyPage = () => {
  const { ONE_TRUST_DRAFT_MODE, ONE_TRUST_PP } = getConfiguration();
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

  useRewriteLinks(contentLoaded, routes.PRIVACY_POLICY, '.otnotice-content a');

  return (
    <>
      <div
        role="article"
        id="otnotice-9d7b7236-956b-4669-8943-5284fba6a815"
        className="otnotice"
      ></div>
    </>
  );
};

export default PrivacyPolicyPage;
