import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  BlockRounded,
  DeleteRounded,
  MoreVertRounded,
  RemoveRedEyeRounded,
  SyncRounded,
} from '@mui/icons-material';
import { Box, Menu, MenuItem } from '@mui/material';
import { Row } from '@pagopa-pn/pn-commons';
import { MIIconButton } from '@pagopa/mui-italia';

import { BffPublicKeysResponse, PublicKeyStatus } from '../../generated-client/pg-apikeys';
import { ApiKeyColumnData, ModalApiKeyView } from '../../models/ApiKeys';

type Props = {
  data: Row<ApiKeyColumnData>;
  keys: BffPublicKeysResponse;
  handleModalClick: (view: ModalApiKeyView, apiKeyId: string) => void;
};

const PublicKeyContextMenu: React.FC<Props> = ({ data, keys, handleModalClick }) => {
  const apiKeyId = data.id;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation(['integrazioneApi', 'common']);
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
      <MIIconButton
        onClick={handleClick}
        data-testid="contextMenuButton"
        aria-label={t('context-menu.title')}
        aria-controls={open ? 'context-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <MoreVertRounded />
      </MIIconButton>

      <Menu
        data-testid="menuContext"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
            },
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
              <SyncRounded sx={{ mr: 1 }} />
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
              <BlockRounded sx={{ mr: 1 }} />
              {t('context-menu.block')}
            </MenuItem>
          )}

        <MenuItem
          id="button-view"
          data-testid="buttonView"
          onClick={() => handleModalClick(ModalApiKeyView.VIEW, apiKeyId)}
        >
          <RemoveRedEyeRounded sx={{ mr: 1 }} />
          {t('context-menu.view')}
        </MenuItem>

        {data.status !== PublicKeyStatus.Active && (
          <MenuItem
            id="button-delete"
            data-testid="buttonDelete"
            onClick={() => handleModalClick(ModalApiKeyView.DELETE, apiKeyId)}
            sx={{ color: 'error.dark' }}
          >
            <DeleteRounded sx={{ mr: 1 }} />
            {t('button.elimina', { ns: 'common' })}
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default PublicKeyContextMenu;
