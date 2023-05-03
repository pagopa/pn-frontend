import { Fragment, useState, MouseEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyToClipboardButton } from '@pagopa/mui-italia';
import { Box, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import {
  Column,
  Item,
  ItemsTable,
  StatusTooltip,
  EmptyState,
  formatDate,
  CustomTagGroup,
  CustomTooltip,
} from '@pagopa-pn/pn-commons';
import { Tag } from '@pagopa/mui-italia';
import {
  ApiKeyColumn,
  ApiKey,
  ApiKeyStatus,
  ApiKeyStatusHistory,
  ModalApiKeyView,
} from '../../../models/ApiKeys';
import { getApiKeyStatusInfos } from '../../../utils/apikeys.utility';
import * as routes from '../../../navigation/routes.const';
import { UserGroup } from '../../../models/user';

type Props = {
  apiKeys: Array<ApiKey>;
  handleModalClick: (view: ModalApiKeyView, apiKeyId: number) => void;
};

const DesktopApiKeys = ({ apiKeys, handleModalClick }: Props) => {
  const { t } = useTranslation(['apikeys']);
  const handleEventTrackingTooltip = () => undefined;
  const navigate = useNavigate();
  const [rows, setRows] = useState<Array<Item>>([]);
  const [tableKey, setTableKey] = useState(0);
  type ApiKeyContextMenuProps = {
    row: Item;
  };

  /**
   * Checks if status history of a api key contains a status set as ROTATED
   * @param apiKeyIdx index of ApiKey array
   * @returns true if the api key history contains status ROTATED, otherwise false
   */
  const isApiKeyRotated = (apiKeyIdx: number): boolean => {
    const currentApiKey = rows[apiKeyIdx] as any as ApiKey;
    return (
      currentApiKey.statusHistory &&
      !!currentApiKey.statusHistory.find((status) => status.status === ApiKeyStatus.ROTATED)
    );
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
          {row.status !== ApiKeyStatus.ROTATED && (
            <MenuItem
              data-testid="buttonView"
              onClick={() => handleModalClick(ModalApiKeyView.VIEW, apiKeyId)}
            >
              {t('context-menu.view')}
            </MenuItem>
          )}
          {row.status !== ApiKeyStatus.ROTATED && row.status !== ApiKeyStatus.BLOCKED && (
            <MenuItem
              data-testid="buttonRotate"
              onClick={() => handleModalClick(ModalApiKeyView.ROTATE, apiKeyId)}
            >
              {t('context-menu.rotate')}
            </MenuItem>
          )}
          {(row.status === ApiKeyStatus.ENABLED || row.status === ApiKeyStatus.ROTATED) && (
            <MenuItem
              data-testid="buttonBlock"
              onClick={() => handleModalClick(ModalApiKeyView.BLOCK, apiKeyId)}
            >
              {t('context-menu.block')}
            </MenuItem>
          )}
          {row.status === ApiKeyStatus.BLOCKED && (
            <MenuItem
              data-testid="buttonDelete"
              onClick={() => handleModalClick(ModalApiKeyView.DELETE, apiKeyId)}
            >
              {t('context-menu.delete')}
            </MenuItem>
          )}
          {row.status === ApiKeyStatus.BLOCKED && !isApiKeyRotated(apiKeyId) && (
            <MenuItem
              data-testid="buttonEnable"
              onClick={() => handleModalClick(ModalApiKeyView.ENABLE, apiKeyId)}
            >
              {t('context-menu.enable')}
            </MenuItem>
          )}
          <MenuItem
            data-testid="buttonViewGroupsId"
            onClick={() => handleModalClick(ModalApiKeyView.VIEW_GROUPS_ID, apiKeyId)}
          >
            {t('context-menu.view-groups-id')}
          </MenuItem>
        </Menu>
      </Box>
    );
  };

  const setRowColorByStatus = (rowId: number): string | undefined =>
    isApiKeyRotated(Number(rowId)) ? '#aaa' : undefined;

  const columns: Array<Column<ApiKeyColumn>> = [
    {
      id: 'name',
      label: t('table.name'),
      width: '30%',
      sortable: false,
      getCellLabel(value: string, row: Item) {
        return (
          <Typography
            sx={{
              color: setRowColorByStatus(Number(row.id)),
            }}
          >
            {value}
          </Typography>
        );
      },
    },
    {
      id: 'value',
      label: t('table.api-key'),
      width: '25%',
      sortable: false,
      getCellLabel(value: string, row: Item) {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              userSelect: 'none',
              color: setRowColorByStatus(Number(row.id)),
            }}
          >
            {`${value.substring(0, 10)}...`}
            <CopyToClipboardButton
              data-testid="copyToClipboard"
              disabled={isApiKeyRotated(Number(row.id))}
              tooltipTitle={t('api-key-copied')}
              value={() => value || ''}
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
          <Typography aria-current="date" sx={{ color: setRowColorByStatus(Number(row.id)) }}>
            {formatDate(value)}
          </Typography>
        );
      },
    },
    {
      id: 'groups',
      label: t('table.groups'),
      width: '15%',
      getCellLabel(value: Array<UserGroup>) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CustomTooltip
              openOnClick={false}
              tooltipContent={
                <Box sx={{ textAlign: 'left' }}>
                  {value.map((v) => (
                    <Box key={`tooltip_${v.id}`} sx={{ fontWeight: 'normal' }}>
                      <strong>Group ID</strong> {v.id}
                    </Box>
                  ))}
                </Box>
              }
            >
              <Box>
                <CustomTagGroup visibleItems={3} disableTooltip>
                  {value.map((v, i) => (
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
              value={() => value.map((g) => g.id).join(',') || ''}
            />
          </Box>
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
              justifyContent: 'center',
            }}
          >
            <StatusTooltip
              label={label}
              tooltip={tooltip}
              color={color}
              eventTrackingCallback={handleEventTrackingTooltip}
            />
          </Box>
        );
      },
    },
    {
      id: 'contextMenu',
      label: '',
      width: '5%',
      align: 'left',
      sortable: false,
      getCellLabel(_value: string, row: Item) {
        return <ApiKeyContextMenu row={row} />;
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
            <ItemsTable
              key={tableKey}
              data-testid="tableApiKeys"
              columns={columns}
              rows={rows}
              ariaTitle={t('table.title')}
            />
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
