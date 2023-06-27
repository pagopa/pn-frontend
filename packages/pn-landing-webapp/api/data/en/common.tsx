import { PreLoginFooterLinksType, FooterLinksType } from "@pagopa/mui-italia";
import { IMAGES_PATH, PAGOPA_HOME } from "@utils/constants";
import { INavigationBarProps, ILinkData } from "model";

export const navigation: INavigationBarProps = {
  title: "SEND",
  chip: "Beta",
  pf: "The general public",
  pa: "Entities",
  faq: "FAQ",
  image: `${IMAGES_PATH}/logo.svg`,
};

/**
 * Footer data
 */
export const pagoPALink: ILinkData = {
  label: "PagoPA S.p.A.",
  href: PAGOPA_HOME ?? "",
  ariaLabel: "Link: go to the website of PagoPA S.p.A.",
};

export const assistanceLink = {
  label: "Support",
  ariaLabel: "Support",
};

export const companyLegalInfo = (
  <>
    <strong>PagoPA S.p.A.</strong> — joint stock company with sole shareholder -
    share capital of 1,000,000 euros fully paid up - registered office in Rome,
    Piazza Colonna 370
    <br />
    CAP 00187 - Reg. no. in the Rome Business Register, Tax code and VAT number
    15376371009
  </>
);

export const preLoginLinks: PreLoginFooterLinksType = {
  // First column
  aboutUs: {
    title: undefined,
    links: [
      {
        label: "About us",
        href: `${pagoPALink.href}/societa/chi-siamo`,
        ariaLabel: "Go to link: About us",
        linkType: "external",
      },
      {
        label: "PNRR",
        href: `${pagoPALink.href}/opportunita/pnrr/progetti`,
        ariaLabel: "Go to link: PNRR",
        linkType: "external",
      },
      {
        label: "Media",
        href: `${pagoPALink.href}/media`,
        ariaLabel: "Go to link: Media",
        linkType: "external",
      },
      {
        label: "Work with us",
        href: `${pagoPALink.href}/lavora-con-noi`,
        ariaLabel: "Go to link: Work with us",
        linkType: "external",
      },
    ],
  },
  // Third column
  resources: {
    title: "Resources",
    links: [
      {
        label: "Privacy Policy",
        href: `/informativa-privacy/`,
        ariaLabel: "Go to link: Privacy Policy",
        linkType: "internal",
      },
      {
        label: "Certifications",
        href: "https://www.pagopa.it/it/certificazioni/",
        ariaLabel: "Go to link: Certifications",
        linkType: "internal",
      },
      {
        label: "Information security",
        href: "https://www.pagopa.it/it/politiche-per-la-sicurezza-delle-informazioni/",
        ariaLabel: "Go to link: Information security",
        linkType: "internal",
      },
      {
        label: "Right to protection of personal data",
        href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
        ariaLabel: "Go to link: Right to protection of personal data",
        linkType: "internal",
      },
      // {
      //   label: "Cookie Preferences",
      //   href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
      //   ariaLabel: "Go to link: Cookie Preferences",
      //   linkType: "internal",
      // },
      {
        label: "Transparent company",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.html",
        ariaLabel: "Go to link: Transparent company",
        linkType: "internal",
      },
      {
        label: "Responsible Disclosure Policy",
        href: "https://www.pagopa.it/it/responsible-disclosure-policy/",
        ariaLabel: "Go to link: Responsible Disclosure Policy",
        linkType: "internal",
      },
      {
        label: "Model 321",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.htmls",
        ariaLabel: "Go to link: Model 321",
        linkType: "internal",
      },
    ],
  },
  // Fourth column
  followUs: {
    title: "Follow us on",
    socialLinks: [
      {
        icon: "linkedin",
        title: "LinkedIn",
        href: "https://it.linkedin.com/company/pagopa",
        ariaLabel: "Link: go to the website LinkedIn of PagoPA S.p.A.",
      },
      {
        title: "Twitter",
        icon: "twitter",
        href: "https://twitter.com/pagopa",
        ariaLabel: "Link: go to the website Twitter of PagoPA S.p.A.",
      },
      {
        icon: "instagram",
        title: "Instagram",
        href: "https://www.instagram.com/pagopaspa/?hl=en",
        ariaLabel: "Link: go to the website Instagram of PagoPA S.p.A.",
      },
      {
        icon: "medium",
        title: "Medium",
        href: "https://medium.com/pagopa-spa",
        ariaLabel: "Link: go to the website Medium of PagoPA S.p.A.",
      },
    ],
    links: [
      {
        label: "Accessibility",
        href: "https://form.agid.gov.it/view/eca3487c-f3cb-40be-a590-212eafc70058/",
        ariaLabel: "Go to link: Accessibility",
        linkType: "internal",
      },
    ],
  },
};

export const postLoginLinks: Array<FooterLinksType> = [
  {
    label: "Privacy policy",
    href: "privacy-policy",
    ariaLabel: "Vai al link: Privacy policy",
    linkType: "internal",
  },
  {
    label: "Accessibilità",
    href: "accessibilita",
    ariaLabel: "Vai al link: Accessibilità",
    linkType: "internal",
  },
];

export const productJson = "/static/product.json";
