import MockAdapter from 'axios-mock-adapter';

import { mockAuthentication } from '../../../__mocks__/Auth.mock';
import {
  digitalAddresses,
  digitalCourtesyAddresses,
  digitalLegalAddresses,
} from '../../../__mocks__/Contacts.mock';
import { createTestStore } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import { store } from '../../store';
import {
  createOrUpdateAddress,
  deleteAddress,
  getDigitalAddresses,
  removeSercqAndEmail,
} from '../actions';
import { contactsSelectors, resetPecValidation, resetState } from '../reducers';

const initialState = {
  loading: false,
  digitalAddresses: [],
  parties: [],
  event: null,
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
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    const action = await store.dispatch(
      createOrUpdateAddress({
        addressType: AddressType.LEGAL,
        senderId: updatedDigitalAddress.senderId,
        channelType: updatedDigitalAddress.channelType,
        value: updatedDigitalAddress.value,
      })
    );
    expect(action.type).toBe('createOrUpdateAddress/fulfilled');
    expect(action.payload).toEqual(undefined);
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
      (el) => el.channelType === ChannelType.EMAIL
    );
    const updatedDigitalAddress = { ...emailContact!, value: 'mario.rossi@mail.it' };
    mock
      .onPost(`/bff/v1/addresses/COURTESY/${updatedDigitalAddress.senderId}/EMAIL`, {
        value: updatedDigitalAddress.value,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    const action = await store.dispatch(
      createOrUpdateAddress({
        addressType: AddressType.COURTESY,
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
      (el) => el.channelType === ChannelType.EMAIL && el.senderId === 'default'
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
      (el) => el.channelType === ChannelType.EMAIL
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

  it('Should be able to reset state', () => {
    const action = store.dispatch(resetState());
    expect(action.type).toBe('contactsSlice/resetState');
    expect(action.payload).toEqual(undefined);
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
        senderId: 'default',
        channelType: updatedDigitalAddress.channelType,
        value: updatedDigitalAddress.value,
      })
    );
    const action = store.dispatch(resetPecValidation('default'));
    expect(action.type).toBe('contactsSlice/resetPecValidation');
    expect(action.payload).toEqual('default');
    const state = store
      .getState()
      .contactsState.digitalAddresses.filter(
        (address) =>
          (address.senderId !== action.payload && address.addressType === AddressType.LEGAL) ||
          address.addressType === AddressType.COURTESY
      );
    expect(state).toEqual([]);
  });

  it('Shoud be able to retrieve addresses', () => {
    // init store
    const testStore = createTestStore({
      contactsState: {
        digitalAddresses,
      },
    });
    const result = contactsSelectors.selectAddresses(testStore.getState());
    expect(result.addresses).toStrictEqual(digitalAddresses);
    expect(result.legalAddresses).toStrictEqual(
      digitalAddresses.filter((addr) => addr.addressType === AddressType.LEGAL)
    );
    expect(result.courtesyAddresses).toStrictEqual(
      digitalAddresses.filter((addr) => addr.addressType === AddressType.COURTESY)
    );
    for (const channelType of Object.values(ChannelType)) {
      expect(result[`default${channelType}Address`]).toStrictEqual(
        digitalAddresses.find(
          (addr) => addr.channelType === channelType && addr.senderId === 'default'
        )
      );
      expect(result[`special${channelType}Addresses`]).toStrictEqual(
        digitalAddresses.filter(
          (addr) => addr.channelType === channelType && addr.senderId !== 'default'
        )
      );
    }
  });

  it('should handle loading state during fetch digital addresses', async () => {
    const testStore = createTestStore({
      contactsState: initialState,
    });

    mock.onGet('/bff/v1/addresses').reply(() => {
      // verify loading is true before response
      const stateBefore = testStore.getState().contactsState;
      expect(stateBefore.loading).toBe(true);
      return [200, digitalAddresses];
    });

    const action = await testStore.dispatch(getDigitalAddresses());

    // after response
    const stateAfter = testStore.getState().contactsState;
    expect(stateAfter.loading).toBe(false);
    expect(stateAfter.digitalAddresses).toEqual(digitalAddresses);
    expect(action.type).toBe('getDigitalAddresses/fulfilled');
  });

  it('should reset loading state if fetch fails', async () => {
    const testStore = createTestStore({
      contactsState: initialState,
    });

    mock.onGet('/bff/v1/addresses').reply(500);

    const action = await testStore.dispatch(getDigitalAddresses());

    const state = testStore.getState().contactsState;
    expect(state.loading).toBe(false);
    expect(action.type).toBe('getDigitalAddresses/rejected');
  });

  it('should remove only EMAIL when no SERCQ senderIds are provided', async () => {
    const emailUrl = '/bff/v1/addresses/COURTESY/default/EMAIL';
    mock.onDelete(emailUrl).reply(204);

    const action = await store.dispatch(removeSercqAndEmail({ senderIds: [] }));

    expect(action.type).toBe('deleteAddress/removeEmailAndAllSercq/fulfilled');
    const urls = mock.history.delete.map((r) => r.url);
    expect(urls).toEqual([emailUrl]);
  });

  it('should remove default SERCQ first, then EMAIL', async () => {
    const sercqDefaultUrl = '/bff/v1/addresses/LEGAL/default/SERCQ_SEND';
    const emailUrl = '/bff/v1/addresses/COURTESY/default/EMAIL';
    mock.onDelete(sercqDefaultUrl).reply(204);
    mock.onDelete(emailUrl).reply(204);

    const action = await store.dispatch(removeSercqAndEmail({ senderIds: ['default'] }));

    expect(action.type).toBe('deleteAddress/removeEmailAndAllSercq/fulfilled');
    const urls = mock.history.delete.map((r) => r.url);
    expect(urls).toContain(sercqDefaultUrl);
    expect(urls).toContain(emailUrl);
    // Email deletion must happen after SERCQ deletions
    expect(urls.indexOf(emailUrl)).toBeGreaterThan(urls.indexOf(sercqDefaultUrl));
  });

  it('should remove special SERCQ, then default SERCQ, then EMAIL (in order)', async () => {
    const sercqDefaultUrl = '/bff/v1/addresses/LEGAL/default/SERCQ_SEND';
    const sercqTribUrl = '/bff/v1/addresses/LEGAL/tribunale-milano/SERCQ_SEND';
    const emailUrl = '/bff/v1/addresses/COURTESY/default/EMAIL';

    mock.onDelete(sercqDefaultUrl).reply(204);
    mock.onDelete(sercqTribUrl).reply(204);
    mock.onDelete(emailUrl).reply(204);

    const action = await store.dispatch(
      removeSercqAndEmail({ senderIds: ['default', 'tribunale-milano'] })
    );

    expect(action.type).toBe('deleteAddress/removeEmailAndAllSercq/fulfilled');

    const urls = mock.history.delete.map((r) => r.url);
    expect(urls).toContain(sercqDefaultUrl);
    expect(urls).toContain(sercqTribUrl);
    expect(urls).toContain(emailUrl);

    const tribIdx = urls.indexOf(sercqTribUrl);
    const defIdx = urls.indexOf(sercqDefaultUrl);
    const emailIdx = urls.indexOf(emailUrl);

    // special SERCQ deletion is called before default one
    expect(defIdx).toBeGreaterThan(tribIdx);

    // email deletion is called at the end
    expect(emailIdx).toBeGreaterThan(defIdx);
    expect(emailIdx).toBeGreaterThan(tribIdx);
  });

  it('should abort EMAIL deletion if any SERCQ deletion fails', async () => {
    const sercqDefaultUrl = '/bff/v1/addresses/LEGAL/default/SERCQ_SEND';
    const sercqTribUrl = '/bff/v1/addresses/LEGAL/tribunale-milano/SERCQ_SEND';
    const emailUrl = '/bff/v1/addresses/COURTESY/default/EMAIL';

    // One SERCQ fails -> chain must reject and not call EMAIL
    mock.onDelete(sercqDefaultUrl).reply(500);
    mock.onDelete(sercqTribUrl).reply(204);
    mock.onDelete(emailUrl).reply(204); // should NOT be hit

    const action = await store.dispatch(
      removeSercqAndEmail({ senderIds: ['default', 'tribunale-milano'] })
    );

    expect(action.type).toBe('deleteAddress/removeEmailAndAllSercq/rejected');
    const urls = mock.history.delete.map((r) => r.url);
    expect(urls).toContain(sercqDefaultUrl);
    expect(urls).toContain(sercqTribUrl);
    expect(urls).not.toContain(emailUrl);
  });
});
