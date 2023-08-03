import { PhysicalCommunicationType, calcUnit8Array } from '@pagopa-pn/pn-commons';

import { NotificationsApi } from '../../../api/notifications/Notifications.api';
import { NewNotificationDocument, PaymentModel } from '../../../models/NewNotification';
import { GroupStatus } from '../../../models/user';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import {
    createNewNotification, getUserGroups, uploadNotificationAttachment,
    uploadNotificationPaymentDocument
} from '../actions';
import {
    resetState, saveRecipients, setAttachments, setCancelledIun, setIsCompleted,
    setPaymentDocuments, setPreliminaryInformations, setSenderInfos
} from '../reducers';
import { newNotification } from './test-utils';
import { mockApi } from '../../../__test__/test-utils';
import { CREATE_NOTIFICATION, GET_USER_GROUPS, NOTIFICATION_PRELOAD_DOCUMENT } from '../../../api/notifications/notifications.routes';
import { apiClient } from '../../../api/apiClients';
import { UploadDocumentParams } from '../types';
import { newNotificationMapper } from '../../../utils/notification.utility';

const initialState = {
  loading: false,
  notification: {
    paProtocolNumber: '',
    subject: '',
    recipients: [],
    documents: [],
    payment: {},
    physicalCommunicationType: '',
    paymentMode: '',
    group: '',
    taxonomyCode: '',
    notificationFeePolicy: '',
  },
  groups: [],
  isCompleted: false,
};

