import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AccessDenied, IllusQuestion, LoadingPage } from '@pagopa-pn/pn-commons';

import { NotificationId } from '../models/Notifications';
import { PFEventsType } from '../models/PFEventsType';
import { useAppDispatch } from '../redux/hooks';
import { exchangeNotificationQrCode } from '../redux/notification/actions';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';
import {
  DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM,
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
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(['notifiche']);
  const [fetchError, setFetchError] = useState(false);
  const [notificationId, setNotificationId] = useState<NotificationId | undefined>();

  const aar = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM);
  }, [location]);

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
  }, [aar]);

  useEffect(() => {
    if (notificationId) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_RAPID_ACCESS);
      navigate(notificationDetailPath(notificationId), {
        replace: true,
        state: { fromQrCode: true },
      });
    }
  }, [notificationId]);

  if (!aar) {
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
