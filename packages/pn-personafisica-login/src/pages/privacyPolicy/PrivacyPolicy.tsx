import { useEffect } from 'react';
import { ONE_TRUST_PORTAL_CDN } from '../../utils/constants';

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => void;
    };
    LoadNotices: (noticesUrls: Array<string>, flag: boolean) => void;
  };
};

const PrivacyPolicy = () => {
  useEffect(() => {
    if (ONE_TRUST_PORTAL_CDN) {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices([ONE_TRUST_PORTAL_CDN], false);
      });
    }
  }, []);

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
