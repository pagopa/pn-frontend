import { FormControlLabel, Switch } from "@mui/material";
import { IllusSms  } from "@pagopa/mui-italia";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CourtesyContactsList from "./CourtesyContactsList";
import DigitalContactsCard from "./DigitalContactsCard";

const CourtesyContacts = () => {
  const [isIoNotificationEnabled, setIsIoNotificationEnabled] = useState(false);

  const handleToggleIoNotification = () => {
    setIsIoNotificationEnabled(prevState => !prevState);
    // 2DO Adding enable/disable logic waiting for further specifications
  };
  
  const { t } = useTranslation(['common', 'recapiti']);

  return (
    <DigitalContactsCard
      sectionTitle={t('courtesy-contacts.title', { ns: 'recapiti' })}
      title={t('courtesy-contacts.subtitle', { ns: 'recapiti' })}
      subtitle={t('courtesy-contacts.description', { ns: 'recapiti' })}
      avatar={<IllusSms  />}
    >
      <CourtesyContactsList />
      <FormControlLabel
        control={
          <Switch checked={isIoNotificationEnabled} onChange={handleToggleIoNotification} name="ioNotifications" disabled />
        }
        label={t('courtesy-contacts.io-enable', { ns: 'recapiti' }) as string}
      />
    </DigitalContactsCard>
  );
};

export default CourtesyContacts;