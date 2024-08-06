import { useTranslation } from 'react-i18next';

import { Alert, Grid, Typography } from '@mui/material';
import { IllusEmailValidation } from '@pagopa/mui-italia';

import { ChannelType, DigitalAddress } from '../../models/contacts';
import DigitalContactsCard from './DigitalContactsCard';
import PecContactItem from './PecContactItem';

type Props = {
  legalAddresses: Array<DigitalAddress>;
};

const LegalContacts = ({ legalAddresses }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);

  const title = (
    <Grid container spacing={1} alignItems="flex-end" direction="row">
      <Grid item xs="auto">
        {t('legal-contacts.subtitle-2', { ns: 'recapiti' })}
      </Grid>
    </Grid>
  );

  const pecAddress = legalAddresses.find(
    (a) => a.senderId === 'default' && a.channelType === ChannelType.PEC
  );

  return (
    <DigitalContactsCard
      sectionTitle={t('legal-contacts.title', { ns: 'recapiti' })}
      title={title}
      subtitle={t('legal-contacts.description', { ns: 'recapiti' })}
      avatar={<IllusEmailValidation />}
    >
      <PecContactItem
        value={legalAddresses.find((a) => a.senderId === 'default')?.value ?? ''}
        blockDelete={legalAddresses.length > 1}
        verifyingAddress={pecAddress ? !pecAddress.pecValid : false}
      />
      <Alert
        role="banner"
        aria-label={t('legal-contacts.disclaimer-message', { ns: 'recapiti' })}
        sx={{ mt: 4 }}
        severity="info"
      >
        <Typography
          role="banner"
          component="span"
          variant="body1"
          data-testid="legal-contact-disclaimer"
        >
          {t('legal-contacts.disclaimer-message', { ns: 'recapiti' })}{' '}
        </Typography>
      </Alert>
    </DigitalContactsCard>
  );
};

export default LegalContacts;
