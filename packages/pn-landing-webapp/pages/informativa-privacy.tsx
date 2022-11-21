import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";

import { ONE_TRUST_PORTAL_CDN } from "@utils/constants";

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => void
    }
    LoadNotices: (noticesUrls: Array<string>, flag: boolean) => void
  }
};

const PrivacyPage: NextPage = () => {

  useEffect(() => {
    if (ONE_TRUST_PORTAL_CDN) {
      OneTrust.NoticeApi.Initialized.then(() => {
        OneTrust.NoticeApi.LoadNotices(
          [
            ONE_TRUST_PORTAL_CDN as string,
          ],
          false
        );
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Piattaforma Notifiche</title>
        <meta
          name="description"
          content="Informativa Privacy Piattaforma notifiche"
        />
        <link rel="icon" href="/static/favicon.svg" />
      </Head>

      <div
        id="otnotice-b5c8e1dc-89df-4ec2-a02d-1c0f55fac052"
        className={`otnotice`}
      ></div>
    </>
  );
};

export default PrivacyPage;
