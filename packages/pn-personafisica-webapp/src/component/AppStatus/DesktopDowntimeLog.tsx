import { Column, Item, ItemsTable } from '@pagopa-pn/pn-commons';
import { DowntimeLogPage } from "../../models/appStatus";
import { DowntimeLogColumn, useFieldSpecs } from './downtimeLog.utils';
import { useDownloadDocument } from './useDownloadDocument';

export const DesktopDowntimeLog = ({ downtimeLog }: { downtimeLog: DowntimeLogPage }) => {
  useDownloadDocument();
  const { getDateFieldSpec, getFunctionalityFieldSpec, getLegalFactIdFieldSpec, getStatusFieldSpec, getRows } = useFieldSpecs();

  const columns: Array<Column<DowntimeLogColumn>> = [
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
      align: 'center',
    },
  ];

  const rows: Array<Item> = getRows(downtimeLog);

  return <ItemsTable rows={rows} columns={columns} />;
};


