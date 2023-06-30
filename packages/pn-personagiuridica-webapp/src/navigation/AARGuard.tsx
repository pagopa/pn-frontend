import { AccessDenied, LoadingPage, sanitizeString } from '@pagopa-pn/pn-commons';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { NotificationsApi } from '../api/notifications/Notifications.api';
import { NotificationId } from '../models/Notifications';
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

  // momentarily added for pn-5157
  const storedAar = localStorage.getItem(DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM);

  const aar = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    // momentarily updated for pn-5157
    const queryAar = queryParams.get(DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM);
    if (queryAar) {
      return queryAar;
    }
    // get from localstorage
    if (storedAar) {
      return sanitizeString(storedAar);
    }
    return null;
  }, [location.search, storedAar]);

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
    // momentarily updated for pn-5157
    void fetchNotificationFromQrCode().then(() =>
      localStorage.removeItem(DETTAGLIO_NOTIFICA_QRCODE_QUERY_PARAM)
    );
  }, [aar]);

  useEffect(() => {
    if (notificationId) {
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
    return (
      <AccessDenied
        message={t('from-qrcode.not-found')}
        isLogged={true}
        goToHomePage={() => navigate(NOTIFICHE, { replace: true })}
        goToLogin={() => {}}
      />
    );
  }

  return <LoadingPage />;
};

export default AARGuard;
