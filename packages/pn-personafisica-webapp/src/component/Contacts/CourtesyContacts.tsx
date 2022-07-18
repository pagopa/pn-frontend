import { useTranslation } from 'react-i18next';
import { Alert, Box, Link, Typography } from '@mui/material';
import { IllusSms } from '@pagopa/mui-italia';

import { URL_DIGITAL_NOTIFICATIONS } from '../../utils/constants';
import { DigitalAddress } from '../../models/contacts';
import DigitalContactsCard from './DigitalContactsCard';
import CourtesyContactsList from './CourtesyContactsList';

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
      <Box sx={{ width: { xs: '100%', lg: '50%' }}}>
        <CourtesyContactsList recipientId={recipientId} contacts={contacts} />
        <Alert
          sx={{ mt: 4}}
          severity="info"
        >
          <Typography component="span" variant="body1">{t('courtesy-contacts.disclaimer-message', { ns: 'recapiti' })} </Typography>
          {/** 
           * URL_DIGITAL_NOTIFICATIONS
           * waiting for FAQs
           * */}
          <Link href={URL_DIGITAL_NOTIFICATIONS} target="_blank" variant='body1'>{t('courtesy-contacts.disclaimer-link', { ns: 'recapiti' })}</Link>
        </Alert>
      </Box>
    </DigitalContactsCard>
  );
};

export default CourtesyContacts;
