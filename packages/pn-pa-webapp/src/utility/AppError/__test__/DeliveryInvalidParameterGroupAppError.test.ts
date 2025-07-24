import { ServerResponseError } from '@pagopa-pn/pn-commons';

import { DeliveryInvalidParameterGroupAppError } from '../DeliveryInvalidParameterGroupAppError';

describe('Test DeliveryInvalidParameterGroupAppError', () => {
  const translateFn = (path: string, ns: string) => `${path} ${ns}`;

  it('Should return file info not found message', () => {
    const appError = new DeliveryInvalidParameterGroupAppError(
      {} as ServerResponseError,
      translateFn
    );
    const message = appError.getMessage();
    expect(message.title).toBe(
      'new-notification.errors.delivery_invalid_parameter_group.title notifiche'
    );
    expect(message.content).toBe(
      'new-notification.errors.delivery_invalid_parameter_group.message notifiche'
    );
  });

  it('getResponseError includes showTechnicalData = true and message', () => {
    const serverError = {
      code: 'error-code',
      detail: 'error-detail',
      element: 'error-element',
    } as ServerResponseError;

    const appError = new DeliveryInvalidParameterGroupAppError(serverError, translateFn);

    expect(appError.getResponseError()).toStrictEqual({
      code: 'error-code',
      detail: 'error-detail',
      element: 'error-element',
      showTechnicalData: true,
      message: {
        title: 'new-notification.errors.delivery_invalid_parameter_group.title notifiche',
        content: 'new-notification.errors.delivery_invalid_parameter_group.message notifiche',
      },
    });
  });
});
