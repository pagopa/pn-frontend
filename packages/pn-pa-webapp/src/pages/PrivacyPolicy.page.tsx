import { useEffect } from "react";
import { ONE_TRUST_PORTAL_CDN_PP } from "../utils/constants";

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
    if (ONE_TRUST_PORTAL_CDN_PP) {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices([ONE_TRUST_PORTAL_CDN_PP], false);
      });
    }
  }, []);

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