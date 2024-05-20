import { digitalAddresses, digitalCourtesyAddresses } from '../../__mocks__/Contacts.mock';
import { CourtesyChannelType } from '../../models/contacts';
import { countContactsByType } from '../contacts.utility';

const calcExpetcedCount = (courtesyChannelType: CourtesyChannelType) =>
  digitalAddresses.reduce((count, elem) => {
    if (elem.channelType === courtesyChannelType) {
      count++;
    }
    return count;
  }, 0);

describe('Contacts utility test', () => {
  it('tests countContactsByType', () => {
    let result = countContactsByType(digitalCourtesyAddresses, CourtesyChannelType.EMAIL);
    let expected = calcExpetcedCount(CourtesyChannelType.EMAIL);
    expect(result).toBe(expected);
    result = countContactsByType(digitalCourtesyAddresses, CourtesyChannelType.SMS);
    expected = calcExpetcedCount(CourtesyChannelType.SMS);
    expect(result).toBe(expected);
  });
});
