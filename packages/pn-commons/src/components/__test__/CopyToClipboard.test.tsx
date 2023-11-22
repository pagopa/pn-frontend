import React from 'react';
import { vi } from 'vitest';

import { act, fireEvent, render, waitFor } from '../../test-utils';
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
});
