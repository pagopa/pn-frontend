import { AccessDenied, LoadingPage } from '@pagopa-pn/pn-commons';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from "react-router-dom";
import { NotificationsApi } from '../api/notifications/Notifications.api';
import { NotificationId } from '../models/Notifications';
import { GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH, GET_DETTAGLIO_NOTIFICA_PATH, NOTIFICHE } from '../navigation/routes.const';


function notificationDetailPath(notificationId: NotificationId): string {
  return notificationId.mandateId 
    ? GET_DETTAGLIO_NOTIFICA_DELEGATO_PATH(notificationId.iun, notificationId.mandateId)
    : GET_DETTAGLIO_NOTIFICA_PATH(notificationId.iun);
}

/* eslint-disable-next-line arrow-body-style */
const NotificationFromQrCode = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(['notifiche']);
  const [fetchError, setFetchError] = useState(false);
  const [notificationId, setNotificationId] = useState<NotificationId | undefined>();

  const qrcode = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get("aar");
  }, [location]);

  useEffect(() => {
    const fetchNotificationFromQrCode = async () => {
      if (qrcode) {
        try {
          const fetchedData = await NotificationsApi.exchangeNotificationQrCode(qrcode);
          setNotificationId(fetchedData);
        } catch {
          setFetchError(true);
        }
      }
    };
    void fetchNotificationFromQrCode();
  }, [qrcode]); 

  useEffect(() => {
    if (notificationId) {
      navigate(notificationDetailPath(notificationId), { replace: true, state: { fromQrCode: true } });
    }
  }, [notificationId]);

  return notificationId 
    ? <div />     // in questo caso si fa la redirect verso il dettaglio notifica
    : (fetchError 
      ? <AccessDenied
          message={t('from-qrcode.not-found')}
          isLogged={true}
          goToHomePage={() => navigate(NOTIFICHE, {replace: true})}
          goToLogin={() => {}}
        />
      : <LoadingPage />);
};

export default NotificationFromQrCode;
