import { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { NotificationsApi } from '../api/notifications/Notifications.api';
import { DETTAGLIO_NOTIFICA, DETTAGLIO_NOTIFICA_DELEGATO } from '../navigation/routes.const';


function notificationDetailPath(notificationId: { iun: string; mandateId?: string }): string {
  return notificationId.mandateId 
    ? DETTAGLIO_NOTIFICA_DELEGATO.replace(":mandateId", notificationId.mandateId).replace(":id", notificationId.iun)
    : DETTAGLIO_NOTIFICA.replace(":id", notificationId.iun);
}

/* eslint-disable-next-line arrow-body-style */
const NotificationFromQrCode = () => {
  const { qrcode } = useParams();
  const navigate = useNavigate();
  const [notificationFetched, setNotificationFetched] = useState(false);
  const [notificationId, setNotificationId] = useState<{ iun: string; mandateId?: string } | undefined>();

  useEffect(() => {
    const fetchNotificationFromQrCode = async () => {
      if (qrcode) {
        try {
          const fetchedData = await NotificationsApi.exchangeNotificationQrCode(qrcode);
          setNotificationId(fetchedData);
        } catch (err) {
          console.log(err);
        }
        setNotificationFetched(true);
      }
    };
    void fetchNotificationFromQrCode();
  }, [qrcode]); 

  useEffect(() => {
    if (notificationId) {
      navigate(notificationDetailPath(notificationId), { replace: true });
    }
  }, [notificationId]);

  return qrcode 
    ? (notificationFetched
        ? (notificationId 
            ? <div>Notification from QR code {qrcode} - will show notification with IUN {notificationId} ...</div>
            : <div>Problems when fetching IUN</div>
          )
        : <div>Waiting ...</div>
      )
    : <div>No QR code obtained</div>;
};

export default NotificationFromQrCode;
