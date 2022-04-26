import { Footer as MuiFooter } from '@pagopa/mui-italia';

import { companyLegalInfo, LANGUAGES, pagoPALink, postLoginLinks, preLoginLinks } from '../../utils/costants';

const Footer = () => {
  return (
    <MuiFooter
      loggedUser={true}
      companyLink={pagoPALink}
      legalInfo={companyLegalInfo}
      postLoginLinks={postLoginLinks}
      preLoginLinks={preLoginLinks}
      languages={LANGUAGES}
      currentLangCode={"it"}
      onLanguageChanged={() => console.log('Language changed')}
      onExit={(href: string) => {
        window.location.href = href;
      }}
    />
  );
};

export default Footer;
