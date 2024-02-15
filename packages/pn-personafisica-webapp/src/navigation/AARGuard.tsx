import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AccessDenied, IllusQuestion, LoadingPage } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../api/notifications/Notifications.api';
import { NotificationId } from '../models/Notifications';
import { trackEventByType } from '../utility/mixpanel';
import { TrackEventType } from '../utility/events';
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
  const navigate = useNavigate();
  const { t } = useTranslation(['notifiche']);
  const [fetchError, setFetchError] = useState(false);
  const [notificationId, setNotificationId] = useState<NotificationId | undefined>();

  const aar = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM);
  }, [location]);

  useEffect(() => {
    const fetchNotificationFromQrCode = async () => {
      if (aar) {
        try {
          const fetchedData = await NotificationsApi.exchangeNotificationQrCode(aar);
          setNotificationId(fetchedData);
        } catch {
          setFetchError(true);
        }
      }
    };
    void fetchNotificationFromQrCode();
  }, [aar]);

  useEffect(() => {
    if (notificationId) {
      trackEventByType(TrackEventType.SEND_RAPID_ACCESS);
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
    trackEventByType(TrackEventType.SEND_NOTIFICATION_NOT_ALLOWED);
    return (
      <AccessDenied
        icon={<IllusQuestion />}
        message={t('from-qrcode.not-found')}
        subtitle={t('from-qrcode.not-found-subtitle')}
        isLogged={true}
        goToHomePage={() => navigate(NOTIFICHE, { replace: true })}
        goToLogin={() => { }}
      />
    );
  }

  return <LoadingPage />;
};

export default AARGuard;
