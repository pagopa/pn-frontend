import type { NextPage } from "next";
import Head from "next/head";
import { Box } from "@mui/material";
import { Hero } from "@pagopa/mui-italia/dist/components/Hero";
import { Showcase } from "@pagopa/mui-italia/dist/components/Showcase";
import { Walkthrough } from "@pagopa/mui-italia/dist/components/Walkthrough";

import {
  getHeroData,
  getShowcaseData,
  getWalkthroughData,
  UserType,
} from "../api";

const USER_TYPE = UserType.PA;

const Home: NextPage = () => (
  <>
    <Head>
      <title>Piattaforma Notifiche</title>
      <meta name="description" content="Landing Piattaforma notifiche" />
      <link rel="icon" href="/favicon.svg" />
    </Head>

    <main>
      <Hero {...getHeroData(USER_TYPE)} />
      <Box>Infoblock 1</Box>
      <Box>Infoblock 2</Box>
      <Box>Infoblock 3</Box>
      <Showcase {...getShowcaseData(USER_TYPE)} />
      <Box>Horizontal Nav</Box>
      <Walkthrough {...getWalkthroughData(USER_TYPE)} />
    </main>
  </>
);

export default Home;
