import { PFEventsType } from '../models/PFEventsType';
import { CourtesyChannelType, DigitalAddress, LegalChannelType } from '../models/contacts';

export const internationalPhonePrefix = '+39';

export function countContactsByType(contacts: Array<DigitalAddress>, type: CourtesyChannelType) {
  return contacts.reduce((total, contact) => (contact.channelType === type ? total + 1 : total), 0);
}

export const getEventByContactType = (
  contactType: CourtesyChannelType | LegalChannelType
): PFEventsType => {
  if (contactType === LegalChannelType.PEC) {
    return PFEventsType.SEND_REMOVE_PEC_SUCCESS;
  } else if (contactType === CourtesyChannelType.EMAIL) {
    return PFEventsType.SEND_REMOVE_EMAIL_SUCCESS;
  }
  return PFEventsType.SEND_REMOVE_SMS_SUCCESS;
};
