import { useContext } from "react";
import { HeroProps } from "@pagopa/mui-italia/dist/components/Hero";
import { ShowcaseProps } from "@pagopa/mui-italia/dist/components/Showcase";
import { WalkthroughProps } from '@pagopa/mui-italia/dist/components/Walkthrough';
import LangContext from "../provider/lang-context";
import { enAppData } from "./data/en";
import { itAppData } from "./data/it";
import { InfoblockProps } from "@pagopa/mui-italia";

export enum UserType {
  PA = "pa",
  PF = "pf",
  CO = "co"
}


export const getAppData = () => {
  const lang = useContext(LangContext);

  if(lang.selectedLanguage === 'it') {
    return itAppData;
  } else {
    return enAppData;
  }
};

export const getHeroData = (userType: UserType = UserType.PA): HeroProps => getAppData()[userType].hero;

export const getAllInfoblocksData = (userType: UserType = UserType.PA): Array<InfoblockProps> =>  getAppData()[userType].infoblocks.map((item) => item.data);
// export const getAllInfoblocksData = (userType: UserType = UserType.PA) =>  getAppData()[userType].infoblocks.map((item) => item.data);

export const getInfoblockData = (userType: UserType = UserType.PA, name: string = ""): InfoblockProps => {
// export const getInfoblockData = (userType: UserType = UserType.PA, name: string = "") => {
  const infoblock = getAppData()[userType].infoblocks.filter((item) => (item.name === name))[0];
  return infoblock.data;
};

export const getAllShowcasesData = (userType: UserType = UserType.PA): Array<ShowcaseProps> => getAppData()[userType].showcases.map((item) => item.data);

export const getShowcaseData = (userType: UserType = UserType.PA, name: string = ""): ShowcaseProps => {
// export const getInfoblockData = (userType: UserType = UserType.PA, name: string = "") => {
  const infoblock = getAppData()[userType].showcases.filter((item) => (item.name === name))[0];
  return infoblock.data;
};

export const getWalkthroughData = (userType: UserType = UserType.PA): WalkthroughProps => getAppData()[userType].walkthrough;

// export const getHorizontalNavData = (userType: UserType = UserType.PA): HorizontalNavProps => getAppData()[userType].horizontalNav;
export const getHorizontalNavData = (userType: UserType = UserType.PA) => getAppData()[userType].horizontalNav;

// export const getFooterData = (userType: UserType = UserType.PA): FooterProps => getAppData()[userType].footer;
