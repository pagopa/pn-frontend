import { vi } from 'vitest';

import { virtualKeys } from '../../../__mocks__/ApiKeys.mock';
import { render, within } from '../../../__test__/test-utils';
import VirtualKeysTable from '../VirtualKeysTable';

const mockHandleModalClick = vi.fn();

describe('Public Keys Table', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('show empty state', () => {
    const { container, queryByTestId } = render(
      <VirtualKeysTable
        handleModalClick={mockHandleModalClick}
        virtualKeys={{
          items: [],
          total: 0,
        }}
      />
    );
    expect(container).toHaveTextContent(/empty-state/i);
    const table = queryByTestId('virtualKeysTableDesktop');
    expect(table).not.toBeInTheDocument();
  });

  it('render component with virtual keys list', async () => {
    const { getByTestId } = render(
      <VirtualKeysTable handleModalClick={mockHandleModalClick} virtualKeys={virtualKeys} />
    );
    const table = getByTestId('virtualKeysTableDesktop');
    expect(table).toBeInTheDocument();
    const rows = within(table).getAllByTestId('virtualKeysBodyRowDesktop');
    expect(rows).toHaveLength(virtualKeys.items.length);
  });
});
