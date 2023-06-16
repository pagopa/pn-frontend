import { useTranslation } from 'react-i18next';
import { Alert, Box, Typography } from '@mui/material';
import { IllusEmail } from '@pagopa/mui-italia';

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
      /**
       * Waiting for Mail icon to be available in mui-italia (<IllusSms /> as placeholder)
       * */
      avatar={<IllusEmail size={60} />}
    >
      <Box sx={{ width: { xs: '100%', lg: '50%' } }}>
        <CourtesyContactsList recipientId={recipientId} contacts={contacts} />
      </Box>
      <Alert
        tabIndex={0}
        aria-label={t('courtesy-contacts.disclaimer-message', { ns: 'recapiti' })}
        sx={{ mt: 4 }}
        severity="info"
        data-testid="contacts disclaimer"
      >
        <Typography role="banner" component="span" variant="body1">
          {t('courtesy-contacts.disclaimer-message', { ns: 'recapiti' })}
        </Typography>
        {/** 
           * Waiting for FAQs
          <Link href={URL_DIGITAL_NOTIFICATIONS} target="_blank" variant='body1'>{t('courtesy-contacts.disclaimer-link', { ns: 'recapiti' })}</Link>
           * */}
      </Alert>
    </DigitalContactsCard>
  );
};

export default CourtesyContacts;
