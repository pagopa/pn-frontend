import { MouseEvent, ReactNode, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Block, Delete, MoreVert, RemoveRedEye, Sync } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';
import { Row, useHasPermissions } from '@pagopa-pn/pn-commons';

import { BffVirtualKeysResponse, VirtualKeyStatus } from '../../generated-client/pg-apikeys';
import { ApiKeyColumnData, ModalApiKeyView } from '../../models/ApiKeys';
import { PNRole } from '../../redux/auth/types';
import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

type Props = {
  data: Row<ApiKeyColumnData>;
  keys: BffVirtualKeysResponse;
  handleModalClick: (view: ModalApiKeyView, apiKeyId: string) => void;
};

const VirtualKeyContextMenu: React.FC<Props> = ({ data, keys, handleModalClick }) => {
  const apiKeyId = data.id;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation(['integrazioneApi', 'common']);
  const open = Boolean(anchorEl);
  const currentUser = useAppSelector((state: RootState) => state.userState.user);
  const role = currentUser.organization?.roles ? currentUser.organization?.roles[0] : null;
  const isUserAdmin =
    useHasPermissions(role ? [role.role] : [], [PNRole.ADMIN]) && !currentUser.hasGroup;

  const isPersonalKey =
    !isUserAdmin ||
    keys.items.find((key) => key.id === apiKeyId)?.user?.fiscalCode === currentUser.fiscal_number;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const checkIfStatusIsAlreadyPresent = (status: VirtualKeyStatus): boolean =>
    !!keys.items.find(
      (key) =>
        key.status === status && (!key.user || key.user?.fiscalCode === data.user?.fiscalCode)
    );

  const shouldShowRotateButton = isPersonalKey
    ? data.status === VirtualKeyStatus.Enabled &&
      !checkIfStatusIsAlreadyPresent(VirtualKeyStatus.Rotated)
    : false;

  const shouldShowBlockButton =
    !keys.items.find(
      (key) =>
        key.user?.fiscalCode === data.user?.fiscalCode && key.status === VirtualKeyStatus.Blocked
    ) && data.status !== VirtualKeyStatus.Rotated;

  const menuElements : Array<ReactNode> = useMemo(()=>{
    const elements: Array<ReactNode> = [];

    if (shouldShowRotateButton) {
      // eslint-disable-next-line functional/immutable-data
      elements.push(
        <MenuItem
          id="button-rotate"
          data-testid="buttonRotate"
          onClick={() => handleModalClick(ModalApiKeyView.ROTATE, apiKeyId)}
        >
          <Sync sx={{ mr: 1 }} />
          {t('context-menu.rotate')}
        </MenuItem>
      );
    }
    if (shouldShowBlockButton) {
      // eslint-disable-next-line functional/immutable-data
      elements.push(
        <MenuItem
          id="button-block"
          data-testid="buttonBlock"
          onClick={() => handleModalClick(ModalApiKeyView.BLOCK, apiKeyId)}
        >
          <Block sx={{ mr: 1 }} />
          {t('context-menu.block')}
        </MenuItem>
      );
    }
    if (!isUserAdmin || isPersonalKey) {
      // eslint-disable-next-line functional/immutable-data
      elements.push(
        <MenuItem
          id="button-view"
          data-testid="buttonView"
          onClick={() => handleModalClick(ModalApiKeyView.VIEW, apiKeyId)}
        >
          <RemoveRedEye sx={{ mr: 1 }} />
          {t('context-menu.view')}
        </MenuItem>
      );
    }
    if (data.status !== VirtualKeyStatus.Enabled) {
      // eslint-disable-next-line functional/immutable-data
      elements.push(
        <MenuItem
          id="button-delete"
          data-testid="buttonDelete"
          onClick={() => handleModalClick(ModalApiKeyView.DELETE, apiKeyId)}
          sx={{ color: 'error.dark' }}
        >
          <Delete sx={{ mr: 1 }} />
          {t('button.elimina', { ns: 'common' })}
        </MenuItem>
      );
    }  
    return elements;
  },[data.status, isUserAdmin, isPersonalKey, shouldShowRotateButton, shouldShowBlockButton ]);
 
  return (
    <Box data-testid="contextMenu">
      {menuElements.length > 0 && (
        <>
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
            {menuElements}
          </Menu>
        </>
      )}
    </Box>
  );
};

export default VirtualKeyContextMenu;
