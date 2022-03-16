import { Column } from '@pagopa-pn/pn-commons';
import { Button, Chip, IconButton, Typography, Menu as MUIMenu, MenuItem } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useState } from 'react';

import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../../utils/status.utility';
import { useAppDispatch } from '../../../redux/hooks';
import { openRevocationModal } from '../../../redux/delegation/actions';

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
      return (
        <>
          {value.length > 0 ? (
            <>
              <span>Notifiche da:</span>
              <ul style={{ margin: 0, paddingLeft: '24px' }}>
                {value.map((e, i) => (
                  <li key={i} style={{ listStyleType: 'square', fontWeight: 'bold' }}>
                    {e}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Typography>Tutte le notifiche</Typography>
          )}
        </>
      );
    },
  },
];

const Menu = (props: any) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();

  const handleRevokeClick = () => {
    dispatch(openRevocationModal(props.id));
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getMenuItemElements = () => {
    if (props.menuType === 'delegates') {
      return (
        <>
          <MenuItem onClick={handleClose}>Mostra Codice {props.id}</MenuItem>
          {/*
            <MenuItem onClick={handleClose}>Modifica</MenuItem>
          */}
          <MenuItem onClick={handleRevokeClick}>Revoca</MenuItem>
        </>
      );
    } else {
      return (
        <>
          <MenuItem onClick={handleClose}>Rifiuta</MenuItem>
        </>
      );
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
    getCellLabel(value: string) {
      const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
      if (value === DelegationStatus.ACTIVE) {
        return <Chip label={label} color={color} />;
      } else {
        return (
          <Button variant={'contained'} color={'primary'}>
            Accetta
          </Button>
        );
      }
    },
  },
  {
    id: 'actionsMenu',
    label: '',
    width: '5%',
    getCellLabel() {
      return <Menu menuType={'delegators'} />;
    },
  },
];
