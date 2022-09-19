import { Fragment, useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Tag, TagGroup } from '@pagopa/mui-italia';

import { MoreVert } from '@mui/icons-material';
import {
  ApiKey,
  ApiKeyColumn,
  ApiKeyStatus,
  Column,
  Item,
  ItemsTable,
  StatusTooltip,
  EmptyState,
  getApiKeyStatusInfos,
  CopyToClipboard,
  ApiKeyStatusHistory,
  // GroupsApiKey,
} from '@pagopa-pn/pn-commons';

type Props = {
  apiKeys: Array<ApiKey>;
  handleViewApiKeyClick: (apiKeyId: string) => void;
  handleRotateApiKeyClick: () => void;
  handleToggleBlockApiKeyClick: () => void;
  handleDeleteApiKeyClick: () => void;
};

const DesktopApiKeys = ({
  apiKeys,
  handleViewApiKeyClick,
  handleRotateApiKeyClick,
  handleToggleBlockApiKeyClick,
  handleDeleteApiKeyClick,
}: Props) => {
  const { t } = useTranslation(['apikeys']);
  const handleEventTrackingTooltip = () => undefined;

  type ApiKeyContextMenuProps = {
    row: Item;
  };

  const ApiKeyContextMenu = ({ row }: ApiKeyContextMenuProps) => {
    const apiKeyId = row.id;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <>
        <Box>
          <IconButton
            onClick={handleClick}
            size="small"
            aria-controls={open ? 'context-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MoreVert />
          </IconButton>
        </Box>
        <Menu
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
          {row.status !== ApiKeyStatus.ROTATED && <MenuItem onClick={() => handleViewApiKeyClick(apiKeyId)}>{t('context-menu.view')}</MenuItem>}
          {(row.status !== ApiKeyStatus.ROTATED && row.status !== ApiKeyStatus.BLOCKED) && <MenuItem onClick={handleRotateApiKeyClick}>{t('context-menu.rotate')}</MenuItem>}
          {(row.status === ApiKeyStatus.ENABLED || row.status === ApiKeyStatus.ROTATED) && <MenuItem onClick={handleToggleBlockApiKeyClick}>{t('context-menu.block')}</MenuItem>}
          {row.status === ApiKeyStatus.BLOCKED && <MenuItem onClick={handleDeleteApiKeyClick}>{t('context-menu.delete')}</MenuItem>}
          {row.status === ApiKeyStatus.BLOCKED && <MenuItem onClick={handleToggleBlockApiKeyClick}>{t('context-menu.enable')}</MenuItem>}
        </Menu>
      </>
    );
  };

  const columns: Array<Column<ApiKeyColumn>> = [
    {
      id: 'name',
      label: t('table.name'),
      width: '30%',
      sortable: false,
      getCellLabel(value: string, row: Item) {
        return (
          <Typography sx={{ color: row.status === ApiKeyStatus.ROTATED ? '#aaa' : undefined }}>
            {value}
          </Typography>
        );
      },
    },
    {
      id: 'apiKey',
      label: t('table.api-key'),
      width: '30%',
      sortable: false,
      getCellLabel(value: string, row: Item) {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              userSelect: 'none',
              color: row.status === ApiKeyStatus.ROTATED ? '#aaa' : undefined,
            }}
          >
            {`${value.substring(0, 10)}...`}
            <CopyToClipboard
              disabled={row.status === ApiKeyStatus.ROTATED}
              tooltipMode={true}
              tooltip={t('api-key-copied')}
              getValue={() => value || ''}
            />
          </Box>
        );
      },
    },
    {
      id: 'lastModify',
      label: t('table.last-modify'),
      width: '15%',
      // eslint-disable-next-line sonarjs/no-identical-functions
      getCellLabel(value: string, row: Item) {
        return (
          <Typography sx={{ color: row.status === ApiKeyStatus.ROTATED ? '#aaa' : undefined }}>
            {value}
          </Typography>
        );
      },
    },
    {
      id: 'groups',
      label: t('table.groups'),
      width: '15%',
      getCellLabel(value: Array<string>) {
        return (
          <TagGroup visibleItems={3}>
            {value.map((v) => (
              <Tag key={v} value={v} />
            ))}
          </TagGroup>
        );
      },
    },
    {
      id: 'status',
      label: t('table.status'),
      width: '10%',
      align: 'center',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string, row: Item) {
        const { label, tooltip, color } = getApiKeyStatusInfos(
          value as ApiKeyStatus,
          row.statusHistory as Array<ApiKeyStatusHistory>
        );
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <StatusTooltip
              label={label}
              tooltip={tooltip}
              color={color}
              eventTrackingCallback={handleEventTrackingTooltip}
            ></StatusTooltip>
            <ApiKeyContextMenu row={row} />
          </Box>
        );
      },
    },
  ];

  const rows: Array<Item> = apiKeys.map((n: ApiKey, i: number) => ({
    ...n,
    id: i.toString(),
  }));

  return (
    <Fragment>
      {apiKeys && (
        <Fragment>
          {apiKeys.length > 0 ? (
            <ItemsTable columns={columns} rows={rows} />
          ) : (
            <EmptyState
              emptyMessage={t('empty-message')}
              emptyActionLabel={t('empty-action-label')}
              emptyActionCallback={() => alert('Nuova API Key routing da fare')}
            />
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default DesktopApiKeys;
