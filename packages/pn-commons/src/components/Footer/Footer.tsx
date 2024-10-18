import { LangCode, Footer as MuiFooter } from '@pagopa/mui-italia';
import { useMemo } from 'react';
import {
  LANGUAGES,
  companyLegalInfo,
  pagoPALink,
  postLoginLinks,
  preLoginLinks,
} from '../../utility/costants';
import { getLangCode } from '../../utility';

type Props = {
  currentLanguage: string;
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
  const currentLangCode = useMemo(
    () => getLangCode(currentLanguage),
    [currentLanguage]
  );

  return (
    <MuiFooter
      loggedUser={loggedUser}
      companyLink={{
        ...localizedPagoPALink,
        onClick: () => window.open(localizedPagoPALink.href, '_blank'),
      }}
      legalInfo={companyLegalInfo()}
      postLoginLinks={postLoginLinks()}
      preLoginLinks={preLoginLinks(hasTermsOfService, privacyPolicyHref, termsOfServiceHref)}
      languages={LANGUAGES}
      currentLangCode={currentLangCode}
      onLanguageChanged={changeLanguageHandler}
    />
  );
};

export default Footer;
