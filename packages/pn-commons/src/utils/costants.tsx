import { PreLoginFooterLinksType, FooterLinksType } from '@pagopa/mui-italia';

export const LANGUAGES = {
  it: { it: 'Italiano', en: 'Inglese' },
  en: { it: 'Italian', en: 'English' },
};

export const pagoPALink: {href: string; ariaLabel: string} = {
  href: "https://www.pagopa.it/it/",
  ariaLabel: "Link: vai al sito di PagoPA S.p.A.",
};

// export const URL_DIGITAL_NOTIFICATIONS = 'https://notifichedigitali.it';
export const URL_DIGITAL_NOTIFICATIONS = 'https://develop.d33g1ea1dgp7a4.amplifyapp.com';
// export const URL_PRIVACY_LINK = 'https://notifichedigitali.it/cittadini/informativa-privacy'
export const PRIVACY_LINK_RELATIVE_PATH = '/cittadini/informativa-privacy'

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

export const preLoginLinks: PreLoginFooterLinksType = {
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
        href: `${URL_DIGITAL_NOTIFICATIONS}${PRIVACY_LINK_RELATIVE_PATH}`,
        ariaLabel: "Vai al link: Privacy Policy",
        linkType: "external",
      },
      {
        label: "Certificazioni",
        href: "#certificazioni",
        ariaLabel: "Vai al link: Certificazioni",
        linkType: "internal",
      },
      {
        label: "Sicurezza delle informazioni",
        href: "#sicurezza-delle-informazioni",
        ariaLabel: "Vai al link: Sicurezza delle informazioni",
        linkType: "internal",
      },
      {
        label: "Diritto alla protezione dei dati personali",
        ariaLabel: "Vai al link: Diritto alla protezione dei dati personali",
        linkType: "internal",
        onClick: () => {
          console.log("onClick");
        },
      },
      {
        label: "Preferenze Cookie",
        href: "#preferenze-cookie",
        ariaLabel: "Vai al link: Preferenze Cookie",
        linkType: "internal",
        onClick: () => {
          console.log("onClick");
        },
      },
      {
        label: "Termini e Condizioni",
        href: `${URL_DIGITAL_NOTIFICATIONS}${PRIVACY_LINK_RELATIVE_PATH}`,
        ariaLabel: "Vai al link: Termini e Condizioni",
        linkType: "external",
      },
      {
        label: "Società trasparente",
        href: "#societa-trasparente",
        ariaLabel: "Vai al link: Società trasparente",
        linkType: "internal",
      },
      {
        label: "Responsible Disclosure Policy",
        href: "#responsible-disclosure-policy",
        ariaLabel: "Vai al link: Responsible Disclosure Policy",
        linkType: "internal",
      },
      {
        label: "Modello 321",
        href: "#modello-321",
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
        href: "https://www.linkedin.com/company/pagopa/",
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
        href: "https://www.instagram.com/pagopa/",
        ariaLabel: "Link: vai al sito Instagram di PagoPA S.p.A.",
      },
      {
        icon: "medium",
        title: "Medium",
        href: "https://medium.com/pagopa",
        ariaLabel: "Link: vai al sito Medium di PagoPA S.p.A.",
      },
    ],
    links: [
      {
        label: "Accessibilità",
        href: "#accessibilità",
        ariaLabel: "Vai al link: Accessibilità",
        linkType: "internal",
      },
    ],
  },
};

export const postLoginLinks: Array<FooterLinksType> = [
  {
    label: "Privacy policy",
    href: `${URL_DIGITAL_NOTIFICATIONS}${PRIVACY_LINK_RELATIVE_PATH}`,
    ariaLabel: "Vai al link: Privacy policy",
    linkType: "internal",
  },
  {
    label: "Termini e condizioni",
    href: `${URL_DIGITAL_NOTIFICATIONS}${PRIVACY_LINK_RELATIVE_PATH}`,
    ariaLabel: "Vai al link: Termini e condizioni",
    linkType: "internal",
  },
  {
    label: "Accessibilità",
    href: "#accessibility",
    ariaLabel: "Vai al link: Accessibilità",
    linkType: "internal",
  },
];