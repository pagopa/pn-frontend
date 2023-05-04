import {
  DigitalAddress,
  DigitalAddresses,
  LegalChannelType,
  CourtesyChannelType,
  IOAllowedValues,
} from './../../../models/contacts';
import { ContactsApi } from '../../../api/contacts/Contacts.api';
import { mockAuthentication } from '../../auth/__test__/test-utils';
import { store } from '../../store';
import {
  createOrUpdateCourtesyAddress,
  createOrUpdateLegalAddress,
  deleteCourtesyAddress,
  deleteLegalAddress,
  disableIOAddress,
  enableIOAddress,
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
    const apiSpy = jest.spyOn(ContactsApi, 'getDigitalAddresses');
    apiSpy.mockResolvedValue(digitalAddresses);
    const action = await store.dispatch(getDigitalAddresses('mocked-recipientId'));
    const payload = action.payload as DigitalAddresses;
    expect(action.type).toBe('getDigitalAddresses/fulfilled');
    expect(payload).toEqual(digitalAddresses);
  });

  it('Should be able to update the digital address with legal value (email to verify)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.legal[0], value: 'mario.rossi@mail.it' };
    const apiSpy = jest.spyOn(ContactsApi, 'createOrUpdateLegalAddress');
    apiSpy.mockResolvedValue(void 0);
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
    expect(payload).toEqual(void 0);
  });

  it('Should be able to update the digital address with legal value (email verified)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.legal[0], value: 'mario.rossi@mail.it' };
    const apiSpy = jest.spyOn(ContactsApi, 'createOrUpdateLegalAddress');
    apiSpy.mockResolvedValue(updatedDigitalAddress);
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
    expect(payload).toEqual(updatedDigitalAddress);
  });

  it('Should be able to remove the digital address with legal value', async () => {
    const apiSpy = jest.spyOn(ContactsApi, 'deleteLegalAddress');
    apiSpy.mockResolvedValue(digitalAddresses.legal[0].senderId);
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
  });

  it('Should be able to update the digital address with courtesy value (email to verify)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.courtesy[0], value: 'mario.rossi@mail.it' };
    const apiSpy = jest.spyOn(ContactsApi, 'createOrUpdateCourtesyAddress');
    apiSpy.mockResolvedValue(void 0);
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
    expect(payload).toEqual(void 0);
  });

  it('Should be able to update the digital address with courtesy value (email verified)', async () => {
    const updatedDigitalAddress = { ...digitalAddresses.courtesy[0], value: 'mario.rossi@mail.it' };
    const apiSpy = jest.spyOn(ContactsApi, 'createOrUpdateCourtesyAddress');
    apiSpy.mockResolvedValue(updatedDigitalAddress);
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
  });

  it('Should be able to remove the digital address with courtesy value', async () => {
    const apiSpy = jest.spyOn(ContactsApi, 'deleteCourtesyAddress');
    apiSpy.mockResolvedValue(digitalAddresses.courtesy[0].senderId);
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
  });

  it('Should be able to enable App IO', async () => {
    const ioAddress = { ...digitalAddresses.courtesy[1], value: IOAllowedValues.ENABLED };
    const apiSpy = jest.spyOn(ContactsApi, 'createOrUpdateCourtesyAddress');
    apiSpy.mockResolvedValue(ioAddress);
    const action = await store.dispatch(enableIOAddress(ioAddress.recipientId));
    const payload = action.payload as DigitalAddress;
    expect(action.type).toBe('enableIOAddress/fulfilled');
    expect(payload).toEqual(ioAddress);
  });

  it('Should be able to disable App IO', async () => {
    const ioAddress = digitalAddresses.courtesy[1];
    const apiSpy = jest.spyOn(ContactsApi, 'deleteCourtesyAddress');
    apiSpy.mockResolvedValue(ioAddress.senderId);
    const action = await store.dispatch(disableIOAddress(ioAddress.recipientId));
    const payload = action.payload as DigitalAddress;
    expect(action.type).toBe('disableIOAddress/fulfilled');
    expect(payload).toEqual(ioAddress.senderId);
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
    const apiSpy = jest.spyOn(ContactsApi, 'createOrUpdateLegalAddress');
    apiSpy.mockResolvedValue(updatedDigitalAddress);
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
  });
});
