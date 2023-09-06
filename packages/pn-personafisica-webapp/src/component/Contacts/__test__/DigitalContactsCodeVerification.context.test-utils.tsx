import MockAdapter from 'axios-mock-adapter';
import React from 'react';

import { RenderResult, fireEvent, waitFor } from '@testing-library/react';

import { COURTESY_CONTACT, LEGAL_CONTACT } from '../../../api/contacts/contacts.routes';
import { CourtesyChannelType, LegalChannelType } from '../../../models/contacts';
import { useDigitalContactsCodeVerificationContext } from '../DigitalContactsCodeVerification.context';

const pecValue = 'mocked@pec.it';
const pecValueToVerify = 'mocked@pec-to-verify.it';
const emailValue = 'mocked@mail.it';
const recipientId = 'mocked-recipientId';
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
    initValidation(type, value, recipientId, senderId);
  };

  return (
    <div>
      <button onClick={handleButtonClick}>Click me</button>
    </div>
  );
};

const mockContactsApi = (
  mock: MockAdapter,
  type: LegalChannelType | CourtesyChannelType,
  value: string,
  senderId: string = 'default',
  toVerify: boolean = false
) => {
  const url =
    type === LegalChannelType.PEC
      ? LEGAL_CONTACT(senderId, LegalChannelType.PEC)
      : COURTESY_CONTACT(senderId, CourtesyChannelType.EMAIL);
  mock
    .onPost(url, {
      value,
    })
    .reply(200);
  if (toVerify) {
    mock
      .onPost(url, {
        value: value,
        verificationCode: '01234',
      })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });
  } else {
    mock
      .onPost(url, {
        value,
        verificationCode: '01234',
      })
      .reply(204);
  }
};

const showDialog = async (
  result: RenderResult,
  mock: MockAdapter,
  value: string
): Promise<HTMLElement | null> => {
  const button = result.container.querySelector('button');
  fireEvent.click(button!);
  await waitFor(() => {
    expect(mock.history.post).toHaveLength(1);
    expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
      value: value,
    });
  });

  return waitFor(() => result.queryByTestId('codeDialog'));
};

export { pecValue, pecValueToVerify, emailValue, senderId, Component, mockContactsApi, showDialog };
