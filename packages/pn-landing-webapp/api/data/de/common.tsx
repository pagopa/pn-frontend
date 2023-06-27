import { PreLoginFooterLinksType, FooterLinksType } from "@pagopa/mui-italia";
import { IMAGES_PATH, PAGOPA_HOME } from "@utils/constants";
import { INavigationBarProps, ILinkData } from "model";

export const navigation: INavigationBarProps = {
  title: "SEND",
  chip: "Beta",
  pf: "Bürger",
  pa: "Einrichtungen",
  faq: "FAQ",
  image: `${IMAGES_PATH}/logo.svg`,
};

/**
 * Footer data
 */
export const pagoPALink: ILinkData = {
  label: "PagoPA S.p.A.",
  href: PAGOPA_HOME ?? "",
  ariaLabel: "Link: Gehe auf die Website von PagoPA S.p.A.",
};

export const assistanceLink = {
  label: "Hilfe",
  ariaLabel: "Hilfe",
};

export const companyLegalInfo = (
  <>
    <strong>PagoPA S.p.A.</strong> — Aktiengesellschaft mit einem einzigen
    Gesellschafter - voll eingezahltes Grundkapital von 1.000.000 Euro -
    eingetragener Sitz in Rom, Piazza Colonna 370
    <br />
    PLZ 00187 - Eintragungsnummer im Handelsregister von Rom, Steuernummer und
    USt-IdNr. 15376371009
  </>
);

export const preLoginLinks: PreLoginFooterLinksType = {
  // First column
  aboutUs: {
    title: undefined,
    links: [
      {
        label: "Über uns",
        href: `${pagoPALink.href}/societa/chi-siamo`,
        ariaLabel: "Zum Link: Über uns",
        linkType: "external",
      },
      {
        label: "PNRR",
        href: `${pagoPALink.href}/opportunita/pnrr/progetti`,
        ariaLabel: "Zum Link: PNRR",
        linkType: "external",
      },
      {
        label: "Media",
        href: `${pagoPALink.href}/media`,
        ariaLabel: "Zum Link: Media",
        linkType: "external",
      },
      {
        label: "Karriere",
        href: `${pagoPALink.href}/lavora-con-noi`,
        ariaLabel: "Zum Link: Karriere",
        linkType: "external",
      },
    ],
  },
  // Third column
  resources: {
    title: "Quellen",
    links: [
      {
        label: "Datenschutzerklärung",
        href: `/informativa-privacy/`,
        ariaLabel: "Zum Link: Datenschutzerklärung",
        linkType: "internal",
      },
      {
        label: "Zertifizierungen",
        href: "https://www.pagopa.it/it/certificazioni/",
        ariaLabel: "Zum Link: Zertifizierungen",
        linkType: "internal",
      },
      {
        label: "Informationssicherheit",
        href: "https://www.pagopa.it/it/politiche-per-la-sicurezza-delle-informazioni/",
        ariaLabel: "Zum Link: Informationssicherheit",
        linkType: "internal",
      },
      {
        label: "Recht auf Schutz personenbezogener Daten",
        href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
        ariaLabel: "Zum Link: Recht auf Schutz personenbezogener Daten",
        linkType: "internal",
      },
      // {
      //   label: "Cookie-Einstellungen",
      //   href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
      //   ariaLabel: "Zum Link: Cookie-Einstellungen",
      //   linkType: "internal",
      // },
      {
        label: "Transparente Gesellschaft",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.html",
        ariaLabel: "Zum Link: Transparente Gesellschaft",
        linkType: "internal",
      },
      {
        label: "Responsible Disclosure Policy",
        href: "https://www.pagopa.it/it/responsible-disclosure-policy/",
        ariaLabel: "Zum Link: Responsible Disclosure Policy",
        linkType: "internal",
      },
      {
        label: "Modell 321",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.htmls",
        ariaLabel: "Zum Link: Modell 321",
        linkType: "internal",
      },
    ],
  },
  // Fourth column
  followUs: {
    title: "Folge uns auf",
    socialLinks: [
      {
        icon: "linkedin",
        title: "LinkedIn",
        href: "https://it.linkedin.com/company/pagopa",
        ariaLabel: "Link: Gehe auf die Website LinkedIn von PagoPA S.p.A.",
      },
      {
        title: "Twitter",
        icon: "twitter",
        href: "https://twitter.com/pagopa",
        ariaLabel: "Link: Gehe auf die Website Twitter von PagoPA S.p.A.",
      },
      {
        icon: "instagram",
        title: "Instagram",
        href: "https://www.instagram.com/pagopaspa/?hl=en",
        ariaLabel: "Link: Gehe auf die Website Instagram von PagoPA S.p.A.",
      },
      {
        icon: "medium",
        title: "Medium",
        href: "https://medium.com/pagopa-spa",
        ariaLabel: "Link: Gehe auf die Website Medium von PagoPA S.p.A.",
      },
    ],
    links: [
      {
        label: "Zugänglichkeit",
        href: "https://form.agid.gov.it/view/eca3487c-f3cb-40be-a590-212eafc70058/",
        ariaLabel: "Zum Link: Zugänglichkeit",
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
