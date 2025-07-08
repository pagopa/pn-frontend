import { createAppMessage } from '../message.utility';

describe('message utility', () => {
  it('returns a generic message with showTechnicalData: false', () => {
    const expected = {
      title: 'mocked-title',
      message: 'mocked-message',
      showTechnicalData: false,
      blocking: false,
      toNotify: true,
      alreadyShown: false,
    };

    const result = createAppMessage({
      title: 'mocked-title',
      message: 'mocked-message',
      showTechnicalData: false,
    });

    expect(result).toMatchObject(expected);
  });

  it('returns a generic message with showTechnicalData: true', () => {
    const expected = {
      title: 'error-title',
      message: 'technical message here',
      showTechnicalData: true,
      blocking: false,
      toNotify: true,
      status: 500,
      alreadyShown: false,
      traceId: 'abc123',
      errorCode: 'ERROR_CODE',
      action: 'some-action',
    };

    const result = createAppMessage({
      title: 'error-title',
      message: 'technical message here',
      showTechnicalData: true,
      status: 500,
      traceId: 'abc123',
      errorCode: 'ERROR_CODE',
      action: 'some-action',
    });

    expect(result).toMatchObject(expected);
  });
});
