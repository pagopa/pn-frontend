import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import {
  RenderResult,
  fireEvent,
  render,
  screen,
  testStore,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType } from '../../../models/contacts';
import PecContactItem from '../PecContactItem';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const fillCodeDialog = async (result: RenderResult) => {
  const dialog = await waitFor(() => result.getByTestId('codeDialog'));
  expect(dialog).toBeInTheDocument();
  const codeInputs = dialog?.querySelectorAll('input');
  // fill inputs with values
  codeInputs?.forEach((codeInput, index) => {
    fireEvent.change(codeInput, { target: { value: index.toString() } });
  });
  // confirm the addition
  const dialogButtons = dialog.querySelectorAll('button');
  fireEvent.click(dialogButtons[1]);
  return dialog;
};

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
    const { container } = render(<PecContactItem value="" verifyingAddress={false} />);
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
    const result = render(<PecContactItem value="" verifyingAddress={false} />);
    // insert new pec
    const form = result.container.querySelector('form');
    let input = form!.querySelector('input[name="default_pec"]');
    fireEvent.change(input!, { target: { value: VALID_PEC } });
    await waitFor(() => expect(input!).toHaveValue(VALID_PEC));
    const errorMessage = form?.querySelector('#default_pec-helper-text');
    expect(errorMessage).not.toBeInTheDocument();
    const button = result.getByTestId('addContact');
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
    // simulate rerendering due to redux changes
    result.rerender(<PecContactItem value={VALID_PEC} verifyingAddress={true} />);
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
    // simulate rerendering due to redux changes
    result.rerender(<PecContactItem value="" verifyingAddress={false} />);
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
    const result = render(<PecContactItem value="" verifyingAddress={false} />);
    // insert new pec
    const form = result.container.querySelector('form');
    const input = form!.querySelector('input[name="default_pec"]');
    fireEvent.change(input!, { target: { value: VALID_PEC } });
    await waitFor(() => expect(input!).toHaveValue(VALID_PEC));
    const errorMessage = form?.querySelector('#default_pec-helper-text');
    expect(errorMessage).not.toBeInTheDocument();
    const button = result.getByTestId('addContact');
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
    // simulate rerendering due to redux changes
    result.rerender(<PecContactItem value={VALID_PEC} verifyingAddress={false} />);
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    const pecValue = getById(form!, 'default_pec-typography');
    expect(pecValue).toBeInTheDocument();
    expect(pecValue).toHaveTextContent(VALID_PEC);
    const editButton = getById(form!, 'modifyContact-default');
    expect(editButton).toBeInTheDocument();
    const deleteButton = getById(form!, 'cancelContact-default');
    expect(deleteButton).toBeInTheDocument();
  });

  it('type in an invalid pec while in "edit mode"', async () => {
    // render component
    const { container, getByRole } = render(
      <PecContactItem value={defaultAddress!.value} verifyingAddress={false} />
    );
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
    const result = render(
      <PecContactItem value={defaultAddress!.value} verifyingAddress={false} />
    );
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
    // simulate rerendering due to redux changes
    result.rerender(<PecContactItem value={VALID_PEC} verifyingAddress={false} />);
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    pecValue = getById(form!, 'default_pec-typography');
    expect(pecValue).toBeInTheDocument();
    expect(pecValue).toHaveTextContent(VALID_PEC);
    editButton = getById(form!, 'modifyContact-default');
    expect(editButton).toBeInTheDocument();
    const deleteButton = getById(form!, 'cancelContact-default');
    expect(deleteButton).toBeInTheDocument();
  });

  it('remove contact', async () => {
    mock.onDelete('/bff/v1/addresses/LEGAL/default/PEC').reply(204);
    // render component
    const result = render(
      <PecContactItem value={defaultAddress!.value} verifyingAddress={false} />
    );
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
    // simulate rerendering due to redux changes
    result.rerender(<PecContactItem value="" verifyingAddress={false} />);
    await waitFor(() => {
      const input = result.container.querySelector('input[name="default_pec"]');
      expect(input).toBeInTheDocument();
      expect(result.container).not.toHaveTextContent('');
    });
  });
});
