import {
  AddressType,
  CourtesyChannelType,
  DigitalAddress,
  IOAllowedValues,
  LegalChannelType,
} from '../models/contacts';

export const digitalAddresses: Array<DigitalAddress> = [
  {
    addressType: AddressType.LEGAL,
    recipientId: '123e4567-e89b-12d3-a456-426614174000',
    senderId: 'default',
    channelType: LegalChannelType.PEC,
    value: 'nome.utente@pec.it',
    pecValid: true,
  },
  {
    addressType: AddressType.LEGAL,
    recipientId: '123e4567-e89b-12d3-a456-426614174000',
    senderId: 'comune-milano',
    channelType: LegalChannelType.PEC,
    value: 'nome.utente@pec-comune-milano.it',
    pecValid: true,
  },
  {
    addressType: AddressType.LEGAL,
    recipientId: '123e4567-e89b-12d3-a456-426614174000',
    senderId: 'tribunale-milano',
    channelType: LegalChannelType.PEC,
    value: 'nome.utente@pec-tribunale-milano.it',
    pecValid: true,
  },
  {
    addressType: AddressType.COURTESY,
    recipientId: '123e4567-e89b-12d3-a456-426614174000',
    senderId: 'comune-milano',
    channelType: CourtesyChannelType.EMAIL,
    value: 'nome.utente@mail-comune-milano.it',
  },
  {
    addressType: AddressType.COURTESY,
    recipientId: '123e4567-e89b-12d3-a456-426614174000',
    senderId: 'default',
    channelType: CourtesyChannelType.EMAIL,
    value: 'nome.utente@mail.it',
  },
  {
    addressType: AddressType.COURTESY,
    recipientId: '123e4567-e89b-12d3-a456-426614174000',
    senderId: 'default',
    channelType: CourtesyChannelType.SMS,
    value: '3333333333',
  },
  {
    addressType: AddressType.COURTESY,
    recipientId: '123e4567-e89b-12d3-a456-426614174000',
    senderId: 'tribunale-milano',
    channelType: CourtesyChannelType.SMS,
    value: '3333333334',
  },
  {
    addressType: AddressType.COURTESY,
    recipientId: '123e4567-e89b-12d3-a456-426614174000',
    senderId: 'default',
    channelType: CourtesyChannelType.IOMSG,
    value: IOAllowedValues.DISABLED,
  },
];

export const digitalCourtesyAddresses = digitalAddresses.filter(
  (addr) => addr.addressType === AddressType.COURTESY
);

export const digitalLegalAddresses = digitalAddresses.filter(
  (addr) => addr.addressType === AddressType.LEGAL
);
