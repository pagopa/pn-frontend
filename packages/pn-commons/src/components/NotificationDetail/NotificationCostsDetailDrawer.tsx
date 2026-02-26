import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Alert, Drawer, IconButton, Link, Stack, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import { EventPaymentRecipientType } from '../../models';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import CostsBreakdown from './CostDetailsDrawerContent/CostsBreakdown';
import ErrorDataDrawerContent from './CostDetailsDrawerContent/ErrorData';
import UnavailableDataDrawerContent from './CostDetailsDrawerContent/UnavailableData';

interface CostDetails {
  status: 'OK' | 'UNAVAILABLE' | 'ERROR';
  totalCost?: number;
  baseCost?: number;
  firstAnalogCost?: {
    cost: number;
    productType: string;
  };
  secondAnalogCost?: {
    cost: number;
    productType: string;
  };
  simpleRegisteredLetterCost?: {
    cost: number;
    productType: string;
  };
}

const costDetails: CostDetails = {
  status: 'OK',
  totalCost: 2450,
  baseCost: 200,
  firstAnalogCost: {
    cost: 1150,
    productType: 'A/R',
  },
  secondAnalogCost: {
    cost: 1100,
    productType: 'A/R',
  },
};

type Props = {
  landingSiteUrl: string;
  handleTrackEventFn: (event: EventPaymentRecipientType, param?: object) => void;
};

const NotificationCostsDetailAlert = ({ toggleDrawer }: { toggleDrawer: () => void }) => (
  <Alert severity="info">
    <Typography fontSize="16px" mb={2}>
      {getLocalizedOrDefaultLabel(
        'notifications',
        'notification-alert.description',
        'L’importo comprende i costi di notifica.'
      )}
    </Typography>

    <ButtonNaked sx={{ fontSize: '16px', color: '#215C76' }} onClick={toggleDrawer}>
      {getLocalizedOrDefaultLabel(
        'notifications',
        'notification-alert.cta',
        'Cosa sono?'
      )}
    </ButtonNaked>
  </Alert>
);

const NotificationCostsDetailDrawer: React.FC<Props> = ({ landingSiteUrl, handleTrackEventFn }) => {
  const FAQ_NOTIFICATION_COSTS = '/faq#costi-di-notifica';
  const notificationCostsFaqLink = `${landingSiteUrl}${FAQ_NOTIFICATION_COSTS}`;

  const [openDrawer, setOpenDrawer] = useState(false);

  const isMobile = useIsMobile();

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const getDrawerContent = () => {
    switch (costDetails.status) {
      case 'OK':
        return <CostsBreakdown costDetails={costDetails} />;
      case 'ERROR':
        return <ErrorDataDrawerContent />;
      case 'UNAVAILABLE':
        return <UnavailableDataDrawerContent />;
      default:
        return <UnavailableDataDrawerContent />;
    }
  };

  return (
    <>
      <NotificationCostsDetailAlert toggleDrawer={toggleDrawer} />

      <Drawer
        open={openDrawer}
        anchor={isMobile ? 'bottom' : 'right'}
        PaperProps={{
          sx: { maxWidth: { xs: '100%', lg: '500px' } },
        }}
      >
        <Stack padding={3} spacing={2}>
          <Stack direction="row" display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontSize="18px" fontWeight={700}>
              {getLocalizedOrDefaultLabel(
                'notifications',
                'notification-alert.details.title',
                'Cosa sono i costi di notifica?'
              )}
            </Typography>
            <IconButton aria-label="close" onClick={toggleDrawer}>
              <CloseIcon fontSize="medium" sx={{ color: 'action.active' }} />
            </IconButton>
          </Stack>

          <Stack spacing={3}>
            <Typography variant="body1" color="#555C70" fontSize="16px">
              Sono le spese sostenute per inviarti la comunicazione, che variano a seconda della
              modalità con cui la ricevi.
              <br />
              <Link
                href={notificationCostsFaqLink}
                onClick={() =>
                  handleTrackEventFn(EventPaymentRecipientType.SEND_MULTIPAYMENT_MORE_INFO)
                }
                target="_blank"
                fontSize="16px"
                fontWeight={500}
                sx={{ cursor: 'pointer' }}
                data-testid="faqNotificationCosts"
              >
                Come funzionano i costi di notifica?
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
