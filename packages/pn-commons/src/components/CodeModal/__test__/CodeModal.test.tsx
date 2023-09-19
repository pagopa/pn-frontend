import React from 'react';

import { fireEvent, render, screen, waitFor, within } from '../../../test-utils';
import CodeModal from '../CodeModal';

const cancelButtonMock = jest.fn();
const confirmButtonMock = jest.fn();

const openedModalComponent = (
  open: boolean,
  hasError: boolean = false,
  readonly: boolean = false,
  initialValues: string[] = new Array(5).fill('')
) => (
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
  it('renders CodeModal (closed)', () => {
    // render component
    render(openedModalComponent(false));

    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).not.toBeInTheDocument();
  });

  it('renders CodeModal (opened)', () => {
    // render component
    render(openedModalComponent(true));

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
    expect(buttons![0]).toHaveTextContent('mocked-cancel');
    expect(buttons![1]).toHaveTextContent('mocked-confirm');
  });

  it('renders CodeModal (read only)', () => {
    // render component
    render(openedModalComponent(true, false, true, ['0', '1', '2', '3', '4']));

    const dialog = screen.getByTestId('codeDialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/mocked-title/i);
    expect(dialog).toHaveTextContent(/mocked-subtitle/i);
    expect(dialog).toHaveTextContent(/mocked-section-title/i);
    const codeInputs = within(dialog).getAllByTestId(/code-input-[0-4]/);
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((input, index) => {
      expect(input).toHaveValue(index.toString());
    });
    const button = within(dialog).getByTestId('copyCodeButton');
    expect(button).toBeInTheDocument();
  });

  it('clicks on cancel', async () => {
    // render component
    render(openedModalComponent(true));

    const dialog = screen.getByTestId('codeDialog');
    const button = within(dialog).getByTestId('codeCancelButton');
    fireEvent.click(button!);
    await waitFor(() => {
      expect(cancelButtonMock).toBeCalledTimes(1);
    });
  });

  it('clicks on confirm', async () => {
    // render component
    render(openedModalComponent(true));

    const dialog = screen.getByTestId('codeDialog');
    const button = within(dialog).getByTestId('codeConfirmButton');
    expect(button!).toBeDisabled();
    const codeInputs = within(dialog).getAllByTestId(/code-input-[0-4]/);
    // fill inputs with values
    codeInputs?.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    await waitFor(() => {
      codeInputs?.forEach((input, index) => {
        expect(input).toHaveValue(index.toString());
      });
      expect(button!).toBeEnabled();
    });
    fireEvent.click(button!);
    expect(confirmButtonMock).toBeCalledTimes(1);
    expect(confirmButtonMock).toBeCalledWith(['0', '1', '2', '3', '4']);
  });

  it('shows error', () => {
    // render component
    render(openedModalComponent(true, true));

    const dialog = screen.getByTestId('codeDialog');
    const errorAlert = within(dialog).getByTestId('errorAlert');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent('mocked-errorMessage');
  });
});
