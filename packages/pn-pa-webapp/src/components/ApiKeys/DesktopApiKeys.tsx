import { MouseEvent, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { MoreVert } from '@mui/icons-material';
import { Box, IconButton, Link, Menu, MenuItem, Typography } from '@mui/material';
import {
  Column,
  CustomTagGroup,
  CustomTooltip,
  EmptyState,
  Item,
  ItemsTable,
  ItemsTableBody,
  ItemsTableBodyCell,
  ItemsTableBodyRow,
  ItemsTableHeader,
  ItemsTableHeaderCell,
  StatusTooltip,
  formatDate,
} from '@pagopa-pn/pn-commons';
import { CopyToClipboardButton, Tag } from '@pagopa/mui-italia';

import {
  ApiKey,
  ApiKeyColumn,
  ApiKeyStatus,
  ApiKeyStatusHistory,
  ModalApiKeyView,
} from '../../models/ApiKeys';
import { UserGroup } from '../../models/user';
import * as routes from '../../navigation/routes.const';
import { getApiKeyStatusInfos } from '../../utility/apikeys.utility';

type Props = {
  apiKeys: Array<ApiKey<UserGroup>>;
  handleModalClick: (view: ModalApiKeyView, apiKeyId: number) => void;
};

const LinkNewApiKey: React.FC = ({ children }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['apikeys']);
  return (
    <Link
      component={'button'}
      id="call-to-action-first"
      aria-label={t('empty-action-label')}
      key="new-api-key"
      data-testid="link-new-api-key"
      onClick={() => navigate(routes.NUOVA_API_KEY)}
    >
      {children}
    </Link>
  );
};

const DesktopApiKeys = ({ apiKeys, handleModalClick }: Props) => {
  const { t } = useTranslation(['apikeys']);
  const handleEventTrackingTooltip = () => undefined;
  type ApiKeyContextMenuProps = {
    row: Item;
  };

  const rows: Array<Item> = apiKeys.map((n: ApiKey<UserGroup>, index) => ({
    ...n,
    id: index.toString(),
  }));

  /**
   * Checks if status history of a api key contains a status set as ROTATED
   * @param apiKeyIdx index of ApiKey array
   * @returns true if the api key history contains status ROTATED, otherwise false
   */
  const isApiKeyRotated = (apiKeyIdx: number): boolean => {
    const currentApiKey = rows[apiKeyIdx] as any as ApiKey<UserGroup>;
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
              id="button-view"
              data-testid="buttonView"
              onClick={() => handleModalClick(ModalApiKeyView.VIEW, apiKeyId)}
            >
              {t('context-menu.view')}
            </MenuItem>
          )}
          {row.status !== ApiKeyStatus.ROTATED && row.status !== ApiKeyStatus.BLOCKED && (
            <MenuItem
              id="button-rotate"
              data-testid="buttonRotate"
              onClick={() => handleModalClick(ModalApiKeyView.ROTATE, apiKeyId)}
            >
              {t('context-menu.rotate')}
            </MenuItem>
          )}
          {(row.status === ApiKeyStatus.ENABLED || row.status === ApiKeyStatus.ROTATED) && (
            <MenuItem
              id="button-block"
              data-testid="buttonBlock"
              onClick={() => handleModalClick(ModalApiKeyView.BLOCK, apiKeyId)}
            >
              {t('context-menu.block')}
            </MenuItem>
          )}
          {row.status === ApiKeyStatus.BLOCKED && (
            <MenuItem
              id="button-delete"
              data-testid="buttonDelete"
              onClick={() => handleModalClick(ModalApiKeyView.DELETE, apiKeyId)}
            >
              {t('context-menu.delete')}
            </MenuItem>
          )}
          {row.status === ApiKeyStatus.BLOCKED && !isApiKeyRotated(apiKeyId) && (
            <MenuItem
              id="button-enable"
              data-testid="buttonEnable"
              onClick={() => handleModalClick(ModalApiKeyView.ENABLE, apiKeyId)}
            >
              {t('context-menu.enable')}
            </MenuItem>
          )}
          <MenuItem
            id="button-view-groups-id"
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
      align: 'left',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string, row: Item) {
        const { label, tooltip, color } = getApiKeyStatusInfos(
          value as ApiKeyStatus,
          row.statusHistory as Array<ApiKeyStatusHistory>
        );
        return (
          <Box
            sx={{
              alignItems: 'left',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <StatusTooltip
              label={t(label)}
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

  return (
    <>
      {apiKeys && apiKeys.length > 0 ? (
        <ItemsTable testId="tableApiKeys" ariaTitle={t('table.title')}>
          <ItemsTableHeader>
            {columns.map((column) => (
              <ItemsTableHeaderCell key={column.id} columnId={column.id} sortable={column.sortable}>
                {column.label}
              </ItemsTableHeaderCell>
            ))}
          </ItemsTableHeader>
          <ItemsTableBody>
            {rows.map((row, index) => (
              <ItemsTableBodyRow key={row.id} index={index}>
                {columns.map((column) => (
                  <ItemsTableBodyCell
                    disableAccessibility={column.disableAccessibility}
                    key={column.id}
                    onClick={column.onClick ? () => column.onClick!(row, column) : undefined}
                    cellProps={{
                      width: column.width,
                      align: column.align,
                      cursor: column.onClick ? 'pointer' : 'auto',
                    }}
                  >
                    {column.getCellLabel(row[column.id as keyof Item], row)}
                  </ItemsTableBodyCell>
                ))}
              </ItemsTableBodyRow>
            ))}
          </ItemsTableBody>
        </ItemsTable>
      ) : (
        <EmptyState data-testid="emptyState">
          <Trans
            ns={'apikeys'}
            i18nKey={'empty-message'}
            components={[<LinkNewApiKey key={'LinkNewApiKey'} />]}
          />
        </EmptyState>
      )}
    </>
  );
};

export default DesktopApiKeys;
