import { useMemo } from 'react';
import { DowntimeLogPage } from '../../models';
import { Column, Item } from '../../types';
import ItemsTable from '../Data/ItemsTable';
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

  return <ItemsTable rows={rows} columns={columns} />;
};

export default DesktopDowntimeLog;
