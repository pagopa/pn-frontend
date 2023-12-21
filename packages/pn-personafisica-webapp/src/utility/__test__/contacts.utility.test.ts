import { digitalAddresses } from '../../__mocks__/Contacts.mock';
import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { countContactsByType } from '../contacts.utility';
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
});
