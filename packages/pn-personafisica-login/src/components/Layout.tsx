import { Box } from '@mui/material';
import { Footer, HeaderAccount, RootLinkType } from '@pagopa/mui-italia';
import {
  companyLegalInfo,
  postLoginLinks,
  preLoginLinks,
} from '@pagopa-pn/pn-commons/src/utils/costants';

type Props = {
  children: any;
};

const pagoPALink: any = {
  href: 'https://www.pagopa.it/it/',
  ariaLabel: 'Link: vai al sito di PagoPA S.p.A.',
};

const pagoPAHeaderLink: RootLinkType = {
  ...pagoPALink,
  label: 'PagoPA S.p.A.',
  title: 'Sito di PagoPA S.p.A.',
};

const LANGUAGES = {
  it: { it: 'Italiano', en: 'Inglese' },
  en: { it: 'Italian', en: 'English' },
};

const Layout = ({ children }: Props) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
  >
    <HeaderAccount
      enableLogin={false}
      rootLink={pagoPAHeaderLink}
      onAssistanceClick={() => {
        console.log('Clicked/Tapped on Assistance');
      }}
    />
    <Box sx={{ backgroundColor: '#F2F2F2' }}>{children}</Box>
    <Box>
      <Footer
        loggedUser={false}
        companyLink={pagoPALink}
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
        onExit={(href, linkType) => {
          console.log('Clicked on exit', href, linkType);
        }}
      />
    </Box>
  </Box>
);

export default Layout;
