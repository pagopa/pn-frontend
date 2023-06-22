import type { NextPage } from "next";

import { Infoblock, Showcase, Walkthrough, Hero } from "@pagopa/mui-italia";

import {
  getHeroData,
  getInfoblockData,
  getShowcaseData,
  getWalkthroughData,
} from "api";
import { UserType } from "model";
import PageHead from "src/components/PageHead";

const USER_TYPE = UserType.PF;

const CittadiniPage: NextPage = () => (
  <>
    <PageHead title="SEND - Cittadini" description="Pagina dei cittadini" />

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
