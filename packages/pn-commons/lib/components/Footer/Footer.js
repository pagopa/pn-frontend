import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { Footer as MuiFooter } from '@pagopa/mui-italia';
import { LANGUAGES, companyLegalInfo, pagoPALink, postLoginLinks, preLoginLinks, } from '../../utility/costants';
const Footer = ({ onLanguageChanged = () => { }, loggedUser = false, hasTermsOfService }) => {
    const [currentLangCode, setCurrentLangCode] = useState('it');
    const localizedPagoPALink = pagoPALink();
    const changeLanguageHandler = (langCode) => {
        setCurrentLangCode(langCode);
        onLanguageChanged(langCode);
    };
    return (_jsx(MuiFooter, { loggedUser: loggedUser, companyLink: {
            ...localizedPagoPALink,
            onClick: () => window.open(localizedPagoPALink.href, '_blank'),
        }, legalInfo: companyLegalInfo(), postLoginLinks: postLoginLinks(), preLoginLinks: preLoginLinks(hasTermsOfService), languages: LANGUAGES, onLanguageChanged: changeLanguageHandler, currentLangCode: currentLangCode }));
};
export default Footer;
