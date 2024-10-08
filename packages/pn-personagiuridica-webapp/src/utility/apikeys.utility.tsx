import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import { formatDate, isToday } from '@pagopa-pn/pn-commons';

import {
  PublicKeyStatus,
  PublicKeyStatusHistory,
  VirtualKeyStatus,
} from '../generated-client/pg-apikeys';

function localizeStatus(
  status: string,
  history?: Array<PublicKeyStatusHistory>
): {
  label: string;
  tooltip?: ReactNode;
} {
  return {
    label: `status.${status}`,
    tooltip: history ? <TooltipApiKey history={history} /> : undefined,
  };
}

type TooltipApiKeyProps = { history: Array<PublicKeyStatusHistory> };

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
        const output = (p: string, h: PublicKeyStatusHistory) => (
          <Box sx={{ textAlign: 'left' }} key={index}>
            <Box>
              {t(`tooltip.${p}`)} {formatDate(h.date ?? '')}
            </Box>
          </Box>
        );

        const suffixToday = isToday(new Date(h.date ?? '')) ? '' : '-in';

        switch (h.status) {
          case PublicKeyStatus.Active:
            return output(`enabled${suffixToday}`, h);
          case PublicKeyStatus.Created:
            return output(`created${suffixToday}`, h);
          case PublicKeyStatus.Blocked:
            return output(`blocked${suffixToday}`, h);
          case PublicKeyStatus.Rotated:
            return output(`rotated${suffixToday}`, h);
          default:
            return <></>;
        }
      })}
    </Box>
  );
};

export function getApiKeyStatusInfos(
  status: PublicKeyStatus | VirtualKeyStatus,
  statusHistory?: Array<PublicKeyStatusHistory>
): {
  color: 'warning' | 'error' | 'success' | 'info' | 'default' | 'primary' | 'secondary' | undefined;
  label: string;
  tooltip?: ReactNode;
} {
  switch (status) {
    case PublicKeyStatus.Active:
      return {
        color: 'success',
        ...localizeStatus('enabled', statusHistory),
      };
    case PublicKeyStatus.Blocked:
      return {
        color: 'default',
        ...localizeStatus('blocked', statusHistory),
      };
    case PublicKeyStatus.Rotated:
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
