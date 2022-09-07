import type { NextPage } from "next";
import Head from "next/head";
import {
  Infoblock,
  Showcase,
  Walkthrough,
  Hero,
} from "@pagopa/mui-italia";
import { UserType } from "model";
import {
  getHeroData,
  getInfoblockData,
  getShowcaseData,
  getWalkthroughData,
} from "../../api";


const USER_TYPE = UserType.PF;

const CittadiniPage: NextPage = () => (
  <>
    <Head>
      <title>Piattaforma Notifiche</title>
      <meta name="description" content="Landing Piattaforma notifiche" />
      <link rel="icon" href="/static/favicon.svg" />
    </Head>

    <main>
      <Hero {...getHeroData(USER_TYPE)} />
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 1")} />
      <Showcase {...getShowcaseData(USER_TYPE, "showcase 1")} />
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 2")} />
      <Showcase {...getShowcaseData(USER_TYPE, "showcase 2")} />
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 3")} />
      <Walkthrough {...getWalkthroughData(USER_TYPE)} />
    </main>
  </>
);

export default CittadiniPage;