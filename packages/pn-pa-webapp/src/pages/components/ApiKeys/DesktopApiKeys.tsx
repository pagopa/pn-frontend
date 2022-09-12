import { Fragment, useState, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';

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
} from '@pagopa-pn/pn-commons';

type Props = {
  apiKeys: Array<ApiKey>;
};

const DesktopApiKeys = ({ apiKeys }: Props) => {
  const { t } = useTranslation(['apikeys']);
  const handleEventTrackingTooltip = () => undefined;

  const ApiKeyContextMenu = () => {
    const handleViewApiKeyClick = () => undefined;
    const handleRotateApiKeyClick = () => undefined;
    const handleBlockApiKeyClick = () => undefined;

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
          <MenuItem onClick={handleViewApiKeyClick}>Visualizza</MenuItem>
          <MenuItem onClick={handleRotateApiKeyClick}>Ruota</MenuItem>
          <MenuItem onClick={handleBlockApiKeyClick}>Blocca</MenuItem>
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
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'apiKey',
      label: t('table.api-key'),
      width: '30%',
      sortable: false,
      getCellLabel(value: string) {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {value}
            <CopyToClipboard getValue={() => value || ''} />
          </Box>
        );
      },
    },
    {
      id: 'lastModify',
      label: t('table.last-modify'),
      width: '14%',
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'groups',
      label: t('table.groups'),
      width: '16%',
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'status',
      label: t('table.status'),
      width: '10%',
      align: 'center',
      sortable: false, // TODO: will be re-enabled in PN-1124
      getCellLabel(value: string) {
        const { label, tooltip, color } = getApiKeyStatusInfos(value as ApiKeyStatus);
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
            <ApiKeyContextMenu />
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
          {apiKeys.length > 0 ? <ItemsTable columns={columns} rows={rows} /> : <EmptyState />}
        </Fragment>
      )}
    </Fragment>
  );
};

export default DesktopApiKeys;
