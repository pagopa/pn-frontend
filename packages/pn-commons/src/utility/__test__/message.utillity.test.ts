import { vi } from 'vitest';

import { IAppMessage } from '../../models';
import { createAppMessage } from '../message.utility';

// Mock di lodash
vi.mock('lodash', () => ({
  default: {
    uniqueId: vi.fn(() => '1'),
  },
}));

describe('message utility', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns a generic message with showTechnicalData: false', () => {
    const expected: IAppMessage = {
      id: '1',
      title: 'mocked-title',
      message: 'mocked-message',
      showTechnicalData: false,
      blocking: false,
      toNotify: true,
      status: undefined,
      alreadyShown: false,
      traceId: undefined,
      errorCode: undefined,
      action: undefined,
    };

    const result = createAppMessage({
      title: 'mocked-title',
      message: 'mocked-message',
      showTechnicalData: false,
    });

    expect(result).toEqual(expected);
  });

  it('returns a generic message with showTechnicalData: true', () => {
    const expected: IAppMessage = {
      id: '1',
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

    expect(result).toEqual(expected);
  });
});
