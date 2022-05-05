import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { PaymentModel } from '../../../models/newNotification';
import { mockAuthentication } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import { resetNewNotificationState, setPreliminaryInformations } from '../actions';

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
    paymentMode: '',
    group: ''
  }
};

describe('New notification redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to set preliminary informations', () => {
    const preliminaryInformations = {
      paNotificationId: 'mocked-notificationId',
      subject: 'mocked-subject',
      description: '',
      physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
      group: '',
      paymentModel: PaymentModel.PAGO_PA_NOTICE_F24
    };
    const action = store.dispatch(
      setPreliminaryInformations(preliminaryInformations)
    );
    const payload = action.payload;
    expect(action.type).toBe('setPreliminaryInformations');
    expect(payload).toEqual(preliminaryInformations);
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
