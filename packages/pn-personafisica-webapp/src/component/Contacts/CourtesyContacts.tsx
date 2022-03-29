import { IllusSms  } from "@pagopa/mui-italia";
import { useTranslation } from "react-i18next";
import CourtesyContactsList from "./CourtesyContactsList";
import DigitalContactsCard from "./DigitalContactsCard";

const CourtesyContacts = () => {
  
  const { t } = useTranslation(['common', 'recapiti']);

  return (
    <DigitalContactsCard
      sectionTitle={t('courtesy-contacts.title', { ns: 'recapiti' })}
      title={t('courtesy-contacts.subtitle', { ns: 'recapiti' })}
      subtitle={t('courtesy-contacts.description', { ns: 'recapiti' })}
      avatar={<IllusSms  />}
    >
      <CourtesyContactsList />
    </DigitalContactsCard>
  );
};

export default CourtesyContacts;