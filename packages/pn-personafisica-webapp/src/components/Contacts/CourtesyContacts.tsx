import React from 'react';

import { Stack } from '@mui/material';

import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import EmailContactItem from './EmailContactItem';
import IOContact from './IOContact';
import SmsContactItem from './SmsContactItem';

const CourtesyContacts: React.FC = () => {
  const { defaultSMSAddress } = useAppSelector(contactsSelectors.selectAddresses);

  return (
    <Stack spacing={2} data-testid="courtesyContacts">
      <IOContact />
      <EmailContactItem />
      {defaultSMSAddress && <SmsContactItem />}
    </Stack>
  );
};

export default CourtesyContacts;
