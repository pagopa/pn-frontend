import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { formatDate, isToday } from '@pagopa-pn/pn-commons';

import { PublicKeyStatus, PublicKeyStatusHistory } from '../generated-client/pg-apikeys';
import { ExtendedVirtualKeyStatus } from '../models/ApiKeys';

type TooltipApiKeyProps = { history: Array<PublicKeyStatusHistory> };

export const TooltipApiKey: React.FC<TooltipApiKeyProps> = ({ history }) => {
  const { t } = useTranslation(['integrazioneApi']);

  const getApiKeyHistory = (label: string, history: PublicKeyStatusHistory) => (
    <Box sx={{ textAlign: 'left' }} key={`${label}-${history.date}`}>
      {t(`tooltip.${label}`)} {history.date ? formatDate(history.date) : ''}
    </Box>
  );

  return (
    <Box
      sx={{
        '> .MuiBox-root:not(:last-child)': {
          marginBottom: 1,
        },
      }}
    >
      {history?.map((h) => {
        const suffixToday = h.date && isToday(new Date(h.date)) ? '' : '-in';

        switch (h.status) {
          case PublicKeyStatus.Active:
            return getApiKeyHistory(`enabled${suffixToday}`, h);
          case PublicKeyStatus.Created:
            return getApiKeyHistory(`created${suffixToday}`, h);
          case PublicKeyStatus.Blocked:
            return getApiKeyHistory(`blocked${suffixToday}`, h);
          case PublicKeyStatus.Rotated:
            return getApiKeyHistory(`rotated${suffixToday}`, h);
          default:
            return <></>;
        }
      })}
    </Box>
  );
};

export function getApiKeyStatusInfos(
  status: PublicKeyStatus | ExtendedVirtualKeyStatus,
  statusHistory?: Array<PublicKeyStatusHistory>
): {
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  label: string;
  tooltip?: ReactNode;
} {
  const label = `status.${status.toLowerCase()}`;
  const tooltip = statusHistory ? <TooltipApiKey history={statusHistory} /> : undefined;

  switch (status) {
    case ExtendedVirtualKeyStatus.Disabled:
      return {
        color: 'info',
        label,
        tooltip,
      };
    case ExtendedVirtualKeyStatus.Enabled:
    case PublicKeyStatus.Active:
      return {
        color: 'success',
        label,
        tooltip,
      };
    case PublicKeyStatus.Blocked:
      return {
        color: 'default',
        label,
        tooltip,
      };
    case PublicKeyStatus.Rotated:
      return {
        color: 'warning',
        label,
        tooltip,
      };
    default:
      return {
        color: 'default',
        label: 'Non definito',
        tooltip: <>Stato sconosciuto</>,
      };
  }
}
