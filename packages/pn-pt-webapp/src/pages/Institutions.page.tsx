import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';
import { MIAlert } from '@pagopa/mui-italia';

const InstitutionsPage: React.FC = () => {
  const { t } = useTranslation('enti');

  return (
    <Box p={3} data-testid="institutionsPage">
      <TitleBox
        title={t('title')}
        subTitle={t('subtitle')}
        variantTitle="h4"
        variantSubTitle="body1"
      />

      <MIAlert severity="info" sx={{ mt: 2 }} data-testid="work-in-progress-alert">
        {t('work-in-progress')}
      </MIAlert>
    </Box>
  );
};

export default InstitutionsPage;
