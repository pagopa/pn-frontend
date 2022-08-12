import { HeroProps } from "@pagopa/mui-italia";
import { HorizontalNavProps } from "@pagopa/mui-italia";
import { WalkthroughProps } from "@pagopa/mui-italia";
import { ShowcaseProps } from "@pagopa/mui-italia";
import { InfoblockProps } from "@pagopa/mui-italia";

export enum UserType {
  PA = "pa",
  PF = "pf",
  CO = "co"
}

export interface ILinkData {
  label: string;
  ariaLabel: string;
  href: string;
}

export interface ILandingComponents {
  hero: HeroProps;
  infoblocks: Array<IInfoblockData>;
  showcases: Array<IShowcaseData>;
  walkthrough: WalkthroughProps;
  horizontalNav: HorizontalNavProps;
}

export interface IInfoblockData {
  name: string;
  data: InfoblockProps;
}

export interface IShowcaseData {
  name: string;
  data: ShowcaseProps;
}

export interface IAppData {
  common: {
    alert: string;
    assistance: ILinkData
  }
  pa: ILandingComponents;
  pf: ILandingComponents;
  co: ILandingComponents;
}