import {
  AddressType,
  CourtesyChannelType,
  DigitalAddress,
  LegalChannelType,
} from '../models/contacts';

export const digitalAddresses: Array<DigitalAddress> = [
  {
    addressType: AddressType.LEGAL,
    senderId: 'default',
    channelType: LegalChannelType.PEC,
    value: 'nome.utente@pec.it',
    pecValid: true,
  },
  {
    addressType: AddressType.LEGAL,
    senderId: 'comune-milano',
    channelType: LegalChannelType.PEC,
    value: 'nome.utente@pec-comune-milano.it',
    pecValid: true,
  },
  {
    addressType: AddressType.LEGAL,
    senderId: 'tribunale-milano',
    channelType: LegalChannelType.PEC,
    value: 'nome.utente@pec-tribunale-milano.it',
    pecValid: true,
  },
  {
    addressType: AddressType.COURTESY,
    senderId: 'comune-milano',
    channelType: CourtesyChannelType.EMAIL,
    value: 'nome.utente@mail-comune-milano.it',
  },
  {
    addressType: AddressType.COURTESY,
    senderId: 'default',
    channelType: CourtesyChannelType.EMAIL,
    value: 'nome.utente@mail.it',
  },
  {
    addressType: AddressType.COURTESY,
    senderId: 'default',
    channelType: CourtesyChannelType.SMS,
    value: '3333333333',
  },
  {
    addressType: AddressType.COURTESY,
    senderId: 'tribunale-milano',
    channelType: CourtesyChannelType.SMS,
    value: '3333333334',
  },
];

export const digitalCourtesyAddresses = digitalAddresses.filter(
  (addr) => addr.addressType === AddressType.COURTESY
);

export const digitalLegalAddresses = digitalAddresses.filter(
  (addr) => addr.addressType === AddressType.LEGAL
);
