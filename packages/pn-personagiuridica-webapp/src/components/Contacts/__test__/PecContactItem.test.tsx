import { digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { RenderResult, act, fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import PecContactItem from '../PecContactItem';

describe('PecContactItem component', () => {
  let result: RenderResult;

  it('type in an invalid pec', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <PecContactItem value="" verifyingAddress={false} />
        </DigitalContactsCodeVerificationProvider>
      );
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
    const VALID_PEC = 'mail@valida.com';
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
    const defaultAddress = digitalLegalAddresses.find(
      (addr) => addr.senderId === 'default' && addr.pecValid
    );

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
});
