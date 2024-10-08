import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType, DigitalAddress, IOAllowedValues } from '../models/contacts';

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
    senderId: 'default',
    channelType: ChannelType.IOMSG,
    value: IOAllowedValues.DISABLED,
  },
];

export const digitalAddressesSercq: Array<DigitalAddress> = [
  ...digitalAddresses.filter(
    (addr) => addr.channelType !== ChannelType.PEC || addr.senderId !== 'default'
  ),
  {
    addressType: AddressType.LEGAL,
    senderId: 'default',
    channelType: ChannelType.SERCQ_SEND,
    value: SERCQ_SEND_VALUE,
    codeValid: true,
  },
];

export const digitalCourtesyAddresses = digitalAddresses.filter(
  (addr) => addr.addressType === AddressType.COURTESY
);

export const digitalLegalAddresses = digitalAddresses.filter(
  (addr) => addr.addressType === AddressType.LEGAL
);

export const digitalLegalAddressesSercq = digitalAddressesSercq.filter(
  (addr) => addr.addressType === AddressType.LEGAL
);
