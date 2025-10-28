import { vi } from 'vitest';

import { Sort } from '../../../../models/PnTable';
import { disableConsoleLogging, fireEvent, render } from '../../../../test-utils';
import PnTableHeaderCell from '../PnTableHeaderCell';

describe('PnTableHeaderCell', () => {
  disableConsoleLogging('error');

  const mockFn = vi.fn();

  type Item = {
    'mock-column-id': string;
  };

  const mockSort: Sort<Item> = {
    order: 'asc',
    orderBy: 'mock-column-id',
  };

  it('render component', () => {
    const { container, queryByTestId } = render(
      <PnTableHeaderCell columnId={'mock-column-id'} testId="headerCell">
        mock-column-label
      </PnTableHeaderCell>
    );
    expect(container).toHaveTextContent(/mock-column-label/);
    const sortBtn = queryByTestId('headerCell.sort.mock-column-id');
    expect(sortBtn).not.toBeInTheDocument();
  });

  it('sort', () => {
    const { getByTestId } = render(
      <PnTableHeaderCell
        sort={mockSort}
        columnId={'mock-column-id'}
        sortable={true}
        handleClick={mockFn(mockSort.orderBy)}
        testId="headerCell"
      >
        mock-column-label
      </PnTableHeaderCell>
    );
    const sortBtn = getByTestId('headerCell.sort.mock-column-id');
    fireEvent.click(sortBtn);
    expect(mockFn).toBeCalledTimes(1);
    expect(mockFn).toBeCalledWith('mock-column-id');
  });
});
