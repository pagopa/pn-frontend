import type { TFunction } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import { Box } from '@mui/material';
import {
  DeliveryOutcome,
  DeliveryOutcomeType,
  DigitalDomicileType,
  DigitalSource,
  EventAction,
  formatEurocentToCurrency,
} from '@pagopa-pn/pn-commons';
import {
  NotificationCostDetails,
  NotificationCostDetailsStatus,
} from '@pagopa-pn/pn-commons/src/models/NotificationDetail';
import { Banner } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import {
  ChannelType,
  ContactOperation,
  ContactSource,
  RouteDestination,
} from '../../models/contacts';
import * as routes from '../../navigation/routes.const';
import { contactsSelectors, setExternalEvent } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';

type Props = {
  deliveryOutcome: DeliveryOutcome | null;
  notificationCost?: NotificationCostDetails;
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
  t: TFunction,
  notificationCost?: NotificationCostDetails
): BannerContent => {
  const title = t(`notification-cost-banner.${key}.title`);
  const message = getBannerMessage(key, t, notificationCost);

  if (key === 'digital_platform' || isDDomActive) {
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

export const NotificationCostBanner: React.FC<Props> = ({ deliveryOutcome, notificationCost }) => {
  const { defaultSERCQ_SENDAddress, defaultPECAddress, addresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const isDDomActive = Boolean(defaultSERCQ_SENDAddress || defaultPECAddress);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['notifiche', 'recapiti', 'common']);
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => setIsVisible(false);

  const bannerKey = resolveBannerKey(deliveryOutcome);
  const { title, message, ctaLabel } = getBannerContent(
    bannerKey,
    isDDomActive,
    t,
    notificationCost
  );
  const showCta = !(bannerKey === 'digital_platform' || isDDomActive);

  const triggerMixpanelEvent = (name: PFEventsType, type: EventAction) => {
    PFEventStrategyFactory.triggerEvent(name, {
      event_type: type,
      banner_id: mapBannerIds[bannerKey],
      banner_page: ContactSource.DETTAGLIO_NOTIFICA,
      banner_landing: showCta ? RouteDestination.DIGITAL_DOMICILE_ACTIVATION : 'not_set',
    });
  };

  const handleActivateDigitalDomicile = useCallback(() => {
    triggerMixpanelEvent(PFEventsType.SEND_TAP_BANNER, EventAction.ACTION);

    navigate(routes.DIGITAL_DOMICILE_ACTIVATION);

    dispatch(
      setExternalEvent({
        destination: ChannelType.SERCQ_SEND,
        source: ContactSource.DETTAGLIO_NOTIFICA,
        operation: ContactOperation.ADD,
      })
    );
  }, [addresses, dispatch, navigate]);

  const isDigital = deliveryOutcome?.type === DeliveryOutcomeType.DIGITAL;

  const mapBannerIds: Record<BannerKey, string> = {
    analog: 'savings_missed_analog_sent',
    viewed: 'savings_success_early_view',
    digital_failure: 'savings_missed_analog_sent',
    digital_platform:
      isDigital && deliveryOutcome.details.domicileType === DigitalDomicileType.SERCQ
        ? 'savings_success_sercq'
        : 'savings_success_sercq_pec',
    digital_special: 'savings_success_pec',
    digital_registry: 'savings_success_pec',
  };

  const handleBannerClose = () => {
    triggerMixpanelEvent(PFEventsType.SEND_CLOSE_BANNER, EventAction.ACTION);
    handleClose();
  };

  useEffect(() => {
    if (isVisible) {
      triggerMixpanelEvent(PFEventsType.SEND_BANNER, EventAction.SCREEN_VIEW);
    }
  }, []);

  if (!isVisible) {
    return null;
  }

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
        onClose={handleBannerClose}
        closeAriaLabel={t('button.close', { ns: 'common' })}
      />
    </Box>
  );
};
