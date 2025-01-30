import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

import {
  AccessDenied,
  AppResponse,
  AppResponsePublisher,
  AppRouteParams,
  IllusQuestion,
  LoadingPage,
} from '@pagopa-pn/pn-commons';

import { NotificationId } from '../models/Notifications';
import { PFEventsType } from '../models/PFEventsType';
import { useAppDispatch } from '../redux/hooks';
import {
  NOTIFICATION_ACTIONS,
  exchangeNotificationQrCode,
  exchangeNotificationRetrievalId,
} from '../redux/notification/actions';
import { ServerResponseErrorCode } from '../utility/AppError/types';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';
import {
  GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH,
  GET_DETTAGLIO_NOTIFICA_PATH,
  NOTIFICHE,
} from './routes.const';

function notificationDetailPath(notificationId: NotificationId): string {
  return notificationId.mandateId
    ? GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(notificationId.iun, notificationId.mandateId)
    : GET_DETTAGLIO_NOTIFICA_PATH(notificationId.iun);
}

const AARGuard = () => {
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(['notifiche']);
  const [fetchError, setFetchError] = useState(false);
  const [notificationId, setNotificationId] = useState<NotificationId | undefined>();

  const aar = params.get(AppRouteParams.AAR);
  const retrievalId = params.get(AppRouteParams.RETRIEVAL_ID);

  useEffect(() => {
    if (aar) {
      const fetchNotificationFromQrCode = () =>
        dispatch(exchangeNotificationQrCode({ aarQrCodeValue: aar }))
          .unwrap()
          .then((notification) => {
            if (notification) {
              setNotificationId(notification);
            }
          })
          .catch(() => {
            setFetchError(true);
          });
      void fetchNotificationFromQrCode();
    }

    if (retrievalId) {
      const fetchNotificationFromRetrievalId = () =>
        dispatch(exchangeNotificationRetrievalId({ retrievalId }))
          .unwrap()
          .then((notification) => {
            if (notification) {
              setNotificationId(notification);
            }
          })
          .catch(() => {
            setFetchError(true);
          });
      void fetchNotificationFromRetrievalId();
    }
  }, [aar, retrievalId]);

  const handleError = (e: AppResponse) => {
    const error = e.errors ? e.errors[0] : null;
    if (error && error.code === ServerResponseErrorCode.PN_DELIVERY_NOTIFICATIONNOTFOUND) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    AppResponsePublisher.error.subscribe(
      NOTIFICATION_ACTIONS.EXCHANGE_NOTIFICATION_QR_CODE,
      handleError
    );
    AppResponsePublisher.error.subscribe(
      NOTIFICATION_ACTIONS.EXCHANGE_NOTIFICATION_RETRIEVAL_ID,
      handleError
    );

    return () => {
      AppResponsePublisher.error.unsubscribe(
        NOTIFICATION_ACTIONS.EXCHANGE_NOTIFICATION_QR_CODE,
        handleError
      );
      AppResponsePublisher.error.unsubscribe(
        NOTIFICATION_ACTIONS.EXCHANGE_NOTIFICATION_RETRIEVAL_ID,
        handleError
      );
    };
  }, []);

  useEffect(() => {
    if (notificationId) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_RAPID_ACCESS);
      navigate(notificationDetailPath(notificationId), {
        replace: true,
        state: { fromQrCode: true }, // TODO differenziamo tra qr code e retrievalId?
      });
    }
  }, [notificationId]);

  if (!aar || !retrievalId) {
    return <Outlet />;
  }
  if (fetchError) {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_NOTIFICATION_NOT_ALLOWED);
    return (
      <AccessDenied
        icon={<IllusQuestion />}
        message={t('from-qrcode.not-found')}
        subtitle={t('from-qrcode.not-found-subtitle')}
        isLogged={true}
        goToHomePage={() => navigate(NOTIFICHE, { replace: true })}
        goToLogin={() => {}}
      />
    );
  }

  return <LoadingPage />;
};

export default AARGuard;
