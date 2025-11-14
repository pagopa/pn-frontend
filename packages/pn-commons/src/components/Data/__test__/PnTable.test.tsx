import { vi } from 'vitest';

import { Box } from '@mui/material';

import { Column, Row, Sort } from '../../../models/PnTable';
import { disableConsoleLogging, fireEvent, render, within } from '../../../test-utils';
import PnTable from '../PnTable';
import PnTableBody from '../PnTable/PnTableBody';
import PnTableBodyCell from '../PnTable/PnTableBodyCell';
import PnTableBodyRow from '../PnTable/PnTableBodyRow';
import PnTableHeader from '../PnTable/PnTableHeader';
import PnTableHeaderCell from '../PnTable/PnTableHeaderCell';

const handleSort = vi.fn();
const handleColumnClick = vi.fn();

type Item = { id: string; 'column-1': string; 'column-2': string; 'column-3': string };

const columns: Array<Column<Item>> = [
  {
    id: 'column-1',
    label: 'Column 1',
    sortable: true,
  },
  { id: 'column-2', label: 'Column 2' },
  {
    id: 'column-3',
    label: 'Column 3',
    onClick: handleColumnClick,
  },
];

const rows: Array<Row<Item>> = [
  { id: 'row-1', 'column-1': 'Row 1-1', 'column-2': 'Row 1-2', 'column-3': 'Row 1-3' },
  { id: 'row-2', 'column-1': 'Row 2-1', 'column-2': 'Row 2-2', 'column-3': 'Row 2-3' },
  { id: 'row-3', 'column-1': 'Row 3-1', 'column-2': 'Row 3-2', 'column-3': 'Row 3-3' },
];

const sort: Sort<Item> = {
  orderBy: 'column-1',
  order: 'asc',
};

const RenderPnTable: React.FC = () => (
  <PnTable testId="table-test">
    <PnTableHeader testId="table-test.header">
      {columns.map((column) => (
        <PnTableHeaderCell
          key={column.id}
          columnId={column.id}
          sort={sort}
          sortable={column.sortable}
          handleClick={() => handleSort({ orderBy: column.id, order: 'desc' })}
          testId="table-test.header.cell"
        >
          {column.label}
        </PnTableHeaderCell>
      ))}
    </PnTableHeader>
    <PnTableBody testId="table-test.body">
      {rows.map((row, index) => (
        <PnTableBodyRow key={row.id} testId="table-test.body.row" index={index}>
          {columns.map((column) => (
            <PnTableBodyCell
              key={column.id}
              onClick={() => column.onClick?.(row, column.id)}
              testId="table-test.body.row.cell"
            >
              {row[column.id]}
            </PnTableBodyCell>
          ))}
        </PnTableBodyRow>
      ))}
    </PnTableBody>
  </PnTable>
);

