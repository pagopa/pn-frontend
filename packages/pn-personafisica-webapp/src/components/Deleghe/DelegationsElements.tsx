import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Button, IconButton, Menu as MUIMenu, MenuItem, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { CustomTagGroup, useIsMobile } from '@pagopa-pn/pn-commons';
import { Tag } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { openAcceptModal, openRevocationModal } from '../../redux/delegation/reducers';
import { useAppDispatch } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';

export const Menu = (props: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['deleghe']);

  const handleOpenModalClick = () => {
    dispatch(openRevocationModal({ id: props.id, type: props.menuType }));
    setAnchorEl(null);
  };

  const handleOpenVerificationCodeModal = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_SHOW_MANDATE_CODE);
    props.setCodeModal({ open: true, name: props.name, code: props.verificationCode });
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
        <MenuItem
          id="show-code-button"
          key="showCode"
          onClick={handleOpenVerificationCodeModal}
          data-testid="menuItem-showCode"
        >
          {t('deleghe.show')}
        </MenuItem>,
        <MenuItem
          id="revoke-delegation-button"
          key="revoke"
          onClick={handleOpenModalClick}
          data-testid="menuItem-revokeDelegate"
        >
          {t('deleghe.revoke')}
        </MenuItem>,
      ];
    }
    return [
      <MenuItem
        id="reject-delegation-button"
        key="reject"
        onClick={handleOpenModalClick}
        data-testid="menuItem-rejectDelegator"
      >
        {t('deleghe.reject')}
      </MenuItem>,
    ];
  };

  return (
    <>
      <IconButton
        id={`delegation-menu-icon-${props.id}`}
        onClick={handleClick}
        data-testid="delegationMenuIcon"
        aria-label={t('deleghe.table.menu-aria-label')}
      >
        <MoreVertIcon fontSize={'small'} />
      </IconButton>
      <MUIMenu
        id={`delegation-menu-${props.id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        data-testid="delegationMenu"
      >
        {getMenuItemElements()}
      </MUIMenu>
    </>
  );
};

export const OrganizationsList = (props: {
  organizations: Array<string>;
  textVariant?: Variant;
  visibleItems?: number;
}) => {
  const { t } = useTranslation(['deleghe']);
  const isMobile = useIsMobile();
  return (
    <>
      {props.organizations.length === 0 ? (
        <Typography variant={props.textVariant || 'inherit'}>
          {t('deleghe.table.allNotifications')}
        </Typography>
      ) : (
        <Box sx={{ minWidth: isMobile ? '' : '35rem', maxWidth: '60rem' }}>
          <Typography variant={props.textVariant || 'inherit'} mb={2}>
            {t('deleghe.table.notificationsFrom')}
          </Typography>
          <CustomTagGroup visibleItems={props.visibleItems}>
            {props.organizations.map((organization) => (
              <Box
                sx={{
                  mb: 1,
                  mr: 1,
                  display: 'inline-block',
                }}
                key={organization}
              >
                <Tag value={organization} sx={{ whiteSpace: 'normal' }} />
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
    <Button
      id="accept-button"
      onClick={handleAcceptClick}
      variant={'contained'}
      color={'primary'}
      data-testid="acceptButton"
    >
      {t('deleghe.accept')}
    </Button>
  );
};
