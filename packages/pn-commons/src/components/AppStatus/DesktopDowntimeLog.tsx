import { useMemo } from 'react';

import { useFieldSpecs } from '../../hooks/useFieldSpecs';
import { Downtime, DowntimeLogHistory } from '../../models/AppStatus';
import { Column } from '../../models/PnTable';
import PnTable from '../Data/PnTable';
import PnTableBody from '../Data/PnTable/PnTableBody';
import PnTableBodyCell from '../Data/PnTable/PnTableBodyCell';
import PnTableBodyRow from '../Data/PnTable/PnTableBodyRow';
import PnTableHeader from '../Data/PnTable/PnTableHeader';
import PnTableHeaderCell from '../Data/PnTable/PnTableHeaderCell';
import DowntimeLogDataSwitch from './DowntimeLogDataSwitch';

type Props = {
  downtimeLog: DowntimeLogHistory;
  getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
  handleTrackDownloadCertificateOpposable3dparties?: () => void;
};

const DesktopDowntimeLog = ({
  downtimeLog,
  getDowntimeLegalFactDocumentDetails,
  handleTrackDownloadCertificateOpposable3dparties,
}: Props) => {
  const fieldSpecs = useFieldSpecs();
  const { getField, getRows } = fieldSpecs;

  const columns: Array<Column<Downtime>> = useMemo(
    () => [
      {
        ...getField('startDate'),
        cellProps: { width: '15%' },
      },
      {
        ...getField('endDate'),
        cellProps: { width: '15%' },
      },
      {
        ...getField('functionality'),
        cellProps: { width: '30%' },
      },
      {
        ...getField('legalFactId'),
        cellProps: { width: '30%' },
      },
      {
        ...getField('status'),
        cellProps: { width: '15%' },
      },
    ],
    [getField]
  );

  const rows = getRows(downtimeLog);

  return (
    <PnTable testId="tableDowntimeLog">
      <PnTableHeader>
        {columns.map((column) => (
          <PnTableHeaderCell
            key={column.id}
            columnId={column.id}
            sortable={column.sortable}
            testId="tableDowntimeLog.header.cell"
          >
            {column.label}
          </PnTableHeaderCell>
        ))}
      </PnTableHeader>
      <PnTableBody>
        {rows.map((row, index) => (
          <PnTableBodyRow key={row.id} index={index} testId="tableDowntimeLog.row">
            {columns.map((column) => (
              <PnTableBodyCell
                key={column.id}
                cellProps={column.cellProps}
                testId="tableDowntimeLog.row.cell"
              >
                <DowntimeLogDataSwitch
                  data={row}
                  type={column.id}
                  inTwoLines
                  getDowntimeLegalFactDocumentDetails={getDowntimeLegalFactDocumentDetails}
                  handleTrackDownloadCertificateOpposable3dparties={
                    handleTrackDownloadCertificateOpposable3dparties
                  }
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
