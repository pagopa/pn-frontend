import { useEffect } from 'react';

import { ONE_TRUST_PORTAL_CDN_PARTICIPATING_ENTITIES } from '../utils/constants';

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => void;
    };
    LoadNotices: (noticesUrls: Array<string>, flag: boolean) => void;
  };
};

const ParticipatingEntitiesPage = () => {
  useEffect(() => {
    if (ONE_TRUST_PORTAL_CDN_PARTICIPATING_ENTITIES) {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices([ONE_TRUST_PORTAL_CDN_PARTICIPATING_ENTITIES], false);
      });
    }
  }, []);

  return (
    <>
      <div
        role="article"
        id="otnotice-ffb2a640-8165-4d5f-94c2-6259e21bee51"
        className="otnotice"
      ></div>
    </>
  );
};

export default ParticipatingEntitiesPage;
