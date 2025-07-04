import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { DeliveryPushFileNotFoundAppError } from '../DeliveryPushFileNotFoundAppError';

describe('Test DeliveryPushFileNotFoundAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return file info not found message', () => {
    const appError = new DeliveryPushFileNotFoundAppError({} as ServerResponseError, translateFn);
    const message = appError.getMessage();
    expect(message.title).toBe('detail.errors.delivery_push_file_not_found.title notifiche');
    expect(message.content).toBe('detail.errors.delivery_push_file_not_found.message notifiche');
  });

  it('getResponseError includes showTechnicalData = true and message', () => {
    const serverError = {
      code: 'error-code',
      detail: 'error-detail',
      element: 'error-element',
    } as ServerResponseError;

    const appError = new DeliveryPushFileNotFoundAppError(serverError, translateFn);

    expect(appError.getResponseError()).toStrictEqual({
      code: 'error-code',
      detail: 'error-detail',
      element: 'error-element',
      showTechnicalData: true,
      message: {
        title: 'detail.errors.delivery_push_file_not_found.title notifiche',
        content: 'detail.errors.delivery_push_file_not_found.message notifiche',
      },
    });
  });
});
