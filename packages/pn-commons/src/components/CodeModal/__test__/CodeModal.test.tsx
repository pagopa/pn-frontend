import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { render } from '../../../test-utils';
import CodeModal from '../CodeModal';

const cancelButtonMock = jest.fn();
const confirmButtonMock = jest.fn();

const openedModalComponent = (open: boolean, hasError: boolean = false, readonly: boolean = false, initialValues: string[] = new Array(5).fill('') ) => (
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

    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).toBeInTheDocument();
    const title = dialog?.querySelector('#dialog-title');
    expect(title).toHaveTextContent('mocked-title');
    const subtitle = dialog?.querySelector('#dialog-description');
    expect(subtitle).toHaveTextContent('mocked-subtitle');
    expect(dialog).toHaveTextContent('mocked-section-title');
    const codeInputs = dialog?.querySelectorAll('input');
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((input) => {
      expect(input).toHaveValue('');
    });
    const buttons = dialog?.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons![0]).toHaveTextContent('mocked-cancel');
    expect(buttons![1]).toHaveTextContent('mocked-confirm');
  });

  it('renders CodeModal (read only)', () => {
    // render component
    render(openedModalComponent(true, false, true, ['0', '1', '2', '3', '4']));

    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).toBeInTheDocument();
    const title = dialog?.querySelector('#dialog-title');
    expect(title).toHaveTextContent('mocked-title');
    const subtitle = dialog?.querySelector('#dialog-description');
    expect(subtitle).toHaveTextContent('mocked-subtitle');
    expect(dialog).toHaveTextContent('mocked-section-title');
    const codeInputs = dialog?.querySelectorAll('input');
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((input, index) => {
      expect(input).toHaveValue(index.toString());
    });
    const button = dialog?.querySelector('#copy-code-button');
    expect(button).toBeInTheDocument();
  });

  it('clicks on cancel', async () => {
    // render component
    render(openedModalComponent(true));

    const dialog = screen.queryByTestId('codeDialog');
    const buttons = dialog?.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    await waitFor(() => {
      expect(cancelButtonMock).toBeCalledTimes(1);
    });
  });

  it('clicks on confirm', async () => {
    // render component
    render(openedModalComponent(true));

    const dialog = screen.queryByTestId('codeDialog');
    const buttons = dialog?.querySelectorAll('button');
    expect(buttons![1]).toBeDisabled();
    const codeInputs = dialog?.querySelectorAll('input');
    // fill inputs with values
    codeInputs?.forEach((input, index) => {
      fireEvent.change(input, { target: { value: index.toString() } });
    });
    await waitFor(() => {
      codeInputs?.forEach((input, index) => {
        expect(input).toHaveValue(index.toString());
      });
      expect(buttons![1]).toBeEnabled();
    });
    fireEvent.click(buttons![1]);
    expect(confirmButtonMock).toBeCalledTimes(1);
    expect(confirmButtonMock).toBeCalledWith(['0', '1', '2', '3', '4']);
  });

  it('shows error', () => {
    // render component
    render(openedModalComponent(true, true));

    const dialog = screen.queryByTestId('codeDialog');
    const errorAlert = dialog?.querySelector('[data-testid="errorAlert"]');
    expect(errorAlert).toBeInTheDocument();
    expect(errorAlert).toHaveTextContent('mocked-errorMessage');
  });
});
