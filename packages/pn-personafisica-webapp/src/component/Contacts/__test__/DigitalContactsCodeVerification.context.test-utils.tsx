import * as React from 'react';

import { CourtesyChannelType, LegalChannelType } from '../../../models/contacts';
import {
  DigitalContactsCodeVerificationProvider,
  useDigitalContactsCodeVerificationContext
} from '../DigitalContactsCodeVerification.context';

export const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <DigitalContactsCodeVerificationProvider>{children}</DigitalContactsCodeVerificationProvider>
);

export const mockedStore = {
  legal: [],
  courtesy: [{
    addressType: 'courtesy',
    recipientId: 'mocked-recipientId',
    senderId: 'mocked-senderId',
    channelType: CourtesyChannelType.EMAIL,
    value: "mocked-value",
    code: ''
  }]
};

export const Component = () => {
  const { initValidation } = useDigitalContactsCodeVerificationContext();

  const handleButtonClick = () => {
    initValidation(LegalChannelType.PEC, 'mocked-value', 'mocked-recipientId', 'mocked-senderId');
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Click me</button>
    </div>
  );
};

