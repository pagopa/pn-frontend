import { NextPage } from "next";
import Head from "next/head";
import {
    Hero,
    HorizontalNav,
    Infoblock,
    Showcase,
    Walkthrough
} from "@pagopa/mui-italia";

import {
    getHeroData,
    getHorizontalNavData,
    getInfoblockData,
    getShowcaseData,
    getWalkthroughData,
    UserType
} from "../api";

const USER_TYPE = UserType.PA;

const Cittadini: NextPage = () => (
    <>
        <Head>
            <title>Piattaforma Notifiche</title>
            <meta name="description" content="Landing Piattaforma notifiche" />
            <link rel="icon" href="static/favicon.svg" />
        </Head>

        <main>
            Cittadini
        </main>
    </>
);

export default Cittadini;