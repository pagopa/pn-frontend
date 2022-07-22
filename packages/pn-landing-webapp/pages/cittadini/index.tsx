import type { NextPage } from "next";
import Head from "next/head";
import {
//   HorizontalNav,
  Infoblock,
  Showcase,
  Walkthrough,
  Hero,
} from "@pagopa/mui-italia";
import {
  getHeroData,
//   getHorizontalNavData,
  getInfoblockData,
  getShowcaseData,
  getWalkthroughData,
} from "../../api";
import { UserType } from "model";

const USER_TYPE = UserType.PF;

// const FAVICON_PATH = `${process.env.NEXT_PUBLIC_ASSETS_URL}/favicon.svg`;

const Cittadini: NextPage = () => (
  <>
    <Head>
      <title>Piattaforma Notifiche</title>
      <meta name="description" content="Landing Piattaforma notifiche" />
      <link rel="icon" href="static/favicon.svg" />
    </Head>

    <main>
      <Hero {...getHeroData(USER_TYPE)} />
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 1")}></Infoblock>
      <Showcase {...getShowcaseData(USER_TYPE, "showcase 1")} />
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 2")}></Infoblock>
      <Showcase {...getShowcaseData(USER_TYPE, "showcase 2")} />
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 3")}></Infoblock>
      <Walkthrough {...getWalkthroughData(USER_TYPE)} />
    </main>
  </>
);

export default Cittadini;