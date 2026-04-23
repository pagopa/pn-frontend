import { uniq } from 'lodash-es';

import { interceptDispatch } from '@pagopa-pn/pn-commons';
import { AnyAction, Dispatch, Middleware } from '@reduxjs/toolkit';

import {
  OnboardingAvailableFlows,
  OnboardingContactStatus,
  OnboardingSource,
  OnboardingStatus,
  TrackingFlow,
} from '../models/Onboarding';
import { PFEventsType, eventsActionsMap } from '../models/PFEventsType';
import { AddressType, ChannelType, DigitalAddress, IOAllowedValues } from '../models/contacts';
import { store } from '../redux/store';
import PFEventStrategyFactory from './MixpanelUtils/PFEventStrategyFactory';
import { hasCourtesyContacts } from './contacts.utility';

export type MixpanelConcatCourtesyContacts =
  | 'app_io_email_sms'
  | 'app_io_email'
  | 'app_io_sms'
  | 'email_sms'
  | 'app_io'
  | 'email'
  | 'sms'
  | 'no_contact';

export type MixpanelDigitalDomicileState = 'pec' | 'send' | 'not_active';

export type MixpanelCustomizedContactType = 'pec' | 'send' | 'missing';

export type MixpanelPecState = 'valid' | 'invalid' | 'missing';

export type MixpanelTosState = 'valid' | 'missing';

/**
 * Redux middleware to track events
 */
export const trackingMiddleware: Middleware = () => (next: Dispatch<AnyAction>) =>
  interceptDispatch<PFEventsType>(next, PFEventStrategyFactory, eventsActionsMap);

export const isPFEvent = (eventKey: string): eventKey is keyof typeof PFEventsType =>
  Object.keys(PFEventsType).includes(eventKey);

export const concatCourtestyContacts = (
  contacts: Array<DigitalAddress>
): MixpanelConcatCourtesyContacts => {
  const filteredContacts = contacts.filter(
    (contact) =>
      !(contact.channelType === ChannelType.IOMSG && contact.value === IOAllowedValues.DISABLED)
  );

  const channelTypes = uniq(filteredContacts.map((contact) => contact.channelType));

  const contactParts = [];

  /* eslint-disable functional/immutable-data */
  if (channelTypes.includes(ChannelType.IOMSG)) {
    contactParts.push('app_io');
  }
  if (channelTypes.includes(ChannelType.EMAIL)) {
    contactParts.push('email');
  }
  if (channelTypes.includes(ChannelType.SMS)) {
    contactParts.push('sms');
  }

  return contactParts.length > 0
    ? (contactParts.join('_') as MixpanelConcatCourtesyContacts)
    : 'no_contact';
};

export const getDigitalDomicileState = (
  addresses: Array<DigitalAddress>
): MixpanelDigitalDomicileState => {
  const defaultAddresses = addresses.filter(
    (address) => address.senderId === 'default' && address.addressType === AddressType.LEGAL
  );

  if (defaultAddresses.some((add) => add.channelType === ChannelType.SERCQ_SEND)) {
    return 'send';
  }
  if (defaultAddresses.some((add) => add.channelType === ChannelType.PEC && add.pecValid)) {
    return 'pec';
  }
  return 'not_active';
};

export const getPecValidationState = (pecAddress?: DigitalAddress): MixpanelPecState => {
  if (!pecAddress) {
    return 'missing';
  }
  return pecAddress.pecValid ? 'valid' : 'invalid';
};

export const getCustomizedContactType = (
  customizedContactType: ChannelType.PEC | ChannelType.SERCQ_SEND | 'missing'
): MixpanelCustomizedContactType => {
  if (customizedContactType === 'missing') {
    return 'missing';
  }
  return customizedContactType === ChannelType.PEC ? 'pec' : 'send';
};

// -- Start Onboarding
export const getOnboardingSource = (): OnboardingSource | undefined =>
  store.getState().generalInfoState.onboardingData.source;

export const getOnboardingAvailableFlows = () => {
  const { digitalAddresses } = store.getState().contactsState;
  const courtesyAddresses = digitalAddresses.filter(
    (address) => address.addressType === AddressType.COURTESY
  );

  const hasCourtesyContact = hasCourtesyContacts(courtesyAddresses);

  const flows: Array<OnboardingAvailableFlows> = [
    OnboardingAvailableFlows.DIGITAL_DOMICILE,
    OnboardingAvailableFlows.COURTESY,
  ];

  if (!hasCourtesyContact) {
    flows.push(OnboardingAvailableFlows.IO);
  }

  return flows.join(',');
};

export const getOnboardingBasePayload = () => ({
  source: getOnboardingSource(),
  onboarding_available_flow: getOnboardingAvailableFlows(),
  flow: TrackingFlow.ONBOARDING,
});

export const getOnboardingContactStatus = (value?: string): OnboardingContactStatus =>
  value ? OnboardingContactStatus.POPULATED : OnboardingContactStatus.EMPTY;

export const getOnboardingStatus = () => {
  const state = store.getState().generalInfoState.onboardingData;

  if (state.hasSkippedOnboarding) {
    return OnboardingStatus.DECLINED;
  }

  if (!state.hasBeenShown) {
    return OnboardingStatus.NOT_VIEWED;
  }

  return OnboardingStatus.ENGAGED;
};

export const getOnboardingNotificationsPayload = () => {
  const onboarding_selected_flow =
    store.getState().generalInfoState.onboardingData.onboardingSelectedFlow;
  const onboarding = getOnboardingStatus();

  if (onboarding === OnboardingStatus.NOT_VIEWED) {
    return {
      onboarding,
    };
  }

  return {
    onboarding,
    onboarding_selected_flow,
    flow: TrackingFlow.ONBOARDING,
  };
};
// -- End Onboarding
