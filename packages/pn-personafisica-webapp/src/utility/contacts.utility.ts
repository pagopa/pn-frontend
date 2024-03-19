import { CourtesyChannelType, DigitalAddress, LegalChannelType } from '../models/contacts';
import { TrackEventType } from './events';
import { trackEventByType } from './mixpanel';

export const internationalPhonePrefix = '+39';

export function countContactsByType(contacts: Array<DigitalAddress>, type: CourtesyChannelType) {
  return contacts.reduce((total, contact) => (contact.channelType === type ? total + 1 : total), 0);
}

/**
 * Mixpanel event tracking for contact deletion success
 * TODO: remove this during mixpanel refactor
 * @param contactType
 * @param senderId
 */
export function trackDeleteContactEvent(
  contactType: CourtesyChannelType | LegalChannelType,
  senderId: string
) {
  const other_contact = senderId !== 'default' ? 'yes' : 'no';

  switch (contactType) {
    case LegalChannelType.PEC:
      return trackEventByType(TrackEventType.SEND_REMOVE_PEC_SUCCESS, { other_contact });
    case CourtesyChannelType.EMAIL:
      return trackEventByType(TrackEventType.SEND_REMOVE_EMAIL_SUCCESS, { other_contact });
    case CourtesyChannelType.SMS:
      return trackEventByType(TrackEventType.SEND_REMOVE_SMS_SUCCESS, { other_contact });
    default:
      return;
  }
}