describe('PnTable Component', () => {
  disableConsoleLogging('error');

  it('renders component (with rows)', () => {
    const { getByRole } = render(<RenderPnTable />);
    const table = getByRole('table');
    // check header
    expect(table).toHaveAttribute('aria-label', 'table.aria-label');
    const tableHead = within(table).getByTestId('table-test.header');
    const tableColumns = within(tableHead).getAllByTestId('table-test.header.cell');
    expect(tableColumns).toHaveLength(columns.length);
    tableColumns.forEach((column, i) => {
      expect(column).toHaveTextContent(columns[i].label);
    });
    // check body
    const tableBody = within(table).getByTestId('table-test.body');
    const tableRows = within(tableBody).getAllByTestId('table-test.body.row');
    expect(tableRows).toHaveLength(rows.length);
    tableRows.forEach((row, i) => {
      const tableColumns = within(row).getAllByTestId('table-test.body.row.cell');
      expect(tableColumns).toHaveLength(columns.length);
      tableColumns.forEach((column, j) => {
        expect(column).toHaveTextContent(rows[i][columns[j].id]);
      });
    });
  });

  it('sorts a column', () => {
    const { getByRole } = render(<RenderPnTable />);
    const table = getByRole('table');
    const tableHead = within(table).getByTestId('table-test.header');
    const firstColumn = within(tableHead).getAllByTestId('table-test.header.cell')[0];
    const sortButton = within(firstColumn).getByRole('button');
    expect(sortButton).toBeInTheDocument();
    fireEvent.click(sortButton);
    expect(handleSort).toHaveBeenCalledTimes(1);
    expect(handleSort).toHaveBeenCalledWith({ order: 'desc', orderBy: 'column-1' });
  });

  it('click on a column', () => {
    const { getByRole } = render(<RenderPnTable />);
    const table = getByRole('table');
    const tableBody = within(table).getByTestId('table-test.body');
    const firstRow = within(tableBody).getAllByTestId('table-test.body.row')[0];
    const tableColumns = within(firstRow).getAllByTestId('table-test.body.row.cell');
    fireEvent.click(tableColumns[2].querySelectorAll('button')[0]);
    expect(handleColumnClick).toHaveBeenCalledTimes(1);
    expect(handleColumnClick).toHaveBeenCalledWith(rows[0], columns[2].id);
  });

  it('render component - multiple PnTableBody', () => {
    expect(() =>
      render(
        <PnTable>
          <PnTableBody>
            {rows.map((row, index) => (
              <PnTableBodyRow key={row.id} testId="table-test" index={index}>
                {columns.map((column) => (
                  <PnTableBodyCell key={column.id} onClick={() => column.onClick?.()}>
                    {row[column.id]}
                  </PnTableBodyCell>
                ))}
              </PnTableBodyRow>
            ))}
          </PnTableBody>
          <PnTableBody>
            {rows.map((row, index) => (
              <PnTableBodyRow key={row.id} testId="table-test" index={index}>
                {columns.map((column) => (
                  <PnTableBodyCell key={column.id} onClick={() => column.onClick?.()}>
                    {row[column.id]}
                  </PnTableBodyCell>
                ))}
              </PnTableBodyRow>
            ))}
          </PnTableBody>
        </PnTable>
      )
    ).toThrow('PnTable can have only 1 child of type PnTableHeader');
  });

  it('render component - multiple PnTableHeader', () => {
    expect(() =>
      render(
        <PnTable>
          <PnTableHeader>
            {columns.map((column) => (
              <PnTableHeaderCell
                key={column.id}
                columnId={column.id}
                sort={sort}
                sortable={column.sortable}
                handleClick={() => handleSort({ orderBy: column.id, order: 'desc' })}
              >
                {column.label}
              </PnTableHeaderCell>
            ))}
          </PnTableHeader>
          <PnTableHeader>
            {columns.map((column) => (
              <PnTableHeaderCell
                key={column.id}
                columnId={column.id}
                sort={sort}
                sortable={column.sortable}
                handleClick={() => handleSort({ orderBy: column.id, order: 'desc' })}
              >
                {column.label}
              </PnTableHeaderCell>
            ))}
          </PnTableHeader>
        </PnTable>
      )
    ).toThrow('PnTable can have only 1 child of type PnTableHeader');
  });

  it('render component - incorrect child', () => {
    expect(() =>
      render(
        <PnTable>
          <PnTableHeader>
            {columns.map((column) => (
              <PnTableHeaderCell
                key={column.id}
                columnId={column.id}
                sort={sort}
                sortable={column.sortable}
                handleClick={() => handleSort({ orderBy: column.id, order: 'desc' })}
              >
                {column.label}
              </PnTableHeaderCell>
            ))}
          </PnTableHeader>
          <Box>Incorrect child</Box>
        </PnTable>
      )
    ).toThrow(
      'PnTable can have only 1 child of type PnTableHeader and 1 child of type PnTableBody'
    );
  });
});
