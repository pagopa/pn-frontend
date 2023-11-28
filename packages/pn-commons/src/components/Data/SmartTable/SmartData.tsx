import { cloneElement } from 'react';

import { useIsMobile } from '../../../hooks';
import { Column, Row } from '../../../models';
import PnCard from '../PnCard/PnCard';
import PnCardActions from '../PnCard/PnCardActions';
import PnCardContent from '../PnCard/PnCardContent';
import PnCardContentItem from '../PnCard/PnCardContentItem';
import PnCardHeader from '../PnCard/PnCardHeader';
import PnCardHeaderItem from '../PnCard/PnCardHeaderItem';
import PnCardsList from '../PnCardsList';
import PnTable from '../PnTable';
import PnTableBody from '../PnTable/PnTableBody';
import PnTableBodyCell from '../PnTable/PnTableBodyCell';
import PnTableBodyRow from '../PnTable/PnTableBodyRow';
import PnTableHeader from '../PnTable/PnTableHeader';
import PnTableHeaderCell from '../PnTable/PnTableHeaderCell';

type Props<T> = {
  /** data to render */
  data: Array<Row<T>>;
  /** table columns */
  columns: Array<Column<T>>;
  /** test id */
  testId?: string;
  /** Table title used in aria-label */
  ariaTitle?: string;
};

const SmartData = <T,>({ data, columns, testId, ariaTitle }: Props<T>) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    const { cardHeader, cardBody, cardActions } = getCardElements(conf, actions);
    return (
      <>
        {data.length > 0 && (
          <PnCardsList>
            {data.map((d) => (
              <PnCard key={d.id}>
                <PnCardHeader>
                  <PnCardHeaderItem
                    key={cardHeader[0].id.toString()}
                    gridProps={cardHeader[0].gridProps}
                    position="left"
                  >
                    {cardHeader[0].getLabel!(d[cardHeader[0].id], data)}
                  </PnCardHeaderItem>
                  {cardHeader[1] && (
                    <PnCardHeaderItem
                      key={cardHeader[1].id.toString()}
                      gridProps={cardHeader[1].gridProps}
                      position="right"
                    >
                      {cardHeader[1].getLabel!(d[cardHeader[1].id], data)}
                    </PnCardHeaderItem>
                  )}
                </PnCardHeader>
                <PnCardContent>
                  {cardBody.map((body) => (
                    <PnCardContentItem key={body.id.toString()} label={body.label}>
                      {body.getLabel!(data[body.id], data)}
                    </PnCardContentItem>
                  ))}
                </PnCardContent>
                <PnCardActions>
                  {cardActions &&
                    cardActions.map((action) =>
                      cloneElement(action.component, {
                        onClick: () => action.onClick(data),
                      })
                    )}
                </PnCardActions>
              </PnCard>
            ))}
          </PnCardsList>
        )}
      </>
    );
  }

  return (
    <>
      {data.length > 0 && (
        <PnTable testId={testId} ariaTitle={ariaTitle}>
          <PnTableHeader>
            {columns.map((column) => (
              <PnTableHeaderCell
                key={column.id.toString()}
                sort={sort}
                columnId={column.id}
                sortable={column.sortable}
                handleClick={handleSorting}
              >
                {column.label}
              </PnTableHeaderCell>
            ))}
          </PnTableHeader>
          <PnTableBody testId="tableBody">
            {data.map((row, index) => (
              <PnTableBodyRow key={row.id} testId={testId} index={index}>
                {columns.map((column) => (
                  <PnTableBodyCell
                    key={column.id.toString()}
                    testId="tableBodyCell"
                    onClick={column.onClick ? () => column.onClick!(row, column) : undefined}
                    cellProps={{
                      width: column.width,
                      align: column.align,
                      cursor: column.onClick ? 'pointer' : 'auto',
                    }}
                  >
                    {column.getCellLabel!(row[column.id], row)}
                  </PnTableBodyCell>
                ))}
              </PnTableBodyRow>
            ))}
          </PnTableBody>
        </PnTable>
      )}
    </>
  );
};

export default SmartData;
