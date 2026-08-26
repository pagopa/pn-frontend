import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import { TitleBox } from '@pagopa-pn/pn-commons';
import { MIBreadcrumbItem, MIBreadcrumbs } from '@pagopa/mui-italia';

import * as routes from '../navigation/routes.const';

const InformalNotificationDetail: React.FC = () => {
  const { t } = useTranslation(['common', 'notifiche']);

  return (
    <Box sx={{ p: { xs: 3, lg: 0 } }}>
      <MIBreadcrumbs>
        <MIBreadcrumbItem
          label={t('detail.breadcrumb-root', { ns: 'notifiche' })}
          href={routes.DASHBOARD}
        />
        <MIBreadcrumbItem label="Dettaglio comunicazione bonaria" current />
      </MIBreadcrumbs>

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
