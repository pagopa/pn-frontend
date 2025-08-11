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

import { useRapidAccessParam } from '../hooks/useRapidAccessParam';
import { NotificationDetailRouteState } from '../models/NotificationDetail';
import { NotificationId } from '../models/Notifications';
import { PFEventsType } from '../models/PFEventsType';
import { useAppDispatch } from '../redux/hooks';
import { NOTIFICATION_ACTIONS, exchangeNotificationQrCode } from '../redux/notification/actions';
import { exchangeNotificationRetrievalId } from '../redux/sidemenu/actions';
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

/** 
  Il cittadino può accedere direttamente a SEND tramite:
  - QR code dell'aar:                            https://cittadini.notifichedigitali.it/?aar=123456
  - Messaggi di cortesia da app di terze parti:  https://cittadini.notifichedigitali.it/?retrievalId=123456 
*/
const RapidAccessGuard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('notifiche');
  const [fetchError, setFetchError] = useState(false);
  const rapidAccess = useRapidAccessParam();

  useEffect(() => {
    const { param, value } = rapidAccess || {};
    if (param && value) {
      void exchangeNotification(param, value);
    }
  }, [rapidAccess]);

  const exchangeNotification = async (param: AppRouteParams, value: string) => {
    try {
      // eslint-disable-next-line functional/no-let
      let path = '';
      if (param === AppRouteParams.AAR) {
        const notificationId = await dispatch(exchangeNotificationQrCode(value)).unwrap();
        path = notificationDetailPath(notificationId);
      }
      if (param === AppRouteParams.RETRIEVAL_ID) {
        const retrievalPayload = await dispatch(exchangeNotificationRetrievalId(value)).unwrap();
        path = GET_DETTAGLIO_NOTIFICA_PATH(retrievalPayload.originId!);
      }

      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_RAPID_ACCESS, { source: param });

      const state: NotificationDetailRouteState = { source: param };
      navigate(path, {
        replace: true,
        state,
      });
    } catch (e: any) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_NOTIFICATION_NOT_ALLOWED);
      setFetchError(true);
    }
  };

  const handleErrorQrCode = (e: AppResponse) => {
    // fix(12155): hide toast error when check aar api returns notification not found
    const error = e.errors ? e.errors[0] : null;
    if (error && error.code === ServerResponseErrorCode.PN_DELIVERY_NOTIFICATIONNOTFOUND) {
      return false;
    }
    return true;
  };

  useEffect(() => {
    AppResponsePublisher.error.subscribe(
      NOTIFICATION_ACTIONS.EXCHANGE_NOTIFICATION_QR_CODE,
      handleErrorQrCode
    );

    return () => {
      AppResponsePublisher.error.unsubscribe(
        NOTIFICATION_ACTIONS.EXCHANGE_NOTIFICATION_QR_CODE,
        handleErrorQrCode
      );
    };
  }, []);

  if (!rapidAccess || (fetchError && rapidAccess.param !== AppRouteParams.AAR)) {
    return <Outlet />;
  }

  if (fetchError) {
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
