import React, { useState } from 'react';
import {
  Button,
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
import { openAcceptModal, openRevocationModal } from '../../redux/delegation/actions';

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
            {props.organizations.map((organization) => (
              <ListItem
                key={organization}
                sx={{ display: 'revert', paddingLeft: 0, marginLeft: 3, fontWeight: '500' }}
              >
                {organization}
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </>
  );
};

export const AcceptButton = ({ id, name }: { id: string; name: string }) => {
  const { t } = useTranslation(['deleghe']);
  const dispatch = useAppDispatch();
  const handleAcceptClick = () => {
    void dispatch(openAcceptModal({ id, name }));
  };

  return (
    <Button onClick={handleAcceptClick} variant={'contained'} color={'primary'}>
      {t('Accetta')}
    </Button>
  );
};
