import {
  CourtesyChannelType,
  DigitalAddresses,
  IOAllowedValues,
  LegalChannelType,
} from '../models/contacts';

export const digitalAddresses: DigitalAddresses = {
  legal: [
    {
      addressType: 'legal',
      recipientId: '123e4567-e89b-12d3-a456-426614174000',
      senderId: 'default',
      channelType: LegalChannelType.PEC,
      value: 'nome.utente@pec.it',
    },
    {
      addressType: 'legal',
      recipientId: '123e4567-e89b-12d3-a456-426614174000',
      senderId: 'cmbo',
      channelType: LegalChannelType.PEC,
      value: 'nome.utente@server.it',
    },
  ],
  courtesy: [
    {
      addressType: 'courtesy',
      recipientId: '123e4567-e89b-12d3-a456-426614174000',
      senderId: 'cmbo',
      channelType: CourtesyChannelType.EMAIL,
      value: 'nome.utente@server.it',
    },
    {
      addressType: 'courtesy',
      recipientId: '123e4567-e89b-12d3-a456-426614174000',
      senderId: 'default',
      channelType: CourtesyChannelType.SMS,
      value: '3333333333',
    },
    {
      addressType: 'courtesy',
      recipientId: '123e4567-e89b-12d3-a456-426614174000',
      senderId: 'default',
      channelType: CourtesyChannelType.IOMSG,
      value: IOAllowedValues.DISABLED,
    },
  ],
};

export const digitalAddressesInvalid = {
  ...digitalAddresses,
  legal: [
    ...digitalAddresses.legal,
    {
      addressType: 'legal',
      recipientId: '123e4567-e89b-12d3-a456-426614174000',
      senderId: 'cmp',
      channelType: LegalChannelType.PEC,
      value: 'nome.utente@server.it',
      codeValid: false,
    },
  ],
};
