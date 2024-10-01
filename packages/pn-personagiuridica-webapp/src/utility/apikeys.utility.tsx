import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { formatDate, isToday } from '@pagopa-pn/pn-commons';

import { ApiKeyStatus, StatusHistoryApikey } from '../models/ApiKeys';

function localizeStatus(
  status: string,
  history: Array<StatusHistoryApikey>
): {
  label: string;
  tooltip: ReactNode;
} {
  return {
    label: `status.${status}`,
    tooltip: <TooltipApiKey history={history} />,
  };
}

type TooltipApiKeyProps = { history: Array<StatusHistoryApikey> };

export const TooltipApiKey: React.FC<TooltipApiKeyProps> = ({ history }) => {
  const { t } = useTranslation(['integrazioneApi']);
  return (
    <Box
      sx={{
        '> .MuiBox-root:not(:last-child)': {
          marginBottom: 1,
        },
      }}
    >
      {history?.map((h, index) => {
        const output = (p: string, h: StatusHistoryApikey) => (
          <Box sx={{ textAlign: 'left' }} key={index}>
            <Box>
              {t(`tooltip.${p}`)} {formatDate(h.date)}
            </Box>
          </Box>
        );

        const suffixToday = isToday(new Date(h.date)) ? '' : '-in';

        switch (h.status) {
          case ApiKeyStatus.ACTIVE:
            return output(`enabled${suffixToday}`, h);
          case ApiKeyStatus.CREATED:
            return output(`created${suffixToday}`, h);
          case ApiKeyStatus.BLOCKED:
            return output(`blocked${suffixToday}`, h);
          case ApiKeyStatus.ROTATED:
            return output(`rotated${suffixToday}`, h);
          default:
            return <></>;
        }
      })}
    </Box>
  );
};

export function getApiKeyStatusInfos(
  status: ApiKeyStatus,
  statusHistory: Array<StatusHistoryApikey>
): {
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  label: string;
  tooltip: ReactNode;
} {
  switch (status) {
    case ApiKeyStatus.ACTIVE:
      return {
        color: 'success',
        ...localizeStatus('enabled', statusHistory),
      };
    case ApiKeyStatus.BLOCKED:
      return {
        color: 'default',
        ...localizeStatus('blocked', statusHistory),
      };
    case ApiKeyStatus.ROTATED:
      return {
        color: 'warning',
        ...localizeStatus('rotated', statusHistory),
      };
    default:
      return {
        color: 'default',
        label: 'Non definito',
        tooltip: <>Stato sconosciuto</>,
      };
  }
}
