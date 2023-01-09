import { Box } from '@mui/material';
import { formatDate, isToday } from '@pagopa-pn/pn-commons';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ApiKeyStatus, ApiKeyStatusHistory } from '../models/ApiKeys';

function LocalizeStatus(
  status: string,
  history: Array<ApiKeyStatusHistory>
): {
  label: string;
  tooltip: ReactNode;
  description: string;
} {
  const { t } = useTranslation(['apikeys']);
  return {
    label: t(`status.${status}`),
    tooltip: TooltipApiKey(history),
    description: t(`status.${status}-description`),
  };
}

const TooltipApiKey = (history: Array<ApiKeyStatusHistory>) => {
  const { t } = useTranslation(['apikeys']);
  return (
    <Box
      sx={{
        '> .MuiBox-root:not(:last-child)': {
          marginBottom: 1,
        },
      }}
    >
      {history.map((h, index) => {
        const output = (p: string, h: ApiKeyStatusHistory) => (
          <Box sx={{textAlign: 'left'}} key={index}>
            <Box>
              {t(`tooltip.${p}`)} {formatDate(h.date)}
            </Box>
          </Box>
        );

        const suffixToday = isToday(new Date(h.date)) ? '' : '-in';

        switch (h.status) {
          case ApiKeyStatus.ENABLED:
            return (
              output(`enabled${suffixToday}`, h)
            );
          case ApiKeyStatus.CREATED:
            return (
              output(`created${suffixToday}`, h)
            );
          case ApiKeyStatus.BLOCKED:
            return (
              output(`blocked${suffixToday}`, h)
            );
          case ApiKeyStatus.ROTATED:
            return (
              output(`rotated${suffixToday}`, h)
            );
          default:
            return <></>;
        }
      })}
    </Box>
  );
};

export function getApiKeyStatusInfos(
  status: ApiKeyStatus,
  statusHistory: Array<ApiKeyStatusHistory>
): {
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  label: string;
  tooltip: ReactNode;
  description: string;
} {
  switch (status) {
    case ApiKeyStatus.ENABLED:
      return {
        color: 'success',
        ...LocalizeStatus('enabled', statusHistory),
      };
    case ApiKeyStatus.BLOCKED:
      return {
        color: 'default',
        ...LocalizeStatus('blocked', statusHistory),
      };
    case ApiKeyStatus.ROTATED:
      return {
        color: 'warning',
        ...LocalizeStatus('rotated', statusHistory),
      };
    default:
      return {
        color: 'default',
        label: 'Non definito',
        tooltip: <>Stato sconosciuto</>,
        description: 'Stato sconosciuto',
      };
  }
}
