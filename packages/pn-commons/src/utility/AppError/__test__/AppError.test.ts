import { ErrorMessage } from '../../../models/AppResponse';
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
  it('getResponseError with showTechnicalData = false (default)', () => {
    const mockAppError = new MockAppError({
      code: 'mock-code',
      element: 'mock-element',
      detail: 'mock-detail',
    });

    expect(mockAppError.getResponseError()).toStrictEqual({
      code: 'mock-code',
      detail: 'mock-detail',
      element: 'mock-element',
      showTechnicalData: false,
      message: {
        content: 'mock-content',
        title: 'mock-title',
      },
    });
  });

  it('getResponseError with showTechnicalData = true', () => {
    const mockAppError = new MockAppError(
      {
        code: 'mock-code',
        element: 'mock-element',
        detail: 'mock-detail',
      },
      true // pass showTechnicalData = true
    );

    expect(mockAppError.getResponseError()).toStrictEqual({
      code: 'mock-code',
      detail: 'mock-detail',
      element: 'mock-element',
      showTechnicalData: true,
      message: {
        content: 'mock-content',
        title: 'mock-title',
      },
    });
  });

  it('getMessage returns the correct message', () => {
    const mockAppError = new MockAppError({
      code: 'mock-code',
      element: 'mock-element',
      detail: 'mock-detail',
    });

    expect(mockAppError.getMessage()).toStrictEqual({
      title: 'mock-title',
      content: 'mock-content',
    });
  });
});
