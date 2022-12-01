import { Fragment, useState, MouseEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Tag, TagGroup } from '@pagopa/mui-italia';
import { MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import {
  Column,
  Item,
  ItemsTable,
  StatusTooltip,
  EmptyState,
  CopyToClipboard,
  formatDate,
} from '@pagopa-pn/pn-commons';
import { ApiKey, ApiKeyColumn, ApiKeyStatus, ApiKeyStatusHistory, modalApiKeyView } from '../../../models/ApiKeys';
import { getApiKeyStatusInfos } from '../../../utils/apikeys.utility';
import * as routes from '../../../navigation/routes.const';

type Props = {
  apiKeys: Array<ApiKey>;
  handleModalClick: (view: modalApiKeyView, apiKeyId: number) => void;
};

const DesktopApiKeys = ({
  apiKeys,
  handleModalClick,
}: Props) => {
  const { t } = useTranslation(['apikeys']);
  const handleEventTrackingTooltip = () => undefined;
  const navigate = useNavigate();
  const [rows, setRows] = useState<Array<Item>>([]);
  const [tableKey, setTableKey] = useState(0);
  type ApiKeyContextMenuProps = {
    row: Item;
  };

  const ApiKeyContextMenu = ({ row }: ApiKeyContextMenuProps) => {
    const apiKeyId = Number(row.id);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
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
            aria-label="context menu"
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
          {row.status !== ApiKeyStatus.ROTATED && <MenuItem data-testid="buttonView" onClick={() => handleModalClick(modalApiKeyView.VIEW, apiKeyId)}>{t('context-menu.view')}</MenuItem>}
          {(row.status !== ApiKeyStatus.ROTATED && row.status !== ApiKeyStatus.BLOCKED) && <MenuItem data-testid="buttonRotate" onClick={() => handleModalClick(modalApiKeyView.ROTATE, apiKeyId)}>{t('context-menu.rotate')}</MenuItem>}
          {(row.status === ApiKeyStatus.ENABLED || row.status === ApiKeyStatus.ROTATED) && <MenuItem data-testid="buttonBlock" onClick={() => handleModalClick(modalApiKeyView.BLOCK, apiKeyId)}>{t('context-menu.block')}</MenuItem>}
          {row.status === ApiKeyStatus.BLOCKED && <MenuItem data-testid="buttonDelete" onClick={() => handleModalClick(modalApiKeyView.DELETE, apiKeyId)}>{t('context-menu.delete')}</MenuItem>}
          {row.status === ApiKeyStatus.BLOCKED && <MenuItem data-testid="buttonEnable" onClick={() => handleModalClick(modalApiKeyView.ENABLE, apiKeyId)}>{t('context-menu.enable')}</MenuItem>}
        </Menu>
      </Box>
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
              data-testid="copyToClipboard"
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
      id: 'lastUpdate',
      label: t('table.last-update'),
      width: '15%',
      getCellLabel(value: string, row: Item) {
        return (
          <Typography sx={{ color: row.status === ApiKeyStatus.ROTATED ? '#aaa' : undefined }}>
            {formatDate(value)}
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

  useEffect(() => {
    const rowsMap: Array<Item> = apiKeys.map((n: ApiKey, index) => ({
      ...n,
      id: index.toString(),
    }));
    setRows(rowsMap);
    setTableKey(tableKey + 1); // This is needed to make ItemsTable to properly update itself.
  }, [apiKeys]);

  return (
    <Fragment>
      {apiKeys && (
        <Fragment>
          {apiKeys.length > 0 ? (
            <ItemsTable key={tableKey} data-testid="tableApiKeys" columns={columns} rows={rows} />
          ) : (
            <EmptyState
              data-testid="emptyState"
              emptyMessage={t('empty-message')}
              emptyActionLabel={t('empty-action-label')}
              emptyActionCallback={() => navigate(routes.NUOVA_API_KEY)}
            />
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default DesktopApiKeys;
