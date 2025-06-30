import { AppResponse, ServerResponseErrorCode } from '../../models/AppResponse';
import { render, waitFor } from '../../test-utils';
import { AppResponsePublisher } from '../../utility';
import { createAppMessage } from '../../utility/message.utility';
import AppResponseMessage from '../AppResponseMessage';

describe('AppResponseMessage Component', () => {
  const action = 'Event';

  const appErrorResponse: AppResponse = {
    action,
    status: 400,
    traceId: 'TraceId-A',
    timestamp: '2022-10-05',
    errors: [
      {
        code: ServerResponseErrorCode.BAD_REQUEST_ERROR,
        message: { title: 'Error', content: 'This is a test error message' },
        showTechnicalData: false,
      },
    ],
  };

  it('dispatch errors', async () => {
    // render component
    const { testStore } = render(<AppResponseMessage />);
    let state = testStore.getState().appState;
    expect(state.messages.errors).toStrictEqual([]);
    // publish the event
    AppResponsePublisher.error.publish(action, appErrorResponse);
    // check the store
    await waitFor(() => {
      state = testStore.getState().appState;
      const message = createAppMessage({
        title: appErrorResponse.errors![0].message.title,
        message: appErrorResponse.errors![0].message.content,
        showTechnicalData: false,
        status: appErrorResponse.status,
        action,
        errorCode: ServerResponseErrorCode.BAD_REQUEST_ERROR
      });
      expect(state.messages.errors).toStrictEqual([{ ...message, id: '1' }]);
    });
  });
});
