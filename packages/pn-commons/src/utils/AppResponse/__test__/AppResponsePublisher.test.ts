import { ServerResponse, ServerResponseErrorCode } from '../../../types/AppResponse';
import { createAppResponseError } from '../AppResponse';
import AppResponsePublisher from '../AppResponsePublisher';

describe('AppResponsePublisher', () => {
  const callbackA = jest.fn();
  const callbackB = jest.fn();

  const actionA = "EventA";
  const actionB = "EventB";

  const serverResponse: ServerResponse = {
    status: 400,
    data: {
      status: 400,
      traceId: "TraceId-A",
      timestamp: "2022-10-05",
      errors: [
        { code: ServerResponseErrorCode.BAD_REQUEST_ERROR }
      ]
    }
  };

  beforeEach(() => {
    callbackA.mockReset();
    callbackB.mockReset();
  });

  beforeAll(() => {
    callbackA.mockRestore();
    callbackB.mockRestore();
  });

  it('notifies low-priority subscribers on any event name', () => {
    AppResponsePublisher.error.subscribe(callbackA);
    AppResponsePublisher.error.subscribe(callbackB)

    const responseA = createAppResponseError(actionA, serverResponse);
    const responseB = createAppResponseError(actionB, serverResponse);
    
    AppResponsePublisher.error.publish(actionA, responseA);
    AppResponsePublisher.error.publish(actionB, responseB);

    expect(callbackA).toHaveBeenCalledTimes(2);
    expect(callbackB).toHaveBeenCalledTimes(2);

    AppResponsePublisher.error.unsubscribe(callbackA);
    AppResponsePublisher.error.unsubscribe(callbackB)
  });

  it('notifies high-priority subscribers on specific event and low-priority subscribers only if there is no hi-priority subscriber', () => {
    AppResponsePublisher.error.subscribe(actionA, callbackA);
    AppResponsePublisher.error.subscribe(callbackB)

    const responseA = createAppResponseError(actionA, serverResponse);
    const responseB = createAppResponseError(actionB, serverResponse);
    
    AppResponsePublisher.error.publish(actionA, responseA);

    expect(callbackA).toHaveBeenCalledTimes(1);
    expect(callbackB).toHaveBeenCalledTimes(0);

    AppResponsePublisher.error.publish(actionB, responseB);

    expect(callbackA).toHaveBeenCalledTimes(1);
    expect(callbackB).toHaveBeenCalledTimes(1);

    AppResponsePublisher.error.unsubscribe(actionA, callbackA);
    AppResponsePublisher.error.unsubscribe(callbackB)
  });
});