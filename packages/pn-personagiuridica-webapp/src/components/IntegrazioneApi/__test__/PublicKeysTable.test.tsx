import { vi } from 'vitest';

import { render } from '../../../__test__/test-utils';
import PublicKeysTable from '../PublicKeysTable';

const handleModalClick = vi.fn();

describe('Public Keys Table', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('show empty state if no public keys is empty', () => {
    const { container, queryByTestId } = render(
      <PublicKeysTable
        publicKeys={{
          items: [],
          total: 0,
        }}
        handleModalClick={handleModalClick}
      />
    );
    expect(container).toHaveTextContent(/empty-state/i);
    const table = queryByTestId('publicKeysTable');
    expect(table).not.toBeInTheDocument();
  });
});
