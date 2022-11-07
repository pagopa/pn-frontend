import { Column, Item, ItemsTable } from '@pagopa-pn/pn-commons';
import { DowntimeLogPage } from "@pagopa-pn/pn-commons";
import { DowntimeLogColumn, useFieldSpecs } from './downtimeLog.utils';

export const DesktopDowntimeLog = ({ downtimeLog }: { downtimeLog: DowntimeLogPage }) => {
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


