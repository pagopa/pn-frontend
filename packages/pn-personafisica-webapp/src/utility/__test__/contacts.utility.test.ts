import { digitalAddresses, digitalCourtesyAddresses } from '../../__mocks__/Contacts.mock';
import { ChannelType } from '../../models/contacts';
import { countContactsByType } from '../contacts.utility';

const calcExpetcedCount = (courtesyChannelType: ChannelType) =>
  digitalAddresses.reduce((count, elem) => {
    if (elem.channelType === courtesyChannelType) {
      count++;
    }
    return count;
  }, 0);

describe('Contacts utility test', () => {
  it('tests countContactsByType', () => {
    let result = countContactsByType(digitalCourtesyAddresses, ChannelType.EMAIL);
    let expected = calcExpetcedCount(ChannelType.EMAIL);
    expect(result).toBe(expected);
    result = countContactsByType(digitalCourtesyAddresses, ChannelType.SMS);
    expected = calcExpetcedCount(ChannelType.SMS);
    expect(result).toBe(expected);
    result = countContactsByType(digitalCourtesyAddresses, ChannelType.IOMSG);
    expected = calcExpetcedCount(ChannelType.IOMSG);
    expect(result).toBe(expected);
  });
});
