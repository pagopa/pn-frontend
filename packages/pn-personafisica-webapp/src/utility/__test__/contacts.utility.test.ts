import { digitalAddresses } from '../../__mocks__/Contacts.mock';
import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { countContactsByType, getContactEventType } from '../contacts.utility';
import { TrackEventType } from '../events';

const calcExpetcedCount = (courtesyChannelType: CourtesyChannelType) =>
  digitalAddresses.courtesy.reduce((count, elem) => {
    if (elem.channelType === courtesyChannelType) {
      count++;
    }
    return count;
  }, 0);

describe('Contacts utility test', () => {
  it('tests countContactsByType', () => {
    let result = countContactsByType(digitalAddresses.courtesy, CourtesyChannelType.EMAIL);
    let expected = calcExpetcedCount(CourtesyChannelType.EMAIL);
    expect(result).toBe(expected);
    result = countContactsByType(digitalAddresses.courtesy, CourtesyChannelType.SMS);
    expected = calcExpetcedCount(CourtesyChannelType.SMS);
    expect(result).toBe(expected);
    result = countContactsByType(digitalAddresses.courtesy, CourtesyChannelType.IOMSG);
    expected = calcExpetcedCount(CourtesyChannelType.IOMSG);
    expect(result).toBe(expected);
  });

  it('tests getContactEventType', () => {
    let result = getContactEventType(LegalChannelType.PEC);
    expect(result).toBe(TrackEventType.CONTACT_LEGAL_CONTACT);
    result = getContactEventType(CourtesyChannelType.SMS);
    expect(result).toBe(TrackEventType.CONTACT_TEL_COURTESY);
    result = getContactEventType(CourtesyChannelType.IOMSG);
    expect(result).toBe(TrackEventType.CONTACT_IOAPP_COURTESY);
    result = getContactEventType(CourtesyChannelType.EMAIL);
    expect(result).toBe(TrackEventType.CONTACT_MAIL_COURTESY);
  });
});
