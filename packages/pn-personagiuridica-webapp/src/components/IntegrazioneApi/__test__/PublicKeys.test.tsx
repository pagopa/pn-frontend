import { vi } from 'vitest';

import { render } from '../../../__test__/test-utils';
import PublicKeys from '../PublicKeys';

describe('Public Keys', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('render component without public key list', async () => {
    const { container, getByTestId } = render(<PublicKeys />);
    expect(container).toHaveTextContent(/empty-state/i);

    const button = getByTestId('generatePublicKey');
    expect(button).toBeInTheDocument();
  });
});