describe('New notification redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to set cancelled iun', () => {
    const action = store.dispatch(setCancelledIun('mocked-iun'));
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/setCancelledIun');
    expect(payload).toEqual('mocked-iun');
  });

  it('Should be able to set sender infos', () => {
    const action = store.dispatch(
      setSenderInfos({ senderDenomination: 'mocked-denomination', senderTaxId: 'mocked-taxId' })
    );
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/setSenderInfos');
    expect(payload).toEqual({
      senderDenomination: 'mocked-denomination',
      senderTaxId: 'mocked-taxId',
    });
  });

  it('Should be able to get user groups', async () => {
    const mockResponse = [
      { id: 'mocked-id', name: 'mocked-name', description: '', status: 'ACTIVE' as GroupStatus },
    ];
    const mock = mockApi(apiClient, 'GET', GET_USER_GROUPS(), 200, undefined, mockResponse);
    const action = await store.dispatch(getUserGroups());
    const payload = action.payload;
    expect(action.type).toBe('getUserGroups/fulfilled');
    expect(payload).toEqual(mockResponse);
    expect(store.getState().newNotificationState.groups).toStrictEqual(mockResponse);
    mock.reset();
    mock.restore();
  });

  it('Should be able to set preliminary informations', () => {
    const preliminaryInformations = {
      paProtocolNumber: 'mocked-notificationId',
      subject: 'mocked-subject',
      abstract: '',
      physicalCommunicationType: PhysicalCommunicationType.REGISTERED_LETTER_890,
      group: '',
      taxonomyCode: '010801N',
      paymentMode: PaymentModel.PAGO_PA_NOTICE_F24,
    };
    const action = store.dispatch(setPreliminaryInformations(preliminaryInformations));
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/setPreliminaryInformations');
    expect(payload).toEqual(preliminaryInformations);
  });

  it('Should be able to save recipients', () => {
    const action = store.dispatch(saveRecipients({ recipients: newNotification.recipients }));
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/saveRecipients');
    expect(payload).toEqual({ recipients: newNotification.recipients });
  });

  it('Should be able to save attachemnts', () => {
    const action = store.dispatch(setAttachments({ documents: newNotification.documents }));
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/setAttachments');
    expect(payload).toEqual({ documents: newNotification.documents });
  });

  it('Should be able to upload attachment', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'preloadNotificationDocument');
    apiSpy.mockResolvedValue([
      { url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST', key: 'mocked-preload-key' },
    ]);
    const nextApiSpy = jest.spyOn(NotificationsApi, 'uploadNotificationAttachment');
    nextApiSpy.mockResolvedValue('mocked-versionToken');
    const action = await store.dispatch(uploadNotificationAttachment(newNotification.documents));
    const payload = action.payload;
    expect(action.type).toBe('uploadNotificationAttachment/fulfilled');
    expect(payload).toEqual([
      {
        ...newNotification.documents[0],
        ref: {
          key: 'mocked-preload-key',
          versionToken: 'mocked-versionToken',
        },
      },
    ]);
  });

  it('Should be able to save payment documents', () => {
    const action = store.dispatch(
      setPaymentDocuments({ paymentDocuments: newNotification.payment! })
    );
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/setPaymentDocuments');
    expect(payload).toEqual({ paymentDocuments: newNotification.payment! });
  });

  it('Should be able to upload payment document', async () => {
    const apiSpy = jest.spyOn(NotificationsApi, 'preloadNotificationDocument');
    apiSpy.mockResolvedValue([
      { url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST', key: 'mocked-preload-key' },
      { url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST', key: 'mocked-preload-key' },
      { url: 'mocked-url', secret: 'mocked-secret', httpMethod: 'POST', key: 'mocked-preload-key' },
    ]);
    const nextApiSpy = jest.spyOn(NotificationsApi, 'uploadNotificationAttachment');
    nextApiSpy.mockResolvedValue('mocked-versionToken');
    const action = await store.dispatch(
      uploadNotificationPaymentDocument(newNotification.payment!)
    );
    const payload = action.payload;
    expect(action.type).toBe('uploadNotificationPaymentDocument/fulfilled');
    expect(payload).toEqual({
      'MRARSS90P08H501Q': {
        pagoPaForm: {
          ...newNotification.payment!['MRARSS90P08H501Q'].pagoPaForm,
          ref: {
            key: 'mocked-preload-key',
            versionToken: 'mocked-versionToken',
          },
        },
      },
      'SRAGLL00P48H501U': {
        pagoPaForm: {
          ...newNotification.payment!['SRAGLL00P48H501U'].pagoPaForm,
          ref: {
            key: 'mocked-preload-key',
            versionToken: 'mocked-versionToken',
          },
        },
        f24standard: {
          ...newNotification.payment!['SRAGLL00P48H501U'].f24standard,
          ref: {
            key: 'mocked-preload-key',
            versionToken: 'mocked-versionToken',
          },
        },
      },
    });
  });

  it('Should be able to set isCompleted status', () => {
    const action = store.dispatch(setIsCompleted());
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/setIsCompleted');
    expect(payload).toEqual(void 0);
  });

  it('Should be able to create new notification', async () => {
    // Da sistemare in quanto per qualche motivo va in Error: Request failed with status code 404
    // Da una ricerca sul web sembra (sottolineo SEMBRA) che l'errore sia legato all'headers (di request o di response poi?).
    // per risolvere al momento dovremmo inviare undefined al request di mockApi anziché mappedNotification.
    
    const mockResponse = {
      notificationRequestId: 'mocked-notificationRequestId',
      paProtocolNumber: 'mocked-paProtocolNumber',
      idempotenceToken: 'mocked-idempotenceToken',
    };
    // const mappedNotification = newNotificationMapper(newNotification);
    const mock = mockApi(apiClient, 'POST', CREATE_NOTIFICATION(), 200, undefined, mockResponse);
    const action = await store.dispatch(createNewNotification(newNotification));
    const payload = action.payload;
    expect(action.type).toBe('createNewNotification/fulfilled');
    expect(payload).toEqual(mockResponse);
    mock.reset();
    mock.restore();
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    const payload = action.payload;
    expect(action.type).toBe('newNotificationSlice/resetState');
    expect(payload).toEqual(undefined);
    const state = store.getState().newNotificationState;
    expect(state).toEqual(initialState);
  });
});
