import { HeroProps } from "@pagopa/mui-italia/dist/components/Hero";
import { ShowcaseProps } from "@pagopa/mui-italia/dist/components/Showcase";
import { WalkthroughProps } from '@pagopa/mui-italia/dist/components/Walkthrough';
import { appData } from "./mocks";

const ASSETS_PATH = process.env.NEXT_PUBLIC_ASSETS_URL;

export enum UserType {
  PA = "pa",
  PF = "pf",
  CO = "co"
}

export const getHeroData = (userType: UserType = UserType.PA): HeroProps => appData[userType].hero;

// export const getAllInfoblocksData = (userType: UserType = UserType.PA): Array<InfoblockProps> =>  appData[userType].infoblocks.map((item) => item.payload);
export const getAllInfoblocksData = (userType: UserType = UserType.PA) =>  appData[userType].infoblocks.map((item) => item.payload);

// export const getInfoblockData = (userType: UserType = UserType.PA, name: string = ""): InfoblockProps => {
export const getInfoblockData = (userType: UserType = UserType.PA, name: string = "") => {
  const infoblock = appData[userType].infoblocks.filter((item) => (item.name === name))[0];
  return infoblock.payload;
};

export const getShowcaseData = (userType: UserType = UserType.PA): ShowcaseProps => appData[userType].showcase;

export const getWalkthroughData = (userType: UserType = UserType.PA): WalkthroughProps => appData[userType].walkthrough;

// export const getHorizontalNavData = (userType: UserType = UserType.PA): HorizontalNavProps => appData[userType].horizontalNav;
export const getHorizontalNavData = (userType: UserType = UserType.PA) => appData[userType].horizontalNav;

// export const getFooterData = (userType: UserType = UserType.PA): FooterProps => appData[userType].footer;
