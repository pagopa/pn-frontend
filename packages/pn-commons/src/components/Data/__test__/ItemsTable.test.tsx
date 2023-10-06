import React from 'react';

import { fireEvent, render, within } from '../../../test-utils';
import { Column, Item, Sort } from '../../../types';
import ItemsTable from '../ItemsTable';
import ItemsTableBody from '../ItemsTable/ItemsTableBody';
import ItemsTableBodyCell from '../ItemsTable/ItemsTableBodyCell';
import ItemsTableBodyRow from '../ItemsTable/ItemsTableBodyRow';
import ItemsTableHeader from '../ItemsTable/ItemsTableHeader';
import ItemsTableHeaderCell from '../ItemsTable/ItemsTableHeaderCell';

const handleSort = jest.fn();
const handleColumnClick = jest.fn();

const columns: Array<Column<'column-1' | 'column-2' | 'column-3'>> = [
  {
    id: 'column-1',
    label: 'Column 1',
    width: '20%',
    getCellLabel: (value: string) => value,
    sortable: true,
  },
  { id: 'column-2', label: 'Column 2', width: '30%', getCellLabel: (value: string) => value },
  {
    id: 'column-3',
    label: 'Column 3',
    width: '50%',
    getCellLabel: (value: string) => value,
    onClick: handleColumnClick,
    disableAccessibility: true,
  },
];

const rows: Array<Item> = [
  { id: 'row-1', 'column-1': 'Row 1-1', 'column-2': 'Row 1-2', 'column-3': 'Row 1-3' },
  { id: 'row-2', 'column-1': 'Row 2-1', 'column-2': 'Row 2-2', 'column-3': 'Row 2-3' },
  { id: 'row-3', 'column-1': 'Row 3-1', 'column-2': 'Row 3-2', 'column-3': 'Row 3-3' },
];

const sort: Sort<'column-1'> = {
  orderBy: 'column-1',
  order: 'asc',
};

const RenderItemsTable: React.FC = () => (
  <ItemsTable testId="table-test">
    <ItemsTableHeader testId="tableHead">
      {columns.map((column) => (
        <ItemsTableHeaderCell
          key={column.id}
          testId="table-test"
          sort={sort}
          column={column}
          handleClick={() => handleSort({ orderBy: column.id, order: 'desc' })}
        />
      ))}
    </ItemsTableHeader>
    <ItemsTableBody testId="tableBody">
      {rows.map((row, index) => (
        <ItemsTableBodyRow key={row.id} testId="table-test" index={index}>
          {columns.map((column) => (
            <ItemsTableBodyCell column={column} key={column.id} testId="tableBodyCell" row={row} />
          ))}
        </ItemsTableBodyRow>
      ))}
    </ItemsTableBody>
  </ItemsTable>
);

describe('Items Table Component', () => {
  it('renders component (with rows)', () => {
    const { getByRole } = render(<RenderItemsTable />);
    const table = getByRole('table');
    // check header
    expect(table).toHaveAttribute('aria-label', 'Tabella di item');
    const tableHead = within(table).getByTestId('tableHead');
    const tableColumns = within(tableHead).getAllByTestId('tableHeadCell');
    expect(tableColumns).toHaveLength(columns.length);
    tableColumns.forEach((column, i) => {
      expect(column).toHaveTextContent(columns[i].label);
    });
    // check body
    const tableBody = within(table).getByTestId('tableBody');
    const tableRows = within(tableBody).getAllByTestId('table-test.row');
    expect(tableRows).toHaveLength(rows.length);
    tableRows.forEach((row, i) => {
      const tableColumns = within(row).getAllByTestId('tableBodyCell');
      expect(tableColumns).toHaveLength(columns.length);
      tableColumns.forEach((column, j) => {
        expect(column).toHaveTextContent(rows[i][columns[j].id].toString());
      });
    });
  });

  it('sorts a column', () => {
    const { getByRole } = render(<RenderItemsTable />);
    const table = getByRole('table');
    const tableHead = within(table).getByTestId('tableHead');
    const firstColumn = within(tableHead).getAllByTestId('tableHeadCell')[0];
    const sortButton = within(firstColumn).getByRole('button');
    expect(sortButton).toBeInTheDocument();
    fireEvent.click(sortButton);
    expect(handleSort).toBeCalledTimes(1);
    expect(handleSort).toBeCalledWith({ order: 'desc', orderBy: 'column-1' });
  });

  it('click on a column', () => {
    const { getByRole } = render(<RenderItemsTable />);
    const table = getByRole('table');
    const tableBody = within(table).getByTestId('tableBody');
    const firstRow = within(tableBody).getAllByTestId('table-test.row')[0];
    const tableColumns = within(firstRow).getAllByTestId('tableBodyCell');
    fireEvent.click(tableColumns[2].querySelectorAll('button')[0]);
    expect(handleColumnClick).toBeCalledTimes(1);
    expect(handleColumnClick).toBeCalledWith(rows[0], columns[2]);
  });

  it('disable accessibility navigation on a column', () => {
    const { getByRole } = render(<RenderItemsTable />);
    const table = getByRole('table');
    const tableBody = within(table).getByTestId('tableBody');
    const firstRow = within(tableBody).getAllByTestId('table-test.row');
    const tableColumns = within(firstRow![0]).getAllByTestId('tableBodyCell');
    const button = within(tableColumns[2]).getAllByRole('button')[0];
    expect(button).toHaveAttribute('tabIndex', '-1');
  });
});
