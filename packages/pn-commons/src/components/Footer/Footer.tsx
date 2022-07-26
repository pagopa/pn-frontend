import { Footer as MuiFooter } from '@pagopa/mui-italia';
import {
  companyLegalInfo,
  LANGUAGES,
  pagoPALink,
  postLoginLinks,
  preLoginLinks,
} from '../../utils/costants';

type Props = {
  /** Event tracking callback on change language */
  eventTrackingCallbackChangeLanguage?: () => void;
}
const Footer = ({
  eventTrackingCallbackChangeLanguage
}: Props) => {
  const handleOnChangeLanguage = () => {
    if (eventTrackingCallbackChangeLanguage) eventTrackingCallbackChangeLanguage();
    console.log('Language changed');
  };

  return (
    <MuiFooter
      loggedUser={true}
      companyLink={{...pagoPALink, onClick: () => window.open(pagoPALink.href, '_blank')}}
      legalInfo={companyLegalInfo}
      postLoginLinks={postLoginLinks}
      preLoginLinks={preLoginLinks}
      languages={LANGUAGES}
      currentLangCode={'it'}
      onLanguageChanged={handleOnChangeLanguage}
    />
  )
};

export default Footer;
