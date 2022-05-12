import { Box } from '@mui/material';
import { Footer, Header } from '@pagopa/selfcare-common-frontend';
import { ENV } from '../utils/env';

type Props = {
  children: any;
};

const Layout = ({ children }: Props) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}
  >
    <Header withSecondHeader={false} onExitAction={null} />
    {children}
    <Box mt={16}>
      <Footer assistanceEmail={ENV.ASSISTANCE.ENABLE ? ENV.ASSISTANCE.EMAIL : undefined} />
    </Box>
  </Box>
);

export default Layout;
