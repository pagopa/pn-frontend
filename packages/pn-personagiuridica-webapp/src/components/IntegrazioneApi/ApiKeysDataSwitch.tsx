import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Block, Delete, MoreVert, RemoveRedEye, Sync } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Row, StatusTooltip } from '@pagopa-pn/pn-commons';
import { CopyToClipboardButton } from '@pagopa/mui-italia';

import { BffPublicKeysResponse, PublicKeyStatus } from '../../generated-client/pg-apikeys';
import { ModalApiKeyView, PublicKeysColumnData } from '../../models/ApiKeys';
import { getApiKeyStatusInfos } from '../../utility/apikeys.utility';

const isApiKeyDisactivated = (data: Row<PublicKeysColumnData>): boolean =>
  data.status !== PublicKeyStatus.Active;

const setRowColorByStatus = (data: Row<PublicKeysColumnData>): string | undefined =>
  isApiKeyDisactivated(data) ? 'text.disabled' : undefined;

const ApiKeyContextMenu = ({
  data,
  keys,
  handleModalClick,
}: {
  data: Row<PublicKeysColumnData>;
  keys: BffPublicKeysResponse;
  handleModalClick: (view: ModalApiKeyView, apiKeyId: number) => void;
}) => {
  const apiKeyId = Number(data.id);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation(['integrazioneApi']);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const checkIfStatusIsAlreadyPresent = (status: PublicKeyStatus): boolean =>
    keys.items.some((key) => key.status === status);

  return (
    <Box data-testid="contextMenu">
      <Box>
        <IconButton
          onClick={handleClick}
          size="small"
          color="primary"
          data-testid="contextMenuButton"
          aria-label={t('context-menu.title')}
          aria-controls={open ? 'context-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <MoreVert />
        </IconButton>
      </Box>
      <Menu
        data-testid="menuContext"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {data.status === PublicKeyStatus.Active &&
          !checkIfStatusIsAlreadyPresent(PublicKeyStatus.Rotated) && (
            <MenuItem
              id="button-rotate"
              data-testid="buttonRotate"
              onClick={() => handleModalClick(ModalApiKeyView.ROTATE, apiKeyId)}
            >
              <Sync sx={{ mr: 1 }} />
              {t('context-menu.rotate')}
            </MenuItem>
          )}
        {data.status === PublicKeyStatus.Active &&
          !checkIfStatusIsAlreadyPresent(PublicKeyStatus.Blocked) && (
            <MenuItem
              id="button-block"
              data-testid="buttonBlock"
              onClick={() => handleModalClick(ModalApiKeyView.BLOCK, apiKeyId)}
            >
              <Block sx={{ mr: 1 }} />
              {t('context-menu.block')}
            </MenuItem>
          )}

        <MenuItem
          id="button-view"
          data-testid="buttonView"
          onClick={() => handleModalClick(ModalApiKeyView.VIEW, apiKeyId)}
        >
          <RemoveRedEye sx={{ mr: 1 }} />
          {t('context-menu.view')}
        </MenuItem>

        {data.status !== PublicKeyStatus.Active && (
          <MenuItem
            id="button-delete"
            data-testid="buttonDelete"
            onClick={() => handleModalClick(ModalApiKeyView.DELETE, apiKeyId)}
            sx={{ color: 'error.dark' }}
          >
            <Delete sx={{ mr: 1 }} />
            {t('context-menu.delete')}
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

const ApiKeysDataSwitch: React.FC<{
  data: Row<PublicKeysColumnData>;
  keys: BffPublicKeysResponse;
  type: keyof PublicKeysColumnData;
  handleModalClick: (view: ModalApiKeyView, apiKeyId: number) => void;
}> = ({ data, keys, type, handleModalClick }) => {
  const { t } = useTranslation(['integrazioneApi']);

  if (type === 'name') {
    return <Typography sx={{ color: setRowColorByStatus(data) }}>{data.name}</Typography>;
  }
  if (type === 'value') {
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
  }
  if (type === 'createdAt') {
    return <Typography sx={{ color: setRowColorByStatus(data) }}>{data.createdAt}</Typography>;
  }
  if (type === 'status') {
    if (!data.status || !data.statusHistory) {
      return <></>;
    }
    const { label, tooltip, color } = getApiKeyStatusInfos(data.status, data.statusHistory);
    return (
      <Box
        sx={{
          alignItems: 'left',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <StatusTooltip label={t(label)} tooltip={tooltip} color={color} />
      </Box>
    );
  }
  if (type === 'menu') {
    return <ApiKeyContextMenu data={data} keys={keys} handleModalClick={handleModalClick} />;
  }
  return <></>;
};

export default ApiKeysDataSwitch;
