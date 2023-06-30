import React from 'react';

import { createMatchMedia, fireEvent, render, waitFor, screen } from '../../../test-utils';
import { SmartTableData, SmartTableAction } from '../../../types/SmartTable';
import { Item, Sort } from '../../../types';
import SmartTable from '../SmartTable';

jest.mock('../ItemsCard', () => (props) => (
  <div>
    Card
    {props.cardData.map((data) => (
      <div id={data.id} key={data.id}>
        <div id="header">
          {props.cardHeader.map((header) => (
            <div id={header.id} key={header.id}>
              {header.getLabel(data[header.id])}
            </div>
          ))}
        </div>
        <div id="body">
          {props.cardBody.map((body) => (
            <div id={body.id} key={body.id}>
              {body.getLabel(data[body.id])}
            </div>
          ))}
        </div>
        <div id="action">
          {props.cardActions.map((action) => (
            <div id={action.id} key={action.id} onClick={action.onClick}>
              {action.component}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
));

jest.mock('../ItemsTable', () => (props) => (
  <div>
    Table
    {props.columns.map((column) => (
      <div id={column.id} key={column.id}>
        {column.sortable && (
          <div id="sortable" onClick={props.onChangeSorting}>
            Sortable
          </div>
        )}
        {props.rows.map((row) => (
          <p id={row.id} key={row.id} onClick={() => column.onClick && column.onClick(row, column)}>
            {column.getCellLabel(row[column.id])}
          </p>
        ))}
      </div>
    ))}
  </div>
));

jest.mock('../../Pagination/CustomPagination', () => () => <div>Paginator</div>);

jest.mock('../../EmptyState', () => () => <div>EmptyState</div>);

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
  it('renders smart table (desktop version)', () => {
    window.matchMedia = createMatchMedia(2000);
    const result = render(
      <SmartTable
        conf={smartCfg}
        data={data}
        currentSort={sort}
        onChangeSorting={handleSort}
        actions={smartActions}
      />
    );
    expect(result.container).toHaveTextContent('Table');
    for (const cfg of smartCfg) {
      const column = result.container.querySelector(`#${cfg.id}`) as Element;
      expect(column).toBeInTheDocument();
      for (const d of data) {
        const cell = column.querySelector(`#${d.id}`);
        expect(cell).toBeInTheDocument();
        expect(cell).toHaveTextContent(d[column.id] as string);
      }
    }
    const clickableCell = result.container.querySelector('#column-3 #row-3') as Element;
    fireEvent.click(clickableCell);
    expect(handleColumnClick).toBeCalledTimes(1);
    const sortableElem = result.container.querySelector('#column-1 #sortable') as Element;
    fireEvent.click(sortableElem);
    expect(handleSort).toBeCalledTimes(1);
    const paginatorItemSelector = result.container.querySelector(
      '[data-testid="itemsPerPageSelector"]'
    );
    expect(paginatorItemSelector).not.toBeInTheDocument();
    const paginatorPageSelector = result.container.querySelector('[data-testid="pageSelector"]');
    expect(paginatorPageSelector).not.toBeInTheDocument();
  });

  it('renders empty state (desktop version)', () => {
    window.matchMedia = createMatchMedia(2000);
    const result = render(
      <SmartTable
        conf={smartCfg}
        data={[]}
        currentSort={sort}
        onChangeSorting={handleSort}
        actions={smartActions}
      />
    );
    expect(result.container).not.toHaveTextContent('Table');
    expect(result.container).toHaveTextContent('EmptyState');
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
    expect(result.container).toHaveTextContent('Card');
    for (const d of data) {
      const card = result.container.querySelector(`#${d.id}`) as Element;
      expect(card).toBeInTheDocument();
      const header = card.querySelector(`#header`);
      const body = card.querySelector(`#body`);
      const action = card.querySelector('#action') as Element;
      for (const cfg of smartCfg) {
        if (cfg.cardConfiguration.position === 'header') {
          expect(header).toHaveTextContent(d[cfg.id] as string);
        } else {
          expect(body).toHaveTextContent(d[cfg.id] as string);
        }
      }
      expect(action).toHaveTextContent('Mocked action');
    }
    const actionElem = result.container.querySelector('#row-3 #action-1') as Element;
    fireEvent.click(actionElem);
    expect(clickActionMockFn).toBeCalledTimes(1);
  });

  it('paginated smart table (desktop version)', async () => {
    window.matchMedia = createMatchMedia(2000);
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
    expect(result.container).toHaveTextContent(/Paginator/);
  });
});
