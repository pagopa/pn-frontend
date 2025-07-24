import { vi } from 'vitest';

import { act, fireEvent, render } from '../../test-utils';
import CopyToClipboard from '../CopyToClipboard';

describe('CopyToClipboard component', () => {
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

  it('renders properly and works as expected', async () => {
    const { getByTestId, getByRole, getByText } = render(
      <CopyToClipboard
        getValue={() => 'text-to-be-copied'}
        text="text-to-be-displayed"
        tooltipMode
      />
    );
    const copy_button = getByRole('button', { name: /text-to-be-displayed/ });
    expect(copy_button).toBeInTheDocument();
    let copy_icon = getByTestId('ContentCopyIcon');
    expect(copy_icon).toBeInTheDocument();
    const text_displayed = getByText(/text-to-be-displayed/);
    expect(text_displayed).toBeInTheDocument();
    fireEvent.click(copy_button);
    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('text-to-be-copied');
    expect(copy_icon).not.toBeInTheDocument();
    const check_icon = getByTestId('CheckIcon');
    expect(check_icon).toBeInTheDocument();
    // wait that copy action is cancelled
    await act(() => new Promise((t) => setTimeout(t, 3000)));
    copy_icon = getByTestId('ContentCopyIcon');
    expect(copy_icon).toBeInTheDocument();
    expect(check_icon).not.toBeInTheDocument();
  });

  it('renders text before icon when textPosition is "start"', () => {
    const { getByRole, getByText, getByTestId } = render(
      <CopyToClipboard getValue={() => 'copy-text'} text="Copy this" textPosition="start" />
    );

    const button = getByRole('button');
    const icon = getByTestId('ContentCopyIcon');
    const text = getByText('Copy this');

    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(text).toBeInTheDocument();

    // verify text appears first
    expect(button.firstChild?.textContent).toContain('Copy this');
  });

  it('renders text after icon when textPosition is "end"', () => {
    const { getByRole, getByText, getByTestId } = render(
      <CopyToClipboard getValue={() => 'copy-text'} text="Copy this" textPosition="end" />
    );

    const button = getByRole('button');
    const icon = getByTestId('ContentCopyIcon');
    const text = getByText('Copy this');

    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(text).toBeInTheDocument();

    // verify text appears after icon
    const iconIndex = Array.from(button.childNodes).findIndex(
      (node) => node === icon.parentElement
    );
    const textIndex = Array.from(button.childNodes).findIndex(
      (node) => node.textContent === 'Copy this'
    );
    expect(iconIndex).toBeLessThan(textIndex);
  });
});
