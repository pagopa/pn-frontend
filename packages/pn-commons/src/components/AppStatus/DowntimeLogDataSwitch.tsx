import DownloadIcon from '@mui/icons-material/Download';
import { Button, Chip, Typography } from '@mui/material';
import { Stack } from '@mui/system';

import { Downtime, DowntimeStatus } from '../../models/AppStatus';
import { Row } from '../../models/PnTable';
import { formatDate, formatDateTime, formatTimeWithLegend } from '../../utility/date.utility';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';

const FormattedDateAndTime: React.FC<{ date: string; inTwoLines?: boolean }> = ({
  date,
  inTwoLines,
}) => {
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
  return (
    <Typography variant="body2">
      {getLocalizedOrDefaultLabel('appStatus', 'appStatus.missed-endDate')}
    </Typography>
  );
};

const DowntimeLogDataSwitch: React.FC<{
  data: Row<Downtime>;
  type: keyof Downtime;
  inTwoLines: boolean;
  getDowntimeLegalFactDocumentDetails: (legalFactId: string) => any;
  handleTrackDownloadCertificateOpposable3dparties?: () => void;
}> = ({
  data,
  type,
  inTwoLines,
  getDowntimeLegalFactDocumentDetails,
  handleTrackDownloadCertificateOpposable3dparties,
}) => {
  if (type === 'startDate') {
    return <FormattedDateAndTime date={data.startDate} inTwoLines={inTwoLines} />;
  }
  if (type === 'endDate') {
    return <FormattedDateAndTime date={data.endDate ?? ''} inTwoLines={inTwoLines} />;
  }
  if (type === 'functionality') {
    const unknownFunctinalityLabel = getLocalizedOrDefaultLabel(
      'appStatus',
      `legends.unknownFunctionality`,
      undefined,
      {
        functionality: data.functionality,
      }
    );
    return getLocalizedOrDefaultLabel(
      'appStatus',
      `legends.knownFunctionality.${data.functionality}`,
      unknownFunctinalityLabel
    );
  }
  if (type === 'legalFactId') {
    return data.fileAvailable ? (
      <Button
        sx={{ px: 0 }}
        startIcon={<DownloadIcon />}
        data-testid="download-legal-fact"
        onClick={() => {
          if (handleTrackDownloadCertificateOpposable3dparties) {
            handleTrackDownloadCertificateOpposable3dparties();
          }
          void getDowntimeLegalFactDocumentDetails(data.legalFactId as string);
        }}
      >
        {getLocalizedOrDefaultLabel('appStatus', 'legends.legalFactDownload')}
      </Button>
    ) : (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {getLocalizedOrDefaultLabel('appStatus', `legends.noFileAvailableByStatus.${data.status}`)}
      </Typography>
    );
  }
  if (type === 'status') {
    return (
      <Chip
        data-testid="downtime-status"
        label={getLocalizedOrDefaultLabel('appStatus', `legends.status.${data.status}`)}
        color={data.status === DowntimeStatus.OK ? 'success' : 'error'}
      />
    );
  }
  return <></>;
};

export default DowntimeLogDataSwitch;
