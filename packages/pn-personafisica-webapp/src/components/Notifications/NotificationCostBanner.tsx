import type { TFunction } from 'i18next';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import { Box } from '@mui/material';
import {
  DeliveryOutcome,
  DeliveryOutcomeType,
  DigitalSource,
  EventAction,
} from '@pagopa-pn/pn-commons';
import { Banner } from '@pagopa/mui-italia';

import { useBannerDismiss } from '../../hooks/useBannerDismiss';
import { PFEventsType } from '../../models/PFEventsType';
import { ChannelType, ContactOperation, ContactSource } from '../../models/contacts';
import * as routes from '../../navigation/routes.const';
import { contactsSelectors, setExternalEvent } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';

type Props = {
  deliveryOutcome: DeliveryOutcome | null;
};

type BannerContent = {
  title: string;
  message: string;
  ctaLabel?: string;
};

type BannerKey =
  | 'analog'
  | 'viewed'
  | 'digital_failure'
  | 'digital_platform'
  | 'digital_special'
  | 'digital_registry';

const resolveBannerKey = (deliveryOutcome: DeliveryOutcome | null): BannerKey => {
  if (!deliveryOutcome || deliveryOutcome.type === DeliveryOutcomeType.VIEWED) {
    return 'viewed';
  }

  if (deliveryOutcome.type === DeliveryOutcomeType.ANALOG) {
    return 'analog';
  }
  if (deliveryOutcome.type === DeliveryOutcomeType.DIGITAL_FAILURE) {
    return 'digital_failure';
  }

  switch (deliveryOutcome.details.source) {
    case DigitalSource.PLATFORM:
      return 'digital_platform';
    case DigitalSource.SENDER:
      return 'digital_special';
    case DigitalSource.REGISTRY:
      return 'digital_registry';
  }
};

const getBannerContent = (key: BannerKey, isDDomActive: boolean, t: TFunction): BannerContent => {
  const title = t(`notification-cost-banner.${key}.title`);
  const message = t(`notification-cost-banner.${key}.message`);

  if (key === 'digital_platform' || isDDomActive) {
    return { title, message };
  }

  const enableSercqMessage = t('notification-cost-banner.enable-sercq.message');
  const ctaLabel = t('notification-cost-banner.enable-sercq.cta');

  return {
    title,
    message: `${message} ${enableSercqMessage}`,
    ctaLabel,
  };
};

export const NotificationCostBanner: React.FC<Props> = ({ deliveryOutcome }) => {
  const { defaultSERCQ_SENDAddress, defaultPECAddress, addresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const isDDomActive = Boolean(defaultSERCQ_SENDAddress || defaultPECAddress);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche', 'recapiti', 'common']);
  const { open, handleClose } = useBannerDismiss();

  const handleActivateDigitalDomicile = useCallback(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_ENTER_FLOW, {
      event_type: EventAction.ACTION,
      addresses,
      source: ContactSource.DETTAGLIO_NOTIFICA,
    });

    navigate(routes.DIGITAL_DOMICILE_ACTIVATION);

    dispatch(
      setExternalEvent({
        destination: ChannelType.SERCQ_SEND,
        source: ContactSource.DETTAGLIO_NOTIFICA,
        operation: ContactOperation.ADD,
      })
    );
  }, [addresses, dispatch, navigate]);

  if (!open) {
    return null;
  }

  const bannerKey = resolveBannerKey(deliveryOutcome);
  const { title, message, ctaLabel } = getBannerContent(bannerKey, isDDomActive, t);

  return (
    <Box my={4}>
      <Banner
        data-testid="notificationCostBanner"
        variant="tertiary"
        color="info"
        icon={<SavingsOutlinedIcon fontSize="small" />}
        title={title}
        message={message}
        {...(ctaLabel && {
          cta: {
            label: ctaLabel,
            onClick: handleActivateDigitalDomicile,
          },
        })}
        onClose={handleClose}
        closeAriaLabel={t('button.close', { ns: 'common' })}
      />
    </Box>
  );
};
