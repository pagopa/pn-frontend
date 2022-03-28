import React, { useState } from 'react';
import { Column, Row } from '@pagopa-pn/pn-commons';
import {
  Button,
  Chip,
  IconButton,
  Typography,
  Menu as MUIMenu,
  MenuItem,
  Box,
  List,
  ListItem,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../redux/hooks';
import { acceptDelegation, openRevocationModal } from '../../redux/delegation/actions';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';

const delegationsColumns: Array<Column> = [
  {
    id: 'name',
    label: 'Nome',
    width: '13%',
    sortable: true,
    getCellLabel(value: string) {
      return <b>{value}</b>;
    },
  },
  {
    id: 'email',
    label: 'Email',
    width: '18%',
    sortable: true,
    getCellLabel(value: string) {
      return value;
    },
  },
  {
    id: 'startDate',
    label: 'Inizio Delega',
    width: '11%',
    getCellLabel(value: string) {
      return value;
    },
  },
  {
    id: 'endDate',
    label: 'Fine Delega',
    width: '11%',
    getCellLabel(value: string) {
      return value;
    },
  },
  {
    id: 'visibilityIds',
    label: 'Permessi per vedere',
    width: '14%',
    getCellLabel(value: Array<string>) {
      return <OrganizationsList organizations={value} />;
    },
  },
];

export const Menu = (props: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['deleghe']);

  const handleOpenModalClick = () => {
    dispatch(openRevocationModal({ id: props.id, type: props.menuType }));
    setAnchorEl(null);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getMenuItemElements = () => {
    if (props.menuType === 'delegates') {
      return [
        <MenuItem key="showCode" onClick={handleClose}>
          {t('Mostra Codice')}
        </MenuItem>,
        <MenuItem key="revoke" onClick={handleOpenModalClick}>
          {t('Revoca')}
        </MenuItem>,
      ];
    } else {
      return [
        <MenuItem key="reject" onClick={handleOpenModalClick}>
          {t('Rifiuta')}
        </MenuItem>,
      ];
    }
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVert fontSize={'small'} />
      </IconButton>
      <MUIMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {getMenuItemElements()}
      </MUIMenu>
    </>
  );
};

export const OrganizationsList = (props: { organizations: Array<string> }) => {
  const { t } = useTranslation(['deleghe']);
  return (
    <>
      {props.organizations.length === 0 ? (
        <Typography>{t('deleghe.table.allNotifications')}</Typography>
      ) : (
        <Box>
          <Typography>{t('deleghe.table.notificationsFrom')}</Typography>
          <List
            sx={{
              padding: 0,
              display: 'revert',
              listStyle: 'square',
            }}
          >
            {props.organizations.map((e) => (
              <ListItem
                key={e}
                sx={{ display: 'revert', paddingLeft: 0, marginLeft: 3, fontWeight: '500' }}
              >
                {e}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </>
  );
};

export const AcceptButton = ({ id }: { id: string }) => {
  const { t } = useTranslation(['deleghe']);
  const dispatch = useAppDispatch();
  const handleAcceptClick = () => {
    void dispatch(acceptDelegation(id));
  };

  return (
    <Button onClick={handleAcceptClick} variant={'contained'} color={'primary'}>
      {t('Accetta')}
    </Button>
  );
};

export const delegatesColumns = [
  ...delegationsColumns,
  {
    id: 'status',
    label: 'Stato',
    width: '18%',
    align: 'center' as const,
    getCellLabel(value: string) {
      const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
      return <Chip label={label} color={color} />;
    },
  },
  {
    id: 'id',
    label: '',
    width: '5%',
    getCellLabel(value: string) {
      return <Menu menuType={'delegates'} id={value} />;
    },
  },
];

export const delegatorsColumns = [
  ...delegationsColumns,
  {
    id: 'status',
    label: 'Stato',
    width: '18%',
    align: 'center' as const,
    getCellLabel(value: string, row: Row) {
      const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
      if (value === DelegationStatus.ACTIVE) {
        return <Chip label={label} color={color} />;
      } else {
        return <AcceptButton id={row.id} />;
      }
    },
  },
  {
    id: 'id',
    label: '',
    width: '5%',
    getCellLabel(value: string) {
      return <Menu menuType={'delegators'} id={value} />;
    },
  },
];
