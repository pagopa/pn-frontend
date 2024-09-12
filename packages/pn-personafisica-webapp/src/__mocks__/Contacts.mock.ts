import {
  AddressType,
  ChannelType,
  DigitalAddress,
  IOAllowedValues,
  SERCQ_SEND_VALUE,
} from '../models/contacts';

export const digitalAddresses: Array<DigitalAddress> = [
  {
    addressType: AddressType.LEGAL,
    senderId: 'default',
    channelType: ChannelType.PEC,
    value: 'nome.utente@pec.it',
    pecValid: true,
    codeValid: true,
  },
  {
    addressType: AddressType.LEGAL,
    senderId: 'comune-milano',
    senderName: 'Comune di Milano',
    channelType: ChannelType.PEC,
    value: 'nome.utente@pec-comune-milano.it',
    pecValid: true,
    codeValid: true,
  },
  {
    addressType: AddressType.LEGAL,
    senderId: 'tribunale-milano',
    senderName: 'Tribunale di Milano',
    channelType: ChannelType.PEC,
    value: 'nome.utente@pec-tribunale-milano.it',
    pecValid: true,
    codeValid: true,
  },
  {
    addressType: AddressType.LEGAL,
    senderId: 'default',
    channelType: ChannelType.SERCQ_SEND,
    value: SERCQ_SEND_VALUE,
    codeValid: true,
  },
  {
    addressType: AddressType.COURTESY,
    senderId: 'comune-milano',
    senderName: 'Comune di Milano',
    channelType: ChannelType.EMAIL,
    value: 'nome.utente@mail-comune-milano.it',
  },
  {
    addressType: AddressType.COURTESY,
    senderId: 'default',
    channelType: ChannelType.EMAIL,
    value: 'nome.utente@mail.it',
  },
  {
    addressType: AddressType.COURTESY,
    senderId: 'default',
    channelType: ChannelType.SMS,
    value: '+393333333333',
  },
  {
    addressType: AddressType.COURTESY,
    senderId: 'tribunale-milano',
    senderName: 'Tribunale di Milano',
    channelType: ChannelType.SMS,
    value: '+393333333334',
  },
  {
    addressType: AddressType.COURTESY,
    senderId: 'default',
    channelType: ChannelType.IOMSG,
    value: IOAllowedValues.DISABLED,
  },
];

export const digitalCourtesyAddresses = digitalAddresses.filter(
  (addr) => addr.addressType === AddressType.COURTESY
);

export const digitalLegalAddresses = digitalAddresses.filter(
  (addr) => addr.addressType === AddressType.LEGAL
);
