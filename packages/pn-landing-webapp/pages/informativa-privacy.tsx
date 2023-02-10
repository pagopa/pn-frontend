/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Script from "next/script";

import { ONE_TRUST_CDN } from "@utils/constants";

declare const OneTrust: {
  NoticeApi: {
    Initialized: {
      then: (cbk: () => void) => void;
    };
    LoadNotices: (noticesUrls: Array<string>, flag: boolean) => void;
  };
};

const PrivacyPage: NextPage = () => {
  useEffect(() => {
    if (ONE_TRUST_CDN) {
      OneTrust.NoticeApi.Initialized.then(() => {
        OneTrust.NoticeApi.LoadNotices([ONE_TRUST_CDN], false);
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
      <Script
        src="/onetrust/privacy-notice-scripts/otnotice-1.0.min.js"
        type="text/javascript"
        charSet="UTF-8"
        id="otprivacy-notice-script"
        strategy="beforeInteractive"
      />
      <div
        id="otnotice-b5c8e1dc-89df-4ec2-a02d-1c0f55fac052"
        className={`otnotice`}
      ></div>
    </>
  );
};

export default PrivacyPage;
