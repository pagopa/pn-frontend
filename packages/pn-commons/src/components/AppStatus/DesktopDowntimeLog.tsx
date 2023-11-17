import { useMemo } from 'react';

import { Column, Downtime, DowntimeLogPage } from '../../models';
import PnTable from '../Data/PnTable';
import PnTableBody from '../Data/PnTable/PnTableBody';
import PnTableBodyCell from '../Data/PnTable/PnTableBodyCell';
import PnTableBodyRow from '../Data/PnTable/PnTableBodyRow';
import PnTableHeader from '../Data/PnTable/PnTableHeader';
import PnTableHeaderCell from '../Data/PnTable/PnTableHeaderCell';
import { DowntimeCell, useFieldSpecs } from './downtimeLog.utils';

type Props = {
  downtimeLog: DowntimeLogPage;
  getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
};

const DesktopDowntimeLog = ({ downtimeLog, getDowntimeLegalFactDocumentDetails }: Props) => {
  const fieldSpecs = useFieldSpecs();
  const { getField, getRows } = fieldSpecs;

  const columns: Array<Column<Downtime>> = useMemo(
    () => [
      {
        ...getField('startDate'),
        width: '15%',
      },
      {
        ...getField('endDate'),
        width: '15%',
      },
      {
        ...getField('knownFunctionality'),
        width: '30%',
      },
      {
        ...getField('legalFactId'),
        width: '30%',
      },
      {
        ...getField('status'),
        width: '15%',
      },
    ],
    [getField]
  );

  const rows = getRows(downtimeLog);

  return (
    <PnTable testId="tableDowntimeLog">
      <PnTableHeader testId="tableHead">
        {columns.map((column) => (
          <PnTableHeaderCell
            key={column.id}
            testId="tableDowntimeLog"
            columnId={column.id}
            sortable={column.sortable}
          >
            {column.label}
          </PnTableHeaderCell>
        ))}
      </PnTableHeader>
      <PnTableBody testId="tableBody">
        {rows.map((row, index) => (
          <PnTableBodyRow key={row.id} testId="tableDowntimeLog" index={index}>
            {columns.map((column) => (
              <PnTableBodyCell
                key={column.id}
                testId="tableBodyCell"
                onClick={column.onClick ? () => column.onClick!(row, column) : undefined}
                cellProps={{
                  width: column.width,
                  align: column.align,
                  cursor: column.onClick ? 'pointer' : 'auto',
                }}
              >
                <DowntimeCell
                  row={row}
                  column={column}
                  inTwoLines
                  getDowntimeLegalFactDocumentDetails={getDowntimeLegalFactDocumentDetails}
                />
              </PnTableBodyCell>
            ))}
          </PnTableBodyRow>
        ))}
      </PnTableBody>
    </PnTable>
  );
};

export default DesktopDowntimeLog;
