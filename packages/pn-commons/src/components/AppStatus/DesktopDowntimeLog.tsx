import { useMemo } from 'react';

import { DowntimeLogPage } from '../../models';
import { Column, Item } from '../../types';
import ItemsTable from '../Data/ItemsTable';
import ItemsTableBody from '../Data/ItemsTable/ItemsTableBody';
import ItemsTableBodyCell from '../Data/ItemsTable/ItemsTableBodyCell';
import ItemsTableBodyRow from '../Data/ItemsTable/ItemsTableBodyRow';
import ItemsTableHeader from '../Data/ItemsTable/ItemsTableHeader';
import ItemsTableHeaderCell from '../Data/ItemsTable/ItemsTableHeaderCell';
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
    <ItemsTable testId="tableDowntimeLog">
      <ItemsTableHeader testId="tableHead">
        {columns.map((column) => (
          <ItemsTableHeaderCell key={column.id} testId="tableDowntimeLog" column={column} />
        ))}
      </ItemsTableHeader>
      <ItemsTableBody testId="tableBody">
        {rows.map((row, index) => (
          <ItemsTableBodyRow key={row.id} testId="tableDowntimeLog" index={index}>
            {columns.map((column) => (
              <ItemsTableBodyCell
                column={column}
                key={column.id}
                testId="tableBodyCell"
                row={row}
              />
            ))}
          </ItemsTableBodyRow>
        ))}
      </ItemsTableBody>
    </ItemsTable>
  );
};

export default DesktopDowntimeLog;
