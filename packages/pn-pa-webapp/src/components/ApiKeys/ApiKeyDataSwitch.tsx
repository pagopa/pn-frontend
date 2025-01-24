import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { MoreVert } from '@mui/icons-material';
import { Box, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import {
  CustomTagGroup,
  CustomTooltip,
  Row,
  StatusTooltip,
  formatDate,
} from '@pagopa-pn/pn-commons';
import { CopyToClipboardButton, Tag } from '@pagopa/mui-italia';

import { ApiKey, ApiKeyStatus, ModalApiKeyView } from '../../models/ApiKeys';
import { getApiKeyStatusInfos } from '../../utility/apikeys.utility';

/**
 * Checks if status history of a api key contains a status set as ROTATED
 * @returns true if the api key history contains status ROTATED, otherwise false
 */
const isApiKeyRotated = (data: Row<ApiKey>): boolean =>
  data.statusHistory &&
  !!data.statusHistory.find((status) => status.status === ApiKeyStatus.ROTATED);

const setRowColorByStatus = (data: Row<ApiKey>): string | undefined =>
  isApiKeyRotated(data) ? '#aaa' : undefined;

const ApiKeyContextMenu = ({
  data,
  handleModalClick,
}: {
  data: Row<ApiKey>;
  handleModalClick: (view: ModalApiKeyView, apiKeyId: number) => void;
}) => {
  const apiKeyId = Number(data.id);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { t } = useTranslation(['apikeys']);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box data-testid="contextMenu">
      <Box>
        <IconButton
          onClick={handleClick}
          size="small"
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
        {data.status !== ApiKeyStatus.ROTATED && (
          <MenuItem
            id="button-view"
            data-testid="buttonView"
            onClick={() => handleModalClick(ModalApiKeyView.VIEW, apiKeyId)}
          >
            {t('context-menu.view')}
          </MenuItem>
        )}
        {data.status !== ApiKeyStatus.ROTATED && data.status !== ApiKeyStatus.BLOCKED && (
          <MenuItem
            id="button-rotate"
            data-testid="buttonRotate"
            onClick={() => handleModalClick(ModalApiKeyView.ROTATE, apiKeyId)}
          >
            {t('context-menu.rotate')}
          </MenuItem>
        )}
        {(data.status === ApiKeyStatus.ENABLED || data.status === ApiKeyStatus.ROTATED) && (
          <MenuItem
            id="button-block"
            data-testid="buttonBlock"
            onClick={() => handleModalClick(ModalApiKeyView.BLOCK, apiKeyId)}
          >
            {t('context-menu.block')}
          </MenuItem>
        )}
        {data.status === ApiKeyStatus.BLOCKED && (
          <MenuItem
            id="button-delete"
            data-testid="buttonDelete"
            onClick={() => handleModalClick(ModalApiKeyView.DELETE, apiKeyId)}
          >
            {t('context-menu.delete')}
          </MenuItem>
        )}
        {data.status === ApiKeyStatus.BLOCKED && !isApiKeyRotated(data) && (
          <MenuItem
            id="button-enable"
            data-testid="buttonEnable"
            onClick={() => handleModalClick(ModalApiKeyView.ENABLE, apiKeyId)}
          >
            {t('context-menu.enable')}
          </MenuItem>
        )}
        {data.groups.length > 0 && (
          <MenuItem
            id="button-view-groups-id"
            data-testid="buttonViewGroupsId"
            onClick={() => handleModalClick(ModalApiKeyView.VIEW_GROUPS_ID, apiKeyId)}
          >
            {t('context-menu.view-groups-id')}
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

const ApiKeyDataSwitch: React.FC<{
  data: Row<ApiKey>;
  type: keyof (ApiKey & { contextMenu: string });
  handleModalClick: (view: ModalApiKeyView, apiKeyId: number) => void;
}> = ({ data, type, handleModalClick }) => {
  const { t } = useTranslation(['apikeys']);

  if (type === 'name') {
    return (
      <Typography
        sx={{
          color: setRowColorByStatus(data),
        }}
      >
        {data.name}
      </Typography>
    );
  }
  if (type === 'value') {
    return (
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          color: setRowColorByStatus(data),
          flexWrap: 'wrap'
        }}
      >
        {/* `${data.value.substring(0, 10)}...` */}
        <Typography
          variant="body2"
          sx={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: 'inherit',
            maxWidth: '100%',
            flex: 2
          }}
        >
          {data.value}
        </Typography>
        <CopyToClipboardButton
          data-testid="copyToClipboard"
          disabled={isApiKeyRotated(data)}
          tooltipTitle={t('api-key-copied')}
          value={() => data.value || ''}
        />
      </Stack>
    );
  }
  if (type === 'lastUpdate') {
    return (
      <Typography aria-current="date" sx={{ color: setRowColorByStatus(data) }}>
        {formatDate(data.lastUpdate)}
      </Typography>
    );
  }
  if (type === 'groups') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {data.groups.length > 0 && (
          <>
            <CustomTooltip
              openOnClick={false}
              tooltipContent={
                <Box sx={{ textAlign: 'left' }}>
                  {data.groups.map((v) => (
                    <Box key={`tooltip_${v.id}`} sx={{ fontWeight: 'normal' }}>
                      <strong>Group ID</strong> {v.id}
                    </Box>
                  ))}
                </Box>
              }
            >
              <Box>
                <CustomTagGroup visibleItems={3} disableTooltip>
                  {data.groups.map((v, i) => (
                    <Box key={i} sx={{ my: 1 }}>
                      <Tag value={v.name} />
                    </Box>
                  ))}
                </CustomTagGroup>
              </Box>
            </CustomTooltip>
            <CopyToClipboardButton
              data-testid="copyToClipboardGroupsId"
              tooltipTitle={t('groups-id-copied')}
              value={() => data.groups.map((g) => g.id).join(',') || ''}
            />
          </>
        )}
      </Box>
    );
  }
  if (type === 'status') {
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
  if (type === 'contextMenu') {
    return <ApiKeyContextMenu data={data} handleModalClick={handleModalClick} />;
  }

  return <></>;
};

export default ApiKeyDataSwitch;
