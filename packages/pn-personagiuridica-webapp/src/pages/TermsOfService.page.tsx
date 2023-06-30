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

const TermsOfServicePage = () => {
  const { ONE_TRUST_DRAFT_MODE, ONE_TRUST_TOS } = getConfiguration();
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    if (ONE_TRUST_TOS) {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices(
          [
            compileOneTrustPath(
              ONE_TRUST_TOS,
              ONE_TRUST_DRAFT_MODE
            ),
          ],
          false
        );
        setContentLoaded(true);
      });
    }
  }, []);
  useRewriteLinks(contentLoaded, routes.TERMS_OF_SERVICE, '.otnotice-content a');

  return (
    <>
      <div
        role="article"
        id="otnotice-112fd95d-6e88-461b-b8fc-534ee4277e96"
        className="otnotice"
      ></div>
    </>
  );
};

export default TermsOfServicePage;
