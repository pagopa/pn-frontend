import { Box } from '@mui/material';
import { Footer, HeaderAccount, RootLinkType } from '@pagopa/mui-italia';
import {
  companyLegalInfo,
  postLoginLinks,
  preLoginLinks,
  LANGUAGES,
  pagoPALink
} from '@pagopa-pn/pn-commons/src/utils/costants';

type Props = {
  children: any;
};

const localizedPagoPALink = pagoPALink();
const pagoPAHeaderLink: RootLinkType = {
  ...localizedPagoPALink,
  label: 'PagoPA S.p.A.',
  title: 'Sito di PagoPA S.p.A.'
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
    <Box bgcolor="#fafafa">{children}</Box>
    <Box>
      <Footer
        loggedUser={false}
        companyLink={{...localizedPagoPALink, onClick: () => window.open(localizedPagoPALink.href, '_blank')}}
        legalInfo={companyLegalInfo()}
        postLoginLinks={postLoginLinks()}
        preLoginLinks={preLoginLinks()}
        currentLangCode={'it'}
        onLanguageChanged={
          (/* newLang */) => {
            console.log('Changed Language');
          }
        }
        languages={LANGUAGES}
      />
    </Box>
  </Box>
);

export default Layout;
