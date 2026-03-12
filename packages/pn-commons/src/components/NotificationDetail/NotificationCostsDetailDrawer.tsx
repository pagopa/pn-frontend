import React, { useEffect, useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Drawer, IconButton, Link, Stack, Typography } from '@mui/material';
import { MIAlert } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import { EventAction, EventPaymentRecipientType } from '../../models';
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

const getDrawerContent = (costDetails: NotificationCostDetails) => {
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

const alertEventProperties = {
  banner_id: 'notification_expenses',
  banner_page: 'dettaglio_notifica',
  banner_landing: 'not_set',
};

const NotificationCostsDetailDrawer: React.FC<Props> = ({
  costDetails,
  costDetailsAssistanceLink,
  handleTrackEventFn,
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const isMobile = useIsMobile();

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  const handleOpenDrawer = () => {
    handleTrackEventFn(EventPaymentRecipientType.SEND_TAP_BANNER, {
      event_type: EventAction.ACTION,
      ...alertEventProperties,
    });

    handleTrackEventFn(EventPaymentRecipientType.SEND_NOTIFICATION_EXPENSES_DETAIL, {
      status: costDetails.status === NotificationCostDetailsStatus.ERROR ? 'error' : 'display',
    });

    setOpenDrawer(true);
  };

  const trackExternalLinkClickEvent = () => {
    handleTrackEventFn(EventPaymentRecipientType.SEND_TAP_EXTERNAL_LINK, {
      link: costDetailsAssistanceLink,
    });
  };

  useEffect(() => {
    handleTrackEventFn(EventPaymentRecipientType.SEND_BANNER, {
      event_type: EventAction.SCREEN_VIEW,
      ...alertEventProperties,
    });
  }, []);

  return (
    <>
      <MIAlert
        severity="info"
        description={getLocalizedOrDefaultLabel('notifications', 'notification-alert.description')}
        action={{
          label: getLocalizedOrDefaultLabel('notifications', 'notification-alert.cta'),
          onClick: handleOpenDrawer,
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
              onClick={handleCloseDrawer}
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
                onClick={trackExternalLinkClickEvent}
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

            {getDrawerContent(costDetails)}
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
};

export default NotificationCostsDetailDrawer;
