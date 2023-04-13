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
  faq: string;
}

/**
 * The description for a FAQ item can be specified by either: a string, an array of strings, or a JSX element.
 * If string, then it will be wrapped into a conveniently styled Box when rendered.
 * If array of strings, each element of the array will be analogously wrapped.
 * If JSX element, then it's rendered without any wrapper.
 * 
 * The intent is to simplify the specification of the FAQ content for texts which do not need special styling 
 * inside them. E.g. texts including links must be specified as JSX elements. But for straight texts or
 * array of paragraph, a string / array of strings will do.
 * 
 * Cfr. the implementation of the FAQ page
 * ----------------------------------------
 * Carlos Lombardi, 2023.04.06
 */
export type FaqDescription = string | Array<string> | JSX.Element;

// An Item is part ...
export interface IFaqDataItem {
  id: string;
  title: string;
  description: FaqDescription;
}

// ... of a Section, which is in turn part ...
export interface IFaqDataSection {
  title: string;
  items: Array<IFaqDataItem>;
}

// ... of the FAQ data structure
export interface IFaqData {
  title: string;
  sections: Array<IFaqDataSection>;
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
}

export interface IHeadingTitlesData {
  name: string;
  data: IHeadingTitleProps;
}

export interface IHeadingTitleProps {
  title?: string;
  subtitle?: string | JSX.Element;
}

export interface ITabsData {
  name: string;
  data: ITabsProps;
}

export interface ITabsProps {
  tabs: Array<string>;
}