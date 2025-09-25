import React from 'react';
import { vi } from 'vitest';

import userEvent from '@testing-library/user-event';

import { ErrorMessage } from '../../../models';
import { act, render, screen, waitFor, within } from '../../../test-utils';
import CodeModal from '../CodeModal';

const cancelButtonMock = vi.fn();
const confirmButtonMock = vi.fn();

type ModalHandle = {
  updateError: (error: ErrorMessage, codeNotValid: boolean) => void;
};

const CodeModalWrapper: React.FC<{
  open: boolean;
  readonly?: boolean;
  codeLength?: number;
  initialValue?: string;
  refError?: React.RefObject<ModalHandle>;
}> = ({
  open,
  readonly = false,
  codeLength = 5,
  initialValue = '',
  refError = React.createRef<ModalHandle>(),
}) => (
  <CodeModal
    title="mocked-title"
    subtitle="mocked-subtitle"
    open={open}
    codeLength={codeLength}
    initialValue={initialValue}
    codeSectionTitle="mocked-section-title"
    cancelLabel="mocked-cancel"
    cancelCallback={cancelButtonMock}
    confirmLabel="mocked-confirm"
    confirmCallback={confirmButtonMock}
    isReadOnly={readonly}
    ref={refError}
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

    const textbox = within(dialog).getByRole('textbox');
    expect(textbox).toHaveValue('');

    const buttons = within(dialog).getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveTextContent('mocked-cancel');
    expect(buttons[1]).toHaveTextContent('mocked-confirm');
  });

  it('renders CodeModal (read only)', async () => {
    // render component
    render(<CodeModalWrapper open readonly initialValue="01234" />);
    const dialog = screen.getByTestId('codeDialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/mocked-title/i);
    expect(dialog).toHaveTextContent(/mocked-subtitle/i);
    expect(dialog).toHaveTextContent(/mocked-section-title/i);

    const textbox = within(dialog).getByRole('textbox');
    expect(textbox).toHaveAttribute('readonly');

    // Copy button is visible in readonly mode
    const button = within(dialog).getByTestId('copyCodeButton');
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    await waitFor(() => {
      expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('01234');
    });
  });

  it('clicks on cancel', async () => {
    // render component
    render(<CodeModalWrapper open />);
    const dialog = screen.getByTestId('codeDialog');
    const button = within(dialog).getByTestId('codeCancelButton');

    await userEvent.click(button);
    await waitFor(() => {
      expect(cancelButtonMock).toHaveBeenCalledTimes(1);
    });
  });

  it('clicks on confirm', async () => {
    // render component
    render(<CodeModalWrapper open codeLength={5} />);
    const dialog = screen.getByTestId('codeDialog');
    const button = within(dialog).getByTestId('codeConfirmButton');
    expect(button).toBeEnabled();
    const textbox = within(dialog).getByRole('textbox');

    // Fill the hidden input with a valid numeric code
    textbox.focus();
    await userEvent.keyboard('01234');

    await userEvent.click(button);
    expect(confirmButtonMock).toHaveBeenCalledTimes(1);
    expect(confirmButtonMock).toHaveBeenCalledWith('01234');
  });

  it('shows error via updateError ref method', () => {
    // render component
    const { rerender } = render(<CodeModalWrapper open initialValue="01234" />);
    const dialog = screen.getByTestId('codeDialog');
    let errorAlert = within(dialog).queryByTestId('errorAlert');
    expect(errorAlert).not.toBeInTheDocument();
    // simulate error from external
    const ref = React.createRef<ModalHandle>();
    rerender(<CodeModalWrapper refError={ref} open initialValue="01234" />);
    act(() =>
      ref.current?.updateError({ title: 'mocked-errorTitle', content: 'mocked-errorMessage' }, true)
    );
    errorAlert = within(dialog).getByTestId('errorAlert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent('mocked-errorMessage');
  });

  it('shows error in case of empty or incomplete code', async () => {
    // render component
    render(<CodeModalWrapper open codeLength={5} />);
    const dialog = screen.getByTestId('codeDialog');
    const button = within(dialog).getByTestId('codeConfirmButton');

    let errorAlert = within(dialog).queryByTestId('errorAlert');
    expect(errorAlert).not.toBeInTheDocument();
    await userEvent.click(button);

    errorAlert = within(dialog).getByTestId('errorAlert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent('errors.empty_code.title');
    expect(errorAlert).toHaveTextContent('errors.empty_code.message');
  });

  it('shows error in case of letters as input values (typed)', async () => {
    // render component
    render(<CodeModalWrapper open codeLength={5} />);
    const dialog = screen.getByTestId('codeDialog');
    const textbox = within(dialog).getByRole('textbox');

    textbox.focus();
    await userEvent.keyboard('A');

    const errorAlert = within(dialog).getByTestId('errorAlert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent('errors.invalid_type_code.message');
  });

  it('shows error in case of letters (pasted)', async () => {
    // render component
    render(<CodeModalWrapper open codeLength={5} />);
    const dialog = screen.getByTestId('codeDialog');
    const textbox = within(dialog).getByRole('textbox');

    textbox.focus();
    await userEvent.paste('abcd');

    const errorAlert = within(dialog).getByTestId('errorAlert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent('errors.invalid_type_code.message');
  });

  it('short code (pasted) - confirm button remains enabled (validation happens on submit)', async () => {
    // render component
    render(<CodeModalWrapper open codeLength={5} />);
    const dialog = screen.getByTestId('codeDialog');
    const textbox = within(dialog).getByRole('textbox');

    textbox.focus();
    await userEvent.paste('123');

    const button = screen.getByTestId('codeConfirmButton');
    expect(button).toBeEnabled();
  });
});
