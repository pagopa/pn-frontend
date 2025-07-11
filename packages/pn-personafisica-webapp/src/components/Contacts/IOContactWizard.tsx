import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Avatar, Button, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import {
  ConfirmationModal,
  IllusAppIoLogo,
  IllusSendLogo,
  appStateActions,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { IOAllowedValues } from '../../models/contacts';
import { disableIOAddress, enableIOAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';

type Props = {
  goToNextStep: () => void;
};

type ModalType = {
  open: boolean;
  exit?: boolean;
};

const IOContactWizard: React.FC<Props> = ({ goToNextStep }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const dispatch = useAppDispatch();

  const [modal, setModal] = useState<ModalType>({ open: false });
  const { defaultAPPIOAddress } = useAppSelector(contactsSelectors.selectAddresses);

  const isIOEnabled = useMemo(
    () => defaultAPPIOAddress && defaultAPPIOAddress.value === IOAllowedValues.ENABLED,
    []
  );

  const sercqSendIoList: Array<string> = t('legal-contacts.sercq-send-wizard.step_2.io-list', {
    defaultValue: [],
    ns: 'recapiti',
  });

  const handleConfirmIOActivation = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_START);
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_CONVERSION);
    dispatch(enableIOAddress())
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_SUCCESS, true);
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('courtesy-contacts.io-added-successfully', { ns: 'recapiti' }),
          })
        );
        goToNextStep();
        setModal({ open: false });
      })
      .catch(() => {});
  };

  const handleConfirmIODeactivation = () => {
    setModal({ open: true });
  };

  const handleIODeactivation = () => {
    dispatch(disableIOAddress())
      .unwrap()
      .then(() => {
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('courtesy-contacts.io-removed-successfully', { ns: 'recapiti' }),
          })
        );
        goToNextStep();
        setModal({ open: false });
      })
      .catch(() => {});
  };

  const handleConfirmationModalDecline = () => {
    goToNextStep();
    setModal({ open: false });
  };

  const handleSkip = () => {
    setModal({ open: true });
  };

  return (
    <>
      <Stack useFlexGap spacing={2} data-testid="ioContactWizard">
        <Typography fontSize="22px" fontWeight={700}>
          {t('legal-contacts.sercq-send-wizard.step_2.title', { ns: 'recapiti' })}
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent={{ xs: 'center', lg: 'flex-start' }}
          data-testid="ioContactIllustration"
        >
          <Avatar variant="rounded" sx={{ bgcolor: '#0B3EE3', width: '36px', height: '36px' }}>
            <IllusAppIoLogo />
          </Avatar>
          <CompareArrowsIcon
            sx={{ width: '24px', height: '24px', mx: 1, color: 'text.secondary' }}
          />
          <Avatar variant="rounded" sx={{ bgcolor: '#0B3EE3', width: '36px', height: '36px' }}>
            <IllusSendLogo />
          </Avatar>
        </Stack>

        <Typography fontSize="16px">
          {t('legal-contacts.sercq-send-wizard.step_2.content', { ns: 'recapiti' })}
        </Typography>

        <List dense sx={{ p: 0, mx: 3, pb: 1, listStyleType: 'square' }}>
          {sercqSendIoList.map((item, index) => (
            <ListItem key={index} sx={{ display: 'list-item' }} disablePadding>
              <ListItemText disableTypography>
                <Typography variant="body2" fontSize="16px">
                  <Trans i18nKey={item} t={(s: string) => s} />
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>

        {isIOEnabled ? (
          <>
            <Button
              variant="outlined"
              onClick={handleConfirmIODeactivation}
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              data-testid="disableIOButton"
            >
              {t('legal-contacts.sercq-send-wizard.step_2.disable', { ns: 'recapiti' })}
            </Button>
            <ButtonNaked
              sx={{ fontSize: '16px' }}
              onClick={goToNextStep}
              color="primary"
              fullWidth
              data-testid="skipButton"
            >
              {t('button.continue', { ns: 'common' })}
            </ButtonNaked>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              onClick={handleConfirmIOActivation}
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
              data-testid="confirmButton"
            >
              {t('legal-contacts.sercq-send-wizard.step_2.confirm', { ns: 'recapiti' })}
            </Button>
            <ButtonNaked
              sx={{ fontSize: '16px' }}
              onClick={handleSkip}
              color="primary"
              fullWidth
              data-testid="skipButton"
            >
              {t('legal-contacts.sercq-send-wizard.step_2.skip-io', { ns: 'recapiti' })}
            </ButtonNaked>
          </>
        )}
      </Stack>
      <ConfirmationModal
        open={modal.open}
        title={t('courtesy-contacts.confirmation-modal-title', { ns: 'recapiti' })}
        slots={{
          confirmButton: Button,
          closeButton: Button,
        }}
        slotsProps={
          isIOEnabled
            ? {
                closeButton: {
                  onClick: handleIODeactivation,
                  children: t(`legal-contacts.sercq-send-wizard.step_2.disable`, {
                    ns: 'recapiti',
                  }),
                },
                confirmButton: {
                  onClick: handleConfirmationModalDecline,
                  children: t(`button.annulla`, { ns: 'common' }),
                },
              }
            : {
                closeButton: {
                  onClick: handleConfirmationModalDecline,
                  children: t('button.do-later', { ns: 'common' }),
                },
                confirmButton: {
                  onClick: handleConfirmIOActivation,
                  children: t(`courtesy-contacts.confirmation-modal-io-accept`, { ns: 'recapiti' }),
                },
              }
        }
      >
        <Trans ns="recapiti" i18nKey={`courtesy-contacts.confirmation-modal-io-content`} />
      </ConfirmationModal>
    </>
  );
};

export default IOContactWizard;
