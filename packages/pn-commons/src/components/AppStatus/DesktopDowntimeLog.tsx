import { useMemo } from 'react';

import { Column, DowntimeLogPage, Item } from '../../models';
import PnTable from '../Data/PnTable';
import PnTableBody from '../Data/PnTable/PnTableBody';
import PnTableBodyCell from '../Data/PnTable/PnTableBodyCell';
import PnTableBodyRow from '../Data/PnTable/PnTableBodyRow';
import PnTableHeader from '../Data/PnTable/PnTableHeader';
import PnTableHeaderCell from '../Data/PnTable/PnTableHeaderCell';
import { DowntimeLogColumn, useFieldSpecs } from './downtimeLog.utils';

type Props = {
  downtimeLog: DowntimeLogPage;
  getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
};

const DesktopDowntimeLog = ({ downtimeLog, getDowntimeLegalFactDocumentDetails }: Props) => {
  const fieldSpecs = useFieldSpecs({ getDowntimeLegalFactDocumentDetails });
  const {
    getDateFieldSpec,
    getFunctionalityFieldSpec,
    getLegalFactIdFieldSpec,
    getStatusFieldSpec,
    getRows,
  } = fieldSpecs;

  const columns: Array<Column<DowntimeLogColumn>> = useMemo(
    () => [
      {
        ...getDateFieldSpec('startDate', true),
        width: '15%',
      },
      {
        ...getDateFieldSpec('endDate', true),
        width: '15%',
      },
      {
        ...getFunctionalityFieldSpec(),
        width: '30%',
      },
      {
        ...getLegalFactIdFieldSpec(),
        width: '30%',
      },
      {
        ...getStatusFieldSpec(),
        width: '15%',
      },
    ],
    [getDateFieldSpec, getFunctionalityFieldSpec, getLegalFactIdFieldSpec, getStatusFieldSpec]
  );

  const rows: Array<Item> = getRows(downtimeLog);

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
                disableAccessibility={column.disableAccessibility}
                key={column.id}
                testId="tableBodyCell"
                onClick={column.onClick ? () => column.onClick!(row, column) : undefined}
                cellProps={{
                  width: column.width,
                  align: column.align,
                  cursor: column.onClick ? 'pointer' : 'auto',
                }}
              >
                {column.getCellLabel(row[column.id as keyof Item], row)}
              </PnTableBodyCell>
            ))}
          </PnTableBodyRow>
        ))}
      </PnTableBody>
    </PnTable>
  );
};

export default DesktopDowntimeLog;
