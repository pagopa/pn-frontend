import { useState } from 'react';
import { Footer as MuiFooter } from '@pagopa/mui-italia';

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
};

const Footer = ({ onLanguageChanged = () => {}, loggedUser = false }: Props) => {
  const [currentLangCode, setCurrentLangCode] = useState<'it' | 'en'>('it');

  const changeLanguageHandler = (langCode: 'it' | 'en') => {
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
      preLoginLinks={preLoginLinks()}
      languages={LANGUAGES}
      onLanguageChanged={changeLanguageHandler}
      currentLangCode={currentLangCode}
    />
  );
}

export default Footer;
