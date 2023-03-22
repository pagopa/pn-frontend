import type { NextPage } from "next";
import Head from "next/head";

import {
  Infoblock,
  Showcase,
  Walkthrough,
  Hero,
} from "@pagopa/mui-italia";

import {
  getHeroData,
  getInfoblockData,
  getShowcaseData,
  getWalkthroughData,
} from "api";
import { UserType } from "model";

const USER_TYPE = UserType.PF;

const CittadiniPage: NextPage = () => (
  <>
    <Head>
      <title>Piattaforma Notifiche - Cittadini</title>
      <meta name="description" content="Pagina dei cittadini" />
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