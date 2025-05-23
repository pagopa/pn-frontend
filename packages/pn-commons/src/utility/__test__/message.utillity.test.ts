import { IAppMessage } from '../../models';
import { createAppMessage } from '../message.utility';

const _genericMessage: IAppMessage = {
  id: '1',
  title: 'mocked-title',
  message: 'mocked-message',
  showTechnicalData: false,
  blocking: false,
  toNotify: true,
  status: undefined,
  alreadyShown: false,
};

describe('nessage service', () => {
  it('return generic message', () => {
    const genericMessage = createAppMessage('mocked-title', 'mocked-message', false);
    expect(genericMessage).toEqual(_genericMessage);
  });
});
