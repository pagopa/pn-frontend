import type { NextPage } from "next";
import Head from "next/head";
import {
  HorizontalNav,
  Infoblock,
  Showcase,
  Walkthrough,
  Hero,
} from "@pagopa/mui-italia";
import {
  getHeroData,
  getHorizontalNavData,
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
      <Infoblock {...getInfoblockData(USER_TYPE)}></Infoblock>
      <Infoblock {...getInfoblockData(USER_TYPE)}></Infoblock>
      <Infoblock {...getInfoblockData(USER_TYPE)}></Infoblock>
      <Showcase {...getShowcaseData(USER_TYPE)} />
      <HorizontalNav {...getHorizontalNavData(USER_TYPE)}></HorizontalNav>
      <Walkthrough {...getWalkthroughData(USER_TYPE)} />
    </main>
  </>
);

export default Home;
