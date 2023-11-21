import { CourtesyChannelType, DigitalAddress, LegalChannelType } from '../models/contacts';
import { TrackEventType } from './events';

export const internationalPhonePrefix = '+39';

export function countContactsByType(contacts: Array<DigitalAddress>, type: CourtesyChannelType) {
  return contacts.reduce((total, contact) => (contact.channelType === type ? total + 1 : total), 0);
}

export const getContactEventType = (type: CourtesyChannelType | LegalChannelType) => {
  switch (type) {
    case CourtesyChannelType.EMAIL:
      return TrackEventType.CONTACT_MAIL_COURTESY;
    case CourtesyChannelType.SMS:
      return TrackEventType.CONTACT_TEL_COURTESY;
    case LegalChannelType.PEC:
      return TrackEventType.CONTACT_LEGAL_CONTACT;
  }
};
