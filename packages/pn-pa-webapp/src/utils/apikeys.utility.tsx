import { Box } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedOrDefaultLabel } from '@pagopa-pn/pn-commons/src/services/localization.service';
import { ApiKeyStatus, ApiKeyStatusHistory } from '../models/ApiKeys';

function localizeStatus(
  status: string,
  defaultLabel: string,
  defaultDescription: string,
  history: Array<ApiKeyStatusHistory>
): {
  label: string;
  tooltip: ReactNode;
  description: string;
} {
  return {
    label: getLocalizedOrDefaultLabel('apikeys', `status.${status}`, defaultLabel),
    tooltip: TooltipApiKey(history),
    description: getLocalizedOrDefaultLabel(
      'apikeys',
      `status.${status}-description`,
      defaultDescription
    ),
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
      {history.map((h) => {
        const output = (p: string, h: ApiKeyStatusHistory) => (
          <Box sx={{textAlign: 'left'}}>
            <Box>
              {t(`tooltip.${p}`)} {h.date} {t('tooltip.from')}
            </Box>
            <Box>
              <b>{h.by}</b>
            </Box>
          </Box>
        );
        switch (h.status) {
          case ApiKeyStatus.ENABLED:
            return (
              output('enabled-in', h)
            );
          case ApiKeyStatus.CREATED:
            return (
              output('created-in', h)
            );
          case ApiKeyStatus.BLOCKED:
            return (
              output('blocked-in', h)
            );
          case ApiKeyStatus.ROTATED:
            return (
              output('rotated-in', h)
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
        ...localizeStatus('enabled', 'Attiva', "L'API Key è attiva", statusHistory),
      };
    case ApiKeyStatus.BLOCKED:
      return {
        color: 'default',
        ...localizeStatus('blocked', 'Bloccata', "L'API Key è bloccata", statusHistory),
      };
    case ApiKeyStatus.ROTATED:
      return {
        color: 'warning',
        ...localizeStatus('rotated', 'Ruotata', "L'API Key è ruotata", statusHistory),
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
