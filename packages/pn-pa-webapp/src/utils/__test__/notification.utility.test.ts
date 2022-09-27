import { newNotification, newNotificationDTO } from '../../redux/newNotification/__test__/test-utils';
import { newNotificationMapper } from '../notification.utility';

describe('Test notification utility', () => {
  test('Map notification from presentation layer to api layer', () => {
    const result = newNotificationMapper(newNotification);
  
    expect(result).toEqual(newNotificationDTO);
  });
});
