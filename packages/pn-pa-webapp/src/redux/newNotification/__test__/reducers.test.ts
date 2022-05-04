import { mockAuthentication } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import { resetNewNotificationState } from '../actions';

const initialState = {
  loading: false,
  notification: {
    paNotificationId: '',
    subject: '',
    cancelledIun: '',
    recipients: [],
    documents: [],
    payment: {},
    physicalCommunicationType: '',
    group: ''
  }
};

describe('New notification redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetNewNotificationState());
    const payload = action.payload;
    expect(action.type).toBe('resetNewNotificationState');
    expect(payload).toEqual(undefined);
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });
});
