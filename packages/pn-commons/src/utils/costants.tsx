import { PreLoginFooterLinksType, FooterLinksType } from '@pagopa/mui-italia';

import { getLocalizedOrDefaultLabel } from '../services/localization.service';

export const LANGUAGES = {
  it: { it: 'Italiano', en: 'Inglese' },
  en: { it: 'Italian', en: 'English' },
};

const isDev = process.env.NODE_ENV === "development";
const pathEnd = isDev ? "": "index.html";

// export const URL_DIGITAL_NOTIFICATIONS = 'https://notifichedigitali.it';
export const URL_DIGITAL_NOTIFICATIONS = 'https://www.notifichedigitali.pagopa.it/';
// export const URL_PRIVACY_LINK = 'https://notifichedigitali.it/cittadini/informativa-privacy'
export const PRIVACY_LINK_RELATIVE_PATH = '/cittadini/informativa-privacy/' + pathEnd;
const ACCESSIBILITY_LINK_RELATIVE_PATH = '/cittadini/accessibilita/' + pathEnd;

const getFooterLinkLabels = (
  link: string,
  defaultLabel: string
): { label: string; ariaLabel: string } => {
  const footerLink = `footer.${link}`;
  return {
    label: getLocalizedOrDefaultLabel('common', footerLink, defaultLabel),
    ariaLabel: `${getLocalizedOrDefaultLabel(
      'common',
      'footer.go-to',
      'Vai al link'
    )}: ${getLocalizedOrDefaultLabel('common', footerLink, defaultLabel)}`,
  };
};

export const pagoPALink = (): { href: string; ariaLabel: string } => ({
  href: 'https://www.pagopa.it/it/',
  ariaLabel: getLocalizedOrDefaultLabel(
    'common',
    'footer.go-to-pagopa',
    'Link: vai al sito di PagoPA S.p.A.'
  ),
});

export const companyLegalInfo = () => (
  <>
    <strong>PagoPA S.p.A.</strong> —{' '}
    {getLocalizedOrDefaultLabel(
      'common',
      'footer.legal-part-1',
      'società per azioni con socio unico - capitale sociale di euro 1,000,000 interamente versato - sede legale in Roma, Piazza Colonna 370'
    )}
    ,
    <br />
    {getLocalizedOrDefaultLabel(
      'common',
      'footer.legal-part-2',
      'CAP 00187 - n. di iscrizione a Registro Imprese di Roma, CF e P.IVA 15376371009'
    )}
  </>
);

