import { useEffect, useMemo, useState } from 'react';
import { compileOneTrustPath, useRewriteLinks } from '@pagopa-pn/pn-commons';

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

const TermsOfServicePage = () => {
  const [contentLoaded, setContentLoaded] = useState(false);

  const configuration = useMemo(() => getConfiguration(), []);

  const { ONE_TRUST_TOS, ONE_TRUST_DRAFT_MODE } = configuration;

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
        id="otnotice-083fb982-149c-4241-be09-12ae67d88b66"
        className="otnotice"
      ></div>
    </>
  );
};

export default TermsOfServicePage;
