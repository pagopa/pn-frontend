import {
  ProfileMapAttributes,
  ProfilePropertiesActionsMap,
  ProfilePropertyType,
} from '@pagopa-pn/pn-commons';

import { CourtesyChannelType, DigitalAddresses, IOAllowedValues } from '../models/contacts';
import { DeleteDigitalAddressParams, SaveDigitalAddressParams } from '../redux/contact/types';
import { Delegation } from '../redux/delegation/types';
import { DelegationStatus } from './status.utility';

export type ProfilePropertyParams = {
  SEND_APPIO_STATUS: 'nd' | 'activated' | 'deactivated';
  SEND_HAS_PEC: 'yes' | 'no';
  SEND_HAS_EMAIL: 'yes' | 'no';
  SEND_HAS_SMS: 'yes' | 'no';
  SEND_HAS_MANDATE: 'yes' | 'no';
  SEND_MANDATE_GIVEN: 'yes' | 'no';
  SEND_PAYMENTS_COUNT: number;
  SEND_NOTIFICATIONS_COUNT: number;
};

const profileProperties: ProfilePropertiesActionsMap = {
  ['SEND_HAS_ADDRESSES']: {
    profilePropertyType: [ProfilePropertyType.PROFILE, ProfilePropertyType.SUPER_PROPERTY],
    getAttributes(payload: DigitalAddresses): Record<string, string> {
      const hasLegalAddresses = payload?.legal?.length > 0;
      const hasCourtesyEmailAddresses =
        payload?.courtesy?.filter((address) => address.channelType === CourtesyChannelType.EMAIL)
          .length > 0;
      const hasCourtesySmsAddresses =
        payload?.courtesy?.filter((address) => address.channelType === CourtesyChannelType.SMS)
          .length > 0;
      const contactIO = payload?.courtesy?.find(
        (address) => address.channelType === CourtesyChannelType.IOMSG
      );

      // eslint-disable-next-line functional/no-let
      let ioStatus;

      if (!contactIO) {
        ioStatus = 'nd';
      } else if (contactIO?.value === IOAllowedValues.DISABLED) {
        ioStatus = 'deactivated';
      } else {
        ioStatus = 'activated';
      }

      return {
        SEND_HAS_PEC: hasLegalAddresses ? 'yes' : 'no',
        SEND_HAS_EMAIL: hasCourtesyEmailAddresses ? 'yes' : 'no',
        SEND_HAS_SMS: hasCourtesySmsAddresses ? 'yes' : 'no',
        SEND_APPIO_STATUS: ioStatus,
      };
    },
  },
  ['ADD_COURTESY_ADDRESS']: {
    profilePropertyType: [ProfilePropertyType.PROFILE, ProfilePropertyType.SUPER_PROPERTY],
    getAttributes(
      _,
      meta: { requestStatus: string; requestId: string; arg: SaveDigitalAddressParams }
    ): Record<string, string> {
      if (meta?.arg?.channelType === CourtesyChannelType.EMAIL) {
        return { SEND_HAS_EMAIL: 'yes' };
      }

      return { SEND_HAS_SMS: 'yes' };
    },
  },
  ['REMOVE_COURTESY_ADDRESS']: {
    profilePropertyType: [ProfilePropertyType.PROFILE, ProfilePropertyType.SUPER_PROPERTY],
    getAttributes(
      _,
      meta: { requestStatus: string; requestId: string; arg: DeleteDigitalAddressParams }
    ): Record<string, string> {
      if (meta?.arg?.channelType === CourtesyChannelType.EMAIL) {
        return { SEND_HAS_EMAIL: 'no' };
      }

      return { SEND_HAS_SMS: 'no' };
    },
  },
  ['ADD_LEGAL_ADDRESS']: {
    profilePropertyType: [ProfilePropertyType.PROFILE, ProfilePropertyType.SUPER_PROPERTY],
    getAttributes(): Record<string, string> {
      return { SEND_HAS_PEC: 'yes' };
    },
  },
  ['REMOVE_LEGAL_ADDRESS']: {
    profilePropertyType: [ProfilePropertyType.PROFILE, ProfilePropertyType.SUPER_PROPERTY],
    getAttributes(): Record<string, string> {
      return { SEND_HAS_PEC: 'no' };
    },
  },
  ['ENABLE_APP_IO']: {
    profilePropertyType: [ProfilePropertyType.PROFILE, ProfilePropertyType.SUPER_PROPERTY],
    getAttributes(): Record<string, string> {
      return { SEND_APPIO_STATUS: 'activated' };
    },
  },
  ['DISABLE_APP_IO']: {
    profilePropertyType: [ProfilePropertyType.PROFILE, ProfilePropertyType.SUPER_PROPERTY],
    getAttributes(): Record<any, string> {
      return { SEND_APPIO_STATUS: 'deactivated' };
    },
  },
  ['GET_DELEGATES']: {
    profilePropertyType: [ProfilePropertyType.PROFILE],
    getAttributes(payload: Array<Delegation>): Record<string, string> {
      const hasDelegates = payload?.filter(
        (delegation) => delegation.status === DelegationStatus.ACTIVE
      );

      return hasDelegates.length > 0 ? { SEND_MANDATE_GIVEN: 'yes' } : { SEND_MANDATE_GIVEN: 'no' };
    },
  },
  ['GET_DELEGATORS']: {
    profilePropertyType: [ProfilePropertyType.PROFILE],
    getAttributes(payload: Array<Delegation>): Record<string, string> {
      const hasDelegators = payload?.filter(
        (delegator) => delegator.status === DelegationStatus.ACTIVE
      );

      return hasDelegators.length > 0 ? { SEND_HAS_MANDATE: 'yes' } : { SEND_HAS_MANDATE: 'no' };
    },
  },
  ['ACCEPT_DELEGATION']: {
    profilePropertyType: [ProfilePropertyType.PROFILE],
    getAttributes(): Record<string, string> {
      return { SEND_HAS_MANDATE: 'yes' };
    },
  },
};

export const profilePropertiesActionsMap: Record<string, ProfileMapAttributes> = {
  'getDigitalAddresses/fulfilled': profileProperties.SEND_HAS_ADDRESSES,
  'createOrUpdateCourtesyAddress/fulfilled': profileProperties.ADD_COURTESY_ADDRESS,
  'deleteCourtesyAddress/fulfilled': profileProperties.REMOVE_COURTESY_ADDRESS,
  'createOrUpdateLegalAddress/fulfilled': profileProperties.ADD_LEGAL_ADDRESS,
  'deleteLegalAddress/fulfilled': profileProperties.REMOVE_LEGAL_ADDRESS,
  'enableIOAddress/fulfilled': profileProperties.ENABLE_APP_IO,
  'disableIOAddress/fulfilled': profileProperties.DISABLE_APP_IO,
  'getDelegates/fulfilled': profileProperties.GET_DELEGATES,
  'getDelegators/fulfilled': profileProperties.GET_DELEGATORS,
  'acceptDelegation/fulfilled': profileProperties.ACCEPT_DELEGATION,
};
