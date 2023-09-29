import React from 'react';

import { createMatchMedia, fireEvent, render, waitFor, within } from '../../../test-utils';
import { Item, Sort } from '../../../types';
import { SmartTableAction, SmartTableData } from '../../../types/SmartTable';
import SmartFilter from '../SmartFilter';
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

  it('renders component (desktop version) - no filters and no pagination', () => {
    const { getByTestId, getAllByTestId, queryByTestId } = render(
      <SmartTable
        conf={smartCfg}
        data={data}
        currentSort={sort}
        onChangeSorting={handleSort}
        actions={smartActions}
      />
    );
    const table = getByTestId('table(notifications)');
    expect(table).toBeInTheDocument();
    const columns = getAllByTestId('tableHeadCell');
    columns.forEach((column, i) => {
      expect(column).toHaveTextContent(smartCfg[i].label);
      const sort = within(column).queryByTestId(`table(notifications).sort.${smartCfg[i].id}`);
      if (smartCfg[i].tableConfiguration.sortable) {
        expect(sort).toBeInTheDocument();
      } else {
        expect(sort).not.toBeInTheDocument();
      }
    });
    const rows = within(table).getAllByTestId('table(notifications).row');
    expect(rows).toHaveLength(data.length);
    rows.forEach((row, index) => {
      const cells = within(row).getAllByTestId('tableBodyCell');
      const current = data[index];
      cells.forEach((cell, jindex) => {
        expect(cell).toHaveTextContent(current[smartCfg[jindex].id] as string);
        const button = within(cell).queryByRole('button');
        if (smartCfg[jindex].tableConfiguration.onClick) {
          expect(button).toBeInTheDocument();
        } else {
          expect(button).not.toBeInTheDocument();
        }
      });
    });
    const itemsPerPageSelector = queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).not.toBeInTheDocument();
    const pageSelector = queryByTestId('pageSelector');
    expect(pageSelector).not.toBeInTheDocument();
  });

  it('renders component (desktop version) - filters and pagination', async () => {
    const { container, getByTestId, getAllByRole } = render(
      <SmartTable
        conf={smartCfg}
        data={data}
        currentSort={sort}
        onChangeSorting={handleSort}
        actions={smartActions}
        pagination={{
          size: 10,
          totalElements: 100,
          numOfDisplayedPages: 3,
          currentPage: 0,
          onChangePage: handleChangePagination,
        }}
      >
        <SmartFilter
          filterLabel="Filter"
          cancelLabel="Cancel"
          formIsValid
          onClear={() => {}}
          onSubmit={() => {}}
          formValues={{ filter: '' }}
          initialValues={{ filter: '' }}
        >
          <input id="filter" name="filter" key="filter"></input>
        </SmartFilter>
      </SmartTable>
    );
    const filter = container.querySelector('form');
    expect(filter).toBeInTheDocument();
    const customPagination = getByTestId('customPagination');
    expect(customPagination).toBeInTheDocument();
    // change size
    const itemsPerPageSelector = getByTestId('itemsPerPageSelector');
    const itemsPerPageSelectorBtn = itemsPerPageSelector.querySelector('button');
    fireEvent.click(itemsPerPageSelectorBtn!);
    const itemsPerPageList = getAllByRole('menuitem');
    fireEvent.click(itemsPerPageList[1]!);
    await waitFor(() => {
      expect(handleChangePagination).toBeCalledTimes(1);
      expect(handleChangePagination).toBeCalledWith({
        size: 20,
        page: 0,
        totalElements: 100,
      });
    });
    // change page
    const pageSelector = getByTestId('pageSelector');
    const pageButtons = pageSelector.querySelectorAll('button');
    // the buttons are < 1 2 3 >
    fireEvent.click(pageButtons[2]);
    await waitFor(() => {
      expect(handleChangePagination).toBeCalledTimes(2);
      expect(handleChangePagination).toBeCalledWith({
        size: 20,
        page: 1,
        totalElements: 100,
      });
    });
  });

  it('interact with table - sort and click', () => {
    const { getByTestId } = render(
      <SmartTable
        conf={smartCfg}
        data={data}
        currentSort={sort}
        onChangeSorting={handleSort}
        actions={smartActions}
      />
    );
    const table = getByTestId('table(notifications)');
    expect(table).toBeInTheDocument();
    const sortableColumn = smartCfg.find((cfg) => cfg.tableConfiguration.sortable);
    const sortToggle = within(table).getByTestId(`table(notifications).sort.${sortableColumn!.id}`);
    fireEvent.click(sortToggle);
    expect(handleSort).toBeCalledTimes(1);
    const clickableColumnIdx = smartCfg.findIndex((cfg) => cfg.tableConfiguration.onClick);
    const rows = within(table).getAllByTestId('table(notifications).row');
    // we can take the row we want
    const cells = within(rows[0]).getAllByTestId('tableBodyCell');
    fireEvent.click(cells[clickableColumnIdx]);
    expect(handleColumnClick).toBeCalledTimes(1);
  });

  it('sorts with internal management (desktop version)', async () => {
    const { getByTestId } = render(
      <SmartTable conf={smartCfg} data={data} actions={smartActions} currentSort={sort} />
    );
    let table = getByTestId('table(notifications)');
    expect(table).toBeInTheDocument();
    const sortableColumn = smartCfg.find((cfg) => cfg.tableConfiguration.sortable);
    const sortToggle = within(table).getByTestId(`table(notifications).sort.${sortableColumn!.id}`);
    fireEvent.click(sortToggle);
    // beacuse already ordered, nothing change
    let rows = await waitFor(() => within(table).getAllByTestId('table(notifications).row'));
    rows.forEach((row, index) => {
      const cells = within(row).getAllByTestId('tableBodyCell');
      const current = data[index];
      cells.forEach((cell, jindex) => {
        expect(cell).toHaveTextContent(current[smartCfg[jindex].id] as string);
      });
    });
    // sort descendig
    fireEvent.click(sortToggle);
    table = getByTestId('table(notifications)');
    rows = await waitFor(() => within(table).getAllByTestId('table(notifications).row'));
    const sortedData = [...data].reverse();
    rows.forEach((row, index) => {
      const cells = within(row).getAllByTestId('tableBodyCell');
      const current = sortedData[index];
      cells.forEach((cell, jindex) => {
        expect(cell).toHaveTextContent(current[smartCfg[jindex].id] as string);
      });
    });
  });

  it('no sort available (desktop version)', () => {
    const { getByTestId } = render(
      <SmartTable conf={smartCfg} data={data} actions={smartActions} />
    );
    const table = getByTestId('table(notifications)');
    expect(table).toBeInTheDocument();
    const sortableColumn = smartCfg.find((cfg) => cfg.tableConfiguration.sortable);
    const sortToggle = within(table).queryByTestId(
      `table(notifications).sort.${sortableColumn!.id}`
    );
    expect(sortToggle).not.toBeInTheDocument();
  });

  it('renders empty state (desktop version)', () => {
    const { queryByTestId, getByTestId } = render(
      <SmartTable
        conf={smartCfg}
        data={[]}
        currentSort={sort}
        onChangeSorting={handleSort}
        actions={smartActions}
      />
    );
    const table = queryByTestId('table(notifications)');
    expect(table).not.toBeInTheDocument();
    const emptyState = getByTestId('emptyState');
    expect(emptyState).toBeInTheDocument();
  });

  it('renders smart table (mobile version)', () => {
    window.matchMedia = createMatchMedia(800);
    const { getByTestId, getAllByTestId } = render(
      <SmartTable
        conf={smartCfg}
        data={data}
        currentSort={sort}
        onChangeSorting={handleSort}
        actions={smartActions}
      />
    );
    const mobileCards = getByTestId('mobileCards');
    expect(mobileCards).toBeInTheDocument();
    const cardHeaders = getAllByTestId('cardHeaderLeft');
    expect(cardHeaders).toHaveLength(data.length);
    const cardActions = getAllByTestId('cardAction');
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
