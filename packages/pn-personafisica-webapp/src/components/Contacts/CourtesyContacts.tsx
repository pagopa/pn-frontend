import React from 'react';
import { useTranslation } from 'react-i18next';

import { Alert, Box, Stack, Typography } from '@mui/material';
import { IllusEmail } from '@pagopa/mui-italia';

import { ChannelType, DigitalAddress } from '../../models/contacts';
import { countContactsByType } from '../../utility/contacts.utility';
import CourtesyContactItem, { CourtesyFieldType } from './CourtesyContactItem';
import DigitalContactsCard from './DigitalContactsCard';

interface Props {
  contacts: Array<DigitalAddress>;
}

const CourtesyContacts: React.FC<Props> = ({ contacts }) => {
  const { t } = useTranslation(['common', 'recapiti']);

  const phoneContact = contacts.find(
    (contact) => contact.channelType === ChannelType.SMS && contact.senderId === 'default'
  );
  const emailContact = contacts.find(
    (contact) => contact.channelType === ChannelType.EMAIL && contact.senderId === 'default'
  );

  const phoneContactsQuantity = (): number => countContactsByType(contacts, ChannelType.SMS);

  const emailContactsQuantity = (): number => countContactsByType(contacts, ChannelType.EMAIL);

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
      <Box sx={{ width: { xs: '100%', lg: '50%' } }} data-testid="courtesyContacts">
        <Stack spacing={3} mt={3}>
          <CourtesyContactItem
            type={CourtesyFieldType.EMAIL}
            value={emailContact?.value ? emailContact.value : ''}
            blockDelete={emailContactsQuantity() > 1}
          />
          <CourtesyContactItem
            type={CourtesyFieldType.PHONE}
            value={phoneContact?.value ? phoneContact.value : ''}
            blockDelete={phoneContactsQuantity() > 1}
          />
        </Stack>
      </Box>
      <Alert sx={{ mt: 4 }} severity="info" data-testid="contacts disclaimer">
        <Typography component="span" variant="body1">
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
