import { CourtesyChannelType, DigitalAddresses, LegalChannelType } from '../models/contacts';

export const digitalAddresses: DigitalAddresses = {
  legal: [
    {
      addressType: 'legal',
      recipientId: '123e4567-e89b-12d3-a456-426614174000',
      senderId: 'cmbo',
      channelType: LegalChannelType.PEC,
      value: 'nome.utente@server.it',
    },
    {
      addressType: 'legal',
      recipientId: '123e4567-e89b-12d3-a456-426614174000',
      senderId: 'default',
      channelType: LegalChannelType.PEC,
      value: 'nome.utente@server.it',
      pecValid: true,
    },
    {
      addressType: 'legal',
      recipientId: '123e4567-e89b-12d3-a456-426614174000',
      senderId: 'comune-milano',
      channelType: LegalChannelType.PEC,
      value: 'nome.utente@pec-comune-milano.it',
      pecValid: true,
    },
    {
      addressType: 'legal',
      recipientId: '123e4567-e89b-12d3-a456-426614174000',
      senderId: 'tribunale-milano',
      channelType: LegalChannelType.PEC,
      value: 'nome.utente@pec-tribunale-milano.it',
      pecValid: true,
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
      channelType: CourtesyChannelType.EMAIL,
      value: 'nome.utente@mail.it',
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
      senderId: 'tribunale-milano',
      channelType: CourtesyChannelType.SMS,
      value: '3333333334',
    },
  ],
};
