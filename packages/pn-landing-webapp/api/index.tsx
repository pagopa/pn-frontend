import { useContext } from "react";
import { HeroProps } from "@pagopa/mui-italia/dist/components/Hero";
import { ShowcaseProps } from "@pagopa/mui-italia/dist/components/Showcase";
import { WalkthroughProps } from "@pagopa/mui-italia/dist/components/Walkthrough";
import { InfoblockProps } from "@pagopa/mui-italia";
import { IAppData, UserType } from "model";
import { HorizontalNavProps } from "@pagopa/mui-italia";
import LangContext from "../provider/lang-context";
import { deAppData } from "./data/de";
import { enAppData } from "./data/en";
import { frAppData } from "./data/fr";
import { itAppData } from "./data/it";
import { slAppData } from "./data/sl";

export const getAppData = (): IAppData => {
  const lang = useContext(LangContext);

  switch(lang.selectedLanguage){
    case 'it': return itAppData;
    case 'en': return enAppData;
    case 'fr': return frAppData;
    case 'de': return deAppData;
    case 'sl': return slAppData;
    default: return itAppData;
  }
};

export const getHeroData = (userType: UserType = UserType.PA): HeroProps =>
  getAppData()[userType].hero;

export const getAllInfoblocksData = (
  userType: UserType = UserType.PA
): Array<InfoblockProps> =>
  getAppData()[userType].infoblocks.map((item) => item.data);

export const getInfoblockData = (
  userType: UserType = UserType.PA,
  name: string = ""
): InfoblockProps => {
  const infoblock = getAppData()[userType].infoblocks.filter(
    (item) => item.name === name
  )[0];
  return infoblock.data;
};

export const getAllShowcasesData = (
  userType: UserType = UserType.PA
): Array<ShowcaseProps> =>
  getAppData()[userType].showcases.map((item) => item.data);

export const getShowcaseData = (
  userType: UserType = UserType.PA,
  name: string = ""
): ShowcaseProps => {
  const infoblock = getAppData()[userType].showcases.filter(
    (item) => item.name === name
  )[0];
  return infoblock.data;
};

export const getWalkthroughData = (
  userType: UserType = UserType.PA
): WalkthroughProps => getAppData()[userType].walkthrough;

export const getHorizontalNavData = (
  userType: UserType = UserType.PA
): HorizontalNavProps => getAppData()[userType].horizontalNav;

// export const getFooterData = (userType: UserType = UserType.PA): FooterProps => getAppData()[userType].footer;
