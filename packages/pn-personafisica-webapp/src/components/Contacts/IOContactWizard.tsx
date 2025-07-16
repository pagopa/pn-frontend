import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { Avatar, Button, List, ListItem, ListItemText, Stack, Typography } from '@mui/material';
import {
  ConfirmationModal,
  IllusAppIoLogo,
  IllusSendLogo,
  appStateActions,
  useIsMobile,
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
  const isMobile = useIsMobile('sm');

  const isIOEnabled = useMemo(
    () => defaultAPPIOAddress && defaultAPPIOAddress.value === IOAllowedValues.ENABLED,
    []
  );

  const sercqSendIoList: Array<string> = t('legal-contacts.sercq-send-wizard.step_2.io-list', {
    defaultValue: [],
    ns: 'recapiti',
  });

  const handleConfirmIOActivation = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ACTIVE_IO_UX_CONVERSION);
    dispatch(enableIOAddress())
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_CONNECT_IO_SUCCESS);
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('courtesy-contacts.io-added-successfully'),
          })
        );
        goToNextStep();
        setModal({ open: false });
      })
      .catch(() => {});
  };

  const handleConfirmIODeactivation = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_REMOVE_IO);
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO);
    setModal({ open: true });
  };

  const handleIODeactivation = () => {
    PFEventStrategyFactory.triggerEvent(
      PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO_CONFIRM
    );
    dispatch(disableIOAddress())
      .unwrap()
      .then(() => {
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t('courtesy-contacts.io-removed-successfully'),
          })
        );
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_REMOVE_IO_SUCCESS);
        goToNextStep();
        setModal({ open: false });
      })
      .catch(() => {});
  };

  const handleConfirmationModalDecline = () => {
    if (isIOEnabled) {
      PFEventStrategyFactory.triggerEvent(
        PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_REMOVE_APP_IO_BACK
      );
    } else {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_APP_IO_DECLINED);
    }
    goToNextStep();
    setModal({ open: false });
  };

  const handleActivateIOFromModal = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_APP_IO_CONNECT);
    handleConfirmIOActivation();
  };

  const handleSkip = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_CONTINUE_WITHOUT_IO);
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_POP_UP_APP_IO);
    setModal({ open: true });
  };

  const handleGoToNextStep = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_APP_IO_NEXT_STEP);
    goToNextStep();
  };

  useEffect(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_APP_IO);
  }, []);

  return (
    <>
      <Stack useFlexGap spacing={2} data-testid="ioContactWizard">
        <Typography fontSize="22px" fontWeight={700}>
          {t('legal-contacts.sercq-send-wizard.step_2.title')}
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
          {t('legal-contacts.sercq-send-wizard.step_2.content')}
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
              {t('legal-contacts.sercq-send-wizard.step_2.disable')}
            </Button>
            <ButtonNaked
              sx={{ fontSize: '16px' }}
              onClick={handleGoToNextStep}
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
              {t('legal-contacts.sercq-send-wizard.step_2.confirm')}
            </Button>
            <ButtonNaked
              sx={{ fontSize: '16px' }}
              onClick={handleSkip}
              color="primary"
              fullWidth
              data-testid="skipButton"
            >
              {t('legal-contacts.sercq-send-wizard.step_2.skip-io')}
            </ButtonNaked>
          </>
        )}
      </Stack>
      <ConfirmationModal
        open={modal.open}
        title={t('courtesy-contacts.confirmation-modal-title')}
        slots={{
          confirmButton: Button,
          closeButton: Button,
        }}
        slotsProps={
          isIOEnabled
            ? {
                closeButton: {
                  onClick: handleConfirmationModalDecline,
                  children: t(`button.annulla`, { ns: 'common' }),
                  variant: 'contained',
                },
                confirmButton: {
                  onClick: handleIODeactivation,
                  children: t(`legal-contacts.sercq-send-wizard.step_2.disable`),
                  variant: 'outlined',
                  sx: { marginBottom: 0 },
                },
                actions: {
                  sx: {
                    flexDirection: isMobile ? 'column' : 'row-reverse',
                    justifyContent: isMobile ? 'center' : 'flex-start',
                    p: isMobile ? 3 : 4,
                    pt: 0,
                    gap: 1,
                  },
                },
              }
            : {
                closeButton: {
                  onClick: handleConfirmationModalDecline,
                  children: t('button.do-later', { ns: 'common' }),
                },
                confirmButton: {
                  onClick: handleActivateIOFromModal,
                  children: t(`courtesy-contacts.confirmation-modal-io-accept`),
                },
              }
        }
      >
        <Trans
          ns="recapiti"
          i18nKey={
            isIOEnabled
              ? `courtesy-contacts.confirmation-modal-disable-io-content`
              : `courtesy-contacts.confirmation-modal-io-content`
          }
        />
      </ConfirmationModal>
    </>
  );
};

export default IOContactWizard;
