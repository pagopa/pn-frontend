import { vi } from 'vitest';

import userEvent from '@testing-library/user-event';

import { act, fireEvent, render, screen, waitFor, within } from '../../../test-utils';
import CodeModal from '../CodeModal';

const cancelButtonMock = vi.fn();
const confirmButtonMock = vi.fn();

const CodeModalWrapper: React.FC<{
  open: boolean;
  hasError?: boolean;
  readonly?: boolean;
  initialValues?: string[];
}> = ({ open, hasError = false, readonly = false, initialValues = new Array(5).fill('') }) => (
  <CodeModal
    title="mocked-title"
    subtitle="mocked-subtitle"
    open={open}
    initialValues={initialValues}
    codeSectionTitle="mocked-section-title"
    cancelLabel="mocked-cancel"
    cancelCallback={cancelButtonMock}
    confirmLabel="mocked-confirm"
    confirmCallback={confirmButtonMock}
    hasError={hasError}
    errorMessage="mocked-errorMessage"
    isReadOnly={readonly}
  />
);

describe('CodeModal Component', () => {
  const original = window.navigator;

  beforeAll(() => {
    Object.assign(window.navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'navigator', { value: original });
  });

  it('renders CodeModal (closed)', () => {
    // render component
    render(<CodeModalWrapper open={false} />);
    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).not.toBeInTheDocument();
  });

  it('renders CodeModal (opened)', () => {
    // render component
    render(<CodeModalWrapper open />);
    const dialog = screen.getByTestId('codeDialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/mocked-title/i);
    expect(dialog).toHaveTextContent(/mocked-subtitle/i);
    expect(dialog).toHaveTextContent(/mocked-section-title/i);
    const codeInputs = within(dialog).getAllByTestId(/code-input-[0-4]/);
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((input) => {
      expect(input).toHaveValue('');
    });
    const buttons = within(dialog).getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('mocked-cancel');
    expect(buttons[1]).toHaveTextContent('mocked-confirm');
  });

  it('renders CodeModal (read only)', async () => {
    // render component
    render(<CodeModalWrapper open readonly initialValues={['0', '1', '2', '3', '4']} />);
    const dialog = screen.getByTestId('codeDialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/mocked-title/i);
    expect(dialog).toHaveTextContent(/mocked-subtitle/i);
    expect(dialog).toHaveTextContent(/mocked-section-title/i);
    const codeInputs = within(dialog).getAllByTestId(/code-input-[0-4]/);
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((input, index) => {
      expect(input).toHaveValue(index.toString());
      expect(input).toHaveAttribute('readonly');
    });
    const button = within(dialog).getByTestId('copyCodeButton');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('01234');
    });
  });

  it('clicks on cancel', async () => {
    // render component
    render(<CodeModalWrapper open />);
    const dialog = screen.getByTestId('codeDialog');
    const button = within(dialog).getByTestId('codeCancelButton');
    fireEvent.click(button);
    await waitFor(() => {
      expect(cancelButtonMock).toBeCalledTimes(1);
    });
  });

  it('clicks on confirm', async () => {
    // render component
    render(<CodeModalWrapper open />);
    const dialog = screen.getByTestId('codeDialog');
    const button = within(dialog).getByTestId('codeConfirmButton');
    expect(button).toBeDisabled();
    const codeInputs = within(dialog).getAllByTestId(/code-input-[0-4]/);
    // fill inputs with values
    codeInputs?.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    await waitFor(() => {
      codeInputs?.forEach((input, index) => {
        expect(input).toHaveValue(index.toString());
      });
      expect(button).toBeEnabled();
    });
    fireEvent.click(button);
    expect(confirmButtonMock).toBeCalledTimes(1);
    expect(confirmButtonMock).toBeCalledWith(['0', '1', '2', '3', '4']);
  });

  it('shows error', () => {
    // render component
    const { rerender } = render(
      <CodeModalWrapper open initialValues={['0', '1', '2', '3', '4']} />
    );
    const dialog = screen.getByTestId('codeDialog');
    let errorAlert = within(dialog).queryByTestId('errorAlert');
    expect(errorAlert).not.toBeInTheDocument();
    // simulate error from external
    rerender(<CodeModalWrapper open hasError initialValues={['0', '1', '2', '3', '4']} />);
    errorAlert = within(dialog).getByTestId('errorAlert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent('mocked-errorMessage');
  });

  it('shows error in case of letters as input values', async () => {
    // render component
    render(<CodeModalWrapper open />);
    const dialog = screen.getByTestId('codeDialog');
    const codeInputs = within(dialog).getAllByTestId(/code-input-[0-4]/);
    fireEvent.change(codeInputs[0], { target: { value: 'A' } });
    const errorAlert = screen.getByTestId('errorAlert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent('errors.invalid_type_code.message');
  });

  it('error in case of letters (pasted)', async () => {
    // render component
    render(<CodeModalWrapper open />);
    const dialog = screen.getByTestId('codeDialog');
    const codeInputs = within(dialog).getAllByTestId(/code-input-[0-4]/);
    act(() => (codeInputs[2] as HTMLInputElement).focus());
    (codeInputs[2] as HTMLInputElement).setSelectionRange(0, 0);
    const codePasted = 'abcd';
    await userEvent.paste(codePasted);
    const errorAlert = screen.getByTestId('errorAlert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent('errors.invalid_type_code.message');
  });

  it('short code (pasted) - confirm disabled', async () => {
    // render component
    render(<CodeModalWrapper open />);
    const dialog = screen.getByTestId('codeDialog');
    const codeInputs = within(dialog).getAllByTestId(/code-input-[0-4]/);
    act(() => (codeInputs[2] as HTMLInputElement).focus());
    (codeInputs[2] as HTMLInputElement).setSelectionRange(0, 0);
    const codePasted = '123';
    await userEvent.paste(codePasted);
    const button = screen.getByTestId('codeConfirmButton');
    expect(button).toBeDisabled();
  });
});
