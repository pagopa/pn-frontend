import type { NextPage } from "next";
import { Infoblock, Showcase, Walkthrough, Hero } from "@pagopa/mui-italia";

import {
  getHeroData,
  getInfoblockData,
  getShowcaseData,
  getWalkthroughData,
} from "../../api";
import { UserType } from "model";
import PageHead from "src/components/PageHead";

const USER_TYPE = UserType.PA;

const EntiPage: NextPage = () => (
  <>
    <PageHead
      title="SEND - Enti"
      description="Pagina per gli enti e le pubbliche amministrazioni"
    />

    <main>
      <Hero {...getHeroData(USER_TYPE)} />
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 1")}></Infoblock>
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 2")}></Infoblock>
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 3")}></Infoblock>
      <Showcase {...getShowcaseData(USER_TYPE, "showcase 1")} />
      {/* Carlotta Dimatteo - workaround per gestire un anchor interno alla pagina richiesto dal team di comunicazione il 16/02/2023  */}
      <div id="start-integration">
        <></>
      </div>
      <Infoblock {...getInfoblockData(USER_TYPE, "infoblock 4")}></Infoblock>
      <Walkthrough {...getWalkthroughData(USER_TYPE)} />
    </main>
  </>
);

export default EntiPage;
