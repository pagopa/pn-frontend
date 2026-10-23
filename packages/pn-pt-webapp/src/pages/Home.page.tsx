import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';

const Home: React.FC = () => {
  const { t } = useTranslation(['common']);

  return (
    <Box p={3} data-testid="homePage">
      <TitleBox
        title={t('home.title')}
        subTitle={t('home.subtitle')}
        variantTitle="h4"
        variantSubTitle="body1"
      />
    </Box>
  );
};

export default Home;
