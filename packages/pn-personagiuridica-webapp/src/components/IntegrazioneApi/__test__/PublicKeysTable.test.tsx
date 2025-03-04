import { vi } from 'vitest';

import { publicKeys } from '../../../__mocks__/ApiKeys.mock';
import { render, within } from '../../../__test__/test-utils';
import PublicKeysTable from '../PublicKeysTable';

const mockHandleModalClick = vi.fn();

describe('Public Keys Table', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('show empty state if there is no public keys', () => {
    const { container, queryByTestId } = render(
      <PublicKeysTable
        handleModalClick={mockHandleModalClick}
        publicKeys={{
          items: [],
          total: 0,
        }}
      />
    );
    expect(container).toHaveTextContent(/empty-state/i);
    const table = queryByTestId('publicKeysTableDesktop');
    expect(table).not.toBeInTheDocument();
  });

  it('render component with public keys list', async () => {
    const { getByTestId } = render(
      <PublicKeysTable handleModalClick={mockHandleModalClick} publicKeys={publicKeys} />
    );
    const table = getByTestId('publicKeysTableDesktop');
    expect(table).toBeInTheDocument();
    const rows = within(table).getAllByTestId('publicKeysBodyRowDesktop');
    expect(rows).toHaveLength(publicKeys.items.length);
  });
});
