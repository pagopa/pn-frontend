import React from 'react';

import { Stack } from '@mui/material';

import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import EmailContactItem from './EmailContactItem';
import IOContact from './IOContact';
import SmsContactItem from './SmsContactItem';

const CourtesyContacts: React.FC = () => {
  const { defaultSMSAddress, defaultWHATSAPPAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  // la card del cellulare è unica: il numero è attivo su SMS oppure su WhatsApp
  const hasMobileAddress = !!defaultSMSAddress || !!defaultWHATSAPPAddress;

  return (
    <Stack spacing={2} data-testid="courtesyContacts">
      <IOContact />
      <EmailContactItem />
      {hasMobileAddress && <SmsContactItem />}
    </Stack>
  );
};

export default CourtesyContacts;
