import { RenderResult, fireEvent, waitFor } from '@testing-library/react';

import { CourtesyChannelType, LegalChannelType } from '../../../models/contacts';
import { useDigitalContactsCodeVerificationContext } from '../DigitalContactsCodeVerification.context';

const pecValue = 'mocked@pec.it';
const pecValueToVerify = 'mocked@pec-to-verify.it';
const emailValue = 'mocked@mail.it';
const senderId = 'mocked-senderId';

const Component = ({
  type,
  value,
  senderId = 'default',
}: {
  type: LegalChannelType | CourtesyChannelType;
  value: string;
  senderId?: string;
}) => {
  const { initValidation } = useDigitalContactsCodeVerificationContext();

  const handleButtonClick = () => {
    initValidation(type, value, senderId);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Click me</button>
    </div>
  );
};

const showDialog = async (result: RenderResult): Promise<HTMLElement | null> => {
  const button = result.container.querySelector('button');
  fireEvent.click(button!);
  return waitFor(() => result.getByTestId('codeDialog'));
};

export { Component, emailValue, pecValue, pecValueToVerify, senderId, showDialog };
