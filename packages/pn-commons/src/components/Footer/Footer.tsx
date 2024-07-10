import { LangCode, Footer as MuiFooter } from '@pagopa/mui-italia';

import { getSessionLanguage } from '../../utility';
import {
  LANGUAGES,
  companyLegalInfo,
  pagoPALink,
  postLoginLinks,
  preLoginLinks,
} from '../../utility/costants';

type Props = {
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
      onLanguageChanged={changeLanguageHandler}
      currentLangCode={getSessionLanguage() as LangCode}
    />
  );
};

export default Footer;
