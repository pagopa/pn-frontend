import { useState } from 'react';
import { Footer as MuiFooter } from '@pagopa/mui-italia';

import {
  LANGUAGES,
  pagoPALink,
  companyLegalInfo,
  postLoginLinks,
  preLoginLinks,
} from '../../utils/costants';
import { AppType } from "../../types/AppType";

const localizedPagoPALink = pagoPALink();

type Props = {
  onLanguageChanged?: (langCode: string) => void;
  loggedUser?: boolean;
  /** Event tracking callback on change language */
  eventTrackingCallbackChangeLanguage?: () => void;
  appType: AppType;
};

const Footer = ({ onLanguageChanged = () => {}, loggedUser = false, eventTrackingCallbackChangeLanguage, appType }: Props) => {
  const [currentLangCode, setCurrentLangCode] = useState<'it' | 'en'>('it');

  const changeLanguageHandler = (langCode: 'it' | 'en') => {
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
      postLoginLinks={postLoginLinks(appType)}
      preLoginLinks={preLoginLinks()}
      languages={LANGUAGES}
      onLanguageChanged={changeLanguageHandler}
      currentLangCode={currentLangCode}
    />
  );
};

export default Footer;