export const preLoginLinks = (): PreLoginFooterLinksType => ({
  // First column
  aboutUs: {
    title: undefined,
    links: [
      {
        ...getFooterLinkLabels('who', 'Chi siamo'),
        href: `${pagoPALink().href}societa/chi-siamo`,
        linkType: 'external',
      },
      {
        label: 'PNRR',
        href: `${pagoPALink().href}opportunita/pnrr/progetti`,
        ariaLabel: `${getLocalizedOrDefaultLabel('common', 'footer.go-to', 'Vai al link')}: PNRR`,
        linkType: 'external',
      },
      {
        label: 'Media',
        href: `${pagoPALink().href}media`,
        ariaLabel: `${getLocalizedOrDefaultLabel('common', 'footer.go-to', 'Vai al link')}: Media`,
        linkType: 'external',
      },
      {
        ...getFooterLinkLabels('work', 'Lavora con noi'),
        href: `${pagoPALink().href}lavora-con-noi`,
        linkType: 'external',
      },
    ],
  },
  // Third column
  resources: {
    title: getLocalizedOrDefaultLabel('common', 'footer.resources', 'Risorse'),
    links: [
      {
        label: 'Privacy Policy',
        href: `${URL_DIGITAL_NOTIFICATIONS}${PRIVACY_LINK_RELATIVE_PATH}`,
        ariaLabel: `${getLocalizedOrDefaultLabel(
          'common',
          'footer.go-to',
          'Vai al link'
        )}: Privacy Policy`,
        linkType: 'external',
      },
      {
        ...getFooterLinkLabels('certifications', 'Certificazioni'),
        href: '#certificazioni',
        linkType: 'internal',
      },
      {
        ...getFooterLinkLabels('security', 'Sicurezza delle informazioni'),
        href: '#sicurezza-delle-informazioni',
        linkType: 'internal',
      },
      {
        ...getFooterLinkLabels('personal-data', 'Diritto alla protezione dei dati personali'),
        linkType: 'internal',
        onClick: () => {
          console.log('onClick');
        },
      },
      {
        ...getFooterLinkLabels('cookie', 'Preferenze Cookie'),
        href: '#preferenze-cookie',
        linkType: 'internal',
        onClick: () => {
          console.log('onClick');
        },
      },
      {
        ...getFooterLinkLabels('terms-conditions', 'Termini e Condizioni'),
        href: `${URL_DIGITAL_NOTIFICATIONS}${PRIVACY_LINK_RELATIVE_PATH}`,
        linkType: 'external',
      },
      {
        ...getFooterLinkLabels('company', 'Società trasparente'),
        href: '#societa-trasparente',
        linkType: 'internal',
      },
      {
        ...getFooterLinkLabels('disclosure', 'Responsible Disclosure Policy'),
        href: '#responsible-disclosure-policy',
        linkType: 'internal',
      },
      {
        ...getFooterLinkLabels('321-model', 'Modello 321'),
        href: '#modello-321',
        linkType: 'internal',
      },
    ],
  },
  // Fourth column
  followUs: {
    title: getLocalizedOrDefaultLabel('common', 'footer.follow', 'Seguici su'),
    socialLinks: [
      {
        icon: 'linkedin',
        title: 'LinkedIn',
        href: 'https://www.linkedin.com/company/pagopa/',
        ariaLabel: getLocalizedOrDefaultLabel(
          'common',
          'footer.social',
          'Link: vai al sito LinkedIn di PagoPA S.p.A.',
          { social: 'LinkedIn' }
        ),
      },
      {
        title: 'Twitter',
        icon: 'twitter',
        href: 'https://twitter.com/pagopa',
        ariaLabel: getLocalizedOrDefaultLabel(
          'common',
          'footer.social',
          'Link: vai al sito LinkedIn di PagoPA S.p.A.',
          { social: 'Twitter' }
        ),
      },
      {
        icon: 'instagram',
        title: 'Instagram',
        href: 'https://www.instagram.com/pagopa/',
        ariaLabel: getLocalizedOrDefaultLabel(
          'common',
          'footer.social',
          'Link: vai al sito LinkedIn di PagoPA S.p.A.',
          { social: 'Instagram' }
        ),
      },
      {
        icon: 'medium',
        title: 'Medium',
        href: 'https://medium.com/pagopa',
        ariaLabel: getLocalizedOrDefaultLabel(
          'common',
          'footer.social',
          'Link: vai al sito LinkedIn di PagoPA S.p.A.',
          { social: 'Medium' }
        ),
      },
    ],
    links: [
      {
        ...getFooterLinkLabels('accessibility', 'Accessibilità'),
        href: `${URL_DIGITAL_NOTIFICATIONS}${ACCESSIBILITY_LINK_RELATIVE_PATH}`,
        linkType: 'external',
      },
    ],
  },
});

export const postLoginLinks = (): Array<FooterLinksType> => ([
  {
    label: 'Privacy policy',
    href: `${URL_DIGITAL_NOTIFICATIONS}${PRIVACY_LINK_RELATIVE_PATH}`,
    ariaLabel: `${getLocalizedOrDefaultLabel(
      'common',
      'footer.go-to',
      'Vai al link'
    )}: Privacy Policy`,
    linkType: 'external',
  },
  {
    ...getFooterLinkLabels('terms-conditions', 'Termini e Condizioni'),
    href: `${URL_DIGITAL_NOTIFICATIONS}${PRIVACY_LINK_RELATIVE_PATH}`,
    linkType: 'external',
  },
  {
    ...getFooterLinkLabels('accessibility', 'Accessibilità'),
    href: `${URL_DIGITAL_NOTIFICATIONS}${ACCESSIBILITY_LINK_RELATIVE_PATH}`,
    linkType: 'external',
  },
]);
