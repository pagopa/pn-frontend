import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  IconButton,
  Menu as MUIMenu,
  MenuItem,
  Box,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { useAppDispatch } from '../../redux/hooks';
import { openAcceptModal, openRevocationModal } from '../../redux/delegation/reducers';
import { trackEventByType } from "../../utils/mixpanel";
import { TrackEventType } from "../../utils/events";

export const Menu = (props: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['deleghe']);

  const handleOpenModalClick = () => {
    if (props.menuType === 'delegates') {
      trackEventByType(TrackEventType.DELEGATION_DELEGATE_REVOKE);
    } else {
      trackEventByType(TrackEventType.DELEGATION_DELEGATOR_REJECT);
    }
    dispatch(openRevocationModal({ id: props.id, type: props.menuType }));
    setAnchorEl(null);
  };

  const handleOpenVerificationCodeModal = () => {
    props.setCodeModal({ open: true, name: props.name, code: props.verificationCode });
    setAnchorEl(null);
    trackEventByType(TrackEventType.DELEGATION_DELEGATE_VIEW_CODE);
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
        <MenuItem key="showCode" onClick={handleOpenVerificationCodeModal}>
          {t('deleghe.show')}
        </MenuItem>,
        <MenuItem key="revoke" onClick={handleOpenModalClick}>
          {t('deleghe.revoke')}
        </MenuItem>,
      ];
    } else {
      return [
        <MenuItem key="reject" onClick={handleOpenModalClick}>
          {t('deleghe.reject')}
        </MenuItem>,
      ];
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        data-testid="delegationMenuIcon"
        aria-label="Delegation Menu Icon"
      >
        <MoreVertIcon fontSize={'small'} />
      </IconButton>
      <MUIMenu anchorEl={anchorEl} open={open} onClose={handleClose} data-testid="delegationMenu">
        {getMenuItemElements()}
      </MUIMenu>
    </>
  );
};

export const OrganizationsList = (props: {
  organizations: Array<string>;
  textVariant?: Variant;
}) => {
  const { t } = useTranslation(['deleghe']);
  return (
    <>
      {props.organizations.length === 0 ? (
        <Typography variant={props.textVariant || 'inherit'}>{t('deleghe.table.allNotifications')}</Typography>
      ) : (
        <Box>
          <Typography variant={props.textVariant || 'inherit'}>
            {t('deleghe.table.notificationsFrom')}
          </Typography>
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
                <Typography variant={props.textVariant || 'inherit'}>{organization}</Typography>
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
      {t('deleghe.accept')}
    </Button>
  );
};
