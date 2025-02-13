import { newNotification, newNotificationForBff } from '../../__mocks__/NewNotification.mock';
import { BffNewNotificationRequest } from '../../generated-client/notifications';
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
    expect(result).toEqual(newNotificationForBff);
  });

  it('Checks that getDuplicateValuesByKeys returns duplicate values', () => {
    const result = getDuplicateValuesByKeys(mockArray, ['key1', 'key2', 'key3']);
    expect(result).toEqual(['value1value2value3', 'valueXvalueYvalueZ']);
  });

  it('Checks that notificationMapper returns correct bilingualism dto', () => {
    // fe version after mapper
    const result = newNotificationMapper({
      ...newNotification,
      lang: 'other',
      additionalLang: 'de',
      additionalAbstract: 'abstract for de',
      additionalSubject: 'subject for de',
    });
    // 
    const response: BffNewNotificationRequest = {
      ...newNotificationForBff,
      subject: 'Multone esagerato|subject for de',
      abstract: 'abstract for de',
      additionalLanguages: ['DE'],
    };
    expect(result).toEqual(response);
  });
});
