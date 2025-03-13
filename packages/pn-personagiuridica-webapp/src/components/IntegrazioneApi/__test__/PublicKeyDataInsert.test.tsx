import { vi } from 'vitest';

import { formatDate, today } from '@pagopa-pn/pn-commons';
import {
  getById,
  testFormElements,
  testInput,
  waitFor,
} from '@pagopa-pn/pn-commons/src/test-utils';
import { fireEvent, within } from '@testing-library/react';

import { render } from '../../../__test__/test-utils';
import * as routes from '../../../navigation/routes.const';
import PublicKeyDataInsert from '../NewPublicKey/PublicKeyDataInsert';

const handleConfirmMk = vi.fn();
const duplicateKeyMock = vi.fn().mockImplementation((publicKey: string | undefined) => {
  if (publicKey === 'mocked-duplicate-key') {
    return false;
  }
  return true;
});
const mockNavigate = vi.fn();
const mockOpenFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigate,
}));

describe('PublicKeyDataInsert', () => {
  const original = window.open;

  beforeAll(() => {
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll((): void => {
    Object.defineProperty(window, 'open', { configurable: true, value: original });
  });

  it('render component', async () => {
    const { container, getByTestId } = render(
      <PublicKeyDataInsert
        onConfirm={handleConfirmMk}
        duplicateKey={duplicateKeyMock}
        tosAccepted
      />
    );
    expect(container).toHaveTextContent('new-public-key.steps.insert-data.title');
    expect(container).toHaveTextContent('new-public-key.steps.insert-data.content');
    // wait for rendering
    const form = await waitFor(() => getByTestId('publicKeyDataInsertForm'));
    expect(form).toBeInTheDocument();
    expect(form).toHaveTextContent('new-public-key.steps.insert-data.name.description');
    testFormElements(
      form,
      'name',
      'new-public-key.steps.insert-data.name.label',
      `new-public-key.steps.insert-data.name.default${formatDate(today.toISOString(), false, '')}`
    );
    expect(form).toHaveTextContent('new-public-key.steps.insert-data.publicKey.description');
    expect(form).toHaveTextContent('new-public-key.steps.insert-data.publicKey.begin');
    testFormElements(form, 'publicKey', undefined, '');
    expect(form).toHaveTextContent('new-public-key.steps.insert-data.publicKey.end');
    expect(form).not.toHaveTextContent('new-public-key.steps.insert-data.tos');
    const tosLink = within(form).queryByTestId('tos-link');
    expect(tosLink).not.toBeInTheDocument();
    const submitButton = getByTestId('step-submit');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('new-public-key.button.register');
    const previousButton = getByTestId('previous-step');
    expect(previousButton).toBeInTheDocument();
    expect(previousButton).toHaveTextContent('button.indietro');
  });

  it('invalid form', async () => {
    const { getByTestId } = render(
      <PublicKeyDataInsert
        onConfirm={handleConfirmMk}
        duplicateKey={duplicateKeyMock}
        tosAccepted
      />
    );
    // wait for rendering
    const form = await waitFor(() => getByTestId('publicKeyDataInsertForm'));
    // fill publicKey to trigger touched event
    await testInput(form, 'publicKey', 'Mocked value');
    const submitButton = getByTestId('step-submit');
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // insert invalid data - check required error
    await testInput(form, 'name', '');
    let nameHelperText = getById(form, 'name-helper-text');
    expect(nameHelperText).toBeInTheDocument();
    expect(nameHelperText).toHaveTextContent('required-field');
    await testInput(form, 'publicKey', '');
    let publicKeyHelperText = getById(form, 'publicKey-helper-text');
    expect(publicKeyHelperText).toBeInTheDocument();
    expect(publicKeyHelperText).toHaveTextContent('required-field');
    expect(submitButton).toBeDisabled();

    // insert invalid data - check max length error
    await testInput(form, 'name', new Array(254 + 2).join('a'));
    nameHelperText = await waitFor(() => getById(form, 'name-helper-text'));
    expect(nameHelperText).toHaveTextContent('too-long-field-error');
    await testInput(form, 'publicKey', new Array(500 + 2).join('a'));
    publicKeyHelperText = await waitFor(() => getById(form, 'publicKey-helper-text'));
    expect(publicKeyHelperText).toHaveTextContent('too-long-field-error');
    expect(submitButton).toBeDisabled();

    // insert invalid data - check invalid charset
    await testInput(form, 'name', `new-public-key.steps.insert-data.name.default%`);
    nameHelperText = await waitFor(() => getById(form, 'name-helper-text'));
    expect(nameHelperText).toHaveTextContent('messages.error.name-allowed-charset');

    // insert invalid data - duplicate key
    await testInput(form, 'publicKey', 'mocked-duplicate-key');
    publicKeyHelperText = await waitFor(() => getById(form, 'publicKey-helper-text'));
    expect(publicKeyHelperText).toHaveTextContent('messages.error.key-already-registered');
    expect(submitButton).toBeDisabled();

    // insert valid data
    await testInput(form, 'name', 'mocked-name-value');
    await testInput(form, 'publicKey', 'mocked-key-value');
    await waitFor(() => {
      expect(nameHelperText).not.toBeInTheDocument();
      expect(publicKeyHelperText).not.toBeInTheDocument();
      expect(submitButton).toBeEnabled();
    });
  });

  it('click on buttons', async () => {
    const { getByTestId } = render(
      <PublicKeyDataInsert
        onConfirm={handleConfirmMk}
        duplicateKey={duplicateKeyMock}
        tosAccepted
      />
    );
    // wait for rendering
    const form = await waitFor(() => getByTestId('publicKeyDataInsertForm'));
    const previousButton = getByTestId('previous-step');

    // click on back button
    fireEvent.click(previousButton);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(routes.INTEGRAZIONE_API);

    // click on confirm button
    await testInput(form, 'name', 'mocked-name-value');
    await testInput(form, 'publicKey', 'mocked-key-value');
    const submitButton = await waitFor(() => getByTestId('step-submit'));
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(handleConfirmMk).toHaveBeenCalledTimes(1);
      expect(handleConfirmMk).toHaveBeenCalledWith({
        name: 'mocked-name-value',
        publicKey: 'mocked-key-value',
      });
    });
  });

  it('render component without tos accepted', () => {
    const { container, getByTestId } = render(
      <PublicKeyDataInsert
        onConfirm={handleConfirmMk}
        duplicateKey={duplicateKeyMock}
        tosAccepted={false}
      />
    );

    expect(container).toHaveTextContent('new-public-key.steps.insert-data.tos');
    const tosLink = getByTestId('tos-link');
    expect(tosLink).toBeInTheDocument();
    fireEvent.click(tosLink);
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(routes.TERMS_OF_SERVICE_B2B, '_blank');
  });
});
