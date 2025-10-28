import MockAdapter from 'axios-mock-adapter';
import * as _ from 'lodash-es';

import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import {
  newNotification,
  newNotificationRecipients,
  payments,
} from '../../../__mocks__/NewNotification.mock';
import { apiClient, externalClient } from '../../../api/apiClients';
import {
  NewNotificationF24Payment,
  NewNotificationPagoPaPayment,
  PaymentModel,
  PreliminaryInformationsPayload,
} from '../../../models/NewNotification';
import { GroupStatus } from '../../../models/user';
import { newNotificationMapper } from '../../../utility/notification.utility';
import { store } from '../../store';
import {
  createNewNotification,
  getUserGroups,
  uploadNotificationDocument,
  uploadNotificationPaymentDocument,
} from '../actions';
import {
  resetState,
  saveRecipients,
  setAttachments,
  setCancelledIun,
  setDebtPosition,
  setDebtPositionDetail,
  setIsCompleted,
  setPreliminaryInformations,
  setSenderInfos,
} from '../reducers';

const initialState = {
  loading: false,
  notification: {
    notificationFeePolicy: '',
    paProtocolNumber: '',
    subject: '',
    recipients: [],
    documents: [],
    physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
    group: '',
    taxonomyCode: '',
    senderDenomination: '',
    senderTaxId: '',
  },
  groups: [],
  isCompleted: false,
};

