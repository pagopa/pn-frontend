import React, { Dispatch, useCallback, useEffect, useState } from 'react';
import { AnyAction } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Menu as MUIMenu, MenuItem, Box, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  AppResponse,
  AppResponsePublisher,
  CodeModal,
  CustomTagGroup,
  Item,
  appStateActions,
} from '@pagopa-pn/pn-commons';
import { Tag } from '@pagopa/mui-italia';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  acceptDelegation,
  rejectDelegation,
  revokeDelegation,
  updateDelegation,
} from '../../redux/delegation/actions';
import { User } from '../../redux/auth/types';
import { RootState } from '../../redux/store';
import { trackEventByType } from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';
import { ServerResponseErrorCode } from '../../utils/AppError/types';
import { DelegationStatus } from '../../models/Deleghe';
import AcceptDelegationModal from './AcceptDelegationModal';
import ConfirmationModal from './ConfirmationModal';

function handleCustomGenericError(
  responseError: AppResponse,
  message: string,
  dispatch: Dispatch<AnyAction>
) {
  if (Array.isArray(responseError.errors)) {
    const managedErrors = (
      Object.keys(ServerResponseErrorCode) as Array<keyof typeof ServerResponseErrorCode>
    ).map((key) => ServerResponseErrorCode[key]);
    const error = responseError.errors[0];
    if (!managedErrors.includes(error.code as ServerResponseErrorCode)) {
      dispatch(appStateActions.addError({ title: '', message }));
      return false;
    }
    return true;
  }
  return true;
}

type Props = {
  menuType: 'delegates' | 'delegators';
  id: string;
  userLogged?: User;
  row?: Item;
  onAction?: (data: any) => void;
};
export const Menu: React.FC<Props> = ({ menuType, id, userLogged, row, onAction }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['deleghe']);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const groups = useAppSelector((state: RootState) => state.delegationsState.groups);

  const titleModal =
    menuType === 'delegates'
      ? t('deleghe.revocation_question', { delegate: row?.name })
      : t('deleghe.rejection_question', { delegator: row?.name });
  const subtitleModal =
    menuType === 'delegates'
      ? t('deleghe.subtitle_revocation', { recipient: userLogged?.organization.name })
      : t('deleghe.subtitle_rejection', { delegator: row?.name });
  const confirmLabel =
    menuType === 'delegates' ? t('deleghe.confirm_revocation') : t('deleghe.confirm_rejection');

  const handleOpenModalClick = () => {
    const eventToTrack =
      menuType === 'delegates'
        ? TrackEventType.DELEGATION_DELEGATE_REVOKE
        : TrackEventType.DELEGATION_DELEGATOR_REJECT;
    trackEventByType(eventToTrack);
    setShowConfirmationModal(true);
    setAnchorEl(null);
  };

  const handleOpenVerificationCodeModal = () => {
    if (row?.name && row?.verificationCode) {
      setShowCodeModal(true);
      setAnchorEl(null);
      trackEventByType(TrackEventType.DELEGATION_DELEGATE_VIEW_CODE);
    }
  };

  const handleCloseAcceptModal = () => {
    setShowUpdateModal(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleConfirmClick = () => {
    const actionToDispatch = menuType === 'delegates' ? revokeDelegation : rejectDelegation;
    const message =
      menuType === 'delegates'
        ? t('deleghe.revoke-successfully')
        : t('deleghe.reject-successfully');

    void dispatch(actionToDispatch(id))
      .unwrap()
      .then(async () => {
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message,
          })
        );
        if (onAction) {
          onAction(id);
        }
      });
    onCloseModal();
  };

  const handleUpdateError = useCallback(
    (responseError: AppResponse) =>
      handleCustomGenericError(responseError, t('deleghe.update-error'), dispatch),
    []
  );

  const handleConfirmationError = useCallback((responseError: AppResponse) => {
    const message =
      menuType === 'delegates' ? t('deleghe.revoke-error') : t('deleghe.reject-error');
    return handleCustomGenericError(responseError, message, dispatch);
  }, []);

  const handleUpdate = (_code: Array<string>, groups: Array<{ id: string; name: string }>) => {
    void dispatch(updateDelegation({ id, groups }))
      .unwrap()
      .then(() => {
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('deleghe.updated-successfully'),
          })
        );
        if (onAction) {
          onAction(groups);
        }
      });
  };

  useEffect(() => {
    const action = menuType === 'delegates' ? 'revokeDelegation' : 'rejectDelegation';
    AppResponsePublisher.error.subscribe(action, handleConfirmationError);
    if (menuType === 'delegators' && groups.length) {
      AppResponsePublisher.error.subscribe('updateDelegation', handleUpdateError);
    }

    return () => {
      AppResponsePublisher.error.unsubscribe(action, handleConfirmationError);
      if (menuType === 'delegators' && groups.length) {
        AppResponsePublisher.error.unsubscribe('updateDelegation', handleUpdateError);
      }
    };
  }, [handleConfirmationError]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onCloseModal = () => {
    setShowConfirmationModal(false);
  };

  const handleCloseShowCodeModal = () => {
    setShowCodeModal(false);
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

    if (row?.status === DelegationStatus.ACTIVE && groups.length) {
      // eslint-disable-next-line functional/immutable-data
      menuItems.push(
        <MenuItem key="update" onClick={() => setShowUpdateModal(true)}>
          {t('deleghe.update')}
        </MenuItem>
      );
    }

    return menuItems;
  };

  const name = (row?.name as string) || '';

  return (
    <>
      <ConfirmationModal
        open={showConfirmationModal}
        title={titleModal}
        subtitle={subtitleModal}
        onConfirm={handleConfirmClick}
        onConfirmLabel={confirmLabel}
        onClose={onCloseModal}
        onCloseLabel={t('button.annulla', { ns: 'common' })}
      />
      {menuType === 'delegators' &&
        row?.status === DelegationStatus.ACTIVE &&
        groups.length > 0 && (
          <AcceptDelegationModal
            isEditMode
            name={name}
            open={showUpdateModal}
            currentGroups={row?.groups as Array<{ id: string; name: string }>}
            handleCloseAcceptModal={handleCloseAcceptModal}
            handleConfirm={handleUpdate}
          />
        )}
      {row?.verificationCode && menuType === 'delegates' && (
        <CodeModal
          title={t('deleghe.show_code_title', { name })}
          subtitle={t('deleghe.show_code_subtitle')}
          open={showCodeModal}
          initialValues={(row?.verificationCode as string).split('')}
          cancelCallback={handleCloseShowCodeModal}
          cancelLabel={t('deleghe.close')}
          codeSectionTitle={t('deleghe.verification_code')}
          isReadOnly
        />
      )}

      <IconButton
        onClick={handleClick}
        data-testid="delegationMenuIcon"
        aria-label="menu-aria-label"
      >
        <MoreVertIcon fontSize={'small'} />
      </IconButton>
      <MUIMenu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        data-testid="delegationMenu"
      >
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

export const AcceptButton: React.FC<{ id: string; name: string; onAccept: () => void }> = ({
  id,
  name,
  onAccept,
}) => {
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
        onAccept();
      });
  };

  const handleAcceptanceError = useCallback(
    (responseError: AppResponse) =>
      handleCustomGenericError(responseError, t('deleghe.accepted-error'), dispatch),
    []
  );

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
