import { useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";

declare const OneTrust: any;

const PrivacyPage: NextPage = () => {

  useEffect(() => {
    OneTrust.NoticeApi.Initialized.then(function () {
      OneTrust.NoticeApi.LoadNotices(
        [
          "https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/draft/b5c8e1dc-89df-4ec2-a02d-1c0f55fac052.json",
        ],
        false
      );
    });
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
