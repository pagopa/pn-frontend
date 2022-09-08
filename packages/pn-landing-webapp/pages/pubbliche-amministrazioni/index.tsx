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
} from "../../api";
import { UserType } from "model";

const USER_TYPE = UserType.PA;

const EntiPage: NextPage = () => (
  <>
    <Head>
      <title>Piattaforma Notifiche - Pubbliche amministrazioni</title>
      <meta name="description" content="Pagina per le pubbliche amministrazioni" />
      <link rel="icon" href="/static/favicon.svg" />
    </Head>

    <main>
      <Hero {...getHeroData(USER_TYPE)} />
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 1")}></Infoblock>
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 2")}></Infoblock>
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 3")}></Infoblock>
      <Showcase {...getShowcaseData(USER_TYPE, "showcase 1")} />
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 4")}></Infoblock>
      <Walkthrough {...getWalkthroughData(USER_TYPE)} />
    </main>
  </>
);

export default EntiPage;
