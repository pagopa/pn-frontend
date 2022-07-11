import { Footer as MuiFooter } from '@pagopa/mui-italia';

import {
  LANGUAGES,
  pagoPALink,
  companyLegalInfo,
  postLoginLinks,
  preLoginLinks,
} from '../../utils/costants';

const localizedPagoPALink = pagoPALink();

const Footer = () => (
  <MuiFooter
    loggedUser={true}
    companyLink={{
      ...localizedPagoPALink,
      onClick: () => window.open(localizedPagoPALink.href, '_blank'),
    }}
    legalInfo={companyLegalInfo()}
    postLoginLinks={postLoginLinks()}
    preLoginLinks={preLoginLinks()}
    languages={LANGUAGES}
    currentLangCode={'it'}
    onLanguageChanged={() => console.log('Language changed')}
  />
);

export default Footer;
