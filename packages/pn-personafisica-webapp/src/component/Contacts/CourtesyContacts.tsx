import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { IllusSms } from '@pagopa/mui-italia';

import { DigitalAddress } from '../../models/contacts';
import CourtesyContactsList from './CourtesyContactsList';
import DigitalContactsCard from './DigitalContactsCard';

interface Props {
  recipientId: string;
  contacts: Array<DigitalAddress>;
}

const CourtesyContacts: React.FC<Props> = ({ recipientId, contacts }) => {
  const { t } = useTranslation(['common', 'recapiti']);

  return (
    <DigitalContactsCard
      sectionTitle={t('courtesy-contacts.title', { ns: 'recapiti' })}
      title={t('courtesy-contacts.subtitle', { ns: 'recapiti' })}
      subtitle={t('courtesy-contacts.description', { ns: 'recapiti' })}
      avatar={<IllusSms />}
    >
      <CourtesyContactsList recipientId={recipientId} contacts={contacts} />
      <Typography color="text.primary" fontWeight={400} fontSize={16}>
        {t('courtesy-contacts.io-enable', { ns: 'recapiti' })}
      </Typography>
    </DigitalContactsCard>
  );
};

export default CourtesyContacts;
