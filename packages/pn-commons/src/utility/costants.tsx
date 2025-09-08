import { FooterLinksType, Languages, PreLoginFooterLinksType } from '@pagopa/mui-italia';

import { getLocalizedOrDefaultLabel } from '../utility/localization.utility';

declare const OneTrust: any;

export const LANGUAGES: Languages = {
  it: { it: 'Italiano', en: 'Inglese', fr: 'Francese', de: 'Tedesco', sl: 'Sloveno' },
  en: { it: 'Italian', en: 'English', fr: 'French', de: 'German', sl: 'Slovenian' },
  fr: { it: 'Italien', en: 'Anglais', fr: 'Français', de: 'Allemand', sl: 'Slovène' },
  de: { it: 'Italienisch', en: 'Englisch', fr: 'Französisch', de: 'Deutsch', sl: 'Slowenisch' },
  sl: { it: 'Italijansko', en: 'Angleško', fr: 'Francosko', de: 'Nemško', sl: 'Slovensko' },
};

export const PRIVACY_LINK_RELATIVE_PATH = '/informativa-privacy';
export const TOS_LINK_RELATIVE_PATH = '/termini-di-servizio';

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

export const preLoginLinks = (
  hasTermsOfService: boolean = false,
  accessibilityLink: string,
  privacyPolicyHref?: string,
  termsOfServiceHref?: string
): PreLoginFooterLinksType => {
  const links: PreLoginFooterLinksType = {
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
          ariaLabel: `${getLocalizedOrDefaultLabel(
            'common',
            'footer.go-to',
            'Vai al link'
          )}: Media`,
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
          ...getFooterLinkLabels('privacy-info', 'Informativa Privacy'),
          href: privacyPolicyHref || `${window.location.origin}${PRIVACY_LINK_RELATIVE_PATH}`,
          linkType: 'internal',
        },
        {
          ...getFooterLinkLabels('certifications', 'Certificazioni'),
          href: 'https://www.pagopa.it/it/certificazioni/',
          linkType: 'internal',
        },
        {
          ...getFooterLinkLabels('security', 'Sicurezza delle informazioni'),
          href: 'https://www.pagopa.it/it/politiche-per-la-sicurezza-delle-informazioni/',
          linkType: 'internal',
        },
        {
          ...getFooterLinkLabels('personal-data', 'Diritto alla protezione dei dati personali'),
          href: 'https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8',
          linkType: 'internal',
        },
        {
          ...getFooterLinkLabels('cookie', 'Preferenze Cookie'),
          onClick: () => OneTrust.ToggleInfoDisplay(),
          linkType: 'internal',
        },
        {
          ...getFooterLinkLabels('company', 'Società trasparente'),
          href: 'https://pagopa.portaleamministrazionetrasparente.it/pagina0_home-page.html',
          linkType: 'internal',
        },
        {
          ...getFooterLinkLabels('disclosure', 'Responsible Disclosure Policy'),
          href: 'https://www.pagopa.it/it/responsible-disclosure-policy/',
          linkType: 'internal',
        },
        {
          ...getFooterLinkLabels('321-model', 'Modello 231'),
          href: 'https://pagopa.portaleamministrazionetrasparente.it/pagina746_altri-contenuti.html',
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
          icon: 'instagram',
          title: 'Instagram',
          href: 'https://www.instagram.com/pagopaspa/?hl=en',
          ariaLabel: getLocalizedOrDefaultLabel(
            'common',
            'footer.social',
            'Link: vai al sito LinkedIn di PagoPA S.p.A.',
            { social: 'Instagram' }
          ),
        },
        {
          icon: 'threads',
          title: 'Threads',
          href: 'https://www.threads.net/@pagopaspa',
          ariaLabel: getLocalizedOrDefaultLabel(
            'common',
            'footer.social',
            'Link: vai al sito Threads di PagoPA S.p.A.',
            { social: 'Threads' }
          ),
        },
        {
          icon: 'youtube',
          title: 'Youtube',
          href: 'https://www.youtube.com/channel/UCFBGOEJUPQ6t3xtZFc_UIEQ',
          ariaLabel: getLocalizedOrDefaultLabel(
            'common',
            'footer.social',
            'Link: vai al sito Youtube di PagoPA S.p.A.',
            { social: 'Youtube' }
          ),
        },
      ],
      links: [
        {
          ...getFooterLinkLabels('accessibility', 'Accessibilità'),
          href: accessibilityLink,
          linkType: 'external',
        },
      ],
    },
  };

  if (hasTermsOfService) {
    // eslint-disable-next-line functional/immutable-data
    links.resources.links = [
      ...links.resources.links,
      {
        ...getFooterLinkLabels('terms-conditions', 'Termini e Condizioni'),
        href: termsOfServiceHref || `${window.location.origin}${TOS_LINK_RELATIVE_PATH}`,
        linkType: 'internal',
      },
    ];
  }

  return links;
};

export const postLoginLinks = (
  accessibilityLink: string,
  privacyPolicyHref?: string,
  termsOfServiceHref?: string
): Array<FooterLinksType> => [
  {
    ...getFooterLinkLabels('privacy-info', 'Informativa Privacy'),
    href: privacyPolicyHref || `${window.location.origin}${PRIVACY_LINK_RELATIVE_PATH}`,
    linkType: 'internal',
  },
  {
    ...getFooterLinkLabels('terms-conditions', 'Termini e Condizioni'),
    href: termsOfServiceHref || `${window.location.origin}${TOS_LINK_RELATIVE_PATH}`,
    linkType: 'internal',
  },
  {
    ...getFooterLinkLabels('accessibility', 'Accessibilità'),
    href: accessibilityLink,
    linkType: 'external',
  },
];
