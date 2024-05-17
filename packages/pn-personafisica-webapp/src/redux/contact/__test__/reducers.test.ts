import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import {
  digitalAddresses,
  digitalCourtesyAddresses,
  digitalLegalAddresses,
} from '../../../__mocks__/Contacts.mock';
import { apiClient } from '../../../api/apiClients';
import { AddressType, CourtesyChannelType, IOAllowedValues } from '../../../models/contacts';
import { store } from '../../store';
import {
  createOrUpdateAddress,
  deleteAddress,
  disableIOAddress,
  enableIOAddress,
  getDigitalAddresses,
} from '../actions';
import { resetPecValidation, resetState } from '../reducers';

const initialState = {
  loading: false,
  digitalAddresses: [],
  parties: [],
};

describe('Contacts redux state tests', () => {
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
    const state = store.getState().contactsState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the digital addresses list', async () => {
    mock.onGet('/bff/v1/addresses').reply(200, digitalAddresses);
    const action = await store.dispatch(getDigitalAddresses());
    expect(action.type).toBe('getDigitalAddresses/fulfilled');
    expect(action.payload).toEqual(digitalAddresses);
  });

  it('Should be able to update the digital address with legal value (pec to verify)', async () => {
    const updatedDigitalAddress = { ...digitalLegalAddresses[0], value: 'mario.rossi@mail.it' };
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${updatedDigitalAddress.senderId}/PEC`, {
        value: updatedDigitalAddress.value,
      })
      .reply(200);
    const action = await store.dispatch(
      createOrUpdateAddress({
        addressType: AddressType.LEGAL,
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType,
        value: updatedDigitalAddress.value,
      })
    );
    expect(action.type).toBe('createOrUpdateAddress/fulfilled');
    expect(action.payload).toEqual(void 0);
  });

  it('Should be able to update the digital address with legal value (pec to validate)', async () => {
    const updatedDigitalAddress = { ...digitalLegalAddresses[0], value: 'mario.rossi@mail.it' };
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${updatedDigitalAddress.senderId}/PEC`, {
        value: updatedDigitalAddress.value,
      })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });
    const action = await store.dispatch(
      createOrUpdateAddress({
        addressType: AddressType.LEGAL,
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType,
        value: updatedDigitalAddress.value,
      })
    );
    expect(action.type).toBe('createOrUpdateAddress/fulfilled');
    expect(action.payload).toEqual({
      ...digitalLegalAddresses[0],
      value: '',
      pecValid: false,
    });
  });

  it('Should be able to update the digital address with legal value (pec verified)', async () => {
    const updatedDigitalAddress = { ...digitalLegalAddresses[0], value: 'mario.rossi@mail.it' };
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${updatedDigitalAddress.senderId}/PEC`, {
        value: updatedDigitalAddress.value,
      })
      .reply(204);
    const action = await store.dispatch(
      createOrUpdateAddress({
        addressType: AddressType.LEGAL,
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType,
        value: updatedDigitalAddress.value,
      })
    );
    expect(action.type).toBe('createOrUpdateAddress/fulfilled');
    expect(action.payload).toEqual({
      ...updatedDigitalAddress,
      pecValid: true,
      senderName: undefined,
    });
  });

  it('Should be able to remove the digital address with legal value', async () => {
    mock.onDelete(`/bff/v1/addresses/LEGAL/${digitalLegalAddresses[0].senderId}/PEC`).reply(204);
    const action = await store.dispatch(
      deleteAddress({
        addressType: AddressType.LEGAL,
        senderId: digitalLegalAddresses[0].senderId,
        channelType: digitalLegalAddresses[0].channelType,
      })
    );
    expect(action.type).toBe('deleteAddress/fulfilled');
    expect(action.payload).toEqual(void 0);
  });

  it('Should be able to update the digital address with courtesy value (email to verify)', async () => {
    const emailContact = digitalCourtesyAddresses.find(
      (el) => el.channelType === CourtesyChannelType.EMAIL
    );
    const updatedDigitalAddress = { ...emailContact!, value: 'mario.rossi@mail.it' };
    mock
      .onPost(`/bff/v1/addresses/COURTESY/${updatedDigitalAddress.senderId}/EMAIL`)
      .reply(200, { value: updatedDigitalAddress.value });
    const action = await store.dispatch(
      createOrUpdateAddress({
        addressType: AddressType.COURTESY,
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType,
        value: updatedDigitalAddress.value,
      })
    );
    expect(action.type).toBe('createOrUpdateAddress/fulfilled');
    expect(action.payload).toEqual(void 0);
  });

  it('Should be able to update the digital address with courtesy value (email verified)', async () => {
    const emailContact = digitalCourtesyAddresses.find(
      (el) => el.channelType === CourtesyChannelType.EMAIL
    );
    const updatedDigitalAddress = { ...emailContact!, value: 'mario.rossi@mail.it' };
    mock
      .onPost(`/bff/v1/addresses/COURTESY/${updatedDigitalAddress.senderId}/EMAIL`, {
        value: updatedDigitalAddress.value,
      })
      .reply(204);
    const action = await store.dispatch(
      createOrUpdateAddress({
        addressType: AddressType.COURTESY,
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType,
        value: updatedDigitalAddress.value,
      })
    );
    expect(action.type).toBe('createOrUpdateAddress/fulfilled');
    expect(action.payload).toEqual(updatedDigitalAddress);
  });

  it('Should be able to remove the digital address with courtesy value', async () => {
    const emailContact = digitalCourtesyAddresses.find(
      (el) => el.channelType === CourtesyChannelType.EMAIL
    );
    mock.onDelete(`/bff/v1/addresses/COURTESY/${emailContact!.senderId}/EMAIL`).reply(204);
    const action = await store.dispatch(
      deleteAddress({
        addressType: AddressType.COURTESY,
        senderId: emailContact!.senderId,
        channelType: emailContact!.channelType,
      })
    );
    expect(action.type).toBe('deleteAddress/fulfilled');
    expect(action.payload).toEqual(void 0);
  });

  it('Should be able to enable App IO', async () => {
    const ioContact = digitalCourtesyAddresses.find(
      (el) => el.channelType === CourtesyChannelType.IOMSG
    );
    const ioAddress = { ...ioContact!, value: IOAllowedValues.ENABLED };
    mock
      .onPost(`/bff/v1/addresses/COURTESY/${ioAddress.senderId}/APPIO`, {
        value: 'APPIO',
        verificationCode: '00000',
      })
      .reply(204, ioAddress);
    const action = await store.dispatch(enableIOAddress());
    expect(action.type).toBe('enableIOAddress/fulfilled');
    expect(action.payload).toEqual(ioAddress);
  });

  it('Should be able to disable App IO', async () => {
    const ioContact = digitalCourtesyAddresses.find(
      (el) => el.channelType === CourtesyChannelType.IOMSG
    );
    mock.onDelete(`/bff/v1/addresses/COURTESY/${ioContact!.senderId}/APPIO`).reply(204);
    const action = await store.dispatch(disableIOAddress());
    expect(action.type).toBe('disableIOAddress/fulfilled');
    expect(action.payload).toEqual(void 0);
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    expect(action.type).toBe('contactsSlice/resetState');
    expect(action.payload).toEqual(void 0);
    const state = store.getState().contactsState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to reset pec validation', async () => {
    const updatedDigitalAddress = {
      ...digitalLegalAddresses[0],
      value: 'mario.rossi@mail.it',
      senderId: 'default',
    };
    mock
      .onPost(`/bff/v1/addresses/COURTESY/${updatedDigitalAddress.senderId}/PEC`, {
        value: updatedDigitalAddress.value,
      })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });
    await store.dispatch(
      createOrUpdateAddress({
        addressType: AddressType.LEGAL,
        recipientId: updatedDigitalAddress.recipientId,
        senderId: 'default',
        channelType: updatedDigitalAddress.channelType,
        value: updatedDigitalAddress.value,
      })
    );
    const action = store.dispatch(resetPecValidation());
    expect(action.type).toBe('contactsSlice/resetPecValidation');
    expect(action.payload).toEqual(void 0);
    const state = store
      .getState()
      .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.LEGAL);
    expect(state).toEqual([]);
  });
});
