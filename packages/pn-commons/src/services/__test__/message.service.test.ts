import { IAppMessage } from '../../types';
import { createAppMessage } from '../message.service';

const _genericMessage: IAppMessage = {
  id: '1',
  title: 'mocked-title',
  message: 'mocked-message',
  blocking: false,
  toNotify: true,
  status: undefined,
  alreadyShown: false
};

test('return generic message', () => {
  const genericMessage = createAppMessage('mocked-title', 'mocked-message');
  expect(genericMessage).toEqual(_genericMessage);
});
