import { useCallback } from 'react';

import DownloadIcon from '@mui/icons-material/Download';
import { Button, Chip, Stack, Typography, useTheme } from '@mui/material';

import { CardElement, Column, DowntimeLogPage, DowntimeStatus, Item } from '../../models';
import { formatDate, formatDateTime, formatTimeWithLegend } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

export function booleanStringToBoolean(booleanString: string): boolean {
  return booleanString.toLowerCase() === 'true';
}

/* eslint-disable-next-line arrow-body-style */
const FormattedDateAndTime = ({
  id,
  date,
  inTwoLines,
}: {
  id: string;
  date: string;
  inTwoLines?: boolean;
}) => {
  if (date) {
    return inTwoLines ? (
      <Stack direction="column" id={`containerDate-${id}`}>
        <Typography variant="body2">{formatDate(date)},</Typography>
        <Typography variant="body2">{formatTimeWithLegend(date)}</Typography>
      </Stack>
    ) : (
      <Typography variant="body2" id="dateDisservizio">
        {formatDateTime(date)}
      </Typography>
    );
  }
  return (
    <Typography variant="body2" id="dateNull">
      -
    </Typography>
  );
};

export function adaptFieldSpecToMobile(
  desktopFieldSpec: Omit<Column<DowntimeLogColumn>, 'width'>
): CardElement {
  return {
    id: desktopFieldSpec.id,
    label: desktopFieldSpec.label,
    getLabel: desktopFieldSpec.getCellLabel,
  };
}

export type DowntimeLogColumn =
  | 'startDate'
  | 'endDate'
  | 'functionality'
  | 'legalFactId'
  | 'status'
  | '';

export function useFieldSpecs({
  getDowntimeLegalFactDocumentDetails,
}: {
  getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
}) {
  const theme = useTheme();

  const getDateFieldSpec = useCallback(
    (
      fieldId: DowntimeLogColumn,
      inTwoLines: boolean
    ): Omit<Column<DowntimeLogColumn>, 'width'> => ({
      id: fieldId,
      label: getLocalizedOrDefaultLabel(
        'appStatus',
        `downtimeList.columnHeader.${fieldId}`,
        `Data ${fieldId}`
      ),
      sortable: false,
      getCellLabel(value: string) {
        return <FormattedDateAndTime id={fieldId} date={value} inTwoLines={inTwoLines} />;
      },
    }),
    []
  );

  const getFunctionalityFieldSpec = useCallback(
    (): Omit<Column<DowntimeLogColumn>, 'width'> => ({
      label: getLocalizedOrDefaultLabel(
        'appStatus',
        'downtimeList.columnHeader.functionality',
        'Servizio coinvolto'
      ),
      sortable: false,
      id: 'functionality',
      getCellLabel(_: string, i: Item) {
        return i.knownFunctionality
          ? getLocalizedOrDefaultLabel(
              'appStatus',
              `legends.knownFunctionality.${i.knownFunctionality}`,
              'Nome del servizio ben conosciuto'
            )
          : getLocalizedOrDefaultLabel(
              'appStatus',
              'legends.unknownFunctionality',
              'Un servizio sconosciuto',
              { functionality: i.rawFunctionality }
            );
      },
    }),

    []
  );

  const getLegalFactIdFieldSpec = useCallback(
    (): Omit<Column<DowntimeLogColumn>, 'width'> => ({
      id: 'legalFactId',
      label: getLocalizedOrDefaultLabel(
        'appStatus',
        'downtimeList.columnHeader.legalFactId',
        'Attestazione'
      ),
      sortable: false,
      getCellLabel(_: string, i: Item) {
        if (booleanStringToBoolean(i.fileAvailable as string)) {
          return (
            <Button
              sx={{ px: 0 }}
              startIcon={<DownloadIcon />}
              data-testid="download-legal-fact"
              id={`buttonLegalFact-${i.id}`}
              onClick={() => {
                void getDowntimeLegalFactDocumentDetails(i.legalFactId as string);
              }}
            >
              {getLocalizedOrDefaultLabel('appStatus', 'legends.legalFactDownload', 'Scaricare')}
            </Button>
          );
        } else {
          return (
            <Typography
              id={`erroreDownloadLegalFact-${i.status}-${i.id}`}
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {getLocalizedOrDefaultLabel(
                'appStatus',
                `legends.noFileAvailableByStatus.${i.status}`,
                'Non si può ancora scaricare'
              )}
            </Typography>
          );
        }
      },
    }),
    []
  );

  const getStatusFieldSpec = useCallback(
    (): Omit<Column<DowntimeLogColumn>, 'width'> => ({
      id: 'status',
      label: getLocalizedOrDefaultLabel('appStatus', 'downtimeList.columnHeader.status', 'Stato'),
      sortable: false,
      getCellLabel(value: string) {
        return (
          <Chip
            id="downTimeStatus"
            data-testid="downtime-status"
            label={getLocalizedOrDefaultLabel('appStatus', `legends.status.${value}`, 'Status')}
            sx={{
              backgroundColor:
                value === DowntimeStatus.OK
                  ? theme.palette.success.light
                  : theme.palette.error.light,
            }}
          />
        );
      },
    }),
    []
  );

  const getRows = useCallback(
    (downtimeLog: DowntimeLogPage): Array<Item> =>
      downtimeLog.downtimes.map((n, i) => ({
        ...n,
        fileAvailable: n.fileAvailable ? 'true' : 'false',
        id: n.startDate + i.toString(),
      })),
    []
  );

  return {
    getDateFieldSpec,
    getFunctionalityFieldSpec,
    getLegalFactIdFieldSpec,
    getStatusFieldSpec,
    getRows,
  };
}