describe('New notification redux state tests', () => {
  // eslint-disable-next-line functional/no-let
  let mock: MockAdapter;

  mockAuthentication();

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('Initial state', () => {
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to set cancelled iun', () => {
    const action = store.dispatch(setCancelledIun('mocked-iun'));
    expect(action.type).toBe('newNotificationSlice/setCancelledIun');
    expect(action.payload).toEqual('mocked-iun');
  });

  it('Should be able to set sender infos', () => {
    const action = store.dispatch(
      setSenderInfos({ senderDenomination: 'mocked-denomination', senderTaxId: 'mocked-taxId' })
    );
    expect(action.type).toBe('newNotificationSlice/setSenderInfos');
    expect(action.payload).toEqual({
      senderDenomination: 'mocked-denomination',
      senderTaxId: 'mocked-taxId',
    });
  });

  it('Should be able to get user groups', async () => {
    const mockResponse = [
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' as GroupStatus },
    ];
    mock.onGet('/bff/v1/pa/groups').reply(200, mockResponse);
    const action = await store.dispatch(getUserGroups());
    expect(action.type).toBe('getUserGroups/fulfilled');
    expect(action.payload).toEqual(mockResponse);
    expect(store.getState().newNotificationState.groups).toStrictEqual(mockResponse);
  });

  it('Should be able to set preliminary informations', () => {
    const preliminaryInformations: PreliminaryInformationsPayload = {
      paProtocolNumber: 'mocked-notificationId',
      subject: 'mocked-subject',
      abstract: '',
      physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
      group: '',
      taxonomyCode: '010801N',
      paymentMode: PaymentModel.PAGO_PA,
    };
    const action = store.dispatch(setPreliminaryInformations(preliminaryInformations));
    expect(action.type).toBe('newNotificationSlice/setPreliminaryInformations');
    expect(action.payload).toEqual(preliminaryInformations);
  });

  it('Should be able to save recipients', () => {
    const action = store.dispatch(saveRecipients({ recipients: newNotification.recipients }));
    expect(action.type).toBe('newNotificationSlice/saveRecipients');
    expect(action.payload).toEqual({ recipients: newNotification.recipients });
  });

  it('Should be able to save attachemnts', () => {
    const action = store.dispatch(setAttachments({ documents: newNotification.documents }));
    expect(action.type).toBe('newNotificationSlice/setAttachments');
    expect(action.payload).toEqual({ documents: newNotification.documents });
  });

  it('Should be able to upload attachment', async () => {
    mock
      .onPost(
        '/bff/v1/notifications/sent/documents/preload',
        newNotification.documents.map((document) => ({
          contentType: document.file.data?.type,
          sha256: document.file.sha256.hashBase64,
        }))
      )
      .reply(
        200,
        newNotification.documents.map(() => ({
          url: 'https://mocked-url.com',
          secret: 'mocked-secret',
          httpMethod: 'POST',
          key: 'mocked-preload-key',
        }))
      );
    const extMock = new MockAdapter(externalClient);
    for (const document of newNotification.documents) {
      extMock.onPost(`https://mocked-url.com`).reply(200, document.file.data, {
        'x-amz-version-id': 'mocked-versionToken',
      });
    }
    const action = await store.dispatch(
      uploadNotificationDocument(
        newNotification.documents.map((doc) => ({
          ...doc,
          ref: {
            versionToken: '',
            key: '',
          },
        }))
      )
    );
    expect(action.type).toBe('uploadNotificationDocument/fulfilled');
    expect(action.payload).toEqual(
      newNotification.documents.map((document) => ({
        ...document,
        ref: {
          key: 'mocked-preload-key',
          versionToken: 'mocked-versionToken',
        },
      }))
    );
    extMock.restore();
  });

  it('should be able to set new debt position', () => {
    const recipients = newNotification.recipients.map((recipient) => ({
      ...recipient,
      debtPosition: PaymentModel.PAGO_PA_F24,
    }));

    const action = store.dispatch(setDebtPosition({ recipients }));
    expect(action.type).toBe('newNotificationSlice/setDebtPosition');
    expect(action.payload).toEqual({ recipients });
    expect(store.getState().newNotificationState.notification.recipients).toEqual(recipients);
  });

  it('should clear payments when set debt position to NOTHING', () => {
    store.dispatch(
      setDebtPosition({
        recipients: newNotificationRecipients.map((recipient) => ({
          ...recipient,
          debtPosition: PaymentModel.PAGO_PA_F24,
        })),
      })
    );

    const updatedRecipients = newNotification.recipients.map((recipient) => ({
      ...recipient,
      debtPosition: PaymentModel.NOTHING,
    }));

    const action = store.dispatch(setDebtPosition({ recipients: updatedRecipients }));
    expect(action.type).toBe('newNotificationSlice/setDebtPosition');
    expect(action.payload).toEqual({ recipients: updatedRecipients });
    expect(store.getState().newNotificationState.notification.recipients).toEqual(
      updatedRecipients.map((recipient) => ({
        ...recipient,
        payments: [],
      }))
    );
  });

  it('Should be able to save payment documents', () => {
    const action = store.dispatch(
      setDebtPositionDetail({
        recipients: newNotification.recipients,
        paFee: newNotification.paFee,
        vat: newNotification.vat,
        notificationFeePolicy: newNotification.notificationFeePolicy,
        pagoPaIntMode: newNotification.pagoPaIntMode,
      })
    );
    expect(action.type).toBe('newNotificationSlice/setDebtPositionDetail');
    expect(action.payload).toEqual({
      recipients: newNotification.recipients,
      paFee: newNotification.paFee,
      vat: newNotification.vat,
      notificationFeePolicy: newNotification.notificationFeePolicy,
      pagoPaIntMode: newNotification.pagoPaIntMode,
    });
  });

  it('Should be able to upload payment document', async () => {
    const recipients = _.cloneDeep(newNotificationRecipients);
    // set all mocked ref key and version token to empty
    for (const recipient of recipients) {
      if (recipient.payments) {
        for (const payment of recipient.payments) {
          if (payment.pagoPa) {
            (payment.pagoPa as NewNotificationPagoPaPayment).ref = {
              key: '',
              versionToken: '',
            };
          }

          if (payment.f24) {
            (payment.f24 as NewNotificationF24Payment).ref = {
              key: '',
              versionToken: '',
            };
          }
        }
      }
    }

    for (const taxId in payments) {
      if (payments[taxId].pagoPa) {
        (payments[taxId].pagoPa as NewNotificationPagoPaPayment).ref = {
          key: '',
          versionToken: '',
        };
      }

      if (payments[taxId].f24) {
        (payments[taxId].f24 as NewNotificationF24Payment).ref = {
          key: '',
          versionToken: '',
        };
      }
    }

    mock
      .onPost(
        '/bff/v1/notifications/sent/documents/preload',
        Object.values(payments).reduce((arr, elem) => {
          if (elem.pagoPa) {
            arr.push({
              contentType: elem.pagoPa.contentType,
              sha256: elem.pagoPa.file?.sha256.hashBase64,
            });
          }
          if (elem.f24) {
            arr.push({
              contentType: elem.f24.contentType,
              sha256: elem.f24.file.sha256.hashBase64,
            });
          }
          return arr;
        }, [] as any)
      )
      .reply(200, [
        {
          url: 'https://mocked-url.com',
          secret: 'mocked-secret',
          httpMethod: 'POST',
          key: 'mocked-preload-key',
        },
        {
          url: 'https://mocked-url.com',
          secret: 'mocked-secret',
          httpMethod: 'POST',
          key: 'mocked-preload-key',
        },
        {
          url: 'https://mocked-url.com',
          secret: 'mocked-secret',
          httpMethod: 'POST',
          key: 'mocked-preload-key',
        },
        {
          url: 'https://mocked-url.com',
          secret: 'mocked-secret',
          httpMethod: 'POST',
          key: 'mocked-preload-key',
        },
      ]);
    const extMock = new MockAdapter(externalClient);
    for (const payment of Object.values(payments)) {
      if (payment.pagoPa) {
        extMock.onPost(`https://mocked-url.com`).reply(200, payment.pagoPa.file?.data, {
          'x-amz-version-id': 'mocked-versionToken',
        });
      }
      if (payment.f24) {
        extMock.onPost(`https://mocked-url.com`).reply(200, payment.f24.file.data, {
          'x-amz-version-id': 'mocked-versionToken',
        });
      }
    }
    const action = await store.dispatch(uploadNotificationPaymentDocument(recipients));
    expect(action.type).toBe('uploadNotificationPaymentDocument/fulfilled');

    const expectedResponse = recipients.map((recipient) => ({
      ...recipient,
      payments: recipient.payments?.map((payment) => ({
        ...payment,
        pagoPa: payment.pagoPa
          ? {
              ...payment.pagoPa,
              ref: {
                key: 'mocked-preload-key',
                versionToken: 'mocked-versionToken',
              },
            }
          : undefined,
        f24: payment.f24
          ? {
              ...payment.f24,
              ref: {
                key: 'mocked-preload-key',
                versionToken: 'mocked-versionToken',
              },
            }
          : undefined,
      })),
    }));

    expect(action.payload).toEqual(expectedResponse);
    extMock.restore();
  });

  it('Should be able to set isCompleted status', () => {
    const action = store.dispatch(setIsCompleted());
    expect(action.type).toBe('newNotificationSlice/setIsCompleted');
    expect(action.payload).toEqual(void 0);
  });

  it('Should be able to create new notification', async () => {
    const mockResponse = {
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken',
    };
    const mappedNotification = newNotificationMapper(newNotification);

    mock.onPost('/bff/v1/notifications/sent', mappedNotification).reply(200, mockResponse);
    const action = await store.dispatch(createNewNotification(newNotification));
    expect(action.type).toBe('createNewNotification/fulfilled');
    expect(action.payload).toEqual(mockResponse);
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    expect(action.type).toBe('newNotificationSlice/resetState');
    expect(action.payload).toEqual(undefined);
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });
});
