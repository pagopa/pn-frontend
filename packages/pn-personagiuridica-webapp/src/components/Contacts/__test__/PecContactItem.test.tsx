import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { getById, testAutocomplete } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { parties } from '../../../__mocks__/ExternalRegistry.mock';
import {
  fireEvent,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType, ChannelType } from '../../../models/contacts';
import PecContactItem from '../PecContactItem';
import { fillCodeDialog } from './test-utils';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('PecContactItem component', () => {
  let mock: MockAdapter;
  const defaultAddress = digitalLegalAddresses.find(
    (addr) => addr.senderId === 'default' && addr.pecValid
  );
  const VALID_PEC = 'mail@valida.com';

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('type in an invalid pec', async () => {
    // render component
    const { container } = render(<PecContactItem />);
    expect(container).toHaveTextContent('legal-contacts.pec-title');
    expect(container).toHaveTextContent('legal-contacts.pec-description');
    const form = container.querySelector('form');
    const input = form!.querySelector('input[name="default_pec"]');
    // add invalid values
    fireEvent.change(input!, { target: { value: 'invalid-pec' } });
    await waitFor(() => expect(input).toHaveValue('invalid-pec'));
    const errorMessage = form!.querySelector('#default_pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
    const buttons = form!.querySelectorAll('button');
    expect(buttons[0]).toBeDisabled();
    fireEvent.change(input!, { target: { value: '' } });
    await waitFor(() => expect(input!).toHaveValue(''));
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
  });

  it('adds pec, checks validation and cancel it', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', {
        value: VALID_PEC,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', {
        value: VALID_PEC,
        verificationCode: '01234',
      })
      .reply(200, { result: 'PEC_VALIDATION_REQUIRED' });
    const result = render(<PecContactItem />);
    // insert new pec
    const form = result.container.querySelector('form');
    let input = form!.querySelector('input[name="default_pec"]');
    fireEvent.change(input!, { target: { value: VALID_PEC } });
    await waitFor(() => expect(input!).toHaveValue(VALID_PEC));
    const errorMessage = form?.querySelector('#default_pec-helper-text');
    expect(errorMessage).not.toBeInTheDocument();
    const button = result.getByTestId('default_pec-button');
    expect(button).toBeEnabled();
    fireEvent.click(button);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: VALID_PEC,
      });
    });
    // inser otp and confirm
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: VALID_PEC,
        verificationCode: '01234',
      });
    });
    // validation dialog must be shown
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    const validationDialog = result.getByTestId('validationDialog');
    expect(validationDialog).toBeInTheDocument();
    const confirmButton = within(validationDialog).getByRole('button');
    // close validation dialog and check that the correct component is shown
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(validationDialog).not.toBeInTheDocument();
    });
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.LEGAL)
    ).toStrictEqual([{ ...defaultAddress, pecValid: false, value: '', senderName: undefined }]);
    // wait rerendering due to redux changes
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    expect(result.container).toHaveTextContent('legal-contacts.pec-validating');
    expect(result.container).toHaveTextContent('legal-contacts.validation-in-progress');
    // cancel validation
    const cancelValidationBtn = result.getByTestId('cancelValidation');
    fireEvent.click(cancelValidationBtn);
    const cancelVerificationModal = await waitFor(() =>
      result.getByTestId('cancelVerificationModal')
    );
    const buttons = within(cancelVerificationModal).getAllByRole('button');
    fireEvent.click(buttons[1]);
    await waitFor(() => {
      expect(
        testStore
          .getState()
          .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.LEGAL)
      ).toStrictEqual([]);
    });
    // wait rerendering due to redux changes
    await waitFor(() => {
      expect(result.container).not.toHaveTextContent('legal-contacts.pec-validating');
      expect(result.container).not.toHaveTextContent('legal-contacts.validation-in-progress');
      input = result.container.querySelector('input[name="default_pec"]');
      expect(input).toBeInTheDocument();
    });
  });

  it('adds pec', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', {
        value: VALID_PEC,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', {
        value: VALID_PEC,
        verificationCode: '01234',
      })
      .reply(204);
    const result = render(<PecContactItem />);
    // insert new pec
    const form = result.container.querySelector('form');
    const input = form!.querySelector('input[name="default_pec"]');
    fireEvent.change(input!, { target: { value: VALID_PEC } });
    await waitFor(() => expect(input!).toHaveValue(VALID_PEC));
    const errorMessage = form?.querySelector('#default_pec-helper-text');
    expect(errorMessage).not.toBeInTheDocument();
    const button = result.getByTestId('default_pec-button');
    expect(button).toBeEnabled();
    fireEvent.click(button);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: VALID_PEC,
      });
    });
    // inser otp and confirm
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: VALID_PEC,
        verificationCode: '01234',
      });
    });
    // check that contact has been added
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.LEGAL)
    ).toStrictEqual([
      { ...defaultAddress, pecValid: true, value: VALID_PEC, senderName: undefined },
    ]);
    // wait rerendering due to redux changes
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    const pecValue = getById(form!, 'default_pec-typography');
    expect(pecValue).toBeInTheDocument();
    expect(pecValue).toHaveTextContent(VALID_PEC);
    const editButton = getById(form!, 'modifyContact-default_pec');
    expect(editButton).toBeInTheDocument();
    const deleteButton = getById(form!, 'cancelContact-default_pec');
    expect(deleteButton).toBeInTheDocument();
  });

  it('type in an invalid pec while in "edit mode"', async () => {
    // render component
    const { container, getByRole } = render(<PecContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress],
        },
      },
    });
    const form = container.querySelector('form');
    const pecValue = getById(form!, 'default_pec-typography');
    expect(pecValue).toHaveTextContent(defaultAddress!.value);
    const editButton = getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = container.querySelector('[name="default_pec"]');
    const saveButton = getByRole('button', { name: 'button.salva' });
    expect(input).toHaveValue(defaultAddress!.value);
    expect(saveButton).toBeEnabled();
    fireEvent.change(input!, { target: { value: 'invalid-pec' } });
    await waitFor(() => {
      expect(input).toHaveValue('invalid-pec');
    });
    expect(saveButton).toBeDisabled();
    const inputError = container.querySelector('#default_pec-helper-text');
    expect(inputError).toHaveTextContent('legal-contacts.valid-pec');
  });

  it('edits pec', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', {
        value: VALID_PEC,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost('/bff/v1/addresses/LEGAL/default/PEC', {
        value: VALID_PEC,
        verificationCode: '01234',
      })
      .reply(204);
    // render component
    const result = render(<PecContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress],
        },
      },
    });
    // edit value
    const form = result.container.querySelector('form');
    let pecValue = getById(form!, 'default_pec-typography');
    expect(pecValue).toHaveTextContent(defaultAddress!.value);
    let editButton = result.getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = result.container.querySelector('[name="default_pec"]');
    const saveButton = result.getByRole('button', { name: 'button.salva' });
    expect(input).toHaveValue(defaultAddress!.value);
    expect(saveButton).toBeEnabled();
    fireEvent.change(input!, { target: { value: VALID_PEC } });
    await waitFor(() => {
      expect(input).toHaveValue(VALID_PEC);
    });
    // confirm new value
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: VALID_PEC,
      });
    });
    // inser otp and confirm
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: VALID_PEC,
        verificationCode: '01234',
      });
    });
    // check that contact has been added
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(
      testStore
        .getState()
        .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.LEGAL)
    ).toStrictEqual([
      { ...defaultAddress, pecValid: true, value: VALID_PEC, senderName: undefined },
    ]);
    // wait rerendering due to redux changes
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    pecValue = getById(form!, 'default_pec-typography');
    expect(pecValue).toBeInTheDocument();
    expect(pecValue).toHaveTextContent(VALID_PEC);
    editButton = getById(form!, 'modifyContact-default_pec');
    expect(editButton).toBeInTheDocument();
    const deleteButton = getById(form!, 'cancelContact-default_pec');
    expect(deleteButton).toBeInTheDocument();
  });

  it('remove contact', async () => {
    mock.onDelete('/bff/v1/addresses/LEGAL/default/PEC').reply(204);
    // render component
    const result = render(<PecContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress],
        },
      },
    });
    const buttons = result.container.querySelectorAll('button');
    // click on cancel
    fireEvent.click(buttons[1]);
    let dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    let dialogButtons = dialog.querySelectorAll('button');
    // cancel remove operation
    fireEvent.click(dialogButtons[0]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    // click on confirm
    fireEvent.click(buttons[1]);
    dialog = await waitFor(() => screen.getByRole('dialog'));
    dialogButtons = dialog.querySelectorAll('button');
    fireEvent.click(dialogButtons[1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
    });
    await waitFor(() => {
      expect(
        testStore
          .getState()
          .contactsState.digitalAddresses.filter((addr) => addr.addressType === AddressType.LEGAL)
      ).toStrictEqual([]);
    });
    // wait rerendering due to redux changes
    await waitFor(() => {
      const input = result.container.querySelector('input[name="default_pec"]');
      expect(input).toBeInTheDocument();
      expect(result.container).not.toHaveTextContent('');
    });
  });

  it('add special contact', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${parties[1].id}/PEC`, {
        value: VALID_PEC,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${parties[1].id}/PEC`, {
        value: VALID_PEC,
        verificationCode: '01234',
      })
      .reply(204);
    // render component
    const result = render(<PecContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [defaultAddress],
        },
      },
    });
    const specialPecContact = result.getByTestId('special_pecContact');
    expect(specialPecContact).toBeInTheDocument();
    const button = within(specialPecContact).getByTestId('addMoreButton');
    fireEvent.click(button);
    const addSpecialContactDialog = await waitFor(() =>
      result.getByTestId('addSpecialContactDialog')
    );
    expect(addSpecialContactDialog).toBeInTheDocument();
    // fill input
    const input = getById(addSpecialContactDialog, 's_value');
    fireEvent.change(input, { target: { value: VALID_PEC } });
    await waitFor(() => {
      expect(input).toHaveValue(VALID_PEC);
    });
    // select sender
    await testAutocomplete(addSpecialContactDialog, 'sender', parties, true, 1, true);
    // confirm addition
    const confirmButton = within(addSpecialContactDialog).getByText('button.conferma');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: VALID_PEC,
      });
    });
    // inser otp and confirm
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: VALID_PEC,
        verificationCode: '01234',
      });
    });
    // check that contact has been added
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual([
      defaultAddress,
      {
        pecValid: true,
        codeValid: true,
        value: VALID_PEC,
        addressType: AddressType.LEGAL,
        channelType: ChannelType.PEC,
        senderName: parties[1].name,
        senderId: parties[1].id,
      },
    ]);
    // wait rerendering due to redux changes
    const specialContactForms = await waitFor(() => result.getAllByTestId(`special_pec`));
    expect(specialContactForms).toHaveLength(1);
    expect(specialContactForms[0]).toHaveTextContent(VALID_PEC);
    const editButton = within(specialContactForms[0]).getByTestId(`modifyContact-special_pec`);
    expect(editButton).toBeInTheDocument();
    const deleteButton = within(specialContactForms[0]).getByTestId(`cancelContact-special_pec`);
    expect(deleteButton).toBeInTheDocument();
    expect(specialContactForms[0]).toHaveTextContent(parties[1].name);
  });

  it('edit special contact', async () => {
    const VALID_MODIFIED_PEC = 'pec-modificata@valida.com';
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${parties[1].id}/PEC`, {
        value: VALID_MODIFIED_PEC,
      })
      .reply(200, {
        result: 'CODE_VERIFICATION_REQUIRED',
      });
    mock
      .onPost(`/bff/v1/addresses/LEGAL/${parties[1].id}/PEC`, {
        value: VALID_MODIFIED_PEC,
        verificationCode: '01234',
      })
      .reply(204);
    // render component
    const result = render(<PecContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            defaultAddress,
            {
              pecValid: true,
              codeValid: true,
              value: VALID_PEC,
              addressType: AddressType.LEGAL,
              channelType: ChannelType.PEC,
              senderName: parties[1].name,
              senderId: parties[1].id,
            },
          ],
        },
      },
    });
    let specialContactForms = await waitFor(() => result.getAllByTestId(`special_pec`));
    expect(specialContactForms).toHaveLength(1);
    expect(specialContactForms[0]).toHaveTextContent(VALID_PEC);
    const editButton = within(specialContactForms[0]).getByTestId(`modifyContact-special_pec`);
    fireEvent.click(editButton);
    const addSpecialContactDialog = await waitFor(() =>
      result.getByTestId('addSpecialContactDialog')
    );
    expect(addSpecialContactDialog).toBeInTheDocument();
    // fill input
    const input = getById(addSpecialContactDialog, 's_value');
    fireEvent.change(input, { target: { value: VALID_MODIFIED_PEC } });
    await waitFor(() => {
      expect(input).toHaveValue(VALID_MODIFIED_PEC);
    });
    // select sender
    await testAutocomplete(addSpecialContactDialog, 'sender', parties, true, 0, true);
    // confirm addition
    const confirmButton = within(addSpecialContactDialog).getByText('button.conferma');
    fireEvent.click(confirmButton);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(1);
      expect(JSON.parse(mock.history.post[0].data)).toStrictEqual({
        value: VALID_MODIFIED_PEC,
      });
    });
    // inser otp and confirm
    const dialog = await fillCodeDialog(result);
    await waitFor(() => {
      expect(mock.history.post).toHaveLength(2);
      expect(JSON.parse(mock.history.post[1].data)).toStrictEqual({
        value: VALID_MODIFIED_PEC,
        verificationCode: '01234',
      });
    });
    // check that contact has been edited
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual([
      defaultAddress,
      {
        pecValid: true,
        codeValid: true,
        value: VALID_MODIFIED_PEC,
        addressType: AddressType.LEGAL,
        channelType: ChannelType.PEC,
        senderName: parties[1].name,
        senderId: parties[1].id,
      },
    ]);
    // wait rerendering due to redux changes
    specialContactForms = await waitFor(() => result.getAllByTestId(`special_pec`));
    expect(specialContactForms[0]).toHaveTextContent(VALID_MODIFIED_PEC);
    expect(specialContactForms[0]).toHaveTextContent(parties[1].name);
  });

  it('remove special contact', async () => {
    mock.onGet('/bff/v1/pa-list').reply(200, parties);
    mock.onDelete(`/bff/v1/addresses/LEGAL/${parties[1].id}/PEC`).reply(204);
    // render component
    const result = render(<PecContactItem />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            defaultAddress,
            {
              pecValid: true,
              codeValid: true,
              value: VALID_PEC,
              addressType: AddressType.LEGAL,
              channelType: ChannelType.PEC,
              senderName: parties[1].name,
              senderId: parties[1].id,
            },
          ],
        },
      },
    });
    let specialContactForms = await waitFor(() => result.getAllByTestId(`special_pec`));
    expect(specialContactForms).toHaveLength(1);
    expect(specialContactForms[0]).toHaveTextContent(VALID_PEC);
    const deleteButton = within(specialContactForms[0]).getByTestId(`cancelContact-special_pec`);
    fireEvent.click(deleteButton);
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    const buttons = dialog.querySelectorAll('button');
    // click on confirm
    fireEvent.click(buttons[1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
    });
    // check that contact has been removed
    expect(testStore.getState().contactsState.digitalAddresses).toStrictEqual([defaultAddress]);
    // wait rerendering due to redux changes
    specialContactForms = await waitFor(() => result.queryAllByTestId(`special_pec`));
    expect(specialContactForms).toHaveLength(0);
  });
});
