import { IAppData } from "model";

import {
  paHero,
  paHorizontalNav,
  paInfoBlocks,
  paShowcases,
  paWalkthrough,
} from "./de/PA";
import {
  pfHero,
  pfHorizontalNav,
  pfInfoBlocks,
  pfShowcases,
  pfWalkthrough,
} from "./de/PF";
import {
  assistanceLink,
  companyLegalInfo,
  navigation,
  pagoPALink,
  postLoginLinks,
  preLoginLinks,
  productJson,
} from "./de/common";

/** Application Data Mock */
export const deAppData: IAppData = {
  common: {
    navigation,
    assistance: assistanceLink,
    pagoPALink,
    companyLegalInfo,
    preLoginLinks,
    postLoginLinks,
    productJson,
  },
  pa: {
    hero: paHero,
    infoblocks: paInfoBlocks,
    showcases: paShowcases,
    walkthrough: paWalkthrough,
    horizontalNav: paHorizontalNav,
  },
  pf: {
    hero: pfHero,
    infoblocks: pfInfoBlocks,
    showcases: pfShowcases,
    walkthrough: pfWalkthrough,
    horizontalNav: pfHorizontalNav,
  },
};
