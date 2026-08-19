import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType, DigitalAddress, IOAllowedValues } from '../models/contacts';
import { Party } from '../models/party';
import { SelectedAddresses } from '../redux/contact/reducers';

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
    senderId: 'comune-test-2',
    senderName: 'Comune di Test 2',
    channelType: ChannelType.PEC,
    value: 'nome.utente@pec-comune-test-2.it',
    pecValid: true,
    codeValid: true,
  },
  {
    addressType: AddressType.LEGAL,
    senderId: 'tribunale-test',
    senderName: 'Tribunale di Test',
    channelType: ChannelType.PEC,
    value: 'nome.utente@pec-tribunale-test.it',
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
  {
    addressType: AddressType.COURTESY,
    senderId: 'tribunale-test',
    senderName: 'Tribunale di Test',
    channelType: ChannelType.EMAIL,
    value: 'nome.utente@email-tribunale-test.it',
  },
  {
    addressType: AddressType.COURTESY,
    senderId: 'tribunale-test',
    senderName: 'Tribunale di Test',
    channelType: ChannelType.SMS,
    value: '+393333333334',
  },
  {
    addressType: AddressType.COURTESY,
    senderId: 'comune-test-2',
    senderName: 'Comune di Test 2',
    channelType: ChannelType.EMAIL,
    value: 'nome.utente@email-comune-test-2.it',
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

export const buildSelectedAddresses = (addresses: Array<DigitalAddress>): SelectedAddresses => {
  const result = {
    addresses,
    legalAddresses: [] as Array<DigitalAddress>,
    courtesyAddresses: [] as Array<DigitalAddress>,
    specialAddresses: [] as Array<DigitalAddress>,
  } as SelectedAddresses;

  for (const channelType of Object.values(ChannelType)) {
    result[`default${channelType}Address`] = undefined;
    result[`special${channelType}Addresses`] = [];
  }

  addresses.forEach((addr) => {
    if (addr.addressType === AddressType.LEGAL) {
      result.legalAddresses.push(addr);
    }

    if (addr.addressType === AddressType.COURTESY) {
      result.courtesyAddresses.push(addr);
    }

    if (addr.senderId === 'default') {
      result[`default${addr.channelType}Address`] = addr;
    } else {
      result[`special${addr.channelType}Addresses`].push(addr);
      result.specialAddresses.push(addr);
    }
  });

  return result;
};
