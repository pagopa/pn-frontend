import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Menu as MUIMenu, MenuItem, Box, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  AppResponse,
  AppResponsePublisher,
  CustomTagGroup,
  Item,
  appStateActions,
} from '@pagopa-pn/pn-commons';
import { Tag } from '@pagopa/mui-italia';

import { useAppDispatch } from '../../redux/hooks';
import { openRevocationModal } from '../../redux/delegation/reducers';
import { acceptDelegation } from '../../redux/delegation/actions';
import { getSidemenuInformation } from '../../redux/sidemenu/actions';
import { trackEventByType } from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';
import { ServerResponseErrorCode } from '../../utils/AppError/types';
import { DelegationStatus } from '../../models/Deleghe';
import AcceptDelegationModal from './AcceptDelegationModal';

export const Menu: React.FC<{
  menuType: 'delegates' | 'delegators';
  id: string;
  name?: string;
  verificationCode?: string;
  row?: Item;
  setCodeModal?: (props: { open: boolean; name: string; code: string }) => void;
}> = ({ menuType, id, name, verificationCode, row, setCodeModal }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [updateOpen, setUpdateOpen] = useState(false);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['deleghe']);

  const handleOpenModalClick = () => {
    if (menuType === 'delegates') {
      trackEventByType(TrackEventType.DELEGATION_DELEGATE_REVOKE);
    } else {
      trackEventByType(TrackEventType.DELEGATION_DELEGATOR_REJECT);
    }
    dispatch(openRevocationModal({ id, type: menuType }));
    setAnchorEl(null);
  };

  const handleOpenVerificationCodeModal = () => {
    if (setCodeModal && name && verificationCode) {
      setCodeModal({ open: true, name, code: verificationCode });
      setAnchorEl(null);
      trackEventByType(TrackEventType.DELEGATION_DELEGATE_VIEW_CODE);
    }
  };

  const handleCloseAcceptModal = () => {
    setUpdateOpen(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getMenuItemElements = () => {
    if (menuType === 'delegates') {
      return [
        <MenuItem key="showCode" onClick={handleOpenVerificationCodeModal}>
          {t('deleghe.show')}
        </MenuItem>,
        <MenuItem key="revoke" onClick={handleOpenModalClick}>
          {t('deleghe.revoke')}
        </MenuItem>,
      ];
    }
    const menuItems = [
      <MenuItem key="reject" onClick={handleOpenModalClick}>
        {t('deleghe.reject')}
      </MenuItem>,
    ];

    if (row?.status === DelegationStatus.ACTIVE) {
      // eslint-disable-next-line functional/immutable-data
      menuItems.push(
        <MenuItem key="update" onClick={() => setUpdateOpen(true)}>
          {t('deleghe.update')}
        </MenuItem>
      );
    }

    return menuItems;
  };

  return (
    <>
      {menuType === 'delegators' && row?.status === DelegationStatus.ACTIVE && (
        <AcceptDelegationModal
          isEditMode
          name={name || ''}
          open={updateOpen}
          currentGroups={row?.groups as Array<{ id: string; name: string }>}
          handleCloseAcceptModal={handleCloseAcceptModal}
          handleConfirm={() => {}}
        />
      )}
      <IconButton
        onClick={handleClick}
        data-testid="delegationMenuIcon"
        aria-label="menu-aria-label"
      >
        <MoreVertIcon fontSize={'small'} />
      </IconButton>
      <MUIMenu anchorEl={anchorEl} open={open} onClose={handleClose} data-testid="delegationMenu">
        {getMenuItemElements()}
      </MUIMenu>
    </>
  );
};

export const OrganizationsList: React.FC<{
  organizations: Array<string>;
  textVariant?: Variant;
  visibleItems?: number;
}> = ({ organizations, textVariant, visibleItems }) => {
  const { t } = useTranslation(['deleghe']);
  return (
    <>
      {organizations.length === 0 ? (
        <Typography variant={textVariant || 'inherit'}>
          {t('deleghe.table.allNotifications')}
        </Typography>
      ) : (
        <Box>
          <Typography variant={textVariant || 'inherit'} mb={2}>
            {t('deleghe.table.notificationsFrom')}
          </Typography>
          <CustomTagGroup visibleItems={visibleItems}>
            {organizations.map((organization) => (
              <Box sx={{ mb: 1, mr: 1, display: 'inline-block' }} key={organization}>
                <Tag value={organization} />
              </Box>
            ))}
          </CustomTagGroup>
        </Box>
      )}
    </>
  );
};

export const AcceptButton: React.FC<{ id: string; name: string }> = ({ id, name }) => {
  const { t } = useTranslation(['deleghe']);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleAcceptClick = () => {
    setOpen(true);
  };

  const handleCloseAcceptModal = () => {
    setOpen(false);
  };

  const handleConfirm = (code: Array<string>, groups: Array<{ id: string; name: string }>) => {
    void dispatch(acceptDelegation({ id, code: code.join(''), groups }))
      .unwrap()
      .then(async () => {
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('deleghe.accepted-successfully'),
          })
        );
        await dispatch(getSidemenuInformation());
      });
  };

  const handleAcceptanceError = useCallback((responseError: AppResponse) => {
    if (Array.isArray(responseError.errors)) {
      const managedErrors = (
        Object.keys(ServerResponseErrorCode) as Array<keyof typeof ServerResponseErrorCode>
      ).map((key) => ServerResponseErrorCode[key]);
      const error = responseError.errors[0];
      if (!managedErrors.includes(error.code as ServerResponseErrorCode)) {
        dispatch(appStateActions.addError({ title: '', message: t('deleghe.accepted-error') }));
        return false;
      }
      return true;
    }
    return true;
  }, []);

  useEffect(() => {
    AppResponsePublisher.error.subscribe('acceptDelegation', handleAcceptanceError);

    return () => {
      AppResponsePublisher.error.unsubscribe('acceptDelegation', handleAcceptanceError);
    };
  }, [handleAcceptanceError]);

  return (
    <>
      <AcceptDelegationModal
        isEditMode={false}
        name={name}
        open={open}
        handleCloseAcceptModal={handleCloseAcceptModal}
        handleConfirm={handleConfirm}
      />
      <Button
        onClick={handleAcceptClick}
        variant={'contained'}
        color={'primary'}
        data-testid="acceptButton"
        size="small"
      >
        {t('deleghe.accept')}
      </Button>
    </>
  );
};
