import { vi } from 'vitest';

import { Box } from '@mui/material';

import { Row, Sort } from '../../../../models/PnTable';
import { SmartTableData } from '../../../../models/SmartTable';
import {
  createMatchMedia,
  disableConsoleLogging,
  fireEvent,
  render,
  within,
} from '../../../../test-utils';
import SmartActions from '../SmartActions';
import SmartBody from '../SmartBody';
import SmartBodyCell from '../SmartBodyCell';
import SmartBodyRow from '../SmartBodyRow';
import SmartData from '../SmartData';
import SmartHeader from '../SmartHeader';
import SmartHeaderCell from '../SmartHeaderCell';

const handleSort = vi.fn();
const handleColumnClick = vi.fn();
const clickActionMockFn = vi.fn();

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

const RenderSmartData: React.FC<{
  sortEnabled?: boolean;
}> = ({ sortEnabled = true }) => (
  <SmartData
    testId="container"
    sort={sortEnabled ? sort : undefined}
    onChangeSorting={sortEnabled ? handleSort : undefined}
  >
    <SmartHeader>
      {smartCfg.map((column) => (
        <SmartHeaderCell
          key={column.id.toString()}
          columnId={column.id}
          sortable={column.tableConfiguration.sortable}
          testId="headerCell"
        >
          {column.label}
        </SmartHeaderCell>
      ))}
    </SmartHeader>
    <SmartBody>
      {data.map((row, index) => (
        <SmartBodyRow key={row.id} index={index} testId="bodyRow">
          {smartCfg.map((column) => (
            <SmartBodyCell
              key={column.id.toString()}
              columnId={column.id}
              tableProps={{ onClick: column.tableConfiguration.onClick }}
              cardProps={column.cardConfiguration}
              isCardHeader={column.cardConfiguration?.isCardHeader}
              testId="rowCell"
            >
              {row[column.id]}
            </SmartBodyCell>
          ))}
          <SmartActions>
            <Box data-testid="mockedAction" onClick={clickActionMockFn}>
              Mocked action
            </Box>
          </SmartActions>
        </SmartBodyRow>
      ))}
    </SmartBody>
  </SmartData>
);

describe('SmartData', () => {
  disableConsoleLogging('error');

  const original = window.matchMedia;

  afterAll(() => {
    window.matchMedia = original;
  });

  it('render component', () => {
    const { getByTestId, getAllByTestId } = render(<RenderSmartData />);
    const table = getByTestId('containerDesktop');
    expect(table).toBeInTheDocument();
    const columns = getAllByTestId('headerCellDesktop');
    columns.forEach((column, i) => {
      expect(column).toHaveTextContent(smartCfg[i].label);
      const sort = within(column).queryByTestId(`headerCellDesktop.sort.${smartCfg[i].id}`);
      if (smartCfg[i].tableConfiguration.sortable) {
        expect(sort).toBeInTheDocument();
      } else {
        expect(sort).not.toBeInTheDocument();
      }
    });
    const rows = within(table).getAllByTestId('bodyRowDesktop');
    expect(rows).toHaveLength(data.length);
    rows.forEach((row, index) => {
      const cells = within(row).getAllByTestId('rowCellDesktop');
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
  });

  it('interact with table - sort and click', () => {
    const { getByTestId } = render(<RenderSmartData />);
    const table = getByTestId('containerDesktop');
    expect(table).toBeInTheDocument();
    const sortableColumn = smartCfg.find((cfg) => cfg.tableConfiguration.sortable);
    const sortToggle = within(table).getByTestId(`headerCellDesktop.sort.${sortableColumn!.id}`);
    fireEvent.click(sortToggle);
    expect(handleSort).toHaveBeenCalledTimes(1);
    const clickableColumnIdx = smartCfg.findIndex((cfg) => cfg.tableConfiguration.onClick);
    const rows = within(table).getAllByTestId('bodyRowDesktop');
    // we can take the row we want
    const cells = within(rows[0]).getAllByTestId('rowCellDesktop');
    const button = within(cells[clickableColumnIdx]).getByRole('button');
    fireEvent.click(button);
    expect(handleColumnClick).toHaveBeenCalledTimes(1);
  });

  it('no sort available (desktop version)', () => {
    const { getByTestId } = render(<RenderSmartData sortEnabled={false} />);
    const table = getByTestId('containerDesktop');
    expect(table).toBeInTheDocument();
    const sortableColumn = smartCfg.find((cfg) => cfg.tableConfiguration.sortable);
    const sortToggle = within(table).queryByTestId(`headerCellDesktop.sort.${sortableColumn!.id}`);
    expect(sortToggle).not.toBeInTheDocument();
  });

  it('renders component (mobile version)', () => {
    window.matchMedia = createMatchMedia(800);
    const { getAllByTestId } = render(<RenderSmartData />);
    const mobileCards = getAllByTestId('containerMobile');
    expect(mobileCards).toHaveLength(data.length);
    const cardHeaders = getAllByTestId('rowCellMobile');
    expect(cardHeaders).toHaveLength(data.length);
    const cardActions = getAllByTestId('mockedAction');
    expect(cardActions).toHaveLength(data.length);
    cardHeaders.forEach((cardHeader, index) => {
      expect(cardHeader).toHaveTextContent(data[index]['column-1']);
    });
    const action = cardActions[0];
    expect(action).toHaveTextContent('Mocked action');
    fireEvent.click(action);
    expect(clickActionMockFn).toHaveBeenCalledTimes(1);
  });
});
