import { uniq } from 'lodash';

import { interceptDispatch } from '@pagopa-pn/pn-commons';
import { AnyAction, Dispatch, Middleware } from '@reduxjs/toolkit';

import { PFEventsType, eventsActionsMap } from '../models/PFEventsType';
import { ChannelType, DigitalAddress, IOAllowedValues } from '../models/contacts';
import PFEventStrategyFactory from './MixpanelUtils/PFEventStrategyFactory';

export type MixpanelConcatCourtesyContacts =
  | 'app_io_email_sms'
  | 'app_io_email'
  | 'app_io_sms'
  | 'email_sms'
  | 'app_io'
  | 'email'
  | 'sms'
  | 'no_contact';

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
