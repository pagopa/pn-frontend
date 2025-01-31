import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';

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
import { useRapidAccessParam } from './navigation.utility';
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

const RapidAccessActions = {
  [AppRouteParams.AAR]: exchangeNotificationQrCode,
  [AppRouteParams.RETRIEVAL_ID]: exchangeNotificationRetrievalId,
};

/** 
  Il cittadino può accedere direttamente a SEND tramite:
  - QR code dell'aar:                            https://cittadini.notifichedigitali.it/?aar=123456
  - Messaggi di cortesia da app di terze parti:  https://cittadini.notifichedigitali.it/?retrievalId=123456 
*/
const RapidAccessGuard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(['notifiche']);
  const [fetchError, setFetchError] = useState(false);
  const [notificationId, setNotificationId] = useState<NotificationId | undefined>();
  const rapidAccess = useRapidAccessParam();

  useEffect(() => {
    const [type, value] = rapidAccess || [];
    if (!type || !value) {
      return;
    }

    dispatch(RapidAccessActions[type](value))
      .unwrap()
      .then((notification) => {
        if (notification) {
          setNotificationId(notification);
        }
      })
      .catch(() => {
        setFetchError(true);
      });
  }, [rapidAccess]);

  const handleError = (e: AppResponse) => {
    const error = e.errors ? e.errors[0] : null;
    if (error && error.code === ServerResponseErrorCode.PN_DELIVERY_NOTIFICATIONNOTFOUND) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    AppResponsePublisher.error.subscribe(
      NOTIFICATION_ACTIONS.EXCHANGE_NOTIFICATION_RAPID_ACCESS,
      handleError
    );

    return () => {
      AppResponsePublisher.error.unsubscribe(
        NOTIFICATION_ACTIONS.EXCHANGE_NOTIFICATION_RAPID_ACCESS,
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

  if (!rapidAccess) {
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

export default RapidAccessGuard;
