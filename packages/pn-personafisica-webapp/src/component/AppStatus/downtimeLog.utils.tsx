import { useCallback } from 'react';
import { Button, Chip, Stack, Typography, useTheme } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { CardElement, Column, formatDate, formatTimeHHMM, Item } from '@pagopa-pn/pn-commons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../redux/hooks';
import { getDowntimeLegalFactDocumentDetails } from '../../redux/appStatus/actions';
import { DowntimeLogPage, DowntimeStatus } from '../../models/appStatus';

export function booleanStringToBoolean(booleanString: string): boolean {
  return booleanString.toLowerCase() === "true";
}

/* eslint-disable-next-line arrow-body-style */
const FormattedDateAndTime = ({ date, inTwoLines }: { date: string; inTwoLines?: boolean }) => {
  console.log('in DateAndTimeInTwoLines per questo date');
  console.log(date);

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


export function useFieldSpecs() {
  const { t } = useTranslation(['appStatus']);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const getDateFieldSpec = useCallback((fieldId: DowntimeLogColumn, inTwoLines: boolean): Omit<Column<DowntimeLogColumn>, "width"> => ({
    id: fieldId,
    label: t(`downtimeList.columnHeader.${fieldId}`),
    sortable: false, 
    getCellLabel(value: string) {
      return <FormattedDateAndTime date={value} inTwoLines={inTwoLines} />;
    },
  }), []);

  const getFunctionalityFieldSpec = useCallback((): Omit<Column<DowntimeLogColumn>, "width"> => ({
    id: 'functionality',
    label: t('downtimeList.columnHeader.functionality'),
    sortable: false,
    getCellLabel(_: string, i: Item) {
      return i.knownFunctionality
        ? t(`legends.knownFunctionality.${i.knownFunctionality}`)
        : t('legends.unknownFunctionality', { functionality: i.rawFunctionality });
    },
  }), []);

  const getLegalFactIdFieldSpec = useCallback((): Omit<Column<DowntimeLogColumn>, "width"> => ({
    id: 'legalFactId',
    label: t('downtimeList.columnHeader.legalFactId'),
    sortable: false,
    getCellLabel(_: string, i: Item) {
      if (booleanStringToBoolean(i.fileAvailable as string)) {
        return <Button
          sx={{ px: 0 }}
          startIcon={<DownloadIcon />}
          onClick={() => { void dispatch(getDowntimeLegalFactDocumentDetails(i.legalFactId as string)); }}
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
    label: t('downtimeList.columnHeader.status'),
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

