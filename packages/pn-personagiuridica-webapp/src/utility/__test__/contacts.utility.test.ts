import { SERCQ_SEND_VALUE } from '@pagopa-pn/pn-commons';

import { digitalAddresses, digitalAddressesSercq } from '../../__mocks__/Contacts.mock';
import { AddressType, ChannelType, DigitalAddress } from '../../models/contacts';
import { SelectedAddresses } from '../../redux/contact/reducers';
import {
  contactAlreadyExists,
  removeAddress,
  specialContactsAvailableAddressTypes,
  updateAddressesList,
} from '../contacts.utility';

describe('Contacts utility test', () => {
  it('test contactAlreadyExists function, existing contact', () => {
    const result = contactAlreadyExists(
      digitalAddresses,
      digitalAddresses[0].value,
      'senderId',
      digitalAddresses[0].channelType
    );

    expect(result).toBe(true);
  });

  it('test contactAlreadyExists function, not existing contact', () => {
    const result = contactAlreadyExists(
      digitalAddresses,
      'new value',
      digitalAddresses[0].senderId,
      digitalAddresses[0].channelType
    );

    expect(result).toBe(false);
  });

  it('test specialContactsAvailableAddressTypes function -> pec and sercq shown', () => {
    const defaultSMSAddress = digitalAddresses.find(
      (addr) => addr.channelType === ChannelType.SMS && addr.senderId === 'default'
    )!;
    const defaultPECAddress = digitalAddresses.find(
      (addr) => addr.channelType === ChannelType.PEC && addr.senderId === 'default'
    )!;
    const result = specialContactsAvailableAddressTypes(
      {
        defaultPECAddress,
        defaultSMSAddress,
        specialEMAILAddresses: [] as Array<DigitalAddress>,
        specialPECAddresses: [] as Array<DigitalAddress>,
        specialSERCQ_SENDAddresses: [] as Array<DigitalAddress>,
        specialSMSAddresses: [] as Array<DigitalAddress>,
      } as SelectedAddresses,
      { senderId: 'mocked-senderId' }
    );

    expect(result).toStrictEqual([
      {
        disabled: false,
        id: ChannelType.EMAIL,
        shown: false,
      },
      {
        disabled: false,
        id: ChannelType.SMS,
        shown: false,
      },
      {
        disabled: false,
        id: ChannelType.PEC,
        shown: true,
      },
      {
        disabled: false,
        id: ChannelType.SERCQ_SEND,
        shown: true,
      },
    ]);
  });

  it('test specialContactsAvailableAddressTypes function -> pec shown and sercq hidden', () => {
    const defaultSMSAddress = digitalAddresses.find(
      (addr) => addr.channelType === ChannelType.SMS && addr.senderId === 'default'
    )!;
    const defaultSERCQ_SENDAddress = digitalAddressesSercq.find(
      (addr) => addr.channelType === ChannelType.SERCQ_SEND && addr.senderId === 'default'
    )!;
    const result = specialContactsAvailableAddressTypes(
      {
        defaultSERCQ_SENDAddress,
        defaultSMSAddress,
        specialEMAILAddresses: [] as Array<DigitalAddress>,
        specialPECAddresses: [] as Array<DigitalAddress>,
        specialSERCQ_SENDAddresses: [] as Array<DigitalAddress>,
        specialSMSAddresses: [] as Array<DigitalAddress>,
      } as SelectedAddresses,
      { senderId: 'mocked-senderId' }
    );

    expect(result).toStrictEqual([
      {
        disabled: false,
        id: ChannelType.EMAIL,
        shown: false,
      },
      {
        disabled: false,
        id: ChannelType.SMS,
        shown: false,
      },
      {
        disabled: false,
        id: ChannelType.PEC,
        shown: true,
      },
      {
        disabled: false,
        id: ChannelType.SERCQ_SEND,
        shown: false,
      },
    ]);
  });

  it('test specialContactsAvailableAddressTypes function -> contact already added', () => {
    const defaultPECAddress = digitalAddresses.find(
      (addr) => addr.channelType === ChannelType.PEC && addr.senderId === 'default'
    )!;
    const specialPECAddress = digitalAddresses.find(
      (addr) => addr.channelType === ChannelType.PEC && addr.senderId !== 'default'
    )!;
    const result = specialContactsAvailableAddressTypes(
      {
        defaultPECAddress,
        specialEMAILAddresses: [] as Array<DigitalAddress>,
        specialPECAddresses: [specialPECAddress] as Array<DigitalAddress>,
        specialSERCQ_SENDAddresses: [] as Array<DigitalAddress>,
        specialSMSAddresses: [] as Array<DigitalAddress>,
      } as SelectedAddresses,
      { senderId: specialPECAddress.senderId }
    );

    expect(result).toStrictEqual([
      {
        disabled: false,
        id: ChannelType.EMAIL,
        shown: false,
      },
      {
        disabled: false,
        id: ChannelType.SMS,
        shown: false,
      },
      {
        disabled: true,
        id: ChannelType.PEC,
        shown: true,
      },
      {
        disabled: false,
        id: ChannelType.SERCQ_SEND,
        shown: true,
      },
    ]);
  });

  it('test updateAddressesList function, new address', () => {
    const newAddress: DigitalAddress = {
      addressType: AddressType.LEGAL,
      channelType: ChannelType.PEC,
      senderId: 'new-mocked-sender-id',
      value: 'new@pec.it',
    };
    const previousDigitalAddresses = [...digitalAddresses];
    updateAddressesList(
      newAddress.addressType,
      newAddress.channelType,
      newAddress.senderId,
      digitalAddresses,
      newAddress
    );

    expect(digitalAddresses).toStrictEqual([...previousDigitalAddresses, newAddress]);
  });

  it('test updateAddressesList function, existing courtesy address', () => {
    const addressIndex = digitalAddresses.findIndex(
      (addr) => addr.addressType === AddressType.COURTESY && addr.channelType === ChannelType.EMAIL
    );
    const newAddress = { ...digitalAddresses[addressIndex], value: 'new-value@mail.it' };
    const previousDigitalAddresses = [...digitalAddresses];
    previousDigitalAddresses[addressIndex].value = newAddress.value;

    updateAddressesList(
      newAddress.addressType,
      newAddress.channelType,
      newAddress.senderId,
      digitalAddresses,
      newAddress
    );

    expect(digitalAddresses).toStrictEqual(previousDigitalAddresses);
  });

  it('test updateAddressesList function, existing legal address', () => {
    const addressIndex = digitalAddresses.findIndex(
      (addr) => addr.addressType === AddressType.LEGAL && addr.channelType === ChannelType.PEC
    );
    const newAddress = {
      ...digitalAddresses[addressIndex],
      channelType: ChannelType.SERCQ_SEND,
      value: SERCQ_SEND_VALUE,
    };
    const previousDigitalAddresses = [...digitalAddresses];
    previousDigitalAddresses[addressIndex].value = newAddress.value;
    previousDigitalAddresses[addressIndex].channelType = ChannelType.SERCQ_SEND;

    updateAddressesList(
      newAddress.addressType,
      newAddress.channelType,
      newAddress.senderId,
      digitalAddresses,
      newAddress
    );

    expect(digitalAddresses).toStrictEqual(previousDigitalAddresses);
  });

  it('test removeAddress function', () => {
    const address = digitalAddresses.find(
      (addr) => addr.addressType === AddressType.LEGAL && addr.channelType === ChannelType.PEC
    )!;

    const currentAddresses = digitalAddresses.filter(
      (addr) =>
        addr.addressType !== address.addressType ||
        addr.channelType !== address.channelType ||
        addr.senderId !== address.senderId
    );

    const result = removeAddress(
      address.addressType,
      address.channelType,
      address.senderId,
      digitalAddresses
    );

    expect(result).toStrictEqual(currentAddresses);
  });
});
