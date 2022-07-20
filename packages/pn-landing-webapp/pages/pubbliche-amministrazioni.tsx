import type { NextPage } from "next";
import Head from "next/head";
import {
  // HorizontalNav,
  Infoblock,
  Showcase,
  Walkthrough,
  Hero,
} from "@pagopa/mui-italia";
import {
  getHeroData,
  // getHorizontalNavData,
  getInfoblockData,
  getShowcaseData,
  getWalkthroughData,
  UserType,
} from "../api";

const USER_TYPE = UserType.PA;

// const FAVICON_PATH = `${process.env.NEXT_PUBLIC_ASSETS_URL}/favicon.svg`;

const Home: NextPage = () => (
  <>
    <Head>
      <title>Piattaforma Notifiche</title>
      <meta name="description" content="Landing Piattaforma notifiche" />
      <link rel="icon" href="static/favicon.svg" />
    </Head>

    <main>
      <Hero {...getHeroData(USER_TYPE)} />
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 1")}></Infoblock>
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 2")}></Infoblock>
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 3")}></Infoblock>
      <Showcase {...getShowcaseData(USER_TYPE, "showcase 1")} />
      {/* <HorizontalNav {...getHorizontalNavData(USER_TYPE)}></HorizontalNav> */}
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 4")}></Infoblock>
      <Walkthrough {...getWalkthroughData(USER_TYPE)} />
    </main>
  </>
);

export default Home;
