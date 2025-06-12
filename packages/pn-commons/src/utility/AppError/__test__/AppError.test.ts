import { ErrorMessage } from '../../../models';
import AppError from '../AppError';

class MockAppError extends AppError {
  getMessage(): ErrorMessage {
    return {
      title: 'mock-title',
      content: 'mock-content',
    };
  }
}

describe('AppError', () => {
  const mockAppError = new MockAppError({
    code: 'mock-code',
    element: 'mock-element',
    detail: 'mock-detail',
  });

  it('getResponseError', () => {
    expect(mockAppError.getResponseError()).toStrictEqual({
      code: 'mock-code',
      detail: 'mock-detail',
      element: 'mock-element',
      message: {
        content: 'mock-content',
        title: 'mock-title',
      },
      showTechnicalData: false,
    });
  });

  it('getMessage', () => {
    expect(mockAppError.getMessage()).toStrictEqual({
      title: 'mock-title',
      content: 'mock-content',
    });
  });
});
