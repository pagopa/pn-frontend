import { digitalAddresses, digitalCourtesyAddresses } from '../../__mocks__/Contacts.mock';
import { ChannelType } from '../../models/contacts';
import { contactAlreadyExists, countContactsByType } from '../contacts.utility';

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
  });

  it('test contactAlreadyExists function, existing contact', () => {
    const result = contactAlreadyExists(
      digitalAddresses,
      digitalAddresses[0].value,
      'senderId',
      digitalAddresses[0].channelType
    );

    expect(result).toBe(true);
  });

  it('test contactAlreadyExists function, not existing contact', () => {
    const result = contactAlreadyExists(
      digitalAddresses,
      'new value',
      digitalAddresses[0].senderId,
      digitalAddresses[0].channelType
    );

    expect(result).toBe(false);
  });
});
