import { vi } from 'vitest';

import { Box } from '@mui/material';

import { Row, Sort } from '../../../models/PnTable';
import { SmartTableData } from '../../../models/SmartTable';
import { disableConsoleLogging, fireEvent, render, waitFor } from '../../../test-utils';
import EmptyState from '../../EmptyState';
import SmartTable from '../SmartTable';
import SmartBody from '../SmartTable/SmartBody';
import SmartBodyCell from '../SmartTable/SmartBodyCell';
import SmartBodyRow from '../SmartTable/SmartBodyRow';
import SmartFilter from '../SmartTable/SmartFilter';
import SmartHeader from '../SmartTable/SmartHeader';
import SmartHeaderCell from '../SmartTable/SmartHeaderCell';

const handleSort = vi.fn();
const handleColumnClick = vi.fn();
const handleChangePagination = vi.fn();

type Item = {
  'column-1': string;
  'column-2': string;
  'column-3': string;
};

const smartCfg: Array<SmartTableData<Item>> = [
  {
    id: 'column-1',
    label: 'Column 1',
    tableConfiguration: {
      sortable: true,
    },
    cardConfiguration: {
      position: 'left',
      isCardHeader: true,
    },
  },
  {
    id: 'column-2',
    label: 'Column 2',
    tableConfiguration: {},
  },
  {
    id: 'column-3',
    label: 'Column 3',
    tableConfiguration: {
      onClick: handleColumnClick,
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

const RenderSmartable: React.FC<{
  filters?: boolean;
  pagination?: boolean;
  withData?: boolean;
}> = ({ filters = false, pagination = false, withData = true }) => (
  <SmartTable
    conf={smartCfg}
    data={withData ? data : []}
    currentSort={sort}
    onChangeSorting={handleSort}
    testId="table"
    pagination={
      pagination
        ? {
            size: 10,
            totalElements: 100,
            numOfDisplayedPages: 3,
            currentPage: 0,
            onChangePage: handleChangePagination,
          }
        : undefined
    }
    emptyState={<EmptyState>empty-state-message</EmptyState>}
  >
    {filters && (
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
    )}
    <SmartHeader>
      {smartCfg.map((column) => (
        <SmartHeaderCell
          key={column.id.toString()}
          columnId={column.id}
          sortable={column.tableConfiguration.sortable}
        >
          {column.label}
        </SmartHeaderCell>
      ))}
    </SmartHeader>
    <SmartBody>
      {data.map((row, index) => (
        <SmartBodyRow key={row.id} index={index}>
          {smartCfg.map((column) => (
            <SmartBodyCell
              key={column.id.toString()}
              columnId={column.id}
              tableProps={{ onClick: column.tableConfiguration.onClick }}
              cardProps={column.cardConfiguration}
              isCardHeader={column.cardConfiguration?.isCardHeader}
            >
              {row[column.id]}
            </SmartBodyCell>
          ))}
        </SmartBodyRow>
      ))}
    </SmartBody>
  </SmartTable>
);

describe('Smart Table Component', () => {
  disableConsoleLogging('error');

  it('renders component (desktop version) - no filters and no pagination', () => {
    const { queryByTestId } = render(<RenderSmartable />);
    // table layout is tested in SmartData
    const itemsPerPageSelector = queryByTestId('itemsPerPageSelector');
    expect(itemsPerPageSelector).not.toBeInTheDocument();
    const pageSelector = queryByTestId('pageSelector');
    expect(pageSelector).not.toBeInTheDocument();
  });

  it('renders component (desktop version) - filters and pagination', async () => {
    const { container, getByTestId, getAllByRole } = render(<RenderSmartable filters pagination />);
    const filter = container.querySelector('form');
    expect(filter).toBeInTheDocument();
    const customPagination = getByTestId('customPagination');
    expect(customPagination).toBeInTheDocument();
    // change size
    const itemsPerPageSelector = getByTestId('itemsPerPageSelector');
    const itemsPerPageSelectorBtn = itemsPerPageSelector.querySelector('button');
    fireEvent.click(itemsPerPageSelectorBtn!);
    const itemsPerPageList = getAllByRole('menuitem');
    fireEvent.click(itemsPerPageList[1]);
    await waitFor(() => {
      expect(handleChangePagination).toHaveBeenCalledTimes(1);
      expect(handleChangePagination).toHaveBeenCalledWith({
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
      expect(handleChangePagination).toHaveBeenCalledTimes(2);
      expect(handleChangePagination).toHaveBeenCalledWith({
        size: 20,
        page: 1,
        totalElements: 100,
      });
    });
  });

  it('renders empty state (desktop version)', () => {
    const { queryByTestId, getByTestId } = render(<RenderSmartable withData={false} />);
    const table = queryByTestId('tableDekstop');
    expect(table).not.toBeInTheDocument();
    const emptyState = getByTestId('emptyState');
    expect(emptyState).toBeInTheDocument();
    expect(emptyState).toHaveTextContent('empty-state-messa');
  });

  it('render component - multiple SmartBody', () => {
    expect(() =>
      render(
        <SmartTable conf={smartCfg} data={data}>
          <SmartHeader>
            {smartCfg.map((column) => (
              <SmartHeaderCell
                key={column.id.toString()}
                columnId={column.id}
                sortable={column.tableConfiguration.sortable}
              >
                {column.label}
              </SmartHeaderCell>
            ))}
          </SmartHeader>
          <SmartBody>
            {data.map((row, index) => (
              <SmartBodyRow key={row.id} index={index}>
                {smartCfg.map((column) => (
                  <SmartBodyCell
                    key={column.id.toString()}
                    columnId={column.id}
                    tableProps={{ onClick: column.tableConfiguration.onClick }}
                    cardProps={column.cardConfiguration}
                    isCardHeader={column.cardConfiguration?.isCardHeader}
                  >
                    {row[column.id]}
                  </SmartBodyCell>
                ))}
              </SmartBodyRow>
            ))}
          </SmartBody>
          <SmartBody>
            {data.map((row, index) => (
              <SmartBodyRow key={row.id} index={index}>
                {smartCfg.map((column) => (
                  <SmartBodyCell
                    key={column.id.toString()}
                    columnId={column.id}
                    tableProps={{ onClick: column.tableConfiguration.onClick }}
                    cardProps={column.cardConfiguration}
                    isCardHeader={column.cardConfiguration?.isCardHeader}
                  >
                    {row[column.id]}
                  </SmartBodyCell>
                ))}
              </SmartBodyRow>
            ))}
          </SmartBody>
        </SmartTable>
      )
    ).toThrow('SmartTable can have only 1 child of type SmartBody');
  });

  it('render component - multiple SmartHeader', () => {
    expect(() =>
      render(
        <SmartTable conf={smartCfg} data={data}>
          <SmartHeader>
            {smartCfg.map((column) => (
              <SmartHeaderCell
                key={column.id.toString()}
                columnId={column.id}
                sortable={column.tableConfiguration.sortable}
              >
                {column.label}
              </SmartHeaderCell>
            ))}
          </SmartHeader>
          <SmartHeader>
            {smartCfg.map((column) => (
              <SmartHeaderCell
                key={column.id.toString()}
                columnId={column.id}
                sortable={column.tableConfiguration.sortable}
              >
                {column.label}
              </SmartHeaderCell>
            ))}
          </SmartHeader>
        </SmartTable>
      )
    ).toThrow('SmartTable can have only 1 child of type SmartHeader');
  });

  it('render component - multiple SmartFilter', () => {
    expect(() =>
      render(
        <SmartTable conf={smartCfg} data={data}>
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
          <SmartHeader>
            {smartCfg.map((column) => (
              <SmartHeaderCell
                key={column.id.toString()}
                columnId={column.id}
                sortable={column.tableConfiguration.sortable}
              >
                {column.label}
              </SmartHeaderCell>
            ))}
          </SmartHeader>
        </SmartTable>
      )
    ).toThrow('SmartTable can have only 1 child of type SmartFilter');
  });

  it('render component - incorrect child', () => {
    expect(() =>
      render(
        <SmartTable conf={smartCfg} data={data}>
          <SmartHeader>
            {smartCfg.map((column) => (
              <SmartHeaderCell
                key={column.id.toString()}
                columnId={column.id}
                sortable={column.tableConfiguration.sortable}
              >
                {column.label}
              </SmartHeaderCell>
            ))}
          </SmartHeader>
          <Box>Incorrect child</Box>
        </SmartTable>
      )
    ).toThrow(
      'SmartTable can have only 1 child of type SmartFilter, 1 child of type SmartHeader and 1 child of type SmartBody'
    );
  });
});
