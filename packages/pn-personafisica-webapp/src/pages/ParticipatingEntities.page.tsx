import { useEffect } from 'react';

import { compileOneTrustPath, getSessionLanguage } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => void;
    };
    LoadNotices: (noticesUrls: Array<string>, flag: boolean) => void;
  };
};

const ParticipatingEntitiesPage = () => {
  const { ONE_TRUST_DRAFT_MODE, ONE_TRUST_PARTICIPATING_ENTITIES } = getConfiguration();
  const lang = getSessionLanguage();

  useEffect(() => {
    if (ONE_TRUST_PARTICIPATING_ENTITIES) {
      OneTrust.NoticeApi.Initialized.then(function () {
        OneTrust.NoticeApi.LoadNotices(
          [compileOneTrustPath(ONE_TRUST_PARTICIPATING_ENTITIES, ONE_TRUST_DRAFT_MODE)],
          false
        );
      });
    }
  }, [lang]);

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
