import {
  FooterLinksType,
  HeroProps,
  HorizontalNavProps,
  InfoblockProps,
  PreLoginFooterLinksType,
  ShowcaseProps,
  WalkthroughProps
} from "@pagopa/mui-italia";

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

export interface INavigationBarProps {
  title: string;
  chip: string;
  pf: string;
  pa: string;
}

export interface IAppData {
  common: {
    navigation: INavigationBarProps;
    alert?: string;
    assistance: ILinkData;
    pagoPALink: ILinkData;
    companyLegalInfo: JSX.Element;
    preLoginLinks: PreLoginFooterLinksType;
    postLoginLinks: Array<FooterLinksType>;
  };
  pa: ILandingComponents;
  pf: ILandingComponents;
  co: ILandingComponents;
}