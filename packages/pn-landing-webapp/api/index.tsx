import { useContext } from "react";

import {
  HeroProps,
  HorizontalNavProps,
  InfoblockProps,
  ShowcaseProps,
  WalkthroughProps,
} from "@pagopa/mui-italia";

import { IAppData, ITabsProps, UserType, IFaqData, IHeadingTitleProps } from "model";
import LangContext from "provider/lang-context";

import { deAppData } from "./data/de";
import { enAppData } from "./data/en";
import { frAppData } from "./data/fr";
import { itAppData } from "./data/it";
import { slAppData } from "./data/sl";
import { itFaqData } from "./data/faq-it";
import { perfezionamentoData } from "./data/perfezionamento";

export const getAppData = (): IAppData => {
  const lang = useContext(LangContext);

  switch (lang.selectedLanguage) {
    case "it":
      return itAppData;
    case "en":
      return enAppData;
    case "fr":
      return frAppData;
    case "de":
      return deAppData;
    case "sl":
      return slAppData;
    default:
      return itAppData;
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

/**
 * Even though the HorizontalNav component is not currently used we keep all
 * its functionalities available so it can be quickly added to any page of
 * the landing site
 */
export const getHorizontalNavData = (
  userType: UserType = UserType.PA
): HorizontalNavProps => getAppData()[userType].horizontalNav;

// I preferred to keep FAQ data outside the language-dependent info
// while we have the FAQ definition for one language (i.e. Italian) only.
// To add into the IAddData structures for each language when the remaining definitions arrive.
// --------------------------------------------------
// Carlos Lombardi, 2023.04.06
export const getFaqData = (): IFaqData => itFaqData;

// export const getFooterData = (userType: UserType = UserType.PA): FooterProps => getAppData()[userType].footer;

export const getCommonHeadingTitleData = (name: string): IHeadingTitleProps => {
  const headingTitleData = perfezionamentoData.headingTitles.filter(
    (f) => f.name === name
  )[0];
  return headingTitleData.data;
};

export const getCommonTabsData = (name: string): ITabsProps => {
  const tabsData = perfezionamentoData.tabs.filter((f) => f.name === name)[0];
  return tabsData.data;
};

export const getCommonInfoblockData = (name: string): InfoblockProps => {
  const infoblockData = perfezionamentoData.infoblocks.filter(
    (f) => f.name === name
  )[0];
  return infoblockData.data;
};
