import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { getById } from '@pagopa-pn/pn-commons/src/test-utils';

import { digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render, testStore, waitFor, within } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { AddressType } from '../../../models/contacts';
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
    const form = container.querySelector('form');
    const input = form!.querySelector('input[name="default_pec"]');
    // add invalid values
    fireEvent.change(input!, { target: { value: 'invalid-pec' } });
    await waitFor(() => expect(input).toHaveValue('invalid-pec'));
    const errorMessage = form!.querySelector('#default_pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
    const buttons = form!.querySelectorAll('button');
    expect(buttons[0]).toBeEnabled();
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
    expect(result.container).toHaveTextContent('legal-contacts.cancel-pec-validation');
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
    const saveButton = getByRole('button', { name: 'button.conferma' });
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
    const saveButton = result.getByRole('button', { name: 'button.conferma' });
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
  });
});
