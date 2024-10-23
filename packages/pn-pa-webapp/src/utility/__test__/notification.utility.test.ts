import { newNotification, newNotificationDTO } from '../../__mocks__/NewNotification.mock';
import { NewNotificationDTO } from '../../models/NewNotification';
import { getDuplicateValuesByKeys, newNotificationMapper } from '../notification.utility';

const mockArray = [
  { key1: 'value1', key2: 'value2', key3: 'value3' },
  { key1: 'valueX', key2: 'valueY', key3: 'valueZ' },
  { key1: 'value1', key2: 'value2', key3: 'value3' },
  { key1: 'value1', key2: 'value2', key3: 'value3' },
  { key1: 'valueX', key2: 'valueY', key3: 'valueZ' },
  { key1: 'value1', key2: 'valueY', key3: 'valueZ' },
];

describe('Test notification utility', () => {
  it('Map notification from presentation layer to api layer', () => {
    const result = newNotificationMapper(newNotification);
    expect(result).toEqual(newNotificationDTO);
  });

  it('Checks that if physical address has empty required fields, its value is set to undefined', () => {
    const request = {
      ...newNotification,
      recipients: newNotification.recipients.map((recipient, index) => {
        if (index === 0) {
          recipient.address = '';
          recipient.houseNumber = '';
        }
        return recipient;
      }),
    };
    const response = {
      ...newNotificationDTO,
      recipients: newNotificationDTO.recipients.map((recipient, index) => {
        if (index === 0) {
          recipient.physicalAddress = undefined;
        }
        return recipient;
      }),
    };
    const result = newNotificationMapper(request);
    expect(result).toEqual(response);
  });

  it('Checks that getDuplicateValuesByKeys returns duplicate values', () => {
    const result = getDuplicateValuesByKeys(mockArray, ['key1', 'key2', 'key3']);
    expect(result).toEqual(['value1value2value3', 'valueXvalueYvalueZ']);
  });

  it('Checks that notificationMapper returns correct bilingualism dto', () => {
    const result = newNotificationMapper({
      ...newNotification,
      lang: 'other',
      additionalLang: 'de',
      additionalAbstract: 'abstract for de',
      additionalSubject: 'subject for de',
    });
    const response: NewNotificationDTO = {
      ...newNotificationDTO,
      subject: 'Multone esagerato · subject for de',
      abstract: 'abstract for de',
      additionalLanguages: ['de'],
    };
    expect(result).toEqual(response);
  });
});
