import { PreLoginFooterLinksType, FooterLinksType } from "@pagopa/mui-italia";
import { IMAGES_PATH, PAGOPA_HOME } from "@utils/constants";
import { INavigationBarProps, ILinkData } from "model";

export const navigation: INavigationBarProps = {
  title: "Platforma za obvestila",
  chip: "Beta",
  pf: "Državljani",
  pa: "Odvetnik",
  faq: "FAQ",
  image: `${IMAGES_PATH}/logo.svg`,
};

/**
 * Footer data
 */
export const pagoPALink: ILinkData = {
  label: "PagoPA S.p.A.",
  href: PAGOPA_HOME ?? "",
  ariaLabel: "Povezava: pojdi na spletno mesto družbe PagoPA S.p.A.",
};

export const assistanceLink = {
  label: "Podpora strankam",
  ariaLabel: "Podpora strankam",
};

export const companyLegalInfo = (
  <>
    <strong>PagoPA S.p.A.</strong> — delniška družba z enim družbenikom - v
    celoti vplačan osnovni kapital 1.000.000 EUR - sedež v Rimu, Piazza Colonna
    370
    <br />
    Poštna številka 00187 - št. vpisa v Poslovni register v Rimu, davčna
    številka in identifikacijska številka za DDV 15376371009
  </>
);

export const preLoginLinks: PreLoginFooterLinksType = {
  // First column
  aboutUs: {
    title: undefined,
    links: [
      {
        label: "Kdo smo",
        href: `${pagoPALink.href}/societa/chi-siamo`,
        ariaLabel: "Pojdi na povezavo: Kdo smo",
        linkType: "external",
      },
      {
        label: "PNRR",
        href: `${pagoPALink.href}/opportunita/pnrr/progetti`,
        ariaLabel: "Pojdi na povezavo: PNRR",
        linkType: "external",
      },
      {
        label: "Media",
        href: `${pagoPALink.href}/media`,
        ariaLabel: "Pojdi na povezavo: Media",
        linkType: "external",
      },
      {
        label: "Sodeluj z nami",
        href: `${pagoPALink.href}/lavora-con-noi`,
        ariaLabel: "Pojdi na povezavo: Sodeluj z nami",
        linkType: "external",
      },
    ],
  },
  // Third column
  resources: {
    title: "Viri",
    links: [
      {
        label: "Izjava o varstvu osebnih podatkov",
        href: `/informativa-privacy/`,
        ariaLabel: "Pojdi na povezavo: Izjava o varstvu osebnih podatkov",
        linkType: "internal",
      },
      {
        label: "Certifikati",
        href: "https://www.pagopa.it/it/certificazioni/",
        ariaLabel: "Pojdi na povezavo: Certifikati",
        linkType: "internal",
      },
      {
        label: "Varnost podatkov",
        href: "https://www.pagopa.it/it/politiche-per-la-sicurezza-delle-informazioni/",
        ariaLabel: "Pojdi na povezavo: Varnost podatkov",
        linkType: "internal",
      },
      {
        label: "Pravica do varstva osebnih podatkov",
        href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
        ariaLabel: "Pojdi na povezavo: Pravica do varstva osebnih podatkov",
        linkType: "internal",
      },
      // {
      //   label: "Nastavitve piškotkov",
      //   href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
      //   ariaLabel: "Pojdi na povezavo: Nastavitve piškotkov",
      //   linkType: "internal",
      // },
      {
        label: "Pregledna družba",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.html",
        ariaLabel: "Pojdi na povezavo: Pregledna družba",
        linkType: "internal",
      },
      {
        label: "Politika odgovornega razkritja",
        href: "https://www.pagopa.it/it/responsible-disclosure-policy/",
        ariaLabel: "Pojdi na povezavo: Politika odgovornega razkritja",
        linkType: "internal",
      },
      {
        label: "Model 321",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.htmls",
        ariaLabel: "Pojdi na povezavo: Model 321",
        linkType: "internal",
      },
    ],
  },
  // Fourth column
  followUs: {
    title: "Sledi nam na",
    socialLinks: [
      {
        icon: "linkedin",
        title: "LinkedIn",
        href: "https://it.linkedin.com/company/pagopa",
        ariaLabel:
          "Povezava: pojdi na spletno mesto LinkedIn družbe PagoPA S.p.A.",
      },
      {
        title: "Twitter",
        icon: "twitter",
        href: "https://twitter.com/pagopa",
        ariaLabel:
          "Povezava: pojdi na spletno mesto Twitter družbe PagoPA S.p.A.",
      },
      {
        icon: "instagram",
        title: "Instagram",
        href: "https://www.instagram.com/pagopaspa/?hl=en",
        ariaLabel:
          "Povezava: pojdi na spletno mesto Instagram družbe PagoPA S.p.A.",
      },
      {
        icon: "medium",
        title: "Medium",
        href: "https://medium.com/pagopa-spa",
        ariaLabel:
          "Povezava: pojdi na spletno mesto Medium družbe PagoPA S.p.A.",
      },
    ],
    links: [
      {
        label: "Dostopnost",
        href: "https://form.agid.gov.it/view/eca3487c-f3cb-40be-a590-212eafc70058/",
        ariaLabel: "Pojdi na povezavo: Dostopnost",
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
