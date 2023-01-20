import { useEffect } from "react";

import { ONE_TRUST_PORTAL_CDN_TOS } from "../utils/constants";

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => void;
    };
    LoadNotices: (noticesUrls: Array<string>, flag: boolean) => void;
  };
};

const TermsOfServicePage = () => {
  useEffect(() => {
    if (ONE_TRUST_PORTAL_CDN_TOS) {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices([ONE_TRUST_PORTAL_CDN_TOS], false);
      });
    }
  }, []);

  return (
    <>
      <div role="article" id="otnotice-083fb982-149c-4241-be09-12ae67d88b66" className="otnotice"></div>
    </>
  );
};

export default TermsOfServicePage;