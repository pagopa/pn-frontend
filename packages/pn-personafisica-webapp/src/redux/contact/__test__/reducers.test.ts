import { DigitalAddress, DigitalAddresses, LegalChannelType } from './../../../models/contacts';
import { ContactsApi } from '../../../api/contacts/Contacts.api';
import { mockAuthentication } from '../../auth/__test__/reducers.test';
import { store } from '../../store';
import { createOrUpdateLegalAddress, getDigitalAddresses } from '../actions';
import { digitalAddresses } from './test-utils';

describe('Contacts redux state tests', () => {
  mockAuthentication();

  it('Initial state', () => {
    const state = store.getState().contactsState;
    expect(state).toEqual({
      loading: false,
      digitalAddresses: {
        legal: [],
        courtesy: [],
      },
    });
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
        code: updatedDigitalAddress.code
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
        code: updatedDigitalAddress.code
      })
    );
    const payload = action.payload as DigitalAddress;
    expect(action.type).toBe('createOrUpdateLegalAddress/fulfilled');
    expect(payload).toEqual(updatedDigitalAddress);
  });
});
