import _ from 'lodash';
import { FC, ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Box, Button, DialogContentText, DialogTitle, Typography } from '@mui/material';
import {
  AppResponse,
  AppResponsePublisher,
  CodeModal,
  DisclaimerModal,
  ErrorMessage,
  PnDialog,
  PnDialogActions,
  PnDialogContent,
  appStateActions,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import {
  createOrUpdateCourtesyAddress,
  createOrUpdateLegalAddress,
} from '../../redux/contact/actions';
import { SaveDigitalAddressParams } from '../../redux/contact/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';

type ModalProps = {
  labelRoot: string;
  labelType: string;
  recipientId: string;
  senderId: string;
  senderName?: string;
  digitalDomicileType: LegalChannelType | CourtesyChannelType;
  value: string;
  callbackOnValidation?: (status: 'validated' | 'cancelled') => void;
};

interface IDigitalContactsCodeVerificationContext {
  initValidation: (
    digitalDomicileType: LegalChannelType | CourtesyChannelType,
    value: string,
    recipientId: string,
    senderId: string,
    senderName?: string,
    callbackOnValidation?: (status: 'validated' | 'cancelled') => void,
    isSpecialContact?: boolean
  ) => void;
}

const DigitalContactsCodeVerificationContext = createContext<
  IDigitalContactsCodeVerificationContext | undefined
>(undefined);

const DigitalContactsCodeVerificationProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const digitalAddresses = useAppSelector(
    (state: RootState) => state.contactsState.digitalAddresses
  );
  const addresses = digitalAddresses
    ? digitalAddresses.legal.concat(digitalAddresses.courtesy)
    : [];
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>();

  const initialProps = {
    labelRoot: '',
    labelType: '',
    recipientId: '',
    senderId: '',
    digitalDomicileType: LegalChannelType.PEC,
    value: '',
  } as ModalProps;

  const [open, setOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [pecValidationOpen, setPecValidationOpen] = useState(false);
  const [codeNotValid, setCodeNotValid] = useState(false);
  const dispatch = useAppDispatch();
  const [modalProps, setModalProps] = useState(initialProps);

  const handleClose = (status: 'validated' | 'cancelled' = 'cancelled') => {
    setCodeNotValid(false);
    setOpen(false);
    setModalProps(initialProps);
    if (modalProps.callbackOnValidation) {
      modalProps.callbackOnValidation(status);
    }
  };

  const handleConfirm = () => {
    setIsConfirmationModalVisible(false);
    handleDisclaimerVisibilityFirst();
  };

  const handleDiscard = () => {
    setIsConfirmationModalVisible(false);
  };

  const contactAlreadyExists = (): boolean =>
    !!addresses.find(
      (elem) =>
        elem.value !== '' &&
        elem.value === modalProps.value &&
        (elem.senderId !== modalProps.senderId ||
          elem.channelType !== modalProps.digitalDomicileType)
    );

  const sendSuccessEvent = (type: LegalChannelType | CourtesyChannelType) => {
    if (type === LegalChannelType.PEC) {
      PFEventStrategyFactory.triggerEvent(
        PFEventsType.SEND_ADD_PEC_UX_SUCCESS,
        modalProps.senderId
      );
      return;
    }
    PFEventStrategyFactory.triggerEvent(
      type === CourtesyChannelType.SMS
        ? PFEventsType.SEND_ADD_SMS_UX_SUCCESS
        : PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS,
      modalProps.senderId
    );
  };
  const handleCodeVerification = (verificationCode?: string, noCallback: boolean = false) => {
    /* eslint-disable functional/no-let */
    let actionToBeDispatched;
    if (modalProps.digitalDomicileType === LegalChannelType.PEC) {
      actionToBeDispatched = createOrUpdateLegalAddress;
    } else {
      actionToBeDispatched = createOrUpdateCourtesyAddress;
    }
    if (verificationCode) {
      if (modalProps.digitalDomicileType === LegalChannelType.PEC) {
        PFEventStrategyFactory.triggerEvent(
          PFEventsType.SEND_ADD_PEC_UX_CONVERSION,
          modalProps.senderId
        );
      } else if (modalProps.digitalDomicileType === CourtesyChannelType.SMS) {
        PFEventStrategyFactory.triggerEvent(
          PFEventsType.SEND_ADD_SMS_UX_CONVERSION,
          modalProps.senderId
        );
      } else if (modalProps.digitalDomicileType === CourtesyChannelType.EMAIL) {
        PFEventStrategyFactory.triggerEvent(
          PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION,
          modalProps.senderId
        );
      }
    }
    if (!actionToBeDispatched) {
      return;
    }
    const digitalAddressParams: SaveDigitalAddressParams = {
      recipientId: modalProps.recipientId,
      senderId: modalProps.senderId,
      senderName: modalProps.senderName,
      channelType: modalProps.digitalDomicileType,
      value: modalProps.value,
      code: verificationCode,
    };

    void dispatch(actionToBeDispatched(digitalAddressParams))
      .unwrap()
      .then((res) => {
        if (noCallback) {
          return;
        }
        // contact to verify
        // open code modal
        if (!res) {
          setOpen(true);
          return;
        }

        sendSuccessEvent(modalProps.digitalDomicileType);

        // contact has already been verified
        if (res.pecValid || modalProps.digitalDomicileType !== LegalChannelType.PEC) {
          // show success message
          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t(`${modalProps.labelRoot}.${modalProps.labelType}-added-successfully`, {
                ns: 'recapiti',
              }),
            })
          );
          handleClose('validated');
          return;
        }
        // contact must be validated
        // open validation modal
        handleClose('validated');
        setPecValidationOpen(true);
      });
  };

  const initValidation = (
    digitalDomicileType: LegalChannelType | CourtesyChannelType,
    value: string,
    recipientId: string,
    senderId: string,
    senderName?: string,
    callbackOnValidation?: (status: 'validated' | 'cancelled') => void
  ) => {
    /* eslint-disable functional/no-let */
    let labelRoot = '';
    let labelType = '';
    /* eslint-enable functional/no-let */
    if (digitalDomicileType === LegalChannelType.PEC) {
      labelRoot = 'legal-contacts';
      labelType = 'pec';
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_START, senderId);
    } else {
      labelRoot = 'courtesy-contacts';
      labelType = digitalDomicileType === CourtesyChannelType.SMS ? 'phone' : 'email';
      PFEventStrategyFactory.triggerEvent(
        digitalDomicileType === CourtesyChannelType.SMS
          ? PFEventsType.SEND_ADD_SMS_START
          : PFEventsType.SEND_ADD_EMAIL_START,
        senderId
      );
    }
    setModalProps({
      labelRoot,
      labelType,
      recipientId,
      senderId,
      senderName,
      digitalDomicileType,
      value,
      callbackOnValidation,
    });
  };

  useEffect(() => {
    if (!_.isEqual(modalProps, initialProps) && !contactAlreadyExists()) {
      handleDisclaimerVisibilityFirst();
    } else if (contactAlreadyExists()) {
      setIsConfirmationModalVisible(true);
    }
  }, [modalProps]);

  const handleDisclaimerVisibilityFirst = () => {
    // if senderId !== 'default' they are a special contact => don't show disclaimer
    // if modalProps.digitalDomicileType === LegalChannelType.PEC it's a legal contact => don't show disclaimer
    // if modalProps.digitalDomicileType !== LegalChannelType.PEC and senderId === 'default' it's a
    // courtesy contact => show disclaimer
    if (
      modalProps.digitalDomicileType === LegalChannelType.PEC ||
      modalProps.senderId !== 'default'
    ) {
      // open verification code dialog
      handleCodeVerification();
    } else {
      // open disclaimer dialog
      setDisclaimerOpen(true);
    }
  };

  const handleAddressUpdateError = useCallback(
    (responseError: AppResponse) => {
      if (!open) {
        // notify the publisher we are not handling the error
        return true;
      }
      if (Array.isArray(responseError.errors)) {
        const error = responseError.errors[0];
        setErrorMessage({
          title: error.message.title,
          content: error.message.content,
        });
        setCodeNotValid(true);
        if (modalProps.digitalDomicileType === LegalChannelType.PEC) {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_CODE_ERROR);
        } else if (modalProps.digitalDomicileType === CourtesyChannelType.SMS) {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_CODE_ERROR);
        } else if (modalProps.digitalDomicileType === CourtesyChannelType.EMAIL) {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_CODE_ERROR);
        }
      }
      return false;
    },
    [open]
  );

  useEffect(() => {
    AppResponsePublisher.error.subscribe('createOrUpdateLegalAddress', handleAddressUpdateError);
    AppResponsePublisher.error.subscribe('createOrUpdateCourtesyAddress', handleAddressUpdateError);

    return () => {
      AppResponsePublisher.error.unsubscribe(
        'createOrUpdateLegalAddress',
        handleAddressUpdateError
      );
      AppResponsePublisher.error.unsubscribe(
        'createOrUpdateCourtesyAddress',
        handleAddressUpdateError
      );
    };
  }, [handleAddressUpdateError]);

  return (
    <DigitalContactsCodeVerificationContext.Provider value={{ initValidation }}>
      {children}
      {disclaimerOpen && (
        <DisclaimerModal
          onConfirm={() => {
            setDisclaimerOpen(false);
            handleCodeVerification();
            setOpen(true);
          }}
          onCancel={() => setDisclaimerOpen(false)}
          confirmLabel={t('button.conferma')}
          checkboxLabel={t('button.capito')}
          content={t(`alert-dialog-${modalProps.digitalDomicileType}`, { ns: 'recapiti' })}
        />
      )}
      {!_.isEqual(modalProps, initialProps) && (
        <CodeModal
          title={
            t(`${modalProps.labelRoot}.${modalProps.labelType}-verify`, { ns: 'recapiti' }) +
            ` ${modalProps.value}`
          }
          subtitle={
            <Trans
              i18nKey={`${modalProps.labelRoot}.${modalProps.labelType}-verify-descr`}
              ns="recapiti"
            />
          }
          open={open}
          initialValues={new Array(5).fill('')}
          codeSectionTitle={t(`${modalProps.labelRoot}.insert-code`, { ns: 'recapiti' })}
          codeSectionAdditional={
            <>
              <Typography variant="body2" display="inline">
                {t(`${modalProps.labelRoot}.${modalProps.labelType}-new-code`, { ns: 'recapiti' })}
                &nbsp;
              </Typography>
              <ButtonNaked
                component={Box}
                onClick={() => handleCodeVerification(undefined, true)}
                sx={{ verticalAlign: 'unset', display: 'inline' }}
              >
                <Typography
                  display="inline"
                  color="primary"
                  variant="body2"
                  sx={{ textDecoration: 'underline' }}
                >
                  {t(`${modalProps.labelRoot}.new-code-link`, { ns: 'recapiti' })}.
                </Typography>
              </ButtonNaked>
            </>
          }
          cancelLabel={t('button.annulla')}
          confirmLabel={t('button.conferma')}
          cancelCallback={() => handleClose('cancelled')}
          confirmCallback={(values: Array<string>) => handleCodeVerification(values.join(''))}
          hasError={codeNotValid}
          errorTitle={errorMessage?.title}
          errorMessage={errorMessage?.content}
        />
      )}
      <PnDialog
        open={isConfirmationModalVisible}
        onClose={handleDiscard}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        data-testid="duplicateDialog"
      >
        <DialogTitle id="dialog-title">
          {t(`common.duplicate-contact-title`, { value: modalProps.value, ns: 'recapiti' })}
        </DialogTitle>
        <PnDialogContent>
          <DialogContentText id="dialog-description">
            {t(`common.duplicate-contact-descr`, { value: modalProps.value, ns: 'recapiti' })}
          </DialogContentText>
        </PnDialogContent>
        <PnDialogActions>
          <Button onClick={handleDiscard} variant="outlined">
            {t('button.annulla')}
          </Button>
          <Button onClick={handleConfirm} variant="contained">
            {t('button.conferma')}
          </Button>
        </PnDialogActions>
      </PnDialog>
      <PnDialog
        open={pecValidationOpen}
        data-testid="validationDialog"
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">
          {t('legal-contacts.validation-progress-title', { ns: 'recapiti' })}
        </DialogTitle>
        <PnDialogContent>
          <DialogContentText>
            {t('legal-contacts.validation-progress-content', { ns: 'recapiti' })}
          </DialogContentText>
        </PnDialogContent>
        <PnDialogActions>
          <Button
            id="confirmDialog"
            onClick={() => setPecValidationOpen(false)}
            variant="contained"
          >
            {t('button.conferma')}
          </Button>
        </PnDialogActions>
      </PnDialog>
    </DigitalContactsCodeVerificationContext.Provider>
  );
};

const useDigitalContactsCodeVerificationContext = () => {
  const context = useContext(DigitalContactsCodeVerificationContext);
  if (context === undefined) {
    throw new Error(
      'useDigitalContactsCodeVerificationContext must be used within a DigitalContactsCodeVerificationProvider'
    );
  }
  return context;
};

export { DigitalContactsCodeVerificationProvider, useDigitalContactsCodeVerificationContext };
