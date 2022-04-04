import { DigitalAddresses, LegalChannelType, CourtesyChannelType } from './../../../models/contacts';

export const digitalAddresses: DigitalAddresses = {
  legal: [{
    addressType: 'legal',
    recipientId: '123e4567-e89b-12d3-a456-426614174000',
    senderId: 'cmbo',
    channelType: LegalChannelType.PEC,
    value: 'nome.utente@server.it',
    code: '12345'
  }],
  courtesy: [{
    addressType: 'courtesy',
    recipientId: '123e4567-e89b-12d3-a456-426614174000',
    senderId: 'cmbo',
    channelType: CourtesyChannelType.EMAIL,
    value: 'nome.utente@server.it',
    code: '12345'
  }]
}