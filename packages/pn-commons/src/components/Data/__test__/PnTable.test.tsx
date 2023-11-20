import React from 'react';

import { Box } from '@mui/material';

import { Column, Row, Sort } from '../../../models';
import { fireEvent, render, within } from '../../../test-utils';
import PnTable from '../PnTable';
import PnTableBody from '../PnTable/PnTableBody';
import PnTableBodyCell from '../PnTable/PnTableBodyCell';
import PnTableBodyRow from '../PnTable/PnTableBodyRow';
import PnTableHeader from '../PnTable/PnTableHeader';
import PnTableHeaderCell from '../PnTable/PnTableHeaderCell';

const handleSort = jest.fn();
const handleColumnClick = jest.fn();

type Item = { id: string; 'column-1': string; 'column-2': string; 'column-3': string };

const columns: Array<Column<Item>> = [
  {
    id: 'column-1',
    label: 'Column 1',
    width: '20%',
    sortable: true,
  },
  { id: 'column-2', label: 'Column 2', width: '30%' },
  {
    id: 'column-3',
    label: 'Column 3',
    width: '50%',
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
    <PnTableBody>
      {rows.map((row, index) => (
        <PnTableBodyRow key={row.id} testId="table-test" index={index}>
          {columns.map((column) => (
            <PnTableBodyCell
              key={column.id}
              onClick={() => column.onClick && column.onClick(row, column)}
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
    expect(handleSort).toBeCalledTimes(1);
    expect(handleSort).toBeCalledWith({ order: 'desc', orderBy: 'column-1' });
  });

  it('click on a column', () => {
    const { getByRole } = render(<RenderPnTable />);
    const table = getByRole('table');
    const tableBody = within(table).getByTestId('table-test.body');
    const firstRow = within(tableBody).getAllByTestId('table-test.body.row')[0];
    const tableColumns = within(firstRow).getAllByTestId('table-test.body.row.cell');
    fireEvent.click(tableColumns[2].querySelectorAll('button')[0]);
    expect(handleColumnClick).toBeCalledTimes(1);
    expect(handleColumnClick).toBeCalledWith(rows[0], columns[2]);
  });

  it('render component - no resulting child', () => {
    expect(() =>
      render(
        <PnTable>
          <Box>Incorrect child</Box>
        </PnTable>
      )
    ).toThrowError('PnTable must have at least one child');
  });

  it('render component - no PnTableHeader child', () => {
    expect(() =>
      render(
        <PnTable>
          <PnTableBody>
            {rows.map((row, index) => (
              <PnTableBodyRow key={row.id} testId="table-test" index={index}>
                {columns.map((column) => (
                  <PnTableBodyCell
                    key={column.id}
                    onClick={() => column.onClick && column.onClick(row, column)}
                  >
                    {row[column.id]}
                  </PnTableBodyCell>
                ))}
              </PnTableBodyRow>
            ))}
          </PnTableBody>
        </PnTable>
      )
    ).toThrowError('PnTable must have one child of type PnTableHeader');
  });

  it('render component - no PnTableBody child', () => {
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
        </PnTable>
      )
    ).toThrowError('PnTable must have one child of type PnTableBody');
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
          <PnTableBody>
            {rows.map((row, index) => (
              <PnTableBodyRow key={row.id} testId="table-test" index={index}>
                {columns.map((column) => (
                  <PnTableBodyCell
                    key={column.id}
                    onClick={() => column.onClick && column.onClick(row, column)}
                  >
                    {row[column.id]}
                  </PnTableBodyCell>
                ))}
              </PnTableBodyRow>
            ))}
          </PnTableBody>
          <Box>Incorrect child</Box>
        </PnTable>
      )
    ).toThrowError('PnTable must have only children of type PnTableHeader and PnTableBody');
  });
});
