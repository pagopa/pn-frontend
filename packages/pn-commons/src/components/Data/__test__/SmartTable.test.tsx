import React from 'react';

import { Row, SmartTableAction, SmartTableData, Sort } from '../../../models';
import { createMatchMedia, fireEvent, render, waitFor, within } from '../../../test-utils';
import EmptyState from '../../EmptyState';
import SmartFilter from '../SmartFilter';
import SmartTable from '../SmartTable';

const handleSort = jest.fn();
const handleColumnClick = jest.fn();
const clickActionMockFn = jest.fn();
const handleChangePagination = jest.fn();

type Item = {
  'column-1': string;
  'column-2': string;
  'column-3': string;
};

const smartCfg: Array<SmartTableData<Item>> = [
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

const data: Array<Row<Item>> = [
  { id: 'row-1', 'column-1': 'Row 1-1', 'column-2': 'Row 1-2', 'column-3': 'Row 1-3' },
  { id: 'row-2', 'column-1': 'Row 2-1', 'column-2': 'Row 2-2', 'column-3': 'Row 2-3' },
  { id: 'row-3', 'column-1': 'Row 3-1', 'column-2': 'Row 3-2', 'column-3': 'Row 3-3' },
];

const sort: Sort<Item> = {
  orderBy: 'column-1',
  order: 'asc',
};

const smartActions: Array<SmartTableAction<Item>> = [
  {
    id: 'action-1',
    component: <div data-testid="mockedAction">Mocked action</div>,
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
    const table = getByTestId('table');
    expect(table).toBeInTheDocument();
    const columns = getAllByTestId('table.header.cell');
    columns.forEach((column, i) => {
      expect(column).toHaveTextContent(smartCfg[i].label);
      const sort = within(column).queryByTestId(`table.header.cell.sort.${smartCfg[i].id}`);
      if (smartCfg[i].tableConfiguration.sortable) {
        expect(sort).toBeInTheDocument();
      } else {
        expect(sort).not.toBeInTheDocument();
      }
    });
    const rows = within(table).getAllByTestId('table.body.row');
    expect(rows).toHaveLength(data.length);
    rows.forEach((row, index) => {
      const cells = within(row).getAllByTestId('table.body.row.cell');
      const current = data[index];
      cells.forEach((cell, jindex) => {
        expect(cell).toHaveTextContent(current[smartCfg[jindex].id]);
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
    const table = getByTestId('table');
    expect(table).toBeInTheDocument();
    const sortableColumn = smartCfg.find((cfg) => cfg.tableConfiguration.sortable);
    const sortToggle = within(table).getByTestId(`table.header.cell.sort.${sortableColumn!.id}`);
    fireEvent.click(sortToggle);
    expect(handleSort).toBeCalledTimes(1);
    const clickableColumnIdx = smartCfg.findIndex((cfg) => cfg.tableConfiguration.onClick);
    const rows = within(table).getAllByTestId('table.body.row');
    // we can take the row we want
    const cells = within(rows[0]).getAllByTestId('table.body.row.cell');
    fireEvent.click(cells[clickableColumnIdx]);
    expect(handleColumnClick).toBeCalledTimes(1);
  });

  it('sorts with internal management (desktop version)', async () => {
    const { getByTestId } = render(
      <SmartTable conf={smartCfg} data={data} actions={smartActions} currentSort={sort} />
    );
    let table = getByTestId('table');
    expect(table).toBeInTheDocument();
    const sortableColumn = smartCfg.find((cfg) => cfg.tableConfiguration.sortable);
    const sortToggle = within(table).getByTestId(`table.header.cell.sort.${sortableColumn!.id}`);
    fireEvent.click(sortToggle);
    // beacuse already ordered, nothing change
    let rows = await waitFor(() => within(table).getAllByTestId('table.body.row'));
    rows.forEach((row, index) => {
      const cells = within(row).getAllByTestId('table.body.row.cell');
      const current = data[index];
      cells.forEach((cell, jindex) => {
        expect(cell).toHaveTextContent(current[smartCfg[jindex].id]);
      });
    });
    // sort descendig
    fireEvent.click(sortToggle);
    table = getByTestId('table');
    rows = await waitFor(() => within(table).getAllByTestId('table.body.row'));
    const sortedData = [...data].reverse();
    rows.forEach((row, index) => {
      const cells = within(row).getAllByTestId('table.body.row.cell');
      const current = sortedData[index];
      cells.forEach((cell, jindex) => {
        expect(cell).toHaveTextContent(current[smartCfg[jindex].id]);
      });
    });
  });

  it('no sort available (desktop version)', () => {
    const { getByTestId } = render(
      <SmartTable conf={smartCfg} data={data} actions={smartActions} />
    );
    const table = getByTestId('table');
    expect(table).toBeInTheDocument();
    const sortableColumn = smartCfg.find((cfg) => cfg.tableConfiguration.sortable);
    const sortToggle = within(table).queryByTestId(`table.header.cell.sort.${sortableColumn!.id}`);
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
        emptyState={<EmptyState>empty-state-message</EmptyState>}
      />
    );
    const table = queryByTestId('table');
    expect(table).not.toBeInTheDocument();
    const emptyState = getByTestId('emptyState');
    expect(emptyState).toBeInTheDocument();
    expect(emptyState).toHaveTextContent('empty-state-messa');
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
    const cardActions = getAllByTestId('mockedAction');
    expect(cardActions).toHaveLength(data.length);
    cardHeaders.forEach((cardHeader, index) => {
      expect(cardHeader).toHaveTextContent(data[index]['column-1']);
    });
    const action = cardActions[0];
    expect(action).toHaveTextContent('Mocked action');
    fireEvent.click(action);
    expect(clickActionMockFn).toBeCalledTimes(1);
  });
});
