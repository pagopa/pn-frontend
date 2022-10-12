import { PreLoginFooterLinksType, FooterLinksType } from "@pagopa/mui-italia";

const isDev = process.env.NODE_ENV === "development";
const pathEnding = isDev ? "" : "index.html";

export const LANGUAGES = {
  it: { it: "Italiano", en: "Inglese" },
  en: { it: "Italian", en: "English" },
};

export const pagoPALink: { href: string; ariaLabel: string } = {
  href: "https://www.pagopa.it/it/",
  ariaLabel: "Link: vai al sito di PagoPA S.p.A.",
};

export const companyLegalInfo = (
  <>
    <strong>PagoPA S.p.A.</strong> — società per azioni con socio unico -
    capitale sociale di euro 1,000,000 interamente versato - sede legale in
    Roma, Piazza Colonna 370,
    <br />
    CAP 00187 - n. di iscrizione a Registro Imprese di Roma, CF e P.IVA
    15376371009
  </>
);

export const preLoginLinks = (pageType: string): PreLoginFooterLinksType => ({
  // First column
  aboutUs: {
    title: undefined,
    links: [
      {
        label: "Chi siamo",
        href: `${pagoPALink.href}societa/chi-siamo`,
        ariaLabel: "Vai al link: Chi siamo",
        linkType: "external",
      },
      {
        label: "PNRR",
        href: `${pagoPALink.href}opportunita/pnrr/progetti`,
        ariaLabel: "Vai al link: PNRR",
        linkType: "external",
      },
      {
        label: "Media",
        href: `${pagoPALink.href}media`,
        ariaLabel: "Vai al link: Media",
        linkType: "external",
      },
      {
        label: "Lavora con noi",
        href: `${pagoPALink.href}lavora-con-noi`,
        ariaLabel: "Vai al link: Lavora con noi",
        linkType: "external",
      },
    ],
  },
  // Third column
  resources: {
    title: "Risorse",
    links: [
      {
        label: "Privacy Policy",
        href: `/${pageType}/informativa-privacy/` + pathEnding,
        ariaLabel: "Vai al link: Privacy Policy",
        linkType: "internal",
      },
      {
        label: "Certificazioni",
        href: "https://www.pagopa.it/static/10ffe3b3d90ecad83d1bbebea0512188/Certificato-SGSI-PagoPA-2020.pdf",
        ariaLabel: "Vai al link: Certificazioni",
        linkType: "internal",
      },
      {
        label: "Sicurezza delle informazioni",
        href: "https://www.pagopa.it/static/781646994f1f8ddad2d95af3aaedac3d/Sicurezza-delle-informazioni_PagoPA-S.p.A..pdf",
        ariaLabel: "Vai al link: Sicurezza delle informazioni",
        linkType: "internal",
      },
      {
        label: "Diritto alla protezione dei dati personali",
        href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
        ariaLabel: "Vai al link: Diritto alla protezione dei dati personali",
        linkType: "internal",
      },
      // {
      //   label: "Preferenze Cookie",
      //   href: "https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8",
      //   ariaLabel: "Vai al link: Preferenze Cookie",
      //   linkType: "internal",
      // },
      {
        label: "Società trasparente",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.html",
        ariaLabel: "Vai al link: Società trasparente",
        linkType: "internal",
      },
      {
        label: "Responsible Disclosure Policy",
        href: "https://www.pagopa.it/it/responsible-disclosure-policy/",
        ariaLabel: "Vai al link: Responsible Disclosure Policy",
        linkType: "internal",
      },
      {
        label: "Modello 321",
        href: "https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.htmls",
        ariaLabel: "Vai al link: Modello 321",
        linkType: "internal",
      },
    ],
  },
  // Fourth column
  followUs: {
    title: "Seguici su",
    socialLinks: [
      {
        icon: "linkedin",
        title: "LinkedIn",
        href: "https://it.linkedin.com/company/pagopa",
        ariaLabel: "Link: vai al sito LinkedIn di PagoPA S.p.A.",
      },
      {
        title: "Twitter",
        icon: "twitter",
        href: "https://twitter.com/pagopa",
        ariaLabel: "Link: vai al sito Twitter di PagoPA S.p.A.",
      },
      {
        icon: "instagram",
        title: "Instagram",
        href: "https://www.instagram.com/pagopaspa/?hl=en",
        ariaLabel: "Link: vai al sito Instagram di PagoPA S.p.A.",
      },
      {
        icon: "medium",
        title: "Medium",
        href: "https://medium.com/pagopa-spa",
        ariaLabel: "Link: vai al sito Medium di PagoPA S.p.A.",
      },
    ],
    links: [
      {
        label: "Accessibilità",
        href: "https://form.agid.gov.it/view/eca3487c-f3cb-40be-a590-212eafc70058/",
        ariaLabel: "Vai al link: Accessibilità",
        linkType: "internal",
      },
    ],
  },
});

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
