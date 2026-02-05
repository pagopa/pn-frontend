import type { TFunction } from 'i18next';
import { useCallback, useEffect } from 'react';
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
} from '@pagopa-pn/pn-commons';
import { Banner } from '@pagopa/mui-italia';

import { useBannerDismiss } from '../../hooks/useBannerDismiss';
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
    default:
      // Fallback: in some edge cases the backend statusHistory/elementId may not expose a recognizable
      // digitalAddressSource (or it can't be parsed), even if the deliveryOutcome is DIGITAL.
      // In that scenario we default to the "platform" copy as the safest generic digital message.
      return 'digital_platform';
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
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_TAP_BANNER, {
      event_type: EventAction.ACTION,
      banner_id: mapBannerIds[bannerKey],
      banner_page: ContactSource.DETTAGLIO_NOTIFICA,
      banner_landing: showCta ? RouteDestination.DIGITAL_DOMICILE_ACTIVATION : 'not_set',
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

  const bannerKey = resolveBannerKey(deliveryOutcome);
  const { title, message, ctaLabel } = getBannerContent(bannerKey, isDDomActive, t);
  const showCta = !(bannerKey === 'digital_platform' || isDDomActive);

  useEffect(() => {
    if (open) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_BANNER, {
        event_type: EventAction.SCREEN_VIEW,
        banner_id: mapBannerIds[bannerKey],
        banner_page: ContactSource.DETTAGLIO_NOTIFICA,
        banner_landing: showCta ? RouteDestination.DIGITAL_DOMICILE_ACTIVATION : 'not_set',
      });
    }
  }, []);

  if (!open) {
    return null;
  }

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
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_CLOSE_BANNER, {
      event_type: EventAction.ACTION,
      banner_id: mapBannerIds[bannerKey],
      banner_page: ContactSource.DETTAGLIO_NOTIFICA,
      banner_landing: showCta ? RouteDestination.DIGITAL_DOMICILE_ACTIVATION : 'not_set',
    });
    handleClose();
  };

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
