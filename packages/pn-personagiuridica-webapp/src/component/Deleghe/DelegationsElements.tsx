import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconButton, Menu as MUIMenu, MenuItem, Box, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CodeModal, CustomTagGroup, appStateActions } from '@pagopa-pn/pn-commons';
import { Tag } from '@pagopa/mui-italia';

import { useAppDispatch } from '../../redux/hooks';
import { openAcceptModal } from '../../redux/delegation/reducers';
import { trackEventByType } from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';
import { rejectDelegation, revokeDelegation } from '../../redux/delegation/actions';
import { User } from '../../redux/auth/types';
import { getSidemenuInformation } from '../../redux/sidemenu/actions';
import ConfirmationModal from './ConfirmationModal';

type Props = {
  menuType: 'delegates' | 'delegators';
  id: string;
  name?: string;
  verificationCode?: string;
  width?: string;
  userLogged?: User;
};
export const Menu: React.FC<Props> = ({ menuType, id, name, verificationCode, userLogged }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['deleghe']);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleOpenModalClick = () => {
    if (menuType === 'delegates') {
      trackEventByType(TrackEventType.DELEGATION_DELEGATE_REVOKE);
    } else {
      trackEventByType(TrackEventType.DELEGATION_DELEGATOR_REJECT);
    }
    setShowConfirmationModal(true);
    setAnchorEl(null);
  };

  const handleOpenVerificationCodeModal = () => {
    if (name && verificationCode) {
      setShowCodeModal(true);
      setAnchorEl(null);
      trackEventByType(TrackEventType.DELEGATION_DELEGATE_VIEW_CODE);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleConfirmClick = () => {
    if (menuType === 'delegates') {
      void dispatch(revokeDelegation(id))
        .unwrap()
        .then(async () => {
          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t('deleghe.revoke-successfully'),
            })
          );
        });
    } else {
      void dispatch(rejectDelegation(id))
        .unwrap()
        .then(async () => {
          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t('deleghe.reject-successfully'),
            })
          );
          await dispatch(getSidemenuInformation());
        });
    }
    onCloseModal();
  };

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
    return [
      <MenuItem key="reject" onClick={handleOpenModalClick}>
        {t('deleghe.reject')}
      </MenuItem>,
    ];
  };

  const subtitleModal =
    menuType === 'delegates'
      ? t('deleghe.subtitle_revocation', { recipient: userLogged?.name })
      : t('deleghe.subtitle_rejection', { delegator: name });

  return (
    <>
      <ConfirmationModal
        open={showConfirmationModal}
        title={
          menuType === 'delegates'
            ? t('deleghe.revocation_question', { delegator: name })
            : t('deleghe.rejection_question', { delegator: name })
        }
        subtitle={subtitleModal}
        onConfirm={handleConfirmClick}
        onConfirmLabel={
          menuType === 'delegates'
            ? t('deleghe.confirm_revocation')
            : t('deleghe.confirm_rejection')
        }
        onClose={onCloseModal}
        onCloseLabel={t('button.annulla', { ns: 'common' })}
      />

      {verificationCode && (
        <CodeModal
          title={t('deleghe.show_code_title', { name })}
          subtitle={t('deleghe.show_code_subtitle')}
          open={showCodeModal}
          initialValues={verificationCode.split('')}
          handleClose={handleCloseShowCodeModal}
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
