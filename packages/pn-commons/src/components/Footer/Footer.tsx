import { useState } from 'react';
import { Footer as MuiFooter } from '@pagopa/mui-italia';

import {
  companyLegalInfo,
  LANGUAGES,
  pagoPALink,
  postLoginLinks,
  preLoginLinks,
} from '../../utils/costants';

const Footer = ({ onLanguageChanged }: { onLanguageChanged: (langCode: string) => void }) => {
  const [currentLangCode, setCurrentLangCode] = useState<'it' | 'en'>('it');

  const changeLanguageHandler = (langCode: 'it' | 'en') => {
    setCurrentLangCode(langCode);
    onLanguageChanged(langCode);
  };
  
  return (
    <MuiFooter
      loggedUser={true}
      companyLink={{ ...pagoPALink, onClick: () => window.open(pagoPALink.href, '_blank') }}
      legalInfo={companyLegalInfo}
      postLoginLinks={postLoginLinks}
      preLoginLinks={preLoginLinks}
      languages={LANGUAGES}
      onLanguageChanged={changeLanguageHandler}
      currentLangCode={currentLangCode}
    />
  );
};

export default Footer;
