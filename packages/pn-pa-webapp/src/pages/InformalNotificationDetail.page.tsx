import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import { PnBreadcrumb, TitleBox } from '@pagopa-pn/pn-commons';

import * as routes from '../navigation/routes.const';

const InformalNotificationDetail: React.FC = () => {
  const { t } = useTranslation(['common', 'notifiche']);

  return (
    <Box sx={{ p: { xs: 3, lg: 0 } }}>
      <PnBreadcrumb
        linkRoute={routes.DASHBOARD}
        linkLabel={t('detail.breadcrumb-root', { ns: 'notifiche' })}
        currentLocationLabel="Dettaglio comunicazione bonaria"
        goBackLabel={t('button.indietro', { ns: 'common' })}
      />

      <TitleBox
        variantTitle="h4"
        title="Avviso di pagamento per la fornitura idrica"
        sx={{ pt: 3, mb: 2 }}
        mbTitle={0}
      />

      <Typography variant="body1" mb={{ xs: 3, md: 4 }} sx={{ overflowWrap: 'anywhere' }}>
        Questa è una comunicazione bonaria di esempio.
      </Typography>
    </Box>
  );
};

export default InformalNotificationDetail;
