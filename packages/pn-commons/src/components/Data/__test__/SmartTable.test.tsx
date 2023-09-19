import React from 'react';

import { createMatchMedia, fireEvent, render } from '../../../test-utils';
import { Item, Sort } from '../../../types';
import { SmartTableAction, SmartTableData } from '../../../types/SmartTable';
import SmartTable from '../SmartTable';

const handleSort = jest.fn();
const handleColumnClick = jest.fn();
const clickActionMockFn = jest.fn();
const handleChangePagination = jest.fn();

const smartCfg: Array<SmartTableData<'column-1' | 'column-2' | 'column-3'>> = [
  {
    id: 'column-1',
    label: 'Column 1',
    getValue: (value: string) => value,
    tableConfiguration: {
      width: '20%',
      sortable: true,
    },
    cardConfiguration: {
      position: 'header',
    },
  },
  {
    id: 'column-2',
    label: 'Column 2',
    getValue: (value: string) => value,
    tableConfiguration: {
      width: '30%',
    },
    cardConfiguration: {
      position: 'body',
    },
  },
  {
    id: 'column-3',
    label: 'Column 3',
    getValue: (value: string) => value,
    tableConfiguration: {
      width: '50%',
      onClick: handleColumnClick,
    },
    cardConfiguration: {
      position: 'body',
    },
  },
];

const data: Array<Item> = [
  { id: 'row-1', 'column-1': 'Row 1-1', 'column-2': 'Row 1-2', 'column-3': 'Row 1-3' },
  { id: 'row-2', 'column-1': 'Row 2-1', 'column-2': 'Row 2-2', 'column-3': 'Row 2-3' },
  { id: 'row-3', 'column-1': 'Row 3-1', 'column-2': 'Row 3-2', 'column-3': 'Row 3-3' },
];

const sort: Sort<'column-1'> = {
  orderBy: 'column-1',
  order: 'asc',
};

const smartActions: Array<SmartTableAction> = [
  {
    id: 'action-1',
    component: <div>Mocked action</div>,
    onClick: clickActionMockFn,
    position: 'card',
  },
];

describe('Smart Table Component', () => {
  const original = window.matchMedia;

  afterAll(() => {
    window.matchMedia = original;
  });

  it('renders smart table (desktop version)', () => {
    const result = render(
      <SmartTable
        conf={smartCfg}
        data={data}
        currentSort={sort}
        onChangeSorting={handleSort}
        actions={smartActions}
      />
    );
    const table = result.getByTestId('table(notifications)');
    expect(table).toBeInTheDocument();
    const columns = result.getAllByTestId('tableHeadCell');
    columns.forEach((column, i) => {
      expect(column).toHaveTextContent(smartCfg[i].label);
    });

    const clickableCell = result.getByText('Row 3-3');
    fireEvent.click(clickableCell);
    expect(handleColumnClick).toBeCalledTimes(1);
    const sortableElem = result.getByText('sorted ascending');
    fireEvent.click(sortableElem);
    expect(handleSort).toBeCalledTimes(1);
    const paginatorItemSelector = result.queryByTestId('itemsPerPageSelector');
    expect(paginatorItemSelector).not.toBeInTheDocument();
    const paginatorPageSelector = result.queryByTestId('pageSelector');
    expect(paginatorPageSelector).not.toBeInTheDocument();
  });

  it('renders empty state (desktop version)', () => {
    const result = render(
      <SmartTable
        conf={smartCfg}
        data={[]}
        currentSort={sort}
        onChangeSorting={handleSort}
        actions={smartActions}
      />
    );
    const table = result.queryByTestId('table(notifications)');
    expect(table).not.toBeInTheDocument();
    const emptyState = result.getByTestId('emptyState');
    expect(emptyState).toBeInTheDocument();
  });

  it('paginated smart table (desktop version)', async () => {
    const result = render(
      <SmartTable
        conf={smartCfg}
        data={data}
        currentSort={sort}
        onChangeSorting={handleSort}
        actions={smartActions}
        pagination={{
          size: 10,
          totalElements: 100,
          numOfDisplayedPages: 10,
          currentPage: 0,
          onChangePage: handleChangePagination,
        }}
      />
    );
    const customPagination = result.getByTestId('customPagination');
    expect(customPagination).toBeInTheDocument();
  });

  it('renders smart table (mobile version)', () => {
    window.matchMedia = createMatchMedia(800);
    const result = render(
      <SmartTable
        conf={smartCfg}
        data={data}
        currentSort={sort}
        onChangeSorting={handleSort}
        actions={smartActions}
      />
    );
    const mobileCards = result.getByTestId('mobileCards');
    expect(mobileCards).toBeInTheDocument();
    const cardHeaders = result.getAllByTestId('cardHeaderLeft');
    expect(cardHeaders).toHaveLength(data.length);
    const cardActions = result.getAllByTestId('cardAction');
    expect(cardActions).toHaveLength(data.length);
    cardHeaders.forEach((cardHeader, index) => {
      expect(cardHeader).toHaveTextContent(data[index]['column-1'] as string);
    });

    const action = cardActions[0];
    expect(action).toHaveTextContent('Mocked action');

    fireEvent.click(action);
    expect(clickActionMockFn).toBeCalledTimes(1);
  });
});
