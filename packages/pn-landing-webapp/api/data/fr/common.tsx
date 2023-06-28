import { PreLoginFooterLinksType, FooterLinksType } from "@pagopa/mui-italia";
import { IMAGES_PATH, PAGOPA_HOME } from "@utils/constants";
import { INavigationBarProps, ILinkData } from "model";

export const navigation: INavigationBarProps = {
  title: "SEND",
  chip: "Bêta",
  pf: "Citoyens",
  pa: "Entités",
  faq: "FAQ",
  image: `${IMAGES_PATH}/logo.svg`,
};

/**
 * Footer data
 */
export const pagoPALink: ILinkData = {
  label: "PagoPA S.p.A.",
  href: PAGOPA_HOME ?? "",
  ariaLabel: "Lien : va sur le site de PagoPA S.p.A.",
};

export const assistanceLink = {
  label: "Assistance",
  ariaLabel: "Assistance",
};

export const companyLegalInfo = (
  <>
    <strong>PagoPA S.p.A.</strong> — société anonyme à associé unique - capital
    social de 1 000 000 d’euros entièrement libéré - siège social à Rome, Piazza
    Colonna 370
    <br />
    Code postal 00187 - N° d’inscription au Registre du Commerce de Rome, code
    fiscal et n° de TVA 15376371009
  </>
);

export const preLoginLinks: PreLoginFooterLinksType = {
  // First column
  aboutUs: {
    title: undefined,
    links: [
      {
        label: "À propos de nous",
        href: `${pagoPALink.href}/societa/chi-siamo`,
        ariaLabel: "Clique sur le lien: À propos de nous",
        linkType: "external",
      },
      {
        label: "PNRR",
        href: `${pagoPALink.href}/opportunita/pnrr/progetti`,
        ariaLabel: "Clique sur le lien: PNRR",
        linkType: "external",
      },
      {
        label: "Media",
        href: `${pagoPALink.href}/media`,
        ariaLabel: "Clique sur le lien: Media",
        linkType: "external",
      },
      {
        label: "Travaille avec nous",
        href: `${pagoPALink.href}/lavora-con-noi`,
        ariaLabel: "Clique sur le lien: Travaille avec nous",
        linkType: "external",
      },
    ],
  },
  // Third column
  resources: {
    title: "Ressources",
    links: [
      {
        label: "Politique de confidentialité",
        href: `/informativa-privacy/`,
        ariaLabel: "Clique sur le lien: Politique de confidentialité",
        linkType: "internal",
      },
      {
        label: "Certifications",
        href: "https://www.pagopa.it/it/certificazioni/",
        ariaLabel: "Clique sur le lien: Certifications",
        linkType: "internal",
      },
      {
        label: "Sécurité des informations",
        href: "https://www.pagopa.it/it/politiche-per-la-sicurezza-delle-informazioni/",
        ariaLabel: "Clique sur le lien: Sécurité des informations",
        linkType: "internal",
      },
      {
        label: "Droit à la protection des données personnelles",
        href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
        ariaLabel:
          "Clique sur le lien: Droit à la protection des données personnelles",
        linkType: "internal",
      },
      // {
      //   label: "Préférences en matière de cookies",
      //   href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
      //   ariaLabel: "Clique sur le lien: Préférences en matière de cookies",
      //   linkType: "internal",
      // },
      {
        label: "Société transparente",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.html",
        ariaLabel: "Clique sur le lien: Société transparente",
        linkType: "internal",
      },
      {
        label: "Politique de divulgation responsable",
        href: "https://www.pagopa.it/it/responsible-disclosure-policy/",
        ariaLabel: "Clique sur le lien: Politique de divulgation responsable",
        linkType: "internal",
      },
      {
        label: "Modèle 321",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.htmls",
        ariaLabel: "Clique sur le lien: Modèle 321",
        linkType: "internal",
      },
    ],
  },
  // Fourth column
  followUs: {
    title: "Suis-nous sur",
    socialLinks: [
      {
        icon: "linkedin",
        title: "LinkedIn",
        href: "https://it.linkedin.com/company/pagopa",
        ariaLabel: "Lien : va sur le site LinkedIn de PagoPA S.p.A.",
      },
      {
        title: "Twitter",
        icon: "twitter",
        href: "https://twitter.com/pagopa",
        ariaLabel: "Lien : va sur le site Twitter de PagoPA S.p.A.",
      },
      {
        icon: "instagram",
        title: "Instagram",
        href: "https://www.instagram.com/pagopaspa/?hl=en",
        ariaLabel: "Lien : va sur le site Instagram de PagoPA S.p.A.",
      },
      {
        icon: "medium",
        title: "Medium",
        href: "https://medium.com/pagopa-spa",
        ariaLabel: "Lien : va sur le site Medium de PagoPA S.p.A.",
      },
    ],
    links: [
      {
        label: "Accessibility",
        href: "https://form.agid.gov.it/view/eca3487c-f3cb-40be-a590-212eafc70058/",
        ariaLabel: "Clique sur le lien: Accessibility",
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
