import {Box, Stack} from "@mui/material";
import { HeaderAccount, Footer } from "@pagopa/mui-italia";
import {ReactNode} from "react";
import {LANGUAGES, pagoPALink, companyLegalInfo, postLoginLinks, preLoginLinks} from "@pagopa-pn/pn-commons/src/utils/costants";

interface Props {
    children?: ReactNode;
}


const LandingLayout = ({children}: Props) => {
    const homeLink = {
        label: 'PagoPA S.p.A.',
        href: '#',
        ariaLabel: 'Titolo',
        title: 'PagoPa S.p.A.'
    };

    const handleAssistanceClick = () => {
        console.log('go to assistance');
    };

    return (
        <Box sx={{ height: '100vh' }}>
            <Stack
                direction="column"
                sx={{ minHeight: '100vh'}} // 100vh per sticky footer
            >
                <HeaderAccount rootLink={homeLink} onAssistanceClick={handleAssistanceClick} />
                <Box
                  sx={{ flexGrow: 1 }}
                  component="main"
                >
                    {children}
                </Box>
                <Footer
                    loggedUser={false}
                    companyLink={{...pagoPALink, onClick: () => window.open(pagoPALink.href, '_blank')}}
                    legalInfo={companyLegalInfo}
                    postLoginLinks={postLoginLinks}
                    preLoginLinks={preLoginLinks}
                    currentLangCode={'it'}
                    onLanguageChanged={
                        (/* newLang */) => {
                            console.log('Changed Language');
                        }
                    }
                    languages={LANGUAGES}
                />
            </Stack>
        </Box>);
};

export default LandingLayout;