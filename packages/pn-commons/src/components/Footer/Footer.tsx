import { useMemo } from 'react';

import { LangCode, Footer as MuiFooter } from '@pagopa/mui-italia';

import {
  LANGUAGES,
  companyLegalInfo,
  pagoPALink,
  postLoginLinks,
  preLoginLinks,
} from '../../utility/costants';
import { getLangCode } from '../../utility/multilanguage.utility';

type Props = {
  currentLanguage: string;
  accessibilityLink: string;
  onLanguageChanged?: (langCode: string) => void;
  loggedUser?: boolean;
  /** Enables the Terms of Service Link */
  hasTermsOfService?: boolean;
  /** Url to privacy policy page */
  privacyPolicyHref?: string;
  /** Url to terms of service page */
  termsOfServiceHref?: string;
};

const Footer: React.FC<Props> = ({
  currentLanguage,
  accessibilityLink,
  onLanguageChanged = () => {},
  loggedUser = false,
  hasTermsOfService,
  privacyPolicyHref,
  termsOfServiceHref,
}) => {
  const localizedPagoPALink = pagoPALink();
  const changeLanguageHandler = (langCode: LangCode) => {
    onLanguageChanged(langCode);
  };
  const currentLangCode = useMemo(() => getLangCode(currentLanguage), [currentLanguage]);

  return (
    <MuiFooter
      loggedUser={loggedUser}
      companyLink={{
        ...localizedPagoPALink,
        onClick: () => window.open(localizedPagoPALink.href, '_blank'),
      }}
      legalInfo={companyLegalInfo()}
      postLoginLinks={postLoginLinks(accessibilityLink)}
      preLoginLinks={preLoginLinks(
        hasTermsOfService,
        accessibilityLink,
        privacyPolicyHref,
        termsOfServiceHref
      )}
      languages={LANGUAGES}
      currentLangCode={currentLangCode}
      onLanguageChanged={changeLanguageHandler}
    />
  );
};

export default Footer;
