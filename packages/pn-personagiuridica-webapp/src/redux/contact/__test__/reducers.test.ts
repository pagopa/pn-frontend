import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { apiClient } from '../../../api/apiClients';
import {
  CONTACTS_LIST,
  COURTESY_CONTACT,
  LEGAL_CONTACT,
} from '../../../api/contacts/contacts.routes';
import { CourtesyChannelType, LegalChannelType } from '../../../models/contacts';
import { store } from '../../store';
import {
  createOrUpdateCourtesyAddress,
  createOrUpdateLegalAddress,
  deleteCourtesyAddress,
  deleteLegalAddress,
  getDigitalAddresses,
} from '../actions';
import { resetPecValidation, resetState } from '../reducers';

const initialState = {
  loading: false,
  digitalAddresses: {
    legal: [],
    courtesy: [],
  },
  parties: [],
};

describe('Contacts redux state tests', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().contactsState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to fetch the digital addresses list', async () => {
    mock.onGet(CONTACTS_LIST()).reply(200, digitalAddresses);
    const action = await store.dispatch(getDigitalAddresses('mocked-recipientId'));
    expect(action.type).toBe('getDigitalAddresses/fulfilled');
    expect(action.payload).toEqual(digitalAddresses);
  });

  it('Should be able to update the digital address with legal value (pec to verify)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.legal[0], value: 'mario.rossi@mail.it' };
    mock.onPost(LEGAL_CONTACT(updatedDigitalAddress.senderId, LegalChannelType.PEC)).reply(200, {
      value: updatedDigitalAddress.value,
    });
    const action = await store.dispatch(
      createOrUpdateLegalAddress({
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType as LegalChannelType,
        value: updatedDigitalAddress.value,
      })
    );
    expect(action.type).toBe('createOrUpdateLegalAddress/fulfilled');
    expect(action.payload).toEqual(undefined);
  });

  it('Should be able to update the digital address with legal value (pec to validate)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.legal[0], value: 'mario.rossi@mail.it' };
    mock
      .onPost(LEGAL_CONTACT(updatedDigitalAddress.senderId, LegalChannelType.PEC), {
        value: updatedDigitalAddress.value,
      })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });

    const action = await store.dispatch(
      createOrUpdateLegalAddress({
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType as LegalChannelType,
        value: updatedDigitalAddress.value,
      })
    );
    expect(action.type).toBe('createOrUpdateLegalAddress/fulfilled');
    expect(action.payload).toEqual({
      ...digitalAddresses.legal[0],
      value: '',
      pecValid: false,
    });
  });

  it('Should be able to update the digital address with legal value (pec verified)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.legal[0], value: 'mario.rossi@mail.it' };
    mock
      .onPost(LEGAL_CONTACT(updatedDigitalAddress.senderId, LegalChannelType.PEC), {
        value: updatedDigitalAddress.value,
      })
      .reply(204);
    const action = await store.dispatch(
      createOrUpdateLegalAddress({
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType as LegalChannelType,
        value: updatedDigitalAddress.value,
      })
    );
    expect(action.type).toBe('createOrUpdateLegalAddress/fulfilled');
    expect(action.payload).toEqual({
      ...updatedDigitalAddress,
      pecValid: true,
      senderName: undefined,
    });
  });

  it('Should be able to remove the digital address with legal value', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.legal[0], value: 'mario.rossi@mail.it' };
    mock
      .onDelete(LEGAL_CONTACT(digitalAddresses.legal[0].senderId, LegalChannelType.PEC))
      .reply(204);
    const action = await store.dispatch(
      deleteLegalAddress({
        recipientId: digitalAddresses.legal[0].recipientId,
        senderId: digitalAddresses.legal[0].senderId,
        channelType: digitalAddresses.legal[0].channelType as LegalChannelType,
      })
    );
    expect(action.type).toBe('deleteLegalAddress/fulfilled');
    expect(action.payload).toEqual(digitalAddresses.legal[0].senderId);
  });

  it('Should be able to update the digital address with courtesy value (email to verify)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.courtesy[0], value: 'mario.rossi@mail.it' };
    mock
      .onPost(COURTESY_CONTACT(updatedDigitalAddress.senderId, CourtesyChannelType.EMAIL))
      .reply(200, { value: updatedDigitalAddress.value });

    const action = await store.dispatch(
      createOrUpdateCourtesyAddress({
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType as CourtesyChannelType,
        value: updatedDigitalAddress.value,
      })
    );
    expect(action.type).toBe('createOrUpdateCourtesyAddress/fulfilled');
    expect(action.payload).toEqual(undefined);
  });

  it('Should be able to update the digital address with courtesy value (email verified)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.courtesy[0], value: 'mario.rossi@mail.it' };
    mock
      .onPost(COURTESY_CONTACT(updatedDigitalAddress.senderId, CourtesyChannelType.EMAIL), {
        value: updatedDigitalAddress.value,
      })
      .reply(204);
    const action = await store.dispatch(
      createOrUpdateCourtesyAddress({
        recipientId: updatedDigitalAddress.recipientId,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType as CourtesyChannelType,
        value: updatedDigitalAddress.value,
      })
    );
    expect(action.type).toBe('createOrUpdateCourtesyAddress/fulfilled');
    expect(action.payload).toEqual(updatedDigitalAddress);
  });

  it('Should be able to remove the digital address with courtesy value', async () => {
    const emailContact = digitalAddresses.courtesy.find(
      (el) => el.channelType === CourtesyChannelType.EMAIL
    );
    mock.onDelete(COURTESY_CONTACT(emailContact!.senderId, CourtesyChannelType.EMAIL)).reply(204);
    const action = await store.dispatch(
      deleteCourtesyAddress({
        recipientId: emailContact!.recipientId,
        senderId: emailContact!.senderId,
        channelType: emailContact!.channelType,
      })
    );
    expect(action.type).toBe('deleteCourtesyAddress/fulfilled');
    expect(action.payload).toEqual(emailContact!.senderId);
  });

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    expect(action.type).toBe('contactsSlice/resetState');
    expect(action.payload).toEqual(undefined);
    const state = store.getState().contactsState;
    expect(state).toEqual(initialState);
  });

  it('Should be able to reset pec validation', async () => {
    const updatedDigitalAddress = {
      ...digitalAddresses.legal[0],
      value: 'mario.rossi@mail.it',
      senderId: 'default',
    };
    mock
      .onPost(LEGAL_CONTACT(updatedDigitalAddress.senderId, LegalChannelType.PEC), {
        value: updatedDigitalAddress.value,
      })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });
    await store.dispatch(
      createOrUpdateLegalAddress({
        recipientId: updatedDigitalAddress.recipientId,
        senderId: 'default',
        channelType: updatedDigitalAddress.channelType as LegalChannelType,
        value: updatedDigitalAddress.value,
      })
    );
    const action = store.dispatch(resetPecValidation());
    expect(action.type).toBe('contactsSlice/resetPecValidation');
    expect(action.payload).toEqual(undefined);
    const state = store.getState().contactsState.digitalAddresses.legal;
    expect(state).toEqual([]);
  });
});
