import { Footer as MuiFooter } from '@pagopa/mui-italia';

import {
  companyLegalInfo,
  LANGUAGES,
  pagoPALink,
  postLoginLinks,
  preLoginLinks,
} from '../../utils/costants';

const Footer = ({ onLanguageChanged }: { onLanguageChanged: (langCode: string) => void }) => (
  <MuiFooter
    loggedUser={true}
    companyLink={{ ...pagoPALink, onClick: () => window.open(pagoPALink.href, '_blank') }}
    legalInfo={companyLegalInfo}
    postLoginLinks={postLoginLinks}
    preLoginLinks={preLoginLinks}
    languages={LANGUAGES}
    onLanguageChanged={onLanguageChanged}
  />
);

export default Footer;
