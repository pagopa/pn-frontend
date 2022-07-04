/* eslint-disable functional/no-let */

import { fireEvent } from '@testing-library/react';
import { render } from '../../test-utils';
import CopyToClipboard from '../CopyToClipboard';

describe('CopyToClipboard component', () => {
  it('renders properly and works as expected', () => {
    const result = render(
      <CopyToClipboard getValue={() => 'text-to-be-copied'} text="text-to-be-displayed" />
    );

    // eslint-disable-next-line functional/immutable-data
    Object.assign(window.navigator, {
      clipboard: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
    });

    const copy_button = result.getByRole('button', { name: /text-to-be-displayed/ });
    expect(copy_button).toBeInTheDocument();

    const copy_icon = result.getByTestId('ContentCopyIcon');
    expect(copy_icon).toBeInTheDocument();

    const text_displayed = result.getByText(/text-to-be-displayed/);
    expect(text_displayed).toBeInTheDocument();

    fireEvent.click(copy_button);

    expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith('text-to-be-copied');
  });
});
