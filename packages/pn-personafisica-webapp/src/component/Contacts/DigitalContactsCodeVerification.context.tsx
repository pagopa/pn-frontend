import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import _ from 'lodash';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';

import {
  appStateActions,
  CodeModal,
  AppResponsePublisher,
  AppResponse,
  ErrorMessage,
  DisclaimerModal,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { RootState } from '../../redux/store';
import {
  createOrUpdateCourtesyAddress,
  createOrUpdateLegalAddress,
} from '../../redux/contact/actions';
import { trackEventByType } from '../../utils/mixpanel';
import { EventActions, TrackEventType } from '../../utils/events';
import { getContactEventType } from '../../utils/contacts.utility';
import { SaveDigitalAddressParams } from '../../redux/contact/types';

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
    callbackOnValidation?: (status: 'validated' | 'cancelled') => void
  ) => void;
}

const DigitalContactsCodeVerificationContext = createContext<
  IDigitalContactsCodeVerificationContext | undefined
>(undefined);

const DigitalContactsCodeVerificationProvider: FC<ReactNode> = ({ children }) => {
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
        elem.value === modalProps.value &&
        (elem.senderId !== modalProps.senderId ||
          elem.channelType !== modalProps.digitalDomicileType)
    );

  const handleCodeVerification = (verificationCode?: string, noCallback: boolean = false) => {
    /* eslint-disable functional/no-let */
    let actionToBeDispatched;
    let eventTypeByChannel;
    /* eslint-enable functional/no-let */
    if (modalProps.digitalDomicileType === LegalChannelType.PEC) {
      actionToBeDispatched = createOrUpdateLegalAddress;
      eventTypeByChannel = TrackEventType.CONTACT_LEGAL_CONTACT;
    } else {
      actionToBeDispatched = createOrUpdateCourtesyAddress;
      eventTypeByChannel = getContactEventType(modalProps.digitalDomicileType);
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

    trackEventByType(eventTypeByChannel, { action: EventActions.ADD });
    void dispatch(actionToBeDispatched(digitalAddressParams))
      .unwrap()
      .then((res) => {
        if (noCallback) {
          return;
        }

        if (res && res.pecValid) {
          // contact has already been verified
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
        }
        if (res && !res.pecValid) {
          handleClose('validated');
          setPecValidationOpen(true);
        } else {
          setOpen(true);
        }
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
    } else {
      labelRoot = 'courtesy-contacts';
      labelType = digitalDomicileType === CourtesyChannelType.SMS ? 'phone' : 'email';
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
          handleClose={() => handleClose()}
          codeSectionTitle={t(`${modalProps.labelRoot}.insert-code`, { ns: 'recapiti' })}
          codeSectionAdditional={
            <Box>
              <Typography variant="body2" display="inline">
                {t(`${modalProps.labelRoot}.${modalProps.labelType}-new-code`, { ns: 'recapiti' })}
                &nbsp;
              </Typography>
              <ButtonNaked
                onClick={() => handleCodeVerification(undefined, true)}
                sx={{verticalAlign: 'unset'}}
              >
                <Typography color="primary">
                  {t(`${modalProps.labelRoot}.new-code-link`, { ns: 'recapiti' })}.
                </Typography>
              </ButtonNaked>
            </Box>
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
      <Dialog
        open={isConfirmationModalVisible}
        onClose={handleDiscard}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">
          {t(`common.duplicate-contact-title`, { value: modalProps.value, ns: 'recapiti' })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {t(`common.duplicate-contact-descr`, { value: modalProps.value, ns: 'recapiti' })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscard} variant="outlined">
            {t('button.annulla')}
          </Button>
          <Button onClick={handleConfirm} variant="contained">
            {t('button.conferma')}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={pecValidationOpen}>
        <DialogTitle id="dialog-title" sx={{ pt: 4, px: 4 }}>
          {t('legal-contacts.validation-progress-title', { ns: 'recapiti' })}
        </DialogTitle>
        <DialogContent sx={{ px: 4 }}>
          {t('legal-contacts.validation-progress-content', { ns: 'recapiti' })}
        </DialogContent>
        <DialogActions sx={{ pb: 4, px: 4 }}>
          <Button onClick={() => setPecValidationOpen(false)} variant="contained">
            {t('button.conferma')}
          </Button>
        </DialogActions>
      </Dialog>
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
