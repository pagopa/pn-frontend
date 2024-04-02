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
    fireEvent.change(codeInputs[2], { target: { value: '3' } });
    expect(codeInputs[2]).toHaveValue('3');
    await waitFor(() => {
      expect(handleChangeMock).toBeCalledTimes(2);
      // check focus on next elem
      expect(codeInputs[3]).toHaveFocus();
    });
    // change the value of the input and check that it is updated correctly
    // set the cursor position to the end
    act(() => (codeInputs[2] as HTMLInputElement).focus());
    (codeInputs[2] as HTMLInputElement).setSelectionRange(1, 1);
    // when we try to edit an input, we insert a second value and after, based on cursor position, we change the value
    // we must use userEvent because the keyboard event must trigger also the change event (fireEvent doesn't do that)
    await user.keyboard('4');
    // next element will be focused
    await waitFor(() => {
      expect(codeInputs[3]).toHaveFocus();
    });
    await waitFor(() => {
      expect(codeInputs[2]).toHaveValue('4');
    });
    // move the cursor at the start of the input and try to edit again
    act(() => (codeInputs[2] as HTMLInputElement).focus());
    (codeInputs[2] as HTMLInputElement).setSelectionRange(0, 0);
    await user.keyboard('3');
    // next element will be focused
    await waitFor(() => {
      expect(codeInputs[3]).toHaveFocus();
    });
    await waitFor(() => {
      expect(codeInputs[2]).toHaveValue('3');
    });
    // delete the value
    act(() => (codeInputs[2] as HTMLInputElement).focus());
    await user.keyboard('{Backspace}');
    // previous element will be focused
    await waitFor(() => {
      expect(codeInputs[1]).toHaveFocus();
    });
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
    // press enter
    fireEvent.keyDown(codeInputs[0], { key: 'Enter', code: 'Enter' });
    await waitFor(() => {
      expect(codeInputs[1]).toHaveFocus();
    });
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
    // press delete
    fireEvent.keyDown(codeInputs[3], { key: 'Delete', code: 'Delete' });
    await waitFor(() => {
      expect(codeInputs[4]).toHaveFocus();
    });
    // press the same value of the input
    // we reach the end, so we have to lost the focus
    fireEvent.keyDown(codeInputs[4], { key: '1', code: 'Digit1' });
    await waitFor(() => {
      expect(document.body).toHaveFocus();
    });
    // focus on last input and moove back
    act(() => (codeInputs[4] as HTMLInputElement).focus());
    // press backspace
    fireEvent.keyDown(codeInputs[4], { key: 'Backspace', code: 'Backspace' });
    await waitFor(() => {
      expect(codeInputs[3]).toHaveFocus();
    });
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
    fireEvent.keyDown(codeInputs[0], { key: 'Backspace', code: 'Backspace' });
    // nothing happens
    await waitFor(() => {
      expect(codeInputs[0]).toHaveFocus();
    });
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
