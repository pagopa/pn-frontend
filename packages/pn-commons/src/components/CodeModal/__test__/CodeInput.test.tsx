import { vi } from 'vitest';

import userEvent from '@testing-library/user-event';

import { act, fireEvent, render, theme, waitFor } from '../../../test-utils';
import CodeInput from '../CodeInput';

const handleChangeMock = vi.fn();

describe('CodeInput Component', () => {
  const user = userEvent.setup();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders CodeInput (empty inputs)', () => {
    // render component
    const { getAllByTestId } = render(
      <CodeInput initialValues={new Array(5).fill('')} onChange={handleChangeMock} />
    );
    const codeInputs = getAllByTestId(/code-input-[0-4]/);
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((input) => {
      expect(input).toHaveValue('');
    });
  });

  it('renders CodeInput with error (empty inputs)', () => {
    // render component
    const { getAllByTestId } = render(
      <CodeInput initialValues={new Array(5).fill('')} onChange={handleChangeMock} hasError />
    );
    const codeInputs = getAllByTestId(/codeInput\([0-4]\)/);
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((elem) => {
      const input = elem.querySelector('input');
      const fieldset = elem.querySelector('fieldset');
      expect(input).toHaveStyle({
        color: theme.palette.error.main,
      });
      expect(fieldset).toHaveStyle({
        'border-color': theme.palette.error.main,
      });
    });
  });

  it('renders CodeInput read only (empty inputs)', () => {
    // render component
    const { getAllByTestId } = render(
      <CodeInput initialValues={new Array(5).fill('')} onChange={handleChangeMock} isReadOnly />
    );
    const codeInputs = getAllByTestId(/codeInput\([0-4]\)/);
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((elem) => {
      const input = elem.querySelector('input');
      expect(input).toHaveStyle({
        color: theme.palette.primary.main,
      });
      expect(input).toHaveAttribute('readonly');
    });
  });

  it('renders CodeInput (filled inputs)', () => {
    // render component
    const { getAllByTestId } = render(
      <CodeInput initialValues={new Array(5).fill('1')} onChange={handleChangeMock} />
    );
    const codeInputs = getAllByTestId(/code-input-[0-4]/);
    expect(codeInputs).toHaveLength(5);
    codeInputs?.forEach((input) => {
      expect(input).toHaveValue('1');
    });
  });

  it('handles change event', async () => {
    // render component
    const { getAllByTestId } = render(
      <CodeInput initialValues={new Array(5).fill('')} onChange={handleChangeMock} />
    );
    const codeInputs = getAllByTestId(/code-input-[0-4]/);
    // focus on the input
    act(() => (codeInputs[2] as HTMLInputElement).focus());
    fireEvent.change(codeInputs[2], { target: { value: '3' } });
    expect(codeInputs[2]).toHaveValue('3');
    await waitFor(() => {
      expect(handleChangeMock).toHaveBeenCalledTimes(2);
    });
    // change the value of the input and check that it is updated correctly
    // when we try to edit an input, we insert a second value and after, based on cursor position, we change the value
    // we must use userEvent because the keyboard event must trigger also the change event (fireEvent doesn't do that)
    await user.keyboard('4');
    await waitFor(() => {
      expect(codeInputs[2]).toHaveValue('4');
    });
    // try to edit again
    await user.keyboard('3');
    await waitFor(() => {
      expect(codeInputs[2]).toHaveValue('3');
    });
    // delete the value
    await user.keyboard('{Backspace}');
    await waitFor(() => {
      expect(codeInputs[2]).toHaveValue('');
    });
  });

  it('keyboard events', async () => {
    // render component
    const { getAllByTestId } = render(
      <CodeInput initialValues={new Array(5).fill('1')} onChange={handleChangeMock} />
    );
    // focus on first input and moove to the next
    const codeInputs = getAllByTestId(/code-input-[0-4]/);
    act(() => (codeInputs[0] as HTMLInputElement).focus());
    // press tab
    fireEvent.keyDown(codeInputs[1], { key: 'Tab', code: 'Tab' });
    await waitFor(() => {
      expect(codeInputs[2]).toHaveFocus();
    });
    // press arrow right
    fireEvent.keyDown(codeInputs[2], { key: 'ArrowRight', code: 'ArrowRight' });
    await waitFor(() => {
      expect(codeInputs[3]).toHaveFocus();
    });
    // press the same value of the input
    // focus on last input and moove back
    act(() => (codeInputs[4] as HTMLInputElement).focus());
    // press arrow left
    fireEvent.keyDown(codeInputs[3], { key: 'ArrowLeft', code: 'ArrowLeft' });
    await waitFor(() => {
      expect(codeInputs[2]).toHaveFocus();
    });
    // press tab and shift key
    fireEvent.keyDown(codeInputs[2], { key: 'Tab', code: 'Tab', shiftKey: true });
    await waitFor(() => {
      expect(codeInputs[1]).toHaveFocus();
    });
    // focus on first element and try to go back
    act(() => (codeInputs[0] as HTMLInputElement).focus());
  });

  it('handles paste event', async () => {
    // render component
    const { getAllByTestId } = render(
      <CodeInput initialValues={new Array(5).fill('')} onChange={handleChangeMock} />
    );
    const codeInputs = getAllByTestId(/code-input-[0-4]/);

    // paste the value of the input and check that it is updated correctly
    // set the cursor position to the beggining
    act(() => (codeInputs[2] as HTMLInputElement).focus());
    (codeInputs[2] as HTMLInputElement).setSelectionRange(0, 0);

    const codePasted = '12345';
    await user.paste(codePasted);

    await waitFor(() => {
      for (let i = 0; i < 5; i++) {
        expect(codeInputs[i]).toHaveValue(codePasted[i]);
      }
    });
  });

  it('accepts first 5 digits in case of too long code (pasted)', async () => {
    // render component
    const { getAllByTestId } = render(
      <CodeInput initialValues={new Array(5).fill('')} onChange={handleChangeMock} />
    );
    const codeInputs = getAllByTestId(/code-input-[0-4]/);
    act(() => (codeInputs[2] as HTMLInputElement).focus());
    (codeInputs[2] as HTMLInputElement).setSelectionRange(0, 0);
    const codePasted = '123456'; // too long code
    await user.paste(codePasted);
    await waitFor(() => {
      for (let i = 0; i < 5; i++) {
        expect(codeInputs[i]).toHaveValue(codePasted[i]);
      }
    });
    expect(handleChangeMock).toHaveBeenCalledWith(['1', '2', '3', '4', '5']);
  });
});
