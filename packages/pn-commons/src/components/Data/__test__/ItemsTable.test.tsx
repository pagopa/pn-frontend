import { fireEvent, screen, within } from '@testing-library/react';

import ItemsTable from '../ItemsTable';
import { Column, Item, Sort } from '../../../types/ItemsTable';
import { render } from '../../../test-utils';

const handleSort = jest.fn();
const handleColumnClick = jest.fn();

const columns: Array<Column> = [
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
  },
];

const rows: Array<Item> = [
  { id: 'row-1', 'column-1': 'Row 1-1', 'column-2': 'Row 1-2', 'column-3': 'Row 1-3' },
  { id: 'row-2', 'column-1': 'Row 2-1', 'column-2': 'Row 2-2', 'column-3': 'Row 2-3' },
  { id: 'row-3', 'column-1': 'Row 3-1', 'column-2': 'Row 3-2', 'column-3': 'Row 3-3' },
];

const sort: Sort = {
  orderBy: 'column-1',
  order: 'asc',
};

function testNotificationTableHead() {
  const table = screen.getByRole('table');
  expect(table).toHaveAttribute('aria-label', 'Tabella di item');
  const tableHead = table.querySelector('thead');
  const tableColumns = tableHead!.querySelectorAll('th');
  expect(tableColumns).toHaveLength(columns.length);
  tableColumns.forEach((column, i) => {
    expect(column).toHaveTextContent(columns[i].label);
  });
  return table;
}

describe('Notifications Table Component', () => {
  it('renders notifications table (empty rows with default values)', () => {
    render(<ItemsTable columns={columns} rows={[]} emptyActionCallback={() => console.log()} />);
    const table = testNotificationTableHead();
    const tableBody = table.querySelectorAll('td');
    expect(tableBody).toHaveLength(1);
    expect(tableBody[0]).toHaveAttribute('colspan', columns.length.toString());
    expect(tableBody[0]).toHaveTextContent(
      /I filtri che hai aggiunto non hanno dato nessun risultato./i
    );
  });

  it('renders notifications table (empty rows with custom values)', () => {
    render(
      <ItemsTable
        columns={columns}
        rows={[]}
        emptyActionCallback={() => console.log()}
        emptyMessage="mocked-empty-message"
      />
    );
    const table = testNotificationTableHead();
    const tableBody = table.querySelectorAll('td');
    expect(tableBody).toHaveLength(1);
    expect(tableBody[0]).toHaveAttribute('colspan', columns.length.toString());
    expect(tableBody[0]).toHaveTextContent(/mocked-empty-message/i);
  });

  it('renders notifications table (with rows)', () => {
    render(<ItemsTable columns={columns} rows={rows} emptyActionCallback={() => console.log()} />);
    const table = testNotificationTableHead();
    const tableBody = table.querySelector('tbody');
    const tableRows = tableBody!.querySelectorAll('tr');
    expect(tableRows).toHaveLength(rows.length);
    tableRows.forEach((row, i) => {
      const tableColumns = row.querySelectorAll('td');
      expect(tableColumns).toHaveLength(columns.length);
      tableColumns.forEach((column, j) => {
        expect(column).toHaveTextContent(rows[i][columns[j].id].toString());
      });
    });
  });

  it('sorts a column', () => {
    render(
      <ItemsTable
        columns={columns}
        rows={rows}
        sort={sort}
        onChangeSorting={handleSort}
        emptyActionCallback={() => console.log()}
      />
    );
    const table = screen.getByRole('table');
    const tableHead = table.querySelector('thead');
    const firstColumn = tableHead!.querySelector('th');
    const sortButton = within(firstColumn!).getByRole('button');
    expect(sortButton).toBeInTheDocument();
    fireEvent.click(sortButton);
    expect(handleSort).toBeCalledTimes(1);
    expect(handleSort).toBeCalledWith({ order: 'desc', orderBy: 'column-1' });
  });

  it('click on a column', () => {
    render(
      <ItemsTable
        columns={columns}
        rows={rows}
        sort={sort}
        emptyActionCallback={() => console.log()}
      />
    );
    const table = screen.getByRole('table');
    const tableBody = table.querySelector('tbody');
    const firstRow = tableBody!.querySelector('tr');
    const tableColumns = firstRow!.querySelectorAll('td');
    fireEvent.click(tableColumns[2]);
    expect(handleColumnClick).toBeCalledTimes(1);
    expect(handleColumnClick).toBeCalledWith(rows[0], columns[2]);
  });
});
