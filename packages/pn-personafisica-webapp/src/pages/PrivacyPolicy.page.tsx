import { useEffect } from "react";
import { ONE_TRUST_PORTAL_CDN } from "../utils/constants";

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => void;
    };
    LoadNotices: (noticesUrls: Array<string>, flag: boolean) => void;
  };
};

const PrivacyPolicyPage = () => {
  useEffect(() => {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices([ONE_TRUST_PORTAL_CDN], false);
      });
  }, []);

  return (
    <>
        <div role="article" id="otnotice-365c84c5-9329-4ec5-89f5-e53572eda132" className="otnotice"></div>
    </>
  );
};

export default PrivacyPolicyPage;