import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';

const Home: React.FC = () => {
  const { t } = useTranslation(['common']);

  return (
    <Box p={3} data-testid="homePage">
      <Typography variant="h4">{t('home.title')}</Typography>
    </Box>
  );
};

export default Home;
