import {
  newNotification,
  newNotificationDTO,
  newNotificationDTOWithUndefinedAddress,
  newNotificationWithEmptyAddress,
} from '../../redux/newNotification/__test__/test-utils';
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
  // Con l'introduzione dei multi pagamenti (pn-7336), è necessario apportare delle modifiche anche in fase di creazione
  // Andrea Cimini - 16/08/2023
  test.skip('Map notification from presentation layer to api layer', () => {
    const result = newNotificationMapper(newNotification);

    expect(result).toEqual(newNotificationDTO);
  });

  // Con l'introduzione dei multi pagamenti (pn-7336), è necessario apportare delle modifiche anche in fase di creazione
  // Andrea Cimini - 16/08/2023
  test.skip('Checks that if physical address has empty required fields, its value is set to undefined', () => {
    const result = newNotificationMapper(newNotificationWithEmptyAddress);

    expect(result).toEqual(newNotificationDTOWithUndefinedAddress);
  });

  test('Checks that getDuplicateValuesByKeys returns duplicate values', () => {
    const result = getDuplicateValuesByKeys(mockArray, ['key1', 'key2', 'key3']);

    expect(result).toEqual(['value1value2value3', 'valueXvalueYvalueZ']);
  });
});
