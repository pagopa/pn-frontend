import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import { IllusSms } from '@pagopa/mui-italia';

import { DigitalAddress } from '../../models/contacts';
import DigitalContactsCard from './DigitalContactsCard';

interface Props {
  recipientId: string;
  contacts: Array<DigitalAddress>;
}

const CourtesyContacts: React.FC<Props> = ({ recipientId, contacts }) => {
  const { t } = useTranslation(['common', 'recapiti']);

  return (
    <DigitalContactsCard
      sectionTitle={t('io-contact.title', { ns: 'recapiti' })}
      title={t('io-contact.subtitle', { ns: 'recapiti' })}
      subtitle={t('io-contact.description', { ns: 'recapiti' })}
      avatar={<IllusSms />}
    >
      <Typography color="text.primary" fontWeight={400} fontSize={16}>
        {t('courtesy-contacts.io-enable', { ns: 'recapiti' })}
        {recipientId && contacts &&
          <div>Props</div>
        }
      </Typography>
    </DigitalContactsCard>
  );
};

export default CourtesyContacts;