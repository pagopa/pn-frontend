import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Drawer, IconButton, Link, Stack, Typography } from '@mui/material';
import { MIAlert } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import { EventPaymentRecipientType } from '../../models';
import {
  NotificationCostDetails,
  NotificationCostDetailsStatus,
} from '../../models/NotificationDetail';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import CostsBreakdown from './CostDetailsDrawerContent/CostsBreakdown';
import ErrorDataDrawerContent from './CostDetailsDrawerContent/ErrorData';
import UnavailableDataDrawerContent from './CostDetailsDrawerContent/UnavailableData';

const costDetails: NotificationCostDetails = {
  status: NotificationCostDetailsStatus.OK,
  totalCost: 1050,
  baseCost: 200,
  analogCost: 850,
  numberOfAnalogCost: 1,
};

type Props = {
  landingSiteUrl: string;
  handleTrackEventFn: (event: EventPaymentRecipientType, param?: object) => void;
};

const NotificationCostsDetailDrawer: React.FC<Props> = ({ handleTrackEventFn }) => {
  // todo - spostare in conf?
  const notificationCostCacLink = `https://assistenza.notifichedigitali.it/hc/it/articles/33545157719441-Cosa-sono-i-costi-di-notifica`;

  const [openDrawer, setOpenDrawer] = useState(false);

  const isMobile = useIsMobile();

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const getDrawerContent = () => {
    switch (costDetails.status) {
      case NotificationCostDetailsStatus.OK:
        return <CostsBreakdown costDetails={costDetails} />;
      case NotificationCostDetailsStatus.ERROR:
        return <ErrorDataDrawerContent />;
      case NotificationCostDetailsStatus.UNAVAILABLE:
        return <UnavailableDataDrawerContent />;
      default:
        return <UnavailableDataDrawerContent />;
    }
  };

  return (
    <>
      <MIAlert
        severity="info"
        description={getLocalizedOrDefaultLabel('notifications', 'notification-alert.description')}
        action={{
          label: getLocalizedOrDefaultLabel('notifications', 'notification-alert.cta'),
          onClick: toggleDrawer,
        }}
      />

      <Drawer
        open={openDrawer}
        anchor={isMobile ? 'bottom' : 'right'}
        PaperProps={{
          sx: { maxWidth: { xs: '100%', lg: '500px' } },
        }}
      >
        <Stack padding={3} spacing={2}>
          <Stack direction="row" display="flex" alignItems="center" justifyContent="space-between">
            <Typography fontSize="18px" fontWeight="bold">
              {getLocalizedOrDefaultLabel('notifications', 'notification-alert.details.title')}
            </Typography>
            <IconButton aria-label="close" onClick={toggleDrawer}>
              <CloseIcon sx={{ color: 'action.active', fontSize: '24px' }} />
            </IconButton>
          </Stack>

          <Stack spacing={3}>
            <Typography variant="body1" color="#555C70" fontSize="16px">
              {getLocalizedOrDefaultLabel(
                'notifications',
                'notification-alert.details.description'
              )}
              <br />
              <Link
                href={notificationCostCacLink}
                onClick={() =>
                  handleTrackEventFn(EventPaymentRecipientType.SEND_MULTIPAYMENT_MORE_INFO)
                }
                target="_blank"
                fontSize="16px"
                fontWeight={600}
                sx={{ cursor: 'pointer' }}
                data-testid="faqNotificationCosts"
              >
                {getLocalizedOrDefaultLabel(
                  'notifications',
                  'notification-alert.details.how-they-work'
                )}
              </Link>
            </Typography>

            {getDrawerContent()}
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
};

export default NotificationCostsDetailDrawer;
