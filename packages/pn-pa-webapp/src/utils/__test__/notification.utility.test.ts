import {
  newNotification,
  newNotificationDTO,
  newNotificationDTOWithUndefinedAddress, newNotificationWithEmptyAddress
} from '../../redux/newNotification/__test__/test-utils';
import { newNotificationMapper } from '../notification.utility';

describe('Test notification utility', () => {
  test('Map notification from presentation layer to api layer', () => {
    const result = newNotificationMapper(newNotification);
  
    expect(result).toEqual(newNotificationDTO);
  });

  test('Checks that if physical address has empty required fields, its value is set to undefined', () => {
    const result = newNotificationMapper(newNotificationWithEmptyAddress);

    expect(result).toEqual(newNotificationDTOWithUndefinedAddress);
  });
});
