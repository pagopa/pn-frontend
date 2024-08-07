import _ from 'lodash';
import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
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

import { AddressType, ChannelType } from '../../models/contacts';
import { createOrUpdateAddress } from '../../redux/contact/actions';
import { SaveDigitalAddressParams } from '../../redux/contact/types';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

type ModalProps = {
  labelRoot: string;
  labelType: string;
  senderId: string;
  senderName?: string;
  digitalDomicileType: ChannelType;
  value: string;
  callbackOnValidation?: (status: 'validated' | 'cancelled') => void;
};

interface IDigitalContactsCodeVerificationContext {
  initValidation: (
    digitalDomicileType: ChannelType,
    value: string,
    senderId: string,
    senderName?: string,
    callbackOnValidation?: (status: 'validated' | 'cancelled') => void
  ) => void;
}

const DigitalContactsCodeVerificationContext = createContext<
  IDigitalContactsCodeVerificationContext | undefined
>(undefined);

const DigitalContactsCodeVerificationProvider: FC<{ children?: ReactNode }> = ({ children }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const digitalAddresses =
    useAppSelector((state: RootState) => state.contactsState.digitalAddresses) ?? [];
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  const initialProps = {
    labelRoot: '',
    labelType: '',
    recipientId: '',
    senderId: '',
    digitalDomicileType: ChannelType.PEC,
    value: '',
  } as ModalProps;

  const [open, setOpen] = useState(false);
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [pecValidationOpen, setPecValidationOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [modalProps, setModalProps] = useState(initialProps);
  const codeModalRef =
    useRef<{ updateError: (error: ErrorMessage, codeNotValid: boolean) => void }>(null);

  const handleClose = (status: 'validated' | 'cancelled' = 'cancelled') => {
    codeModalRef.current?.updateError({ title: '', content: '' }, false);
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
    !!digitalAddresses.find(
      (elem) =>
        elem.value !== '' &&
        elem.value === modalProps.value &&
        (elem.senderId !== modalProps.senderId ||
          elem.channelType !== modalProps.digitalDomicileType)
    );

  const handleCodeVerification = (verificationCode?: string, noCallback: boolean = false) => {
    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType:
        modalProps.digitalDomicileType === ChannelType.PEC
          ? AddressType.LEGAL
          : AddressType.COURTESY,
      senderId: modalProps.senderId,
      senderName: modalProps.senderName,
      channelType: modalProps.digitalDomicileType,
      value: modalProps.value,
      code: verificationCode,
    };

    void dispatch(createOrUpdateAddress(digitalAddressParams))
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
        // contact has already been verified
        if (res.pecValid || modalProps.digitalDomicileType !== ChannelType.PEC) {
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
    digitalDomicileType: ChannelType,
    value: string,
    senderId: string,
    senderName?: string,
    callbackOnValidation?: (status: 'validated' | 'cancelled') => void
  ) => {
    /* eslint-disable functional/no-let */
    let labelRoot = '';
    let labelType = '';
    /* eslint-enable functional/no-let */
    if (digitalDomicileType === ChannelType.PEC) {
      labelRoot = 'legal-contacts';
      labelType = 'pec';
    } else {
      labelRoot = 'courtesy-contacts';
      labelType = digitalDomicileType === ChannelType.SMS ? 'sms' : 'email';
    }
    setModalProps({
      labelRoot,
      labelType,
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
    // if modalProps.digitalDomicileType === ChannelType.PEC it's a legal contact => don't show disclaimer
    // if modalProps.digitalDomicileType !== ChannelType.PEC and senderId === 'default' it's a
    // courtesy contact => show disclaimer
    if (modalProps.digitalDomicileType === ChannelType.PEC || modalProps.senderId !== 'default') {
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
        codeModalRef.current?.updateError(
          {
            title: error.message.title,
            content: error.message.content,
          },
          true
        );
      }
      return false;
    },
    [open]
  );

  useEffect(() => {
    AppResponsePublisher.error.subscribe('createOrUpdateAddress', handleAddressUpdateError);

    return () => {
      AppResponsePublisher.error.unsubscribe('createOrUpdateAddress', handleAddressUpdateError);
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
          ref={codeModalRef}
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
      <PnDialog open={pecValidationOpen} data-testid="validationDialog">
        <DialogTitle id="dialog-title">
          {t('legal-contacts.validation-progress-title', { ns: 'recapiti' })}
        </DialogTitle>
        <PnDialogContent>
          <DialogContentText>
            {t('legal-contacts.validation-progress-content', { ns: 'recapiti' })}
          </DialogContentText>
        </PnDialogContent>
        <PnDialogActions>
          <Button onClick={() => setPecValidationOpen(false)} variant="contained">
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
