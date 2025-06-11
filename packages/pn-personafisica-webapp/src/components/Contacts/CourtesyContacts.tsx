import React from 'react';

import { Stack } from '@mui/material';

import { AddressType } from '../../models/contacts';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';
import EmailContactItem from './EmailContactItem';
import IOContact from './IOContact';
import SmsContactItem from './SmsContactItem';
import SpecialContacts from './SpecialContacts';

const CourtesyContacts: React.FC = () => {
  const { defaultSMSAddress, specialAddresses } = useAppSelector(contactsSelectors.selectAddresses);
  const showSpecialContactsSection =
    specialAddresses.filter((addr) => addr.addressType === AddressType.COURTESY).length > 0;

  return (
    <Stack spacing={2} data-testid="courtesyContacts">
      <IOContact />
      <EmailContactItem />
      {defaultSMSAddress && <SmsContactItem />}
      {showSpecialContactsSection && <SpecialContacts addressType={AddressType.COURTESY} />}
    </Stack>
  );
};

export default CourtesyContacts;
