import React from 'react';
import { vi } from 'vitest';

import { ServerResponse, ServerResponseErrorCode } from '../../../models/AppResponse';
import { render } from '../../../test-utils';
import { createAppResponseError, createAppResponseSuccess } from '../AppResponse';
import AppResponsePublisher, { ResponseEventDispatcher } from '../AppResponsePublisher';

describe('AppResponsePublisher', () => {
  const callbackLow = vi.fn();
  const callbackHight = vi.fn();

  const action = 'Event';

  const serverErrorResponse: ServerResponse = {
    status: 400,
    data: {
      status: 400,
      traceId: 'TraceId-A',
      timestamp: '2022-10-05',
      errors: [{ code: ServerResponseErrorCode.BAD_REQUEST_ERROR }],
    },
  };

  const serverSuccessResponse: ServerResponse = {
    status: 200,
  };

  beforeEach(() => {
    callbackLow.mockReset();
    callbackHight.mockReset();
  });

  beforeAll(() => {
    callbackLow.mockRestore();
    callbackHight.mockRestore();
  });

  it('notifies low-priority subscribers on any event name - error', () => {
    const response = createAppResponseError(action, serverErrorResponse);
    // subscribe to the event
    AppResponsePublisher.error.subscribe(callbackLow);
    // publish the event
    AppResponsePublisher.error.publish(action, response);
    // check that the callback is called
    expect(callbackLow).toBeCalledTimes(1);
    expect(callbackLow).toBeCalledWith(response);
    // unsubscribe
    AppResponsePublisher.error.unsubscribe(callbackLow);
  });

  it('notifies low-priority subscribers on any event name - success', () => {
    const response = createAppResponseSuccess(action, serverSuccessResponse);
    // subscribe to the event
    AppResponsePublisher.success.subscribe(callbackLow);
    // publish the event
    AppResponsePublisher.success.publish(action, response);
    // check that the callback is called
    expect(callbackLow).toBeCalledTimes(1);
    expect(callbackLow).toBeCalledWith(response);
    // unsubscribe
    AppResponsePublisher.success.unsubscribe(callbackLow);
  });

  it('notifies high-priority subscribers on specific event and low-priority subscribers only if there is no high-priority subscriber - error', () => {
    const response = createAppResponseError(action, serverErrorResponse);
    // subscribe to the event with hight-priority
    AppResponsePublisher.error.subscribe(action, callbackHight);
    // subscribe to the event with low-priority
    AppResponsePublisher.error.subscribe(callbackLow);
    // publish the event
    AppResponsePublisher.error.publish(action, response);
    // check that hight-priority is called and not the low-priority
    expect(callbackHight).toBeCalledTimes(1);
    expect(callbackHight).toBeCalledWith(response);
    expect(callbackLow).toBeCalledTimes(0);
    // unsubscribe
    AppResponsePublisher.error.unsubscribe(action, callbackHight);
    AppResponsePublisher.error.unsubscribe(callbackLow);
  });

  it('notifies high-priority subscribers on specific event and low-priority subscribers only if there is no high-priority subscriber - success', () => {
    const response = createAppResponseSuccess(action, serverSuccessResponse);
    // subscribe to the event with hight-priority
    AppResponsePublisher.success.subscribe(action, callbackHight);
    // subscribe to the event with low-priority
    AppResponsePublisher.success.subscribe(callbackLow);
    // publish the event
    AppResponsePublisher.success.publish(action, response);
    // check that hight-priority is called and not the low-priority
    expect(callbackHight).toBeCalledTimes(1);
    expect(callbackHight).toBeCalledWith(response);
    expect(callbackLow).toBeCalledTimes(0);
    // unsubscribe
    AppResponsePublisher.success.unsubscribe(action, callbackHight);
    AppResponsePublisher.success.unsubscribe(callbackLow);
  });

  it('ResponseEventDispatcher component - notifies low-priority error', () => {
    const response = createAppResponseError(action, serverErrorResponse);
    // subscribe to the event
    AppResponsePublisher.error.subscribe(callbackLow);
    // render the componet to publish an error
    render(<ResponseEventDispatcher />, {
      preloadedState: {
        appState: {
          responseEvent: {
            name: 'mocked-name',
            response: response,
            outcome: 'error',
          },
        },
      },
    });
    // check that the callback is called
    expect(callbackLow).toBeCalledTimes(1);
    expect(callbackLow).toBeCalledWith(response);
    // unsubscribe
    AppResponsePublisher.error.unsubscribe(callbackLow);
  });

  it('ResponseEventDispatcher component - notifies low-priority success', () => {
    const response = createAppResponseError(action, serverSuccessResponse);
    // subscribe to the event
    AppResponsePublisher.success.subscribe(callbackLow);
    // render the componet to publish a success event
    render(<ResponseEventDispatcher />, {
      preloadedState: {
        appState: {
          responseEvent: {
            name: 'mocked-name',
            response: response,
            outcome: 'success',
          },
        },
      },
    });
    // check that the callback is called
    expect(callbackLow).toBeCalledTimes(1);
    expect(callbackLow).toBeCalledWith(response);
    // unsubscribe
    AppResponsePublisher.success.unsubscribe(callbackLow);
  });

  it('ResponseEventDispatcher component - notifies hight-priority error', () => {
    const response = createAppResponseError(action, serverErrorResponse);
    // subscribe to the event
    AppResponsePublisher.error.subscribe(callbackLow);
    AppResponsePublisher.error.subscribe(action, callbackHight);
    // render the componet to publish an error
    render(<ResponseEventDispatcher />, {
      preloadedState: {
        appState: {
          responseEvent: {
            name: action,
            response: response,
            outcome: 'error',
          },
        },
      },
    });
    // check that the callback is called
    expect(callbackHight).toBeCalledTimes(1);
    expect(callbackHight).toBeCalledWith(response);
    expect(callbackLow).toBeCalledTimes(0);
    // unsubscribe
    AppResponsePublisher.error.unsubscribe(callbackHight);
    AppResponsePublisher.error.unsubscribe(callbackLow);
  });

  it('ResponseEventDispatcher component - notifies hight-priority success', () => {
    const response = createAppResponseError(action, serverSuccessResponse);
    // subscribe to the event
    AppResponsePublisher.success.subscribe(callbackLow);
    AppResponsePublisher.success.subscribe(action, callbackHight);
    // render the componet to publish a success event
    render(<ResponseEventDispatcher />, {
      preloadedState: {
        appState: {
          responseEvent: {
            name: action,
            response: response,
            outcome: 'success',
          },
        },
      },
    });
    // check that the callback is called
    expect(callbackHight).toBeCalledTimes(1);
    expect(callbackHight).toBeCalledWith(response);
    expect(callbackLow).toBeCalledTimes(0);
    // unsubscribe
    AppResponsePublisher.success.unsubscribe(callbackHight);
    AppResponsePublisher.success.unsubscribe(callbackLow);
  });
});
