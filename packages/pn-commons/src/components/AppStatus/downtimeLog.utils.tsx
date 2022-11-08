import { useCallback } from 'react';
import { Button, Chip, Stack, Typography, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useTranslation } from 'react-i18next';
import { formatDate, formatTimeHHMM } from '../../services';
import { CardElement, Column, Item } from '../../types';
import { DowntimeLogPage, DowntimeStatus } from '../../models';
import { getLocalizedOrDefaultLabel } from '../../services/localization.service';

export function booleanStringToBoolean(booleanString: string): boolean {
  return booleanString.toLowerCase() === "true";
}

/* eslint-disable-next-line arrow-body-style */
const FormattedDateAndTime = ({ date, inTwoLines }: { date: string; inTwoLines?: boolean }) => {
  return date ?
    (inTwoLines
      ? <Stack direction="column">
        <Typography variant="body2">{formatDate(date)},</Typography>
        <Typography variant="body2">ore {formatTimeHHMM(date)}</Typography>
      </Stack>
      : <Typography variant="body2">{formatDate(date)}, ore {formatTimeHHMM(date)}</Typography>
    )
    : <Typography variant="body2">-</Typography>;
};

export function adaptFieldSpecToMobile(desktopFieldSpec: Omit<Column<DowntimeLogColumn>, "width">): CardElement {
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


export function useFieldSpecs({ getDowntimeLegalFactDocumentDetails }: { getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any}) {
  const { t } = useTranslation(['appStatus']);
  const theme = useTheme();

  const getDateFieldSpec = useCallback((fieldId: DowntimeLogColumn, inTwoLines: boolean): Omit<Column<DowntimeLogColumn>, "width"> => ({
    id: fieldId,
    label: getLocalizedOrDefaultLabel(
      'appStatus',
      `downtimeList.columnHeader.${fieldId}`,
      `Data ${fieldId}`
    ),
    sortable: false, 
    getCellLabel(value: string) {
      return <FormattedDateAndTime date={value} inTwoLines={inTwoLines} />;
    },
  }), []);

  const getFunctionalityFieldSpec = useCallback((): Omit<Column<DowntimeLogColumn>, "width"> => ({
    id: 'functionality',
    label: getLocalizedOrDefaultLabel(
      'appStatus',
      'downtimeList.columnHeader.functionality',
      "Servizio coinvolto"
    ),
    sortable: false,
    getCellLabel(_: string, i: Item) {
      return i.knownFunctionality
        ? t(`legends.knownFunctionality.${i.knownFunctionality}`)
        : t('legends.unknownFunctionality', { functionality: i.rawFunctionality });
    },
  }), []);

  const getLegalFactIdFieldSpec = useCallback((): Omit<Column<DowntimeLogColumn>, "width"> => ({
    id: 'legalFactId',
    label: getLocalizedOrDefaultLabel(
      'appStatus',
      'downtimeList.columnHeader.legalFactId',
      "Attestazione"
    ),
    sortable: false,
    getCellLabel(_: string, i: Item) {
      if (booleanStringToBoolean(i.fileAvailable as string)) {
        return <Button
          sx={{ px: 0 }}
          startIcon={<DownloadIcon />}
          onClick={() => { void getDowntimeLegalFactDocumentDetails(i.legalFactId as string); }}
        >
          {t("legends.legalFactDownload")}
        </Button>;
      } else {
        return <Typography variant="body2" sx={{ color: theme.palette.text.secondary, }}>
          {t(`legends.noFileAvailableByStatus.${i.status}`)}
        </Typography>;
      }
    },
  }), []);

  const getStatusFieldSpec = useCallback((): Omit<Column<DowntimeLogColumn>, "width"> => ({
    id: 'status',
    label: getLocalizedOrDefaultLabel(
      'appStatus',
      'downtimeList.columnHeader.status',
      "Stato"
    ),
    sortable: false,
    getCellLabel(value: string) {
      return <Chip
        label={t(`legends.status.${value}`)}
        sx={{ backgroundColor: value === DowntimeStatus.OK ? theme.palette.error.light : theme.palette.success.light }}
      />;
    },
  }), []);

  const getRows = useCallback((downtimeLog: DowntimeLogPage): Array<Item> => downtimeLog.downtimes.map((n, i) => ({
    ...n,
    fileAvailable: n.fileAvailable ? "true" : "false",
    id: n.startDate + i.toString(),
  })), []);
  
  return { getDateFieldSpec, getFunctionalityFieldSpec, getLegalFactIdFieldSpec, getStatusFieldSpec, getRows };
}

