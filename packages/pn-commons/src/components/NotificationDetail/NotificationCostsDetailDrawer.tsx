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
import UnavailableDataDrawerContent from './CostDetailsDrawerContent/UnavailableData';

type Props = {
  costDetails: NotificationCostDetails;
  costDetailsAssistanceLink: string;
  handleTrackEventFn: (event: EventPaymentRecipientType, param?: object) => void;
};

const NotificationCostsDetailDrawer: React.FC<Props> = ({
  costDetails,
  costDetailsAssistanceLink,
  handleTrackEventFn,
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const isMobile = useIsMobile();

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const getDrawerContent = () => {
    switch (costDetails.status) {
      case NotificationCostDetailsStatus.OK:
        return <CostsBreakdown costDetails={costDetails} />;
      case NotificationCostDetailsStatus.ERROR:
        return (
          <MIAlert
            severity="warning"
            description={getLocalizedOrDefaultLabel(
              'notifications',
              'notification-alert.details.error'
            )}
          />
        );
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
        data-testid="notification-costs-alert"
      />

      <Drawer
        open={openDrawer}
        anchor={isMobile ? 'bottom' : 'right'}
        PaperProps={{
          sx: { maxWidth: { xs: '100%', lg: '500px' } },
        }}
        data-testid="cost-details-drawer"
      >
        <Stack padding={3} spacing={2}>
          <Stack direction="row" display="flex" alignItems="center" justifyContent="space-between">
            <Typography fontSize="18px" fontWeight="bold" data-testid="cost-details-drawer-title">
              {getLocalizedOrDefaultLabel('notifications', 'notification-alert.details.title')}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={toggleDrawer}
              data-testid="cost-details-drawer-close"
            >
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
                href={costDetailsAssistanceLink}
                onClick={() =>
                  handleTrackEventFn(EventPaymentRecipientType.SEND_MULTIPAYMENT_MORE_INFO)
                }
                target="_blank"
                fontSize="16px"
                fontWeight={600}
                sx={{ cursor: 'pointer' }}
                data-testid="cost-details-drawer-assistance-link"
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
