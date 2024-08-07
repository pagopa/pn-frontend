import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import PecContactItem from '../PecContactItem';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('PecContactItem component', () => {
  let result: RenderResult;
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
    await act(async () => {
      result = render(<PecContactItem value="" verifyingAddress={false} />);
    });
    const form = result.container.querySelector('form');
    const buttons = form?.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const input = form?.querySelector('input[name="pec"]');
    // add invalid values
    fireEvent.change(input!, { target: { value: 'invalid-pec' } });
    await waitFor(() => expect(input!).toHaveValue('invalid-pec'));
    let errorMessage = form?.querySelector('#pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
    const newButtons = form?.querySelectorAll('button');
    expect(newButtons![0]).toBeDisabled();
    fireEvent.change(input!, { target: { value: '' } });
    await waitFor(() => expect(input!).toHaveValue(''));
    errorMessage = form?.querySelector('#pec-helper-text');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('legal-contacts.valid-pec');
  });

  it('type in a valid pec', async () => {
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <PecContactItem value={VALID_PEC} verifyingAddress={false} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const form = result.container.querySelector('form');
    const buttons = form?.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const input = form?.querySelector('input[name="pec"]');
    fireEvent.change(input!, { target: { value: VALID_PEC } });
    await waitFor(() => expect(input!).toHaveValue(VALID_PEC));
    const errorMessage = form?.querySelector('#pec-helper-text');
    expect(errorMessage).not.toBeInTheDocument();
    const button = result.getByRole('button', { name: 'button.salva' });
    expect(button).toBeEnabled();
  });

  it('type in an invalid pec while in "edit mode"', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <PecContactItem value={defaultAddress!.value} verifyingAddress={false} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    result.getByText(defaultAddress!.value);
    const editButton = result.getByRole('button', { name: 'button.modifica' });
    fireEvent.click(editButton);
    const input = result.container.querySelector('[name="pec"]');
    const saveButton = result.getByRole('button', { name: 'button.salva' });
    expect(input).toHaveValue(defaultAddress!.value);
    expect(saveButton).toBeEnabled();
    fireEvent.change(input!, { target: { value: 'invalid-pec' } });
    await waitFor(() => {
      expect(input).toHaveValue('invalid-pec');
    });
    expect(saveButton).toBeDisabled();
    const inputError = result.container.querySelector('#pec-helper-text');
    expect(inputError).toHaveTextContent('legal-contacts.valid-pec');
  });

  it('remove contact', async () => {
    mock.onDelete('/bff/v1/addresses/LEGAL/default/PEC').reply(204);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <PecContactItem value={defaultAddress!.value} verifyingAddress={false} />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    // click on cancel
    fireEvent.click(buttons![1]);
    let dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    let dialogButtons = dialog?.querySelectorAll('button');
    // cancel remove operation
    fireEvent.click(dialogButtons![0]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    // click on confirm
    fireEvent.click(buttons![1]);
    dialog = await waitFor(() => screen.getByRole('dialog'));
    dialogButtons = dialog?.querySelectorAll('button');
    fireEvent.click(dialogButtons![1]);
    await waitFor(() => {
      expect(dialog).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mock.history.delete).toHaveLength(1);
    });
  });
});
