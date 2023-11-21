import { useCallback } from 'react';

import DownloadIcon from '@mui/icons-material/Download';
import { Button, Chip, Stack, Typography } from '@mui/material';

import { CardElement, Column, Downtime, DowntimeLogPage, DowntimeStatus, Row } from '../../models';
import { formatDate, formatDateTime, formatTimeWithLegend } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

const FormattedDateAndTime = ({ date, inTwoLines }: { date: string; inTwoLines?: boolean }) => {
  if (date) {
    return inTwoLines ? (
      <Stack direction="column">
        <Typography variant="body2">{formatDate(date)},</Typography>
        <Typography variant="body2">{formatTimeWithLegend(date)}</Typography>
      </Stack>
    ) : (
      <Typography variant="body2">{formatDateTime(date)}</Typography>
    );
  }
  return <Typography variant="body2">-</Typography>;
};

export const DowntimeCell = ({
  row,
  column,
  inTwoLines,
  getDowntimeLegalFactDocumentDetails,
}: {
  row: Row<Downtime>;
  column: Column<Downtime> | CardElement<Downtime>;
  inTwoLines: boolean;
  getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
}) => {
  if (column.id === 'startDate') {
    return <FormattedDateAndTime date={row.startDate} inTwoLines={inTwoLines} />;
  }
  if (column.id === 'endDate') {
    return <FormattedDateAndTime date={row.endDate ?? ''} inTwoLines={inTwoLines} />;
  }
  if (column.id === 'knownFunctionality') {
    return row.knownFunctionality ? (
      <>
        {getLocalizedOrDefaultLabel(
          'appStatus',
          `legends.knownFunctionality.${row.knownFunctionality}`
        )}
      </>
    ) : (
      <>
        {getLocalizedOrDefaultLabel('appStatus', 'legends.unknownFunctionality', undefined, {
          functionality: row.rawFunctionality,
        })}
      </>
    );
  }
  if (column.id === 'legalFactId') {
    return row.fileAvailable ? (
      <Button
        sx={{ px: 0 }}
        startIcon={<DownloadIcon />}
        data-testid="download-legal-fact"
        onClick={() => {
          void getDowntimeLegalFactDocumentDetails(row.legalFactId as string);
        }}
      >
        {getLocalizedOrDefaultLabel('appStatus', 'legends.legalFactDownload')}
      </Button>
    ) : (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {getLocalizedOrDefaultLabel('appStatus', `legends.noFileAvailableByStatus.${row.status}`)}
      </Typography>
    );
  }
  return (
    <Chip
      data-testid="downtime-status"
      label={getLocalizedOrDefaultLabel('appStatus', `legends.status.${row.status}`)}
      sx={{
        backgroundColor: row.status === DowntimeStatus.OK ? 'success.light' : 'error.light',
      }}
    />
  );
};

export function useFieldSpecs() {
  const getField = useCallback((fieldId: keyof Downtime): Omit<Column<Downtime>, 'width'> => {
    if (fieldId === 'startDate' || fieldId === 'endDate') {
      return {
        id: fieldId,
        label: getLocalizedOrDefaultLabel('appStatus', `downtimeList.columnHeader.${fieldId}`),
      };
    }
    if (fieldId === 'knownFunctionality') {
      return {
        id: 'knownFunctionality',
        label: getLocalizedOrDefaultLabel('appStatus', 'downtimeList.columnHeader.functionality'),
      };
    }
    if (fieldId === 'legalFactId') {
      return {
        id: 'legalFactId',
        label: getLocalizedOrDefaultLabel('appStatus', 'downtimeList.columnHeader.legalFactId'),
      };
    }
    return {
      id: 'status',
      label: getLocalizedOrDefaultLabel('appStatus', 'downtimeList.columnHeader.status'),
    };
  }, []);

  const getRows = useCallback(
    (downtimeLog: DowntimeLogPage): Array<Row<Downtime>> =>
      downtimeLog.downtimes.map((n, i) => ({
        ...n,
        id: n.startDate + i.toString(),
      })),
    []
  );

  return {
    getField,
    getRows,
  };
}
