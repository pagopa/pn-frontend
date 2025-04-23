import { useTranslation } from 'react-i18next';

import { Chip, Stack, Typography } from '@mui/material';
import { Row, StatusTooltip } from '@pagopa-pn/pn-commons';
import { CopyToClipboardButton } from '@pagopa/mui-italia';

import {
  BffPublicKeysResponse,
  BffVirtualKeysResponse,
  PublicKeyStatus,
  VirtualKeyStatus,
} from '../../generated-client/pg-apikeys';
import { ApiKeyColumnData, ExtendedVirtualKeyStatus, ModalApiKeyView } from '../../models/ApiKeys';
import { getApiKeyStatusInfos } from '../../utility/apikeys.utility';
import PublicKeyContextMenu from './PublicKeyContextMenu';
import VirtualKeyContextMenu from './VirtualKeyContextMenu';

type Props = {
  data: Row<ApiKeyColumnData>;
  keys: BffPublicKeysResponse | BffVirtualKeysResponse;
  type: keyof ApiKeyColumnData;
  handleModalClick: (view: ModalApiKeyView, apiKeyId: string) => void;
  menuType: 'publicKeys' | 'virtualKeys';
  issuerIsActive?: boolean;
  issuerIsPresent?: boolean;
};

const isApiKeyDisactivated = (data: Row<ApiKeyColumnData>): boolean =>
  data.status !== PublicKeyStatus.Active && data.status !== VirtualKeyStatus.Enabled;

const setRowColorByStatus = (data: Row<ApiKeyColumnData>): string | undefined =>
  isApiKeyDisactivated(data) ? 'text.disabled' : undefined;

const ApiKeysDataSwitch: React.FC<Props> = ({
  data,
  keys,
  type,
  handleModalClick,
  menuType,
  issuerIsActive,
  issuerIsPresent,
}) => {
  const { t } = useTranslation(['integrazioneApi']);

  switch (type) {
    case 'name':
      return <Typography sx={{ color: setRowColorByStatus(data) }}>{data.name}</Typography>;
    case 'value':
      if (!data.value) {
        return <>-</>;
      }
      return (
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            color: setRowColorByStatus(data),
          }}
        >
          <Typography
            variant="body2"
            sx={{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              color: 'inherit',
            }}
          >
            {data.value}
          </Typography>
          <CopyToClipboardButton
            data-testid="copyToClipboard"
            disabled={isApiKeyDisactivated(data)}
            tooltipTitle={t('api-key-copied')}
            value={() => data.value ?? ''}
          />
        </Stack>
      );
    case 'date':
      return <Typography sx={{ color: setRowColorByStatus(data) }}>{data.date}</Typography>;
    case 'status': {
      if (!data.status) {
        return <></>;
      }
      const { label, tooltip, color } =
        !issuerIsActive && data.status === VirtualKeyStatus.Enabled
          ? getApiKeyStatusInfos(ExtendedVirtualKeyStatus.Disabled, data.statusHistory)
          : getApiKeyStatusInfos(data.status, data.statusHistory);
      return tooltip ? (
        <StatusTooltip label={t(label)} tooltip={tooltip} color={color} />
      ) : (
        <Chip
          id={`status-chip-${t(label)}`}
          label={t(label)}
          color={color}
          sx={{ cursor: 'default' }}
          data-testid={`statusChip-${t(label)}`}
        />
      );
    }
    case 'menu': {
      if (menuType === 'publicKeys') {
        return (
          <PublicKeyContextMenu
            data={data}
            keys={keys as BffPublicKeysResponse}
            handleModalClick={handleModalClick}
          />
        );
      } else if (issuerIsPresent) {
        return (
          <VirtualKeyContextMenu
            data={data}
            keys={keys as BffVirtualKeysResponse}
            handleModalClick={handleModalClick}
            issuerIsActive={issuerIsActive}
          />
        );
      } else {
        return <></>;
      }
    }
    default:
      return <></>;
  }
};

export default ApiKeysDataSwitch;
