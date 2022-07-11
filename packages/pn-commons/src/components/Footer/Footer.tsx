import { Footer as MuiFooter } from '@pagopa/mui-italia';

import useApplicationLinks from '../../hooks/useApplicationLinks';

const Footer = () => {
  const { LANGUAGES, pagoPALink, companyLegalInfo, postLoginLinks, preLoginLinks } = useApplicationLinks();
  return (
    <MuiFooter
      loggedUser={true}
      companyLink={{ ...pagoPALink, onClick: () => window.open(pagoPALink.href, '_blank') }}
      legalInfo={companyLegalInfo}
      postLoginLinks={postLoginLinks}
      preLoginLinks={preLoginLinks}
      languages={LANGUAGES}
      currentLangCode={'it'}
      onLanguageChanged={() => console.log('Language changed')}
    />
  );
};

export default Footer;
