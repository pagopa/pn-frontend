import type { DigitalDomicileType, PGEventPayloads } from '../../../models/PGEventPayloads';
import type { PGEventsType } from '../../../models/PGEventsType';
import type { DigitalAddress } from '../../../models/contacts';
import { AddressType, ChannelType } from '../../../models/contacts';

const mapLegalAddressToDigitalDomicileType = (address?: DigitalAddress): DigitalDomicileType => {
  switch (address?.channelType) {
    case ChannelType.SERCQ_SEND:
    case ChannelType.PEC:
      return address.channelType;
    default:
      return 'not_available';
  }
};

export const mapContactDetailsToEventPayload = (
  addresses: Array<DigitalAddress>
): PGEventPayloads[PGEventsType.SEND_PG_YOUR_CONTACT_DETAILS] => {
  const legalAddress = addresses.find(
    (address) =>
      address.senderId === 'default' &&
      (address.channelType === ChannelType.SERCQ_SEND ||
        (address.channelType === ChannelType.PEC && address.pecValid === true))
  );
  const courtesyAddresses = addresses.filter(
    (address) => address.addressType === AddressType.COURTESY
  );

  return {
    digital_domicile_exists: !!legalAddress,
    digital_domicile_type: mapLegalAddressToDigitalDomicileType(legalAddress),
    email_exists: courtesyAddresses.some(
      (address) => address.senderId === 'default' && address.channelType === ChannelType.EMAIL
    ),
    telephone_exists: courtesyAddresses.some(
      (address) => address.senderId === 'default' && address.channelType === ChannelType.SMS
    ),
  };
};

export const mapDigitalDomicileToType = (addresses: Array<DigitalAddress>): DigitalDomicileType => {
  if (addresses.some((address) => address.channelType === ChannelType.SERCQ_SEND)) {
    return ChannelType.SERCQ_SEND;
  }

  if (
    addresses.some(
      (address) => address.channelType === ChannelType.PEC && address.pecValid === true
    )
  ) {
    return ChannelType.PEC;
  }

  return 'not_available';
};
