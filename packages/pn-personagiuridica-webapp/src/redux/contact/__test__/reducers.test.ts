import {
  DigitalAddress,
  DigitalAddresses,
  LegalChannelType,
  CourtesyChannelType,
} from '../../../models/contacts';
import { apiClient } from '../../../api/apiClients';
import {
  CONTACTS_LIST,
  COURTESY_CONTACT,
  LEGAL_CONTACT,
} from '../../../api/contacts/contacts.routes';
import { mockApi } from '../../../__test__/test-utils';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import {
  createOrUpdateCourtesyAddress,
  createOrUpdateLegalAddress,
  deleteCourtesyAddress,
  deleteLegalAddress,
  getDigitalAddresses,
} from '../actions';
import { resetPecValidation, resetState } from '../reducers';
import { digitalAddresses } from './test-utils';

const initialState = {
  loading: false,
  digitalAddresses: {
    legal: [],
    courtesy: [],
  },
  parties: [],
};

describe('Contacts redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().contactsState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the digital addresses list', async () => {
    const mock = mockApi(apiClient, 'GET', CONTACTS_LIST(), 200, undefined, digitalAddresses);
    const action = await store.dispatch(getDigitalAddresses('mocked-recipientId'));
    const payload = action.payload as DigitalAddresses;
    expect(action.type).toBe('getDigitalAddresses/fulfilled');
    expect(payload).toEqual(digitalAddresses);
    mock.reset();
    mock.restore();
  });

  it('Should be able to update the digital address with legal value (email to verify)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.legal[0], value: 'mario.rossi@mail.it' };
    const mock = mockApi(
      apiClient,
      'POST',
      LEGAL_CONTACT(updatedDigitalAddress.senderId, LegalChannelType.PEC),
      200,
      { value: updatedDigitalAddress.value }
    );
    const action = await store.dispatch(
      createOrUpdateLegalAddress({
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType as LegalChannelType,
        value: updatedDigitalAddress.value,
      })
    );
    const payload = action.payload as DigitalAddress;
    expect(action.type).toBe('createOrUpdateLegalAddress/fulfilled');
    expect(payload).toEqual(undefined);
    mock.reset();
    mock.restore();
  });

  it('Should be able to update the digital address with legal value (email to validate)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.legal[0], value: 'mario.rossi@mail.it' };
    const mock = mockApi(
      apiClient,
      'POST',
      LEGAL_CONTACT(updatedDigitalAddress.senderId, LegalChannelType.PEC),
      200,
      { value: updatedDigitalAddress.value },
      { result: 'PEC_VALIDATION_REQUIRED' }
    );
    const action = await store.dispatch(
      createOrUpdateLegalAddress({
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType as LegalChannelType,
        value: updatedDigitalAddress.value,
      })
    );
    const payload = action.payload as DigitalAddress;
    expect(action.type).toBe('createOrUpdateLegalAddress/fulfilled');
    expect(payload).toEqual({
      ...digitalAddresses.legal[0],
      value: '',
      pecValid: false,
    });
    mock.reset();
    mock.restore();
  });

  it('Should be able to update the digital address with legal value (email verified)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.legal[0], value: 'mario.rossi@mail.it' };
    const mock = mockApi(
      apiClient,
      'POST',
      LEGAL_CONTACT(updatedDigitalAddress.senderId, LegalChannelType.PEC),
      204,
      { value: updatedDigitalAddress.value }
    );
    const action = await store.dispatch(
      createOrUpdateLegalAddress({
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType as LegalChannelType,
        value: updatedDigitalAddress.value,
      })
    );
    const payload = action.payload as DigitalAddress;
    expect(action.type).toBe('createOrUpdateLegalAddress/fulfilled');
    expect(payload).toEqual({ ...updatedDigitalAddress, pecValid: true, senderName: undefined });
    mock.reset();
    mock.restore();
  });

  it('Should be able to remove the digital address with legal value', async () => {
    const mock = mockApi(
      apiClient,
      'DELETE',
      LEGAL_CONTACT(digitalAddresses.legal[0].senderId, LegalChannelType.PEC),
      204
    );
    const action = await store.dispatch(
      deleteLegalAddress({
        recipientId: digitalAddresses.legal[0].recipientId,
        senderId: digitalAddresses.legal[0].senderId,
        channelType: digitalAddresses.legal[0].channelType as LegalChannelType,
      })
    );
    const payload = action.payload as DigitalAddress;
    expect(action.type).toBe('deleteLegalAddress/fulfilled');
    expect(payload).toEqual(digitalAddresses.legal[0].senderId);
    mock.reset();
    mock.restore();
  });

  it('Should be able to update the digital address with courtesy value (email to verify)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.courtesy[0], value: 'mario.rossi@mail.it' };
    const mock = mockApi(
      apiClient,
      'POST',
      COURTESY_CONTACT(updatedDigitalAddress.senderId, CourtesyChannelType.EMAIL),
      200,
      { value: updatedDigitalAddress.value }
    );
    const action = await store.dispatch(
      createOrUpdateCourtesyAddress({
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType as CourtesyChannelType,
        value: updatedDigitalAddress.value,
      })
    );
    const payload = action.payload as DigitalAddress;
    expect(action.type).toBe('createOrUpdateCourtesyAddress/fulfilled');
    expect(payload).toEqual(undefined);
    mock.reset();
    mock.restore();
  });

  it('Should be able to update the digital address with courtesy value (email verified)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.courtesy[0], value: 'mario.rossi@mail.it' };
    const mock = mockApi(
      apiClient,
      'POST',
      COURTESY_CONTACT(updatedDigitalAddress.senderId, CourtesyChannelType.EMAIL),
      204,
      { value: updatedDigitalAddress.value }
    );
    const action = await store.dispatch(
      createOrUpdateCourtesyAddress({
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType as CourtesyChannelType,
        value: updatedDigitalAddress.value,
      })
    );
    const payload = action.payload as DigitalAddress;
    expect(action.type).toBe('createOrUpdateCourtesyAddress/fulfilled');
    expect(payload).toEqual(updatedDigitalAddress);
    mock.reset();
    mock.restore();
  });

  it('Should be able to remove the digital address with courtesy value', async () => {
    const mock = mockApi(
      apiClient,
      'DELETE',
      COURTESY_CONTACT(digitalAddresses.courtesy[0].senderId, CourtesyChannelType.EMAIL),
      204
    );
    const action = await store.dispatch(
      deleteCourtesyAddress({
        recipientId: digitalAddresses.courtesy[0].recipientId,
        senderId: digitalAddresses.courtesy[0].senderId,
        channelType: digitalAddresses.courtesy[0].channelType as CourtesyChannelType,
      })
    );
    const payload = action.payload as DigitalAddress;
    expect(action.type).toBe('deleteCourtesyAddress/fulfilled');
    expect(payload).toEqual(digitalAddresses.courtesy[0].senderId);
    mock.reset();
    mock.restore();
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    const payload = action.payload;
    expect(action.type).toBe('contactsSlice/resetState');
    expect(payload).toEqual(undefined);
    const state = store.getState().contactsState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to reset pec validation', async () => {
    const updatedDigitalAddress = {
      ...digitalAddresses.legal[0],
      value: 'mario.rossi@mail.it',
      senderId: 'default',
    };
    const mock = mockApi(
      apiClient,
      'POST',
      LEGAL_CONTACT(updatedDigitalAddress.senderId, LegalChannelType.PEC),
      200,
      { value: updatedDigitalAddress.value },
      { result: 'PEC_VALIDATION_REQUIRED' }
    );
    await store.dispatch(
      createOrUpdateLegalAddress({
        recipientId: updatedDigitalAddress.recipientId,
        senderId: 'default',
        channelType: updatedDigitalAddress.channelType as LegalChannelType,
        value: updatedDigitalAddress.value,
      })
    );
    const action = store.dispatch(resetPecValidation());
    const payload = action.payload;
    expect(action.type).toBe('contactsSlice/resetPecValidation');
    expect(payload).toEqual(undefined);
    const state = store.getState().contactsState.digitalAddresses.legal;
    expect(state).toEqual([]);
    mock.reset();
    mock.restore();
  });
});
