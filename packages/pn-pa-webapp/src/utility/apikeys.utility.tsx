import { ReactNode } from 'react';

import { Box } from '@mui/material';
import { formatDate, isToday } from '@pagopa-pn/pn-commons';

import { ApiKeyStatus, ApiKeyStatusHistory } from '../models/ApiKeys';

type TooltipApiKeyProps = { lines: Array<string> };

function localizeStatus(
  status: string,
  statusHistoryLines: Array<string>
): {
  label: string;
  tooltip: ReactNode;
  description: string;
} {
  return {
    label: `status.${status}`,
    tooltip: <TooltipApiKey lines={statusHistoryLines} />,
    description: `status.${status}-description`,
  };
}

export const TooltipApiKey: React.FC<TooltipApiKeyProps> = ({ lines }) => (
  <Box
    sx={{
      '> .MuiBox-root:not(:last-child)': {
        marginBottom: 1,
      },
    }}
  >
    {lines.map((line, index) => (
      <Box sx={{ textAlign: 'left' }} key={index}>
        <Box>{line}</Box>
      </Box>
    ))}
  </Box>
);

/**
 * Build the localized lines used to render the tooltip (and reusable for aria-label)
 */
export const getApiKeyStatusHistoryLines = (
  t: (key: string) => string,
  history: Array<ApiKeyStatusHistory>
): Array<string> =>
  history.flatMap((h) => {
    const suffixToday = isToday(new Date(h.date)) ? '' : '-in';

    const buildLine = (key: string) => `${t(key)} ${formatDate(h.date)}`;

    switch (h.status) {
      case ApiKeyStatus.ENABLED:
        return [buildLine(`tooltip.enabled${suffixToday}`)];
      case ApiKeyStatus.CREATED:
        return [buildLine(`tooltip.created${suffixToday}`)];
      case ApiKeyStatus.BLOCKED:
        return [buildLine(`tooltip.blocked${suffixToday}`)];
      case ApiKeyStatus.ROTATED:
        return [buildLine(`tooltip.rotated${suffixToday}`)];
      default:
        return [];
    }
  });

export function getApiKeyStatusInfos(
  status: ApiKeyStatus,
  statusHistoryLines: Array<string>
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
        ...localizeStatus('enabled', statusHistoryLines),
      };
    case ApiKeyStatus.BLOCKED:
      return {
        color: 'default',
        ...localizeStatus('blocked', statusHistoryLines),
      };
    case ApiKeyStatus.ROTATED:
      return {
        color: 'warning',
        ...localizeStatus('rotated', statusHistoryLines),
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
