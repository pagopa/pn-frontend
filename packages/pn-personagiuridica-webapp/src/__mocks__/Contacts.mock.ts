import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType, DigitalAddress } from '../models/contacts';
import { Party } from '../models/party';

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
    senderId: 'tribunale-milano',
    senderName: 'Tribunale di Milano',
    channelType: ChannelType.EMAIL,
    value: 'nome.utente@email-tribunale-milano.it',
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
    senderId: 'comune-milano',
    senderName: 'Comune di Milano',
    channelType: ChannelType.EMAIL,
    value: 'nome.utente@email-comune-milano.it',
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

export const digitalAddressesPecValidation = (
  sercqEnabled = true,
  pecValid = false,
  sender: Party = { id: 'default', name: '' }
): Array<DigitalAddress> => {
  let retVal: Array<DigitalAddress> = [
    {
      addressType: AddressType.LEGAL,
      senderId: sender.id,
      senderName: sender.name,
      channelType: ChannelType.PEC,
      value: 'nome.utente@pec.it',
      pecValid,
      codeValid: true,
    },
  ];

  if (sercqEnabled) {
    retVal.push({
      addressType: AddressType.LEGAL,
      senderId: sender.id,
      senderName: sender.name,
      channelType: ChannelType.SERCQ_SEND,
      value: SERCQ_SEND_VALUE,
      codeValid: true,
    });
  }
  return retVal;
};
