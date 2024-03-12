import {
  ProfileMapAttributes,
  ProfilePropertiesActionsMap,
  ProfilePropertyType,
} from '@pagopa-pn/pn-commons';

import { CourtesyChannelType } from '../models/contacts';
import { SaveDigitalAddressParams } from '../redux/contact/types';
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
  ['ADD_COURTESY_ADDRESS']: {
    profilePropertyType: ProfilePropertyType.PROFILE,
    getAttributes(payload: SaveDigitalAddressParams): Record<string, string> {
      if (payload.channelType === CourtesyChannelType.EMAIL) {
        return { SEND_HAS_EMAIL: 'yes' };
      }

      return { SEND_HAS_SMS: 'yes' };
    },
  },
  ['REMOVE_COURTESY_ADDRESS']: {
    profilePropertyType: ProfilePropertyType.PROFILE,
    getAttributes(payload: SaveDigitalAddressParams): Record<string, string> {
      if (payload.channelType === CourtesyChannelType.EMAIL) {
        return { SEND_HAS_EMAIL: 'no' };
      }

      return { SEND_HAS_SMS: 'no' };
    },
  },
  ['ADD_LEGAL_ADDRESS']: {
    profilePropertyType: ProfilePropertyType.PROFILE,
    getAttributes(): Record<string, string> {
      return { SEND_HAS_PEC: 'yes' };
    },
  },
  ['REMOVE_LEGAL_ADDRESS']: {
    profilePropertyType: ProfilePropertyType.PROFILE,
    getAttributes(): Record<string, string> {
      return { SEND_HAS_PEC: 'no' };
    },
  },
  ['ENABLE_APP_IO']: {
    profilePropertyType: ProfilePropertyType.PROFILE,
    getAttributes(): Record<string, string> {
      return { SEND_APPIO_STATUS: 'activated' };
    },
  },
  ['DISABLE_APP_IO']: {
    profilePropertyType: ProfilePropertyType.PROFILE,
    getAttributes(): Record<any, string> {
      return { SEND_APPIO_STATUS: 'deactivated' };
    },
  },
  ['GET_DELEGATES']: {
    profilePropertyType: ProfilePropertyType.PROFILE,
    getAttributes(payload: Array<Delegation>): Record<string, string> {
      const hasDelegates = payload.filter(
        (delegation) => delegation.status === DelegationStatus.ACTIVE
      );

      return hasDelegates.length > 0 ? { SEND_MANDATE_GIVEN: 'yes' } : { SEND_MANDATE_GIVEN: 'no' };
    },
  },
  ['GET_DELEGATORS']: {
    profilePropertyType: ProfilePropertyType.PROFILE,
    getAttributes(payload: Array<Delegation>): Record<string, string> {
      const hasDelegators = payload.filter(
        (delegator) => delegator.status === DelegationStatus.ACTIVE
      );

      return hasDelegators.length > 0 ? { SEND_HAS_MANDATE: 'yes' } : { SEND_HAS_MANDATE: 'no' };
    },
  },
};

export const profilePropertiesActionsMap: Record<string, ProfileMapAttributes> = {
  'createOrUpdateCourtesyAddress/fulfilled': profileProperties.ADD_COURTESY_ADDRESS,
  'deleteCourtesyAddress/fulfilled': profileProperties.REMOVE_COURTESY_ADDRESS,
  'createOrUpdateLegalAddress/fulfilled': profileProperties.ADD_LEGAL_ADDRESS,
  'deleteLegalAddress/fulfilled': profileProperties.REMOVE_LEGAL_ADDRESS,
  'enableIOAddress/fulfilled': profileProperties.ENABLE_APP_IO,
  'disableIOAddress/fulfilled': profileProperties.DISABLE_APP_IO,
  'getDelegates/fulfilled': profileProperties.GET_DELEGATES,
  'getDelegators/fulfilled': profileProperties.GET_DELEGATORS,
};
