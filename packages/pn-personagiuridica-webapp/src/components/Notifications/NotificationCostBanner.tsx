import type { TFunction } from 'i18next';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import { Box } from '@mui/material';
import type { NotificationCostDetails } from '@pagopa-pn/pn-commons';
import {
  DeliveryOutcome,
  DeliveryOutcomeType,
  DigitalSource,
  NotificationCostDetailsStatus,
  formatEurocentToCurrency,
} from '@pagopa-pn/pn-commons';
import { Banner } from '@pagopa/mui-italia';

import { ChannelType, ContactOperation, ContactSource } from '../../models/contacts';
import * as routes from '../../navigation/routes.const';
import { contactsSelectors, setExternalEvent } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

type Props = {
  deliveryOutcome: DeliveryOutcome | null;
  notificationCost?: NotificationCostDetails;
  canManageContacts?: boolean;
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

  const source = deliveryOutcome.details?.source;

  switch (source) {
    case DigitalSource.PLATFORM:
      return 'digital_platform';
    case DigitalSource.SENDER:
      return 'digital_special';
    case DigitalSource.REGISTRY:
      return 'digital_registry';
    default:
      // Fallback: in some edge cases the backend statusHistory/elementId may not expose a recognizable
      // digitalAddressSource (or it can't be parsed), even if the deliveryOutcome is DIGITAL.
      // In that scenario we default to the "platform" copy as the safest generic digital message.
      return 'digital_platform';
  }
};

const showCost = (key: BannerKey) => key === 'analog' || key === 'digital_failure';

const getBannerMessage = (
  key: BannerKey,
  t: TFunction,
  notificationCost?: NotificationCostDetails
) => {
  if (!showCost(key)) {
    return t(`notification-cost-banner.${key}.message`);
  }

  if (
    notificationCost?.status === NotificationCostDetailsStatus.OK &&
    notificationCost.analogCost !== undefined
  ) {
    return t(`notification-cost-banner.${key}.message`, {
      analogCost: formatEurocentToCurrency(notificationCost.analogCost),
    });
  } else {
    return t(`notification-cost-banner.${key}.fallback`);
  }
};

const getBannerContent = (
  key: BannerKey,
  isDDomActive: boolean,
  canManageContacts: boolean,
  t: TFunction,
  notificationCost?: NotificationCostDetails
): BannerContent => {
  const title = t(`notification-cost-banner.${key}.title`);
  const message = getBannerMessage(key, t, notificationCost);

  if (key === 'digital_platform' || isDDomActive || !canManageContacts) {
    return { title, message };
  }

  const isExternalPec =
    key === 'digital_special' || key === 'digital_registry' || key === 'digital_failure';

  const getEnableSercqMessage = () => {
    if (key === 'analog') {
      return t('notification-cost-banner.enable-sercq.message.analog');
    } else {
      return isExternalPec
        ? t('notification-cost-banner.enable-sercq.message.external-pec')
        : t('notification-cost-banner.enable-sercq.message.default');
    }
  };
  const ctaLabel = t('notification-cost-banner.enable-sercq.cta');

  return {
    title,
    message: `${message} ${getEnableSercqMessage()}`,
    ctaLabel,
  };
};

export const NotificationCostBanner: React.FC<Props> = ({
  deliveryOutcome,
  notificationCost,
  canManageContacts = false,
}) => {
  const { defaultSERCQ_SENDAddress, defaultPECAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const isDDomActive = Boolean(defaultSERCQ_SENDAddress || defaultPECAddress);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche']);

  const bannerKey = resolveBannerKey(deliveryOutcome);
  const { title, message, ctaLabel } = getBannerContent(
    bannerKey,
    isDDomActive,
    canManageContacts,
    t,
    notificationCost
  );

  const handleActivateDigitalDomicile = useCallback(() => {
    navigate(routes.DIGITAL_DOMICILE_ACTIVATION);

    dispatch(
      setExternalEvent({
        destination: ChannelType.SERCQ_SEND,
        source: ContactSource.DETTAGLIO_NOTIFICA,
        operation: ContactOperation.ADD,
      })
    );
  }, [dispatch, navigate]);

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
      />
    </Box>
  );
};
