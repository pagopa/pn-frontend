import { useState } from 'react';
import { Footer as MuiFooter, LangCode } from '@pagopa/mui-italia';

import {
  LANGUAGES,
  pagoPALink,
  companyLegalInfo,
  postLoginLinks,
  preLoginLinks,
} from '../../utils/costants';

const localizedPagoPALink = pagoPALink();

type Props = {
  onLanguageChanged?: (langCode: string) => void;
  loggedUser?: boolean;
  /** Event tracking callback on change language */
  eventTrackingCallbackChangeLanguage?: () => void;
  /** Enables the Terms of Service Link */
  hasTermsOfService?: boolean;
};

const Footer = ({ onLanguageChanged = () => {}, loggedUser = false, eventTrackingCallbackChangeLanguage, hasTermsOfService }: Props) => {
  const [currentLangCode, setCurrentLangCode] = useState<LangCode>('it');

  const changeLanguageHandler = (langCode: LangCode) => {
    if (eventTrackingCallbackChangeLanguage) {
      eventTrackingCallbackChangeLanguage();
    }
    setCurrentLangCode(langCode);
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
      preLoginLinks={preLoginLinks(hasTermsOfService)}
      languages={LANGUAGES}
      onLanguageChanged={changeLanguageHandler}
      currentLangCode={currentLangCode}
    />
  );
};

export default Footer;
