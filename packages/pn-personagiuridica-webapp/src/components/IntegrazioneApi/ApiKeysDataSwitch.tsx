import { useTranslation } from 'react-i18next';

import { Box, Chip, Typography } from '@mui/material';
import { Row, StatusTooltip } from '@pagopa-pn/pn-commons';
import { CopyToClipboardButton } from '@pagopa/mui-italia';

import {
  BffPublicKeysResponse,
  BffVirtualKeysResponse,
  PublicKeyStatus,
  VirtualKeyStatus,
} from '../../generated-client/pg-apikeys';
import { ApiKeyColumnData, ModalApiKeyView } from '../../models/ApiKeys';
import { getApiKeyStatusInfos } from '../../utility/apikeys.utility';
import ApiKeyContextMenu from './ApiKeyItemMenu';
import VirtualKeyItemMenu from './VirtualKeyItemMenu';

type Props = {
  data: Row<ApiKeyColumnData>;
  keys: BffPublicKeysResponse | BffVirtualKeysResponse;
  type: keyof ApiKeyColumnData;
  handleModalClick: (view: ModalApiKeyView, apiKeyId: string) => void;
  menuType: 'publicKeys' | 'virtualKeys';
};

const isApiKeyDisactivated = (data: Row<ApiKeyColumnData>): boolean =>
  data.status !== PublicKeyStatus.Active && data.status !== VirtualKeyStatus.Enabled;

const setRowColorByStatus = (data: Row<ApiKeyColumnData>): string | undefined =>
  isApiKeyDisactivated(data) ? 'text.disabled' : undefined;

const ApiKeysDataSwitch: React.FC<Props> = ({ data, keys, type, handleModalClick, menuType }) => {
  const { t } = useTranslation(['integrazioneApi']);

  switch (type) {
    case 'name':
      return <Typography sx={{ color: setRowColorByStatus(data) }}>{data.name}</Typography>;
    case 'value':
      if (!data.value) {
        return <>-</>;
      }
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
            color: setRowColorByStatus(data),
          }}
        >
          {`${data.value?.substring(0, 12)}...`}
          <CopyToClipboardButton
            data-testid="copyToClipboard"
            disabled={isApiKeyDisactivated(data)}
            tooltipTitle={t('api-key-copied')}
            value={() => data.value || ''}
          />
        </Box>
      );
    case 'date':
      return <Typography sx={{ color: setRowColorByStatus(data) }}>{data.date}</Typography>;
    case 'status':
      if (!data.status) {
        return <></>;
      }
      const { label, tooltip, color } = getApiKeyStatusInfos(data.status, data.statusHistory);
      return tooltip ? (
        <StatusTooltip
          label={t(label)}
          tooltip={data.statusHistory ? tooltip : undefined}
          color={color}
        />
      ) : (
        <Chip
          id={`status-chip-${t(label)}`}
          label={t(label)}
          color={color}
          sx={{ cursor: 'default' }}
          data-testid={`statusChip-${t(label)}`}
        />
      );
    case 'menu':
      return menuType === 'publicKeys' ? (
        <ApiKeyContextMenu data={data} keys={keys} handleModalClick={handleModalClick} />
      ) : (
        <VirtualKeyItemMenu
          data={data}
          keys={keys as BffVirtualKeysResponse}
          handleModalClick={handleModalClick}
        />
      );
    default:
      return <></>;
  }
};

export default ApiKeysDataSwitch;
